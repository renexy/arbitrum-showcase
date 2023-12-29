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
    onClose: (value: string) => void;
    status: 'confirm' | 'pending' | 'finished';
    callbackFn?: (args?: any) => void;
}

function TransactionDialog(props: TransactionDialogProps) {
    const { onClose, selectedValue, open, status, callbackFn } = props;

    const handleClose = () => {
        if (status === 'pending') return
        onClose(selectedValue);
    };

    return (
        <>
            {status === 'confirm' && <Dialog onClose={handleClose} open={open}>
                <div style={{ padding: '10px', display: 'flex', flexDirection: 'column' }}>
                    <DialogTitle>Confirm transaction</DialogTitle>
                    <Button size="small" variant="contained" color="secondary" onClick={() => { callbackFn!() }}>Confirm</Button>
                </div>
            </Dialog>}
            {status === 'pending' && <Backdrop
                sx={{ color: '#fff', display: 'flex', flexDirection: 'column', gap: '8px', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={open}
                onClick={handleClose}
            >
                <CircularProgress sx={{ color: '#f5f5f5' }} />
                <Typography variant="h6" color={'#f5f5f5'}>Transaction confirmed</Typography>
            </Backdrop>}
            {status === 'finished' && <Dialog onClose={handleClose} open={open}>
                <div style={{ padding: '10px', display: 'flex', flexDirection: 'column' }}>
                    <DialogTitle>Transaction failed/succeeded</DialogTitle>
                    <Button size="small" variant="contained" color="secondary" onClick={handleClose}>Confirm</Button>
                </div>
            </Dialog>}
        </>
    )
}

export default function BaseDialog({ open, onClose, dialogVariant, status, callback }:
    { open: boolean, onClose: () => void, dialogVariant: string, status?: any, callback?: () => void }) {
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
                callbackFn={callback}
            />
            }
        </>
    );
}
