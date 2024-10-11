const { SlashCommandBuilder, EmbedBuilder } = require("@discordjs/builders");
const { PermissionFlagsBits } = require("discord.js");
const setPurgeCommand = require("../src/commands/setpurge");

// Mock interaction
const mockInteraction = {
  options: {
    getInteger: jest.fn().mockReturnValue(7),
  },
  reply: jest.fn(),
};

describe("Test setpurge command", () => {
  it("Check the content", async () => {
    await setPurgeCommand.execute(mockInteraction);

    expect(setPurgeCommand.getPurgeDays()).toBe(7);

    const replyArguments = mockInteraction.reply.mock.calls[0][0];


    expect(replyArguments).toEqual(
      expect.objectContaining({
        embeds: expect.any(Array),
      })
    );

    const [embed] = replyArguments.embeds;
    expect(embed).toBeInstanceOf(Object);
    expect(embed.data.title).toBe("PurgePage window set to 7 days.");
  });
});