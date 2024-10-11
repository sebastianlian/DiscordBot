import React, { useEffect, useState } from 'react';
import Navbar from "../components/Navbar";
import { Container, Typography, Box } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

const InactivityPage = () => {
    const [inactiveUsers, setInactiveUsers] = useState([]);

    useEffect(() => {
        const fetchInactiveUsers = async () => {
            try {
                const response = await fetch('http://localhost:5011/inactivity'); // Use the correct port
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                console.log('Fetched data:', data); // Log fetched data for debugging
                setInactiveUsers(data);
            } catch (error) {
                console.error('Error fetching inactive users:', error);
            }
        };

        fetchInactiveUsers();
    }, []);

    // Define columns for the DataGrid
    const columns = [
        { field: 'userName', headerName: 'User Name', flex: 1 }, // Auto-sizing column
        {
            field: 'lastMessageDate',
            headerName: 'Last Active',
            flex: 1, // Auto-sizing column
            renderCell: (params) => {
                const dateValue = new Date(params.value);
                return isNaN(dateValue.getTime()) ? "Invalid date" : dateValue.toLocaleString();
            },
        },
    ];

    return (
        <>
            <Navbar />
            <Container sx={{ marginTop: '2rem', maxWidth: 'md' }}> {/* Adjust width using Material-UI props */}
                <Typography variant="h4" component="h1" align="center" gutterBottom>
                    Inactive Users
                </Typography>
                {inactiveUsers.length > 0 ? (
                    <Box sx={{ height: 400 }}>
                        <DataGrid
                            rows={inactiveUsers}
                            columns={columns}
                            pageSize={5}
                            rowsPerPageOptions={[5]}
                            getRowId={(row) => row.userId} // Specify unique identifier for rows
                        />
                    </Box>
                ) : (
                    <Typography variant="body1" align="center">
                        No inactive users found.</Typography>
                )}
            </Container>
        </>
    );
};

export default InactivityPage;
