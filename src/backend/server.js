require('dotenv').config({ path: `${__dirname}/../.env` }); // Navigate up one level to access the .env file in the src folder
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bot = require('../index');
const { inactiveDB } = require('../models/inactivitySchema');
const UserActivity = require('../models/userActivitySchema');
const { PurgeHistory } = require('../models/purgeHistorySchema');
const { blackListDB } = require('../models/blacklistSchema');
const UserSchema = require('../models/userSchema');

const app = express();
const PORT = process.env.PORT || 5011;

const databaseToken = process.env.databaseToken; // Make sure this is defined in your .env file
// console.log('Database Token:', databaseToken); // Debugging line for ensuring database connection

mongoose.connect(databaseToken)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

require('dotenv').config({ path: `${__dirname}/../.env` });

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;

// Enable CORS for all routes
app.use(cors());

// Enable JSON parsing middleware
app.use(express.json());

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Endpoint to get inactivity
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

// Endpoint to get user activity
app.get('/useractivity', async (req, res) => {
    console.log('Received request for user activities'); // Logs to ensure the route is hit
    try {
        const userActivitiesData = await UserActivity.find(); // Fetch all user activities
        console.log('User Activities Data:', userActivitiesData); // Log fetched data
        res.json(userActivitiesData); // Send fetched user activities as response
    } catch (error) {
        console.error('Error fetching user activities:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Endpoint to get user information
app.get('/userinfo', async (req, res) => {
    console.log('Received request for user information'); // This log should appear when the route is hit
    try {
        const users = await UserSchema.find();
        res.json(users);
    } catch (error) {
        console.error('Error fetching user information:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Endpoint to get purge history
app.get('/api/purge-history', async (req, res) => {
    console.log('Received request for purge history');
    try {
        const purgeHistory = await PurgeHistory.find()
            .sort({ executionDate: -1 })
            .limit(3)
            .lean({ virtuals: true });  // This ensures virtual properties are included

        console.log('Fetched purge history:', purgeHistory);

        const sanitizedPurgeHistory = purgeHistory.map(entry => ({
            username: entry.username || 'Unknown user',
            executionDate: entry.executionDate || new Date(),
            purgedUsers: Array.isArray(entry.purgedUsers) ? entry.purgedUsers : []
        }));

        console.log('Sending purge history:', sanitizedPurgeHistory);
        res.json(sanitizedPurgeHistory);
    } catch (error) {
        console.error('Error fetching purge history:', error);
        res.status(500).json({ error: 'Failed to fetch purge history' });
    }
});

app.get('/faq', async (req, res) => {
    console.log('FAQ populated'); // Add this log to ensure the route is hit
});

// Endpoint to get blacklist
app.get('/blacklist', async (req, res) => {
    console.log('Received request for blacklist data');
    try {
        const doc = await blackListDB.findOne();
        console.log('Fetched document from MongoDB:', doc); // This log should print the document

        const blacklistedUsers = doc ? doc.blackListedUsers : [];
        res.json(blacklistedUsers);
    } catch (error) {
        console.error('Error fetching blacklist:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// POST /blacklist/add - Adds a user to the blacklist
app.post('/blacklist/add', async (req, res) => {
    const { userId, userName } = req.body;
    if (!userId || !userName) {
        return res.status(400).json({ message: 'User ID and User Name are required' });
    }

    try {
        // Check if a blacklist document exists; create one if not
        let doc = await blackListDB.findOne();
        if (!doc) {
            doc = await blackListDB.create({ blackListedUsers: [] });
        }

        // Add the user to the blacklist using $addToSet to prevent duplicates
        await blackListDB.updateOne(
            {},
            { $addToSet: { blackListedUsers: { userId, userName } } }
        );

        console.log(`User ${userId} added to the blacklist.`);
        res.json({ message: 'User added to the blacklist' });
    } catch (error) {
        console.error('Error adding user to blacklist:', error);
        res.status(500).json({ message: 'Failed to add user to blacklist' });
    }
});

// POST /blacklist/remove - Removes a user from the blacklist
app.post('/blacklist/remove', async (req, res) => {
    console.log('Request body:', req.body); // Debugging line to check request data

    const { userId } = req.body; // Now req.body should have data
    if (!userId) {
        console.log('User ID not found in request body');
        return res.status(400).json({ message: 'User ID is required' });
    }

    try {
        const result = await blackListDB.updateOne(
            {},
            { $pull: { blackListedUsers: { userId } } }
        );

        if (result.modifiedCount > 0) {
            console.log(`User ${userId} removed from the blacklist.`);
            res.json({ message: 'User removed from the blacklist' });
        } else {
            console.log(`User ${userId} not found in the blacklist.`);
            res.status(404).json({ message: 'User not found in blacklist' });
        }
    } catch (error) {
        console.error('Error removing user from blacklist:', error);
        res.status(500).json({ message: 'Failed to remove user from blacklist' });
    }
});

// Endpoint to get roles
app.get('/roles', async (req, res) => {
    console.log('Received request for roles data'); // Log when the route is hit
});


// Start the bot
client.login(process.env.TOKEN); // Make sure BOT_TOKEN is set in your .env