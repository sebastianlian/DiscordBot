require('dotenv').config();
const {Client, IntentsBitField, Collection} = require('discord.js');

//These are the diffrent permissions the bot is allowed to get access to
//Guild == Server
//Client == Bot

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent
    ]
});

client.commands = new Collection();

// Makes the bot send a message with its tag name
// identifiying that it is online and ready in the VS console.

client.on('ready', (clientInstance) =>{
    console.log(`⚡ ${clientInstance.user.tag} ⚡ is online.`);

    const guildId = '1146906893911064626';
    const guild = client.guilds.cache.get(guildId);
    let commands
    
    if (guild) {
        commands = guild.commands
    } else {
        commands = client.application?.commands
    }

    commands?.create({
        name: 'help',
        description: 'Helps by listing out all commands.'
    })

    commands?.create({
        name: 'blacklist',
        description: 'Adds or Removes people from the blacklist.'
    })

    commands?.create({
        name: 'purge',
        description: 'Kicks users who are inactive.'
    })
})

client.on('interactionCreate', async (interaction) => {
    if(!interaction.isCommand()){
        return
    }

    const { commandName, options} = interaction

    if (commandName === 'help') {
        interaction.reply({
            content: 'How can I help.'
        })
    } else if (commandName === 'blacklist') {
        interaction.reply({
            content: 'User has been added.'
        })
    } else if (commandName === 'purge') {
        interaction.reply({
            content: 'Inactive users have been removed.'
        })
    }
})

// The bot is given the instruction to not listen to itself at all, and
// to say "hello" to any user in the server that says "hello".

client.on('messageCreate', (message) => {
    if (message.author.bot) {
        return;
    }
    
    if(message.content === "hello") {
        message.reply("hello");
    }
})

//1.) The Token for the bot is found in the
// ".env" file so that the Token is more secure when 
// publishing to git becasue the ".gitignore" file is ignoring the ".env" file.
// The ".env" file contains only one line which is ***TOKEN = bot_token***
// Due to this being a GitHub group project the ".env" file will not be added to the ".gitignore" file
// for transparency.

client.login(process.env.TOKEN);

//2.) By using the Node.js Terminal command ***nodemon*** or ***nodemon src/index.js***
// you should be able to start up the bot if you enter ***ctrl + c*** it will turn off.

//3.) In the "package.json" file you will find that the reason
// why you only have to type in nodemon is becasue the script
// location is already specified in "main:".
