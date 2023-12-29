import * as React from 'react';
import Box from '@mui/material/Box';
import { Alert, Button, IconButton, InputAdornment, List, ListItem, ListItemText, Paper, Skeleton, Snackbar, Stack, TextField, Typography } from '@mui/material';
import GlobalContext from '@/hooks/context/ContextAggregator';
import { useEffect, useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import BaseDialog from '../baseDialog/baseDialog';
import AddIcon from '@mui/icons-material/Add';
import { blueGrey } from '@mui/material/colors';

export default function Profile() {
    const [selectedProfile, setSelectedProfile] = useState<TransformedProfile | undefined>(undefined)
    const { registry, signer, userProfiles, hasProfiles, selectedProfileHash, changeSelectedProfileHash } = React.useContext(GlobalContext)
    const [dialogOpenDelete, setDialogOpenDelete] = useState(false)
    const [dialogOpenAdd, setDialogOpenAdd] = useState(false)
    const [createProfileTransactionStatus, setCreateProfileTransactionStatus] =
        useState<'confirm' | 'signature' | 'transaction' | 'succeeded' | 'failed'>('confirm')
    const [showSnackbar, setShowsnackbar] = useState(false)
    const [singleMember, setSingleMember] = useState('')

    useEffect(() => {
        if (!hasProfiles) return
        if (!selectedProfileHash) return
        setSelectedProfile(userProfiles?.find(x => x.anchor === selectedProfileHash))
    }, [userProfiles, hasProfiles, selectedProfileHash])

    const handleDeleteMember = async (args?: any) => {
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

        // const createProfileArgs = {
        //     nonce: nonce,
        //     name: profileName,
        //     metadata: {
        //         protocol: BigInt(protocol),
        //         pointer: ipfsHash,
        //     },
        //     owner: owner,
        //     members: members,
        // };

        try {
            setCreateProfileTransactionStatus('signature');

            // const txData = registry.createProfile(createProfileArgs);
            // const hash = await signer.sendTransaction({
            //     data: txData.data,
            //     to: txData.to,
            //     value: BigInt(txData.value),
            // });

            setCreateProfileTransactionStatus('transaction'); // State set to 'transaction' after signing

            // Listening to the transaction
            try {
                // const receipt = await hash.wait(); // Assuming 'hash.wait()' waits for the transaction to complete
                // if (receipt.status === 1) {
                //     setCreateProfileTransactionStatus('succeeded'); // Transaction succeeded
                //     fetchProfiles();
                // } else {
                //     setCreateProfileTransactionStatus('failed'); // Transaction failed but no error was thrown
                // }
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
            width: 'auto', minWidth: '100%', gap: '18px', justifyContent: 'flex-start',
            display: 'flex', flexDirection: 'column', flex: 1, padding: '40px 20px 20px 20px'
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
                    width: '100%', minWidth: '100%', gap: '18px', justifyContent: 'flex-start',
                    display: 'flex', flex: 1, flexDirection: { xs: 'column', sm: 'row' }
                }}>
                    <Box sx={{
                        flexDirection: 'column', gap: '18px', justifyContent: 'flex-start',
                        display: 'flex', flex: { xs: 1, sm: 0.5 }
                    }}>
                        <TextField
                            id="standard-read-only-input"
                            label="Anchor"
                            color='secondary'
                            value={selectedProfile.anchor}
                            InputProps={{
                                readOnly: true,
                            }}
                            variant="standard"
                        />
                        <TextField
                            id="standard-read-only-input"
                            label="Name"
                            color='secondary'
                            value={selectedProfile.name}
                            InputProps={{
                                readOnly: true,
                            }}
                            variant="standard"
                        />
                        <TextField
                            id="standard-read-only-input"
                            label="Owner"
                            color='secondary'
                            value={selectedProfile.owner}
                            InputProps={{
                                readOnly: true,
                            }}
                            variant="standard"
                        />
                        <TextField
                            id="standard-read-only-input"
                            label="Protocol"
                            color='secondary'
                            value={selectedProfile?.protocol}
                            InputProps={{
                                readOnly: true,
                            }}
                            variant="standard"
                        />
                        <TextField
                            id="standard-read-only-input"
                            label="Pointer"
                            color='secondary'
                            value={selectedProfile?.pointer}
                            InputProps={{
                                readOnly: true,
                            }}
                            variant="standard"
                        />
                        <TextField
                            id="outlined-adornment-password"
                            label="Add members"
                            variant="outlined"
                            value={singleMember}
                            color="secondary"
                            onChange={(e) => { setSingleMember(e.target.value) }}
                            sx={{ 'fieldSet': { border: '1px solid grey' } }}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={() => { setDialogOpenAdd(!dialogOpenAdd) }}
                                            edge="end">
                                            <AddIcon sx={{ fill: blueGrey[500] }} />
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Box>
                    <Box sx={{
                        flexDirection: 'column', gap: '18px', justifyContent: 'flex-start',
                        display: 'flex', flex: { xs: 1, sm: 0.5 }
                    }}>
                        <Typography variant="h6" sx={{ textAlign: 'left' }}>Existing members</Typography>
                        {selectedProfile?.members?.length > 0 && (
                            <List dense sx={{ border: '1px solid grey', borderRadius: '4px' }}>
                                {selectedProfile?.members.map((member, index) => (
                                    <ListItem key={index}>
                                        <ListItemText primary={`${member.address.substring(0, 3)}...${member.address.substring(member.address.length - 3)}`} />
                                        <IconButton edge="end" aria-label="delete" onClick={() => { setDialogOpenDelete(!dialogOpenDelete) }}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </ListItem>
                                ))}
                            </List>
                        )}
                    </Box>
                    <BaseDialog open={dialogOpenDelete} onClose={() => { setDialogOpenDelete(!dialogOpenDelete) }}
                        dialogVariant={'transaction'} status={createProfileTransactionStatus} callback={(e) => { handleDeleteMember(e) }}></BaseDialog>
                    <BaseDialog open={dialogOpenAdd} onClose={() => { setDialogOpenAdd(!dialogOpenAdd) }}
                        dialogVariant={'transaction'} status={createProfileTransactionStatus} callback={(e) => { handleDeleteMember(e) }}></BaseDialog>
                    <Snackbar
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        open={showSnackbar}
                        color="primary"
                    >
                        <Alert severity="error" sx={{ width: '100%' }}>
                            Please sign in to Metamask!
                        </Alert>
                    </Snackbar>
                </Box>
            </>}
        </Box >
    );
}