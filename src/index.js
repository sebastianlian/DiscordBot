require('dotenv').config();
const { Client, IntentsBitField, Collection } = require('discord.js');
const { storeChannels, getUserActivities } = require('./functions/channelManager'); // Adjust the path accordingly
const { addInactivityDB } = require("./functions/addInactiveUser");
const { activeUsers, checkInactiveUsers } = require ("./functions/inactivity");
const fs = require('fs');
const mongoose = require('mongoose');

// Dynamic import for chalk colors in terminal
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
client.on('ready', async (clientInstance) => {
    console.log(chalk.yellow(`⚡ ${clientInstance.user.tag} ⚡ is online.`));
    // Connect to MongoDB
    try {
        await mongoose.connect(process.env.databaseToken);
        console.log(chalk.green("Connected to DB"));
    } catch (error) {
        console.log(chalk.red('DB is disconnected'));
    }

    // Store channels in the database
    await storeChannels(client);

    // Await the result of getUserActivities and pass it to addInactivityDB
    const userActivities = getUserActivities();
    console.log('Cached User Activities:', userActivities);

    // Add/update user activities in the inactivity DB
    for (const [userId, activity] of Object.entries(userActivities)) {
        console.log('Adding user to inactivity DB:', {
            userId: userId,
            userName: activity.username,
            lastMessageDate: activity.lastActive
        });
        await addInactivityDB(userId, activity.username, activity.lastActive);
    }
    // Check inactive users and log active users
    await checkInactiveUsers(client); // Call to checkInactiveUsers
    console.log('Active Users:', activeUsers); // Log the activeUsers
});

client.login(process.env.TOKEN);
