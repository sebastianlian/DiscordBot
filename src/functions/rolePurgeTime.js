const roleSchema = require("../models/roleSchema");

async function setRoleTime(roleID, days){
    // const doc = await roleSchema.roleDB.findOne();
    // if(doc){
    //     try {
    //         // Check if the user already exists in the database
    //         let user = await Inactivity.findOne({ userId });
    
    //         if (!user) {
    //             // If the user doesn't exist, create a new user document
    //             user = new Inactivity({
    //                 userId,
    //                 lastMessageDate: messageDate,
    //             });
    //         } else {
    //             // If the user already exists, update the lastMessageDate
    //             user.lastMessageDate = messageDate;
    //         }
    
    //         // Save the user document to the database
    //         await user.save();
    
    //         console.log(`Inactivity data added for user ${userId}`);
    //     } catch (error) {
    //         console.error('Error adding inactivity data:', error);
    //     }
    // }
    // else{
    //     await inactivitySchema.inactiveDB.create({ userId, lastMessageDate: messageDate });
    //     console.log(`New Schema has been created with ${userId} as the first value.`);
    // }
}

module.exports = {
    setRoleTime
}