const { SlashCommandBuilder } = require("@discordjs/builders");
const { PermissionFlagsBits } = require("discord.js");
const command = require("../src/commands/blacklist");
const blacklistAdd = require("../src/functions/blacklistAdd");
const blacklistRemove = require("../src/functions/blacklistRemove");
const blacklistShow = require("../src/functions/blacklistShow");

// Mock functions
jest.mock("../src/functions/blacklistAdd", () => ({
  insertBlacklistDB: jest.fn(),
}));

jest.mock("../src/functions/blacklistRemove", () => ({
  removeBlacklistDB: jest
    .fn()
    .mockResolvedValue("Successfully removed from blacklist"),
}));

jest.mock("../src/functions/blacklistShow", () => ({
  showBlacklistDB: jest.fn().mockResolvedValue(["User1", "User2"]),
}));

// Grouped Test cases
describe("Blacklist Command", () => {
  // Clear mocks
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Execute add subcommand", async () => {
    // Simulate the discord interaction
    const interaction = {
      options: {
        // Mock data
        getSubcommand: jest.fn().mockReturnValue("add"),
        getUser: jest.fn().mockReturnValue({ id: "123456789012345678" }),
      },
      reply: jest.fn(),
      client: {
        application: {
          commands: {
            create: jest.fn(),
          },
        },
      },
    };

    await command.execute(interaction);

    // Check if the commands were called correctly
    expect(interaction.reply).toHaveBeenCalled();
    expect(blacklistAdd.insertBlacklistDB).toHaveBeenCalled();
  });

  it("Execute remove subcommand", async () => {
    const interaction = {
      options: {
        getSubcommand: jest.fn().mockReturnValue("remove"),
        getUser: jest
          .fn()
          .mockReturnValue({ id: "123456789012345678", tag: "UserToRemove" }),
      },
      reply: jest.fn(),
      client: {
        application: {
          commands: {
            create: jest.fn(),
          },
        },
      },
    };

    await command.execute(interaction);

    expect(interaction.reply).toHaveBeenCalled();
    expect(blacklistRemove.removeBlacklistDB).toHaveBeenCalled();
  });

  it("Execute show subcommand", async () => {
    const interaction = {
      options: {
        getSubcommand: jest.fn().mockReturnValue("show"),
      },
      reply: jest.fn(),
      client: {
        application: {
          commands: {
            create: jest.fn(),
          },
        },
      },
    };

    await command.execute(interaction);

    expect(interaction.reply).toHaveBeenCalled();
    expect(blacklistShow.showBlacklistDB).toHaveBeenCalled();
  });
});
