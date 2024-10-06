const { MongoClient } = require('mongodb');

// Connection URL
const url = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.9uq0rgf.mongodb.net/puzzle_game?retryWrites=true&w=majority`;

// Create a new MongoClient
const client = new MongoClient(url);

module.exports = {
  client,
};
