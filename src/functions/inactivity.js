const { getUserActivities } = require('./channelManager');
const { blackListDB } = require("../models/blacklistSchema");
const { inactiveDB } = require("../models/inactivitySchema");
const UserActivity = require('../models/userActivitySchema');
const { getChalk } = require('../utility/utils'); // Adjust the path accordingly

// const INACTIVITY_TIMER = 24 * 60 * 60 * 1000; // 168 hours
const INACTIVITY_TIMER = 12 * 60 * 60 * 1000; // 12 hours
// const INACTIVITY_TIMER = 3 * 60 * 1000; // 3 minutes

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

let userActivitiesMap = new Map(); // Initialize to track loaded activities

// Load existing user activity from the database on startup
async function loadUserActivityOnStartup() {
  try {
    console.log('Loading existing user activity from the database...');
    const existingActivities = await UserActivity.find({});

    existingActivities.forEach(activity => {
      userActivitiesMap.set(activity.userId, {
        userName: activity.userName,
        lastMessage: activity.lastMessage || '',
        lastMessageDate: activity.lastMessageDate || new Date(0),
        lastActive: activity.lastActive || new Date(0),
        lastVoiceActivity: activity.lastVoiceActivity || null,
        lastReaction: activity.lastReaction || null
      });
    });

    console.log('User activities loaded into memory from the database.');
  } catch (error) {
    console.error('Error loading user activity on startup:', error);
  }
}

// Refresh inactive users based on the loaded data from the database
async function refreshInactiveUsers() {
  const currentTime = Date.now();

  userActivitiesMap.forEach((activity, userId) => {
    if (currentTime - activity.lastActive > INACTIVITY_TIMER) {
      activeUsers.set(userId, {
        userName: activity.userName,
        lastMessageDate: activity.lastMessageDate,
        lastActive: activity.lastActive
      });
      console.log(`User ${activity.userName} marked as inactive.`);
    } else {
      console.log(`User ${activity.userName} is active.`);
    }
  });
}

// Database Operations
async function addOrUpdateInactivityDB(userId, userName, lastActive, lastMessage) {
  const chalk = getChalk();
  console.log(chalk.cyan(`Attempting to update inactivity database for user: ${userName} (${userId})`));

  // Convert userId to a string explicitly
  userId = userId.toString();

  try {
    const messageDate = new Date(lastActive);

    if (!userName) {
      throw new Error('userName is required');
    }

    // Log recent activity check
    console.log(`Checking recently active status for user ${userName} (${userId})`);

    if (recentlyActiveUsers.has(userId)) {
      console.log(chalk.yellow(`User ${userName} (${userId}) was recently active. Skipping inactivity DB update.`));
      return false;
    }

    let result = await inactiveDB.findOneAndUpdate(
        { userId },
        {
          userName,
          lastMessageDate: messageDate,
          lastMessage: lastMessage || '', // Ensure lastMessage defaults to an empty string if undefined
          lastActive: messageDate,
          lastVoiceActivity: null // Set default for lastVoiceActivity as null if not set
        },
        { upsert: true, new: true }
    );

    if (result) {
      console.log(chalk.green(`Successfully added or updated user ${userName} (${userId})`));
    } else {
      console.log(chalk.red(`Failed to add or update user ${userName} (${userId})`));
    }

    return true;
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
      console.log(chalk.red(`User ${userId} not found in inactivity database, could not be deleted or has previously been deleted.`));
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
    console.log(`Message received from ${message.author.username}: ${message.content}`);
    if (!message.author.bot) {
      try {
        const blacklistedUser = await blackListDB.findOne({
          blackListedUsers: {
            $elemMatch: {
              userId: message.author.id.toString()  // Ensure we treat userId as a string
            }
          }
        });

        if (!blacklistedUser) {
          const currentTime = Date.now();
          const userId = message.author.id.toString(); // Ensure userId is a string
          // Log the message content and time
          console.log(`Updating last message for ${message.author.username}: ${message.content}`);

          // Update or insert the user activity record
          await addOrUpdateInactivityDB(message.author.id, message.author.username, currentTime, message.content);
          // new code end here

          if (activeUsers.has(userId)) {
            activeUsers.get(userId).messageDate = currentTime;
            console.log(`Updated existing user ${message.author.username} activity.`);
          } else {
            activeUsers.set(userId, {
              id: userId,
              messageDate: currentTime,
              userName: message.author.username
            });
            console.log(`Added new user ${message.author.username} to activeUsers.`);
          }

          await removeFromInactivityDB(userId);
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
  const processedActiveUsers = new Set(); // Ensure this is defined somewhere in your scope

  // Check user activities and update inactivity records
  for (const [userId, activity] of userActivitiesMap.entries()) {
    try {
      // Check if user is inactive based on INACTIVITY_TIMER
      if (currentTime - activity.lastActive > INACTIVITY_TIMER) {
        // Check if the user already exists in inactiveDB
        const userExists = await inactiveDB.findOne({ userId: userId.toString() });

        if (!userExists) {
          // Add the user to inactiveDB as they are inactive
          const success = await addOrUpdateInactivityDB(userId, activity.userName, activity.lastActive, activity.lastMessage);
          if (success) {
            console.log(chalk.green(`User ${activity.userName} (${userId}) added to inactivity database.`));
          }
        } else {
          console.log(chalk.cyan(`User ${activity.userName} (${userId}) already exists in inactivity database.`));
        }
      } else {
        // User is active, so add/update them in activeUsers map
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
  addOrUpdateInactivityDB,
  checkAndUpdateInactiveUsers,
  getInactiveUsers,
  trackUserActivity,
  removeFromInactivityDB,
  loadUserActivityOnStartup,
  refreshInactiveUsers,
};