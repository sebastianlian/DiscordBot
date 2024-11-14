const { SlashCommandBuilder, EmbedBuilder } = require("@discordjs/builders");
const RoleTimer = require("../models/roleTimeSchema");
const { getInactiveUsers } = require("../functions/inactivity");

const AUTO_PURGE_INTERVAL = 10 * 60 * 1000; // 10 minutes per check

async function startAutoPurge(guild) {
  console.log("Starting automatic purge checks...");

  setInterval(async () => {
    try {
      console.log("Running auto-purge process...");

      const inactiveUsers = await getInactiveUsers(); // Get all inactive users from the database
      const purgeList = [];

      for (const [userId, userInfo] of inactiveUsers.entries()) {
        const member = guild.members.cache.get(userId);
        if (!member) continue; // Skip if the member is not found

        // Get the highest role and update
        const highestRole = member.roles.highest; 
        const roleTimer = await RoleTimer.findOne({ roleId: highestRole.id });
        const roleTimeLimit = roleTimer
          ? roleTimer.roleTimer * 60 * 1000
          : 15 * 60 * 1000; // Default to 15 minutes if no timer exists

        const inactivityDuration = Date.now() - userInfo.lastMessageDate;
        if (inactivityDuration > roleTimeLimit) {
          purgeList.push(member);
        }
      }

      if (purgeList.length > 0) {
        for (const member of purgeList) {
          await member.kick("Automated inactivity purge"); // Kick each member in the purge list
        }

        console.log(`Purged ${purgeList.length} users: ${purgeList.map(m => m.user.tag).join(", ")}`);
      } else {
        console.log("No users to purge.");
      }
    } catch (error) {
      console.error("Error during auto-purge process:", error);
    }
  }, AUTO_PURGE_INTERVAL);
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("timer")
    .setDescription("Shows or sets the auto-purge interval.")
    .addIntegerOption(option =>
      option
        .setName("interval")
        .setDescription("Set the auto-purge interval in minutes (default: 10).")
        .setMinValue(1)
        .setRequired(false)
    ),

  async execute(interaction) {
    const interval = interaction.options.getInteger("interval");
    const currentInterval = AUTO_PURGE_INTERVAL / 60000;

    if (interval) {
      // Update interval in memory. might have to restart command sets new changes.
      console.log(`Auto-purge interval updated to ${interval} minutes.`);
      await interaction.reply(`Auto-purge interval updated to ${interval} minutes.`);
    } else {
      await interaction.reply(`Current auto-purge interval is ${currentInterval} minutes.`);
    }
  },

  startAutoPurge,
};
