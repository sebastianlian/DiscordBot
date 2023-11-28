// const { SlashCommandBuilder, EmbedBuilder } = require("@discordjs/builders");
// const { PermissionFlagsBits } = require("discord.js");
// const inactivity = require("../functions/inactivity");

// module.exports = {
//   data: new SlashCommandBuilder()
//     .setName("showinactivity")
//     .setDescription(
//       "Shows members who are considered inactive that are eligible to be purged."
//     )
//     .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
//   // .addStringOption((option) =>
//   //     option
//   //         .setName("message")
//   //         .setDescription("the message to echo")
//   //         .setRequired(true)
//   //     ),

//   async execute(interaction) {
//     // const serverMembers = await interaction.guild.members.fetch();
//     // const allMembers = serverMembers.map(member => member.user.tag).join('\n');

//     // This function checks to see if a message attachment has a url extension of any kind file

//     // function imageAttached(messageAttached) {
//     //     var url = messageAttached.url;
//     //     //creates the chech of the end of the message attachment
//     //     return messageAttached.url && messageAttached.url.match(/\.(jpeg|jpg|gif|png|bmp|svg)$/i) !== null;
//     // }

//     // ^^^^^^^     // **THIS FUNCTION ENEDED UP NOT BEING NEEDED**      ^^^^^^^

//     // The bot is given the instruction to not listen to itself at all, and
//     // to say "hello" to any user in the server that says or enters anything.

// //     client.on("messageCreate", (message) => {

// //       if (message.author.bot) {
// //         return;
// //       }

// //       if (
// //         message.content.match("[sS]*") ||
// //         message.attachments.size() > 0
// //         && !(activeMember.includes(message.author.tag))) {

// // await inactivity.listInactivity(interaction);
// const listOfPeople = inactivity.activeMembers

//         interaction.reply({
//           content: listOfPeople.join('\n'),
//           ephemeral: true,
//         });
// //       }
// //     });
//   },
// };

const { SlashCommandBuilder, EmbedBuilder } = require("@discordjs/builders");
const { PermissionFlagsBits } = require("discord.js");
const { checkInactiveUsers, getInactiveUsers, activeUsers } = require("../functions/inactivity");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("showinactivity")
        .setDescription("Shows members who are considered inactive that are eligible to be purged.")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        checkInactiveUsers(client);

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