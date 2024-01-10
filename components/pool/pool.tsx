import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { Alert, Autocomplete, AutocompleteRenderOptionState, Button, Fab, FormControlLabel, IconButton, InputAdornment, List, ListItem, ListItemText, Paper, Snackbar, Step, StepButton, Stepper, Switch, TextField, ToggleButton, Typography } from '@mui/material';
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
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import { shortenEthAddress } from '@/global/functions';
import { useAccount } from 'wagmi';
import BaseDialog from '../baseDialog/baseDialog';
import { TransactionData } from "@allo-team/allo-v2-sdk/dist/Common/types";

export default function Pool() {
  const [showCreatePool, setShowCreatePool] = useState(false)
  const [value, setValue] = React.useState('one');
  const [createProfileTransactionStatus, setCreateProfileTransactionStatus] =
    useState<'confirm' | 'signature' | 'transaction' | 'succeeded' | 'failed'>('confirm')
  const { loading, activeProfilePools, endedProfilePools, selectedProfileHash, poolManagersList, selectedPool, changeSelectedPool, isPoolAdmin, signer, allo, refetchPoolManagers } = React.useContext(GlobalContext);
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

  React.useEffect(() => {
    if (poolManagersToAdd.length > 0 || poolManagersToRemove.length > 0) {
      setItemsChanged(true)
    } else {
      setItemsChanged(false)
    }
  }, [poolManagers])

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
    console.log("poolManagersList: ", poolManagersList);
  }, [poolManagersList])

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

    refetchPoolManagers();
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
                message={'Are you sure you want to manage members?'}></BaseDialog>
            </Box>}
        </>}
      {showCreatePool && <CreatePool changeCreatePool={() => { setShowCreatePool(false) }}></CreatePool>}
      {
        isPoolAdmin && <Box sx={{ display: 'flex', width: '100%', alignItems: 'flex-end', gap: '8px', justifyContent: 'flex-end' }}>
          <Button color="secondary" onClick={() => { setPoolManagers(poolManagersList); setPoolManagersToAdd([]); setPoolManagersToRemove([]) }}>Reset</Button>
          <Button disabled={!itemsChanged} color="secondary" onClick={() => { setDialogOpenAdd(true) }}>Save</Button>
        </Box>
      }
    </Box>
  );
}