import React from 'react';
import Navbar from "../components/Navbar";
import { Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css'; // Import any additional CSS

import commandsData from '../JSON/commands.json'; // Adjust path as needed

const FAQPage = () => {
    console.log("FAQ Page Rendered");

    return (
        <>
            <Navbar />
            <div className="container mt-4">
                <Typography variant="h4" align="center" gutterBottom>
                    Frequently Asked Questions
                </Typography>

                <Accordion className="mb-3">
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="commands-content"
                        id="commands-header"
                    >
                        <Typography variant="body1" >What are the commands I can use with the bot?</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <div className="row">
                            {commandsData.map((item, index) => (
                                <div className="col-md-6 col-lg-4 mb-3" key={index}>
                                    <div className="card h-100">
                                        <div className="card-body text-center text-dark">
                                            {/* Bold and centered command */}
                                            <Typography variant="h6" className="font-weight-bold mb-2 text-dark">
                                                {item.command}
                                            </Typography>
                                            {/* Centered and justified description */}
                                            <Typography variant="body1" className="text-justify text-dark" style={{ textAlign: 'center' }}>
                                                {item.description}
                                            </Typography>
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
