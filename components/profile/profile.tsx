import * as React from 'react';
import Box from '@mui/material/Box';
import { Alert, Button, IconButton, InputAdornment, List, ListItem, ListItemText, Paper, Skeleton, Snackbar, Stack, TextField, Tooltip, Typography } from '@mui/material';
import GlobalContext from '@/hooks/context/ContextAggregator';
import { useContext, useEffect, useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import BaseDialog from '../baseDialog/baseDialog';
import AddIcon from '@mui/icons-material/Add';
import { blueGrey } from '@mui/material/colors';
import shortenEthAddress from '@/global/functions';
import EditIcon from '@mui/icons-material/Edit';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import EditOffIcon from '@mui/icons-material/EditOff';
import { MemberArgs } from '@allo-team/allo-v2-sdk/dist/Registry/types';
import { TransactionData } from '@allo-team/allo-v2-sdk/dist/Common/types';

const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
};

export default function Profile() {
    const [selectedProfile, setSelectedProfile] = useState<TransformedProfile | undefined>(undefined)
    const { registry, signer, userProfiles, hasProfiles, selectedProfileHash, changeSelectedProfileHash } = React.useContext(GlobalContext)
    const [dialogOpenDelete, setDialogOpenDelete] = useState(false)
    const [dialogOpenAdd, setDialogOpenAdd] = useState(false)
    const [createProfileTransactionStatus, setCreateProfileTransactionStatus] =
        useState<'confirm' | 'signature' | 'transaction' | 'succeeded' | 'failed'>('confirm')
    const [showSnackbar, setShowsnackbar] = useState(false)
    const [showSnackbarCopied, setShowsnackbarCopied] = useState(false)
    const [singleMember, setSingleMember] = useState('')
    const [editMode, setEditMode] = useState(false)

    //form
    const [newProfileName, setNewProfileName] = useState('')
    const [newProfileMetadata, setNewProfileMetadata] = useState('')
    const [newProfileMembers, setNewProfileMembers] = useState<Account[]>([])
    const [itemsChanged, setItemsChanged] = useState(false)

    const setInitialValues = () => {
        setSelectedProfile(userProfiles?.find(x => x.anchor === selectedProfileHash))
        setNewProfileName(userProfiles?.find(x => x.anchor === selectedProfileHash)?.name || '')
        setNewProfileMetadata(userProfiles?.find(x => x.anchor === selectedProfileHash)?.pointer || '')
        // setNewProfileMembers(userProfiles?.find(x => x.anchor === selectedProfileHash)?.members || [])
        setNewProfileMembers([])
        setSingleMember('')
    }

    const { fetchProfiles } = useContext(GlobalContext)

    useEffect(() => {
        if (editMode) return
        setInitialValues()
        setItemsChanged(false)
    }, [editMode])

    const handleAddMembers = async (args?: any) => {
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

        const memberArgs: MemberArgs = {
            profileId: selectedProfile?.id || '',
            members: newProfileMembers.map(member => member.address),
        };

        console.log(memberArgs)
        console.log(selectedProfile?.id)
        console.log(newProfileMembers.map(member => member.address), "Necro niga")

        try {
            setCreateProfileTransactionStatus('signature'); // State set to 'signature' for user to sign

            const txData: TransactionData = registry.addMembers(memberArgs);

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
                    fetchProfiles();
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


    useEffect(() => {
        if (!selectedProfile) return;

        const profileNameChanged = newProfileName !== selectedProfile.name;
        const profileMetadataChanged = newProfileMetadata !== selectedProfile.pointer;

        let membersChanged = false;
        if (selectedProfile.members.length !== newProfileMembers.length) {
            membersChanged = true;
        } else if (selectedProfile.members.length > 0) {
            for (let i = 0; i < newProfileMembers.length; i++) {
                if (newProfileMembers[i]?.address !== selectedProfile.members[i]?.address) {
                    membersChanged = true;
                    break;
                }
            }
        } else if (newProfileMembers.length > 0) {
            membersChanged = true;
        }

        setItemsChanged(profileNameChanged || profileMetadataChanged || membersChanged);
    }, [newProfileName, newProfileMetadata, newProfileMembers, selectedProfile]);



    const handleDelete = (memberName: Account) => {
        const updatedMembers = newProfileMembers.filter((member) => member !== memberName);
        setNewProfileMembers(updatedMembers);
    };

    return (
        <Box sx={{
            width: 'auto', minWidth: '100%', gap: '18px', justifyContent: 'flex-start',
            display: 'flex', flexDirection: 'column', flex: 1, padding: '12px'
        }}>
            {!selectedProfile && <Stack spacing={1}>
                <Skeleton variant="rectangular" width={210} height={60} />
                <Skeleton variant="rectangular" width={40} height={40} />
                <Skeleton variant="rectangular" width={210} height={60} />
                <Skeleton variant="rectangular" width={210} height={60} />
                <Skeleton variant="rectangular" width={210} height={60} />
                <Skeleton variant="rectangular" width={210} height={60} />
                <Skeleton variant="rectangular" width={210} height={60} />
                <Skeleton variant="rounded" width={210} height={60} />
            </Stack>
            }
            {selectedProfile && <>
                <Box sx={{
                    width: '100%', minWidth: '100%', display: 'flex', alignItems: 'center',
                    paddingBottom: '16px'
                }}>
                    <TextField
                        id="standard-read-only-input"
                        color='secondary'
                        sx={{ textAlign: 'left', flex: 1 }}
                        value={newProfileName}
                        onChange={(e) => { setNewProfileName(e.target.value) }}
                        InputProps={{
                            readOnly: !editMode,
                            disableUnderline: true,
                            sx: {
                                fontSize: '1.5rem',
                                color: 'rgba(0, 0, 0, 0.6)'
                            }
                        }}
                        variant="standard"
                    />
                    {!editMode && <EditIcon sx={{ fill: '#607d8b', cursor: 'pointer' }} onClick={() => { setEditMode(true) }}></EditIcon>}
                    {editMode && <EditOffIcon sx={{ fill: '#607d8b', cursor: 'pointer' }} onClick={() => { setEditMode(false) }}></EditOffIcon>}
                </Box>
                <Box sx={{
                    width: '100%', minWidth: '100%', gap: '18px', justifyContent: 'flex-start',
                    display: 'flex', flex: 1, flexDirection: { xs: 'column', sm: 'row' }
                }}>
                    <Box sx={{
                        flexDirection: 'column', gap: '18px', justifyContent: 'flex-start',
                        display: 'flex', flex: { xs: 0.2, sm: 0.5 }
                    }}>
                        <div style={{ display: 'flex', gap: '18px', flexWrap: 'wrap', width: '100%' }}>
                            <TextField
                                id="standard-read-only-input"
                                label="Id"
                                color='secondary'
                                sx={{ flex: '1 0 auto', minWidth: '200px' }}
                                value={shortenEthAddress(selectedProfile.id)}
                                InputProps={{
                                    readOnly: true,
                                    endAdornment: (<InputAdornment position="end">
                                        <ContentCopyIcon sx={{ cursor: 'pointer' }}
                                            onClick={() => {
                                                copyToClipboard(selectedProfile.anchor);
                                                setShowsnackbarCopied(true); setTimeout(() => { setShowsnackbarCopied(false) }, 3000)
                                            }} />
                                    </InputAdornment>)
                                }}
                                variant="standard"
                            >
                            </TextField>
                            <TextField
                                id="standard-read-only-input"
                                label="Anchor"
                                color='secondary'
                                sx={{ flex: '1 0 auto', minWidth: '200px' }}
                                value={shortenEthAddress(selectedProfile.anchor)}
                                InputProps={{
                                    readOnly: true,
                                    endAdornment: (<InputAdornment position="end">
                                        <ContentCopyIcon sx={{ cursor: 'pointer' }}
                                            onClick={() => {
                                                copyToClipboard(selectedProfile.anchor);
                                                setShowsnackbarCopied(true); setTimeout(() => { setShowsnackbarCopied(false) }, 3000)
                                            }} />
                                    </InputAdornment>)
                                }}
                                variant="standard"
                            >
                            </TextField>
                            <TextField
                                id="standard-read-only-input"
                                label="Owner"
                                color='secondary'
                                sx={{ flex: '1 0 auto', minWidth: '200px' }}
                                value={shortenEthAddress(selectedProfile.owner)}
                                InputProps={{
                                    readOnly: true,
                                    endAdornment: (<InputAdornment position="end">
                                        <ContentCopyIcon sx={{ cursor: 'pointer' }}
                                            onClick={() => {
                                                copyToClipboard(selectedProfile.owner);
                                                setShowsnackbarCopied(true); setTimeout(() => { setShowsnackbarCopied(false) }, 3000)
                                            }} />
                                    </InputAdornment>)
                                }}
                                variant="standard"
                            />
                        </div>
                        <TextField
                            id="standard-read-only-input"
                            label="IPFS"
                            color='secondary'
                            value={newProfileMetadata}
                            onChange={(e) => { setNewProfileMetadata(e.target.value) }}
                            InputProps={{
                                readOnly: !editMode,
                            }}
                            variant="standard"
                        />
                    </Box>
                    <Box sx={{
                        flexDirection: 'column', gap: '18px', justifyContent: 'flex-start',
                        display: 'flex', flex: { xs: 0.5, sm: 0.5 }
                    }}>
                        <TextField
                            id="outlined-adornment-password"
                            label="Add members"
                            variant="outlined"
                            value={singleMember}
                            color="secondary"
                            onChange={(e) => { setSingleMember(e.target.value) }}
                            sx={{ 'fieldSet': { border: '1px solid grey' } }}
                            InputProps={{
                                readOnly: !editMode,
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={() => {
                                            if (singleMember.length > 0) {
                                                setNewProfileMembers([...newProfileMembers, { address: singleMember, id: '' }]); setSingleMember('')
                                            }
                                        }} edge="end">
                                            <AddIcon sx={{ fill: blueGrey[500] }} />
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <Typography variant="h6" sx={{ textAlign: 'left' }}>Existing members</Typography>
                        {newProfileMembers && newProfileMembers.length > 0 && (
                            <List dense sx={{ border: '1px solid grey', borderRadius: '4px', maxHeight: '200px', overflow: 'auto' }}>
                                {newProfileMembers.map((member, index) => (
                                    <ListItem key={index}>
                                        <ListItemText primary={shortenEthAddress(member.address)} />
                                        {editMode && <IconButton edge="end" aria-label="delete"
                                            onClick={() => handleDelete(member)}>
                                            <DeleteIcon />
                                        </IconButton>}
                                    </ListItem>
                                ))}
                            </List>
                        )}
                    </Box>
                    <BaseDialog open={dialogOpenAdd} onClose={() => { setDialogOpenAdd(!dialogOpenAdd) }}
                        dialogVariant={'transaction'} status={createProfileTransactionStatus} callback={(e) => { alert(e) }}></BaseDialog>
                    <Snackbar
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        open={showSnackbar}
                        color="primary"
                    >
                        <Alert severity="error" sx={{ width: '100%' }}>
                            Please sign in to Metamask!
                        </Alert>
                    </Snackbar>
                    <Snackbar
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        open={showSnackbarCopied}
                        color="secondary"
                    >
                        <Alert severity="success" sx={{ width: '100%' }}>
                            Copied to clipboard!
                        </Alert>
                    </Snackbar>
                </Box>
            </>}
            {editMode && <Box sx={{ display: 'flex', width: '100%', alignItems: 'flex-end', gap: '8px', justifyContent: 'flex-end' }}>
                <Button color="secondary" onClick={() => { setEditMode(false) }}>Reset</Button>
                <Button disabled={!itemsChanged} color="secondary" onClick={() => { setDialogOpenAdd(true) }}>Save</Button>
            </Box>
            }
        </Box >
    );
}