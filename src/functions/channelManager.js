// Import necessary modules from discord.js for channel types
const { ChannelType } = require('discord.js');
const Channel = require('../models/channelSchema'); // Adjust your path accordingly
const UserActivity = require('../models/userActivitySchema'); // Adjust your path accordingly

// Initialize an empty cache to temporarily store user activities
let userActivitiesCache = {}; // Cache to store user activities temporarily

// Function to store channels and user activities in the database
async function storeChannels(client) {
    try {
        // Fetch the guild using the GUILD_ID from the environment variables
        const guild = await client.guilds.fetch(process.env.GUILD_ID);
        // Get all the cached channels from the guild
        const channels = guild.channels.cache;

        // Loop through all channels in the guild
        for (const channel of channels.values()) {
            // Check if the channel is a text or voice channel
            if (channel.type === ChannelType.GuildText || channel.type === ChannelType.GuildVoice) {
                // // debug for showing what channel is processing
                // console.log(`Processing channel: ${channel.name} (${channel.id})`);

                // Save the channel information to the database or update it if it already exists
                await Channel.findOneAndUpdate(
                    { id: channel.id }, // Channel ID to search for
                    {
                        name: channel.name,
                        type: channel.type.toString(),
                        createdAt: channel.createdAt
                    },
                    { upsert: true } // Insert new record if it doesn't exist
                );

                // If the channel is a text channel, process user messages
                if (channel.type === ChannelType.GuildText) {
                    // Fetch the last 100 messages from the channel
                    const messages = await channel.messages.fetch({ limit: 100 });
                    // Object to store user activities within this channel
                    const userActivities = {};

                    // Loop through each message in the fetched messages
                    for (const [messageId, message] of messages) {
                        const user = message.author; // Get the user who sent the message

                        // If the user hasn't been logged in this channel yet, create an entry
                        if (!userActivities[user.id]) {
                            userActivities[user.id] = {
                                username: user.username,
                                lastMessage: message.content,
                                lastActive: message.createdAt
                            };
                        } else {
                            // If the user already has an entry, update if the message is more recent
                            if (message.createdAt > userActivities[user.id].lastActive) {
                                userActivities[user.id].lastMessage = message.content;
                                userActivities[user.id].lastActive = message.createdAt;
                            }
                        }
                    }
                    // // debug to see user activities in each channel
                    // console.log(`User activities for channel ${channel.name}:`, userActivities);

                    // Loop through each user's activity and update the database
                    for (const [userId, activity] of Object.entries(userActivities)) {
                        // Find or update user activity in the database for the current channel
                        await UserActivity.findOneAndUpdate(
                            { userId: userId, channelName: channel.name },
                            {
                                username: activity.username,
                                lastMessage: activity.lastMessage,
                                lastActive: activity.lastActive
                            },
                            { upsert: true, new: true } // Insert new record if it doesn't exist, otherwise update it
                        );

                        // Cache the user activity to reduce database queries
                        userActivitiesCache[userId] = activity;
                    }

                    // // debug to see user activities after processing the channels
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
    // // debug to see current user activities cache
    // console.log('Current User Activities Cache:', userActivitiesCache);
    return userActivitiesCache;
}

module.exports = {
    storeChannels,
    getUserActivities,
};
