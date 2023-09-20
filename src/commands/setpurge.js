const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("setpurge")
		.setDescription("Sets the specified automated purge window (in days).")
        .addIntegerOption((option) => 
            option.setName("number")
            .setDescription("number in days")
            .setRequired(true)
            ),
	
    async execute(interaction) {
        //Reads the number that is entered. It is returned in the interaction.
		const purgeDays = interaction.options.getInteger("number");
        const confirmationMessage = `Purge window set to ${purgeDays} days.`;

        interaction.reply({
            content: confirmationMessage,
        });
	}
};