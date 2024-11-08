const { blackListDB } = require('../models/blacklistSchema');
const { userMention } = require('discord.js');

async function removeBlacklistDB(userid, userTag) {
    const userIdString = userid.toString(); // Ensure the user ID is a string
    const mentionedUser = userMention(userid); // Get the mention for the user
    const doc = await blackListDB.findOne();

    // Check if the blacklist document exists
    if (doc) {
        // Check if the user is in the blacklist
        const userExists = doc.blackListedUsers.some(user => user.userId === userIdString);

        if (userExists) {
            // Remove the user from the blacklist
            await blackListDB.updateOne(
                {},
                { $pull: { blackListedUsers: { userId: userIdString } } }
            );
            console.log(`User ${userTag} has been removed from the Blacklist.`);
            const resultMessage = (`User ${mentionedUser.toString()} has been removed from the Blacklist.`);
            return resultMessage;
        } else {
            console.log(`User ${userIdString} is not in the Blacklist.`);
            const resultMessage = (`User ${mentionedUser.toString()} is not in the Blacklist.`);
            return resultMessage;
        }
    } else {
        const resultMessage = "Blacklist does not exist.";
        console.log(resultMessage);
        return resultMessage;
    }
}

module.exports = {
    removeBlacklistDB
};
