const { SlashCommandBuilder, EmbedBuilder } = require("@discordjs/builders");
const { PermissionFlagsBits } = require("discord.js");
const RoleTimer = require("../models/roleTimeSchema");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("roletimer")
    .setDescription("Sets or updates a timer for a specific role in minutes.")
    .addRoleOption(option =>
      option
        .setName("role")
        .setDescription("Role to set or update the timer for.")
        .setRequired(true)
    )
    .addIntegerOption(option =>
      option
        .setName("timer")
        .setDescription("Timer duration in minutes.")
        .setMinValue(1)
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    const selectedRole = interaction.options.getRole("role");
    const timerValue = interaction.options.getInteger("timer");

    try {
      // Update or insert the timer for the specified role
      await RoleTimer.findOneAndUpdate(
        { roleId: selectedRole.id },
        { roleName: selectedRole.name, roleTimer: timerValue },
        { upsert: true, new: true }
      );

      const roleEmbed = new EmbedBuilder()
        .setTitle("Role Timer Updated")
        .setDescription(
          `Role ${selectedRole.name} now has a timer of ${timerValue} minutes.`
        )
        .setColor(0x0099ff);

      await interaction.reply({ embeds: [roleEmbed], ephemeral: true });
    } catch (error) {
      console.error("Error updating role timer:", error);
      await interaction.reply({
        content: "An error occurred while setting the role timer.",
        ephemeral: true,
      });
    }
  },
};

// Function to initialize default timers for roles on bot startup
async function initializeDefaultRoleTimers(guild) {
  try {
    console.log("Initializing default timers for roles...");
    const roles = guild.roles.cache;

    for (const role of roles.values()) {
      const existingRole = await RoleTimer.findOne({ roleId: role.id });

      if (!existingRole) {
        // Only create default timer if no timer exists for the role
        await RoleTimer.create({
          roleId: role.id,
          roleName: role.name,
          roleTimer: 15, // Default timer of 15 minutes
        });
        console.log(`Set default timer for role: ${role.name}`);
      } else {
        console.log(`Role ${role.name} already has a timer: ${existingRole.roleTimer} minutes`);
      }
    }
    console.log("Default role timer initialization complete.");
  } catch (error) {
    console.error("Error initializing default role timers:", error);
  }
}

module.exports.initializeDefaultRoleTimers = initializeDefaultRoleTimers;
