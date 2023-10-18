const blacklistModel = require("../models/blacklistSchema");

module.exports = {
    name: "interactionCreate",
    // once: true,
    async execute (interaction) {
        //checks if a chat message is a valid command
        if(!interaction.isCommand()){
            return
        }

        //get user db information and pass to command
        let profileData;
        try {
            profileData = await blacklistModel.findOne({userI: interaction.user.id});
        } catch (error) {
            
        }
    
        const command = interaction.client.commands.get(interaction.commandName);
    
        if(!command){
            return;
        }
    
        try {
            await command.execute(interaction, profileData);
        } catch(err) {
            if (err) {
                console.error(err);
    
                await interaction.reply({
                    content: "An error has occurred",
                    ephemeral: true
                });
            }
        }
    }
}