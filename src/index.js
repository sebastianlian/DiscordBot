require('dotenv').config();
const { Client, IntentsBitField, Collection, ApplicationCommandType, Events, MessageButton, MessageActionRow } = require("discord.js");
const fs = require("fs");
const mongoose = require('mongoose');
const { eventNames } = require('process');

//These are the diffrent permissions the bot is allowed to get access to
//Guild == Server
//Client == Bot

 global.client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent
    ]
});

//Reads the commands folder and checks for any files that end with .js
const commandFiles = fs.readdirSync("src/commands").filter(file => file.endsWith(".js"));

const commands = [];

client.commands = new Collection();

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands.push(command.data.toJSON());
    client.commands.set(command.data.name, command);
}

//Reads the events folder and checks for any files that end with .js
const eventFiles = fs.readdirSync("src/events").filter(file => file.endsWith(".js"));

for (const file of eventFiles) {
    const events = require(`./events/${file}`);

    if (events.once) {
        client.once(events.name, (...args) => events.execute(...args, commands));
    } else {
        client.on(events.name, (...args) => evenys.execute(...args, commands));
    }
}

// Makes the bot send a message with its tag name
// identifiying that it is online and ready in the VS console.

client.on('ready', (clientInstance) =>{
    console.log(`⚡ ${clientInstance.user.tag} ⚡ is online.`);
//Connects the mongodb database to the code
    (async()=> {
        try {
            await mongoose.connect(process.env.databaseToken);
        console.log("Connected to DB");
        } catch (error) {
            console.log(`Error: ${error}`);
        }
        })();
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
