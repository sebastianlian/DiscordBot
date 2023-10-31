const { SlashCommandBuilder, EmbedBuilder } = require("@discordjs/builders");
const blacklistAdd = require("../functions/blacklistAdd");
const blacklistShow = require("../functions/blacklistShow");
const blacklistRemove = require("../functions/blacklistRemove");

const { channelMention, roleMention, userMention, PermissionFlagsBits } = require('discord.js');

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
		)
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

	
    async execute(interaction) {
		const subcommand = interaction.options.getSubcommand();

		//A switch depending which subcommand is used. Also reads the user that is entered to be repeated in the interaction.
    	switch (subcommand) {
      		case "add":
        		const userToAdd = interaction.options.getUser("user");
				const mentionedUser = userMention(userToAdd.id);
				await blacklistAdd.insertBlacklistDB(userToAdd.id);
				const addEmbed = new EmbedBuilder()
					.setDescription(`Added ${mentionedUser.toString()} to the blacklist.`)
					.setColor(0x2ECC71)
        		await interaction.reply({
					embeds: [addEmbed],
					ephemeral: false
				});
        		break;

      		case "remove":
        		const userToRemove = interaction.options.getUser("user");
				const userTag = userToRemove.tag;
				blacklistRemove.removeBlacklistDB(userToRemove.id, userTag)
					.then((resultMessage) => {
				//await blacklistRemove.removeBlacklistDB(userToRemove.id);
						const removeEmbed = new EmbedBuilder()
				//	.setTitle(`Removed ${userToRemove.tag} from the blacklist.`)
							.setDescription(resultMessage);

        		 interaction.reply({
					embeds: [removeEmbed],
					ephemeral: false
				});
			})
        		break;

      		case "show":
				const listOfUsers = await blacklistShow.showBlacklistDB(interaction.client);
				// make the list into a single string
				const userInList = listOfUsers.join(`\n`);
				const listEmbed = new EmbedBuilder()
					.setTitle("Here is the list of blacklisted users/roles.")
					.setDescription(`\n${userInList}`);
        		await interaction.reply({
					embeds: [listEmbed],
					ephemeral: false
				});
        	break;
    	}	
	},
};