const { getUserActivities } = require('./channelManager');
const { blackListDB } = require("../models/blacklistSchema");
const { inactiveDB } = require("../models/inactivitySchema");
const { getChalk } = require('../utility/utils'); // Adjust the path accordingly

const INACTIVITY_TIMER = 24 * 60 * 60 * 1000; // 24 hours
const activeUsers = new Map(); // Use Map for user tracking
const processedActiveUsers = new Set();

// Database Operations
async function addOrUpdateInactivityDB(userId, userName, lastActive) {
  const chalk = getChalk(); // Get the chalk instance
  try {
    const messageDate = new Date(lastActive);

    if (!userName) {
      throw new Error('userName is required');
    }

    const result = await inactiveDB.findOneAndUpdate(
        { userId: userId.toString() },
        { userName, lastMessageDate: messageDate },
        { upsert: true, new: true }
    );

    if (result) {
      return true;
    } else {
      console.log(`Failed to update user ${userName} (${userId}) in inactivity database.`);
      return false;
    }
  } catch (error) {
    console.error('Error updating inactivity data:', error);
    return false;
  }
}

async function removeFromInactivityDB(userId) {
  const chalk = getChalk(); // Get the chalk instance
  try {
    console.log(chalk.bgYellow.black(`Attempting to remove user with ID: ${userId} from inactivity database...`));

    const result = await inactiveDB.deleteOne({ userId: userId.toString() });

    if (result.deletedCount === 0) {
      console.log(chalk.red(`User ${userId} not found in inactivity database or could not be deleted.`));
      return { success: false };
    } else {
      console.log(chalk.green(`User ${userId} successfully removed from inactivity database.`));
      return { success: true };
    }
  } catch (error) {
    console.error(chalk.red('Error removing user from inactivity database:', error));
    return { success: false };
  }
}

// User Tracking
async function trackUserActivity(client) {
  client.on("messageCreate", async (message) => {
    if (!message.author.bot) {
      try {
        const blacklistedUser = await blackListDB.findOne({
          blackListedUsers: message.author.id,
        });

        if (!blacklistedUser) {
          const currentTime = Date.now();

          if (activeUsers.has(message.author.id)) {
            activeUsers.get(message.author.id).messageDate = currentTime;
            console.log(`Updated existing user ${message.author.username} activity.`);
          } else {
            activeUsers.set(message.author.id, {
              id: message.author.id,
              messageDate: currentTime,
              userName: message.author.username
            });
            console.log(`Added new user ${message.author.username} to activeUsers.`);
          }

          await removeFromInactivityDB(message.author.id);
        }
      } catch (error) {
        console.error('Error tracking user activity:', error);
      }
    }
  });
}

async function getInactiveUsers() {
  const currentTime = Date.now();
  const inactiveUsersMap = new Map();

  try {
    // Retrieve all users from the inactivity database
    const inactiveUsers = await inactiveDB.find({}).exec();

    inactiveUsers.forEach(user => {
      const lastActiveDate = new Date(user.lastMessageDate).getTime();
      if (currentTime - lastActiveDate > INACTIVITY_TIMER) {
        inactiveUsersMap.set(user.userId, {
          lastMessageDate: lastActiveDate,
          userName: user.userName,
        });
        console.log(`User ${user.userName} is inactive.`);
      } else {
        console.log(`User ${user.userName} is not considered inactive.`);
      }
    });

    console.log("Inactive User Map:", inactiveUsersMap);
    return inactiveUsersMap; // Ensure it returns the map
  } catch (error) {
    console.error('Error retrieving inactive users:', error);
    return new Map();
  }
}

// Main Operations
async function checkAndUpdateInactiveUsers() {
  const userActivitiesMap = await getUserActivities(); // Await this
  const currentTime = Date.now();
  const chalk = getChalk();

  console.log(chalk.bgYellow.black('Starting inactivity database update...'));

  const activeUserIds = new Set();

  // Check user activities and update inactivity records
  for (const [userId, activity] of userActivitiesMap.entries()) {
    try {
      // Skip users that have already been processed
      if (processedActiveUsers.has(userId)) {
        console.log(chalk.blue(`User ${userId} already processed recently, skipping...`));
        continue; // Skip this user if they were recently processed
      }

      if (currentTime - activity.lastActive > INACTIVITY_TIMER) {
        const success = await addOrUpdateInactivityDB(userId, activity.userName, activity.lastActive);
        if (success) {
          console.log(chalk.green(`Successfully updated inactivity record for user ${activity.userName} (${userId}).`));
        } else {
          console.log(chalk.red(`Failed to update inactivity record for user ${activity.userName} (${userId}).`));
        }
      } else {
        // Add active users to the map
        activeUsers.set(userId, {
          id: userId,
          userName: activity.userName,
          messageDate: activity.lastActive,
        });
        activeUserIds.add(userId);
      }
    } catch (error) {
      console.error(chalk.red(`Error processing user ${activity.userName} (${userId}):`, error));
    }
  }

  // Process active users for removal from inactivity database
  try {
    console.log(chalk.bgYellow.black('Successfully updated inactive users collection in DB.'));
    const removalPromises = [];

    for (const userId of activeUserIds) {
      // Skip users that have already been processed
      if (processedActiveUsers.has(userId)) {
        console.log(chalk.blue(`User ${userId} already processed, skipping...`));
        continue;
      }

      try {
        // Check if the user is in the inactivity database before trying to remove them
        console.log(chalk.cyan(`Checking if user ${userId} is in inactivity database...`));
        const userExists = await inactiveDB.findOne({ userId: userId.toString() });
        if (userExists) {
          removalPromises.push(removeFromInactivityDB(userId));
          console.log(chalk.cyan(`Preparing to remove user ${userId} from inactivity database.`));
        } else {
          console.log(chalk.red(`User ${userId} is not present in inactivity database.`));
        }
      } catch (error) {
        console.log(chalk.red(`Error checking/removing user ${userId} from inactivity db:`, error));
      }

      // Mark the user as processed
      processedActiveUsers.add(userId);
    }

    const removalResults = await Promise.all(removalPromises);
    const successCount = removalResults.filter(result => result.success).length;

    // Log successful removal count
    if (successCount > 0) {
      console.log(chalk.green(`Successfully removed ${successCount} active users from inactivity database.`));
    }

    const failureCount = removalResults.length - successCount;
    if (failureCount > 0) {
      console.log(chalk.red(`Failed to remove ${failureCount} active users from inactivity database.`));
    }

    const inactiveUsers = await getInactiveUsers(); // Await the result
    console.log("Updated Inactive Users Map:", inactiveUsers);

  } catch (error) {
    console.error(chalk.red('Error removing active users from inactivity database:', error));
  }
}

module.exports = {
  checkAndUpdateInactiveUsers,
  getInactiveUsers,
  trackUserActivity,
};
