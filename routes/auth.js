const express = require('express');
const router = express.Router();

// GET /auth/login - render login page
router.get('/login', (req, res) => {
  res.render('login', { error: null });
});

// POST /auth/login - handle login form submission
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Simple authentication logic (replace with your own)
  if (username === 'admin' && password === 'admin123') {
    req.session.user = { username: 'admin' }; // Store user info in session
    return res.redirect('/dashboard'); // Redirect to dashboard on success
  }

  res.render('login', { error: 'Invalid credentials' });
});

// GET /auth/logout - handle logout
router.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.redirect('/dashboard');
    }
    res.clearCookie('connect.sid'); // Clear the session cookie
    res.redirect('/auth/login'); // Redirect to login page
  });
});

module.exports = router;
