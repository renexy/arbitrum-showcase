import Container from '@/components/container/container';
import { Alert, Autocomplete, Button, InputAdornment, Snackbar, TextField, Typography } from '@mui/material';
import Head from 'next/head'
import AddIcon from '@mui/icons-material/Add';
import React, { useEffect, useState } from 'react';
import { blueGrey, green, red } from '@mui/material/colors';
import { TPoolData } from '@/types/typesPool';
import { ethers } from 'ethers';
import { convertUnixTimestamp } from '@/global/functions';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import Image from "next/image"
import BaseDialog from '../baseDialog/baseDialog';

const fallbackImageURL = 'https://d1xv5jidmf7h0f.cloudfront.net/circleone/images/products_gallery_images/Welcome-Banners_12301529202210.jpg';

const weiToEth = (weiValue: any) => {
    if (!weiValue) return "0.0 ETH";

    const ethValue = ethers.utils.formatEther(weiValue);
    if (ethValue && ethValue.length > 11) {

        return ethValue.slice(0, 5);
    }

    return `${ethValue} ETH`;
};

const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
};

const convertToShorter = (text: string) => {
    if (text && text.length > 25)
        return text.substring(0, 18) + '...'
    else return text
}
export default function DisplayPoolInfo({ selectedPool, active }: { selectedPool: TPoolData, active: boolean }) {
    const [showSnackbarCopied, setShowsnackbarCopied] = useState(false)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [createProfileTransactionStatus, setCreateProfileTransactionStatus] =
        useState<'confirm' | 'signature' | 'transaction' | 'succeeded' | 'failed'>('confirm')
    const [amount, setAmount] = useState<number>(0);

    const handleFundPool = (args?: any) => {
        if (args && args === 'restore') {
            setCreateProfileTransactionStatus('confirm')
            return;
        }
    }
    return (<>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
            <TextField
                id="standard-read-only-input"
                color='secondary'
                sx={{ textAlign: 'left', border: 'none', flex: 1 }}
                value={convertToShorter(selectedPool?.pool?.metadata?.name) || '/'}
                InputProps={{
                    readOnly: true,
                    disabled: true,
                    disableUnderline: true,
                    sx: {
                        fontSize: '1.5rem',
                        color: 'rgba(0, 0, 0, 0.6)'
                    }
                }}
                InputLabelProps={{ shrink: true }}
                variant="standard"
            />
            <Button variant="outlined" sx={{ background: active ? green[300] : red[300] }} color="secondary"
                disabled>
                <Typography sx={{ color: 'white', fontWeight: 'bold', fontSize: '1rem' }}>{active ? 'ACTIVE' : 'INACTIVE'}</Typography>
            </Button>
        </div>
        <TextField
            id="standard-read-only-input"
            color='secondary'
            label='Description'
            sx={{ textAlign: 'left', border: 'none' }}
            value={selectedPool?.pool.metadata?.description}
            InputProps={{
                readOnly: true,
                disabled: true,
                sx: {
                    fontSize: '1.5rem',
                    color: 'rgba(0, 0, 0, 0.6)'
                }
            }}
            InputLabelProps={{ shrink: true }}
            variant="standard"
        />
        <div style={{ display: 'flex', gap: '18px', flexWrap: 'wrap', width: '100%' }}>
            <TextField
                id="standard-read-only-input"
                label="Strategy type"
                color='secondary'
                sx={{ flex: '1 0 auto', minWidth: '200px' }}
                value={'Manual'}
                InputProps={{
                    readOnly: true,
                    disabled: true,
                    endAdornment: (<InputAdornment position="end">
                        <ContentCopyIcon sx={{ cursor: 'pointer', height: '12px' }}
                            onClick={() => {
                                copyToClipboard('Manual');
                                setShowsnackbarCopied(true); setTimeout(() => { setShowsnackbarCopied(false) }, 3000)
                            }} />
                    </InputAdornment>)
                }}
                InputLabelProps={{ shrink: true }}
                variant="standard"
            >
            </TextField>
            <TextField
                id="standard-read-only-input"
                label="Website"
                color='secondary'
                sx={{ flex: '1 0 auto', minWidth: '200px' }}
                value={convertToShorter(selectedPool?.pool?.metadata?.website)}
                InputProps={{
                    readOnly: true,
                    disabled: true,
                    endAdornment: (<InputAdornment position="end">
                        <ContentCopyIcon sx={{ cursor: 'pointer', height: '12px' }}
                            onClick={() => {
                                copyToClipboard(selectedPool?.pool?.metadata?.website);
                                setShowsnackbarCopied(true); setTimeout(() => { setShowsnackbarCopied(false) }, 3000)
                            }} />
                    </InputAdornment>)
                }}
                InputLabelProps={{ shrink: true }}
                variant="standard"
            >
            </TextField>
            <TextField
                id="standard-read-only-input"
                label={'Profile ID'}
                color='secondary'
                sx={{ flex: '1 0 auto', minWidth: '200px' }}
                value={convertToShorter(selectedPool?.pool?.metadata?.profileId)}
                InputProps={{
                    readOnly: true,
                    disabled: true, endAdornment: (<InputAdornment position="end">
                        <ContentCopyIcon sx={{ cursor: 'pointer', height: '12px' }}
                            onClick={() => {
                                copyToClipboard(selectedPool?.pool?.metadata?.profileId);
                                setShowsnackbarCopied(true); setTimeout(() => { setShowsnackbarCopied(false) }, 3000)
                            }} />
                    </InputAdornment>)
                }}
                InputLabelProps={{ shrink: true }}
                variant="standard"
            />
        </div>
        <div style={{ display: 'flex', gap: '18px', flexWrap: 'wrap', width: '100%' }}>
            <TextField
                id="standard-read-only-input"
                label={'Pool amount'}
                color='secondary'
                sx={{ flex: '1 0 auto', minWidth: '200px' }}
                value={weiToEth(selectedPool?.pool?.amount)}
                InputProps={{
                    readOnly: true,
                    disabled: true
                }}
                InputLabelProps={{ shrink: true }}
                variant="standard"
            />
            <TextField
                id="standard-read-only-input"
                label={'Max. allocation '}
                color='secondary'
                sx={{ flex: '1 0 auto', minWidth: '200px' }}
                value={weiToEth(selectedPool?.maxRequestedAmount)}
                InputProps={{
                    readOnly: true,
                    disabled: true,
                }}
                InputLabelProps={{ shrink: true }}
                variant="standard"
            />
            <TextField
                id="standard-read-only-input"
                label={'Threshold'}
                color='secondary'
                sx={{ flex: '1 0 auto', minWidth: '200px' }}
                value={selectedPool?.approvalThreshold}
                InputProps={{
                    readOnly: true,
                    disabled: true,
                }}
                InputLabelProps={{ shrink: true }}
                variant="standard"
            />
        </div>

        <div style={{ display: 'flex', gap: '18px', flexWrap: 'wrap', width: '100%' }}>
            <TextField
                id="standard-read-only-input"
                label={'End date'}
                color='secondary'
                sx={{ flex: '1 0 auto', minWidth: '200px' }}
                value={convertUnixTimestamp(selectedPool.allocationEndTime)}
                InputProps={{
                    readOnly: true,
                    disabled: true,
                }}
                InputLabelProps={{ shrink: true }}
                variant="standard"
            />
            <Snackbar
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                open={showSnackbarCopied}
                color="secondary"
            >
                <Alert severity="success" sx={{ width: '100%' }}>
                    Copied to clipboard!
                </Alert>
            </Snackbar>
        </div>

        <BaseDialog open={dialogOpen} amount={amount} changeAmount={(am: number) => setAmount(am)}
            onClose={() => { setDialogOpen(!dialogOpen) }} message='Fund pool'
            dialogVariant={'transactionAmount'} status={createProfileTransactionStatus} callback={(e) => { handleFundPool(e) }}></BaseDialog>
    </>
    )
}
