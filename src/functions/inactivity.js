const { getUserActivities } = require('./channelManager');
const { blackListDB } = require("../models/blacklistSchema");
const { inactiveDB } = require("../models/inactivitySchema");
const { getChalk } = require('../utility/utils'); // Adjust the path accordingly

const INACTIVITY_TIMER = 10 * 1000; // 10 seconds, adjust as needed
const activeUsers = [];

// Function to add/update inactivity data in the database
async function addOrUpdateInactivityDB(userId, userName, lastActive) {
  const chalk = getChalk(); // Get the chalk instance
  try {
    const messageDate = new Date(lastActive);

    if (!userName) {
      throw new Error('userName is required');
    }

    await inactiveDB.findOneAndUpdate(
        { userId },
        { userName, lastMessageDate: messageDate },
        { upsert: true }
    );
    console.log(`User ${userName} (${userId}) updated in inactivity database.`);
  } catch (error) {
    console.error('Error updating inactivity data:', error);
  }
}

// Function to remove a user from the inactivity database
async function removeFromInactivityDB(userId) {
  const chalk = getChalk(); // Get the chalk instance
  try {
    const result = await inactiveDB.deleteOne({ userId });

    if (result.deletedCount === 0) {
      console.log(chalk.red(`User ${userId} not found in inactivity database or could not be deleted.`));
    } else {
      console.log(chalk.green(`User ${userId} successfully removed from inactivity database.`));
    }
  } catch (error) {
    console.error(chalk.red('Error removing user from inactivity database:', error));
  }
}

// Function to check for inactive users
async function checkAndUpdateInactiveUsers() {
  const userActivitiesMap = getUserActivities();
  const currentTime = Date.now();
  const chalk = getChalk();

  console.log(chalk.bgYellow.black('Starting inactivity database update...'));

  for (const [userId, activity] of userActivitiesMap.entries()) {
    if (currentTime - activity.lastActive > INACTIVITY_TIMER) {
      // User is considered inactive, update database
      await addOrUpdateInactivityDB(userId, activity.userName, activity.lastActive);
    }
  }

  // Also check the activeUsers array
  for (const user of activeUsers) {
    if (currentTime - user.messageDate > INACTIVITY_TIMER) {
      console.log(`User ${user.id} is inactive.`);
      await addOrUpdateInactivityDB(user.id, user.userName, user.messageDate);
    }
  }
}

// Function to check and return inactive users (for logging or usage elsewhere)
function getInactiveUsers() {
  const currentTime = Date.now();
  const inactiveUsersMap = new Map();

  activeUsers.forEach(user => {
    if (currentTime - user.messageDate > INACTIVITY_TIMER) {
      inactiveUsersMap.set(user.id, {
        lastMessageDate: new Date(user.messageDate)
      });
    }
  });

  console.log("Inactive User Map: ", inactiveUsersMap);
  return inactiveUsersMap;
}

// Event listener for message creation (tracks user activity)
async function trackUserActivity(client) {
  client.on("messageCreate", async (message) => {
    if (!message.author.bot) {
      const blacklistedUser = await blackListDB.findOne({
        blackListedUsers: message.author.id,
      });

      if (!blacklistedUser) {
        let activeUser = activeUsers.find(user => user.id === message.author.id);

        // Check if the user exists in the inactivity database
        const userInInactiveDB = await inactiveDB.findOne({ userId: message.author.id });

        if (userInInactiveDB) {
          // If user is in inactivity DB, remove them
          console.log(`User ${message.author.id} found in inactivityDB. Removing them...`);
          await removeFromInactivityDB(message.author.id);
        }

        if (activeUser) {
          // Update existing user's activity
          activeUser.messageDate = Date.now();
          await addOrUpdateInactivityDB(message.author.id, message.author.username, activeUser.messageDate);
        } else {
          // Add new user to activeUsers
          activeUsers.push({
            id: message.author.id,
            messageDate: Date.now(),
            userName: message.author.username
          });
          await addOrUpdateInactivityDB(message.author.id, message.author.username, Date.now());
        }
      }
    }
  });
}

module.exports = {
  checkAndUpdateInactiveUsers,
  getInactiveUsers,
  trackUserActivity,
};
