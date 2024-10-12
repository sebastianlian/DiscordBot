import React from 'react';
import Navbar from "../components/Navbar";
import { Container, Typography, Paper, Box, Divider } from '@mui/material';

const Home = () => {
    return (
        <div style={{ display: 'flex' }}> {/* Set display to flex for layout */}
            <div style={{ flexGrow: 1 }}> {/* Allow the main content to grow */}
                <Navbar />
                <Container maxWidth="lg" sx={{ marginTop: '4rem' }}>
                    <Typography variant="h2" gutterBottom>
                        Welcome
                    </Typography>
                    <Typography variant="h5" gutterBottom align="center" sx={{ marginBottom: '2rem', color: 'text.secondary' }}>
                        Your ultimate solution for managing Discord server activity
                    </Typography>

                    {/* About Section */}
                    <Container maxWidth="md" sx={{ marginTop: '4rem' }}>
                        <Paper elevation={5} sx={{ padding: '2rem', borderRadius: '16px' }}>
                            <Typography variant="h4" gutterBottom align="center">
                                About the Automated Discord Bot
                            </Typography>

                            <Divider sx={{ marginBottom: '1.5rem' }} />

                            <Typography variant="body1" sx={{ marginBottom: '1.5rem', textAlign: 'justify' }}>
                                This automated Discord bot is designed to help manage and maintain your Discord server with ease. It includes features such as inactivity tracking, automated responses, purging, blacklisting, and user management.
                            </Typography>

                            <Typography variant="body1" sx={{ marginBottom: '1.5rem', textAlign: 'justify' }}>
                                Our goal is to enhance the Discord experience by automating repetitive tasks and improving community engagement.
                            </Typography>

                            <Typography variant="body1" sx={{ textAlign: 'justify' }}>
                                If you have any questions or suggestions, feel free to reach out through our support channels.
                            </Typography>
                        </Paper>
                    </Container>
                </Container>
            </div>
        </div>
    );
};

export default Home;
