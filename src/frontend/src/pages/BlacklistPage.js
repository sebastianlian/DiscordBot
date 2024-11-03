import React from 'react';
import Navbar from "../components/Navbar";
import { Typography } from "@mui/material";
import 'bootstrap/dist/css/bootstrap.min.css';

const BlacklistPage = () => {
    return (
        <>
            <Navbar/>
            <div className="container my-5">
                <div className="row justify-content-center">
                    <div className="col-md-8">
                        <Typography variant="h4" component="h1" align="center" className="mb-4">
                            Blacklist
                        </Typography>
                    </div>
                </div>
            </div>
        </>
    );
};

export default BlacklistPage;
