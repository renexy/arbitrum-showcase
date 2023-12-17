import { AppBar, Box, Button, IconButton, Toolbar, Typography } from "@mui/material"


const Footer = () => {
    return (<AppBar position="static" sx={{ backgroundColor: "#eeeeee", paddingLeft: "12px", paddingRight: "12px" }}>
        <Toolbar disableGutters sx={{ flexDirection: { xs: 'column', sm: 'row' } }}>
            <Box sx={{ flexGrow: 1, }}>
                <Typography
                    variant="h5"
                    noWrap
                    component="a"
                    sx={{
                        fontFamily: 'monospace',
                        fontWeight: 900,
                        letterSpacing: '.3rem',
                        color: '#607d8b',
                        textDecoration: 'none',
                    }}
                >
                    Contact
                </Typography>
            </Box>          <Box sx={{ flexGrow: 1, }}>
                <Typography
                    variant="h5"
                    noWrap
                    component="a"
                    sx={{
                        fontFamily: 'monospace',
                        fontWeight: 900,
                        letterSpacing: '.3rem',
                        color: '#607d8b',
                        textDecoration: 'none',
                    }}
                >
                    About us
                </Typography>
            </Box>          <Box>
                <Typography
                    variant="h5"
                    noWrap
                    component="a"
                    sx={{
                        fontFamily: 'monospace',
                        fontWeight: 900,
                        letterSpacing: '.3rem',
                        color: '#607d8b',
                        textDecoration: 'none',
                    }}
                >
                    Copyright
                </Typography>
            </Box>
        </Toolbar>
    </AppBar>)
}

export default Footer