// import MongoDB client
const { MongoClient } = require('mongodb');

// Read connection string from .env file
const uri = process.env.MONGODB_URI;

// Connect to MongoDB
async function connectToDatabase() {
  const client = await MongoClient.connect(uri);
  const db = client.db('clinic_management'); // here it is like we named it in MongoDB Atlas
  console.log('Database connected !!');
  return db;
}

module.exports = { connectToDatabase }; // make this function available to other files