const { ChannelType } = require('discord.js');
const Channel = require('../models/channelSchema'); // adjust your path accordingly
const UserActivity = require('../models/userActivitySchema'); // schema to store user activity

let userActivitiesCache = {}; // Cache to store user activities temporarily

// function to store channels and user activities in the database
async function storeChannels(client) {
    try {
        const guild = await client.guilds.fetch(process.env.GUILD_ID);
        const channels = guild.channels.cache;

        for (const channel of channels.values()) {
            if (channel.type === ChannelType.GuildText || channel.type === ChannelType.GuildVoice) {
                // console.log(`Processing channel: ${channel.name} (${channel.id})`);

                await Channel.findOneAndUpdate(
                    { id: channel.id },
                    {
                        name: channel.name,
                        type: channel.type.toString(),
                        createdAt: channel.createdAt
                    },
                    { upsert: true }
                );

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
                            if (message.createdAt > userActivities[user.id].lastActive) {
                                userActivities[user.id].lastMessage = message.content;
                                userActivities[user.id].lastActive = message.createdAt;
                            }
                        }
                    }

                    // console.log(`User activities for channel ${channel.name}:`, userActivities);

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

                        userActivitiesCache[userId] = activity;
                    }

                    // console.log(`Cached user activities after processing channel ${channel.name}:`, userActivitiesCache);
                }
            }
        }

        console.log("Channels and user activities stored in DB.");
    } catch (error) {
        console.error('Error storing channels or user activity:', error);
    }
}

// Function to get cached user activities
function getUserActivities() {
    // console.log('Current User Activities Cache:', userActivitiesCache);
    return userActivitiesCache;
}

module.exports = {
    storeChannels,
    getUserActivities,
};
