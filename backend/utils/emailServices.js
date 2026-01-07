// utils/emailServices.js - Simplified for Primary Inbox
const axios = require("axios");

exports.sendVerificationCode = async (email, fullName, code) => {
  try {
    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          name: "CCDI Career Assessment Test",
          email: "careerassessment.verifcode@gmail.com",
        },
        to: [
          {
            email: email,
            name: fullName || "Student",
          },
        ],
        subject: "Verify Your Email - CCDI Career Assessment",
        htmlContent: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <p>Hello ${fullName || "there"},</p>
            
            <p>Thank you for signing up for the CCDI Career Assessment Platform.</p>
            
            <p>Your verification code is:</p>
            
            <div style="background-color: #f5f5f5; padding: 15px; margin: 20px 0; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #333;">
              ${code}
            </div>
            
            <p>This code will expire in 10 minutes.</p>
            
            <p>If you didn't request this code, please ignore this email.</p>
            
            <p>Best regards,<br>
            CCDI Sorsogon Team<br>
            Computer Communication Development Institute</p>
            
            <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
            
            <p style="font-size: 12px; color: #666;">
              Need help? Visit <a href="https://www.ccdisorsogon.edu.ph" style="color: #0066cc;">www.ccdisorsogon.edu.ph</a>
            </p>
          </div>
        `,
      },
      {
        headers: {
          accept: "application/json",
          "api-key": process.env.BREVO_API_KEY,
          "content-type": "application/json",
        },
      }
    );

    console.log(`✅ ✉️ Verification email sent to ${email}`);
    return true;
  } catch (error) {
    console.error(
      "❌ Brevo email error:",
      error.response?.data || error.message
    );
    return false;
  }
};
