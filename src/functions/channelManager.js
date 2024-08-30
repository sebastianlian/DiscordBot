const { ChannelType } = require('discord.js');
const Channel = require('../models/channelSchema'); // adjust your path accordingly
const UserActivity = require('../models/userActivitySchema'); // schema to store user activity

// function to store channels and user activities in the database
async function storeChannels(client) {
    try {
        const guild = await client.guilds.fetch(process.env.GUILD_ID);
        const channels = guild.channels.cache;

        for (const channel of channels.values()) {
            if (channel.type === ChannelType.GuildText || channel.type === ChannelType.GuildVoice) {
                // store the channel info in the database
                await Channel.findOneAndUpdate(
                    { id: channel.id },
                    {
                        name: channel.name,
                        type: channel.type.toString(),
                        createdAt: channel.createdAt
                    },
                    { upsert: true }
                );

                // loop through each message in the text channel to get initial user activities
                //TODO: create a loop to iterate through each message  for voice channels to get initial user activities
                if (channel.type === ChannelType.GuildText) {
                    const messages = await channel.messages.fetch({ limit: 100 });

                    const userActivities = {};

                    for (const [messageId, message] of messages) {
                        const user = message.author;

                        if (!userActivities[user.id]) {
                            userActivities[user.id] = {
                                username: user.username,
                                lastMessage: message.content,
                                lastActive: message.createdAt
                            };
                        } else {
                            // update only if the message is more recent
                            if (message.createdAt > userActivities[user.id].lastActive) {
                                userActivities[user.id].lastMessage = message.content;
                                userActivities[user.id].lastActive = message.createdAt;
                            }
                        }
                    }

                    // update the database with the most recent message and timestamp for each user
                    for (const [userId, activity] of Object.entries(userActivities)) {
                        await UserActivity.findOneAndUpdate(
                            { userId: userId, channelName: channel.name },
                            {
                                username: activity.username,
                                lastMessage: activity.lastMessage,
                                lastActive: activity.lastActive
                            },
                            { upsert: true, new: true }
                        );
                    }
                }
            }
        }

        console.log("Channels and user activities stored in DB.");
    } catch (error) {
        console.error('Error storing channels or user activity:', error);
    }
}

module.exports = {
    storeChannels,
};
