//have timer.js show the amount of time left until the purge will execute
const { SlashCommandBuilder} = require("@discordjs/builders");
const { time } = require('discord.js');
const setTime = require("src/commands/setpurge.js");

const date = new Date();
const timeString = time(date);
const relative = time(date, 'R');


module.exports = {
	data: new SlashCommandBuilder()
		.setName("timer")
		.setDescription("Shows time left until purge"),
	

    async execute(interaction) {
		await interaction.reply(Dayspurgedays);
	}
};