import styles from '@/styles/Layout.module.css'
import { AppBar, Button, IconButton, Toolbar, Typography } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu';

const Layout = ({ children, }: { children: any }) => {

    return (
        <div className={styles.parent}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        News
                    </Typography>
                    <Button color="inherit">Login</Button>
                </Toolbar>
            </AppBar>
            {children}
            <Toolbar>
                <Typography variant="h6" component="div">
                    Footer
                </Typography>
            </Toolbar>
        </div>
    )
}
export default Layout