// app.js
const express = require('express');
const app = express();
const authRoutes = require('./routes/authRoutes');
const client = require('./config/database'); 
app.use(express.json());

app.use('/auth', authRoutes);

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});

module.exports = {
    app,
    client
}
