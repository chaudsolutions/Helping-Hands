const express = require("express");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");

const transporter = require("../Modules/nodemailer.js");
const UsersModel = require("../Models/Users.js");
const CampaignModel = require("../Models/Campaign.js");

const router = express.Router();
const secretKey = process.env.SECRET;

// jwt token
const createToken = (_id) => {
  return jwt.sign({ _id }, secretKey, { expiresIn: "7d" });
};

const appUrl = "https://helpwithfund.com";
const fromMail = `HelpWithFund <noreply@helpwithfund.com>`;
const replyToMail = `noreply@helpwithfund.com`;

// server sign up handle signUp
router.post("/register", async (req, res) => {
  const {
    email,
    name,
    password,
    campaignName,
    amount,
    category,
    country,
    description,
  } = req.body;

  try {
    // Generate a 6-digit verification code from UUID
    const verificationCode = uuidv4().slice(0, 6);

    // Register a new user
    const user = await UsersModel.signup(
      email,
      name,
      password,
      verificationCode,
      country
    );

    // Create a campaign for the user
    const campaign = await CampaignModel.create({
      creator: name,
      creatorId: user._id,
      campaigns: [
        {
          campaignName,
          category,
          amount,
          story: description,
        },
      ],
    });

    // Create a token for the user
    const token = createToken(user._id);

    // Compose a welcome message with campaign details
    const mailOptions = {
      from: fromMail,
      replyTo: replyToMail,
      to: email, // the user's email
      subject: `Welcome to HelpWithFund! Your account is ready`,
      html: `
        <div style="background-color: #f5f5f5; padding: 20px; font-family: 'Arial', sans-serif; color: #333;">
          <!-- Header section with logo -->
          <div style="background-color: #4CAF50; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: #ffffff; font-weight: bold; font-size: 28px; margin: 0;">Welcome to HelpWithFund</h1>
            <p style="color: #e0f7e7; font-size: 16px; margin: 5px 0;">Together, we can make a difference!</p>
          </div>
    
          <!-- Main content area -->
          <div style="background-color: #ffffff; padding: 30px; border: 1px solid #dedede; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333333; font-size: 22px; font-weight: 600;">Hi ${name},</h2>
            <p style="font-size: 16px; color: #555555; line-height: 1.7;">
              Thank you for joining HelpWithFund! Your account has been successfully created and you're ready to start making a positive impact.
            </p>
    
            <!-- Campaign information -->
            <div style="margin: 20px 0;">
              <h3 style="color: #4CAF50; font-size: 20px; font-weight: 600;">Your First Campaign</h3>
              <p style="font-size: 16px; color: #555555; line-height: 1.7;">
                Your campaign, <strong style="color: #333;">${campaignName}</strong>, is live now! Get started by sharing your campaign with friends and family, and track your progress on our platform.
              </p>
              <a href="${appUrl}/campaign/${campaign._id}" style="background-color: #4CAF50; color: #ffffff; padding: 12px 25px; border-radius: 5px; text-decoration: none; font-size: 16px; display: inline-block; margin-top: 15px;">View Campaign</a>
            </div>
    
            <!-- Verification code section -->
            <div style="margin: 20px 0;">
              <h3 style="color: #4CAF50; font-size: 20px; font-weight: 600;">Verify Your Account</h3>
              <p style="font-size: 16px; color: #555555; line-height: 1.7;">
                Please use the verification code below to confirm your email and get full access to all features on HelpWithFund.
              </p>
              <div style="background-color: #f0f4f0; padding: 10px 20px; border: 1px solid #4CAF50; border-radius: 5px; width: fit-content; margin-top: 10px;">
                <strong style="font-size: 18px; color: #333;">${verificationCode}</strong>
              </div>
            </div>
    
            <!-- Additional links and CTA -->
            <div style="margin-top: 30px;">
              <p style="font-size: 16px; color: #555555; line-height: 1.7;">
                You can view and manage all your campaigns by visiting your dashboard:
              </p>
              <a href="${appUrl}/campaigns" style="background-color: #4CAF50; color: #ffffff; padding: 12px 25px; border-radius: 5px; text-decoration: none; font-size: 16px; display: inline-block; margin-top: 15px;">My Campaigns</a>
            </div>
    
            <!-- Footer section -->
            <div style="border-top: 1px solid #dedede; margin-top: 40px; padding-top: 20px; text-align: center;">
              <p style="font-size: 14px; color: #888888;">
                Need help? <a href="${appUrl}/support" style="color: #4CAF50;">Contact Support</a>
              </p>
              <p style="font-size: 14px; color: #888888;">
                Thank you for being a part of HelpWithFund. Together, we can create lasting change!
              </p>
            </div>
          </div>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Welcome email sent: %s", info.messageId);

    // Send the token as a response
    res.status(200).json(token);
  } catch (error) {
    res
      .status(400)
      .send(error?.message || "Registration failed, please try again.");
    console.error(error);
  }
});

// server login handle
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UsersModel.login(email, password);

    //create a token
    const token = createToken(user._id);

    res.status(200).send(token);
  } catch (error) {
    res.status(400).send(error?.message);
  }
});

// Forgot Password Route
router.post("/recover-password/:email", async (req, res) => {
  const { email } = req.params;

  try {
    // Find the user by email
    const user = await UsersModel.findOne({ email });

    if (!user) {
      throw Error("User not found");
    }

    // Generate a token
    const token = uuidv4().slice(0, 10).toString("hex");
    user.resetPasswordToken = token;

    await user.save();

    // Send the email with the password
    const mailOptions = {
      from: fromMail,
      to: user.email,
      subject: "HelpWithFund Password Reset",
      html: `<p>You are receiving this because you (or someone else) have requested the reset of the password for your account.
        Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it:
        <br/>${appUrl}/reset-password/${token}
        <br/>If you did not request this, please ignore this email and your password will remain unchanged.<p/>`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Welcome email sent: %s", info.messageId);

    res.status(200).send("Email sent successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
});

// Password reset endpoint
router.post("/reset-password/:token", async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    // Find the user by ID
    const user = await UsersModel.findOne({ resetPasswordToken: token });

    if (!user) {
      throw Error("User not found");
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    // Update the user's password
    user.password = hash;
    await user.save();

    res.status(200).send("Password reset successful");
  } catch (error) {
    console.error(error);
    res.status(400).send("Invalid or expired token");
  }
});

module.exports = router;
