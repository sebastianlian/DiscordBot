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
            fontFamily: '"Press Start 2P", cursive',
        },
        h4: {
            fontFamily: '"Press Start 2P", cursive',
            fontWeight: 500,
            color: '#697565',
            textTransform: 'uppercase',
        },
        h5: {
            fontStyle: 'italic',
        },
        h6: {
            fontFamily: '"Press Start 2P", cursive',
            fontWeight: 'normal',
            fontSize: '1.5rem',
            color: 'white',
            textTransform: 'uppercase',
            letterSpacing: '0.1rem',
        },
        h7 : {
            fontWeight: 'bold',

        },
        body1: {
            lineHeight: 1.5,
            textAlign: 'justify',
            margin: '0 auto',
            maxWidth: '80%',
        },

    },

    // MUI CUSTOMIZATIONS
    components: {
        // Form control customization
        MuiFormControl: {
            styleOverrides: {
                root: {
                    width: '100%', // Applies to all forms
                },
            },
        },
        // Paper customization
        MuiPaper: {
            styleOverrides: {
                root: {
                    padding: '1rem',
                    borderRadius: '12px',
                },
            },
        },
        // Data Grid customization
        MuiDataGrid: {
            styleOverrides: {
                root: {
                    '& .MuiDataGrid-cell': { // Custom class for cells
                        padding: '0.5rem',
                    },
                    '& .MuiDataGrid-columnHeaders': { // Custom class for headers
                        backgroundColor: '#f5f5f5',
                        fontWeight: 'bold',
                    },
                    '& .MuiDataGrid-row': { // Custom class for rows
                        '&:hover': {
                            backgroundColor: '#f1f1f1',
                        },
                    },
                },
            },
        },
        // Menu customization
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
        // Accordion customization
        MuiAccordion: {
            styleOverrides: {
                root: {
                    border: '1px solid #3C3D37',
                    borderRadius: '8px',
                    boxShadow: 'none',
                    '&:before': {
                        display: 'none',
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
                    color: 'black',
                    '&:hover': {
                        backgroundColor: '#000000',
                        color: 'white',
                        textTransform: 'uppercase',
                    },
                },
            },
        },
        // List Item customization
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
        // Typography customization
        MuiTypography: {
            styleOverrides: {
                root: {
                    '&.accordion-question': { // Custom class for accordion summary typography
                        fontSize: '1.5rem',
                        '&:hover': {
                            textTransform: 'uppercase',
                        },
                    },
                    '&.sidebar-title': { // Custom class for sidebar title
                        color: 'black',
                        textTransform: 'none',
                        fontWeight: 'bold',
                        '&:hover': {
                            backgroundColor: 'transparent',
                            color: 'white',
                        },
                    },
                },
            },
        },
        // Drawer customization
        MuiDrawer: {
            styleOverrides: {
                paper: {
                    backgroundColor: '#FFFFFF',
                    color: '#000000',
                },
            },
        },
    },
});

export default Theme;