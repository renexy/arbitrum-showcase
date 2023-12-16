import styles from '@/styles/Layout.module.css'
import { AppBar, Button, IconButton, Toolbar, Typography } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu';
import Header from '../header/header';

const Layout = ({ children, }: { children: any }) => {

    return (
        <div className={styles.parent}>
            <Header></Header>
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