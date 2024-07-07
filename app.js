const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const database = require('./config/database');

const app = express();

app.use(bodyParser.json());
app.use('/auth', authRoutes);

const PORT = process.env.PORT || 5000;

// Export the app for Vercel
module.exports = app;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    database.connect();
  });
}
