const User = require("discord.js");
const blacklistSchema = require("../models/blacklistSchema");

async function showBlacklistDB(){
    await blacklistSchema.blackListDB.find();
}

module.exports = {
    showBlacklistDB
}