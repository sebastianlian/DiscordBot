const { SlashCommandBuilder, EmbedBuilder } = require("@discordjs/builders");

//Might use command
module.exports = {
	data: new SlashCommandBuilder()
		.setName("power")
		.setDescription("Adds or removes power to a specific role.")
        .addSubcommand((subcommand) =>
            subcommand.setName("add")
            .setDescription("Gives permissions for the bot.")
            .addRoleOption((option) =>
                option.setName("role")
                .setDescription("Role you are giving permissions to")
                .setRequired(true)
            )
            .addStringOption((option) =>
                    option.setName("permission")
                        .setDescription("Choose the permission level")
                        .setRequired(true)
                        .addChoices({name: "Admin", value: "admin"},
                                    {name: "Moderator", value: "mod"},
                                    {name :"Junior Moderator", value: "jrmod"})
            )
        )
        .addSubcommand((subcommand) =>
            subcommand.setName("remove")
            .setDescription("Removes permissions for the bot.")
            .addRoleOption((option) =>
                option.setName("role")
                .setDescription("Role you are removing permissions from")
                .setRequired(true)
            )
            .addStringOption((option) =>
                    option.setName("permission")
                        .setDescription("Choose the permission level")
                        .setRequired(true)
                        .addChoices({name: "Admin", value: "admin"},
                                    {name: "Moderator", value: "mod"},
                                    {name :"Junior Moderator", value: "jrmod"})
            )
        ),
	
        async execute(interaction) {
            const subcommand = interaction.options.getSubcommand();
            const role = interaction.options.getRole("role");
            const permission = interaction.options.getString("permission");
    
            if (subcommand === "add") {
                interaction.reply({
                    content: `Added ${role.name} to the ${permission} list.`,
                    emphemeral: true
                });
            } 
            else if (subcommand === "remove") {
                interaction.reply({
                    content: `Removed ${role.name} from the ${permission} list.`,
                    emphemeral: true
                });
            }
        }
    };