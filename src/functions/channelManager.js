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
                    await trackUserReactions(client);
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
            } else {
                const existingActivity = userActivities.get(user.id);
                // Update if the message is more recent
                if (message.createdAt > existingActivity.lastActive) {
                    existingActivity.lastMessage = message.content;
                    existingActivity.lastActive = message.createdAt;
                }
            }
        }

        for (const [userId, activity] of userActivities.entries()) {
            userActivitiesMap.set(userId, activity);
            const userActivity = await UserActivity.findOne({ userId: userId, channelName: channel.name });

            // Check if the new lastActive is more recent before updating
            const newLastActive = activity.lastActive;
            const currentLastActive = userActivity ? userActivity.lastActive : null;

            if (!currentLastActive || newLastActive > currentLastActive) {
                await UserActivity.findOneAndUpdate(
                    { userId: userId, channelName: channel.name },
                    {
                        userName: activity.userName,
                        lastMessage: activity.lastMessage,
                        lastActive: newLastActive, // Update only if the new timestamp is more recent
                        lastVoiceActivity: activity.lastVoiceActivity // Preserve voice activity
                    },
                    { upsert: true }
                );
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

// Function to track message reactions
function trackUserReactions(client) {
    client.on('messageReactionAdd', async (reaction, user) => {
        if (user.bot) return; // Ignore bot reactions
        const { message } = reaction;
        const channelName = message.channel.name;

        // Log the reaction activity
        console.log(`${user.username} reacted with ${reaction.emoji.name} to message: "${message.content}" in channel: ${channelName}`);

        // Update user activity in the database
        await logReactionActivity(user.id, user.username, channelName, message.content, reaction.emoji.name);
    });
}

// Function to log reaction activity in the database
async function logReactionActivity(userId, userName, channelName, messageContent, emojiName) {
    const chalk = getChalk();
    const currentDate = new Date();

    try {
        // Fetch existing user activity from the database
        const userActivity = await UserActivity.findOne({ userId: userId, channelName: channelName });

        // Prepare lastReaction object for the current activity
        const lastReaction = {
            messageContent: messageContent,
            emoji: emojiName,
            userName: userName, // Store the username with the last reaction
            timestamp: currentDate
        };

        // Default lastActive to the current time
        let lastActive = currentDate;

        // If user activity exists, compare timestamps
        if (userActivity) {
            const lastReactionTimestamp = userActivity.lastReaction?.timestamp || new Date(0); // Fallback to epoch
            const lastActiveTimestamp = userActivity.lastActive || new Date(0);

            // If this reaction is newer than the last logged reaction
            if (currentDate > lastReactionTimestamp && currentDate > lastActiveTimestamp) {
                lastActive = currentDate; // Update lastActive for the current activity
            } else {
                lastActive = lastActiveTimestamp; // Retain the old lastActive timestamp
            }
        }

        // Update the user activity in the database with the new reaction and activity
        const result = await UserActivity.findOneAndUpdate(
            { userId: userId, channelName: channelName },
            {
                userName: userName,
                lastActive: lastActive, // Update the lastActive field
                lastReaction: lastReaction, // Update the lastReaction field
            },
            { upsert: true, new: true } // Insert if doesn't exist, return the updated document
        );

        // Update the in-memory map with the new user activity
        const currentActivity = userActivitiesMap.get(userId) || {
            userName: userName,
            lastReaction: lastReaction.timestamp,
            lastActive: lastActive
        };

        // Update in-memory lastActive if the current activity is more recent
        if (currentDate > currentActivity.lastActive) {
            currentActivity.lastReaction = lastReaction.timestamp;
            currentActivity.lastActive = lastActive; // Update lastActive based on the most recent activity
        }

        userActivitiesMap.set(userId, currentActivity);

        // Log the updated activity information
        console.log(chalk.cyan(`User activity updated for ${userName} in channel ${channelName}:`,
            JSON.stringify({ lastActive, lastReaction }, null, 2) // Display a readable JSON object
        ));

        console.log(chalk.magentaBright(`Reaction logged for user: ${userName} - Reacted with ${emojiName}`));

    } catch (error) {
        console.error(chalk.red('Error logging reaction activity:'), error);
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
    refreshLatestMessages,
};
