const { SlashCommandBuilder } = require("@discordjs/builders");
const {PermissionFlagsBits} = require("discord.js");
//This is the command builder 

module.exports = {
	data: new SlashCommandBuilder()
		.setName("ping")
		.setDescription("pongs")
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
	
    async execute(interaction) {
		await interaction.reply("pong!");
	}
};