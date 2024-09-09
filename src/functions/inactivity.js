const { blackListDB } = require('../models/blacklistSchema');
const { Inactivity } = require('../models/inactivitySchema');
const { getUserActivities } = require('./channelManager');
const { addInactivityDB } = require("./addInactiveUser");

const activeUsers = [];

// Function to handle user messages and update activity
async function checkInactiveUsers(client) {
  client.on('messageCreate', async (message) => {
    if (!message.author.bot) {
      try {
        const blacklistedUser = await blackListDB.findOne({
          blackListedUsers: message.author.id,
        });

        if (!blacklistedUser) {
          const activeUser = activeUsers.find(user => user.id === message.author.id);
          const currentTime = Date.now();

          if (activeUser) {
            activeUser.messageDate = currentTime;
          } else {
            activeUsers.push({ id: message.author.id, messageDate: currentTime });
          }

          await Inactivity.findOneAndUpdate(
              { userId: message.author.id },
              { lastMessageDate: new Date(currentTime) },
              { upsert: true, new: true}
          );

          console.log('Active users after processing message:', activeUsers);
        }
      } catch (error) {
        console.error('Error processing message:', error);
      }
    }
  });
}

// Function to get inactive users based on a timer
function getInactiveUsers() {
  const currentTime = Date.now();
  // const inactivityTimer = 1 * 60 * 1000; // 1 minute
  const inactivityTimer = 1 * 60 * 60 * 1000; // 1 hour

  // Update activeUsers with cached activities
  const cachedActivities = getUserActivities();
  for (const [userId, activity] of Object.entries(cachedActivities)) {
    const activeUser = activeUsers.find(user => user.id === userId);
    if (activeUser) {
      activeUser.messageDate = new Date(activity.lastActive).getTime(); // Ensure lastActive is a Date
    } else {
      activeUsers.push({ id: userId, messageDate: new Date(activity.lastActive).getTime() });
    }
  }

  // Log updated activeUsers
  console.log('Active users after updating with cache:', activeUsers);

  // Log the current time and message dates for debugging
  console.log('Current Time:', new Date(currentTime));
  activeUsers.forEach(user => {
    console.log(`User ${user.id} last activity: ${new Date(user.messageDate)}`);
  });

  // Filter users who have exceeded the inactivity timer
  const inactiveUsers = activeUsers.filter(
      user => currentTime - user.messageDate > inactivityTimer
  );

  // Log inactive users
  console.log('Inactive users:', inactiveUsers);

  // Add/update inactive users in the database
  for (const user of inactiveUsers) {
    // Fetch the user activity from the cache to get the username
    const userActivity = cachedActivities[user.id];
    if (userActivity) {
      console.log('Adding user to inactivity DB:', {
        userId: user.id,
        userName: userActivity.username,
        lastMessageDate: new Date(user.messageDate)
      });
      addInactivityDB(user.id, userActivity.username, new Date(user.messageDate));
    } else {
      console.warn(`User activity not found in cache for user ${user.id}`);
    }
  }

  return inactiveUsers;
}


module.exports = {
  checkInactiveUsers,
  getInactiveUsers,
  activeUsers,
};
