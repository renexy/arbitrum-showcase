import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { Alert, Autocomplete, AutocompleteRenderOptionState, Button, Card, CardContent, CardMedia, Fab, FormControlLabel, Grid, IconButton, InputAdornment, List, ListItem, ListItemText, Paper, Snackbar, Step, StepButton, Stepper, Switch, TextField, ToggleButton, Typography } from '@mui/material';
import { CreatePoolArgs } from "@allo-team/allo-v2-sdk/dist/Allo/types";
import { StrategyType } from "@allo-team/allo-v2-sdk/dist/strategies/MicroGrantsStrategy/types";
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import AddIcon from '@mui/icons-material/Add';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CircleIcon from '@mui/icons-material/Circle';
import { blueGrey, green, grey, red } from '@mui/material/colors';
import { useState } from 'react';
import CreatePool from '../createPool/createPool';
import DisplayPoolInfo from '../displayPoolInfo/displayPoolInfo';
import GlobalContext from '@/hooks/context/ContextAggregator';
import { TPoolData } from '@/types/typesPool';
import GridModuleCss from '@/styles/Grid.module.css'
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import { formatDate, shortenEthAddress } from '@/global/functions';
import { useAccount, useNetwork } from 'wagmi';
import BaseDialog from '../baseDialog/baseDialog';
import { TransactionData } from "@allo-team/allo-v2-sdk/dist/Common/types";
import { ethers } from 'ethers';
import { micro_abi } from '../../utils/microstrategy';
import { Status } from '@allo-team/allo-v2-sdk/dist/strategies/types';
import { MicroGrantsStrategy } from '@allo-team/allo-v2-sdk';

const fallbackImageURL = 'https://d1xv5jidmf7h0f.cloudfront.net/circleone/images/products_gallery_images/Welcome-Banners_12301529202210.jpg';

const weiToEth = (weiValue: any) => {
  if (!weiValue) return "0.0 ETH";

  const ethValue = ethers.utils.formatEther(weiValue);
  if (ethValue && ethValue.length > 11) {

    return ethValue.slice(0, 5);
  }

  return `${ethValue} ETH`;
};

