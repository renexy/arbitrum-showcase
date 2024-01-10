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
import { blue, blueGrey, green, grey, red } from '@mui/material/colors';
import AddIcon from '@mui/icons-material/Add';
import { Backdrop, Badge, CircularProgress, Fab, Step, StepContent, StepLabel, Stepper, TextField, Typography } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { FiberManualRecordOutlined } from '@mui/icons-material';
import CircleIcon from '@mui/icons-material/Circle';
import BuildCircleIcon from '@mui/icons-material/BuildCircle';
import { useEffect, useState } from 'react';
import CancelIcon from '@mui/icons-material/Cancel';

export interface TransactionDialogProps {
    open: boolean;
    selectedValue: string;
    message: string | undefined;
    onClose: (value: string) => void;
    status: 'confirm' | 'signature' | 'transaction' | 'succeeded' | 'failed';
    callbackFn?: (args?: any) => void;
    amount?: number;
    changeAmount?: (args: number) => void;
}

export interface StepperDialogProps extends TransactionDialogProps {
    steps: [{ label: string, working: boolean, done: boolean, failed: boolean }];
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
                    <DialogTitle>{status === 'succeeded' && "Profile updated sucessfully"}</DialogTitle>
                    <Button size="small" variant="contained" color="secondary" onClick={handleClose}>Confirm</Button>
                </div>
            </Dialog>}
            {status === 'failed' && <Dialog onClose={handleClose} open={open}>
                <div style={{ padding: '10px', display: 'flex', flexDirection: 'column' }}>
                    <DialogTitle>{status === 'failed' && "Failed to update profile"}</DialogTitle>
                    <Button size="small" variant="contained" color="secondary" onClick={handleClose}>Confirm</Button>
                </div>
            </Dialog>}
        </>
    )
}

function StepperDialog(props: StepperDialogProps) {
    const { onClose, selectedValue, open, status, message, callbackFn, steps } = props;
    const [activeStep, setActiveStep] = useState(0);
    const [showCloseButton, setShowCloseButton] = useState(false)
    const [allStepsSuccess, setAllStepsSuccess] = useState(false)

    const handleClose = () => {
        return
    };

    const closeButton = () => {
        onClose(selectedValue)
        if (allStepsSuccess) {
            window.location.reload()
        }
    }

    useEffect(() => {
        setActiveStep(steps.findIndex(x => x.working === true))
        var anyStepFailed = steps.some(x => x.failed)
        if (anyStepFailed) {
            setShowCloseButton(true)
            return
        }
        else setShowCloseButton(false)
        const allStepsDone = steps.every(x => x.done === true);
        if (allStepsDone) {
            setShowCloseButton(true)
            setAllStepsSuccess(true)
            return
        } else {
            setShowCloseButton(false)
        }
    }, [steps])

    return (<Dialog onClose={handleClose} open={open}>
        <Stepper activeStep={activeStep} orientation="vertical" sx={{ padding: '30px' }}>
            {steps.map((step, index) => (
                <Step key={step.label}>
                    {!step.done && step.working &&
                        <StepLabel StepIconComponent={BuildCircleIcon} StepIconProps={{ sx: { fill: grey[500] } }}>
                            {step.label}
                        </StepLabel>
                    }
                    {!step.done && !step.working &&
                        <StepLabel StepIconComponent={CircleIcon} StepIconProps={{ sx: { fill: grey[500] } }}>
                            {step.label}
                        </StepLabel>}
                    {step.done && !step.failed && <StepLabel StepIconComponent={CheckCircleIcon} StepIconProps={{ sx: { fill: green[500] } }}>
                        {step.label}
                    </StepLabel>}
                    {step.done && step.failed && <StepLabel StepIconComponent={CancelIcon} StepIconProps={{ sx: { fill: red[500] } }}>
                        {step.label}
                    </StepLabel>}
                </Step>
            ))}
            {showCloseButton && <Button size="small" sx={{ marginTop: '24px' }} variant="contained" color="secondary" onClick={closeButton}>Confirm</Button>}
        </Stepper>
    </Dialog>
    )
}

function TransactionFundPoolDialog(props: TransactionDialogProps) {
    const { onClose, selectedValue, open, status, message, callbackFn, amount, changeAmount } = props;

    const handleClose = () => {
        if (status === 'signature' || status === 'transaction') return
        if (status === 'failed' || status === 'succeeded') callbackFn!('restore')
        onClose(selectedValue);
    };

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseFloat(e.target.value);
        if (!isNaN(value)) {
            changeAmount!(value);
        }
    };

    return (
        <>
            {status === 'confirm' && <Dialog onClose={handleClose} open={open}>
                <div style={{ padding: '10px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <DialogTitle>Confirm transaction</DialogTitle>
                    <Typography sx={{ textAlign: 'center', padding: '8px 0' }}>{message || 'Create profile'}</Typography>
                    <TextField
                        id="standard-read-only-input"
                        label={'Amount'}
                        color='secondary'
                        sx={{ flex: '1 0 auto', minWidth: '200px' }}
                        onChange={handleAmountChange}
                        value={amount}
                        InputLabelProps={{ shrink: true }}
                        variant="standard"
                    />
                    <Button size="small" disabled={amount === 0} variant="contained" color="secondary" onClick={() => { callbackFn!() }}>Confirm</Button>
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
                    <DialogTitle>{status === 'succeeded' && "Profile updated sucessfully"}</DialogTitle>
                    <Button size="small" variant="contained" color="secondary" onClick={handleClose}>Confirm</Button>
                </div>
            </Dialog>}
            {status === 'failed' && <Dialog onClose={handleClose} open={open}>
                <div style={{ padding: '10px', display: 'flex', flexDirection: 'column' }}>
                    <DialogTitle>{status === 'failed' && "Failed to update profile"}</DialogTitle>
                    <Button size="small" variant="contained" color="secondary" onClick={handleClose}>Confirm</Button>
                </div>
            </Dialog>}
        </>
    )
}

export default function BaseDialog({ open, onClose, dialogVariant, status, callback, message, steps, amount, changeAmount }:
    {
        open: boolean, onClose: () => void, dialogVariant: string, status?: any, callback?: (args?: any) => void,
        message?: string, steps?: any, amount?: number, changeAmount?: (args: number) => void
    }) {
    const handleClose = (value: string) => {
        onClose()
    };


    return (
        <>
            {dialogVariant === 'transaction' ? <TransactionDialog
                selectedValue={''}
                open={open}
                onClose={handleClose}
                status={status}
                callbackFn={(e) => callback!(e)}
                message={message}
            /> :
                dialogVariant === 'transactionAmount' ? <TransactionFundPoolDialog
                    selectedValue={''}
                    open={open}
                    amount={amount}
                    changeAmount={(e) => changeAmount!(e)}
                    onClose={handleClose}
                    status={status}
                    callbackFn={(e) => callback!(e)}
                    message={message}>
                </TransactionFundPoolDialog>
                    :
                    <StepperDialog
                        selectedValue={''}
                        open={open}
                        onClose={handleClose}
                        status={status}
                        callbackFn={(e) => callback!(e)}
                        message={message}
                        steps={steps!}
                    />
            }
        </>
    );
}
