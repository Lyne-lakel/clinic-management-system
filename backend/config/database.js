// We require 'mongoose' to handle our connection to MongoDB Atlas.
// Mongoose provides a more robust way to interact with MongoDB than the native driver.
const mongoose = require('mongoose');
require('dotenv').config(); 

// This function handles the connection setup. We use async/await because connecting
// to a remote database takes time, and we need to wait for it to finish.
const connectToDatabase = async () => {
    try {
        // mongoose.connect takes the connection string from our .env file.
        // It connects exactly to the 'clinic_management' database within the Atlas cluster.
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`Database connected !! MongoDB Host: ${conn.connection.host}`);
    } catch (error) {
        // If there's an error (like wrong password or no internet), we log it and stop the server completely.
        console.error(`Error connecting to MongoDB: ${error.message}`);
        process.exit(1); // 1 means exit with failure
    }
};

// Export the function so we can use it in server.js
module.exports = connectToDatabase;
