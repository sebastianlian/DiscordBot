const Inactivity = require('../models/inactivitySchema');

// Function to add or update inactivity data in the database
async function addInactivityDB(userId, userName, lastMessageDate) {
    // debugging log to check values before saving
    console.log('Adding/updating inactivity data for:', { userId, userName, lastMessageDate });

    // Basic validation to ensure required fields are provided
    if (!userId || !userName || !lastMessageDate) {
        console.error('Error: Missing required fields.');
        return;
    }

    try {
        // Create a filter to find an existing record by userId
        const filter = { userId: userId };

        // Define the update object with the provided userName and lastMessageDate
        const update = {
            userName: userName,
            lastMessageDate: lastMessageDate,
        };

        // If the record exists, it will update it; if not, it will create a new one
        const options = { upsert: true, new: true };

        // Perform the database operation to either update or create a new record
        const inactivityData = await Inactivity.findOneAndUpdate(filter, update, options);
        console.log('Inactivity data added/updated successfully:', inactivityData);
    } catch (error) {
        console.error('Error adding/updating inactivity data:', error);
    }
}

module.exports = {
    addInactivityDB
};
