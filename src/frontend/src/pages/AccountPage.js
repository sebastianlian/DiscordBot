import React from 'react';
import Navbar from "../components/Navbar";
import { Typography } from '@mui/material';
import 'bootstrap/dist/css/bootstrap.min.css';

const AccountPage = () => {
    return (
        <>
            <Navbar />
            <div className="container my-5">
                <div className="row justify-content-center">
                    <div className="col-lg-8">
                        <Typography variant="h4" component="h1" align="center" className="mb-4">
                            Account Details
                        </Typography>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AccountPage;
