const { getUserActivities } = require('./channelManager'); // Adjust the path accordingly
const { blackListDB } = require("../models/blacklistSchema");
const { inactiveDB } = require("../models/inactivitySchema");
const activeUsers = [];

// Function to add inactivity data to the database
async function addInactivityDB(userId, userName, lastActive) {
  try {
    const messageDate = new Date(lastActive);

    // Ensure userName is provided and valid
    if (!userName) {
      throw new Error('userName is required');
    }

    // Create a new document in the database
    await inactiveDB.create({
      userId,
      userName,
      lastMessageDate: messageDate
    });
    console.log(`User ${userName} (${userId}) added to inactivity database.`);

    // Optional: Use getInactiveUsers if needed
    const inactiveUsersMap = getInactiveUsers();
    console.log('Current inactive users:', inactiveUsersMap);
    console.log('Inactive User Map: ', inactiveUsersMap);
  } catch (error) {
    console.error('Error adding inactivity data:', error);
  }
}

async function checkInactiveUsers(client) {
  client.on("messageCreate", async (message) => {
    if (!mongoose.connection.collections["inactiveusers"]) {
      // If the database doesn't exist, create it
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
          // if they are in the list update the message date
          activeUser.messageDate = Date.now();
          // update the database with the new message date
          await inactiveDB.findOneAndUpdate(
              { userId: message.author.id },
              { lastMessageDate: new Date(activeUser.messageDate) },
              { upsert: true }
          );
        } else {
          // if they are not in the list add the users id and the message date
          activeUsers.push({ id: message.author.id, messageDate: Date.now() });
          // add the user to the database
          await inactiveDB.create({
            userId: message.author.id,
            lastMessageDate: new Date(Date.now()),
          });
        }
      }
    }
  });
}

// Function to check inactive users using userActivitiesMap
async function checkAndUpdateInactiveUsers() {
  const userActivitiesMap = getUserActivities();
  const currentTime = Date.now();

  // console.log('in checkAndUpdateInactiveUsers loop', getUserActivities()); // Debugging to see current activities

  // Define your inactivity threshold here
  const inactivityTimer = 10 * 1000; // 10 seconds, adjust as needed

  for (const [userId, activity] of userActivitiesMap.entries()) {
    if (currentTime - activity.lastActive > inactivityTimer) {
      // User is considered inactive
      await addInactivityDB(userId, activity.userName, activity.lastActive);
    }
  }
}

function getInactiveUsers() {
  const currentTime = Date.now();
// 10 second timer
  const inactivityTimer = 10 * 1000;
// 1 minute timer
//const inactivityTimer = 1 * 60 * 1000;

// 1 hour timer
//const inactivityTimer = 1 * 60 * 60 * 1000;

// 1 day timer
//const inactivityTimer = 24 * 60 * 60 * 1000;

// 1 week timer
//const inactivityTimer = 7 * 24 * 60 * 60 * 1000;

// 1 month timer
//const inactivityTimer = 4 * 7 * 24 * 60 * 60 * 1000;

// Create a new Map to store inactive users
  const inactiveUsersMap = new Map();

  // Filter activeUsers based on the inactivity timer
  activeUsers.forEach(user => {
    if (currentTime - user.messageDate > inactivityTimer) {
      // If user is inactive, add to the Map
      inactiveUsersMap.set(user.name, {
        lastMessageDate: user.messageDate
      });
    }
  });

  return inactiveUsersMap;
}

module.exports = {
  checkInactiveUsers,
  getInactiveUsers,
  checkAndUpdateInactiveUsers,
  addInactivityDB, // Export addInactivityDB if needed elsewhere
  activeUsers,
};