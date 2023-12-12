const { blackListDB } = require("../models/blacklistSchema");
const { inactiveDB } = require("../models/inactivitySchema");
const activeUsers = [];


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

// filters users who have exceded the inactivity timer
  return activeUsers.filter(
    (user) => currentTime - user.messageDate > inactivityTimer
  );
}

module.exports = {
  checkInactiveUsers,
  getInactiveUsers,
  activeUsers,
};