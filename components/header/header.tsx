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

    return (<AppBar position="static" sx={{ backgroundColor: "#eeeeee", paddingLeft: "12px", paddingRight: "12px" }}>
        <Toolbar disableGutters>
            <Typography
                variant="h4"
                noWrap
                component="a"
                sx={{
                    mr: 2,
                    display: { xs: 'none', md: 'flex' },
                    fontFamily: 'monospace',
                    fontWeight: 900,
                    letterSpacing: '.3rem',
                    color: '#607d8b',
                    textDecoration: 'none',
                }}
            >
                Burgir
            </Typography>

            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                <IconButton
                    size="large"
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={handleOpenNavMenu}
                    sx={{ color: "#607d8b" }}
                >
                    <MenuIcon />
                </IconButton>
                <Menu
                    id="menu-appbar"
                    anchorEl={anchorElNav}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    keepMounted
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                    }}
                    open={Boolean(anchorElNav)}
                    onClose={handleCloseNavMenu}
                    sx={{
                        display: { xs: 'block', md: 'none' }
                    }}
                >
                    {pages.map((page) => (
                        <MenuItem key={page} onClick={handleCloseNavMenu}>
                            <Typography textAlign="center" color="#607d8b">{page}</Typography>
                        </MenuItem>
                    ))}
                </Menu>
            </Box>
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                {/* {pages.map((page: any) => (
                        <Button
                            key={page}
                            onClick={handleCloseNavMenu}
                            sx={{ my: 2, color: '#000', display: 'block' }}
                        >
                            {page}
                        </Button>
                    ))} */}
            </Box>

            <Button variant="contained">
                <Typography
                    variant="h6"
                    noWrap
                    component="a"
                    sx={{
                        fontFamily: 'monospace',
                        fontWeight: 900,
                        textDecoration: 'none',
                    }}
                >
                    Connect
                </Typography>
            </Button>
        </Toolbar>
    </AppBar>
    )
}
export default Header