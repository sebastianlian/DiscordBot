const { blackListDB } = require('../models/blacklistSchema');
const { Inactivity } = require('../models/inactivitySchema');
const { getUserActivities } = require('./channelManager');
const { addInactivityDB } = require("./addInactiveUser");

// Array to track active users and their last message timestamps
const activeUsers = [];

// Function to handle user messages and update user activity
async function checkInactiveUsers(client) {
  // Listen for message creation events
  client.on('messageCreate', async (message) => {
    // Ignore messages sent by bots
    if (!message.author.bot) {
      try {
        // Check if the user is blacklisted
        const blacklistedUser = await blackListDB.findOne({
          blackListedUsers: message.author.id,
        });

        // If the user is not blacklisted, proceed
        if (!blacklistedUser) {
          // Check if the user is already in the activeUsers array
          const activeUser = activeUsers.find(user => user.id === message.author.id);
          const currentTime = Date.now();

          if (activeUser) {
            // Update the user's last message timestamp
            activeUser.messageDate = currentTime;
          } else {
            // Add the user to the activeUsers array if not already present
            activeUsers.push({ id: message.author.id, messageDate: currentTime });
          }

          // Update the user's last activity in the Inactivity database (found in model folder - inactivitySchema)
          await Inactivity.findOneAndUpdate(
              { userId: message.author.id },
              { lastMessageDate: new Date(currentTime) },
              { upsert: true, new: true} // Insert if doesn't exist, otherwise update
          );
          // debug to log the current list of active users
          console.log('Active users after processing message:', activeUsers);
        }
      } catch (error) {
        // Log any errors that occur during the process
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

  // Update activeUsers array with cached user activities
  const cachedActivities = getUserActivities(); // Get user activities from cache
  for (const [userId, activity] of Object.entries(cachedActivities)) {
    const activeUser = activeUsers.find(user => user.id === userId); // Check if the user is in the activeUsers array
    if (activeUser) {
      // If the user is already active, update their last message date
      activeUser.messageDate = new Date(activity.lastActive).getTime(); // Ensure lastActive is a Date
    } else {
      // If the user is not in activeUsers, add them with their last activity date
      activeUsers.push({ id: userId, messageDate: new Date(activity.lastActive).getTime() });
    }
  }

  // debug to log updated activeUsers
  console.log('Active users after updating with cache:', activeUsers);

  // Log the current time and message dates for debugging
  console.log('Current Time:', new Date(currentTime));
  activeUsers.forEach(user => {
    console.log(`User ${user.id} last activity: ${new Date(user.messageDate)}`);
  });

  // Filter out users who have been inactive for longer than the inactivity timer
  const inactiveUsers = activeUsers.filter(
      user => currentTime - user.messageDate > inactivityTimer
  );

  // debugging for log inactive users
  console.log('Inactive users:', inactiveUsers);

  // Add inactive users to the Inactivity database
  for (const user of inactiveUsers) {
    // Fetch the user activity from the cache to get the username
    const userActivity = cachedActivities[user.id];
    if (userActivity) {
      // Log the user data before adding to the database
      console.log('Adding user to inactivity DB:', {
        userId: user.id,
        userName: userActivity.username,
        lastMessageDate: new Date(user.messageDate)
      });
      // Add or update the user's inactivity record in the database
      addInactivityDB(user.id, userActivity.username, new Date(user.messageDate));
    } else {
      // Log a warning if the user's activity is not found in the cache
      console.warn(`User activity not found in cache for user ${user.id}`);
    }
  }

  return inactiveUsers; // Return the list of inactive users
}

module.exports = {
  checkInactiveUsers,
  getInactiveUsers,
  activeUsers,
};
