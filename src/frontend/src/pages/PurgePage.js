import React from 'react';
import Navbar from "../components/Navbar";
import {Container, Typography} from "@mui/material";

const PurgePage = () => {
    return (
        <>
            <Navbar/>
            <Container sx={{marginTop: '2rem', maxWidth: 'md'}}>
                <Typography variant="h4" component="h1" align="center" gutterBottom>
                    Purge
                </Typography>
            </Container>
        </>
    );
};

export default PurgePage;
