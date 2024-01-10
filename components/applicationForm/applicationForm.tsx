import Container from '@/components/container/container';
import { Alert, Box, Button, Snackbar, Step, StepButton, Stepper, TextField, Typography } from '@mui/material';
import Head from 'next/head'
import React, { useEffect, useState } from 'react';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useRouter } from 'next/router';
import GlobalContext from '@/hooks/context/ContextAggregator';
import { TPoolData, ZERO_ADDRESS } from '@/types/typesPool';
import { ethers } from 'ethers';
import BaseDialog from '../baseDialog/baseDialog';
import { getWalletClient } from '@wagmi/core';
import { getIPFSClient } from '@/services/ipfs';
import { useNetwork } from 'wagmi';
import { MicroGrantsStrategy } from '@allo-team/allo-v2-sdk';
import { sendTransaction } from "@wagmi/core";
import { wagmiConfig } from '@/wagmiConfig';
import { ethToWeiBigInt } from '@/global/functions';

const steps = ['Basic info', 'Grant info'];

const weiToEth = (weiValue: any) => {
    if (!weiValue) return "0.0 ETH";

    const ethValue = ethers.utils.formatEther(weiValue);

    return `${ethValue}`;
};

export default function ApplicationForm() {
    const [activeStep, setActiveStep] = React.useState(0);
    const handleStep = (step: number) => () => {
        setActiveStep(step);
    };
    const [completed, setCompleted] = React.useState<{
        [k: number]: boolean;
    }>({});
    const { loading, activePools, userProfiles, userMemberProfiles, endedPools, selectedProfileHash } = React.useContext(GlobalContext);
    const [dialogOpen, setDialogOpen] = useState<boolean>(false)
    const [applyFormTransactionStatus, setApplyFormTransactionStatus] =
        useState<'confirm' | 'signature' | 'transaction' | 'succeeded' | 'failed'>('confirm')
    const [items, setItems] = useState<Array<{ label: string; working: boolean; done: boolean; failed: boolean }>>([]);

    //Form
    const [name, setName] = useState<string>('')
    const [website, setWebsite] = useState<string>('')
    const [description, setDescription] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [reqAmount, setReqAmount] = useState<string>('')
    const [recipientAddress, setRecipientAddress] = useState<string>('')
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [selectedFile64, setSelectedFile64] = useState<string | null>(null);
    const [applyDisabled, setApplyDisabled] = useState(true)
    const [selectedPool, setSelectedPool] = useState<TPoolData | undefined>(undefined)
    const [selectedProfileName, setSelectedProfileName] = useState<string | undefined>('')
    const [selectedProfileAnchor, setSelectedProfileAnchor] = useState<string | undefined>('')
    const [showSnackbar, setShowsnackbar] = useState(false)
    const router = useRouter()
    const ipfsClient = getIPFSClient();
    const { chain } = useNetwork();

    const handleFileChange = (event: any) => {
        const file = event.target.files[0];
        if (file && (file.type === 'image/png' || file.type === 'image/jpeg')) {
            const reader = new FileReader();
            reader.onloadend = function () {
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

    React.useEffect(() => {
        const { id } = router.query;

        if (id) {
            if (activePools && activePools.length > 0) {
                const foundActive = activePools.find(pool => pool.poolId === id);
                console.log(weiToEth(foundActive?.maxRequestedAmount), "lol")
                if (foundActive) {
                    setSelectedPool(foundActive);
                    return;
                }
            }
            setSelectedPool(undefined);
        }
    }, [router.query, activePools]);

    useEffect(() => {
        if (name && website && description && email && reqAmount && recipientAddress && selectedFile) {
            setApplyDisabled(false)
        } else {
            setApplyDisabled(true)
        }
    }, [name, website, description, email, reqAmount, recipientAddress, selectedFile])

    const handleReqAmountChange = (e: any) => {
        const enteredValue = e.target.value;

        // Regular expression to allow any decimal number
        const decimalRegex = /^\d*\.?\d*$/; // Allows any decimal format

        if (enteredValue === '' || decimalRegex.test(enteredValue)) {
            var enteredAmountConverted = parseFloat(enteredValue)
            var selectedPoolMaxAmount = parseFloat(weiToEth(selectedPool?.maxRequestedAmount))
            if (enteredAmountConverted <= selectedPoolMaxAmount)
                setReqAmount(enteredValue); else {
                if (showSnackbar) return
                setShowsnackbar(true)
                setTimeout(() => {
                    setShowsnackbar(false)
                }, 3000)
            }
        } else {
            // Invalid input handling (You can modify this part to suit your needs)
            console.error('Invalid input. Please enter a valid decimal number.');
        }
    };

    React.useEffect(() => {
        if (!selectedProfileHash) return
        let findByUserProfiles: boolean = !!userProfiles?.find(x => x.id === selectedProfileHash)
        let searchOption = userProfiles
        if (!findByUserProfiles) {
            searchOption = userMemberProfiles
        }

        setSelectedProfileName(searchOption?.find(x => x.id === selectedProfileHash)?.name)
        setSelectedProfileAnchor(searchOption?.find(x => x.id === selectedProfileHash)?.anchor)
    }, [selectedProfileHash, userProfiles, userMemberProfiles])

    const handleApply = async () => {
      if (!selectedPool) {
          console.log("No selected pool available")
          return;
      }

      const steps = [
          {
              label: 'Uploading to IPFS',
              working: false,
              done: false,
              failed: false
          },
          {
              label: 'Creating Application',
              working: false,
              done: false,
              failed: false
          }
      ];


      setItems(steps)

      setItems(prevItems => {
          const updatedItems = [...prevItems];
          updatedItems[0].working = false;
          updatedItems[0].done = false;
          return updatedItems;
      });

      let IPFSPointer;

      const walletClient = await getWalletClient({ chainId: chain?.id });

      // Upload metadata to IPFS
      try {
          setItems(prevItems => {
              const updatedItems = [...prevItems];
              updatedItems[0].working = true;
              updatedItems[0].done = false;
              return updatedItems;
          });

          const metadata = {
              profileId: name,
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

      // Submit application

      setItems(prevItems => {
        const updatedItems = [...prevItems];
        updatedItems[1].working = true;
        updatedItems[1].done = false;
        updatedItems[1].failed = false;
        return updatedItems;
      });

      const microGrantsStrategy = new MicroGrantsStrategy({ chain: chain?.id!, poolId: Number(selectedPool.poolId), rpc: window.ethereum })

      const registerRecipientData = microGrantsStrategy.getRegisterRecipientData({
        registryAnchor: selectedProfileAnchor as `0x${string}`,
        recipientAddress: recipientAddress as `0x${string}`,
        requestedAmount: ethToWeiBigInt(reqAmount),
        metadata: {
          protocol: BigInt(1),
          pointer: IPFSPointer,
        },
      });

      try {
        const tx = await sendTransaction({
          to: registerRecipientData.to as string,
          data: registerRecipientData.data,
          value: BigInt(registerRecipientData.value),
        });
  
        const reciept =
          await wagmiConfig.publicClient.waitForTransactionReceipt({
            hash: tx.hash,
          });
  
        
        setItems(prevItems => {
          const updatedItems = [...prevItems];
          updatedItems[1].working = false;
          updatedItems[1].done = true;
          updatedItems[1].failed = false;
          return updatedItems;
        });
      } catch (error) {
        console.log("Error Registering Application", error);
        setItems(prevItems => {
          const updatedItems = [...prevItems];
          updatedItems[1].working = false;
          updatedItems[1].done = true;
          updatedItems[1].failed = true;
          return updatedItems;
        });
      }

    }

    const test = selectedPool?.poolId

    return (
        <>
            {selectedPool && <>
                <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center', margin: '18px 0' }}>
                    Apply for pool with <span style={{ fontWeight: 700}}>&nbsp;&apos;{selectedProfileName}&apos;</span>
                </Typography>
                <Stepper nonLinear activeStep={activeStep} sx={{ width: '100%' }}>
                    {steps.map((label, index) => (
                        <Step key={label} completed={completed[index]}>
                            <StepButton color="inherit" onClick={handleStep(index)}>
                                {label}
                            </StepButton>
                        </Step>
                    ))}
                </Stepper>
                {activeStep === 0 && <>
                    <TextField
                        variant="outlined"
                        color="secondary"
                        value={name}
                        size="medium"
                        placeholder='Allo protocol'
                        onChange={(e: any) => { setName(e.target.value) }}
                        sx={{ width: { xs: '100%', sm: '350px' }, alignSelf: 'center' }}
                        label="Name"
                        InputLabelProps={{
                            shrink: true
                        }}
                    >
                    </TextField>
                    <TextField
                        variant="outlined"
                        color="secondary"
                        size="medium"
                        placeholder='https://website.url'
                        value={website}
                        onChange={(e: any) => { setWebsite(e.target.value) }}
                        sx={{ width: { xs: '100%', sm: '350px' }, alignSelf: 'center' }}
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
                        sx={{ width: { xs: '100%', sm: '350px' }, alignSelf: 'center' }}
                        label="Description"
                        InputLabelProps={{
                            shrink: true
                        }}
                    >
                    </TextField>
                    <TextField
                        variant="outlined"
                        color="secondary"
                        size="medium"
                        value={email}
                        onChange={(e: any) => { setEmail(e.target.value) }}
                        sx={{ width: { xs: '100%', sm: '350px' }, alignSelf: 'center' }}
                        label="Email"
                        InputLabelProps={{
                            shrink: true
                        }}
                    >
                    </TextField>
                </>}
                {activeStep === 1 && <>
                    <TextField
                        variant="outlined"
                        color="secondary"
                        value={reqAmount}
                        size="medium"
                        onChange={(e) => handleReqAmountChange(e)}
                        sx={{ width: { xs: '100%', sm: '350px' }, alignSelf: 'center' }}
                        label="Requested amount"
                        InputLabelProps={{
                            shrink: true
                        }}
                    >
                    </TextField>
                    <TextField
                        variant="outlined"
                        color="secondary"
                        size="medium"
                        value={recipientAddress}
                        onChange={(e: any) => { setRecipientAddress(e.target.value) }}
                        sx={{ width: { xs: '100%', sm: '350px' }, alignSelf: 'center' }}
                        label="Recipient address"
                        InputLabelProps={{
                            shrink: true
                        }}
                    >
                    </TextField>
                    <Box sx={{ alignSelf: 'center' }}>
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
                </>}

                <Button
                    component="span"
                    variant="contained"
                    color="secondary"
                    size="medium"
                    disabled={applyDisabled}
                    sx={{ alignSelf: 'flex-end' }}
                    onClick={() => { handleApply(); setDialogOpen(true) }}
                >
                    Apply for pool
                </Button>
                <Snackbar
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    open={showSnackbar}
                    color="primary"
                >
                    <Alert severity="error" sx={{ width: '100%' }}>
                        Max. requested amount is {weiToEth(selectedPool?.maxRequestedAmount)} ETH!
                    </Alert>
                </Snackbar>
                <BaseDialog steps={items} open={dialogOpen} onClose={() => { setDialogOpen(!dialogOpen) }}
                    dialogVariant={'stepper'} status={applyFormTransactionStatus}></BaseDialog>
            </>}
            {!selectedPool && <Typography>Loading...</Typography>}
        </>
    )
}
