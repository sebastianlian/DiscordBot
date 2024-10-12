require('dotenv').config({ path: `${__dirname}/../.env` }); // Navigate up one level to access the .env file in the src folder
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Import cors
const bot = require('../index');
const { inactiveDB } = require('../models/inactivitySchema');
const UserActivity = require('../models/userActivitySchema'); // Ensure correct path to your schema file

const app = express();
const PORT = process.env.PORT || 5011;

const databaseToken = process.env.databaseToken; // Make sure this is defined in your .env file
console.log('Database Token:', databaseToken);

mongoose.connect(databaseToken)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Enable CORS for all routes
app.use(cors());

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// // Test for mongoose connection in server.js
// app.get('/', (req, res) => {
//     res.send('Hello World!');
// });

app.get('/inactivity', async (req, res) => {
    console.log('Received request for inactivity data'); // Log when the route is hit
    try {
        const inactivityData = await inactiveDB.find(); // Fetch all items from the collection
        console.log('Inactivity Data:', inactivityData); // Log the fetched data
        res.json(inactivityData); // Send the items as a JSON response
    } catch (error) {
        console.error('Error fetching inactivity:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/useractivity', async (req, res) => {
    console.log('Received request for user activities'); // Add this log to ensure the route is hit
    try {
        const userActivitiesData = await UserActivity.find(); // Fetch all user activities
        console.log('User Activities Data:', userActivitiesData); // Log fetched data
        res.json(userActivitiesData); // Send fetched user activities as response
    } catch (error) {
        console.error('Error fetching user activities:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

app.get('/faq', async (req, res) => {
    console.log('FAQ populated'); // Add this log to ensure the route is hit
});


// Start the bot
client.login(process.env.TOKEN); // Make sure BOT_TOKEN is set in your .env