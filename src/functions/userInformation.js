const UserSchema = require('../models/userSchema'); // Ensure correct path to your model

async function logUsersAndRoles(GUILD_ID) {
    try {
        // Check if the guild exists in the client's cache
        const guild = client.guilds.cache.get(GUILD_ID);

        if (!guild) {
            throw new Error(`Guild with ID ${GUILD_ID} not found or the bot is not a member.`);
        }

        // Fetch all members of the guild with roles
        await guild.members.fetch(); // This populates the cache with guild members

        for (const [memberId, member] of guild.members.cache) {
            console.log(`Processing member: ${member.user.tag}`); // Debugging log

            // Filter out the @everyone role by checking the role name or ID
            const roles = member.roles.cache
                .filter(role => role.name !== '@everyone') // Filter by role name
                .map(role => ({
                    roleId: role.id,
                    roleName: role.name,
                }));

            // Log the filtered roles for debugging
            console.log(`Roles for ${member.user.tag}:`, roles);

            // Replace the existing roles array in the database with the current state
            await UserSchema.updateOne(
                { userId: memberId },
                {
                    userId: memberId,
                    userName: member.user.username,
                    roles: roles, // Replace roles with the current state
                },
                { upsert: true }
            );
        }

        console.log('User and role data updated successfully.');
    } catch (error) {
        console.error('Error logging users and roles:', error);
    }
}

module.exports = { logUsersAndRoles };