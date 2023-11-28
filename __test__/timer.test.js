const { SlashCommandBuilder, EmbedBuilder } = require("@discordjs/builders");
const { PermissionFlagsBits } = require("discord.js");

jest.mock("../src/commands/setpurge", () => {
  return {
    getPurgeDays: jest.fn().mockReturnValue(7),
  };
});

const command = require("../src/commands/timer");

describe("Timer Command", () => {
  it("should reply with the time left until the purge", async () => {
    const interaction = {
      reply: jest.fn(),
    };

    await command.execute(interaction);

    expect(interaction.reply).toHaveBeenCalledTimes(1);
    
    const replyArgument = interaction.reply.mock.calls[0][0];
    expect(replyArgument.embeds).toHaveLength(1);
    expect(replyArgument.embeds[0]).toBeInstanceOf(EmbedBuilder);

    const embedContent = replyArgument.embeds[0].toJSON();
    expect(embedContent.title).toBe("Timer");
    expect(embedContent.description).toContain("days from today will be:");
  });
});