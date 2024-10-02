const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, EmbedBuilder } = require("@discordjs/builders");
const { ButtonStyle, PermissionFlagsBits } = require("discord.js");
const { getInactiveUsers } = require("../functions/inactivity");
const { PurgeHistory } = require("../models/purgeHistorySchema");

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
                const purgedUsers = [];
                console.log("Inactive Users:", inactiveUsers);

                if (!(inactiveUsers instanceof Map)) {
                    console.error("Error: inactiveUsers is not a Map");
                    return;
                }

                for (const [userId, userData] of inactiveUsers.entries()) { // Iterate over the Map
                    const member = interaction.guild.members.cache.get(userId);

                    if (member) {
                        try {
                            // kicks members who are in the list and updates the purged count
                            await member.kick("Inactive user purge");
                            purgedUsers.push({
                                userId: userId,
                                username: member.user.username
                            });
                        } catch (error) {
                            console.error(`Error kicking user ${userId}: ${error}`);
                        }
                    }
                }

                try {
                    await PurgeHistory.create({
                        userId: interaction.user.id,
                        username: interaction.user.username,
                        executionDate: new Date(),
                        purgedCount: purgedUsers.length,
                        purgedUsers: purgedUsers,
                    });
                } catch (error) {
                    console.error(`Error logging purge to database: ${error}`);
                }

                const purgedUserNames = purgedUsers.map(user => user.username).join(", ");
                const confirmEmbed = new EmbedBuilder()
                    .setTitle("Purge Confirmed")
                    .setDescription(`Removed ${purgedUsers.length} inactive users: ${purgedUserNames}`)
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