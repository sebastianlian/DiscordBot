import React, { useEffect, useState } from 'react';
import Navbar from "../components/Navbar";
import { Container, Typography, Box, Button } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import '../App.css';

const UserActivityPage = () => {
    const [userActivities, setUserActivities] = useState([]);

    const fetchUserActivities = async () => {
        try {
            const response = await fetch('http://localhost:5011/useractivity');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log('Fetched user activities:', data);
            setUserActivities(data);
        } catch (error) {
            console.error('Error fetching user activities:', error);
        }
    };

    useEffect(() => {
        fetchUserActivities();
    }, []);

    const columns = [
        { field: 'userName', headerName: 'User Name', width: 150, flex: 1 },
        { field: 'channelName', headerName: 'Channel Name', width: 150 },
        {
            field: 'lastMessage',
            headerName: 'Last Message',
            width: 200,
            renderCell: (params) => (
                <div className="centered">
                    {params.value || "-"}
                </div>
            ),
        },
        {
            field: 'lastReaction',
            headerName: 'Last Reaction',
            width: 200,
            renderCell: (params) => {
                const { messageContent, emoji, timestamp } = params.value || {};
                const dateValue = new Date(timestamp);

                if (!messageContent || !emoji) {
                    return <span>No Activity</span>;
                }

                return (
                    <div className="centered">
                        {emoji} {messageContent}
                        <br />
                        <span>{isNaN(dateValue.getTime()) ? "Invalid date" : dateValue.toLocaleString()}</span>
                    </div>
                );
            },
        },
        {
            field: 'lastVoiceActivity',
            headerName: 'Last Voice Activity',
            width: 200,
            renderCell: (params) => {
                const dateValue = new Date(params.value);
                return params.value
                    ? isNaN(dateValue.getTime()) ? "Invalid date" : dateValue.toLocaleString()
                    : "No Activity";
            },
        },
        {
            field: 'lastActive',
            headerName: 'Last Active',
            width: 200,
            flex: 1,
            renderCell: (params) => {
                const dateValue = new Date(params.value);
                return isNaN(dateValue.getTime()) ? "Invalid date" : dateValue.toLocaleString();
            },
        },
    ];

    return (
        <>
            <Navbar />
            <Container maxWidth="lg" sx={{ marginTop: '2rem' }}>
                <Typography variant="h4" component="h1" align="center" gutterBottom>
                    User Activity Log
                </Typography>

                <Box sx={{ marginTop: '2rem', height: 800, width: '100%' }}>
                    {userActivities.length > 0 ? (
                        <DataGrid
                            rows={userActivities}
                            columns={columns}
                            pageSize={5}
                            rowsPerPageOptions={[5]}
                            getRowId={(row) => row._id}
                        />
                    ) : (
                        <Typography variant="body1" align="center">
                            No user activities found.
                        </Typography>
                    )}
                </Box>

                <Box display="flex" justifyContent="center" mt={2}> {/* Centered Refresh Button */}
                    <Button variant="contained" onClick={fetchUserActivities}>
                        Refresh
                    </Button>
                </Box>
            </Container>
        </>
    );
};

export default UserActivityPage;
