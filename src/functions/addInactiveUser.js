const Inactivity = require('../models/inactivitySchema');

async function addInactivityDB(userId, userName, lastMessageDate) {
    // Debugging log to check values before saving
    console.log('Adding/updating inactivity data for:', { userId, userName, lastMessageDate });

    // Validation check
    if (!userId || !userName || !lastMessageDate) {
        console.error('Error: Missing required fields.');
        return;
    }

    try {
        // Create or update the inactivity data
        const filter = { userId: userId }; // Use userId to find existing record
        const update = {
            userName: userName,
            lastMessageDate: lastMessageDate,
        };
        const options = { upsert: true, new: true }; // Upsert option to create if not exists

        const inactivityData = await Inactivity.findOneAndUpdate(filter, update, options);
        console.log('Inactivity data added/updated successfully:', inactivityData);
    } catch (error) {
        console.error('Error adding/updating inactivity data:', error);
    }
}

module.exports = {
    addInactivityDB
};
