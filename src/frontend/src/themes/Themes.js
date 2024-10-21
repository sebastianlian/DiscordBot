// src/theme.js
import { createTheme } from '@mui/material/styles';

const Theme = createTheme({
    palette: {
        primary: {
            main: '#181C14',
        },
        background: {
            default: '#ECDFCC',
        },
    },
    typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        h2: {
            fontWeight: 500,
            textAlign: 'center',
            color: '#3C3D37',
        },
        h4: {
            fontWeight: 500,
            color: '#697565',
        },
        h6: {
            fontFamily: '"Press Start 2P", cursive',
            fontWeight: 'normal',
            fontSize: '1.5rem',
            color: 'white',
            textTransform: 'uppercase',
            letterSpacing: '0.1rem',
        },
        body1: {
            lineHeight: 1.5,
        },
    },
    components: {
        MuiPaper: {
            styleOverrides: {
                root: {
                    padding: '1rem',
                    borderRadius: '12px',
                },
            },
        },
        MuiDataGrid: {
            styleOverrides: {
                root: {
                    '& .MuiDataGrid-cell': {
                        padding: '0.5rem',
                    },
                    '& .MuiDataGrid-columnHeaders': {
                        backgroundColor: '#f5f5f5',
                        fontWeight: 'bold',
                    },
                    '& .MuiDataGrid-row': {
                        '&:hover': {
                            backgroundColor: '#f1f1f1',
                        },
                    },
                },
            },
        },
        MuiMenuItem: {
            styleOverrides: {
                root: {
                    '&:hover': {
                        backgroundColor: 'black',
                        color: 'white',
                        textTransform: 'lowercase',
                    },
                },
            },
        },
        // Sidebar customization
        MuiListItem: {
            styleOverrides: {
                root: {
                    padding: '1rem',
                    borderRadius: '8px',
                    color: 'black',  // Set the color to black
                    '&:hover': {
                        backgroundColor: '#000000',
                        color: 'white',  // Change color to white on hover
                        textTransform: 'uppercase',
                    },
                },
            },
        },
        MuiListItemText: {
            styleOverrides: {
                root: {
                    color: 'black',  // Ensure text remains black
                    '&:hover': {
                        color: 'white',  // Change to white on hover
                    },
                },
            },
        },
        // Ensure the sidebar title is black and unaffected by hover
        MuiTypography: {
            styleOverrides: {
                root: {
                    '&.sidebar-title': {
                        color: 'black', // Ensure the text is black
                        textTransform: 'none',
                        fontWeight: 'bold',
                        '&:hover': {
                            backgroundColor: 'transparent', // No background color change on hover
                            color: 'white', // Keep text color black on hover
                        },
                    },
                },
            },
        },
        MuiDrawer: {
            styleOverrides: {
                paper: {
                    backgroundColor: '#FFFFFF', // Background color of the sidebar
                    color: '#000000', // Set text color in the sidebar to black
                },
            },
        },
    },
});

export default Theme;
