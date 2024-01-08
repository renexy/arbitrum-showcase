import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { Autocomplete, AutocompleteRenderOptionState, Button, Fab, FormControlLabel, IconButton, InputAdornment, List, ListItem, ListItemText, Paper, Step, StepButton, Stepper, Switch, TextField, ToggleButton, Typography } from '@mui/material';
import { CreatePoolArgs } from "@allo-team/allo-v2-sdk/dist/Allo/types";
import { TransactionData } from "@allo-team/allo-v2-sdk/dist/Common/types";
import { StrategyType } from "@allo-team/allo-v2-sdk/dist/strategies/MicroGrantsStrategy/types";
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import AddIcon from '@mui/icons-material/Add';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CircleIcon from '@mui/icons-material/Circle';
import { green, grey, red } from '@mui/material/colors';
import { useState } from 'react';
import CreatePool from '../createPool/createPool';
import DisplayPoolInfo from '../displayPoolInfo/displayPoolInfo';
import GlobalContext from '@/hooks/context/ContextAggregator';
import { TPoolData } from '@/types/typesPool';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import { shortenEthAddress } from '@/global/functions';
import { useAccount } from 'wagmi';

export default function Pool() {
  const [showCreatePool, setShowCreatePool] = useState(false)
  const [value, setValue] = React.useState('one');
  const { loading, activeProfilePools, endedProfilePools, selectedProfileHash, selectedPool, changeSelectedPool } = React.useContext(GlobalContext);
  const [showActiveOnly, setShowActiveOnly] = useState(true)
  const [dropdownOptions, setDropdownOptions] = useState<TPoolData[]>([])
  const [singleManager, setSingleManager] = useState('')
  const { address, isConnected } = useAccount();
  const [showSnackbarManagerIsOwner, setShowSnackbarManagerIsOwner] = useState(false)

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  // const handleAddManager = () => {
  //   if (singleManager === address) {
  //     setShowSnackbarManagerIsOwner(true)
  //     setTimeout(() => {
  //       setShowSnackbarManagerIsOwner(false);
  //     }, 3000);
  //     return
  //   }
  //   if (singleManager.length > 0) {
  //     if (selectedPool?.managers && selectedPool.managers.length > 0) {
  //       if (!(selectedProfile.members.find(x => x.address === singleMember)) &&
  //         !(membersToAdd.find(x => x.address === singleMember))) {
  //         setMembersToAdd([...membersToAdd, { address: singleMember, id: '' }]);
  //         setNewProfileMembers([...newProfileMembers, { address: singleMember, id: '' }])
  //       } else {
  //         setShowSnackbarMemberExists(true)
  //         setTimeout(() => {
  //           setShowSnackbarMemberExists(false);
  //         }, 3000);
  //       }
  //     } else {
  //       if (!membersToAdd.find(x => x.address === singleMember)) {
  //         setMembersToAdd([...membersToAdd, { address: singleMember, id: '' }]);
  //         setNewProfileMembers([...newProfileMembers, { address: singleMember, id: '' }])
  //       } else {
  //         setShowSnackbarMemberExists(true)
  //         setTimeout(() => {
  //           setShowSnackbarMemberExists(false);
  //         }, 3000);
  //       }
  //     }
  //     setSingleMember('')
  //   }
  // }

  // const handleRemoveMember = (member: Account) => {
  //   var foundMember = selectedProfile?.members.find(x => x.address === member.address)
  //   if (foundMember) {
  //     var deleteMember = selectedProfile?.members.filter((x) => x.address !== member.address)
  //     if (deleteMember) {
  //       setMembersToRemove([...membersToRemove, { address: member.address, id: '' }])
  //       var deleteDisplayedMembers = newProfileMembers.filter((x) => x.address !== member.address)
  //       setNewProfileMembers(deleteDisplayedMembers)
  //     }
  //   }
  //   var foundInTempList = membersToAdd?.find(x => x.address === member.address)
  //   if (foundInTempList) {
  //     var deleteMemberTemp = membersToAdd?.filter((x) => x.address !== member.address)
  //     if (deleteMemberTemp) {
  //       setMembersToAdd(deleteMemberTemp)
  //       var deleteDisplayedMembers = newProfileMembers.filter((x) => x.address !== member.address)
  //       setNewProfileMembers(deleteDisplayedMembers)
  //     }
  //   }
  // }

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
    } else if (showActiveOnly && !activeProfilePools && endedProfilePools) {
      // Fallback in case activePools are not available but endedPools exist
      setDropdownOptions(endedProfilePools || []);
      if (endedProfilePools.length > 0) {
        changeSelectedPool(endedProfilePools[0]);
      } else
        changeSelectedPool(undefined);
    } else if (!showActiveOnly && activeProfilePools && !endedProfilePools) {
      // Fallback in case endedPools are not available but activePools exist
      setDropdownOptions(activeProfilePools || []);
      if (activeProfilePools.length > 0) {
        changeSelectedPool(activeProfilePools[0]);
      } else
        changeSelectedPool(undefined);
    }
  }, [showActiveOnly, activeProfilePools, endedProfilePools]);

  return (
    <Box sx={{
      width: 'auto', minWidth: '100%', gap: '18px', justifyContent: 'flex-start',
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
          {/* {selectedPool &&
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
                {newProfileMembers && newProfileMembers.length > 0 ? (
                  <List dense sx={{ border: '1px solid grey', borderRadius: '4px', height: '180px', overflow: 'auto' }}>
                    {newProfileMembers.map((member, index) => (
                      <ListItem key={index}>
                        <ListItemText primary={member?.address && member.address.length > 9 ? shortenEthAddress(member.address) : member?.address} />
                        {editMode && <IconButton edge="end" aria-label="delete" onClick={() => handleRemoveMember(member)}>
                          <DeleteIcon />
                        </IconButton>}
                      </ListItem>
                    ))}
                  </List>
                ) : (<span style={{ textAlign: 'left' }}>No members</span>)}

                <TextField
                  id="outlined-adornment-password"
                  label="Add members"
                  variant="outlined"
                  value={singleMember}
                  color="secondary"
                  onChange={(e) => { setSingleMember(e.target.value) }}
                  sx={{ 'fieldSet': { border: '1px solid grey' } }}
                  InputLabelProps={{
                    style: {
                      color: !editMode ? 'rgba(0, 0, 0, 0.38)' : 'unset'
                    }
                  }}
                  InputProps={{
                    readOnly: !editMode,
                    disabled: !editMode,
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => { handleAddMember() }} edge="end">
                          {editMode && <AddIcon sx={{ fill: blueGrey[500] }} />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </div>
            </Box>} */}
        </>}
      {showCreatePool && <CreatePool changeCreatePool={() => { setShowCreatePool(false) }}></CreatePool>}
    </Box>
  );
}