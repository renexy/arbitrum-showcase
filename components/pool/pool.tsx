import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { Autocomplete, Button, Fab, InputAdornment, Paper, Step, StepButton, Stepper, TextField, Typography } from '@mui/material';
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

const top100Films = [
  { label: 'The Shawshank Redemption', year: 1994 },
  { label: 'The Godfather', year: 1972 },
  { label: 'The Godfather: Part II', year: 1974 },
];

export default function Pool() {
  const [showCreatePool, setShowCreatePool] = useState(false)
  const [value, setValue] = React.useState('one');

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <Box sx={{
      width: 'auto', minWidth: '100%', gap: '18px', justifyContent: 'flex-start',
      display: 'flex', flexDirection: 'column', flex: 1, padding: '12px', overflow: 'auto'
    }}>
      {!showCreatePool &&
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <Autocomplete
              id="combo-box-demo"
              disableClearable
              options={top100Films}
              color="secondary"
              sx={{ width: { xs: '100%', sm: '260px' }, textAlign: 'left' }}
              renderInput={(params) => <TextField {...params} label="Pool" color="secondary" />}
            />
            <Button variant="contained"
              onClick={() => { setShowCreatePool(true) }}
              sx={{ paddingLeft: '8px', fontSize: '1rem', width: { xs: '100%', sm: '200px', height: '30px' } }} endIcon={<AddIcon sx={{ fill: '#fff', cursor: 'pointer' }}
              />}>
              Create new pool
            </Button>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
            <TextField
              id="standard-read-only-input"
              color='secondary'
              sx={{ textAlign: 'left', border: 'none', flex: 1 }}
              value={'Pool 108'}
              InputProps={{
                readOnly: true,
                disabled: true,
                disableUnderline: true,
                sx: {
                  fontSize: '1.5rem',
                  color: 'rgba(0, 0, 0, 0.6)'
                }
              }}
              variant="standard"
            />
            <Button variant="outlined" sx={{ background: green[300] }} color="secondary"
              disabled>
              <Typography sx={{ color: 'white', fontWeight: 'bold', fontSize: '1rem' }}>ACTIVE</Typography>
            </Button>
          </div>
          <div style={{ display: 'flex', gap: '18px', flexWrap: 'wrap', width: '100%' }}>
            <TextField
              id="standard-read-only-input"
              label="Strategy type"
              color='secondary'
              sx={{ flex: '1 0 auto', minWidth: '200px' }}
              value={'Manual'}
              InputProps={{
                readOnly: true,
                disabled: true
              }}
              variant="standard"
            >
            </TextField>
            <TextField
              id="standard-read-only-input"
              label="Website"
              color='secondary'
              sx={{ flex: '1 0 auto', minWidth: '200px' }}
              value={'link'}
              InputProps={{
                readOnly: true,
                disabled: true,
              }}
              variant="standard"
            >
            </TextField>
            <TextField
              id="standard-read-only-input"
              label={'Profile ID'}
              color='secondary'
              sx={{ flex: '1 0 auto', minWidth: '200px' }}
              value={'string'}
              InputProps={{
                readOnly: true,
                disabled: true,
              }}
              variant="standard"
            />
          </div>
          <div style={{ display: 'flex', gap: '18px', flexWrap: 'wrap', width: '100%' }}>
            <TextField
              id="standard-read-only-input"
              label={'Pool amount'}
              color='secondary'
              sx={{ flex: '1 0 auto', minWidth: '200px' }}
              value={'number'}
              InputProps={{
                readOnly: true,
                disabled: true,
              }}
              variant="standard"
            />
            <TextField
              id="standard-read-only-input"
              label={'Max. allocation '}
              color='secondary'
              sx={{ flex: '1 0 auto', minWidth: '200px' }}
              value={'number'}
              InputProps={{
                readOnly: true,
                disabled: true,
              }}
              variant="standard"
            />
            <TextField
              id="standard-read-only-input"
              label={'Threshold'}
              color='secondary'
              sx={{ flex: '1 0 auto', minWidth: '200px' }}
              value={'number'}
              InputProps={{
                readOnly: true,
                disabled: true,
              }}
              variant="standard"
            />
          </div>

          <div style={{ display: 'flex', gap: '18px', flexWrap: 'wrap', width: '100%' }}>
            <TextField
              id="standard-read-only-input"
              label={'Applications'}
              color='secondary'
              sx={{ flex: '1 0 auto', minWidth: '200px' }}
              value={'number'}
              InputProps={{
                readOnly: true,
                disabled: true,
              }}
              variant="standard"
            />
            <TextField
              id="standard-read-only-input"
              label={'Profile req.'}
              color='secondary'
              sx={{ flex: '1 0 auto', minWidth: '200px' }}
              value={'number'}
              InputProps={{
                readOnly: true,
                disabled: true,
              }}
              variant="standard"
            />
            <TextField
              id="standard-read-only-input"
              label={'Start date'}
              color='secondary'
              sx={{ flex: '1 0 auto', minWidth: '200px' }}
              value={'number'}
              InputProps={{
                readOnly: true,
                disabled: true,
              }}
              variant="standard"
            />
          </div>
        </>}
      {showCreatePool && <CreatePool changeCreatePool={() => { setShowCreatePool(false) }}></CreatePool>}
    </Box>
  );
}