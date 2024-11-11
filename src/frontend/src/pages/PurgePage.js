import React from 'react';
import Navbar from "../components/Navbar";
import PurgeHistory from "../components/PurgeHistory";
import { useState } from 'react';
import {
    Container,
    Paper,
    Typography,
    Button,
    List,
    ListItem,
    ListItemText,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Alert,
    Box,
    CircularProgress,
    Grid
} from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    marginTop: theme.spacing(3),
    height: '100%'
}));

const PurgePage = () => {
    const [inactiveUsers, setInactiveUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [purgeInProgress, setPurgeInProgress] = useState(false);

    const fetchInactiveUsers = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:5011/inactivity');
            if (!response.ok) throw new Error('Failed to fetch users');
            const data = await response.json();
            setInactiveUsers(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handlePurge = async () => {
        try {
            const response = await fetch('http://localhost:5011/purge', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to execute purge');
            }

            setOpenDialog(false);
            setInactiveUsers([]);
            setError(`Successfully purged ${data.purgedCount} users`);
        } catch (err) {
            console.error('Purge error:', err);
            setError(err.message);
        }
    };

    return (
        <>
            <Navbar />
            <Container maxWidth="xl">
                <Grid container spacing={3}>
                    {/* Left side - Purge Management */}
                    <Grid item xs={12} md={8}>
                        <StyledPaper elevation={3}>
                            <Typography variant="h4" gutterBottom align="center">
                                User Purge Management
                            </Typography>

                            <Button
                                variant="contained"
                                fullWidth
                                onClick={fetchInactiveUsers}
                                disabled={loading || purgeInProgress}
                                sx={{ mb: 3 }}
                            >
                                {loading ? 'Loading...' : 'Preview Inactive Users'}
                            </Button>

                            {error && (
                                <Alert
                                    severity={error.includes('Successfully') ? 'success' : 'error'}
                                    sx={{ mb: 3 }}
                                >
                                    {error}
                                </Alert>
                            )}

                            {inactiveUsers.length > 0 && (
                                <Box>
                                    <Typography variant="h6" gutterBottom>
                                        Users to be Purged ({inactiveUsers.length})
                                    </Typography>

                                    <List>
                                        {inactiveUsers.map((user) => (
                                            <ListItem
                                                key={user.userId}
                                                sx={{
                                                    bgcolor: 'background.paper',
                                                    mb: 1,
                                                    borderRadius: 1
                                                }}
                                            >
                                                <ListItemText
                                                    primary={user.userName}
                                                    secondary={`Last active: ${new Date(user.lastMessageDate).toLocaleDateString()}`}
                                                />
                                            </ListItem>
                                        ))}
                                    </List>

                                    <Button
                                        variant="contained"
                                        color="error"
                                        fullWidth
                                        onClick={() => setOpenDialog(true)}
                                        disabled={purgeInProgress}
                                        sx={{ mt: 2 }}
                                    >
                                        Initiate Purge
                                    </Button>

                                    <Dialog
                                        open={openDialog}
                                        onClose={() => !purgeInProgress && setOpenDialog(false)}
                                    >
                                        <DialogTitle>Confirm Purge</DialogTitle>
                                        <DialogContent>
                                            <Typography>
                                                This action will remove {inactiveUsers.length} inactive users from the server.
                                                This action cannot be undone.
                                            </Typography>
                                        </DialogContent>
                                        <DialogActions>
                                            <Button
                                                onClick={() => setOpenDialog(false)}
                                                disabled={purgeInProgress}
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                onClick={handlePurge}
                                                color="error"
                                                variant="contained"
                                                disabled={purgeInProgress}
                                                startIcon={purgeInProgress && <CircularProgress size={20} color="inherit" />}
                                            >
                                                {purgeInProgress ? 'Purging...' : 'Confirm Purge'}
                                            </Button>
                                        </DialogActions>
                                    </Dialog>
                                </Box>
                            )}
                        </StyledPaper>
                    </Grid>

                    {/* Right side - Purge History */}
                    <Grid item xs={12} md={4}>
                        <StyledPaper elevation={3}>
                            <PurgeHistory />
                        </StyledPaper>
                    </Grid>
                </Grid>
            </Container>
        </>
    );
};

export default PurgePage;