import * as React from 'react';
import { styled, useTheme, Theme, CSSObject } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import FolderIcon from '@mui/icons-material/Folder';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import { blueGrey, grey } from '@mui/material/colors';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import FormControl from '@mui/material/FormControl';
import Profile from '../profile/profile';
import Pool from '../pool/pool';
import { Button, Fab, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { CreateProfileArgs } from '@allo-team/allo-v2-sdk/dist/Registry/types';
import BaseDialog from '../baseDialog/baseDialog';
import CreateProfile from '../createProfile/createProfile';
import GlobalContext from '@/hooks/context/ContextAggregator';

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
}

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        ...(open && {
            ...openedMixin(theme),
            '& .MuiDrawer-paper': openedMixin(theme),
        }),
        ...(!open && {
            ...closedMixin(theme),
            '& .MuiDrawer-paper': closedMixin(theme),
        }),
    }),
);

export default function Container() {
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);
    const [menuSelected, setMenuSelected] = React.useState("")
    const { userProfiles, hasProfiles, selectedProfileHash, changeSelectedProfileHash } = React.useContext(GlobalContext)

    React.useEffect(() => {
        if (hasProfiles && userProfiles && userProfiles.length > 0) {
            if (!selectedProfileHash) {
                changeSelectedProfileHash(userProfiles[0].anchor)
                setMenuSelected('Profile')
            }
        }
    }, [userProfiles, hasProfiles, selectedProfileHash, changeSelectedProfileHash])

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const handleChange = (event: SelectChangeEvent) => {
        const selectedValue = event.target.value;
        if (selectedValue === 'Create') {
            setMenuSelected('Create')
        } else {
            changeSelectedProfileHash(selectedValue);
        }
    };

    return (
        <Box sx={{ display: 'flex', height: '100dvh' }}>
            <CssBaseline />
            <AppBar position="fixed" open={open} sx={{
                backgroundColor: "#eeeeee", color: 'rgba(0, 0, 0, 0.54)',
            }}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        sx={{
                            marginRight: 5,
                            ...(open && { display: 'none' }),
                        }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div" sx={{ color: blueGrey[500], flex: 1 }}>
                        Allocade
                    </Typography>

                    <ConnectButton />
                </Toolbar>
            </AppBar>
            <Drawer variant="permanent" open={open}>
                <DrawerHeader>
                    {userProfiles && userProfiles.length > 0 ? <FormControl sx={{ flex: 1 }}>
                        <Select
                            sx={{ '.MuiOutlinedInput-notchedOutline': { border: 'none' }, color: grey[600] }}
                            value={selectedProfileHash || ''}
                            color="secondary"
                            onChange={handleChange}
                            displayEmpty
                            inputProps={{ 'aria-label': 'Without label' }}
                        >
                            {userProfiles.map((item) => {
                                return <MenuItem key={item.anchor} value={item.anchor}>{item.name}</MenuItem>
                            })}
                            <MenuItem key="create" value={"Create"} sx={{ gap: '12px' }}>
                                <Fab size="small" color="secondary" aria-label="add" sx={{ alignSelf: 'flex-end', height: '25px', width: '25px', minHeight: '20px' }}>
                                    <AddIcon sx={{ fill: 'white' }} />
                                </Fab>Create profile</MenuItem>
                        </Select>
                    </FormControl> : <Button sx={{ flex: 1 }} variant="outlined" color="secondary" onClick={() => { setMenuSelected('Create') }}>Create profile</Button>
                    }
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                    </IconButton>
                </DrawerHeader>
                <Divider />
                <List>
                    {['Profile', 'Pool'].map((text, index) => (
                        <ListItem key={text} disablePadding sx={{ display: 'block' }} onClick={() => { if (selectedProfileHash) { setMenuSelected(text) } }}>
                            <ListItemButton disabled={!selectedProfileHash}
                                sx={{
                                    minHeight: 48,
                                    justifyContent: open ? 'initial' : 'center',
                                    px: 2.5,
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        minWidth: 0,
                                        mr: open ? 3 : 'auto',
                                        justifyContent: 'center',
                                    }}
                                >
                                    {text === 'Profile' ? <AccountBoxIcon sx={{ fill: menuSelected === text ? '#607d8b' : '' }} /> :
                                        <FolderIcon sx={{ fill: menuSelected === text ? '#607d8b' : '' }} />}
                                </ListItemIcon>
                                <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} className={`${text === menuSelected ? 'selected' : ''}`} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
                <Divider />
                <List>
                    {['Contact us'].map((text, index) => (
                        <ListItem key={text} disablePadding sx={{ display: 'block' }}>
                            <ListItemButton
                                onClick={() => { window.open('mailto:heisen.burger@gmail.com') }}
                                sx={{
                                    minHeight: 48,
                                    justifyContent: open ? 'initial' : 'center',
                                    px: 2.5,
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        minWidth: 0,
                                        mr: open ? 3 : 'auto',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <MailIcon />
                                </ListItemIcon>
                                <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Drawer>

            <Box component="main" sx={{
                flexGrow: 1, flex: 1, p: 3, display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', textAlign: 'center'
            }}>
                <DrawerHeader />
                {!menuSelected && !selectedProfileHash && <Typography variant="h5" paragraph sx={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                    You don&apos;t have any profiles. Click &apos;Create profile&apos; in top left corner to start.
                </Typography>
                }
                {menuSelected === 'Profile' && <Profile />}
                {menuSelected === 'Pool' && <Pool />}
                {menuSelected === 'Create' && <CreateProfile></CreateProfile>}
            </Box>
        </Box>
    );
}