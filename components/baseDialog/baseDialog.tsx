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

    const [confirmTranscation, setConfirmTransaction] = React.useState(false)

    const handleClose = () => {
        onClose(selectedValue);
    };

    // TODO: DELETE THIS
    React.useEffect(() => {
        if (confirmTranscation) {
            setTimeout(() => {
                setConfirmTransaction(!confirmTranscation)
            }, 3000)
        }
    }, [confirmTranscation])

    return (
        <>
            {!confirmTranscation && <Dialog onClose={handleClose} open={open}>
                <div style={{ padding: '10px', display: 'flex', flexDirection: 'column' }}>
                    <DialogTitle>Confirm transaction</DialogTitle>
                    <Button size="small" variant="contained" color="secondary" onClick={() => { setConfirmTransaction(true) }}>Confirm</Button>
                </div>
            </Dialog>}
            {confirmTranscation && <Backdrop
                sx={{ color: '#fff', display: 'flex', flexDirection: 'column', gap: '8px', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={open}
                onClick={handleClose}
            >
                <CircularProgress sx={{ color: '#f5f5f5' }} />
                <Typography variant="h6" color={'#f5f5f5'}>Transaction confirmed</Typography>
            </Backdrop>}
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