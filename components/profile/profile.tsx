import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { Paper, TextField, Typography } from '@mui/material';

export default function Profile() {
    const [value, setValue] = React.useState('one');

    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
    };

    return (
        <Box sx={{
            width: 'auto', minWidth: '50%', gap: '18px', justifyContent: 'flex-start',
            display: 'flex', flexDirection: 'column', flex: 1, padding: '40px 20px 20px 20px'
        }}>
            <TextField
                id="standard-read-only-input"
                label="Id"
                color='secondary'
                defaultValue="Id"
                value="rene"
                InputProps={{
                    readOnly: true,
                }}
                variant="standard"
            />
            <TextField
                id="standard-read-only-input"
                label="Anchor"
                color='secondary'
                defaultValue="Anchor"
                value="rene"
                InputProps={{
                    readOnly: true,
                }}
                variant="standard"
            />
            <TextField
                id="standard-read-only-input"
                label="Name"
                color='secondary'
                defaultValue="Name"
                value="rene"
                InputProps={{
                    readOnly: true,
                }}
                variant="standard"
            />
            <TextField
                id="standard-read-only-input"
                label="Pointer"
                color='secondary'
                defaultValue="Pointer"
                value="rene"
                InputProps={{
                    readOnly: true,
                }}
                variant="standard"
            />
            <TextField
                id="standard-read-only-input"
                label="Protocol"
                color='secondary'
                defaultValue="IPFS"
                InputProps={{
                    readOnly: true,
                }}
                variant="standard"
            />
        </Box >
    );
}