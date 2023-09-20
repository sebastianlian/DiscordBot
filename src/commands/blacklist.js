const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
	//Example of subcommands. Only accepts a user value and the command will not execute without a user.
	//option allows the user to add the users name
	//add/remove are sub commands. The option of user is required for both commands
	data: new SlashCommandBuilder()
		.setName("blacklist")
		.setDescription("Adds or Removes people from the blacklist.")
		.addSubcommand((subcommad) => 
			subcommad.setName("add")
			.setDescription("Adds User")
			.addUserOption((option) =>
				option.setName("user")
				.setDescription("User you are adding")
				.setRequired(true)
			)
		)
		.addSubcommand((subcommad) =>
			subcommad.setName("remove")
			.setDescription("Removes User")
			.addUserOption((option) =>
				option.setName("user")
				.setDescription("User you are removing")
				.setRequired(true)
			)
		)
		.addSubcommand((subcommad) =>
			subcommad.setName("show")
			.setDescription("Shows the current blacklisted user/roles.")
		),

	
    async execute(interaction) {
		const subcommand = interaction.options.getSubcommand();

		//A switch depending which subcommand is used. Also reads the user that is entered to be repeated in the interaction.
    	switch (subcommand) {
      		case "add":
        		const userToAdd = interaction.options.getUser("user");
        		await interaction.reply(`Added ${userToAdd.tag} to the blacklist.`);
        		break;

      		case "remove":
        		const userToRemove = interaction.options.getUser("user");
        		await interaction.reply(`Removed ${userToRemove.tag} from the blacklist.`);
        		break;

      		case "show":
        		await interaction.reply("Here is the list of blacklisted users/roles.");
        	break;
    	}	
	},
};