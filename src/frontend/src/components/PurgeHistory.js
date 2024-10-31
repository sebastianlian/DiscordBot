import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Typography, Box, CircularProgress, Paper } from '@mui/material';

const API_BASE_URL = 'http://localhost:5011';

function PurgeHistory() {
    const [purgeHistory, setPurgeHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPurgeHistory = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/purge-history`, {
                    credentials: 'include'
                });
                console.log('Purge history response:', response.data);
                setPurgeHistory(response.data);
                setError(null);
            } catch (err) {
                console.error('Error fetching purge history:', err);
                setError('Failed to fetch purge history. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchPurgeHistory();
    }, []);

    const formatDate = (dateString) => {
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    return (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Typography
                variant="h4"
                gutterBottom
                sx={{
                    mb: 3,
                    textAlign: 'center',
                    fontWeight: 500,
                    color: 'text.primary'
                }}
            >
                Purge History
            </Typography>

            <Box sx={{
                flexGrow: 1,
                overflowY: 'auto',
                maxHeight: '400px',
                minHeight: '200px'
            }}>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                        <CircularProgress />
                    </Box>
                ) : error ? (
                    <Typography color="error">{error}</Typography>
                ) : purgeHistory.length === 0 ? (
                    <Typography>No purge history available.</Typography>
                ) : (
                    <Box sx={{
                        '& > :not(:last-child)': { mb: 2 }
                    }}>
                        {purgeHistory.slice(0, 3).map((purge, index) => (
                            <Paper
                                key={index}
                                elevation={1}
                                sx={{
                                    p: 2,
                                    bgcolor: '#f5f0e6',  // Beige background color
                                    borderRadius: 1,
                                    '&:hover': {
                                        bgcolor: '#f0e9dd'  // Slightly darker beige on hover
                                    }
                                }}
                            >
                                <Typography variant="subtitle1" component="div" sx={{ color: '#2c2c2c' }}>
                                    <strong>{purge.username}</strong> purged {purge.purgedUsers?.length || 0} users
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#666' }}>
                                    {formatDate(purge.executionDate)}
                                </Typography>
                            </Paper>
                        ))}
                    </Box>
                )}
            </Box>
        </Box>
    );
}

export default PurgeHistory;