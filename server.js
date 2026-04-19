require('dotenv').config();
const express = require('express');
const path = require('path');
const session = require('express-session');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();

// Database connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB Error:', err));

// Middleware to parse URL-encoded bodies (form submissions)
app.use(bodyParser.urlencoded({ extended: false }));

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Session middleware setup
app.use(session({
  secret: process.env.SESSION_SECRET || 'your_secret_key',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // Set to true if using HTTPS
}));

// Set EJS as the view engine and specify views directory
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Mount routes
app.use('/auth', require('./routes/auth'));
app.use('/', require('./routes/upload'));
app.use('/dashboard', require('./routes/dashboard'));

// Serve resumes for download
app.get('/dashboard/resume/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, 'public', 'uploads', filename); // Adjust path to your uploads directory

  // Check if the file exists
  if (!fs.existsSync(filePath)) {
    console.error('File not found:', filePath);
    return res.status(404).send('Resume not found');
  }

  // Send the file for download
  res.download(filePath, (err) => {
    if (err) {
      console.error('Error sending file:', err);
      res.status(500).send('Error downloading file');
    }
  });
});

// Serve the success page
app.get('/success', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'success.html'));
});

// Serve the thank you page
app.get('/thankyou', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'thankyou.html'));
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
