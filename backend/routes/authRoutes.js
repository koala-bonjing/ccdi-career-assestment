// routes/auth.js
const express = require('express');
const crypto = require('crypto');
const router = express.Router();
const User = require('../models/User');
const { sendVerificationCode } = require('../utils/emailServices');

// Generate random 6-digit code
const generateVerificationCode = () => {
  return crypto.randomInt(100000, 999999).toString();
};

// Sign up - Step 1: Create user and send verification code
router.post('/signup', async (req, res) => {
  try {
    const { fullName, email, password, preferredCourse } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        message: 'User already exists with this email' 
      });
    }

    // Generate verification code
    const verificationCode = generateVerificationCode();
    const verificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Create new user
    const newUser = new User({
      fullName,
      email,
      password,
      preferredCourse: preferredCourse || 'Undecided',
      verificationCode,
      verificationCodeExpires
    });

    await newUser.save();

    // Send verification code via email
    const emailSent = await sendVerificationCode(email, verificationCode);
    
    if (!emailSent) {
      await User.findByIdAndDelete(newUser._id);
      return res.status(500).json({ 
        message: 'Failed to send verification email' 
      });
    }

    res.status(201).json({
      message: 'Verification code sent to your email',
      userId: newUser._id
    });

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ 
      message: 'Server error during signup' 
    });
  }
});

// Verify email - Step 2: Verify the code
router.post('/verify-email', async (req, res) => {
  try {
    const { email, code } = req.body;

    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(400).json({ 
        message: 'User not found' 
      });
    }

    if (user.isVerified) {
      return res.status(400).json({ 
        message: 'Email already verified' 
      });
    }

    if (user.verificationCode !== code) {
      return res.status(400).json({ 
        message: 'Invalid verification code' 
      });
    }

    if (user.verificationCodeExpires < new Date()) {
      return res.status(400).json({ 
        message: 'Verification code has expired' 
      });
    }

    // Mark user as verified and clear verification code
    user.isVerified = true;
    user.verificationCode = null;
    user.verificationCodeExpires = null;
    await user.save();

    res.json({
      message: 'Email verified successfully',
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        preferredCourse: user.preferredCourse
      }
    });

  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({ 
      message: 'Server error during verification' 
    });
  }
});

// Resend verification code
router.post('/resend-code', async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(400).json({ 
        message: 'User not found' 
      });
    }

    if (user.isVerified) {
      return res.status(400).json({ 
        message: 'Email already verified' 
      });
    }

    // Generate new verification code
    const verificationCode = generateVerificationCode();
    const verificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000);

    user.verificationCode = verificationCode;
    user.verificationCodeExpires = verificationCodeExpires;
    await user.save();

    // Send new verification code
    const emailSent = await sendVerificationCode(email, verificationCode);
    
    if (!emailSent) {
      return res.status(500).json({ 
        message: 'Failed to send verification email' 
      });
    }

    res.json({
      message: 'New verification code sent to your email'
    });

  } catch (error) {
    console.error('Resend code error:', error);
    res.status(500).json({ 
      message: 'Server error while resending code' 
    });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ 
        message: 'Invalid email or password' 
      });
    }

    // Check if user is verified
    if (!user.isVerified) {
      return res.status(400).json({ 
        message: 'Please verify your email first' 
      });
    }

    // Check password
    const isPasswordCorrect = await user.correctPassword(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ 
        message: 'Invalid email or password' 
      });
    }

    res.json({
      message: 'Login successful',
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        preferredCourse: user.preferredCourse
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      message: 'Server error during login' 
    });
  }
});

module.exports = router;