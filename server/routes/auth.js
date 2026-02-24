const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/email');

const crypto = require('crypto');

// Register
router.post('/register', async (req, res) => {
    console.log("Registration request received for:", req.body.email);
    try {
        // Check if user exists
        const emailExist = await User.findOne({ email: req.body.email });
        if (emailExist) {
            console.log("Email already exists:", req.body.email);
            return res.status(400).send('Email already exists');
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        // Create user
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        });

        const savedUser = await user.save();
        console.log("User successfully registered:", user.email);

        // Send verification email (mock)
        // await sendEmail(user.email, "Verify Email", "Link..."); 

        res.send({ user: user._id });
    } catch (err) {
        console.error("Error in registration route:", err);
        res.status(400).send(err);
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        // Check if user exists
        const user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(400).send('Email is not found');

        // Password correct?
        const validPass = await bcrypt.compare(req.body.password, user.password);
        if (!validPass) return res.status(400).send('Invalid password');

        // Create and assign token
        const token = jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET);
        res.header('auth-token', token).send({ token, role: user.role });
    } catch (err) {
        res.status(400).send(err);
    }
});

// Forgot Password
router.post('/forgot-password', async (req, res) => {
    console.log("Forgot password request received for:", req.body.email);
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            console.log("User not found in database for forgot-password:", req.body.email);
            return res.status(400).send('User with this email does not exist');
        }

        console.log("User found, generating token...");
        const token = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        await user.save();
        console.log("Token saved to user, sending email...");

        const resetLink = `${process.env.CLIENT_URL || 'http://localhost:5173'}/reset-password/${token}`;
        const textMessage = `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n` +
            `Please click on the following link, or paste this into your browser to complete the process:\n\n` +
            `${resetLink}\n\n` +
            `If you did not request this, please ignore this email and your password will remain unchanged.\n`;

        const htmlMessage = `
            <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                <h2 style="color: #FF6B35; text-align: center;">PizzaCraft Password Reset</h2>
                <p>Hello,</p>
                <p>You requested to reset your password. Please click the button below to set a new password:</p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${resetLink}" style="background-color: #FF6B35; color: white; padding: 12px 25px; text-decoration: none; font-weight: bold; border-radius: 5px;">Reset My Password</a>
                </div>
                <p>If the button doesn't work, you can also copy and paste this link into your browser:</p>
                <p style="color: #666; word-break: break-all;">${resetLink}</p>
                <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
                <p style="font-size: 12px; color: #999;">If you didn't request this, you can safely ignore this email.</p>
            </div>
        `;

        await sendEmail(user.email, "Password Reset", textMessage, htmlMessage);
        console.log("sendEmail called for reset link with HTML");

        res.send('Password reset link sent to email');
    } catch (err) {
        console.error("Error in forgot-password route:", err);
        res.status(400).send(err);
    }
});

// Reset Password
router.post('/reset-password/:token', async (req, res) => {
    try {
        const user = await User.findOne({
            resetPasswordToken: req.params.token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) return res.status(400).send('Password reset token is invalid or has expired');

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(req.body.password, salt);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        res.send('Password has been reset successfully');
    } catch (err) {
        res.status(400).send(err);
    }
});

module.exports = router;
