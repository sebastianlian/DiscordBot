const { SlashCommandBuilder, EmbedBuilder } = require("@discordjs/builders");

module.exports = {

    data: new SlashCommandBuilder()
        .setName("showinactivity")
        .setDescription("Shows members who are considered inactive that are eligible to be purged."),
        // .addStringOption((option) =>
        //     option
        //         .setName("message")
        //         .setDescription("the message to echo")
        //         .setRequired(true)
        //     ),

    async execute(interaction) {
        // const serverMembers = await interaction.guild.members.fetch();
        // const allMembers = serverMembers.map(member => member.user.tag).join('\n');
        
    // This function checks to see if a message attachment has a url extension of any kind file

    // function imageAttached(messageAttached) {
    //     var url = messageAttached.url;
    //     //creates the chech of the end of the message attachment
    //     return messageAttached.url && messageAttached.url.match(/\.(jpeg|jpg|gif|png|bmp|svg)$/i) !== null;
    // }

    // ^^^^^^^     // **THIS FUNCTION ENEDED UP NOT BEING NEEDED**      ^^^^^^^

// The bot is given the instruction to not listen to itself at all, and
// to say "hello" to any user in the server that says or enters anything.

        client.on('messageCreate', async (message) => {
            const activeMembers = [];
            
            if (message.author.bot) {
                return;
            }

            if(((message.content.match("[\s\S]*")) || (message.attachments.size()>0)) && !(activeMembers.includes(message.author.tag))) {
                // if(message.attachments.every(imageAttached)) {
                await activeMembers.push(message.author.tag);

                    const activeMembersList = activeMembers.map(member => member.user.tag).join('\n');

                    message.reply({
                        content : activeMembersList,
                        ephemeral : true
                    });
                // }
            }
        })
    }
}