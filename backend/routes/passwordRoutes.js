const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Forgot password - sends OTP to user's email
router.post('/forgot-password', userController.forgotPassword);

// Verify OTP
router.post('/verify-otp', userController.verifyOTP);

// Reset password after OTP verification
router.post('/reset-password', userController.resetPassword);

module.exports = router;
