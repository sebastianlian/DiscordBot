const { SlashCommandBuilder } = require("@discordjs/builders");
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
    expect(interaction.reply).toHaveBeenCalledWith({
      content: expect.stringContaining("days from today will be:"),
    });
  });
});