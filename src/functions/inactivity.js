const { User } = require("discord.js");
const inactivitySchema = require("../models/inactivitySchema");

// The bot is given the instruction to not listen to itself at all, and
// to say "hello" to any user in the server that says or enters anything.

 
async function listInactivity() {
        client.on('messageCreate', (message) => {

            if (!message.author.bot) {
                const activeMembers = [];
                const activeMember = message.author.username;
                if(((message.content.match("[\s\S]*")) || (message.attachments.size()>0)) && !(activeMembers.includes(activeMember))) {
                    activeMembers.push(activeMember);
                    const stringActiveMembers = activeMembers.join('\n');
                    message.reply ({
                        content: stringActiveMembers,
                        ephemeral: true
                    })
            }
            return;
            }   
        })
}

    module.exports = {
        listInactivity
    }