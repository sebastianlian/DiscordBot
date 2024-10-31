import React, { useEffect, useState } from 'react';
import Navbar from "../components/Navbar";
import { Container, Typography, Box, Button } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import '../App.css';

const InactivityPage = () => {
    const [inactiveUsers, setInactiveUsers] = useState([]);

    // Function to fetch inactive users
    const fetchInactiveUsers = async () => {
        try {
            const response = await fetch('http://localhost:5011/inactivity');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log('Fetched data:', data);
            setInactiveUsers(data);
        } catch (error) {
            console.error('Error fetching inactive users:', error);
        }
    };

    // useEffect to load data on initial render
    useEffect(() => {
        fetchInactiveUsers();
    }, []);

    // Define columns for the DataGrid
    const columns = [
        { field: 'userName', headerName: 'User Name', flex: 1 },
        {
            field: 'lastMessageDate',
            headerName: 'Last Active',
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
            <Container sx={{ marginTop: '2rem', maxWidth: 'md' }}>
                <Typography variant="h4" component="h1" align="center" gutterBottom>
                    Inactive Users
                </Typography>
                {inactiveUsers.length > 0 ? (
                    <Box sx={{ height: 400, marginBottom: '1rem' }}>
                        <DataGrid
                            rows={inactiveUsers}
                            columns={columns}
                            pageSize={5}
                            rowsPerPageOptions={[5]}
                            getRowId={(row) => row.userId}
                        />
                    </Box>
                ) : (
                    <Typography variant="body1" align="center">
                        No inactive users found.
                    </Typography>
                )}
                <Box display="flex" justifyContent="center" mt={2}> {/* Moved Button Here */}
                    <Button variant="contained" onClick={fetchInactiveUsers}>
                        Refresh
                    </Button>
                </Box>
            </Container>
        </>
    );
};

export default InactivityPage;
