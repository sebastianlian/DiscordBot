// Load environment variables from a .env file into process.env
require('dotenv').config();

// Import necessary modules from discord.js
const { Client, IntentsBitField, GatewayIntentBits, Collection } = require('discord.js');

// Import custom functions for channel management, inactivity database, and activity checks
const { storeChannels } = require('./functions/channelManager'); // Adjust the path accordingly
const { checkAndUpdateInactiveUsers, logActiveUsersMap, trackUserActivity } = require('./functions/inactivity'); // Adjust the path accordingly
const { getChalk } = require('./utility/utils');

// Import Node.js filesystem module for file operations
const fs = require('fs');
const mongoose = require('mongoose');




// Create a new Discord client instance with specified intents
global.client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds, // Required to receive guild events
        IntentsBitField.Flags.GuildMessages, // Required to receive message events
        IntentsBitField.Flags.MessageContent, // Required to access message content
        GatewayIntentBits.GuildVoiceStates
    ]
});

// Initialize a Collection for storing commands
client.commands = new Collection();

// Read all command files from the "commands" directory
const commandFiles = fs.readdirSync("commands").filter(file => file.endsWith(".js"));

// Array to hold command data
const commands = [];

// Loop through each command file
for (const file of commandFiles) {
    // Require the command file and extract command data
    const command = require(`./commands/${file}`);
    commands.push(command.data.toJSON());
    client.commands.set(command.data.name, command);
}

// Read all event files from the "events" directory
const eventFiles = fs.readdirSync("events").filter(file => file.endsWith(".js"));

// Loop through each event file
for (const file of eventFiles) {
    const events = require(`./events/${file}`);
    if (events.once) {
        client.once(events.name, (...args) => events.execute(...args, commands));
    } else {
        client.on(events.name, (...args) => events.execute(...args, commands));
    }
}

// Event handler for when the bot is ready
client.on('ready', async (clientInstance) => {
    const chalk = getChalk(); // Get the chalk instance
    console.log(chalk.yellow(`⚡ ${clientInstance.user.tag} ⚡ is online.`));
    // Connect to MongoDB
    try {
        await mongoose.connect(process.env.databaseToken);
        console.log(chalk.green("Connected to DB"));
    } catch (error) {
        console.log(chalk.red('DB is disconnected'));
    }

    // Call storeChannels to save channel information in the database - (channels)
    await storeChannels(client);

    setInterval(() => {
        checkAndUpdateInactiveUsers();
        trackUserActivity(clientInstance);
    }, 20000); // Check every 20 secs, adjust as needed

    // await checkAndUpdateInactiveUsers(client);
});


// Log in to Discord using the token from environment variables
client.login(process.env.TOKEN);