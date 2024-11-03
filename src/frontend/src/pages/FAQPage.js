import React from 'react';
import Navbar from "../components/Navbar";
import { Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css'; // Import any additional CSS

const FAQPage = () => {
    console.log("FAQ Page Rendered");

    const commands = [
        '/help - Lists out all the different configuration commands for the bot.',
        '/blacklist show - Shows the current blacklisted user/roles.',
        '/blacklist add (user/role) - Lets you add a specific user/role to a blacklist which makes them bypass the purges.',
        '/blacklist remove (user/role) - Lets you remove a specific user/role from the blacklist.',
        '/purge - Starts a manual purge which will gather all inactive users and send specified channel for confirmation.',
        '/roletimer (role name) (amount of time in days) - Sets the grace period for a certain role.',
        '/setpurge (time in days) - Sets the specified automated purge window (in days).',
        '/timer (role) (time) - Sets a time window (in days) for a role before considering them inactive.',
        '/show inactivity - Shows members who are considered "inactive" that are eligible to be purged.',
    ];

    return (
        <>
            <Navbar />
            <div className="container mt-4">
                <h2 className="text-center mb-4">FAQ</h2>

                <Accordion className="mb-3">
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="commands-content"
                        id="commands-header"
                    >
                        <h6 className="mb-0">What are the commands I can use with the bot?</h6>
                    </AccordionSummary>
                    <AccordionDetails>
                        <div className="row">
                            {commands.map((command, index) => (
                                <div className="col-md-6 col-lg-4 mb-3" key={index}>
                                    <div className="card h-100">
                                        <div className="card-body">
                                            <p className="card-text">{command}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </AccordionDetails>
                </Accordion>
            </div>
        </>
    );
};

export default FAQPage;
