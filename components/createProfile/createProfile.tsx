import * as React from 'react';
import Box from '@mui/material/Box';
import { Button, IconButton, InputAdornment, InputLabel, List, ListItem, ListItemText, Paper, Select, TextField, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { blueGrey } from '@mui/material/colors';
import BaseDialog from '../baseDialog/baseDialog';

export default function CreateProfile() {
    const [value, setValue] = React.useState('one');

    // formcontrol
    const [profileName, setProfileName] = React.useState('')
    const [metaData, setMetaData] = React.useState('')
    const [owner, setOwner] = React.useState('')
    const [singleMember, setSingleMember] = React.useState('')
    const [members, setMembers] = React.useState<string[]>([])
    const [disabledContinue, setDisabledContinue] = React.useState(true)
    const [dialogOpen, setDialogOpen] = React.useState(false)

    const handleDelete = (memberName: string) => {
        const updatedMembers = members.filter((member) => member !== memberName);
        setMembers(updatedMembers);
    };

    React.useEffect(() => {
        if (profileName.length > 0 && metaData.length > 0 && owner.length > 0) {
            setDisabledContinue(false)
        } else {
            setDisabledContinue(true)
        }
    }, [profileName, metaData, owner])

    const handleCreateProfile = async() => {
        // create profile
        console.log("create profile")
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
                    defaultValue={1}
                    sx={{ 'fieldSet': { border: '1px solid grey' } }}
                    color="secondary"
                    inputProps={{
                        name: 'Metadata',
                        id: 'uncontrolled-native',
                    }}
                >
                    <option value={1}>IPFS</option>
                </Select>
                <TextField
                    required
                    color="secondary"
                    id="outlined-textarea"
                    label="Metadata"
                    onChange={(e) => { setMetaData(e.target.value) }}
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
                <List dense sx={{ border: '1px solid grey', borderRadius: '4px' }}>
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

            <BaseDialog open={dialogOpen} onClose={() => { setDialogOpen(!dialogOpen) }} dialogVariant={'transaction'}></BaseDialog>
        </Box>
    );
}