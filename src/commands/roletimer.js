const { SlashCommandBuilder, EmbedBuilder } = require("@discordjs/builders");
const { PermissionFlagsBits, roleMention } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("roletimer")
    .setDescription("Sets the grace period for a certain role.")
    .addRoleOption((option) =>
      option
        .setName("role")
        .setDescription("Role you are setting the timer for.")
        .setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName("number")
        .setDescription("number in days")
        .setMinValue(1)
        .setMaxValue(365)
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    const role = interaction.options.getRole("role")
    const mentionedRole = roleMention(role.id)
    const days = interaction.options.getInteger("number")

    const roleEmbed = new EmbedBuilder()
        .setTitle(`Role Timer`)
        .setDescription(`The role ${mentionedRole.toString()} has a grace period of ${days} days.`)
        .setColor(0x0099ff);

    interaction.reply({
        embeds: [roleEmbed],
        ephemeral: true
    });    
  },
  
};
