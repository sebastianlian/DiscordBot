const User = require("discord.js");
const blacklistSchema = require("../models/blacklistSchema");

async function showBlacklistDB(client) {
    const doc = await blacklistSchema.blackListDB.findOne();
    const userList = [];

    if (doc) {
        const blacklistedUsers = doc.blackListedUsers;

        // for every user object in the blacklistedUsers array
        for (const userObj of blacklistedUsers) {
            const userId = userObj.userId; // Get the userId from the object
            try {
                const user = await client.users.fetch(userId); // Fetch the user by userId
                // if the user exists, add them to the list with the tag
                if (user) {
                    userList.push(user.tag); // You can store user.tag or user to include more user info
                }
            } catch (error) {
                console.error(`Could not fetch user with ID ${userId}:`, error);
            }
        }
    }
    return userList; // Returns an array of user tags or user objects
}
module.exports = {
    showBlacklistDB
};