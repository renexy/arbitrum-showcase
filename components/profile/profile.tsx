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
import { MemberArgs, ProfileMetadataArgs, ProfileNameArgs, ProfileAndAddressArgs } from '@allo-team/allo-v2-sdk/dist/Registry/types';
import { TransactionData } from '@allo-team/allo-v2-sdk/dist/Common/types';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import { ethers } from 'ethers'

const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
};

export default function Profile() {
    const [selectedProfile, setSelectedProfile] = useState<TransformedProfile | undefined>(undefined)
    const { registry, signer, userProfiles, hasProfiles, selectedProfileHash } = React.useContext(GlobalContext)
    const [dialogOpenAdd, setDialogOpenAdd] = useState(false)
    const [createProfileTransactionStatus, setCreateProfileTransactionStatus] =
        useState<'confirm' | 'signature' | 'transaction' | 'succeeded' | 'failed'>('confirm')
    const [showSnackbar, setShowsnackbar] = useState(false)
    const [showSnackbarCopied, setShowsnackbarCopied] = useState(false)
    const [showSnackbarMemberExists, setShowSnackbarMemberExists] = useState(false)
    const [singleMember, setSingleMember] = useState('')
    const [editMode, setEditMode] = useState(false)

    //form
    const [newProfileName, setNewProfileName] = useState('')
    const [newProfileMetadata, setNewProfileMetadata] = useState('')
    const [newProfileMembers, setNewProfileMembers] = useState<Account[]>([])
    const [newOwner, setNewOwner] = useState<string>('')
    const [membersToAdd, setMembersToAdd] = useState<Account[]>([])
    const [membersToRemove, setMembersToRemove] = useState<Account[]>([])
    const [itemsChanged, setItemsChanged] = useState(false)
    const [dialogMessage, setDialogMessage] = useState<string>('Apply changes')

    const setInitialValues = () => {
        setSelectedProfile(userProfiles?.find(x => x.anchor === selectedProfileHash))
        setNewProfileName(userProfiles?.find(x => x.anchor === selectedProfileHash)?.name || '')
        setNewProfileMetadata(userProfiles?.find(x => x.anchor === selectedProfileHash)?.pointer || '')
        setNewProfileMembers(userProfiles?.find(x => x.anchor === selectedProfileHash)?.members || [])
        setNewOwner(userProfiles?.find(x => x.anchor === selectedProfileHash)?.owner || '')
        setMembersToAdd([])
        setMembersToRemove([])
        setSingleMember('')
    }

    const { refetchProfiles } = useContext(GlobalContext)

    useEffect(() => {
        setInitialValues()
    }, [selectedProfileHash])

    useEffect(() => {
        if (editMode) return
        setInitialValues()
        setItemsChanged(false)
    }, [editMode])

    const handleNameUpdate = async (registry: any, signer: any) => {
        // this var holds the new name
        var newProfileNameAdd = newProfileName

        if (newProfileNameAdd === selectedProfile?.name) {
            return;
        }
        console.log("newProfileNameAdd", newProfileNameAdd)
        console.log("selectedProfile", selectedProfile?.name)

        const nameArgs: ProfileNameArgs = {
            profileId: selectedProfile?.id || '',
            name: newProfileNameAdd,
        };

        try {
            setCreateProfileTransactionStatus('signature'); // State set to 'signature' for user to sign

            const txData: TransactionData = registry.updateProfileName(nameArgs);

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

    const handleMetadataUpdate = async (registry: any, signer: any) => {
        // this var holds the new metadata
        var newProfileMetadataAdd = newProfileMetadata

        if (newProfileMetadataAdd === selectedProfile?.pointer) {
            return;
        }

        const metadataArgs: ProfileMetadataArgs = {
            profileId: selectedProfile?.id || '',
            metadata: {
                protocol: BigInt(Number(selectedProfile?.protocol)),
                pointer: newProfileMetadataAdd,
            },
        };

        try {
            setCreateProfileTransactionStatus('signature'); // State set to 'signature' for user to sign

            const txData: TransactionData = registry.updateProfileMetadata(metadataArgs);

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

    const handleMembersAddition = async (registry: any, signer: any) => {
        const memberArgs: MemberArgs = {
            profileId: selectedProfile?.id || '',
            members: membersToAdd.map(x => x.address)
        };

        console.log(memberArgs)
        console.log(selectedProfile?.id)
        console.log(newProfileMembers.map(member => member.address))

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

    const handleMembersDeletion = async (registry: any, signer: any) => {

        const memberArgs: MemberArgs = {
            profileId: selectedProfile?.id || '',
            members: membersToRemove.map(member => member.address),
        };

        console.log(memberArgs)
        console.log(selectedProfile?.id)
        console.log(newProfileMembers.map(member => member.address))

        try {
            setCreateProfileTransactionStatus('signature'); // State set to 'signature' for user to sign

            const txData: TransactionData = registry.removeMembers(memberArgs);

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

    const handleOwnerTransfer = async (registry: any, signer: any) => {
        if (newOwner === selectedProfile?.owner) {
            return;
        }

        const profilePendingOwnerArgs: ProfileAndAddressArgs = {
            profileId: selectedProfile?.id || '',
            account: newOwner,
        };

        console.log(profilePendingOwnerArgs)
        console.log(selectedProfile?.id)
        console.log(newProfileMembers.map(member => member.address))

        try {
            setCreateProfileTransactionStatus('signature'); // State set to 'signature' for user to sign

            const txData: TransactionData = registry.updateProfilePendingOwner(profilePendingOwnerArgs);

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

    const handleUpdate = async (args?: any) => {
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

        if (membersToRemove.length > 0)
            handleMembersDeletion(registry, signer)

        if (membersToAdd.length > 0)
            handleMembersAddition(registry, signer)

        handleNameUpdate(registry, signer)

        handleMetadataUpdate(registry, signer)

        handleOwnerTransfer(registry, signer)
    }

    useEffect(() => {
        if (!selectedProfile) return;

        const profileNameChanged = newProfileName !== selectedProfile.name;
        setDialogMessage('Change profile name?')
        const profileMetadataChanged = newProfileMetadata !== selectedProfile.pointer;
        const ownerChanged = newOwner !== selectedProfile.owner

        let membersChanged = false;
        if (membersToAdd.length > 0 || membersToRemove.length > 0) {
            membersChanged = true;
        } else {
            membersChanged = false;
        }
        let message = '';

        if (profileNameChanged) {
            message += 'Change profile name? ';
        }
        if (profileMetadataChanged) {
            message += 'Change profile metadata? ';
        }
        if (ownerChanged) {
            message += 'Change owner of profile? ';
        }
        if (membersChanged) {
            message += 'Change members? ';
        }

        setDialogMessage(message.trim());

        setItemsChanged(profileNameChanged || profileMetadataChanged || membersChanged || ownerChanged);
    }, [newProfileName, newProfileMetadata, newProfileMembers, selectedProfile, newOwner]);

    const handleAddMember = () => {
        if (singleMember.length > 0) {
            if (selectedProfile?.members && selectedProfile.members.length > 0) {
                if (!(selectedProfile.members.find(x => x.address === singleMember)) && !(membersToAdd.find(x => x.address === singleMember))) {
                    setMembersToAdd([...membersToAdd, { address: singleMember, id: '' }]);
                    setNewProfileMembers([...newProfileMembers, { address: singleMember, id: '' }])
                } else {
                    setShowSnackbarMemberExists(true)
                    setTimeout(() => {
                        setShowSnackbarMemberExists(false);
                    }, 3000);
                }
            } else {
                if (!membersToAdd.find(x => x.address === singleMember)) {
                    setMembersToAdd([...membersToAdd, { address: singleMember, id: '' }]);
                    setNewProfileMembers([...newProfileMembers, { address: singleMember, id: '' }])
                } else {
                    setShowSnackbarMemberExists(true)
                    setTimeout(() => {
                        setShowSnackbarMemberExists(false);
                    }, 3000);
                }
            }
            setSingleMember('')
        }
    }

    const handleRemoveMember = (member: Account) => {
        var foundMember = selectedProfile?.members.find(x => x.address === member.address)
        if (foundMember) {
            var deleteMember = selectedProfile?.members.filter((x) => x.address !== member.address)
            if (deleteMember) {
                setMembersToRemove([...membersToRemove, { address: member.address, id: '' }])
                var deleteDisplayedMembers = newProfileMembers.filter((x) => x.address !== member.address)
                setNewProfileMembers(deleteDisplayedMembers)
            }
        }
        var foundInTempList = membersToAdd?.find(x => x.address === member.address)
        if (foundInTempList) {
            var deleteMemberTemp = membersToAdd?.filter((x) => x.address !== member.address)
            if (deleteMemberTemp) {
                setMembersToAdd(deleteMemberTemp)
                var deleteDisplayedMembers = newProfileMembers.filter((x) => x.address !== member.address)
                setNewProfileMembers(deleteDisplayedMembers)
            }
        }
    }

    const test = async (registry: any, signer: any) => {

        const rpc = 'https://rpc.goerli.eth.gateway.fm'
        const customProvider = new ethers.providers.JsonRpcProvider(rpc);
        const contractAddress = registry.contract.address;
        const contractAbi = registry.contract.abi
        const readOnlyContract = new ethers.Contract(contractAddress, contractAbi, customProvider);

        const result = await readOnlyContract.profileIdToPendingOwner("0x9a76bac33297c5ea03f20c74ee76525359d4d408327650cfc71973d3e57d0dee")
        console.log("result", result)
    }

    return (
        <Box sx={{
            width: 'auto', minWidth: '100%', gap: '18px', justifyContent: 'flex-start',
            display: 'flex', flexDirection: 'column', flex: 1, padding: '12px', overflow: 'auto'
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
                            disabled: !editMode,
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
                    display: 'flex', flex: 1, flexDirection: 'column'
                }}>
                    <Box sx={{
                        flexDirection: 'column', gap: '18px', justifyContent: 'flex-start',
                        display: 'flex', flex: 0.2
                    }}>
                        <div style={{ display: 'flex', gap: '18px', flexWrap: 'wrap', width: '100%' }}>
                            <TextField
                                id="standard-read-only-input"
                                label="Id"
                                color='secondary'
                                sx={{ flex: '1 0 auto', minWidth: '200px' }}
                                value={selectedProfile?.id && selectedProfile.id.length > 9 ? shortenEthAddress(selectedProfile.id) : selectedProfile?.id}
                                InputProps={{
                                    readOnly: true,
                                    disabled: true,
                                    endAdornment: (<InputAdornment position="end">
                                        <ContentCopyIcon sx={{ cursor: 'pointer', height: '12px' }}
                                            onClick={() => {
                                                copyToClipboard(selectedProfile.id);
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
                                value={selectedProfile?.anchor && selectedProfile.anchor.length > 9 ? shortenEthAddress(selectedProfile.anchor) : selectedProfile?.anchor}
                                InputProps={{
                                    readOnly: true,
                                    disabled: true,
                                    endAdornment: (<InputAdornment position="end" sx={{ display: 'flex', gap: '4px' }}>
                                        <ContentCopyIcon sx={{ cursor: 'pointer', height: '12px' }}
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
                                value={newOwner}
                                onChange={(e) => { setNewOwner(e.target.value) }} InputProps={{
                                    readOnly: !editMode,
                                    disabled: !editMode,
                                    endAdornment: (<InputAdornment position="end" sx={{ display: 'flex', gap: '4px' }}>
                                        <Tooltip title="Transfer ownership">
                                            <SwapHorizIcon sx={{ cursor: 'pointer', height: '14px' }} onClick={() => { console.log('transfer') }}></SwapHorizIcon>
                                        </Tooltip>
                                        <ContentCopyIcon sx={{ cursor: 'pointer', height: '12px' }}
                                            onClick={() => {
                                                copyToClipboard(selectedProfile.owner);
                                                setShowsnackbarCopied(true);
                                                setTimeout(() => { setShowsnackbarCopied(false) }, 3000)
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
                                disabled: !editMode,
                            }}
                            variant="standard"
                        />
                    </Box>
                    <Box sx={{
                        flexDirection: 'column', gap: '18px', justifyContent: 'flex-start',
                        display: 'flex', flex: 0.8
                    }}>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '20px',
                            '@media (min-width: 600px)': {
                                flexDirection: 'row',
                            },
                        }}>
                            {/* First Section */}
                            <div style={{ display: 'flex', flexDirection: 'column', flex: 1, gap: '8px' }}>
                                <Typography variant="h6" sx={{ textAlign: 'left' }}>Existing members</Typography>
                                {newProfileMembers && newProfileMembers.length > 0 ? (
                                    <List dense sx={{ border: '1px solid grey', borderRadius: '4px', height: '180px', overflow: 'auto' }}>
                                        {newProfileMembers.map((member, index) => (
                                            <ListItem key={index}>
                                                <ListItemText primary={member?.address && member.address.length > 9 ? shortenEthAddress(member.address) : member?.address} />
                                                {editMode && <IconButton edge="end" aria-label="delete" onClick={() => handleRemoveMember(member)}>
                                                    <DeleteIcon />
                                                </IconButton>}
                                            </ListItem>
                                        ))}
                                    </List>
                                ) : (<span style={{ textAlign: 'left' }}>No members</span>)}

                                <TextField
                                    id="outlined-adornment-password"
                                    label="Add members"
                                    variant="outlined"
                                    value={singleMember}
                                    color="secondary"
                                    onChange={(e) => { setSingleMember(e.target.value) }}
                                    sx={{ 'fieldSet': { border: '1px solid grey' } }}
                                    InputLabelProps={{
                                        style: {
                                            color: !editMode ? 'rgba(0, 0, 0, 0.38)' : 'unset'
                                        }
                                    }}
                                    InputProps={{
                                        readOnly: !editMode,
                                        disabled: !editMode,
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton onClick={() => { handleAddMember() }} edge="end">
                                                    {editMode && <AddIcon sx={{ fill: blueGrey[500] }} />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </div>
                        </Box>
                    </Box>
                    <button onClick={() => {test(registry, signer)}}>test</button>
                    <BaseDialog open={dialogOpenAdd} onClose={() => { setDialogOpenAdd(!dialogOpenAdd) }}
                        dialogVariant={'transaction'} status={createProfileTransactionStatus} callback={(e) => { handleUpdate(e) }}
                        message={dialogMessage}></BaseDialog>
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
                    <Snackbar
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        open={showSnackbarMemberExists}
                        color="secondary"
                    >
                        <Alert severity="warning" sx={{ width: '100%' }}>
                            Member already exists!
                        </Alert>
                    </Snackbar>
                </Box>
            </>}
            {
                editMode && <Box sx={{ display: 'flex', width: '100%', alignItems: 'flex-end', gap: '8px', justifyContent: 'flex-end' }}>
                    <Button color="secondary" onClick={() => { setEditMode(false) }}>Reset</Button>
                    <Button disabled={!itemsChanged} color="secondary" onClick={() => { setDialogOpenAdd(true) }}>Save</Button>
                    <Button onClick={() => { handleMembersDeletion(registry, signer) }}>Test</Button>
                </Box>
            }
        </Box >
    );
}