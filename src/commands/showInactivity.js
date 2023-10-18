const { SlashCommandBuilder, EmbedBuilder } = require("@discordjs/builders");
const {PermissionFlagsBits} = require("discord.js");

module.exports = {

    data: new SlashCommandBuilder()
        .setName("showinactivity")
        .setDescription("Shows members who are considered inactive that are eligible to be purged.")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
        // .addStringOption((option) =>
        //     option
        //         .setName("message")
        //         .setDescription("the message to echo")
        //         .setRequired(true)
        //     ),

    async execute(interaction) {
        const serverMembers = await interaction.guild.members.fetch();
        const allMembers = serverMembers.map(member => member.user.tag).join('\n');
        
        interaction.reply({
            content: allMembers,
            emphemeral: true
        });
    }
}

