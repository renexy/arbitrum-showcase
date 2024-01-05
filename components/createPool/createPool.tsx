import * as React from 'react';
import Box from '@mui/material/Box';
import { Alert, Breadcrumbs, Button, Checkbox, FormControlLabel, IconButton, InputAdornment, InputLabel, List, ListItem, ListItemText, MenuItem, Paper, Select, Snackbar, TextField, Tooltip, Typography, styled } from '@mui/material';
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

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

export default function CreatePool({ changeCreatePool }: any) {
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

    const handleFileChange = (event: any) => {
        const file = event.target.files[0];
        // Check if the selected file is a PNG or JPG
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
        } else {
            // Handle the case where the input is not a valid number
        }
    };

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
            width: 'auto', minWidth: '50%', gap: '24px', justifyContent: 'flex-start', alignItems: 'center',
            display: 'flex', flexDirection: 'column', flex: 1
        }}>
            <Button size="small" sx={{ alignSelf: 'flex-start' }}
                onClick={() => { changeCreatePool() }}
                endIcon={<ArrowBackIcon sx={{ fill: '#fff', cursor: 'pointer' }} />}>
                Back
            </Button>
            <Typography variant="h5">Create pool</Typography>
            <TextField
                variant="outlined"
                color="secondary"
                value={strategyType}
                size="small"
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
                <MenuItem key={'governance token'} value="Governance token">
                    Governance token
                </MenuItem>
                <MenuItem key={'hats protocol'} value="Hats protocol">
                    Hats protocol
                </MenuItem>
            </TextField>
            <TextField
                variant="outlined"
                color="secondary"
                size="small"
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
                size="small"
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
                size="small"
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
            </TextField>
            <TextField
                variant="outlined"
                color="secondary"
                size="small"
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
                size="small"
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
                size="small"
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
                size="small"
                placeholder='ETH'
                value={approvalThreshold}
                onChange={handleApprovalThresholdChange}
                sx={{ width: { xs: '100%', sm: '350px' } }}
                label={'Approval threshold'}
                InputLabelProps={{
                    shrink: true
                }}
            >
            </TextField>
            <TextField
                variant="outlined"
                color="secondary"
                type="date"
                size="small"
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
                size="small"
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
                        Upload file
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
        </Box >
    );
}