import React, { useEffect, useState } from 'react';
import Navbar from "../components/Navbar";
import { Typography, Box, Button } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import 'bootstrap/dist/css/bootstrap.min.css';

const BlacklistPage = () => {
    const [blacklistedUsers, setBlacklistedUsers] = useState([]);
    const [selectedUserIds, setSelectedUserIds] = useState([]);

    // Fetch blacklisted users from the server
    const fetchBlacklistedUsers = async () => {
        try {
            const response = await fetch('http://localhost:5011/blacklist');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();

            // Map nested array to flat array for DataGrid
            const mappedData = data.map((user) => ({
                id: user.userId,    // Ensure userId acts as unique identifier for DataGrid
                userName: user.userName,
                userId: user.userId
            }));
            console.log('Mapped blacklist data for DataGrid:', mappedData);
            setBlacklistedUsers(mappedData);
        } catch (error) {
            console.error('Error fetching blacklisted users:', error);
        }
    };

    useEffect(() => {
        fetchBlacklistedUsers();
    }, []);

    useEffect(() => {
        console.log("Selected User IDs Updated:", selectedUserIds);
    }, [selectedUserIds]);

    const columns = [

        { field: 'userName', headerName: 'User Name', flex: 1 },
        { field: 'userId', headerName: 'User ID', flex: 1 }
    ];

    const handleRemoveSelected = async () => {
        console.log("Inside handleRemoveSelected function");
        const usersToRemove = [...selectedUserIds]; // Copy current state to a constant
        console.log("Users to remove:", usersToRemove);

        if (usersToRemove.length === 0) {
            console.warn("No users selected for removal.");
            return;
        }

        try {
            await Promise.all(usersToRemove.map(async (userId) => {
                const response = await fetch('http://localhost:5011/blacklist/remove', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ userId }) // Confirm that this matches the backend expectation
                });
                console.log('Response status:', response.status); // Log response status for debugging
                if (!response.ok) {
                    const responseBody = await response.json();
                    console.error('Error response from server:', responseBody);
                }
            }));
            setSelectedUserIds([]); // Clear selection after removal
            await fetchBlacklistedUsers(); // Refresh the blacklist
        } catch (error) {
            console.error("Error removing selected users:", error);
        }
    };
    return (
        <>
            <Navbar />
            <div className="container my-5">
                <Typography variant="h4" align="center" gutterBottom>
                    Blacklisted Users
                </Typography>
                <div className="row justify-content-center">
                    <div className="col-md-8">
                        {blacklistedUsers.length > 0 ? (
                            <Box sx={{ height: 400, marginBottom: '1rem' }}>
                                <div onClick={() => console.log("Div clicked")}>
                                    <DataGrid
                                        rows={blacklistedUsers}
                                        columns={columns}
                                        pageSize={5}
                                        checkboxSelection
                                        disableSelectionOnClick
                                        getRowId={(row) => row.userId}
                                        onRowSelectionModelChange={(newSelectionModel) => {
                                            console.log("New Selection Model (raw):", newSelectionModel); // Check the raw event

                                            // Ensure newSelectionModel is an array before updating state
                                            if (Array.isArray(newSelectionModel)) {
                                                console.log("Setting selectedUserIds:", newSelectionModel);
                                                setSelectedUserIds(newSelectionModel);
                                            } else {
                                                console.error("Expected an array for selection model but got:", newSelectionModel);
                                            }
                                        }}
                                    />
                                </div>
                            </Box>
                        ) : (
                            <Typography variant="body1" className="text-center">
                                No blacklisted users found.
                            </Typography>
                        )}
                        <div className="d-flex justify-content-center mt-2">
                            <Button
                                variant="contained"
                                className="ms-2"
                                onClick={() => {
                                    console.log("Remove button clicked");
                                    handleRemoveSelected();
                                }}
                            >
                                Remove Selected
                            </Button>
                            <Button
                                variant="contained"
                                className="ms-2"
                                onClick={fetchBlacklistedUsers}
                            >
                                Refresh
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default BlacklistPage;