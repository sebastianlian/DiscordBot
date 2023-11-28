//have timer.js show the amount of time left until the purge will execute
const { SlashCommandBuilder, EmbedBuilder } = require("@discordjs/builders");
const { time, PermissionFlagsBits, MessageEmbed, Embed } = require("discord.js");
const setPurgeDate = require("./setpurge");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("timer")
    .setDescription("Shows time left until purge")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    const purgeDays = setPurgeDate.getPurgeDays();
    const days = purgeDays;
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + days);
    const timeString = time(currentDate);
    const dateString = currentDate.toLocaleDateString();
    const relative = time(currentDate, "R");

    const timerEmbed = new EmbedBuilder()
        .setTitle("Timer")
        .setDescription(`The date and time ${days} days from today will be: ${dateString} ${timeString}`);

    await interaction.reply({
      embeds: [timerEmbed],
      ephemeral: true
    });
  },
};
