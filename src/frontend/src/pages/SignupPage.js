import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from "../components/Navbar";
import { Container, Typography, TextField, Button, Box } from '@mui/material';

const SignUpPage = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSignUp = (e) => {
        e.preventDefault();

        // Simple password confirmation validation
        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        // Handle sign-up logic here, e.g., API call to register the user
        console.log('Username:', username);
        console.log('Email:', email);
        console.log('Password:', password);
    };

    return (
        <>
            <Navbar />
            <Container maxWidth="sm" sx={{ marginTop: '2rem' }}>
                <Typography variant="h4" component="h1" align="center" gutterBottom>
                    Sign Up
                </Typography>
                <Box
                    component="form"
                    onSubmit={handleSignUp}
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '1rem',
                    }}
                >
                    <TextField
                        label="Username"
                        variant="outlined"
                        fullWidth
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
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
                    <TextField
                        label="Confirm Password"
                        type="password"
                        variant="outlined"
                        fullWidth
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        sx={{ width: '100%' }}
                    >
                        Sign Up
                    </Button>
                    <Typography variant="body2" align="center">
                        Already have an account?
                    </Typography>
                    <Button
                        component={Link}
                        to="/login"  // Link back to the login page
                        variant="outlined"
                        color="primary"
                        sx={{ width: '100%' }}
                    >
                        Login
                    </Button>
                </Box>
            </Container>
        </>
    );
};

export default SignUpPage;
