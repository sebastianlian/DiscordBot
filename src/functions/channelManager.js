const { ChannelType } = require('discord.js');
const Channel = require('../models/channelSchema'); // Adjust the path accordingly
//
// // Function to connect to MongoDB
// async function connectToDB() {
//     try {
//         await mongoose.connect(process.env.databaseToken, { useNewUrlParser: true, useUnifiedTopology: true });
//         console.log("Connected to DB");
//     } catch (error) {
//         console.error('Error connecting to DB:', error);
//     }
// }

// Function to store channels in the database
async function storeChannels(client) {
    try {
        const guild = await client.guilds.fetch(process.env.GUILD_ID);
        const channels = guild.channels.cache;

        // console.log('Retrieved Channels from Discord:', channels);

        for (const channel of channels.values()) {
            if (channel.type === ChannelType.GuildText || channel.type === ChannelType.GuildVoice) {
                // console.log('Processing Channel:', channel.name);
                await Channel.findOneAndUpdate(
                    { id: channel.id },
                    {
                        name: channel.name,
                        type: channel.type.toString(), // Ensure type is saved as a string
                        guildId: guild.id,
                        isActive: true,
                    },
                    { upsert: true }
                );
            }
        }

        // console.log("Channels stored in DB.");
    } catch (error) {
        console.error('Error storing channels:', error);
    }
}

// // Function to get all channels
// async function getAllChannels() {
//     try {
//         const channels = await Channel.find();
//         console.log('Channels:', channels);
//
//         const filteredChannels = channels.filter(channel =>
//             channel.type === ChannelType.GuildText.toString() || channel.type === ChannelType.GuildVoice.toString()
//         );
//         console.log('Filtered Channels:', filteredChannels);
//
//     } catch (error) {
//         console.error('Error fetching channels:', error);
//     }
// }

// Export functions
module.exports = {
    // connectToDB,
    storeChannels,
    // getAllChannels,
};