export default function Pool() {
  const [showCreatePool, setShowCreatePool] = useState(false)
  const [value, setValue] = React.useState('one');
  const [createProfileTransactionStatus, setCreateProfileTransactionStatus] =
    useState<'confirm' | 'signature' | 'transaction' | 'succeeded' | 'failed'>('confirm')
  const [voteTransactionStatus, setVoteTransactionStatus] =
    useState<'confirm' | 'signature' | 'transaction' | 'succeeded' | 'failed'>('confirm')
  const { loading, activeProfilePools, endedProfilePools,
    isPoolManager,
    selectedProfileHash, poolManagersList, selectedPool, changeSelectedPool,
    isPoolAdmin, signer, allo, refetchPoolManagers,
    poolAllocatorsList,
    totalPoolApplications,
    refetchAllocators,
    microStrategy
  } = React.useContext(GlobalContext);
  const [showActiveOnly, setShowActiveOnly] = useState(true)
  const [poolManagers, setPoolManagers] = useState<string[]>([])
  const [dropdownOptions, setDropdownOptions] = useState<TPoolData[]>([])
  const [singleManager, setSingleManager] = useState('')
  const [poolManagersToAdd, setPoolManagersToAdd] = useState<string[]>([])
  const [poolManagersToRemove, setPoolManagersToRemove] = useState<string[]>([])
  const { address, isConnected } = useAccount();
  const [showSnackbarManagerIsOwner, setShowSnackbarManagerIsOwner] = useState(false)
  const [showSnackbarMemberExists, setShowSnackbarMemberExists] = useState(false)
  const [itemsChanged, setItemsChanged] = useState(false)
  const [dialogOpenAdd, setDialogOpenAdd] = useState(false)
  const [showSnackbarAllo, setShowsnackbarAllo] = useState(false)

  const [poolAllocators, setPoolAllocators] = useState<string[]>([])
  const [singleAllocator, setSingleAllocator] = useState('')
  const [poolAllocatorsToAdd, setPoolAllocatorsToAdd] = useState<string[]>([])
  const [poolAllocatorsToRemove, setPoolAllocatorsToRemove] = useState<string[]>([])
  const [dialogVoteOpen, setDialogVoteOpen] = useState(false)
  const [selectedApplication, setSelectedApplication] = useState<any>()

  const [localApplications, setLocalApplications] = useState<ApplicationData[] | undefined>(undefined)

  
  const { chain } = useNetwork();
  const chainId = chain?.id;

  React.useEffect(() => {
    if (poolManagersToAdd.length > 0 || poolManagersToRemove.length > 0 || poolAllocatorsToAdd.length > 0 || poolAllocatorsToRemove.length > 0) {
      setItemsChanged(true)
    } else {
      setItemsChanged(false)
    }
  }, [poolManagers, poolAllocators])

  const handleAddManager = async () => {
    if (singleManager === address) {
      setShowSnackbarManagerIsOwner(true)
      setTimeout(() => {
        setShowSnackbarManagerIsOwner(false);
      }, 3000);
      return
    }
    if (singleManager.length > 0) {
      if (poolManagers && poolManagers.length > 0) {
        if (!(poolManagers.find(x => x === singleManager)) &&
          !(poolManagersToAdd.find(x => x === singleManager))) {
          setPoolManagersToAdd([...poolManagersToAdd, singleManager]);
          setPoolManagers([...poolManagers, singleManager])
        } else {
          setShowSnackbarMemberExists(true)
          setTimeout(() => {
            setShowSnackbarMemberExists(false);
          }, 3000);
        }
      } else {
        if (!poolManagersToAdd.find(x => x === singleManager)) {
          setPoolManagersToAdd([...poolManagersToAdd, singleManager]);
          setPoolManagers([...poolManagers, singleManager])
        } else {
          setShowSnackbarMemberExists(true)
          setTimeout(() => {
            setShowSnackbarMemberExists(false);
          }, 3000);
        }
      }
      setSingleManager('')
    }
  }

  const handleRemoveManager = (manager: string) => {
    var foundManager = poolManagers.find(x => x === manager)
    if (foundManager) {
      var deleteManager = poolManagers.filter((x) => x !== manager)
      if (deleteManager) {
        setPoolManagersToRemove([...poolManagersToRemove, manager])
        var deleteDisplayedManagers = poolManagers.filter((x) => x !== manager)
        setPoolManagers(deleteDisplayedManagers)
      }
    }
    var foundInTempList = poolManagersToAdd.find(x => x === manager)
    if (foundInTempList) {
      var deleteManagerTemp = poolManagersToAdd.filter((x) => x !== manager)
      if (deleteManagerTemp) {
        setPoolManagersToAdd(deleteManagerTemp)
        var deleteDisplayedManagers = poolManagers.filter((x) => x !== manager)
        setPoolManagers(deleteDisplayedManagers)
      }
    }
  }

  const handleAddAllocator = async () => {
    if (singleAllocator === address) {
      setShowSnackbarManagerIsOwner(true)
      setTimeout(() => {
        setShowSnackbarManagerIsOwner(false);
      }, 3000);
      return
    }

    console.log("poolAllocators", poolAllocators)
    if (singleAllocator.length > 0) {
      if (poolAllocators && poolAllocators.length > 0) {
        if (!(poolAllocators.find(x => x === singleAllocator)) &&
          !(poolAllocatorsToAdd.find(x => x === singleAllocator))) {
          setPoolAllocatorsToAdd([...poolAllocatorsToAdd, singleAllocator]);
          setPoolAllocators([...poolAllocators, singleAllocator])
        } else {
          setShowSnackbarMemberExists(true)
          setTimeout(() => {
            setShowSnackbarMemberExists(false);
          }, 3000);
        }
      } else {
        if (!poolAllocatorsToAdd.find(x => x === singleAllocator)) {
          setPoolAllocatorsToAdd([...poolAllocatorsToAdd, singleAllocator]);
          setPoolAllocators([...poolAllocators, singleAllocator])
        } else {
          setShowSnackbarMemberExists(true)
          setTimeout(() => {
            setShowSnackbarMemberExists(false);
          }, 3000);
        }
      }
      setSingleAllocator('')
    }
  }

  const handleRemoveAllocator = (allocator: string) => {
    var foundAllocator = poolAllocators.find(x => x === allocator)
    if (foundAllocator) {
      var deleteAllocator = poolAllocators.filter((x) => x !== allocator)
      if (deleteAllocator) {
        setPoolAllocatorsToRemove([...poolAllocatorsToRemove, allocator])
        var deleteDisplayedAllocators = poolAllocators.filter((x) => x !== allocator)
        setPoolAllocators(deleteDisplayedAllocators)
      }
    }
    var foundInTempList = poolAllocatorsToAdd.find(x => x === allocator)
    if (foundInTempList) {
      var deleteAllocatorTemp = poolAllocatorsToAdd.filter((x) => x !== allocator)
      if (deleteAllocatorTemp) {
        setPoolAllocatorsToAdd(deleteAllocatorTemp)
        var deleteDisplayedAllocators = poolAllocators.filter((x) => x !== allocator)
        setPoolAllocators(deleteDisplayedAllocators)
      }
    }
  }

  React.useEffect(() => {
    if (showActiveOnly && activeProfilePools) {
      setDropdownOptions(activeProfilePools || []);
      if (activeProfilePools.length > 0) {
        changeSelectedPool(activeProfilePools[0])
      } else
        changeSelectedPool(undefined);
    } else if (!showActiveOnly && endedProfilePools) {
      setDropdownOptions(endedProfilePools || []);
      if (endedProfilePools.length > 0) {
        changeSelectedPool(endedProfilePools[0])
      } else
        changeSelectedPool(undefined);
    }
  }, [showActiveOnly, activeProfilePools, endedProfilePools]);

  React.useEffect(() => {
    setPoolManagers(poolManagersList)
  }, [poolManagersList])

  React.useEffect(() => {
    setPoolAllocators(poolAllocatorsList)

    if (totalPoolApplications && totalPoolApplications.length > 0) {
      var foundApplications = totalPoolApplications.filter(x => x.poolId === selectedPool?.poolId)
      if (foundApplications) {
        setLocalApplications(foundApplications)
      }
    }
  }, [selectedPool])

  const handleRemoveManagerFunc = async (allo: any, signer: any) => {
    const poolId = selectedPool?.poolId;

    try {
      setCreateProfileTransactionStatus('signature');

      for (const manager of poolManagersToRemove) {
        const txData = allo.removePoolManager(poolId, manager);

        const hash = await signer.sendTransaction({
          data: txData.data,
          to: txData.to,
          value: BigInt(txData.value),
        });

        setCreateProfileTransactionStatus('transaction');

        try {
          const receipt = await hash.wait();
          if (receipt.status !== 1) {
            setCreateProfileTransactionStatus('failed');
            console.error("Transaction failed for manager:", manager);
            break; // Stop if any transaction fails
          }
        } catch (error) {
          console.error("Transaction error for manager:", manager, error);
          setCreateProfileTransactionStatus('failed');
          break; // Stop if any transaction fails
        }
      }

      setCreateProfileTransactionStatus('succeeded');

    } catch (error) {
      console.error("user rejected or error occurred", error);
      setCreateProfileTransactionStatus('failed');
    }
  }

  const handleAddManagerFunc = async (allo: any, signer: any) => {
    const poolId = selectedPool?.poolId;

    try {
      setCreateProfileTransactionStatus('signature');

      for (const manager of poolManagersToAdd) {
        const txData = allo.addPoolManager(poolId, manager);

        const hash = await signer.sendTransaction({
          data: txData.data,
          to: txData.to,
          value: BigInt(txData.value),
        });

        setCreateProfileTransactionStatus('transaction');

        try {
          const receipt = await hash.wait();
          if (receipt.status !== 1) {
            setCreateProfileTransactionStatus('failed');
            console.error("Transaction failed for manager:", manager);
            break; // Stop if any transaction fails
          }
        } catch (error) {
          console.error("Transaction error for manager:", manager, error);
          setCreateProfileTransactionStatus('failed');
          break; // Stop if any transaction fails
        }
      }

      setCreateProfileTransactionStatus('succeeded');

    } catch (error) {
      console.error("user rejected or error occurred", error);
      setCreateProfileTransactionStatus('failed');
    }
  }

  const handleAllocators = async (microStrategy: any, signer: any) => {
    const rpc = 'https://rpc.goerli.eth.gateway.fm';
    const customProvider = new ethers.providers.JsonRpcProvider(rpc);
    const contractAddress = selectedPool?.strategy || '';
    console.log("contractAddress", contractAddress);
    console.log("micro_abi", micro_abi);

    // Attach the signer to the contract
    const microGrantStrategyContract = new ethers.Contract(contractAddress, micro_abi, signer);

    try {
      setCreateProfileTransactionStatus('signature');

      // Combine addresses and set flags accordingly
      const addresses = [...poolAllocatorsToAdd, ...poolAllocatorsToRemove];
      const flags = [...poolAllocatorsToAdd.map(() => true), ...poolAllocatorsToRemove.map(() => false)];

      // Directly call the batchSetAllocator function on the contract
      const transactionResponse = await microGrantStrategyContract.batchSetAllocator(addresses, flags);

      setCreateProfileTransactionStatus('transaction');

      try {
        const receipt = await transactionResponse.wait();
        if (receipt.status === 1) {
          setCreateProfileTransactionStatus('succeeded');
        } else {
          setCreateProfileTransactionStatus('failed');
          console.error("Transaction failed:", receipt);
        }
      } catch (error) {
        console.error("Transaction error:", error);
        setCreateProfileTransactionStatus('failed');
      }

    } catch (error) {
      console.error("user rejected or error occurred", error);
      setCreateProfileTransactionStatus('failed');
    }
  };

  const handleUpdate = async (args: any) => {
    if (args && args === 'restore') {
      setCreateProfileTransactionStatus('confirm')
      return;
    }

    if (!allo || !signer) {
      setShowsnackbarAllo(true)
      setTimeout(() => {
        setShowsnackbarAllo(false)
      }, 5000)
      return;
    }

    if (poolManagersToRemove.length > 0)
      await handleRemoveManagerFunc(allo, signer)

    if (poolManagersToAdd.length > 0)
      await handleAddManagerFunc(allo, signer)

    if (poolAllocatorsToRemove.length > 0 || poolAllocatorsToAdd.length > 0)
      await handleAllocators(microStrategy, signer)

    if (poolManagersToAdd.length > 0 || poolManagersToRemove.length > 0) {
      refetchPoolManagers();
    }

    if (poolAllocatorsToAdd.length > 0 || poolAllocatorsToRemove.length > 0) {
      refetchAllocators();
    }
  }

  const handleVote = async (allo: any, signer: any, args?: any,) => {
    if (args && args === 'restore') {
      setVoteTransactionStatus('confirm')
      return;
    }

    if (!allo || !signer) {
      setShowsnackbarAllo(true)
      setTimeout(() => {
        setShowsnackbarAllo(false)
      }, 5000)
      return;
    }
  
    try {
      setVoteTransactionStatus('signature');
      
      const recipientId = selectedApplication.recipientAddress;
      const status = Status.Accepted;

      const poolId = selectedApplication.metadata.application.microGrant.poolId;

      const microStrategy = new MicroGrantsStrategy({ chain: chainId || 0, rpc: window.ethereum, poolId: poolId });

      console.log("microStrategy", microStrategy)

      const allocateInitParams: TransactionData = await microStrategy.getAllocationData(recipientId, status)

      console.log("poolId", poolId);
      console.log("allocateInitParams", allocateInitParams);

      const hash = await signer.sendTransaction({
        data: allocateInitParams.data,
        to: allocateInitParams.to,
        value: BigInt(allocateInitParams.value),
      });

      setVoteTransactionStatus('transaction');
  
      try {
        const receipt = await hash.wait();
        if (receipt.status === 1) {
          setVoteTransactionStatus('succeeded');
        } else {
          setVoteTransactionStatus('failed');
          console.error("Transaction failed:", receipt);
        }
      } catch (error) {
        console.error("Transaction error:", error);
        setVoteTransactionStatus('failed');
      }
  
    } catch (error) {
      console.error("user rejected or error occurred", error);
      setVoteTransactionStatus('failed');
    }
  }

  return (
    <Box sx={{
      width: 'auto', minWidth: '100%', gap: '36px', justifyContent: 'flex-start',
      display: 'flex', flexDirection: 'column', flex: 1, padding: '12px', overflow: 'auto'
    }}>
      {!showCreatePool &&
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', flexDirection: 'row', gap: '8px' }}>
              <Autocomplete
                id="combo-box-demo"
                disableClearable
                options={dropdownOptions}
                color="secondary"
                value={selectedPool}
                onChange={(event, value) => changeSelectedPool(value)}
                getOptionLabel={(option) => `${option.pool.metadata.name}`}
                renderOption={(props, option) => {
                  return (
                    <li {...props} key={option.poolId + option.pool.metadata.name}>
                      {option.pool.metadata.name}
                    </li>
                  );
                }}
                sx={{ width: { xs: '100%', sm: '260px' }, textAlign: 'left' }}
                renderInput={(params) => <TextField {...params} label="Pool" color="secondary" />}
              />
              <ToggleButton
                color="secondary"
                value={showActiveOnly}
                selected={showActiveOnly}
                onChange={() => {
                  setShowActiveOnly(!showActiveOnly);
                }}
              >
                <CheckCircleIcon />
              </ToggleButton>
            </div>
            <Button variant="contained"
              onClick={() => { setShowCreatePool(true) }}
              sx={{
                paddingLeft: '8px', alignSelf: 'flex-end', fontSize: '1rem',
                width: { xs: '100%', sm: '200px', height: '30px' }
              }} endIcon={<AddIcon sx={{ fill: '#fff', cursor: 'pointer' }}
              />}>
              Create new pool
            </Button>
          </div>
          {selectedPool && <DisplayPoolInfo selectedPool={selectedPool} active={showActiveOnly} />}
          {selectedPool &&
            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
              '@media (min-width: 600px)': {
                flexDirection: 'row',
              },
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', flex: 1, gap: '8px' }}>
                <Typography variant="h6" sx={{ textAlign: 'left' }}>Existing managers</Typography>
                {poolManagers && poolManagers.length > 0 ? (
                  <List dense sx={{ border: '1px solid grey', borderRadius: '4px', height: '180px', overflow: 'auto' }}>
                    {poolManagers.map((member, index) => (
                      <ListItem key={index}>
                        <ListItemText primary={shortenEthAddress(member)} />
                        {isPoolAdmin && <IconButton edge="end" aria-label="delete" onClick={() => handleRemoveManager(member)}>
                          <DeleteIcon />
                        </IconButton>
                        }
                      </ListItem>
                    ))}
                  </List>
                ) : (<span style={{ textAlign: 'left' }}>No managers</span>)}

                <TextField
                  id="outlined-adornment-password"
                  label="Add members"
                  variant="outlined"
                  value={singleManager}
                  color="secondary"
                  onChange={(e) => { setSingleManager(e.target.value) }}
                  sx={{ 'fieldSet': { border: '1px solid grey' } }}
                  InputLabelProps={{
                    style: {
                      color: !isPoolAdmin ? 'rgba(0, 0, 0, 0.38)' : 'unset'
                    }
                  }}
                  InputProps={{
                    readOnly: !isPoolAdmin,
                    disabled: !isPoolAdmin,
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => { handleAddManager() }} edge="end">
                          <AddIcon sx={{ fill: blueGrey[500] }} />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </div>
            </Box>}
        </>}
      {showCreatePool && <CreatePool changeCreatePool={() => { setShowCreatePool(false) }}></CreatePool>}
      {isPoolManager &&

        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, gap: '8px' }}>
          <Typography variant="h6" sx={{ textAlign: 'left' }}>Existing allocators</Typography>
          {poolAllocators && poolAllocators.length > 0 ? (
            <List dense sx={{ border: '1px solid grey', borderRadius: '4px', height: '180px', overflow: 'auto' }}>
              {poolAllocators.map((member, index) => (
                <ListItem key={index}>
                  <ListItemText primary={shortenEthAddress(member)} />
                  {isPoolManager && <IconButton edge="end" aria-label="delete" onClick={() => handleRemoveAllocator(member)}>
                    <DeleteIcon />
                  </IconButton>
                  }
                </ListItem>
              ))}
            </List>
          ) : (<span style={{ textAlign: 'left' }}>No allocators</span>)}

          <TextField
            id="outlined-adornment-password"
            label="Add allocators"
            variant="outlined"
            value={singleAllocator}
            color="secondary"
            onChange={(e) => { setSingleAllocator(e.target.value) }}
            sx={{ 'fieldSet': { border: '1px solid grey' } }}
            InputLabelProps={{
              style: {
                color: !isPoolManager ? 'rgba(0, 0, 0, 0.38)' : 'unset'
              }
            }}
            InputProps={{
              readOnly: !isPoolManager,
              disabled: !isPoolManager,
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => { handleAddAllocator() }} edge="end">
                    <AddIcon sx={{ fill: blueGrey[500] }} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </div>
      }
      {
        isPoolAdmin || isPoolManager && <Box sx={{ display: 'flex', width: '100%', alignItems: 'flex-end', gap: '8px', justifyContent: 'flex-end' }}>
          <Button color="secondary" onClick={() => { setPoolManagers(poolManagersList); setPoolManagersToAdd([]); setPoolManagersToRemove([]); setPoolAllocatorsToAdd([]); setPoolAllocatorsToRemove([]) }}>Reset</Button>
          <Button disabled={!itemsChanged} color="secondary" onClick={() => { setDialogOpenAdd(true) }}>Save</Button>
        </Box>
      }
      {!showCreatePool && localApplications && localApplications[0] && localApplications[0].microGrantRecipients &&
        localApplications[0].microGrantRecipients.length > 0 && <Grid container spacing={2} sx={{}}>
          {localApplications[0].microGrantRecipients.map((item, index) => (
            <Grid key={index} item xs={12} sm={6} md={4} lg={3}>
              <Card sx={{ cursor: 'pointer' }}>
                <CardMedia
                  component="img"
                  height="125"
                  image={item?.metadata?.bannerImage || fallbackImageURL}
                  alt="Random"
                  style={{ objectFit: 'cover' }}
                />
                <CardContent>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div className={GridModuleCss.colBreak}>
                      <Typography sx={{ fontWeight: 'bold', fontSize: '1.3rem' }}>
                        {item?.metadata?.metadata?.name || "/"}</Typography>
                    </div>
                    <div className={GridModuleCss.colBreak}>
                      <Typography sx={{ fontWeight: 'bold' }}>Submitted on</Typography>
                      <Typography>{formatDate(item?.blockTimestamp) || '/'}</Typography>
                    </div>
                    <div className={GridModuleCss.colBreak}>
                      <Typography sx={{ fontWeight: 'bold' }}>Amount</Typography>
                      <Typography>{weiToEth(item?.metadata?.application?.requestedAmount)}</Typography>
                    </div>
                    <div className={GridModuleCss.colBreak}>
                      <Typography sx={{ fontWeight: 'bold' }}>Status</Typography>
                      <Typography>{item?.metadata?.status || 'Pending'}</Typography>
                    </div>
                    <div className={GridModuleCss.colBreak}>
                      <Button size="medium" sx={{ alignSelf: 'flex-start' }}
                        onClick={() => { setDialogVoteOpen(true); setSelectedApplication(item) }}>
                        Vote
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      }

      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        open={showSnackbarMemberExists}
        color="secondary"
      >
        <Alert severity="warning" sx={{ width: '100%' }}>
          Manager already exists!
        </Alert>
      </Snackbar>
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        open={showSnackbarManagerIsOwner}
        color="secondary"
      >
        <Alert severity="warning" sx={{ width: '100%' }}>
          Owner can&apos;t be member!
        </Alert>
      </Snackbar>
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        open={showSnackbarAllo}
        color="secondary"
      >
        <Alert severity="warning" sx={{ width: '100%' }}>
          Allo not initialized!
        </Alert>
      </Snackbar>

      <BaseDialog open={dialogOpenAdd} onClose={() => { setDialogOpenAdd(!dialogOpenAdd) }}
        dialogVariant={'transaction'} status={createProfileTransactionStatus} callback={(e) => { handleUpdate(e) }}
        message={'Are you sure you want to manage allocators?'}></BaseDialog>
      <BaseDialog open={dialogVoteOpen} onClose={() => { setDialogVoteOpen(!dialogVoteOpen) }}
        dialogVariant={'transaction'} status={voteTransactionStatus} callback={(e) => { handleVote(allo, signer, e) }}
        message={'Are you sure you want to vote?'}></BaseDialog>
    </Box>
  );
}