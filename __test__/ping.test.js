const pingCommand = require("../src/commands/ping");

describe("Ping Command", () => {
  it("should reply with 'pong!' when executed", async () => {
    const interaction = {
      reply: jest.fn(),
    };

    await pingCommand.execute(interaction);

    expect(interaction.reply).toHaveBeenCalledWith("pong!");
  });
});