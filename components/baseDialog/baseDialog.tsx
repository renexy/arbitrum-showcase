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

const emails = ['username@gmail.com', 'user02@gmail.com'];

export interface SimpleDialogProps {
    open: boolean;
    selectedValue: string;
    onClose: (value: string) => void;
}

function TransactionDialog(props: SimpleDialogProps) {
    const { onClose, selectedValue, open } = props;

    const [transactionStatus, setTransactionStatus] = React.useState<'confirm' | 'pending' | 'successful' | 'failed'>('confirm')

    const handleClose = () => {
        // todoburger: stop all metamask stuff here since dialog is closed
        onClose(selectedValue);
        setTransactionStatus('confirm')
    };

    // TODO: DELETE THIS
    React.useEffect(() => {
        if (transactionStatus === 'pending') {
            setTimeout(() => {
                setTransactionStatus('successful')
            }, 3000)
        }
    }, [transactionStatus])

    return (
        <>
            {transactionStatus === 'confirm' && <Dialog onClose={handleClose} open={open}>
                <div style={{ padding: '10px', display: 'flex', flexDirection: 'column' }}>
                    <DialogTitle>Confirm transaction</DialogTitle>
                    <Button size="small" variant="contained" color="secondary" onClick={() => { setTransactionStatus('pending') }}>Confirm</Button>
                </div>
            </Dialog>}
            {transactionStatus === 'pending' && <Backdrop
                sx={{ color: '#fff', display: 'flex', flexDirection: 'column', gap: '8px', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={open}
                onClick={handleClose}
            >
                <CircularProgress sx={{ color: '#f5f5f5' }} />
                <Typography variant="h6" color={'#f5f5f5'}>Transaction confirmed</Typography>
            </Backdrop>}
            {transactionStatus === 'successful' && <Dialog onClose={handleClose} open={open}>
                <div style={{ padding: '10px', display: 'flex', flexDirection: 'column' }}>
                    <DialogTitle>Transaction failed/succeeded</DialogTitle>
                    <Button size="small" variant="contained" color="secondary" onClick={handleClose}>Confirm</Button>
                </div>
            </Dialog>}
        </>
    )
}

export default function BaseDialog({ open, onClose, dialogVariant }: any) {
    const handleClose = (value: string) => {
        onClose()
    };

    return (
        <>
            {dialogVariant === 'transaction' && <TransactionDialog
                selectedValue={''}
                open={open}
                onClose={handleClose}
            />
            }
        </>
    );
}