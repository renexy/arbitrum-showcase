import * as React from 'react';
import Box from '@mui/material/Box';
import { Alert, Breadcrumbs, Button, Checkbox, FormControlLabel, IconButton, InputAdornment, InputLabel, List, ListItem, ListItemText, MenuItem, Paper, Select, Snackbar, Step, StepButton, Stepper, TextField, Tooltip, Typography, styled } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { blueGrey } from '@mui/material/colors';
import BaseDialog from '../baseDialog/baseDialog';
import { useState, useEffect } from 'react'
import GlobalContext from '../../hooks/context/ContextAggregator';
import { CreateProfileArgs } from '@allo-team/allo-v2-sdk/dist/Registry/types';
import InfoIcon from '@mui/icons-material/Info';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Link from '@mui/material/Link';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { ethers } from 'ethers'
import {
  getWalletClient,
  sendTransaction,
  waitForTransaction,
} from "@wagmi/core";
import { StrategyType } from "@allo-team/allo-v2-sdk/dist/strategies/MicroGrantsStrategy/types";
import { useAccount, useNetwork, WagmiConfig  } from 'wagmi';
import { CreatePoolArgs } from '@allo-team/allo-v2-sdk/dist/Allo/types';
import { getIPFSClient } from '@/services/ipfs';
import {
  TNewPool,
  TPoolData,
  TProfilesByOwnerResponse,
  TStrategyType,
} from "@/types/typesPool";
import { wagmiConfig } from '@/wagmiConfig';
import { abi } from "@/utils/erc20.abi";
import { encodeFunctionData } from 'viem';
import { NATIVE, dateStringToSeconds, ethToWeiBigInt } from '@/global/functions';
import { TransactionData } from '@allo-team/allo-v2-sdk/dist/Common/types';

const steps = ['Basic info', 'Wallet info', 'Dates & more'];

const delay = (ms: number) => {
  return new Promise<void>((resolve) => {
      setTimeout(() => {
          resolve();
      }, ms);
  });
};//

