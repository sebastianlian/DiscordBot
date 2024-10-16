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
    // fill the map
    getInactiveUsers: jest.fn(() =>
        new Map([
            ["123456789", { lastMessageDate: "2024-10-01 12:03:45" }],
            ["987654321", { lastMessageDate: "2024-10-14 10:31:27" }],
        ])),
    activeUsers: jest.fn(() => []),
}));

describe("Test showInactivity command", () => {
    // case 1: filled map
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

    // case 2: test empty map
    it("Displays no inactive users", async () => {
        // clear the array
        getInactiveUsers.mockReturnValue(new Map());
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
// Test for error handling
    it("Handles error response", async () => {
        getInactiveUsers.mockImplementation(() => {
            throw new Error("Simulated error");
        });

        await showInactivityCommand.execute(mockInteraction);

        expect(mockInteraction.reply).toHaveBeenCalledWith(
            expect.objectContaining({
                content: "There was an error while executing this command.",
                ephemeral: true,
            })
        );
    });
});
