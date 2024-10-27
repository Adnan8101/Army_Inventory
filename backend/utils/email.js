require('dotenv').config();
const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const path = require('path');

const OAuth2 = google.auth.OAuth2;

const oauth2Client = new OAuth2(
    process.env.GMAIL_CLIENT_ID,
    process.env.GMAIL_CLIENT_SECRET,
    "https://developers.google.com/oauthplayground"
);

oauth2Client.setCredentials({
    refresh_token: process.env.GMAIL_REFRESH_TOKEN,
    access_token: process.env.GMAIL_ACCESS_TOKEN
});

async function sendMail(to, subject, html) {
    try {
        const accessToken = await oauth2Client.getAccessToken();

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: process.env.GMAIL_USER,
                clientId: process.env.GMAIL_CLIENT_ID,
                clientSecret: process.env.GMAIL_CLIENT_SECRET,
                refreshToken: process.env.GMAIL_REFRESH_TOKEN,
                accessToken: accessToken.token
            }
        });

        const mailOptions = {
            from: `"Indian Army" <${process.env.GMAIL_USER}>`,
            to: to,
            subject: subject,
            html: html
        };

        const result = await transporter.sendMail(mailOptions);
        console.log('Email sent:', result);
        return result;
    } catch (error) {
        console.error('Failed to send email:', error);
        throw error;
    }
}

// Email template with logo and design similar to your provided image
function emailTemplate(bodyContent) {
    return `
    <div style="font-family: Arial, sans-serif; font-size: 16px; line-height: 1.6; color: #333; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
        <div style="text-align: center;">
            <img src="cid:logo" alt="Indian Army Logo" style="width: 100px; height: auto; margin-bottom: 20px;">
        </div>
        ${bodyContent}
        <p style="font-size: 14px; color: #888;">If you did not request this action, please contact support immediately.</p>
        <p style="font-size: 14px; color: #888;">Regards,<br>Indian Army Team</p>
        <hr>
        <p style="font-size: 12px; color: #aaa;">This is an automated message, please do not reply.</p>
    </div>
    `;
}

async function sendApprovalEmail(to, name, uniqueID, password) {
    const subject = 'Registration Approved';
    const html = emailTemplate(`
        <h2 style="color: #28a745;">Registration Approved</h2>
        <p>Dear <strong>${name}</strong>,</p>
        <p>Your registration has been successfully approved!</p>
        <p><strong>User ID:</strong> ${uniqueID}<br>
        <strong>Password:</strong> ${password}</p>
        <p>Please keep this information secure and do not share it with anyone.</p>
    `);
    return await sendMail(to, subject, html);
}

async function sendRejectionEmail(to, name, reason) {
    const subject = 'Registration Rejected';
    const html = emailTemplate(`
        <h2 style="color: #dc3545;">Registration Rejected</h2>
        <p>Dear <strong>${name}</strong>,</p>
        <p>We regret to inform you that your registration has been rejected.</p>
        <p><strong>Reason:</strong> ${reason}</p>
    `);
    return await sendMail(to, subject, html);
}

async function sendPasswordResetEmail(to, resetToken) {
    const subject = 'Password Reset Request';
    const html = emailTemplate(`
        <h2>Password Reset Request</h2>
        <p>You have requested a password reset. Click the link below to reset your password:</p>
        <a href="${process.env.FRONTEND_URL}/reset-password.html?token=${resetToken}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 5px;">Reset Password</a>
        <p>This link will expire in 15 minutes.</p>
    `);
    return await sendMail(to, subject, html);
}

async function sendOTPEmail(to, otp) {
    const subject = 'Your OTP for Verification';
    const html = emailTemplate(`
        <h2>Your One-Time Password (OTP)</h2>
        <p>Use the following OTP to complete your verification:</p>
        <div style="font-size: 24px; font-weight: bold; margin: 20px 0;">${otp}</div>
        <p>This OTP is valid for 15 minutes.</p>
    `);
    return await sendMail(to, subject, html);
}

module.exports = { sendApprovalEmail, sendRejectionEmail, sendPasswordResetEmail, sendOTPEmail };
