import * as React from 'react';
import Box from '@mui/material/Box';
import { Alert, Breadcrumbs, Button, Checkbox, FormControlLabel, IconButton, InputAdornment, InputLabel, List, ListItem, ListItemText, MenuItem, Paper, Select, Snackbar, Step, StepButton, Stepper, TextField, Tooltip, Typography, styled } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { blueGrey } from '@mui/material/colors';
import BaseDialog from '../baseDialog/baseDialog';
import { useState, useEffect } from 'react'
import { TransactionData } from '@allo-team/allo-v2-sdk/dist/Common/types';
import { useContext } from "react";
import GlobalContext from '../../hooks/context/ContextAggregator';
import { CreateProfileArgs } from '@allo-team/allo-v2-sdk/dist/Registry/types';
import InfoIcon from '@mui/icons-material/Info';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Link from '@mui/material/Link';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { ethers } from 'ethers'
import {
  getWalletClient,
  sendTransaction,
  waitForTransaction,
} from "@wagmi/core";
import { StrategyType } from "@allo-team/allo-v2-sdk/dist/strategies/MicroGrantsStrategy/types";
import { useNetwork } from 'wagmi';
import { CreatePoolArgs } from '@allo-team/allo-v2-sdk/dist/Allo/types';

const steps = ['Basic info', 'Wallet info', 'Dates & more'];

const delay = (ms: number) => {
    return new Promise<void>((resolve) => {
        setTimeout(() => {
            resolve();
        }, ms);
    });
};

