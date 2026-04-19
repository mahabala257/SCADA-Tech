const express = require('express'); // Import express
const router = express.Router(); // Create a router instance
const multer = require('multer'); // Import multer for file uploads
const path = require('path'); // Import path for file paths
const Submission = require('../models/Submission'); // Adjust the path as necessary

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../public/uploads')); // Adjust path to your uploads directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Append timestamp to filename
  }
});

const upload = multer({ storage: storage }); // Create multer instance

// Handle form submission
router.post('/submit', upload.single('resume'), async (req, res) => {
  const { name, email, phone, internship, userType } = req.body;

  const newSubmission = new Submission({
    name,
    email,
    phone,
    internship: internship === 'on', // Convert checkbox to boolean
    resume: req.file ? req.file.filename : null // Store the filename of the uploaded resume
  });

  try {
    await newSubmission.save();

    // Redirect based on user type
    if (userType === 'candidate' && newSubmission.internship) {
      res.redirect('/thankyou'); // Redirect to thank you page
    } else {
      res.redirect('/success'); // Redirect to success page
    }

  } catch (error) {
    console.error('Error saving submission:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Export the router
module.exports = router;
