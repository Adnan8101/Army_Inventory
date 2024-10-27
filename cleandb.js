const mongoose = require('mongoose');
const readline = require('readline');
const dotenv = require('dotenv');
dotenv.config();

const uri = process.env.MONGO_URI;

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB');
        askCleanType();
    })
    .catch(err => {
        console.error('Error connecting to MongoDB', err);
        process.exit(1);
    });

function askCleanType() {
    rl.question('Choose clean type (normal/brutal): ', async (answer) => {
        if (answer === 'normal') {
            await normalClean();
        } else if (answer === 'brutal') {
            await brutalClean();
        } else {
            console.log('Invalid option');
        }
        mongoose.connection.close();
        rl.close();
    });
}

async function normalClean() {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        const collection = collections[key];
        await collection.deleteMany({});
    }
    console.log('All documents deleted from collections');
}

async function brutalClean() {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        const collection = collections[key];
        await collection.drop();
    }
    console.log('All collections dropped');
}
