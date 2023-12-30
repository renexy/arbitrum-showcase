import * as React from 'react';
import Box from '@mui/material/Box';
import { Alert, Button, IconButton, InputAdornment, InputLabel, List, ListItem, ListItemText, MenuItem, Paper, Select, Snackbar, TextField, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { blueGrey } from '@mui/material/colors';
import BaseDialog from '../baseDialog/baseDialog';
import { useState, useEffect } from 'react'
import { TransactionData } from '@allo-team/allo-v2-sdk/dist/Common/types';
import { useContext } from "react";
import GlobalContext from '../../hooks/context/ContextAggregator';
import { CreateProfileArgs } from '@allo-team/allo-v2-sdk/dist/Registry/types';

export default function CreateProfile() {
    const [profileName, setProfileName] = useState('')
    const [protocol, setProtocol] = useState(1)
    const [ipfsHash, setIpfsHash] = useState('')
    const [owner, setOwner] = useState('')
    const [singleMember, setSingleMember] = useState('')
    const [members, setMembers] = useState<string[]>([])
    const [disabledContinue, setDisabledContinue] = useState(true)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [createProfileTransactionStatus, setCreateProfileTransactionStatus] =
        useState<'confirm' | 'signature' | 'transaction' | 'succeeded' | 'failed'>('confirm')
    const [showSnackbar, setShowsnackbar] = useState(false)

    const useGlobalContext = () => {
        return useContext(GlobalContext);
    };

    const { registry, signer, nonce, refetchProfiles } = useGlobalContext();

    const handleDelete = (memberName: string) => {
        const updatedMembers = members.filter((member) => member !== memberName);
        setMembers(updatedMembers);
    };

    useEffect(() => {
        if (profileName.length > 0 && ipfsHash.length > 0 && owner.length > 0) {
            setDisabledContinue(false)
        } else {
            setDisabledContinue(true)
        }
    }, [profileName, ipfsHash, owner])

    const handleCreateProfile = async (args?: any) => {
        if (args && args === 'restore') {
            setCreateProfileTransactionStatus('confirm')
            return;
        }

        if (!registry || !signer) {
            setShowsnackbar(true)
            setTimeout(() => {
                setShowsnackbar(false)
            }, 5000)
            return;
        }

				console.log("nonce: ", nonce)
        const createProfileArgs: CreateProfileArgs = {
            nonce: nonce + 1,
            name: profileName,
            metadata: {
                protocol: BigInt(protocol),
                pointer: ipfsHash,
            },
            owner: owner,
            members: members,
        };

        try {
            setCreateProfileTransactionStatus('signature'); // State set to 'signature' for user to sign

            const txData: TransactionData = registry.createProfile(createProfileArgs);
            const hash = await signer.sendTransaction({
                data: txData.data,
                to: txData.to,
                value: BigInt(txData.value),
            });

            setCreateProfileTransactionStatus('transaction'); // State set to 'transaction' after signing

            // Listening to the transaction
            try {
                const receipt = await hash.wait(); // Assuming 'hash.wait()' waits for the transaction to complete
                if (receipt.status === 1) {
                    setCreateProfileTransactionStatus('succeeded'); // Transaction succeeded
                    refetchProfiles();
                } else {
                    setCreateProfileTransactionStatus('failed'); // Transaction failed but no error was thrown
                }
            } catch (error) {
                console.error(error);
                setCreateProfileTransactionStatus('failed'); // Transaction failed with an error
            }

        } catch (error) {
            console.log("user rejected"); // User rejected the signature
            setCreateProfileTransactionStatus('failed'); // Setting status to 'failed' as the process did not complete
        }
    }

    return (
        <Box sx={{
            width: 'auto', minWidth: '50%', gap: '18px', justifyContent: 'flex-start',
            display: 'flex', flexDirection: 'column', flex: 1, padding: '40px 20px 20px 20px'
        }}>
            <Typography variant="h5">Create profile</Typography>
            <TextField required label="Profile name" onChange={(e) => { setProfileName(e.target.value) }}
                id="outlined-basic" variant="outlined" color="secondary" sx={{ 'fieldSet': { border: '1px solid grey' } }} />
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', width: '100%' }}>
                <Select
                    sx={{ 'fieldSet': { border: '1px solid grey' } }}
                    color="secondary"
                    value={protocol}
                    inputProps={{
                        name: 'Metadata',
                        id: 'uncontrolled-native',
                    }}
                >
                    <MenuItem value={1} selected>IPFS</MenuItem>
                </Select>
                <TextField
                    required
                    color="secondary"
                    id="outlined-textarea"
                    label="Metadata"
                    onChange={(e) => { setIpfsHash(e.target.value) }}
                    placeholder="Metadata"
                    sx={{ 'fieldSet': { border: '1px solid grey' }, flex: 1 }}
                />
            </div>
            <TextField required label="Owner"
                onChange={(e) => { setOwner(e.target.value) }}
                id="outlined-basic" variant="outlined" color="secondary" sx={{ 'fieldSet': { border: '1px solid grey' } }} />
            <TextField
                id="outlined-adornment-password"
                label="Members"
                variant="outlined"
                value={singleMember}
                color="secondary"
                onChange={(e) => { setSingleMember(e.target.value) }}
                sx={{ 'fieldSet': { border: '1px solid grey' } }}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton onClick={() => { if (singleMember.length > 0) { setMembers([...members, singleMember]); setSingleMember('') } }}
                                edge="end"
                            >
                                <AddIcon sx={{ fill: blueGrey[500] }} />
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
            />
            {members.length > 0 && (
                <List dense sx={{ border: '1px solid grey', borderRadius: '4px', maxHeight: '200px', overflow: 'auto' }}>
                    {members.map((member, index) => (
                        <ListItem key={index}>
                            <ListItemText primary={`${member.substring(0, 3)}...${member.substring(member.length - 3)}`} />
                            <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(member)}>
                                <DeleteIcon />
                            </IconButton>
                        </ListItem>
                    ))}
                </List>
            )}

            <Button variant="contained" color="secondary" disabled={disabledContinue}
                onClick={() => { if (!disabledContinue) { setDialogOpen(!dialogOpen) } }}>Continue</Button>

            <Snackbar
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                open={showSnackbar}
                color="primary"
            >
                <Alert severity="error" sx={{ width: '100%' }}>
                    Please sign in to Metamask!
                </Alert>
            </Snackbar>
            <BaseDialog open={dialogOpen} onClose={() => { setDialogOpen(!dialogOpen) }}
                dialogVariant={'transaction'} status={createProfileTransactionStatus} callback={(e) => { handleCreateProfile(e) }}></BaseDialog>
        </Box >
    );
}