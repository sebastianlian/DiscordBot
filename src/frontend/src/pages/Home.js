import React from 'react';
import Navbar from "../components/Navbar";
import { Container, Typography, Paper, Divider } from '@mui/material';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

const Home = () => {
    return (
        <div className="d-flex flex-column align-items-center"> {/* Bootstrap flex classes */}
            <Navbar />
            <div className="container mt-5"> {/* Bootstrap container for central alignment */}
                <div className="text-center mb-4">
                    <Typography variant="h2" gutterBottom>
                        Welcome
                    </Typography>
                    <Typography variant="h5" className="text-secondary mb-4">
                        Your ultimate solution for managing Discord server activity
                    </Typography>
                </div>

                {/* About Section */}
                <div className="row justify-content-center">
                    <div className="col-md-8 col-lg-6"> {/* Bootstrap columns for responsive sizing */}
                        <Paper elevation={5} className="p-4 rounded-3">
                            <Typography variant="h4" align="center" gutterBottom>
                                About the Automated Discord Bot
                            </Typography>
                            <Divider className="my-3" />

                            <Typography variant="body1" className="text-justify mb-3">
                                This automated Discord bot is designed to help manage and maintain your Discord server with ease. It includes features such as inactivity tracking, automated responses, purging, blacklisting, and user management.
                            </Typography>
                            <Typography variant="body1" className="text-justify mb-3">
                                Our goal is to enhance the Discord experience by automating repetitive tasks and improving community engagement.
                            </Typography>
                            <Typography variant="body1" className="text-justify">
                                If you have any questions or suggestions, feel free to reach out through our support channels.
                            </Typography>
                        </Paper>
                    </div>
                </div>
            </div>

            {/* Footer Section */}
            <footer style={{ textAlign: 'center', marginTop: '20px', padding: '10px', fontSize: '0.9em', color: '#777' }}>
                <Typography variant="body2">
                    © 2024 BashBot. All rights reserved.
                </Typography>
                <Typography variant="body2">
                    This project is licensed under the <a href="https://opensource.org/licenses/MIT" target="_blank" rel="noopener noreferrer">MIT License</a>.
                </Typography>
            </footer>

        </div>
    );
};

export default Home;
