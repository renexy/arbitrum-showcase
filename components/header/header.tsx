import styles from '@/styles/Layout.module.css'
import { AppBar, Avatar, Box, Button, Container, IconButton, Menu, MenuItem, Toolbar, Tooltip, Typography } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu';
import AdbIcon from '@mui/icons-material/Adb';
import { useState } from 'react';

const pages = ['Products', 'Pricing', 'Blog'];
const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

const Header = () => {
    const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    return (<AppBar position="static" sx={{ backgroundColor: "#000", paddingLeft: "12px", paddingRight: "12px" }}>
        <Toolbar sx={{ justifyContent: 'center' }}>
            <Typography
                variant="h3"
                noWrap
                component="a"
                sx={{
                    fontFamily: 'monospace',
                    fontWeight: 900,
                    textDecoration: 'none',
                    display: { xs: 'none', sm: 'block' }
                }}
            >
                WELCOME TO LASHLAB
            </Typography>
            <Typography
                variant="h5"
                noWrap
                component="a"
                sx={{
                    fontFamily: 'monospace',
                    fontWeight: 900,
                    textDecoration: 'none',
                    display: { xs: 'block', sm: 'none' }
                }}
            >
                WELCOME TO LASHLAB
            </Typography>
        </Toolbar>
    </AppBar>
    )
}
export default Header