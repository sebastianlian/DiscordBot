const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, EmbedBuilder } = require("@discordjs/builders");
const { ButtonStyle, Embed, PermissionFlagsBits, MessageEmbed } = require("discord.js");
const { checkInactiveUsers, getInactiveUsers, activeUsers } = require("../functions/inactivity");
const PurgeHistory = require("../models/purgeHistorySchema");

// Log the PurgeHistory model to the console for debugging
// console.log('PurgeHistory model:', PurgeHistory);

module.exports = {
	data: new SlashCommandBuilder()
		.setName("purge")
		.setDescription("Kicks users who are inactive.")
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
	
    async execute(interaction) {
		const embed = new EmbedBuilder()
        	.setTitle("Purge Confirmation")
        	.setDescription("Would you like to continue with the purge?")
        	.setColor(0x0099FF)

		interaction.reply({
            embeds: [embed],
            ephemeral: true,
			components: [
				new ActionRowBuilder().setComponents(
					new ButtonBuilder()
						.setCustomId("confirm")
						.setLabel("Confirm")
						.setStyle(ButtonStyle.Success),
					new ButtonBuilder()
						.setCustomId("cancel")
						.setLabel("Cancel")
						.setStyle(ButtonStyle.Danger),
				)
			]
        });

		const filter = (i) => i.customId === "confirm" || i.customId === "cancel";
		const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });

		collector.on("collect", async (buttonInteraction) => {
			if (buttonInteraction.customId === "confirm") {
				const inactiveUsers = await getInactiveUsers(); // Await the function
				console.log("Inactive Users:", inactiveUsers);

				if (!(inactiveUsers instanceof Map)) {
					console.error("Error: inactiveUsers is not a Map");
					return;
				}

				let purgedCount = 0;

				// goes through the list of users and gets id
				for (const [userId, userInfo] of inactiveUsers.entries()) { // Iterate over the Map
					const member = interaction.guild.members.cache.get(userId);

					if (member) {
						try {
							// kicks members who are in the list and updates the purged count
							await member.kick("Inactive user purge");
							purgedCount++;
						} catch (error) {
							console.error(`Error kicking user ${user.id}: ${error}`);
						}
					}
				}

				//Log record of purge to database
				try{
					await PurgeHistory.create({
						userId: interaction.user.id,
						username: interaction.user.username,
						executionDate: new Date(),
						purgedCount: purgedCount,
					});
				} catch (error) {
					console.error(`Error logging purge to database: ${error}`);
				}

				const confirmEmbed = new EmbedBuilder()
					.setTitle("Purge Confirmed")
					.setDescription("Removed $[purgedCount] inactive users.")
					.setColor(0x2ECC71);

				await buttonInteraction.update({
					embeds: [confirmEmbed],
					components: [],
				});
			} else {
				const cancelEmbed = new EmbedBuilder()
					.setTitle("Purge Canceled")
					.setDescription("No users removed.")
					.setColor(0xE74C3C);

				await buttonInteraction.update({
					embeds: [cancelEmbed],
					components: [],
				});
			}
		});

		collector.on("end", (collected, reason) => {
			if (reason === "time") {
				interaction.followUp("Purge confirmation timed out.");
			}
		});
		
	}
};