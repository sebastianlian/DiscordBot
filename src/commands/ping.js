const { SlashCommandBuilder } = require("@discordjs/builders");
//This is the command builder 

module.exports = {
	data: new SlashCommandBuilder()
		.setName("ping")
		.setDescription("pongs"),
	
    async execute(interaction) {
		await interaction.reply("pong!");
	}
};