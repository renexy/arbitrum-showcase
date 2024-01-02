import * as React from 'react';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import PersonIcon from '@mui/icons-material/Person';
import { blue, blueGrey } from '@mui/material/colors';
import AddIcon from '@mui/icons-material/Add';
import { Backdrop, CircularProgress, Fab, Typography } from '@mui/material';

export interface TransactionDialogProps {
    open: boolean;
    selectedValue: string;
    message: string | undefined;
    onClose: (value: string) => void;
    status: 'confirm' | 'signature' | 'transaction' | 'succeeded' | 'failed';
    callbackFn?: (args?: any) => void;
}

function TransactionDialog(props: TransactionDialogProps) {
    const { onClose, selectedValue, open, status, message, callbackFn } = props;

    const handleClose = () => {
        if (status === 'signature' || status === 'transaction') return
        if (status === 'failed' || status === 'succeeded') callbackFn!('restore')
        onClose(selectedValue);
    };

    return (
        <>
            {status === 'confirm' && <Dialog onClose={handleClose} open={open}>
                <div style={{ padding: '10px', display: 'flex', flexDirection: 'column' }}>
                    <DialogTitle>Confirm transaction</DialogTitle>
                    <Typography sx={{ textAlign: 'center', padding: '8px 0' }}>{message || 'Create profile'}</Typography>
                    <Button size="small" variant="contained" color="secondary" onClick={() => { callbackFn!() }}>Confirm</Button>
                </div>
            </Dialog>}
            {status === 'signature' && <Backdrop
                sx={{ color: '#fff', display: 'flex', flexDirection: 'column', gap: '8px', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={open}
                onClick={handleClose}
            >
                <CircularProgress sx={{ color: '#f5f5f5' }} />
                <Typography variant="h6" color={'#f5f5f5'}>Confirm Transaction</Typography>
            </Backdrop>}
            {status === 'transaction' && <Backdrop
                sx={{ color: '#fff', display: 'flex', flexDirection: 'column', gap: '8px', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={open}
                onClick={handleClose}
            >
                <CircularProgress sx={{ color: '#f5f5f5' }} />
                <Typography variant="h6" color={'#f5f5f5'}>Transaction Sent</Typography>
            </Backdrop>}
            {status === 'succeeded' && <Dialog onClose={handleClose} open={open}>
                <div style={{ padding: '10px', display: 'flex', flexDirection: 'column' }}>
                    <DialogTitle>{status === 'succeeded' && "Profile Created Successfully"}</DialogTitle>
                    <Button size="small" variant="contained" color="secondary" onClick={handleClose}>Confirm</Button>
                </div>
            </Dialog>}
            {status === 'failed' && <Dialog onClose={handleClose} open={open}>
                <div style={{ padding: '10px', display: 'flex', flexDirection: 'column' }}>
                    <DialogTitle>{status === 'failed' && "Failed to Create Profile"}</DialogTitle>
                    <Button size="small" variant="contained" color="secondary" onClick={handleClose}>Confirm</Button>
                </div>
            </Dialog>}
        </>
    )
}

export default function BaseDialog({ open, onClose, dialogVariant, status, callback, message }:
    { open: boolean, onClose: () => void, dialogVariant: string, status?: any, callback?: (args?: any) => void, message?: string }) {
    const handleClose = (value: string) => {
        onClose()
    };

    return (
        <>
            {dialogVariant === 'transaction' && <TransactionDialog
                selectedValue={''}
                open={open}
                onClose={handleClose}
                status={status}
                callbackFn={(e) => callback!(e)}
                message={message}
            />
            }
        </>
    );
}
