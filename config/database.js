// config/database.js
const { Client } = require('pg');
require('dotenv').config();

let client;

function getClient() {
  if (!client) {
    client = new Client({
      connectionString: process.env.DATABASE_URL,
    });

    client.connect()
      .then(() => console.log('Connected to the database'))
      .catch(err => console.error('Connection error', err.stack));
  }
  return client;
}

module.exports = getClient();
