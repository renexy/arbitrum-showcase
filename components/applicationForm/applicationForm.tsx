import Container from '@/components/container/container';
import { Alert, Box, Button, Snackbar, Step, StepButton, Stepper, TextField, Typography } from '@mui/material';
import Head from 'next/head'
import React, { useEffect, useState } from 'react';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useRouter } from 'next/router';
import GlobalContext from '@/hooks/context/ContextAggregator';
import { TPoolData } from '@/types/typesPool';
import { ethers } from 'ethers';
import BaseDialog from '../baseDialog/baseDialog';

const steps = ['Basic info', 'Grant info'];

const weiToEth = (weiValue: any) => {
    if (!weiValue) return "0.0 ETH";

    const ethValue = ethers.utils.formatEther(weiValue);

    return `${ethValue}`;
};

export default function ApplicationForm() {
    const [activeStep, setActiveStep] = React.useState(0);
    const handleStep = (step: number) => () => {
        setActiveStep(step);
    };
    const [completed, setCompleted] = React.useState<{
        [k: number]: boolean;
    }>({});
    const { loading, activePools, endedPools } = React.useContext(GlobalContext);
    const [dialogOpen, setDialogOpen] = useState<boolean>(false)
    const [applyFormTransactionStatus, setApplyFormTransactionStatus] =
        useState<'confirm' | 'signature' | 'transaction' | 'succeeded' | 'failed'>('confirm')
    const [items, setItems] = useState<Array<{ label: string; working: boolean; done: boolean; failed: boolean }>>([]);

    //Form
    const [name, setName] = useState<string>('')
    const [website, setWebsite] = useState<string>('')
    const [description, setDescription] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [reqAmount, setReqAmount] = useState<string>('')
    const [recipientAddress, setRecipientAddress] = useState<string>('')
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [applyDisabled, setApplyDisabled] = useState(true)
    const [selectedPool, setSelectedPool] = useState<TPoolData | undefined>(undefined)
    const [showSnackbar, setShowsnackbar] = useState(false)
    const router = useRouter()

    const handleFileChange = (event: any) => {
        const file = event.target.files[0];
        if (file && (file.type === 'image/png' || file.type === 'image/jpeg')) {
            setSelectedFile(file);
        } else {
            alert('Please select a PNG or JPG file.');
        }
    };

    React.useEffect(() => {
        const { id } = router.query;

        if (id) {
            if (activePools && activePools.length > 0) {
                const foundActive = activePools.find(pool => pool.poolId === id);
                console.log(weiToEth(foundActive?.maxRequestedAmount), "lol")
                if (foundActive) {
                    setSelectedPool(foundActive);
                    return;
                }
            }
            setSelectedPool(undefined);
        }
    }, [router.query, activePools]);

    useEffect(() => {
        if (name && website && description && email && reqAmount && recipientAddress && selectedFile) {
            setApplyDisabled(false)
        } else {
            setApplyDisabled(true)
        }
    }, [name, website, description, email, reqAmount, recipientAddress, selectedFile])

    const handleReqAmountChange = (e: any) => {
        const enteredValue = e.target.value;

        // Regular expression to allow any decimal number
        const decimalRegex = /^\d*\.?\d*$/; // Allows any decimal format

        if (enteredValue === '' || decimalRegex.test(enteredValue)) {
            var enteredAmountConverted = parseFloat(enteredValue)
            var selectedPoolMaxAmount = parseFloat(weiToEth(selectedPool?.maxRequestedAmount))
            if (enteredAmountConverted <= selectedPoolMaxAmount)
                setReqAmount(enteredValue); else {
                if (showSnackbar) return
                setShowsnackbar(true)
                setTimeout(() => {
                    setShowsnackbar(false)
                }, 3000)
            }
        } else {
            // Invalid input handling (You can modify this part to suit your needs)
            console.error('Invalid input. Please enter a valid decimal number.');
        }
    };

    const handleApply = () => {
        const steps = [
            {
                label: 'Uploading to IPFS',
                working: false,
                done: false,
                failed: false
            },
            {
                label: 'Deploying contract',
                working: false,
                done: false,
                failed: false
            }
        ];
    }

    return (
        <>
            {selectedPool && <>
                <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center', margin: '18px 0' }}>
                    Apply for pool
                </Typography>
                <Stepper nonLinear activeStep={activeStep} sx={{ width: '100%' }}>
                    {steps.map((label, index) => (
                        <Step key={label} completed={completed[index]}>
                            <StepButton color="inherit" onClick={handleStep(index)}>
                                {label}
                            </StepButton>
                        </Step>
                    ))}
                </Stepper>
                {activeStep === 0 && <>
                    <TextField
                        variant="outlined"
                        color="secondary"
                        value={name}
                        size="medium"
                        placeholder='Allo protocol'
                        onChange={(e: any) => { setName(e.target.value) }}
                        sx={{ width: { xs: '100%', sm: '350px' }, alignSelf: 'center' }}
                        label="Name"
                        InputLabelProps={{
                            shrink: true
                        }}
                    >
                    </TextField>
                    <TextField
                        variant="outlined"
                        color="secondary"
                        size="medium"
                        placeholder='https://website.url'
                        value={website}
                        onChange={(e: any) => { setWebsite(e.target.value) }}
                        sx={{ width: { xs: '100%', sm: '350px' }, alignSelf: 'center' }}
                        label="Website"
                        InputLabelProps={{
                            shrink: true
                        }}
                    >
                    </TextField>
                    <TextField
                        variant="outlined"
                        color="secondary"
                        size="medium"
                        multiline
                        rows={4}
                        placeholder='Description'
                        value={description}
                        onChange={(e: any) => { setDescription(e.target.value) }}
                        sx={{ width: { xs: '100%', sm: '350px' }, alignSelf: 'center' }}
                        label="Description"
                        InputLabelProps={{
                            shrink: true
                        }}
                    >
                    </TextField>
                    <TextField
                        variant="outlined"
                        color="secondary"
                        size="medium"
                        value={email}
                        onChange={(e: any) => { setEmail(e.target.value) }}
                        sx={{ width: { xs: '100%', sm: '350px' }, alignSelf: 'center' }}
                        label="Email"
                        InputLabelProps={{
                            shrink: true
                        }}
                    >
                    </TextField>
                </>}
                {activeStep === 1 && <>
                    <TextField
                        variant="outlined"
                        color="secondary"
                        value={reqAmount}
                        size="medium"
                        onChange={(e) => handleReqAmountChange(e)}
                        sx={{ width: { xs: '100%', sm: '350px' }, alignSelf: 'center' }}
                        label="Requested amount"
                        InputLabelProps={{
                            shrink: true
                        }}
                    >
                    </TextField>
                    <TextField
                        variant="outlined"
                        color="secondary"
                        size="medium"
                        value={recipientAddress}
                        onChange={(e: any) => { setRecipientAddress(e.target.value) }}
                        sx={{ width: { xs: '100%', sm: '350px' }, alignSelf: 'center' }}
                        label="Recipient address"
                        InputLabelProps={{
                            shrink: true
                        }}
                    >
                    </TextField>
                    <Box sx={{ alignSelf: 'center' }}>
                        <label htmlFor="file-upload" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Button
                                component="span"
                                variant="contained"
                                color="secondary"
                                startIcon={<CloudUploadIcon sx={{ fill: 'white' }} />}
                            >
                                Upload banner image
                            </Button>
                        </label>
                        <input
                            id="file-upload"
                            type="file"
                            accept=".png,.jpg,.jpeg" // Accept PNG or JPG files only
                            style={{ display: 'none' }}
                            onChange={handleFileChange}
                        />
                        {selectedFile && (
                            <Typography variant="body1" color="textSecondary" sx={{ paddingTop: '12px' }}>
                                Selected File: {selectedFile ? selectedFile!.name : ''}
                            </Typography>
                        )}
                    </Box>
                </>}

                <Button
                    component="span"
                    variant="contained"
                    color="secondary"
                    size="medium"
                    disabled={applyDisabled}
                    sx={{ alignSelf: 'flex-end' }}
                    onClick={() => { handleApply() }}
                >
                    Apply for pool
                </Button>
                <Snackbar
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    open={showSnackbar}
                    color="primary"
                >
                    <Alert severity="error" sx={{ width: '100%' }}>
                        Max. requested amount is {weiToEth(selectedPool?.maxRequestedAmount)} ETH!
                    </Alert>
                </Snackbar>
                <BaseDialog steps={items} open={dialogOpen} onClose={() => { setDialogOpen(!dialogOpen) }}
                    dialogVariant={'stepper'} status={applyFormTransactionStatus}></BaseDialog>
            </>}
            {!selectedPool && <Typography>Loading...</Typography>}
        </>
    )
}
