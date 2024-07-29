import express from "express";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

import transporter from "../Modules/nodemailer.js";
import UsersModel from "../Models/Users.js";
import CampaignModel from "../Models/Campaign.js";

const router = express.Router();
const secretKey = process.env.SECRET;

// jwt token
const createToken = (_id) => {
  return jwt.sign({ _id }, secretKey, { expiresIn: "7d" });
};

const appUrl = "https://helpinghands.com";
const fromMail = `HelpingHands <noreply@helpinghands.com>`;
const replyToMail = `noreply@helpinghands.com`;

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
    const message = `
      Welcome <span style="font-weight: bold">${name}</span>. Thanks for joining HelpingHands! Your account has been created successfully. You can now start your fundraising campaigns, support others, and explore a variety of causes.
      <br/>
      Your first campaign, <span style="font-weight: bold">${campaignName}</span>, is live now! Check it out: 
      <a href="${appUrl}/campaign/${campaign._id}" style="color: #4CAF50;">View Campaign</a>
      <br/>
      View all your campaigns here: <a href="${appUrl}/campaigns" style="color: #4CAF50;">My Campaigns</a>
      <br/>
      Here is your verification code: <strong>${verificationCode}</strong>
      <br/>
      Visit our platform to get started: <a href="${appUrl}" style="color: #4CAF50;">${appUrl}</a>
    `;

    const mailOptions = {
      from: fromMail,
      replyTo: replyToMail,
      to: email, // the user's email
      subject: `Welcome to HelpingHands! Your account is ready`,
      html: `
        <div style="background-color: #f2f4f7; padding: 20px; border: 1px solid #ddd; border-radius: 10px; font-family: Arial, sans-serif; color: #333;">
          <h1 style="color: rgb(188, 255, 107); font-weight: bold; font-size: 24px; margin-bottom: 10px;">Welcome to HelpingHands</h1>
          <div style="margin-bottom: 20px;">
            <h4 style="color: #555; font-size: 18px; margin-bottom: 10px;">Hi ${name},</h4>
            <p style="color: #555; font-size: 16px; line-height: 1.5;">${message}</p>
          </div>
          <div style="text-align: center; margin-top: 20px;">
            <a href="${appUrl}/profile" style="background-color: rgb(188, 255, 107); color: #fff; padding: 10px 20px; border: none; border-radius: 5px; text-decoration: none; font-size: 16px;">Get Started</a>
          </div>
          <div style="margin-top: 30px; text-align: center;">
            <p style="color: #999; font-size: 14px;">Thank you for being a part of HelpingHands. Together, we can make a difference!</p>
          </div>
        </div>
      `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        return res.status(500).send("Error sending welcome email.");
      }
      console.log("Welcome email sent: %s", info.messageId);
    });

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

export default router;
