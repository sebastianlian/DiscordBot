const { User } = require("discord.js");
const blacklistSchema = require("../models/blacklistSchema")


async function insertBlacklistDB(userid){
    // await db.collection('blackListDB').insert(user)
    const doc = await blacklistSchema.blackListDB.find({});
    if(doc){
        doc.push(toString(userid));
        await blacklistSchema.blackListDB.updateOne({blackListedUsers: doc});
    }
    else{
        await blacklistSchema.blackListDB.create({blackListedUsers: [toString(userid)]});
    }
}

module.exports = {
    insertBlacklistDB
}