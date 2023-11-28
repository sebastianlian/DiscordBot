const { User } = require("discord.js");
const inactivitySchema = require("../models/inactivitySchema");

// The bot is given the instruction to not listen to itself at all, and
// to say "hello" to any user in the server that says or enters anything.


const activeMembers = [];


// async function listInactivity() {
        client.on('messageCreate', (message) => {
            const activeMember = message.author;
            if (!message.author.bot && !activeMembers.includes(activeMember)) {
                // if(((message.content.match("[\s\S]*")) || (message.attachments.size()>0)) && !(activeMembers.includes(activeMember))) {
                    activeMembers.push(activeMember);
                    // const stringActiveMembers = activeMembers.join('\n');
                    // message.reply ({
                    //     content: stringActiveMembers,
                    //     ephemeral: true
                    // })
            // }
            // return;
            }   
        })
// }

//     module.exports = {
//         // listInactivity,
//         activeMembers,
//     }

const inactivitySchema = require("../models/inactivitySchema");
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
  // 1 minute timer
  const inactivityTimer = 1 * 60 * 1000;

  // filters users who have exceded the inactivity timer
  // inactivitySchema.inactiveDB.create({ userid, lastMessageDate: messageDate });
  return activeUsers.filter((user) => currentTime - user.messageDate > inactivityTimer);


}
 function addInactivityDB(userid, messageDate){
  const doc =  inactivitySchema.inactiveDB.findOne();
  if(doc){
      try {
          // Check if the user already exists in the database
          let user =  inactivitySchema.inactiveDB.findOne({ userId });
  
          if (!user) {
              // If the user doesn't exist, create a new user document
              user = new Inactivity({
                  userId,
                  lastMessageDate: messageDate,
              });
          } else {
              // If the user already exists, update the lastMessageDate
              user.lastMessageDate = messageDate;
          }
  
          // Save the user document to the database
           user.save();
  
          console.log(`Inactivity data added for user ${userId}`);
      } catch (error) {
          console.error('Error adding inactivity data:', error);
      }
  }
  else{
      inactivitySchema.inactiveDB.create({ userId, lastMessageDate: messageDate });
      console.log(`New Schema has been created with ${userId} as the first value.`);
  }
}

module.exports = {
     checkInactiveUsers, 
     getInactiveUsers, 
     addInactivityDB,
     activeUsers
};
