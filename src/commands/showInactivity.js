const { SlashCommandBuilder, EmbedBuilder } = require("@discordjs/builders");
const { PermissionFlagsBits } = require("discord.js");
const { getInactiveUsers } = require("../functions/inactivity");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("showinactivity")
        .setDescription("Shows members who are considered inactive that are eligible to be purged.")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        try {
            const inactiveUsers = await getInactiveUsers(); // Ensure to await the function

            if (!(inactiveUsers instanceof Map)) {
                throw new Error('Expected a Map from getInactiveUsers');
            }

            // console.log("Inactive users length:", inactiveUsers.size);

            let userList = "";
            for (const [userId, userInfo] of inactiveUsers.entries()) {
                const lastActiveDate = new Date(userInfo.lastMessageDate).toLocaleString(); // Format the date
                userList += `<@${userId}> - Last active: ${lastActiveDate}\n`;            }

            const embed = new EmbedBuilder()
                .setTitle(inactiveUsers.size > 0 ? "Inactive Members" : "No Inactive Users")
                .setDescription(userList || "No inactive users found.")
                .setColor(inactiveUsers.size > 0 ? 0xff0000 : 0x0099FF);

            await interaction.reply({
                embeds: [embed],
                ephemeral: true,
            });
        } catch (error) {
            console.error('Error executing /showinactivity command:', error);
            await interaction.reply({
                content: 'There was an error while executing this command.',
                ephemeral: true,
            });
        }
    },
};
