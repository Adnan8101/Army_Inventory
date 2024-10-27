// File: controllers/userController.js

const User = require('../models/User');
const bcrypt = require('bcrypt');
const { sendApprovalEmail, sendRejectionEmail, sendPasswordResetEmail, sendOTPEmail } = require('../utils/email');
const crypto = require('crypto');

// Generate unique ID
function generateUniqueID(userType) {
    const randomNumber = Math.floor(1000000 + Math.random() * 9000000);
    return `${userType}${randomNumber}`;
}

// Generate a random password
function generatePassword(length = 10) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < length; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
}

// Register user
exports.registerUser = async (req, res) => {
    const { name, userType, email, licenseNumber, phoneNumber } = req.body;
    if (!name || !userType || !email || !licenseNumber || !phoneNumber) {
        console.error("Registration error: Missing required fields", { name, userType, email, licenseNumber, phoneNumber });
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.error("Registration error: Email already in use", { email });
            return res.status(400).json({ message: 'Email already in use' });
        }

        const uniqueID = generateUniqueID(userType);
        const password = generatePassword();
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            userType,
            email,
            licenseNumber,
            phoneNumber,
            uniqueID,
            password: hashedPassword,
            status: 'Pending',
        });

        await newUser.save();
        await sendApprovalEmail(email, name, uniqueID, password);
        res.status(201).json({ message: 'Your details have been sent to the army for approval' });
    } catch (err) {
        console.error("Registration error:", err);
        res.status(500).json({ message: 'Registration failed', error: err });
    }
};

// Check if UID exists
exports.checkUID = async (req, res) => {
    const { userId } = req.body;
    if (!userId) {
        console.error("Check UID error: Missing user ID");
        return res.status(400).json({ message: 'Missing user ID' });
    }

    try {
        const user = await User.findOne({ uniqueID: userId });
        if (user) return res.json({ message: 'User found', user });
        console.error("Check UID error: User not found", { userId });
        return res.status(404).json({ message: 'User not found' });
    } catch (err) {
        console.error("Check UID error:", err);
        return res.status(500).json({ message: 'Error checking UID', error: err });
    }
};

// Login user with detailed debugging
exports.loginUser = async (req, res) => {
    const { userId, password } = req.body;
    if (!userId || !password) {
        console.error("Login error: Missing required fields", { userId, password });
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        const user = await User.findOne({ uniqueID: userId });

        if (!user) {
            console.error(`Login error: User not found. Entered UserID: ${userId}`);
            return res.status(404).json({ message: 'User not found' });
        }

        // Validate entered password against stored hash
        const isMatch = await bcrypt.compare(password, user.password);

        // Detailed debugging output for password comparison
        if (isMatch) {
            console.log(`Login successful for UserID: ${userId}`);
            return res.json({ message: 'Login successful', name: user.name, userType: user.userType });
        } else {
            console.error(`Login error: Invalid credentials for UserID: ${userId}`);
            console.error(`Expected Password (Hashed): ${user.password}`);
            console.error(`Entered Password (Plain Text): ${password}`);
            console.error(`Password match status: ${isMatch}`);
            return res.status(400).json({ message: 'Invalid credentials' });
        }
    } catch (err) {
        console.error("Login error:", err);
        return res.status(500).json({ message: 'Login failed', error: err });
    }
};

// Approve or Reject Registration
exports.approveOrRejectRegistration = async (req, res) => {
    const { userId, action, reason } = req.body;
    if (!userId || !action) {
        console.error("Approve/Reject Registration error: Missing required fields", { userId, action, reason });
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        const user = await User.findById(userId);
        if (!user) {
            console.error("Approve/Reject Registration error: User not found", { userId });
            return res.status(404).json({ message: 'User not found' });
        }

        if (action === 'approve') {
            const password = generatePassword();
            user.password = await bcrypt.hash(password, 10);
            user.status = 'Approved';
            await user.save();
            await sendApprovalEmail(user.email, user.name, user.uniqueID, password);
            return res.json({ message: 'User approved and email sent' });
        } else if (action === 'reject') {
            user.status = 'Rejected';
            user.rejectionReason = reason;
            await user.save();
            await sendRejectionEmail(user.email, user.name, reason);
            return res.json({ message: 'User rejected and email sent' });
        } else {
            console.error("Approve/Reject Registration error: Invalid action", { action });
            return res.status(400).json({ message: 'Invalid action' });
        }
    } catch (err) {
        console.error("Approve/Reject Registration error:", err);
        return res.status(500).json({ message: 'Error processing request', error: err });
    }
};

// Fetch pending registrations
exports.getPendingRegistrations = async (req, res) => {
    try {
        const pendingUsers = await User.find({ status: 'Pending' });
        res.json(pendingUsers);
    } catch (err) {
        console.error("Fetch Pending Registrations error:", err);
        res.status(500).json({ message: 'Failed to fetch pending registrations', error: err });
    }
};

// Forgot password - sends OTP to user email
exports.forgotPassword = async (req, res) => {
    const { userId, email } = req.body;
    if (!userId || !email) {
        console.error("Forgot Password error: Missing user ID or email", { userId, email });
        return res.status(400).json({ message: 'User ID and email are required' });
    }

    try {
        const user = await User.findOne({ uniqueID: userId, email });
        if (!user) {
            console.error("Forgot Password error: User not found", { userId, email });
            return res.status(404).json({ message: 'User not found' });
        }

        const otp = crypto.randomInt(100000, 999999).toString();
        user.otp = otp;
        user.otpExpires = Date.now() + 15 * 60 * 1000;
        await user.save();

        await sendOTPEmail(user.email, otp);
        res.json({ message: 'OTP sent to your registered email' });
    } catch (err) {
        console.error("Forgot Password error:", err);
        res.status(500).json({ message: 'Failed to send OTP', error: err });
    }
};

// Verify OTP - allows access to reset password page if OTP is valid
exports.verifyOTP = async (req, res) => {
    const { userId, otp } = req.body;
    if (!userId || !otp) {
        console.error("Verify OTP error: Missing user ID or OTP", { userId, otp });
        return res.status(400).json({ message: 'Missing user ID or OTP' });
    }

    try {
        const user = await User.findOne({
            uniqueID: userId,
            otp,
            otpExpires: { $gt: Date.now() }
        });
        if (!user) {
            console.error("Verify OTP error: Invalid or expired OTP", { userId, otp });
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        user.otp = null;
        user.otpExpires = null;
        await user.save();

        res.status(200).json({ message: 'OTP verified successfully, proceed to reset password' });
    } catch (err) {
        console.error("Verify OTP error:", err);
        res.status(500).json({ message: 'Error verifying OTP', error: err });
    }
};

// Reset password logic
exports.resetPassword = async (req, res) => {
    const { userId, newPassword } = req.body;
    if (!userId || !newPassword) {
        console.error("Reset Password error: Missing required fields", { userId, newPassword });
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        const user = await User.findOne({ uniqueID: userId });
        if (!user) {
            console.error("Reset Password error: User not found", { userId });
            return res.status(404).json({ message: 'User not found' });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        res.json({ message: 'Password has been reset successfully' });
    } catch (err) {
        console.error("Reset Password error:", err);
        res.status(500).json({ message: 'Error resetting password', error: err });
    }
};
