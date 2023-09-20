require('dotenv').config();
const { Client, IntentsBitField, Collection, ApplicationCommandType, Events, MessageButton, MessageActionRow } = require("discord.js");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const fs = require("fs");

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

//Reads the commands folder and checks for any files that end with .js
const commandFiles = fs.readdirSync("src/commands").filter(file => file.endsWith(".js"));

const commands = [];

client.commands = new Collection();

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands.push(command.data.toJSON());
    client.commands.set(command.data.name, command);
}

client.once("ready", () => {
    const CLIENT_ID = client.user.id;
    const rest = new REST({
        version: "9"
    }).setToken(process.env.TOKEN);

    //Registers the commands
    (async () => {
        try {
            if (process.env.ENV === "production"){
                await rest.put(Routes.applicationCommands(CLIENT_ID), {
                    body: commands
                });
                console.log("Successfully registered commands globally.")
            } else {
                await rest.put(Routes.applicationGuildCommands(CLIENT_ID, process.env.GUILD_ID), {
                    body: commands
                });
                console.log("Successfully registered commands per guild.")
            }
        } catch (err) {
            if (err) {
                console.error(err);
            }
        }
    })();
});

// Makes the bot send a message with its tag name
// identifiying that it is online and ready in the VS console.

client.on('ready', (clientInstance) =>{
    console.log(`⚡ ${clientInstance.user.tag} ⚡ is online.`);
})

client.on('interactionCreate', async (interaction) => {
    //checks if a chat message is a valid command
    if(!interaction.isCommand()){
        return
    }

    const command = client.commands.get(interaction.commandName);

    if(!command){
        return;
    }

    try {
        await command.execute(interaction);
    } catch(err) {
        if (err) {
            console.error(err);

            await interaction.reply({
                content: "An error has occurred",
                ephemeral: true
            });
        }
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
