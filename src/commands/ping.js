const { SlashCommandBuilder } = require("@discordjs/builders");
const {PermissionFlagsBits} = require("discord.js");
const inactivitySchema = require("../models/inactivitySchema");
//This is the command builder 

module.exports = {
	data: new SlashCommandBuilder()
		.setName("ping")
		.setDescription("pongs")
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
	
    async execute(interaction) {
		const userId = "556635055124905997";
		const date = Date.now();
		const lastMessageDate = new Date('2023-11-28T12:34:56');
		await inactivitySchema.inactiveDB.create({userId, lastMessageDate});
		
	}
};
