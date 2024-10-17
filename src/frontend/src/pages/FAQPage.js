import React, { useEffect, useState } from 'react';
import Navbar from "../components/Navbar";
import { Container, Typography } from '@mui/material';

const FAQPage = () => {
    return (
        <>
            <Navbar />
            <Container maxWidth="lg" sx={{ marginTop: '2rem' }}>
                <Typography variant="h4" component="h1" align="center" gutterBottom>
                    FAQ
                </Typography>
            </Container>
        </>
    );
};

export default FAQPage;
