const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, EmbedBuilder } = require("@discordjs/builders");
const { ButtonStyle, Embed, PermissionFlagsBits } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("purge")
		.setDescription("Kicks users who are inactive.")
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
	
    async execute(interaction) {
		const embed = new EmbedBuilder()
        	.setTitle("Purge Confrimation")
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
				const confirmEmbed = new EmbedBuilder()
					.setTitle("Purge Confirmed")
					.setDescription("Removing users...")
					.setColor(0x2ECC71);

				await buttonInteraction.update({
					embeds: [confirmEmbed],
					components: [],
				});
			} 
			
			else {
				const cancelEmbed = new EmbedBuilder()
					.setTitle("Purge Canceled")
					.setDescription("Purge canceled.")
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