const { SlashCommandBuilder, EmbedBuilder } = require("@discordjs/builders");

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
        const purgeDaysEmbed = new EmbedBuilder()
					.setTitle(`Purge window set to ${purgeDays} days.`)
					.setColor(0x0099FF)

        interaction.reply({
            embeds: [purgeDaysEmbed],
        });
	}
};