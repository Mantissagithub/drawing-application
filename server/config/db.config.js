const dotenv = require('dotenv');
dotenv.config(); // Load environment variables from .env file

// Import mongoose library
const mongoose = require('mongoose');

// Define the DB connection string
const uri = process.env.DB_CONNECTION;

if (!uri) {
  console.error("Environment variable 'DB_CONNECTION' not found.");
  process.exit(1);
}

/**
 * Connect to the MongoDB instance
 */
async function connect() {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      bufferCommands: false,
    });

    console.log(`Connected successfully to ${process.env.NODE_ENV} database`);
  } catch (err) {
    console.error(`Failed to connect to the database: ${err}`);
  }
}

module.exports = { connect };