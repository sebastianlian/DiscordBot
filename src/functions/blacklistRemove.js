const blacklistSchema = require("../models/blacklistSchema");


async function removeBlacklistDB(userid){
    const userIdString = userid.toString();
    const doc = await blacklistSchema.blackListDB.findOne();
    if(doc){
        await blacklistSchema.blackListDB.updateOne({$pull: {blackListedUsers: userIdString}});
        console.log(`User ${userIdString} has been removed from the Blacklist.`);
    }
    else{
        console.log(`User ${userIdString} is not in the Blacklist`);
    }
}

module.exports = {
    removeBlacklistDB
}