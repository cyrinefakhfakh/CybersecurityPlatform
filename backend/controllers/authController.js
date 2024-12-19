const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/User');
require('dotenv').config();
const verificationCodes = new Map(); // Temporary store for verification codes

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const generateVerificationCode = () => Math.floor(100000 + Math.random() * 900000).toString();

const CODE_EXPIRATION_TIME = 10 * 60 * 1000; // 10 minutes

exports.sendVerification = async (req, res) => {
    const { email } = req.body;

    try {
        // Find the user by email or create a new one without requiring other fields
        let user = await User.findOne({ email });

        if (!user) {
            user = new User({ email });
        }

        // Generate a verification code and set expiration time
        const verificationCode = generateVerificationCode();
        user.verificationCode = verificationCode;
        user.verificationCodeExpires = new Date(Date.now() + CODE_EXPIRATION_TIME);

        // Save user without triggering validation
        await user.save({ validateBeforeSave: false });

        // Send verification code to the user's email
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Email Verification',
            text: `Your verification code is ${verificationCode}.`,
        });

        res.status(200).json({ message: 'Verification code sent to email.' });
    } catch (error) {
        console.error('Error sending verification code:', error.message);
        res.status(500).json({ message: 'Failed to send verification code.' });
    }
};

exports.signup = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found. Please verify your email first.' });
        }

        if (!user.verified) {
            return res.status(400).json({ message: 'Please verify your email before signing up.' });
        }

        user.name = name;
        user.password = await bcrypt.hash(password, 10); // Hash the password
        await user.save(); // This triggers validation for required fields

        res.status(201).json({ message: 'Sign up successful.' });
    } catch (error) {
        console.error('Signup error:', error.message);
        res.status(500).json({ message: 'Signup failed.' });
    }
};

exports.verifyEmail = async (req, res) => {
    const { email, verificationCode } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        if (user.verificationCode !== verificationCode) {
            return res.status(400).json({ message: 'Invalid verification code.' });
        }

        if (user.verificationCodeExpires < Date.now()) {
            return res.status(400).json({ message: 'Verification code expired.' });
        }

        user.verified = true;
        user.verifiedAt = new Date();
        user.verificationCode = undefined;
        user.verificationCodeExpires = undefined;

        // Save the user without triggering validation for optional fields
        await user.save({ validateBeforeSave: false });

        res.status(200).json({ message: 'Email verified successfully.' });
    } catch (error) {
        console.error('Error verifying email:', error.message);
        res.status(500).json({ message: 'Failed to verify email.' });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password.' });
        }

        const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, role: user.role });
    } catch (error) {
        console.error('Login error:', error.message);
        res.status(500).json({ message: 'An error occurred during login.' });
    }
};

exports.getUserDetails = async (req, res) => {
    try {
      const user = await User.findById(req.user.userId).select('-password');
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      console.error('Error fetching user details:', error.message);
      res.status(500).json({ message: 'An error occurred while fetching user details' });
    }
  };