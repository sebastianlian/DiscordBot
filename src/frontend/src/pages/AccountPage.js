import React, { useEffect, useState } from 'react';
import Navbar from "../components/Navbar";
import { Container, Typography, Box } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

const AccountPage = () => {

    return (
        <>
            <Navbar />
            <Container maxWidth="lg" sx={{ marginTop: '2rem' }}>
                <Typography variant="h4" component="h1" align="center" gutterBottom>
                    Account Details
                </Typography>
            </Container>
        </>
    );
};

export default AccountPage;
