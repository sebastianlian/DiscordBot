const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
	data: new SlashCommandBuilder()
	//setName cannot have capital letters in it
		.setName("show_inacticity")
		.setDescription("pongs"),
	
    async execute(interaction) {

		//Gets all users in the Guild(server) and stores them in the variable user_list
		const users_list = client.guilds.fetch("1009961334382796832");

		//iterates through all the members of the server and lists out their username.
		// users_list.members.array.forEach(member => {
		// 	interaction.reply.log(member.user.username);
		// });

		await interaction.reply("pong!");
	}
};