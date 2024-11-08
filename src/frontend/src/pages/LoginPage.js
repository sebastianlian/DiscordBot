// Login page to access dashboard - not sure if it needs to be adjusted to authenticate admin user
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Typography, TextField, Button } from '@mui/material';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../themes/Themes.js'; // Adjust the path as necessary


const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
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
                            Login
                        </Typography>
                        <form onSubmit={handleLogin} className="d-flex flex-column align-items-center">
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
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                className="w-100 mb-3"
                            >
                                Login
                            </Button>
                            <Typography variant="body2" align="center" className="mb-2">
                                Don't have an account?
                            </Typography>
                            <Button
                                component={Link}
                                to="/signup"
                                variant="outlined"
                                color="primary"
                                className="w-100"
                            >
                                Sign Up
                            </Button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Reusable Footer Component */}
            <Footer />
        </>
    );
};

export default LoginPage;