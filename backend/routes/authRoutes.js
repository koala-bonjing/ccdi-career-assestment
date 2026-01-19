// routes/auth.js
const express = require("express");
const crypto = require("crypto");
const router = express.Router();
const User = require("../models/User");
const { sendVerificationCode } = require("../utils/emailServices");

// Generate random 6-digit code
const generateVerificationCode = () => {
  return crypto.randomInt(100000, 999999).toString();
};

// Sign up - Step 1: Create user and send verification code
router.post("/signup", async (req, res) => {
  try {
    const { fullName, email, password, preferredCourse } = req.body;

    // Validate required fields
    if (!fullName || !email || !password) {
      return res.status(400).json({
        message: "Full name, email, and password are required",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      // If user exists but isn't verified, resend code
      if (!existingUser.isVerified) {
        const newCode = generateVerificationCode();
        const expires = new Date(Date.now() + 10 * 60 * 1000);

        existingUser.verificationCode = newCode;
        existingUser.verificationCodeExpires = expires;
        await existingUser.save();

        const emailSent = await sendVerificationCode(email, fullName, newCode);

        if (!emailSent) {
          return res.status(500).json({
            message: "Failed to resend verification email",
          });
        }

        return res.status(200).json({
          message: "Verification code resent to your email",
          userId: existingUser._id,
        });
      }

      return res.status(400).json({
        message: "Email already in use. Please log in.",
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
      preferredCourse: preferredCourse || "Undecided",
      verificationCode,
      verificationCodeExpires,
      isVerified: false,
    });

    await newUser.save();

    // ✅ PASS fullName (critical fix!)
    const emailSent = await sendVerificationCode(
      email,
      fullName,
      verificationCode,
    );

    if (!emailSent) {
      // Clean up if email fails
      await User.findByIdAndDelete(newUser._id);
      return res.status(500).json({
        message: "Failed to send verification email",
      });
    }

    res.status(201).json({
      message: "Verification code sent to your email",
      userId: newUser._id,
    });
  } catch (error) {
    console.error("_signup error:", error);
    res.status(500).json({
      message: "Server error during signup",
    });
  }
});

// Verify email - Step 2: Verify the code
router.post("/verify-email", async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({
        message: "Email and verification code are required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "User not found. Please sign up first.",
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        message: "Email already verified. You can log in now.",
      });
    }

    if (user.verificationCode !== code) {
      return res.status(400).json({
        message: "Invalid verification code. Please check and try again.",
      });
    }

    if (user.verificationCodeExpires < new Date()) {
      return res.status(400).json({
        message: "Verification code has expired. Please request a new one.",
      });
    }

    // Mark user as verified and clear verification data
    user.isVerified = true;
    user.verificationCode = undefined;
    user.verificationCodeExpires = undefined;
    await user.save();

    res.json({
      message: "✅ Email verified successfully! Welcome to CCDI Sorsogon!",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        preferredCourse: user.preferredCourse,
      },
    });
  } catch (error) {
    console.error("_verification error:", error);
    res.status(500).json({
      message: "Server error during verification",
    });
  }
});

// Resend verification code
router.post("/resend-code", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "User not found. Please sign up first.",
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        message: "Email already verified. You can log in now.",
      });
    }

    // Generate new verification code
    const verificationCode = generateVerificationCode();
    const verificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000);

    user.verificationCode = verificationCode;
    user.verificationCodeExpires = verificationCodeExpires;
    await user.save();

    // ✅ PASS user.fullName (critical fix!)
    const emailSent = await sendVerificationCode(
      email,
      user.fullName,
      verificationCode,
    );

    if (!emailSent) {
      return res.status(500).json({
        message: "Failed to send verification email",
      });
    }

    res.json({
      message: "📬 New verification code sent to your email",
    });
  } catch (error) {
    console.error("_resend error:", error);
    res.status(500).json({
      message: "Server error while resending code",
    });
  }
});

// Login

router.post("/login", async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    // 1. Check if all fields are provided
    if (!email || !password || !fullName) {
      return res.status(400).json({
        message: "Student Name, Email and password are required",
      });
    }

    // 2. Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    // 3. Verify Name (Case-insensitive check is usually better for names)
    // We trim both to avoid errors with accidental spaces
    if (user.fullName.trim().toLowerCase() !== fullName.trim().toLowerCase()) {
      return res.status(400).json({
        message:
          "The Student Name provided does not match our records for this email.",
      });
    }

    // 4. Check if user is verified
    if (!user.isVerified) {
      return res.status(400).json({
        message: "📧 Please verify your email first.",
      });
    }

    // 5. Check password
    const isPasswordCorrect = await user.correctPassword(
      password,
      user.password,
    );
    if (!isPasswordCorrect) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    res.json({
      message: "✅ Login successful!",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        preferredCourse: user.preferredCourse,
      },
    });
  } catch (error) {
    console.error("_login error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
});

module.exports = router;
