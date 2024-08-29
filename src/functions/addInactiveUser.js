const inactivitySchema = require("../models/inactivitySchema");

async function addInactivityDB(userid, messageDate){
    const doc = await inactivitySchema.inactiveDB.findOne();
    if(doc){
        try {
            // Check if the user already exists in the database
            let user = await inactivitySchema.inactiveDB.findOne({ userId });

            if (!user) {
                // If the user doesn't exist, create a new user document
                user = new Inactivity({
                    userId,
                    lastMessageDate: messageDate,
                });
            } else {
                // If the user already exists, update the lastMessageDate
                user.lastMessageDate = messageDate;
            }

            // Save the user document to the database
            await user.save();

            console.log(`Inactivity data added for user ${userId}`);
        } catch (error) {
            console.error('Error adding inactivity data:', error);
        }
    }
    else{
        await inactivitySchema.inactiveDB.create({ userId, lastMessageDate: messageDate });
        console.log(`New Schema has been created with ${userId} as the first value.`);
    }
}

module.exports = {
    addInactivityDB
}