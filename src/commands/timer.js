//have timer.js show the amount of time left until the purge will execute

const { SlashCommandBuilder, EmbedBuilder } = require("@discordjs/builders");
const { time, PermissionFlagsBits } = require("discord.js");
const setPurgeDate = require("./setpurge");
const { getInactiveUsers, addOrUpdateInactivityDB } = require("../functions/inactivity"); // Importing functions to handle inactivity
const PURGE_TIMER = 10 * 1000; // Example: 10 seconds for testing

module.exports = {
  data: new SlashCommandBuilder()
    .setName("timer")
    .setDescription("Shows time left until purge")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    // Get the purge days set by setpurge
    const purgeDays = setPurgeDate.getPurgeDays();
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + purgeDays);
    const relative = time(currentDate, "R");

    // Fetch inactive users who exceed the PURGE_TIMER
    const inactiveUsers = await getInactiveUsers();
    const currentTime = Date.now();
    const usersToPurge = [];

    // Loop over inactive users to check if they exceed the PURGE_TIMER
    for (const [userId, userInfo] of inactiveUsers.entries()) {
      const inactivityDuration = currentTime - userInfo.lastMessageDate;

      if (inactivityDuration > PURGE_TIMER) {
        // Add user to the purge list
        await addOrUpdateInactivityDB(userId, userInfo.userName, userInfo.lastMessageDate);
        usersToPurge.push(userInfo.userName);
      }
    }

    // Create a response with the inactive users who will be purged
    const timerEmbed = new EmbedBuilder()
      .setTitle("Purge Timer")
      .setDescription(`The purge is scheduled for ${relative}.\n\nUsers marked for purging: \n${usersToPurge.length ? usersToPurge.join(", ") : "No users to purge."}`)
      .setColor(0x0099ff);

    // Reply with the embedded message
    await interaction.reply({
      embeds: [timerEmbed],
      ephemeral: true,
    });
  },
};
