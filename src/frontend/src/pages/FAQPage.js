import React from 'react';
import Navbar from "../components/Navbar";
import { Container, Typography, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import '../App.css'; // Import your CSS file

const FAQPage = () => {
    console.log("FAQ Page Rendered"); // Debugging log

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
            <Container maxWidth="lg" sx={{ marginTop: '2rem' }}>
                <Typography variant="h4" component="h1" align="center" gutterBottom>
                    FAQ
                </Typography>

                <Accordion>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="commands-content"
                        id="commands-header"
                    >
                        <Typography variant="h7">What are the commands I can use with the bot?</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <div>
                            {commands.map((command, index) => (
                                <Typography key={index} variant="body1">
                                    {command}
                                </Typography>
                            ))}
                        </div>
                    </AccordionDetails>
                </Accordion>
            </Container>
        </>
    );
};

export default FAQPage;
