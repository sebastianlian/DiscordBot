const { ChannelType } = require('discord.js');
const Channel = require('../models/channelSchema'); // Adjust the path accordingly

// Function to store channels in the database
async function storeChannels(client) {
    try {
        const guild = await client.guilds.fetch(process.env.GUILD_ID);
        const channels = guild.channels.cache;

        for (const channel of channels.values()) {
            if (channel.type === ChannelType.GuildText || channel.type === ChannelType.GuildVoice) {
                await Channel.findOneAndUpdate(
                    { id: channel.id },
                    {
                        name: channel.name,
                        type: channel.type.toString(),
                        createdAt: channel.createdAt
                    },
                    { upsert: true }
                );
            }
        }

        console.log("Channels stored in DB.");
    } catch (error) {
        console.error('Error storing channels:', error);
    }
}


// Export functions
module.exports = {
    storeChannels,
};
