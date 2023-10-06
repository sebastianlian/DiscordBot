const { User } = require("discord.js");
const blacklistSchema = require("../models/blacklistSchema")


async function insertBlacklistDB(userid){
    // await db.collection('blackListDB').insert(user)
    const userIdString = userid.toString();
    const doc = await blacklistSchema.blackListDB.findOne({ blackListedUsers: userIdString });
    if(doc){
        // doc.push(toString(userid));
        // await blacklistSchema.blackListDB.updateOne({blackListedUsers: doc});
        console.log(`User ${userIdString} is already blacklisted.`);
    }
    else{
        await blacklistSchema.blackListDB.create({ blackListedUsers: userIdString });
        console.log(`User ${userIdString} has been blacklisted.`);
    }
}

module.exports = {
    insertBlacklistDB
}