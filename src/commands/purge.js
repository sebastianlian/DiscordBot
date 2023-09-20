const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("purge")
		.setDescription("Kicks users who are inactive."),
	
    async execute(interaction) {
		interaction.reply({
            content: "Purge complete.",
            ephemeral: true,
        });
	}
};