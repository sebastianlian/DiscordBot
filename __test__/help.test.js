const EmbedBuilder = require("@discordjs/builders");
const helpCommand = require("../src/commands/help");

// Mock interaction
const mockInteraction = {
  reply: jest.fn(),
};

describe("Test help command functions", () => {
  it("Check help command format", async () => {
    // execute mock function
    await helpCommand.execute(mockInteraction);
    const replyArguments = mockInteraction.reply.mock.calls[0][0];

    // test embeds
    expect(replyArguments).toEqual(
      expect.objectContaining({
        embeds: expect.any(Array),
      })
    );

    // check embed
    const [embed] = replyArguments.embeds;
    expect(embed).toBeInstanceOf(Object);
    expect(embed.data.title).toBe("Help");
    expect(embed.data.description).toBe("List of all available commands.");
    expect(embed.data.color).toBe(0x0099FF);

    const expectedCommands = [
        '/help - Lists out all the different configuration commands for the bot.',
        '/blacklist show - Shows the current blacklisted user/roles',
        '/blacklist add (user/role) - Lets you add a specific user/role to a blacklist which makes them bypass the purges.',
        '/blacklist remove (user/role) - Lets you remove a specific user/role to a blacklist.',
        '/purge - Starts a manual purge which will gather all inactive users and send specified channel for confirmation.',
        '/roletimer (role name) (amount of time in days) - Sets the grace period for a certain role.',
        '/setpurge (time in days) - Sets the specified automated purge window (in days).',
        '/timer (role) (time) - Sets a time window (in days) for a role before considering them inactive.',
        '/show inactivity - Shows members who are considered "inactive" that are eligible to be purged.'
    ];
    
    // checks if the command has a name
    for (const expectedCommand of expectedCommands) {
      const [name] = expectedCommand.split(' - ');
      expect(embed.data.fields.some(field => field.name === name)).toBe(true);
    }
  });
});