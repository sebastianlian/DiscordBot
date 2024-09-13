const mongoose = require('mongoose');
const Inactivity = require('../src/models/inactivitySchema'); // Adjust path as needed

mongoose.connect('mongodb+srv://scarmagnola:Password1@tutorial.bv2w4.mongodb.net/?retryWrites=true&w=majority&appName=Tutorial', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

async function test() {
    try {
        const result = await Inactivity.findOneAndUpdate(
            { userId: 'testId' },
            { userName: 'testName', lastMessageDate: new Date() },
            { upsert: true, new: true }
        );
        console.log('Test result:', result);
    } catch (error) {
        console.error('Test error:', error);
    } finally {
        mongoose.connection.close();
    }
}

test();
