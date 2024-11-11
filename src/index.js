// Load environment variables from a .env file into process.env
require('dotenv').config({ path: `${__dirname}/.env` });
//comment for testing

const path = require('path');

// Import necessary modules from discord.js
const { Client, IntentsBitField, GatewayIntentBits, Collection } = require('discord.js');

// Import custom functions for channel management, inactivity database, and activity checks
const { storeChannels, refreshLatestMessages } = require('./functions/channelManager'); // Adjust the path accordingly
const { checkAndUpdateInactiveUsers, trackUserActivity, refreshInactiveUsers, loadUserActivityOnStartup} = require('./functions/inactivity'); // Adjust the path accordingly
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
        GatewayIntentBits.GuildVoiceStates, // Required to access voice states
        GatewayIntentBits.GuildMessageReactions, // Required to access reaction event
    ]
});

// Initialize a Collection for storing commands
client.commands = new Collection();

// Read all command files from the "commands" directory
const commandFiles = fs.readdirSync(path.join(__dirname, 'commands')).filter(file => file.endsWith(".js"));

// Array to hold command data
const commands = [];

// Loop through each command file
for (const file of commandFiles) {
    // Require the command file and extract command data
    const command = require(path.join(__dirname, 'commands', file));
    commands.push(command.data.toJSON());
    client.commands.set(command.data.name, command);
}

// Read all event files from the "events" directory
const eventFiles = fs.readdirSync(path.join(__dirname, 'events')).filter(file => file.endsWith(".js"));

// Loop through each event file
for (const file of eventFiles) {
    const events = require(path.join(__dirname, 'events', file));
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

    // Step 1: Load existing user activity from the database
    await loadUserActivityOnStartup();

    // Step 2: Refresh inactive users based on loaded activity
    await refreshInactiveUsers();

    // Step 3: Store channel information in the database
    await storeChannels(client);

    // DO NOT DELETE OR REMOVE ANY FUNCTION CALLS
    setInterval(() => {
        checkAndUpdateInactiveUsers();
        trackUserActivity(clientInstance);
        refreshLatestMessages(clientInstance); // Call to refresh latest messages
    }, 20000); // Check every 20 secs, adjust as needed
});

// Log the bot token for debugging
// console.log('Bot Token:', process.env.TOKEN); // Debugging line

// Log in to Discord using the token from environment variables
client.login(process.env.TOKEN)
    .then(() => console.log("Bot is logged in!"))
    .catch(error => console.error('Error logging in:', error));