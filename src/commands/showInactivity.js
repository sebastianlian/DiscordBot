const { SlashCommandBuilder, EmbedBuilder } = require("@discordjs/builders");

module.exports = {

	data: new SlashCommandBuilder()
	//setName cannot have capital letters in it
		.setName("show_inactivity")
		.setDescription("shows a list of inactive users"),
		
		//This code below gives discord
		//users the option of entering information
		//becasue the setRequired is true the discord user
		//must add an input.
		// .addUserOption((option) =>
		// option.setName('user')
		// .setDescription('user to be read')
		// .setRequired(true)),

    async execute(interaction) {
		
		//This gets a single user within the server.
		const user_list = interaction.guilds.get(/*process.env.GUILD_ID*/ "1146906893911064626");
		
		const addEmbed = new EmbedBuilder()
			.setTitle('The users in this server are ' + user_list)
			.setColor(0x2ECC71)
			await interaction.reply({
				embeds: [addEmbed],
			});
	}
};

