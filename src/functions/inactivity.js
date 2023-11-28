// const { User } = require("discord.js");
// const inactivitySchema = require("../models/inactivitySchema");

// // The bot is given the instruction to not listen to itself at all, and
// // to say "hello" to any user in the server that says or enters anything.

// const activeMembers = [];

// // async function listInactivity() {
//         client.on('messageCreate', (message) => {
//             const activeMember = message.author;
//             if (!message.author.bot && !activeMembers.includes(activeMember)) {
//                 // if(((message.content.match("[\s\S]*")) || (message.attachments.size()>0)) && !(activeMembers.includes(activeMember))) {
//                     activeMembers.push(activeMember);
//                     // const stringActiveMembers = activeMembers.join('\n');
//                     // message.reply ({
//                     //     content: stringActiveMembers,
//                     //     ephemeral: true
//                     // })
//             // }
//             // return;
//             }
//         })
// // }

//     module.exports = {
//         // listInactivity,
//         activeMembers,
//     }

const activeUsers = [];

function checkInactiveUsers(client) {
  client.on("messageCreate", (message) => {
    if (!message.author.bot) {
        // Check if user is in the list
      const activeUser = activeUsers.find((user) => user.id === message.author.id);
      if (activeUser) {
        // if they are in the list update the message date
        activeUser.messageDate = Date.now();
      } else {
        //if they are not in the list add the users id and the message date
        activeUsers.push({ id: message.author.id, messageDate: Date.now() });
      }
    }
  });
}

function getInactiveUsers() {
  const currentTime = Date.now();
  // 10 second timer
  //const inactivityTimer = 10 * 1000;
  
  // 1 minute timer
  const inactivityTimer = 1 * 60 * 1000;

  // 1 hour timer
  //const inactivityTimer = 1 * 60 * 60 * 1000;

  // 1 day timer
  //const inactivityTimer = 24 * 60 * 60 * 1000;
  
  // 1 week timer
  //const inactivityTimer = 7 * 24 * 60 * 60 * 1000;

  // 1 month timer
  //const inactivityTimer = 4 * 7 * 24 * 60 * 60 * 1000;

  // filters users who have exceded the inactivity timer
  return activeUsers.filter((user) => currentTime - user.messageDate > inactivityTimer);
}

module.exports = {
     checkInactiveUsers, 
     getInactiveUsers, 
     activeUsers
};
