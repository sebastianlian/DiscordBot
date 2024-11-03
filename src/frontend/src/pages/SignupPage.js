import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from "../components/Navbar";
import { Typography, TextField, Button } from '@mui/material';
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap is imported

const SignUpPage = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSignUp = (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }
        console.log('Username:', username);
        console.log('Email:', email);
        console.log('Password:', password);
    };

    return (
        <>
            <Navbar />
            <div className="container my-5">
                <div className="row justify-content-center">
                    <div className="col-md-6">
                        <Typography variant="h4" component="h1" align="center" className="mb-4">
                            Sign Up
                        </Typography>
                        <form onSubmit={handleSignUp} className="d-flex flex-column align-items-center">
                            <TextField
                                label="Username"
                                variant="outlined"
                                fullWidth
                                required
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="mb-3"
                            />
                            <TextField
                                label="Email"
                                variant="outlined"
                                fullWidth
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="mb-3"
                            />
                            <TextField
                                label="Password"
                                type="password"
                                variant="outlined"
                                fullWidth
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="mb-3"
                            />
                            <TextField
                                label="Confirm Password"
                                type="password"
                                variant="outlined"
                                fullWidth
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="mb-3"
                            />
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                className="w-100 mb-3"
                            >
                                Sign Up
                            </Button>
                            <Typography variant="body2" align="center" className="mb-2">
                                Already have an account?
                            </Typography>
                            <Button
                                component={Link}
                                to="/login"
                                variant="outlined"
                                color="primary"
                                className="w-100"
                            >
                                Login
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SignUpPage;
