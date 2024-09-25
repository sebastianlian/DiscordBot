const { getUserActivities } = require('./channelManager');
const { blackListDB } = require("../models/blacklistSchema");
const { inactiveDB } = require("../models/inactivitySchema");
const { getChalk } = require('../utility/utils'); // Adjust the path accordingly

const INACTIVITY_TIMER = 24 * 60 * 60 * 1000; // 168 hours
const activeUsers = new Map(); // Use Map for user tracking

/*
processedActiveUsers
This set tracks users that have already been processed in the current inactivity check.
Once a user has been processed, they won't be checked again in that cycle.
This helps prevent double processing of users during a single check.
 */
const processedActiveUsers = new Set();
/*
recentlyActiveUsers
This set is meant to temporarily hold users who have just been removed from the inactiveDB,
ensuring they are not re-added to the database immediately if they become active again within the inactivity timer.
This allows for a "grace period" where users can’t be added back for a specified duration after being removed.
 */
const recentlyActiveUsers = new Set();

// Database Operations
async function addOrUpdateInactivityDB(userId, userName, lastActive) {
  const chalk = getChalk(); // Get the chalk instance
  try {
    const messageDate = new Date(lastActive);

    if (!userName) {
      throw new Error('userName is required');
    }

    // Check if the user was recently active
    if (recentlyActiveUsers.has(userId)) {
      console.log(chalk.yellow(`User ${userName} (${userId}) was recently active. Skipping inactivity DB update.`));
      return false;
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
      // Mark user as recently active
      recentlyActiveUsers.add(userId);
      setTimeout(() => {
        recentlyActiveUsers.delete(userId);
      }, INACTIVITY_TIMER); // Remove from set after INACTIVITY_TIMER

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
  const userActivitiesMap = await getUserActivities();
  const currentTime = Date.now();
  const chalk = getChalk();

  console.log(chalk.bgYellow.black('Starting inactivity database update...'));

  const activeUserIds = new Set();

  // Check user activities and update inactivity records
  for (const [userId, activity] of userActivitiesMap.entries()) {
    try {
      if (currentTime - activity.lastActive > INACTIVITY_TIMER) {
        const success = await addOrUpdateInactivityDB(userId, activity.userName, activity.lastActive);
        if (success) {
          console.log(chalk.green(`Successfully updated inactivity record for user ${activity.userName} (${userId}).`));
        }
      } else {
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

    for (const userId of activeUserIds) {
      if (processedActiveUsers.has(userId)) {
        console.log(chalk.blue(`User ${userId} already processed, skipping...`));
        continue;
      }

      try {
        const userExists = await inactiveDB.findOne({ userId: userId.toString() });
        if (userExists) {
          await removeFromInactivityDB(userId);
          console.log(chalk.cyan(`Removed user ${userId} from inactivity database.`));
        } else {
          console.log(chalk.red(`User ${userId} is not present in inactivity database.`));
        }
      } catch (error) {
        console.log(chalk.red(`Error checking/removing user ${userId} from inactivity db:`, error));
      }

      processedActiveUsers.add(userId); // Mark user as processed after attempted removal
    }

    const inactiveUsers = await getInactiveUsers();
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
