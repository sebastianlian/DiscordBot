const { SlashCommandBuilder, EmbedBuilder } = require("@discordjs/builders");

module.exports = {
	data: new SlashCommandBuilder()
	//setName cannot have capital letters in it
		.setName("show_inactivity")
		.setDescription("pongs")
		.addUserOption((option) =>
		option.setName('user')
		.setDescription('user to be read')
		.setRequired(true)),

    async execute(interaction) {
		
		//This gets a single user within the server.
		const user = interaction.options.getUser("user");
		const addEmbed = new EmbedBuilder()
			.setTitle('The user is ' + user.tag)
			.setColor(0x2ECC71)
			await interaction.reply({
				embeds: [addEmbed],
			});
	}
};