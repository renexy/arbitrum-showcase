import styles from '@/styles/Layout.module.css'
import { AppBar, Button, IconButton, ThemeProvider, Toolbar, Typography, createTheme } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu';
import { blueGrey, grey } from '@mui/material/colors';
import Container from '../container/container';

const Layout = ({ children, }: { children: any }) => {
    const theme = createTheme({
        palette: {
            secondary: {
                main: '#607d8b'
            }
        },
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
        }
    })
    return (
        <div className={styles.parent}>
            <ThemeProvider theme={theme}>
                <Container />
            </ThemeProvider>
        </div>
    )
}
export default Layout