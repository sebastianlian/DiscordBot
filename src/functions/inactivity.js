const mongoose = require('mongoose');
const { blackListDB } = require("../models/blacklistSchema");
const { inactiveDB } = require("../models/inactivitySchema");
const Channel = require("../models/channelSchema"); // Adjust the path as needed
const activeUsers = [];

// Function to check inactive users and interact with the database
async function checkInactiveUsers(client) {
  client.on("messageCreate", async (message) => {
    if (!mongoose.connection.collections["inactiveusers"]) {
      // If the collection doesn't exist, create it
      mongoose.connection.createCollection("inactiveusers");
    }
    if (!message.author.bot) {
      const blacklistedUser = await blackListDB.findOne({
        blackListedUsers: message.author.id,
      });

      if (!blacklistedUser) {
        // Check if user is in the list
        const activeUser = activeUsers.find(
            (user) => user.id === message.author.id
        );
        if (activeUser) {
          // If they are in the list update the message date
          activeUser.messageDate = Date.now();
          // Update the database with the new message date
          await inactiveDB.findOneAndUpdate(
              { userId: message.author.id },
              { lastMessageDate: new Date(activeUser.messageDate) },
              { upsert: true }
          );
        } else {
          // If they are not in the list add the user id and the message date
          activeUsers.push({ id: message.author.id, messageDate: Date.now() });
          // Add the user to the database
          await inactiveDB.create({
            userId: message.author.id,
            lastMessageDate: new Date(Date.now()),
          });
        }
      }
    }
  });

  // Log channels from the database
  try {
    const channels = await Channel.find();
    console.log('Channels from DB:', channels);
    channels.forEach(channel => {
      console.log(`Channel Name: ${channel.name}, ID: ${channel.id}`);
    });
  } catch (error) {
    console.error('Error fetching channels:', error.message);
  }
}

// Function to get inactive users based on the inactivity timer
function getInactiveUsers() {
  const currentTime = Date.now();
  // Define the inactivity timer (example: 1 minute)
  const inactivityTimer = 1 * 60 * 1000;

  // Filter users who have exceeded the inactivity timer
  return activeUsers.filter(
      (user) => currentTime - user.messageDate > inactivityTimer
  );
}

module.exports = {
  checkInactiveUsers,
  getInactiveUsers,
  activeUsers,
};
