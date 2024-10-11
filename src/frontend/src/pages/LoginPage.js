import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from "../components/Navbar";
import { Container, Typography, TextField, Button, Box } from '@mui/material';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        // Handle login logic here, e.g., API call to authenticate user
        console.log('Email:', email);
        console.log('Password:', password);
    };

    return (
        <>
            <Navbar />
            <Container maxWidth="sm" sx={{ marginTop: '2rem' }}>
                <Typography variant="h4" component="h1" align="center" gutterBottom>
                    Login
                </Typography>
                <Box
                    component="form"
                    onSubmit={handleLogin}
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '1rem',
                    }}
                >
                    <TextField
                        label="Email"
                        variant="outlined"
                        fullWidth
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <TextField
                        label="Password"
                        type="password"
                        variant="outlined"
                        fullWidth
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        sx={{ width: '100%' }}
                    >
                        Login
                    </Button>
                    <Typography variant="body2" align="center">
                        Don't have an account?
                    </Typography>
                    <Button
                        component={Link}
                        to="/signup"  // Update the route according to your app's routing
                        variant="outlined"
                        color="primary"
                        sx={{ width: '100%' }}
                    >
                        Sign Up
                    </Button>
                </Box>
            </Container>
        </>
    );
};

export default LoginPage;
