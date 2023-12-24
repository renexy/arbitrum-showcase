import styles from '@/styles/Layout.module.css'
import { AppBar, Button, IconButton, ThemeProvider, Toolbar, Typography, createTheme } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu';
import Header from '../header/header';
import { blueGrey, grey } from '@mui/material/colors';
import Footer from '../footer/footer';

const Layout = ({ children, }: { children: any }) => {
    const theme = createTheme({
        components: {
            MuiButton: {
                styleOverrides: {
                    root: {
                        color: "#fff",
                        backgroundColor: blueGrey[500],
                        "&:hover": {
                            backgroundColor: blueGrey[500]
                        },
                        fontWeight: 900
                    }

                }
            },
            MuiPaper: {
                styleOverrides: {
                    root: {
                        color: blueGrey[500],
                        backgroundColor: grey[200]
                    }
                }
            },
            MuiButtonBase: {
                styleOverrides: {
                    root: {
                        fill: grey[200],
                        "&:checked": {
                            fill: grey[200]
                        }
                    }
                }
            }
        },
        breakpoints: {
            values: {
                xs: 0,
                sm: 600,
                md: 900,
                lg: 1200,
                xl: 1536,
            },
        }
    })
    return (
        <div className={styles.parent}>
            <ThemeProvider theme={theme}>
                <Header></Header>
                {children}
                <Footer></Footer>
            </ThemeProvider>
        </div>
    )
}
export default Layout