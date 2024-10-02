// Import necessary modules from discord.js for channel types
const { ChannelType } = require('discord.js');
const Channel = require('../models/channelSchema'); // Adjust your path accordingly
const UserActivity = require('../models/userActivitySchema'); // Adjust your path accordingly
const { getChalk } = require('../utility/utils'); // Adjust the path accordingly

// Create a Map to store user activities
let userActivitiesMap = new Map();

// Function to store channels and user activities in the database
async function storeChannels(client) {
    const chalk = getChalk(); // Get the chalk instance

    try {
        // Fetch the guild using the GUILD_ID from the environment variables
        const guild = await client.guilds.fetch(process.env.GUILD_ID);
        // Get all the cached channels from the guild
        const channels = guild.channels.cache;

        // Loop through all channels in the guild
        for (const channel of channels.values()) {
            // Check if the channel is a text or voice channel
            if (channel.type === ChannelType.GuildText || channel.type === ChannelType.GuildVoice) {
                // Save the channel information to the database or update it if it already exists
                await Channel.findOneAndUpdate(
                    {id: channel.id}, // Channel ID to search for
                    {
                        name: channel.name,
                        type: channel.type.toString(),
                        createdAt: channel.createdAt
                    },
                    { upsert: true } // Insert new record if it doesn't exist
                );

                // Track text channel activity
                if (channel.type === ChannelType.GuildText) {
                    await trackAndLogTextChannelActivity(channel);
                }
            }
        }

        console.log(chalk.green("Channels and user activities stored in DB."));

        // Now handle voice channel tracking
        trackVoiceChannelActivity(client);

    } catch (error) {
        console.error(chalk.red('Error storing channels or user activity'), error);
    }
}




// Function to fetch the latest messages from all text channels
async function refreshLatestMessages(client) {
    const chalk = getChalk(); // Get the chalk instance

    try {
        const guild = await client.guilds.fetch(process.env.GUILD_ID);
        const channels = guild.channels.cache;

        for (const channel of channels.values()) {
            if (channel.type === ChannelType.GuildText) {
                // Fetch the latest messages
                const messages = await channel.messages.fetch({ limit: 100 });
                await trackAndLogTextChannelActivity(channel, messages);
            }
        }

        console.log(chalk.cyan("Latest messages refreshed from all text channels."));
    } catch (error) {
        console.error(chalk.red('Error refreshing latest messages:'), error);
    }
}






// Function to track and update DB with text channel activity
async function trackAndLogTextChannelActivity(channel) {
    const chalk = getChalk(); // Get the chalk instance

    try {
        // Fetch the last 100 messages from the channel
        const messages = await channel.messages.fetch({ limit: 100 });

        // Check if messages is a Collection and not empty
        if (!messages || messages.size === 0) {
            console.log(`No messages found in channel: ${channel.name}`);
            return; // Exit the function if no messages
        }

        const userActivities = new Map();

        for (const message of messages.values()) { // Use .values() to iterate over the Collection
            const user = message.author;

            if (!userActivities.has(user.id)) {
                userActivities.set(user.id, {
                    userName: user.username,
                    lastMessage: message.content,
                    lastActive: message.createdAt,
                    lastVoiceActivity: null // Initialize lastVoiceActivity as null
                });
            } else if (message.createdAt > userActivities.get(user.id).lastActive) {
                userActivities.get(user.id).lastMessage = message.content;
                userActivities.get(user.id).lastActive = message.createdAt;
            }
        }

        for (const [userId, activity] of userActivities.entries()) {
            await UserActivity.findOneAndUpdate(
                { userId: userId, channelName: channel.name },
                {
                    userName: activity.userName,
                    lastMessage: activity.lastMessage,
                    lastActive: activity.lastActive,
                    lastVoiceActivity: activity.lastVoiceActivity // Store lastVoiceActivity if exists
                },
                { upsert: true }
            );

            // Store updated activity in userActivitiesMap
            const existingActivity = userActivitiesMap.get(userId);
            if (!existingActivity || activity.lastActive > existingActivity.lastActive) {
                userActivitiesMap.set(userId, activity);
            }
        }

        console.log(chalk.green(`Successfully tracked messages in channel: ${channel.name}`));
    } catch (error) {
        console.error(`Error tracking messages in channel: ${channel.name}`, error);
    }
}


// Function to track voice channel activity in real time
function trackVoiceChannelActivity(client) {
    const chalk = getChalk(); // Get the chalk instance

    console.log(chalk.bgYellow.black('Starting voice activity detection...'));

    client.on('voiceStateUpdate', async (oldState, newState) => {
        try {
            const userId = newState.member.id || oldState.member.id;
            const userName = newState.member.user.username || oldState.member.user.username;
            const joinedChannel = newState.guild.channels.cache.get(newState.channelId);
            const leftChannel = oldState.guild.channels.cache.get(oldState.channelId);

            if (newState.channelId) {
                // User has joined a voice channel
                if (joinedChannel && joinedChannel.type === ChannelType.GuildVoice) {
                    console.log(`${userName} joined voice channel: ${joinedChannel.name}`);
                    await logVoiceActivity(userId, userName, joinedChannel.name, 'Joined voice channel');
                }
            }

            if (!newState.channelId && oldState.channelId) {
                // User has left the voice channel
                if (leftChannel && leftChannel.type === ChannelType.GuildVoice) {
                    console.log(`${userName} left voice channel: ${leftChannel.name}`);
                    await logVoiceActivity(userId, userName, leftChannel.name, 'Left voice channel');
                }
            }
        } catch (error) {
            console.error(chalk.red('Error tracking voice activity:'), error);
        }
    });
}

// Updates lastActive with lastVoiceActivity if there is activity
async function logVoiceActivity(userId, userName, channelName, action) {
    const chalk = getChalk(); // Get the chalk instance

    // console.log('Ready to detect voice activity...');
    try {
        const currentDate = new Date(); // Define currentDate here
        await UserActivity.findOneAndUpdate(
            { userId: userId, channelName: channelName },
            {
                userName: userName,
                lastVoiceActivity: currentDate, // Track last active date in voice channel
                lastActive: currentDate // Update lastActive with the most recent activity
            },
            { upsert: true, new: true }
        );

        // Update userActivitiesMap for in-memory tracking
        const currentActivity = userActivitiesMap.get(userId) || {
            userName: userName,
            lastActive: currentDate, // Update lastActive with the most recent activity
            lastVoiceActivity: currentDate
        };

        // Update lastActive based on the most recent activity
        if (currentDate > currentActivity.lastActive) {
            currentActivity.lastVoiceActivity = currentDate;
            currentActivity.lastActive = currentDate;
        }

        userActivitiesMap.set(userId, currentActivity);

        console.log(chalk.magentaBright(`Voice activity logged for user: ${userName} - ${action}`));
    } catch (error) {
        console.error(chalk.red('Error logging voice activity:'), error);
    }
}

// Function to retrieve the user activity from the Map
function getUserActivities() {
    const chalk = getChalk(); // Get the chalk instance

    console.log(chalk.bgYellow.black('Updated User Activities Map: '), userActivitiesMap); // Debug
    return userActivitiesMap;
}

module.exports = {
    storeChannels,
    getUserActivities,
    refreshLatestMessages
};
