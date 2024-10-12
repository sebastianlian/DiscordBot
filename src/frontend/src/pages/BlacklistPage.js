import React from 'react';
import Navbar from "../components/Navbar";
import {Container, Typography} from "@mui/material";

const BlacklistPage = () => {
    return (
        <>
            <Navbar/>
            <Container sx={{marginTop: '2rem', maxWidth: 'md'}}>
                <Typography variant="h4" component="h1" align="center" gutterBottom>
                    Blacklist
                </Typography>
            </Container>
        </>
    );
};

export default BlacklistPage