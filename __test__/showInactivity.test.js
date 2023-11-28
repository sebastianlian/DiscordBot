const { SlashCommandBuilder, EmbedBuilder } = require("@discordjs/builders");
const { PermissionFlagsBits } = require("discord.js");
const showInactivityCommand = require("../src/commands/showInactivity");
const { getInactiveUsers } = require("../src/functions/inactivity");

// mock interaction
const mockInteraction = {
  reply: jest.fn(),
};

// mock functions
jest.mock("../src/functions/inactivity", () => ({
  checkInactiveUsers: jest.fn(),
  // fill the array
  getInactiveUsers: jest.fn(() => [
    { id: "123456789", messageDate: "2023-11-27 12:30:45" },
    { id: "987654321", messageDate: "2023-11-28 10:31:27" },
  ]),
  activeUsers: jest.fn(() => []),
}));

describe("Test showInactivity command", () => {
  // case 1: filled array
  it("Displays inactive users", async () => {
    await showInactivityCommand.execute(mockInteraction);

    const replyArguments = mockInteraction.reply.mock.calls[0][0];

    // check array
    expect(replyArguments).toEqual(
      expect.objectContaining({
        embeds: expect.any(Array),
      })
    );

    // check embed
    const [embed] = replyArguments.embeds;
    expect(embed).toBeInstanceOf(Object);
    expect(embed.data.title).toBe("Inactive Members");
    expect(embed.data.description).toContain("<@123456789>");
    expect(embed.data.description).toContain("<@987654321>");
  });

  // case 2: test empty array
  it("Displays no inactive users", async () => {
    // clear the array
    getInactiveUsers.mockReturnValue([]);
    await showInactivityCommand.execute(mockInteraction);

    const replyArguments = mockInteraction.reply.mock.calls[1][0];

    // check array
    expect(replyArguments).toEqual(
      expect.objectContaining({
        embeds: expect.any(Array),
      })
    );

    // check embed
    const [embed] = replyArguments.embeds;
    expect(embed).toBeInstanceOf(Object);
    expect(embed.data.title).toBe("No Inactive Users");
  });
});
