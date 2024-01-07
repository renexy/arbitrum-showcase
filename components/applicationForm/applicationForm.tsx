import Container from '@/components/container/container';
import { Box, Button, Step, StepButton, Stepper, TextField, Typography } from '@mui/material';
import Head from 'next/head'
import React, { useState } from 'react';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const steps = ['Basic info', 'Grant info'];

export default function ApplicationForm() {
    const [activeStep, setActiveStep] = React.useState(0);
    const handleStep = (step: number) => () => {
        setActiveStep(step);
    };
    const [completed, setCompleted] = React.useState<{
        [k: number]: boolean;
    }>({});

    //Form
    const [name, setName] = useState<string>('')
    const [website, setWebsite] = useState<string>('')
    const [description, setDescription] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [reqAmount, setReqAmount] = useState<string>('')
    const [recipientAddress, setRecipientAddress] = useState<string>('')
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleFileChange = (event: any) => {
        const file = event.target.files[0];
        if (file && (file.type === 'image/png' || file.type === 'image/jpeg')) {
            setSelectedFile(file);
        } else {
            alert('Please select a PNG or JPG file.');
        }
    };

    return (
        <>
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
                    onChange={(e: any) => { setReqAmount(e.target.value) }}
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
                sx={{ alignSelf: 'flex-end' }}
                onClick={() => { alert('apply applicant') }}
            >
                Apply for pool
            </Button>
        </>
    )
}
