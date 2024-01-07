import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { Autocomplete, AutocompleteRenderOptionState, Button, Fab, FormControlLabel, InputAdornment, Paper, Step, StepButton, Stepper, Switch, TextField, ToggleButton, Typography } from '@mui/material';
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

export default function Pool() {
  const [showCreatePool, setShowCreatePool] = useState(false)
  const [value, setValue] = React.useState('one');
  const { loading, activePools, endedPools, selectedProfileHash } = React.useContext(GlobalContext);
  const [showActiveOnly, setShowActiveOnly] = useState(true)
  const [dropdownOptions, setDropdownOptions] = useState<TPoolData[]>([])
  const [selectedPool, setSelectedPool] = useState<TPoolData | undefined>(undefined)

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  React.useEffect(() => {
    if (activePools && endedPools) {
      const options = showActiveOnly ? (activePools || []) : (endedPools || []);
      setDropdownOptions(options)
      setSelectedPool(undefined)
    }
  }, [showActiveOnly, activePools, endedPools])

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
                onChange={(event, value) => setSelectedPool(value)}
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
        </>}
      {showCreatePool && <CreatePool changeCreatePool={() => { setShowCreatePool(false) }}></CreatePool>}
    </Box>
  );
}