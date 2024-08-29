require('dotenv').config();
const { Client, IntentsBitField, Collection } = require('discord.js');
const {storeChannels, getAllChannels } = require('./functions/channelManager'); // Adjust the path accordingly
const fs = require('fs');
const mongoose = require('mongoose');

// Dynamic import for chalk
let chalk;
(async () => {
    chalk = (await import('chalk')).default;
})();

global.client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent
    ]
});

// Initialize Collection
client.commands = new Collection();

// Read commands and events
const commandFiles = fs.readdirSync("commands").filter(file => file.endsWith(".js"));
const commands = [];

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands.push(command.data.toJSON());
    client.commands.set(command.data.name, command);
}

const eventFiles = fs.readdirSync("events").filter(file => file.endsWith(".js"));

for (const file of eventFiles) {
    const events = require(`./events/${file}`);
    if (events.once) {
        client.once(events.name, (...args) => events.execute(...args, commands));
    } else {
        client.on(events.name, (...args) => events.execute(...args, commands));
    }
}

// Bot ready event
client.on('ready', (clientInstance) =>{
    console.log(chalk.yellow(`⚡ ${clientInstance.user.tag} ⚡ is online.`));
//Connects the mongodb database to the code
    (async()=> {
        try {
            await mongoose.connect(process.env.databaseToken);
            console.log(chalk.green("Connected to DB"));
        } catch (error) {
            console.log(chalk.red('DB is disconnected'));
        }
    })();

    // Store channels in the database
     storeChannels(client);
    //
    // // Optional: Fetch and print all channels
    // await getAllChannels();

    console.log("All channels stored in DB.");
});

client.login(process.env.TOKEN);
