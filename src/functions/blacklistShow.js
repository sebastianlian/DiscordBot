const User = require("discord.js");
const blacklistSchema = require("../models/blacklistSchema");

async function showBlacklistDB(client) {
    const doc = await blacklistSchema.blackListDB.findOne();
    const userList = [];
    if (doc) {
        const blacklistedUsers = doc.blackListedUsers;

        // for every id in the database
        for (const id of blacklistedUsers) {
            const user = await client.users.fetch(id);
            // if there is a user add them to the list with the tag
            if (user) {
                userList.push(user);
            }
        }
    }
    return userList;
}

module.exports = {
    showBlacklistDB
};