export default function CreatePool({ changeCreatePool }: any) {
    const [dialogOpen, setDialogOpen] = useState<boolean>(false)
    const [items, setItems] = useState<Array<{ label: string; working: boolean; done: boolean; failed: boolean }>>([]);
    const [createDisabled, setCreateDisabled] = useState(false)
    const [createPoolTransactionStatus, setCreatePoolTransactionStatus] =
        useState<'confirm' | 'signature' | 'transaction' | 'succeeded' | 'failed'>('confirm')
    // form
    const [strategyType, setStrategyType] = useState(StrategyType.MicroGrants)
    const [poolName, setPoolName] = useState<string>('')
    const [website, setWebsite] = useState<string>('')
    const [description, setDescription] = useState<string>('')
    const [poolTokenAddress, setPoolTokenAddress] = useState<string>('')
    const [fundPoolAmount, setFundPoolAmount] = useState<string>('')
    const [maxGrantAmount, setMaxGrantAmount] = useState<string>('')
    const [approvalThreshold, setApprovalThreshold] = useState<number>(1)
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [stateRegistryMandatory, setStateRegistryMandatory] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [selectedFile64, setSelectedFile64] = useState<string | null>(null);
    const [managers, setManagers] = useState<string[]>([])
    const [singleManager, setSingleManager] = useState('')
    const [activeStep, setActiveStep] = React.useState(0);
    const [completed, setCompleted] = React.useState<{
        [k: number]: boolean;
    }>({});

  const { allo, selectedProfileHash, microStrategy, signer } = React.useContext(GlobalContext);
  const ipfsClient = getIPFSClient();
  const { chain } = useNetwork();
  const { address } = useAccount();

  useEffect(() => {
      if (poolName && website && description && fundPoolAmount && maxGrantAmount && startDate && endDate && selectedFile) {
          setCreateDisabled(false)
      } else {
          setCreateDisabled(true)
      }
  }, [strategyType, poolName, website, description, fundPoolAmount, maxGrantAmount, startDate, endDate, selectedFile])

  const handleStep = (step: number) => () => {
      setActiveStep(step);
  };

  const handleFileChange = (event: any) => {
    const file = event.target.files[0];
    if (file && (file.type === 'image/png' || file.type === 'image/jpeg')) {
        const reader = new FileReader();
        reader.onloadend = function() {
          if (reader.result) {
            const base64String = reader.result.toString();
            if (base64String.includes("base64")) {
              setSelectedFile64(base64String);
            }
          }
          setSelectedFile(file);
        };
        reader.readAsDataURL(file);
    } else {
        alert('Please select a PNG or JPG file.');
    }
  };

  const handleApprovalThresholdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseFloat(e.target.value);
      if (!isNaN(value)) {
          setApprovalThreshold(value);
      }
  };

  const handleCreatePool = async () => {
    
    if(!microStrategy) {
      console.log("MicroStrategy not initialized");
      return;
    }

    if (!allo) {
      console.log("Allo not initialized");
      return;
    }

    const walletClient = await getWalletClient({ chainId: chain?.id });

    const steps = [
      {
          label: 'Uploading to IPFS',
          working: false,
          done: false,
          failed: false
      },
      {
          label: 'Deploying contract',
          working: false,
          done: false,
          failed: false
      },
      {
          label: 'Creating pool',
          working: false,
          done: false,
          failed: false
      }
    ];

    let IPFSPointer;
    let StrategyAddress;

    setItems(steps)

    setItems(prevItems => {
      const updatedItems = [...prevItems];
      updatedItems[0].working = false;
      updatedItems[0].done = false;
      return updatedItems;
    });

    // Upload metadata to IPFS
    try {
      setItems(prevItems => {
        const updatedItems = [...prevItems];
        updatedItems[0].working = true;
        updatedItems[0].done = false;
        return updatedItems;
      });

      const metadata = {
        profileId: selectedProfileHash,
        name: poolName,
        website: website,
        description: description,
        base64Image: selectedFile64,
      };

      let imagePointer;
      let pointer;

      if (metadata.base64Image && metadata.base64Image.includes("base64")) {
        imagePointer = await ipfsClient.pinJSON({
          data: metadata.base64Image,
        });
        metadata.base64Image = imagePointer.IpfsHash;
      }

      pointer = await ipfsClient.pinJSON(metadata);
      IPFSPointer = pointer.IpfsHash;

      setItems(prevItems => {
        const updatedItems = [...prevItems];
        updatedItems[0].working = false;
        updatedItems[0].done = true;
        updatedItems[0].failed = false;
        return updatedItems;
      });

    } catch (error) {
      setItems(prevItems => {
        const updatedItems = [...prevItems];
        updatedItems[0].working = false;
        updatedItems[0].done = true;
        updatedItems[0].failed = true;
        return updatedItems;
      });
      console.log("Error uploading Metadata to IPFS: ", error)
    }

    // Deploy new strategy contract
    setItems(prevItems => {
      const updatedItems = [...prevItems];
      updatedItems[1].working = false;
      updatedItems[1].done = false;
      return updatedItems;
    });

    try {
      const strategyDeployParams = microStrategy.getDeployParams("MicroGrantsv1");

      const hash = await walletClient!.deployContract({
        abi: strategyDeployParams.abi,
        bytecode: strategyDeployParams.bytecode as `0x${string}`,
        args: [],
        gas: BigInt(5000000)
      });

      setItems(prevItems => {
        const updatedItems = [...prevItems];
        updatedItems[1].working = true;
        updatedItems[1].done = false;
        return updatedItems;
      });

      console.log(hash)
      console.log(chain?.id)

      const result = await wagmiConfig.publicClient.waitForTransactionReceipt({
        hash: hash,
        confirmations: 2,
      });
      console.log("result", result)
      StrategyAddress = result.contractAddress!;

      if (poolTokenAddress) {
        try {
          const allowance = await wagmiConfig.publicClient.readContract({
            address: poolTokenAddress as `0x${string}`,
            abi: abi,
            functionName: "allowance",
            args: [address, allo.address()],
          });

          if ((allowance as bigint) <= ethToWeiBigInt(fundPoolAmount)) {
            const approvalAmount =
              ethToWeiBigInt(fundPoolAmount) - (allowance as bigint);
    
            const approveData = encodeFunctionData({
              abi: abi,
              functionName: "approve",
              args: [allo.address(), approvalAmount],
            });
    
            try {
              const tx = await sendTransaction({
                to: poolTokenAddress,
                data: approveData,
                value: BigInt(0),
              });
    
              const receipt = await wagmiConfig.publicClient.waitForTransactionReceipt({
                hash: tx.hash,
                confirmations: 2,
              });

              setItems(prevItems => {
                const updatedItems = [...prevItems];
                updatedItems[1].working = false;
                updatedItems[1].done = true;
                updatedItems[1].failed = false;
                return updatedItems;
              });
    
            } catch (error) {
              setItems(prevItems => {
                const updatedItems = [...prevItems];
                updatedItems[1].working = false;
                updatedItems[1].done = true;
                updatedItems[1].failed = true;
                return updatedItems;
              });
              console.log("Failed Approving Token: ", error);
            }
          } else {
            console.log("Token already approved");
            setItems(prevItems => {
              const updatedItems = [...prevItems];
              updatedItems[1].working = false;
              updatedItems[1].done = true;
              updatedItems[1].failed = false;
              return updatedItems;
            });
          }

        } catch (error) {
          setItems(prevItems => {
            const updatedItems = [...prevItems];
            updatedItems[1].working = false;
            updatedItems[1].done = true;
            updatedItems[1].failed = true;
            return updatedItems;
          });
          console.log("Failed Approving Token: ", error)
        }
      }

      setItems(prevItems => {
        const updatedItems = [...prevItems];
        updatedItems[1].working = false;
        updatedItems[1].done = true;
        updatedItems[1].failed = false;
        return updatedItems;
      });

    } catch (error) {
      setItems(prevItems => {
        const updatedItems = [...prevItems];
        updatedItems[1].working = false;
        updatedItems[1].done = true;
        updatedItems[1].failed = true;
        return updatedItems;
      });
      console.log("Error deploying strategy contract: ", error)
    }

    // Create pool
    setItems(prevItems => {
      const updatedItems = [...prevItems];
      updatedItems[2].working = false;
      updatedItems[2].done = false;
      return updatedItems;
    });

    try {
      const initParams: any = {
        useRegistryAnchor: stateRegistryMandatory,
        allocationStartTime: BigInt(dateStringToSeconds(startDate)),
        allocationEndTime: BigInt(dateStringToSeconds(endDate)),
        approvalThreshold: BigInt(approvalThreshold),
        maxRequestedAmount: BigInt(ethToWeiBigInt(maxGrantAmount)),
      };

      const initStrategyData = await microStrategy?.getInitializeData(initParams)

      const createPoolArgs: CreatePoolArgs = {
        profileId: selectedProfileHash!, // sender must be a profile member 
        strategy: StrategyAddress, // approved strategy contract
        initStrategyData: initStrategyData || '', // unique to the strategy
        token: poolTokenAddress || NATIVE,
        amount: ethToWeiBigInt(fundPoolAmount),
        metadata: {
          protocol: BigInt(1),
          pointer: IPFSPointer,
        },
        managers: managers,
      };

      const txData: TransactionData = allo.createPoolWithCustomStrategy(createPoolArgs);

      const hash = await sendTransaction({
        data: txData.data,
        to: txData.to,
        value: BigInt(txData.value),
      });

      const result = await waitForTransaction({ hash: hash.hash, chainId: chain?.id });
      console.log("transaction succeeded", result)

      setItems(prevItems => {
        const updatedItems = [...prevItems];
        updatedItems[2].working = false;
        updatedItems[2].done = true;
        updatedItems[2].failed = false;
        return updatedItems;
      });

      /*const initParams: any = {
        useRegistryAnchor: stateRegistryMandatory,
        allocationStartTime: BigInt(dateStringToSeconds(startDate)),
        allocationEndTime: BigInt(dateStringToSeconds(endDate)),
        approvalThreshold: BigInt(approvalThreshold),
        maxRequestedAmount: ethToWeiBigInt(maxGrantAmount),
      };
      console.log("stateRegistryMandatory: ", stateRegistryMandatory)
      console.log("startDate: ", BigInt(dateStringToSeconds(startDate)))
      console.log("endDate: ", BigInt(dateStringToSeconds(endDate)))
      console.log("approvalThreshold: ", BigInt(approvalThreshold))
      console.log("maxGrantAmount: ", BigInt(ethToWeiBigInt(maxGrantAmount)))

      if (!selectedProfileHash) {
        console.log("No profile selected");
        return;
      }

      const initStrategyData = await microStrategy.getInitializeData(initParams); // Get init data for strategy contract
      console.log("initStrategyData: ", initStrategyData);

      const poolCreationData: CreatePoolArgs = {
        profileId: selectedProfileHash!,
        strategy: StrategyAddress,
        initStrategyData: initStrategyData,
        token: poolTokenAddress || NATIVE,
        amount: ethToWeiBigInt(fundPoolAmount),
        metadata: {
          protocol: BigInt(1),
          pointer: IPFSPointer,
        },
        managers: managers,
      };
      console.log("profileId: ", selectedProfileHash)
      console.log("strategy: ", StrategyAddress)
      console.log("initStrategyData: ", initStrategyData)
      console.log("token: ", poolTokenAddress || NATIVE.toLowerCase())
      console.log("amount: ", ethToWeiBigInt(fundPoolAmount))
      console.log("metadata: ", {
        protocol: BigInt(1),
        pointer: IPFSPointer,
      })
      console.log("managers: ", managers)

      setItems(prevItems => {
        const updatedItems = [...prevItems];
        updatedItems[2].working = true;
        updatedItems[2].done = false;
        return updatedItems;
      });

      const createPoolData = await allo.createPoolWithCustomStrategy(poolCreationData);
      console.log(createPoolData)

      const tx = await sendTransaction({
        to: createPoolData.to as string,
        data: createPoolData.data,
        value: BigInt(createPoolData.value),
        gas: BigInt(3000000)
      });

      const receipt =
        await wagmiConfig.publicClient.waitForTransactionReceipt({
          hash: tx.hash,
          confirmations: 2,
        });*/
    } catch (error) {
      setItems(prevItems => {
        const updatedItems = [...prevItems];
        updatedItems[2].working = false;
        updatedItems[2].done = true;
        updatedItems[2].failed = true;
        return updatedItems;
      });
      console.log("Error creating pool: ", error)
    }
  }

  const handleDelete = (memberName: string) => {
    const updatedMembers = managers.filter((member) => member !== memberName);
    setManagers(updatedMembers);
  };

  const CustomLabel = ({ text, tooltipText }: any) => {
      return (
          <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
              {text}
              <Tooltip title={tooltipText} sx={{ textAlign: "center" }}>
                  <InfoIcon sx={{ fill: '#607d8b', cursor: 'pointer', paddingLeft: '4px' }} />
              </Tooltip>
          </Typography>
      );
  };

  return (
      <Box sx={{
          width: 'auto', gap: '24px', justifyContent: 'flex-start', alignItems: 'center',
          display: 'flex', flexDirection: 'column', flex: 1
      }}>
          <Button size="medium" sx={{ alignSelf: 'flex-start' }}
              onClick={() => { changeCreatePool() }}
              endIcon={<ArrowBackIcon sx={{ fill: '#fff', cursor: 'pointer' }} />}>
              Back
          </Button>
          <Typography variant="h5">Create pool</Typography>
          <Stepper nonLinear activeStep={activeStep} sx={{ width: '100%' }}>
              {steps.map((label, index) => (
                  <Step key={label} completed={completed[index]}>
                      <StepButton color="inherit" onClick={handleStep(index)}>
                          {label}
                      </StepButton>
                  </Step>
              ))}
          </Stepper>
          {activeStep === 0 && <> <TextField
              variant="outlined"
              color="secondary"
              value={strategyType}
              size="medium"
              //onChange={(e: any) => { setStrategyType(e.target.value) }}
              select
              sx={{ width: { xs: '100%', sm: '350px' } }}
              label="Strategy type"
              InputLabelProps={{
                  shrink: true
              }}
          >
              <MenuItem key={'manual'} value="MicroGrantsv1">
                  Manual
              </MenuItem>
              <MenuItem key={'governance token'} value="Governance token" disabled>
                  Governance token
              </MenuItem>
              <MenuItem key={'hats protocol'} value="Hats protocol" disabled>
                  Hats protocol
              </MenuItem>
          </TextField>
              <TextField
                  variant="outlined"
                  color="secondary"
                  size="medium"
                  placeholder='Gitcoin Micro Grants'
                  value={poolName}
                  onChange={(e: any) => { setPoolName(e.target.value) }}
                  sx={{ width: { xs: '100%', sm: '350px' } }}
                  label="Pool name"
                  InputLabelProps={{
                      shrink: true
                  }}
              >
              </TextField>
              <TextField
                  variant="outlined"
                  color="secondary"
                  size="medium"
                  placeholder='https://www.website.com'
                  value={website}
                  onChange={(e: any) => { setWebsite(e.target.value) }}
                  sx={{ width: { xs: '100%', sm: '350px' } }}
                  label="Website"
                  InputLabelProps={{
                      shrink: true
                  }}
              >
              </TextField>
              <TextField
                  variant="outlined"
                  color="secondary"
                  size="medium"
                  multiline
                  rows={4}
                  placeholder='Description'
                  value={description}
                  onChange={(e: any) => { setDescription(e.target.value) }}
                  sx={{ width: { xs: '100%', sm: '350px' } }}
                  label="Description"
                  InputLabelProps={{
                      shrink: true
                  }}
              >
              </TextField></>}
          {activeStep === 1 && <>
              <TextField
                  variant="outlined"
                  color="secondary"
                  size="medium"
                  placeholder='Pool token address'
                  value={poolTokenAddress}
                  onChange={(e: any) => { setPoolTokenAddress(e.target.value) }}
                  sx={{ width: { xs: '100%', sm: '350px' } }}
                  label={<CustomLabel text={'Pool token address'}
                      tooltipText={'For pool funding, enter the token address. Leave blank for native currency'}></CustomLabel>}
                  InputLabelProps={{
                      shrink: true
                  }}
              >
              </TextField>
              <TextField
                  variant="outlined"
                  color="secondary"
                  size="medium"
                  placeholder='ETH'
                  value={fundPoolAmount}
                  onChange={(e: any) => { setFundPoolAmount(e.target.value) }}
                  sx={{ width: { xs: '100%', sm: '350px' } }}
                  label={<CustomLabel text={'Fund pool amount'} tooltipText={'The amount of tokens to fund the pool with'}></CustomLabel>}
                  InputLabelProps={{
                      shrink: true
                  }}
              >
              </TextField>
              <TextField
                  variant="outlined"
                  color="secondary"
                  size="medium"
                  placeholder='ETH'
                  value={maxGrantAmount}
                  onChange={(e: any) => { setMaxGrantAmount(e.target.value) }}
                  sx={{ width: { xs: '100%', sm: '350px' } }}
                  label={<CustomLabel text={'Max grant amount'} tooltipText={'The max amount that can be requested by an applicant.'}></CustomLabel>}
                  InputLabelProps={{
                      shrink: true
                  }}
              >
              </TextField>
              <TextField
                  variant="outlined"
                  color="secondary"
                  type="number"
                  size="medium"
                  placeholder='ETH'
                  value={approvalThreshold}
                  onChange={handleApprovalThresholdChange}
                  sx={{ width: { xs: '100%', sm: '350px' } }}
                  label={'Approval threshold'}
                  InputLabelProps={{
                      shrink: true
                  }}
              >
              </TextField></>}
          {activeStep === 2 && <><TextField
              variant="outlined"
              color="secondary"
              type="datetime-local"
              size="medium"
              sx={{ width: { xs: '100%', sm: '350px' } }}
              value={startDate}
              onChange={(e: any) => { setStartDate(e.target.value) }}
              label={'Start date'}
              InputLabelProps={{
                  shrink: true
              }}
          >
          </TextField>
              <TextField
                  variant="outlined"
                  color="secondary"
                  type="datetime-local"
                  size="medium"
                  sx={{ width: { xs: '100%', sm: '350px' } }}
                  value={endDate}
                  onChange={(e: any) => { setEndDate(e.target.value) }}
                  label={'End date'}
                  InputLabelProps={{
                      shrink: true
                  }}
              >
              </TextField>
              <div>
                  <Typography sx={{ maxWidth: '300px' }}>Is a registry profile mandatory for applicants?</Typography>
                  <FormControlLabel
                      control={
                          <Checkbox
                              checked={stateRegistryMandatory}
                              onChange={(e) => { setStateRegistryMandatory(e.target.checked) }}
                              value="yes"
                              color="secondary"
                          />
                      }
                      label="Yes"
                  />
                  <FormControlLabel
                      control={
                          <Checkbox
                              checked={!stateRegistryMandatory}
                              onChange={(e) => { setStateRegistryMandatory(!e.target.checked) }}
                              value="no"
                              color="secondary"
                          />
                      }
                      label="No"
                  />
              </div>
              <Box>
                  <label htmlFor="file-upload" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Button
                          component="span"
                          variant="contained"
                          color="secondary"
                          startIcon={<CloudUploadIcon sx={{ fill: 'white' }} />}
                      >
                          Upload banner image
                      </Button>
                  </label>
                  <input
                      id="file-upload"
                      type="file"
                      accept=".png,.jpg,.jpeg" // Accept PNG or JPG files only
                      style={{ display: 'none' }}
                      onChange={handleFileChange}
                  />
                  {selectedFile && (
                      <Typography variant="body1" color="textSecondary" sx={{ paddingTop: '12px' }}>
                          Selected File: {selectedFile ? selectedFile!.name : ''}
                      </Typography>
                  )}
              </Box>
              <TextField
                  id="outlined-adornment-password"
                  label="Managers"
                  variant="outlined"
                  value={singleManager}
                  color="secondary"
                  onChange={(e) => { setSingleManager(e.target.value) }}
                  sx={{ 'fieldSet': { border: '1px solid grey' }, width: { xs: '100%', sm: '350px' } }}
                  InputProps={{
                      endAdornment: (
                          <InputAdornment position="end">
                              <IconButton onClick={() => {
                                  if (singleManager.length > 0) {
                                      // Check if the manager already exists in the managers array
                                      const managerExists = managers.some(manager => manager === singleManager);

                                      // If the manager doesn't exist, add it to the managers state
                                      if (!managerExists) {
                                          setManagers([...managers, singleManager]);
                                          setSingleManager('');
                                      }
                                  }
                              }} edge="end"
                              >
                                  <AddIcon sx={{ fill: blueGrey[500] }} />
                              </IconButton>
                          </InputAdornment>
                      ),
                  }}
              />
              {managers.length > 0 && (
                  <List dense sx={{ border: '1px solid grey', borderRadius: '4px', maxHeight: '200px', overflow: 'auto', width: { xs: '100%', sm: '350px' } }}>
                      {managers.map((manager, index) => (
                          <ListItem key={index}>
                              <ListItemText primary={`${manager.substring(0, 3)}...${manager.substring(manager.length - 3)}`} />
                              <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(manager)}>
                                  <DeleteIcon />
                              </IconButton>
                          </ListItem>
                      ))}
                  </List>
              )}
          </>}
          <Button
              component="span"
              variant="contained"
              color="secondary"
              disabled={createDisabled}
              size="medium"
              sx={{ alignSelf: 'flex-end' }}
              onClick={() => { handleCreatePool(); setDialogOpen(true) }}
          >
              Create pool
          </Button>
          <Button onClick={() => {handleCreatePool()}}>test</Button>

          <BaseDialog steps={items} open={dialogOpen} onClose={() => { setDialogOpen(!dialogOpen) }}
              dialogVariant={'stepper'} status={createPoolTransactionStatus}></BaseDialog>
      </Box >
  );
}