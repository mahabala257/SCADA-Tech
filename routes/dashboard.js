const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const Submission = require('../models/Submission');

// Authentication middleware
function isAuthenticated(req, res, next) {
  if (req.session.user) return next();
  res.redirect('/auth/login');
}

// Dashboard route
router.get('/', isAuthenticated, async (req, res) => {
  try {
    const submissions = await Submission.find().sort({ createdAt: -1 });
    res.render('dashboard', {
      staffName: req.session.user.username,
      submissions
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).send('Server Error');
  }
});

// Serve resume files
router.get('/resume/:filename', (req, res) => {
  const filePath = path.join(__dirname, '../public/uploads', req.params.filename);
  
  // Check if file exists
  if (!fs.existsSync(filePath)) {
    console.error('File not found:', filePath);
    return res.status(404).send('Resume not found');
  }

  // For viewing in browser
  if (req.query.view === 'true') {
    return res.sendFile(filePath);
  }
  
  // For downloading
  res.download(filePath);
});

module.exports = router;
