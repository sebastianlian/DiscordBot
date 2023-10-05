const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("showinactivity")
        .setDescription("Shows members who are considered inactive that are eligible to be purged.")
        .addStringOption((option) =>
            option
                .setName("message")
                .setDescription("the message to echo")
                .setRequired(true)
            ),
    async executr(interaction) {
        interaction.reply({
            content: interaction.option.getString("message"),
            emphemeral: true
        });
    }
}