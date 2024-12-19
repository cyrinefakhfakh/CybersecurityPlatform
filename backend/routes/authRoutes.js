const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/me', authMiddleware, authController.getUserDetails);
router.post('/send-verification', authController.sendVerification);
router.post('/verify-email', authController.verifyEmail);
module.exports = router;
