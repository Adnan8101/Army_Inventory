// File: models/User.js

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    userType: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    licenseNumber: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    password: { type: String }, // Stores the hashed password
    uniqueID: { type: String, required: true, unique: true },
    status: { type: String, default: 'Pending' },
    rejectionReason: { type: String },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
    otp: { type: String },
    otpExpires: { type: Date }
}, { timestamps: true });

// Pre-save hook to hash the password if modified
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    try {
        this.password = await bcrypt.hash(this.password, 10);
        next();
    } catch (err) {
        next(err);
    }
});

// Generate and hash a reset token
userSchema.methods.generateResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.resetPasswordExpires = Date.now() + 60 * 60 * 1000; // Token valid for 1 hour
    return resetToken;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
