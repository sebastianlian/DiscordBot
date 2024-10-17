// Import necessary functions from the inactivity module and database models
const {
    addOrUpdateInactivityDB,
    removeFromInactivityDB,
    getInactiveUsers
} = require('../src/functions/inactivity.js');

const { inactiveDB } = require('../src/models/inactivitySchema');
const { blackListDB } = require('../src/models/blacklistSchema');
const { getChalk } = require('../src/utility/utils');

// Mock the external dependencies for testing
jest.mock('../src/models/inactivitySchema');  // Mock the inactivity database schema
jest.mock('../src/models/blacklistSchema');  // Mock the blacklist database schema
jest.mock('../src/utility/utils', () => {
    return {
        getChalk: jest.fn().mockReturnValue({
            cyan: jest.fn((msg) => msg), // Mock `cyan` to return the input message
            green: jest.fn((msg) => msg), // Mock `green` to return the input message
            yellow: jest.fn((msg) => msg), // Mock `yellow` to return the input message
            red: jest.fn((msg) => msg) // Mock `red` to return the input message
        }),
    };
});

// Mocking the functions from the inactivity module, particularly the recentlyActiveUsers set
jest.mock('../src/functions/inactivity.js', () => {
    const originalModule = jest.requireActual('../src/functions/inactivity.js');
    return {
        ...originalModule,
        recentlyActiveUsers: new Set()  // Mock recentlyActiveUsers as a Set
    };
});

// Define recentlyActiveUsers in the test scope for access within tests
const { recentlyActiveUsers } = require('../src/functions/inactivity.js');

// Describe the test suite for the inactivity module
describe('Inactivity Module Tests', () => {
    // Clear mocks and the recentlyActiveUsers set before each test
    beforeEach(() => {
        jest.clearAllMocks();  // Clear all mock function calls and instances
        recentlyActiveUsers.clear();  // Clear the Set before each test
    });

    // Test suite for addOrUpdateInactivityDB function
    describe('addOrUpdateInactivityDB', () => {
        it('should update or insert a user into inactivityDB successfully', async () => {
            // Mocking the database update function to resolve with a user object
            inactiveDB.findOneAndUpdate.mockResolvedValue({
                userId: '12345',
                userName: 'TestUser',
                lastMessageDate: new Date(),
                lastMessage: 'Hello!'
            });

            // Mock chalk utility for colored logging
            getChalk.mockReturnValue({
                cyan: jest.fn(),
                green: jest.fn(),
                yellow: jest.fn(),
                red: jest.fn()
            });

            // Call the function and expect it to return true
            const result = await addOrUpdateInactivityDB('12345', 'TestUser', Date.now(), 'Hello!');
            expect(result).toBe(true);
            expect(inactiveDB.findOneAndUpdate).toHaveBeenCalled(); // Ensure database function was called
        });

        it('should skip updating if user is in recentlyActiveUsers set', async () => {
            const userId = '12345';
            recentlyActiveUsers.add(userId); // Simulate user being in recently active set

            // Call the function and expect it to return true, but it will skip the database update
            const result = await addOrUpdateInactivityDB(userId, 'TestUser', Date.now(), 'Hello!');
            expect(result).toBe(true);
            recentlyActiveUsers.delete(userId); // Clean up for next tests
        });

        it('should return false if an error occurs', async () => {
            // Mocking the database function to reject with an error
            inactiveDB.findOneAndUpdate.mockRejectedValue(new Error('Database error'));

            // Call the function and expect it to return false
            const result = await addOrUpdateInactivityDB('12345', 'TestUser', Date.now(), 'Hello!');
            expect(result).toBe(false); // Expect failure on error
        });
    });

    // Test suite for removeFromInactivityDB function
    describe('removeFromInactivityDB', () => {
        beforeEach(() => {
            jest.clearAllMocks(); // Clear mocks before each test
        });

        it('should add a user to inactivityDB and then remove them successfully', async () => {
            // Step 1: Mock the addition of a user
            const mockLastMessageDate = new Date(); // Use a dynamic date for the mock
            inactiveDB.findOneAndUpdate.mockResolvedValue({
                userId: '12345',
                userName: 'TestUser',
                lastMessageDate: mockLastMessageDate, // Dynamically generated date
                lastMessage: 'Hello!'
            });

            // First, add the user to inactivityDB
            const addResult = await addOrUpdateInactivityDB('12345', 'TestUser', mockLastMessageDate, 'Hello!');
            expect(addResult).toBe(true);  // Ensure the user was added successfully
        });

        it('should return false if user is not found in inactivityDB after trying to remove', async () => {
            // Simulate a user not being found for deletion
            inactiveDB.deleteOne.mockResolvedValue({ deletedCount: 0 });

            // Call the function and expect it to return false
            const result = await removeFromInactivityDB('12345');
            expect(result.success).toBe(false);  // Expect failure when no user is deleted
        });

        it('should return false if an error occurs during deletion', async () => {
            // Simulate a database error during deletion
            inactiveDB.deleteOne.mockRejectedValue(new Error('Database error'));

            // Call the function and expect it to return false
            const result = await removeFromInactivityDB('12345');
            expect(result.success).toBe(false);  // Expect the operation to fail
        });
    });

    // Test suite for getInactiveUsers function
    describe('getInactiveUsers', () => {
        it('should retrieve all inactive users from inactivityDB', async () => {
            // Mock data representing inactive users
            const mockUsers = [
                { userId: '12345', userName: 'TestUser1', lastMessageDate: new Date(Date.now() - (25 * 60 * 60 * 1000)) },
                { userId: '67890', userName: 'TestUser2', lastMessageDate: new Date(Date.now() - (23 * 60 * 60 * 1000)) }
            ];

            // Mocking the database find function to return the mock users
            inactiveDB.find.mockReturnValue({
                exec: jest.fn().mockResolvedValue(mockUsers)  // Mock exec to return the expected data
            });

            // Call the function and expect it to return the correct inactive users
            const result = await getInactiveUsers();
            expect(result.has('12345')).toBe(true);  // User inactive for over the threshold
            expect(result.has('67890')).toBe(false); // User not considered inactive
        });

        it('should return an empty map if an error occurs', async () => {
            // Simulating a database error
            inactiveDB.find.mockRejectedValue(new Error('Database error'));

            // Call the function and expect it to return an empty map
            const result = await getInactiveUsers();
            expect(result.size).toBe(0);  // Expect an empty result on error
        });
    });
});
