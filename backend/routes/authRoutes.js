// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Import the User model
const bcrypt = require('bcryptjs'); // For hashing passwords
const jwt = require('jsonwebtoken'); // For generating and verifying tokens
const authMiddleware = require('../middleware/auth'); // Middleware to verify token

// Signup route
router.post('/signup', async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    // Check if the user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'A user with this email address already exists. Please try logging in instead.' });
    }

    // Assign default role as 'user' if not provided
    const userRole = role || 'user';

    // Create a new user
    user = new User({
      name,
      email,
      password: await bcrypt.hash(password, 10), // Hash the password
      role: userRole // Default role is 'user'
    });

    await user.save();
    res.status(201).json({ message: 'Registration successful! Welcome to CyberSec. Please log in to continue.' });
  } catch (error) {
    console.error('Signup error:', error.message);
    res.status(500).json({ message: 'We encountered an error while processing your registration. Please try again later.' });
  }
});

// Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'The email address or password you entered is incorrect. Please try again.' });
    }

    // Log the user object to check if the role is present
    console.log('User found:', user);

    // Check if the password is correct
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'The email address or password you entered is incorrect. Please try again.' });
    }

    // Generate a token
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, role: user.role }); // Include role in the response
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ message: 'We encountered an error while processing your login. Please try again later.' });
  }
});

// Get user details route
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    res.json(user);
  } catch (error) {
    console.error('Error fetching user details:', error.message);
    res.status(500).json({ message: 'We encountered an error while fetching your details. Please try again later.' });
  }
});

module.exports = router;