const { User } = require("discord.js");
const blacklistSchema = require("../models/blacklistSchema");


async function insertBlacklistDB(userid){
    // await db.collection('blackListDB').insert(user)
    const userIdString = userid.toString();
    const doc = await blacklistSchema.blackListDB.findOne();
    if(doc){
        // doc.push(userIdString);
        await blacklistSchema.blackListDB.updateOne({$addToSet: {blackListedUsers: userIdString}});
        console.log(`User ${userIdString} has been blacklisted.`);
    }
    else{
        await blacklistSchema.blackListDB.create({ blackListedUsers: userIdString });
        console.log(`New Schema has been created with ${userIdString} as the first value.`);
    }
}

module.exports = {
    insertBlacklistDB
}