export default function CreatePool({ changeCreatePool }: any) {
    const [dialogOpen, setDialogOpen] = useState<boolean>(false)
    const [items, setItems] = useState<Array<{ label: string; working: boolean; done: boolean; failed: boolean }>>([]);
    const [createDisabled, setCreateDisabled] = useState(false)
    const [createPoolTransactionStatus, setCreatePoolTransactionStatus] =
        useState<'confirm' | 'signature' | 'transaction' | 'succeeded' | 'failed'>('confirm')
    // form
    const [strategyType, setStrategyType] = useState<'Manual' | 'Governance token' | 'Hats protocol'>('Manual')
    const [poolName, setPoolName] = useState<string>('')
    const [website, setWebsite] = useState<string>('')
    const [description, setDescription] = useState<string>('')
    const [poolTokenAddress, setPoolTokenAddress] = useState<string>('')
    const [fundPoolAmount, setFundPoolAmount] = useState<string>('')
    const [maxGrantAmount, setMaxGrantAmount] = useState<string>('')
    const [approvalThreshold, setApprovalThreshold] = useState<number>(1)
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [stateRegistryMandatory, setStateRegistryMandatory] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [activeStep, setActiveStep] = React.useState(0);
    const [completed, setCompleted] = React.useState<{
        [k: number]: boolean;
    }>({});

    useEffect(() => {
        if (poolName && website && description && fundPoolAmount && maxGrantAmount && startDate && endDate && selectedFile) {
            setCreateDisabled(false)
        } else {
            setCreateDisabled(true)
        }
    }, [strategyType, poolName, website, description, fundPoolAmount, maxGrantAmount, startDate, endDate, selectedFile])

    const handleStep = (step: number) => () => {
        setActiveStep(step);
    };

    const handleFileChange = (event: any) => {
        const file = event.target.files[0];
        if (file && (file.type === 'image/png' || file.type === 'image/jpeg')) {
            setSelectedFile(file);
        } else {
            alert('Please select a PNG or JPG file.');
        }
    };

    const handleApprovalThresholdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseFloat(e.target.value);
        if (!isNaN(value)) {
            setApprovalThreshold(value);
        }
    };

    const handleCreatePool = async () => {
        const steps = [
            {
                label: 'Deploying contract',
                working: false,
                done: false,
                failed: false
            },
            {
                label: 'Uploading to IPFS',
                working: false,
                done: false,
                failed: false
            },
            {
                label: 'Creating pool',
                working: false,
                done: false,
                failed: false
            }
        ];
        setItems(steps)

        await delay(2500)

        setItems(prevItems => {
            const updatedItems = [...prevItems];
            updatedItems[0].working = true;
            return updatedItems;
        });

        await delay(2500)

        setItems(prevItems => {
            const updatedItems = [...prevItems];
            updatedItems[0].working = false;
            updatedItems[0].done = true;
            return updatedItems;
        });

        await delay(2500)

        setItems(prevItems => {
            const updatedItems = [...prevItems];
            updatedItems[1].working = true;
            updatedItems[1].done = false;
            return updatedItems;
        });

        await delay(2500)

        setItems(prevItems => {
            const updatedItems = [...prevItems];
            updatedItems[1].working = false;
            updatedItems[1].done = true;
            return updatedItems;
        });

        await delay(2500)

        setItems(prevItems => {
            const updatedItems = [...prevItems];
            updatedItems[2].working = true;
            updatedItems[2].done = false;
            return updatedItems;
        });

        await delay(2500)

        setItems(prevItems => {
            const updatedItems = [...prevItems];
            updatedItems[2].working = false;
            updatedItems[2].done = true;
            return updatedItems;
        });
    }

    const CustomLabel = ({ text, tooltipText }: any) => {
        return (
            <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
                {text}
                <Tooltip title={tooltipText} sx={{ textAlign: "center" }}>
                    <InfoIcon sx={{ fill: '#607d8b', cursor: 'pointer', paddingLeft: '4px' }} />
                </Tooltip>
            </Typography>
        );
    };
    return (
        <Box sx={{
            width: 'auto', gap: '24px', justifyContent: 'flex-start', alignItems: 'center',
            display: 'flex', flexDirection: 'column', flex: 1
        }}>
            <Button size="medium" sx={{ alignSelf: 'flex-start' }}
                onClick={() => { changeCreatePool() }}
                endIcon={<ArrowBackIcon sx={{ fill: '#fff', cursor: 'pointer' }} />}>
                Back
            </Button>
            <Typography variant="h5">Create pool</Typography>
            <Stepper nonLinear activeStep={activeStep} sx={{ width: '100%' }}>
                {steps.map((label, index) => (
                    <Step key={label} completed={completed[index]}>
                        <StepButton color="inherit" onClick={handleStep(index)}>
                            {label}
                        </StepButton>
                    </Step>
                ))}
            </Stepper>
            {activeStep === 0 && <> <TextField
                variant="outlined"
                color="secondary"
                value={strategyType}
                size="medium"
                onChange={(e: any) => { setStrategyType(e.target.value) }}
                select
                sx={{ width: { xs: '100%', sm: '350px' } }}
                label="Strategy type"
                InputLabelProps={{
                    shrink: true
                }}
            >
                <MenuItem key={'manual'} value="Manual">
                    Manual
                </MenuItem>
                <MenuItem key={'governance token'} value="Governance token" disabled>
                    Governance token
                </MenuItem>
                <MenuItem key={'hats protocol'} value="Hats protocol" disabled>
                    Hats protocol
                </MenuItem>
            </TextField>
                <TextField
                    variant="outlined"
                    color="secondary"
                    size="medium"
                    placeholder='Gitcoin Micro Grants'
                    value={poolName}
                    onChange={(e: any) => { setPoolName(e.target.value) }}
                    sx={{ width: { xs: '100%', sm: '350px' } }}
                    label="Pool name"
                    InputLabelProps={{
                        shrink: true
                    }}
                >
                </TextField>
                <TextField
                    variant="outlined"
                    color="secondary"
                    size="medium"
                    placeholder='https://www.website.com'
                    value={website}
                    onChange={(e: any) => { setWebsite(e.target.value) }}
                    sx={{ width: { xs: '100%', sm: '350px' } }}
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
                    sx={{ width: { xs: '100%', sm: '350px' } }}
                    label="Description"
                    InputLabelProps={{
                        shrink: true
                    }}
                >
                </TextField></>}
            {activeStep === 1 && <>
                <TextField
                    variant="outlined"
                    color="secondary"
                    size="medium"
                    placeholder='Pool token address'
                    value={poolTokenAddress}
                    onChange={(e: any) => { setPoolTokenAddress(e.target.value) }}
                    sx={{ width: { xs: '100%', sm: '350px' } }}
                    label={<CustomLabel text={'Pool token address'}
                        tooltipText={'For pool funding, enter the token address. Leave blank for native currency'}></CustomLabel>}
                    InputLabelProps={{
                        shrink: true
                    }}
                >
                </TextField>
                <TextField
                    variant="outlined"
                    color="secondary"
                    size="medium"
                    placeholder='ETH'
                    value={fundPoolAmount}
                    onChange={(e: any) => { setFundPoolAmount(e.target.value) }}
                    sx={{ width: { xs: '100%', sm: '350px' } }}
                    label={<CustomLabel text={'Fund pool amount'} tooltipText={'The amount of tokens to fund the pool with'}></CustomLabel>}
                    InputLabelProps={{
                        shrink: true
                    }}
                >
                </TextField>
                <TextField
                    variant="outlined"
                    color="secondary"
                    size="medium"
                    placeholder='ETH'
                    value={maxGrantAmount}
                    onChange={(e: any) => { setMaxGrantAmount(e.target.value) }}
                    sx={{ width: { xs: '100%', sm: '350px' } }}
                    label={<CustomLabel text={'Max grant amount'} tooltipText={'The max amount that can be requested by an applicant.'}></CustomLabel>}
                    InputLabelProps={{
                        shrink: true
                    }}
                >
                </TextField>
                <TextField
                    variant="outlined"
                    color="secondary"
                    type="number"
                    size="medium"
                    placeholder='ETH'
                    value={approvalThreshold}
                    onChange={handleApprovalThresholdChange}
                    sx={{ width: { xs: '100%', sm: '350px' } }}
                    label={'Approval threshold'}
                    InputLabelProps={{
                        shrink: true
                    }}
                >
                </TextField></>}
            {activeStep === 2 && <><TextField
                variant="outlined"
                color="secondary"
                type="date"
                size="medium"
                sx={{ width: { xs: '100%', sm: '350px' } }}
                value={startDate}
                onChange={(e: any) => { setStartDate(e.target.value) }}
                label={'Start date'}
                InputLabelProps={{
                    shrink: true
                }}
            >
            </TextField>
                <TextField
                    variant="outlined"
                    color="secondary"
                    type="date"
                    size="medium"
                    sx={{ width: { xs: '100%', sm: '350px' } }}
                    value={endDate}
                    onChange={(e: any) => { setEndDate(e.target.value) }}
                    label={'End date'}
                    InputLabelProps={{
                        shrink: true
                    }}
                >
                </TextField>
                <div>
                    <Typography sx={{ maxWidth: '300px' }}>Is a registry profile mandatory for applicants?</Typography>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={stateRegistryMandatory}
                                onChange={(e) => { setStateRegistryMandatory(e.target.checked) }}
                                value="yes"
                                color="secondary"
                            />
                        }
                        label="Yes"
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={!stateRegistryMandatory}
                                onChange={(e) => { setStateRegistryMandatory(!e.target.checked) }}
                                value="no"
                                color="secondary"
                            />
                        }
                        label="No"
                    />
                </div>
                <Box>
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
                disabled={createDisabled}
                size="medium"
                sx={{ alignSelf: 'flex-end' }}
                onClick={() => { handleCreatePool(); setDialogOpen(true) }}
            >
                Create pool
            </Button>

            <BaseDialog steps={items} open={dialogOpen} onClose={() => { setDialogOpen(!dialogOpen) }}
                dialogVariant={'stepper'} status={createPoolTransactionStatus}></BaseDialog>
        </Box >
    );
}