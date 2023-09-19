require('dotenv').config();
const { Client, IntentsBitField, Collection, ApplicationCommandType, REST, Routes, Events, MessageButton, MessageActionRow } = require('discord.js');

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
        description: 'Adds or Removes people from the blacklist.',
        options: [{
            type: 1, // subcommand type
            name: 'add',
            description: 'Adds User',
            options: [{
                type: 6, // User Type
                name: 'user',
                description: 'User you are adding',
                required: true,
            }]
        },
        {
            type: 1, // subcommand Type
            name: 'remove',
            description: 'Removes User',
            options: [{
                type: 6, // User Type
                name: 'user',
                description: 'User you are removing',
                required: true,
            }]
        },
        {
            type: 1, // subcommand Type
            name: 'show',
            description: 'Shows the current blacklisted user/roles',
        }
    ]
    })

    commands?.create({
        name: 'purge',
        description: 'Kicks users who are inactive.'
    })

    commands?.create({
        name: 'setpurge',
        description: 'Sets the specified automated purge window (in days).',
        options: [{
            type: 4, 
            name: 'days',
            description: 'Number of days'
        }]    
    })
})

client.on('interactionCreate', async (interaction) => {
    if(!interaction.isCommand()){
        return
    }

    const { commandName, options} = interaction

    const cmds = [
        '/help - Lists out all the different configuration commands for the bot.',
        '/blacklist show - Shows the current blacklisted user/roles',
        '/blacklist add (user/role) - Lets you add a specific user/role to a blacklist which makes them bypass the purges.',
        '/blacklist remove (user/role) - Lets you remove a specific user/role to a blacklist.',
        '/purge - Starts a manual purge which will gather all inactive users and send specified channel for confirmation.',
        '/setpurge (time in days) - Sets the specified automated purge window (in days).',
        '/timer (role) (time) - Sets a time window (in days) for a role before considering them inactive.',
        '/show inactivity - Shows members who are considered "inactive" that are eligible to be purged.'
    ];

    // This should be usable by everyone or at least have one for admins who can see about 
    // users and for server members who can see only the roles inactivity times
    // See about adding a command that shows the diffrent users and roles and tells how long they can be inactive for.
    if (commandName === 'help') {
        interaction.reply({
            content: cmds.join('\n')
        });
    } else if (commandName === 'blacklist') {
        const subcommand = interaction.options.getSubcommand();
        const user = interaction.options.getUser('user');
        console.log(user);

        if (subcommand === 'add'){
            interaction.reply({
                content: 'User has been added.'
            });
        } else if (subcommand === 'remove'){
            interaction.reply({
                content: 'User has been removed.',
                ephemeral: true
            });
        } else if (subcommand === 'show'){
            interaction.reply({
                content: 'List of user/roles in blacklist'
            });
        }

    } else if (commandName === 'purge') {
        interaction.reply({
            content: 'Purge complete.',
            ephemeral: true
        });
    } else if (commandName === 'set'){
        const subcommand = interaction.options.getSubcommand();
        const days = interaction.options.getInteger('days')
        interaction.reply({
            content: days
        })
    }
});

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
