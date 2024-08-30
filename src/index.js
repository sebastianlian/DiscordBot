require('dotenv').config();
const { Client, IntentsBitField, Collection } = require('discord.js');
const {storeChannels } = require('./functions/channelManager'); // adjust your path accordingly
const mongoose = require('mongoose');

// dynamic import for chalk
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

// bot ready event
client.on('ready', (clientInstance) =>{
    console.log(chalk.yellow(`⚡ ${clientInstance.user.tag} ⚡ is online.`));
// connects the mongodb database to the code
    (async()=> {
        try {
            await mongoose.connect(process.env.databaseToken);
            console.log(chalk.green("Connected to DB"));
        } catch (error) {
            console.log(chalk.red('DB is disconnected'));
        }
    })();

    // store channels in the database
     storeChannels(client);
});

client.login(process.env.TOKEN);
