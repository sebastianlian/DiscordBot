const { SlashCommandBuilder, EmbedBuilder } = require("@discordjs/builders");
const {PermissionFlagsBits} = require("discord.js");

let purgeDays = 0;
module.exports = {
  purgeDays: purgeDays,
  data: new SlashCommandBuilder()
    .setName("setpurge")
    .setDescription("Sets the specified automated purge window (in days).")
    .addIntegerOption((option) =>
      option
        .setName("number")
        .setDescription("number in days")
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    purgeDays = interaction.options.getInteger("number");
    const purgeDaysEmbed = new EmbedBuilder()
      .setTitle(`Purge window set to ${purgeDays} days.`)
      .setColor(0x0099ff);

    interaction.reply({
      embeds: [purgeDaysEmbed],
      //   ephemeral: true
    });
  },
  getPurgeDays: function () {
    return purgeDays;
  },
};
