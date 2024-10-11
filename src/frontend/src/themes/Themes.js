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
                    '&:hover': {
                        backgroundColor: '#000000',
                        color: 'white',
                        textTransform: 'uppercase',
                    },
                    // Targeting the sidebar-title to prevent hover effects
                    '&.sidebar-title': {
                        '&:hover': {
                            backgroundColor: 'transparent',
                            color: 'white',
                            textTransform: 'none',
                        },
                    },
                },
            },
        },
        MuiListItemText: {
            styleOverrides: {
                root: {
                    color: 'black', // Set text color to black for sidebar items
                    '&:hover': {
                        color: 'inherit', // Prevent hover color change for the text
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
