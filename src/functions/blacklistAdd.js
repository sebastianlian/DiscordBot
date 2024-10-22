const { User } = require("discord.js");
const blacklistSchema = require("../models/blacklistSchema");


async function insertBlacklistDB(userid, username) {
    if (!username) {
        console.error("Username must be provided.");
        return;
    }

    const userIdString = userid.toString();
    const userNameString = username.toString();
    const doc = await blacklistSchema.blackListDB.findOne();

    if (doc) {
        // Update the existing document by adding the user object to the array
        await blacklistSchema.blackListDB.updateOne(
            {},
            { $addToSet: { blackListedUsers: { userId: userIdString, userName: userNameString } } }
        );
        console.log(`User ${userIdString} has been blacklisted.`);
    } else {
        // Create a new document with the first user object
        await blacklistSchema.blackListDB.create({
            blackListedUsers: [{ userId: userIdString, userName: userNameString }]
        });
        console.log(`New Schema has been created with ${userIdString} ${userNameString} as the first value.`);
    }
}



module.exports = {
    insertBlacklistDB
}