import Container from '@/components/container/container';
import { Autocomplete, Button, TextField, Typography } from '@mui/material';
import Head from 'next/head'
import AddIcon from '@mui/icons-material/Add';
import React from 'react';
import { green } from '@mui/material/colors';

export default function DisplayPoolInfo() {
    return (<>
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
    </>
    )
}
