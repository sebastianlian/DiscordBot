const { SlashCommandBuilder, EmbedBuilder } = require("@discordjs/builders");
const { PermissionFlagsBits } = require("discord.js");
const { checkInactiveUsers, getInactiveUsers, activeUsers } = require("../functions/inactivity");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("showinactivity")
        .setDescription("Shows members who are considered inactive that are eligible to be purged.")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {

        const inactiveUsers = getInactiveUsers();

        let userList = "";
        for (const user of inactiveUsers) {
            userList += `<@${user.id}>\n`;
        }

        if (userList.length > 0) {
            const embed = new EmbedBuilder()
                .setTitle("Inactive Members")
                .setDescription(userList)
                .setColor(0xff0000);

            interaction.reply({
                embeds: [embed],
                ephemeral: true,
            });
        } else {
            const embed = new EmbedBuilder()
                .setTitle("No Inactive Users")
                .setColor(0x0099FF);

            interaction.reply({
                embeds: [embed],
                ephemeral: true,
            });
        }
    },
};