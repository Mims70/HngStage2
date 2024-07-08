const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const { query } = require('./config/database');
const { EventEmitter } = require('events');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use('/auth', authRoutes);

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const emitter = new EventEmitter();
emitter.setMaxListeners(20); // Increase the limit if necessary

// Example of adding and removing listeners
const listener = () => {
  console.log('Listener triggered');
};

emitter.on('event', listener);

// Later, when you no longer need the listener
emitter.removeListener('event', listener);

// Properly close server and remove all listeners on exit
process.on('exit', () => {
  server.close();
  emitter.removeAllListeners();
});
module.exports = query