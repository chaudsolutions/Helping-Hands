const express = require("express");
const { v4: uuidv4 } = require("uuid");
const UsersModel = require("../Models/Users");
const transporter = require("../Modules/nodemailer");

const router = express.Router();

const appUrl = "https://helpwithfund.com";
const fromMail = `HelpWithFund <support@helpwithfund.com>`;
const replyToMail = `noreply@helpwithfund.com`;

// route to create request funds link
router.put("/request-funds/:requestAmount", async (req, res) => {
  const { requestAmount } = req.params;
  const userId = req.userId;
  try {
    // find user
    const user = await UsersModel.findById(userId);
    if (!user) {
      throw Error("User not found");
    }

    // create the request amount link with user id and uuid
    const link = uuidv4().slice(0, 10);

    user.requests.push({ link, requestAmount });

    await user.save();

    res.status(200).send({ requestFundsLink: `${userId}/${link}` });
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

// route to delete request funds link
router.delete("/delete-link/:requestId", async (req, res) => {
  const { requestId } = req.params;
  const userId = req.userId;

  try {
    // find user
    const user = await UsersModel.findById(userId);
    if (!user) {
      throw Error("User not found");
    }

    // Find the index of the request to be removed
    const requestIndex = user.requests.findIndex(
      (request) => request._id.toString() === requestId
    );

    if (requestIndex === -1) {
      throw Error("Request not found");
    }

    // Remove the request from the user's requests
    user.requests.splice(requestIndex, 1);

    // Save the updated user document
    await user.save();

    res.status(200).send("Request link deleted successfully");
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

// route to add bank details to user account
router.put("/add-bank", async (req, res) => {
  const { bankName, accountNumber, message } = req.body;
  const userId = req.userId;

  try {
    // find user
    const user = await UsersModel.findById(userId);
    if (!user) {
      throw Error("User not found");
    }

    // add bank details to user's account
    user.bank = { bankName, accountNumber, message };

    // save the updated user document
    await user.save();

    res.status(200).json("Bank details added successfully");
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

// endpoint to request withdrawal
router.put("/request-withdrawal/:amountToWithdraw", async (req, res) => {
  const { amountToWithdraw } = req.params;
  const userId = req.userId;

  try {
    // find user
    const user = await UsersModel.findById(userId);
    if (!user) {
      throw Error("User not found");
    }

    // check if user has bank details
    if (!user.bank) {
      throw new Error("Update bank details to request withdrawals");
    }

    // check if user has sufficient funds
    if (user.balance < amountToWithdraw) {
      throw Error("Insufficient funds");
    }

    // check if user has completed KYC
    if (!user.KYC) {
      // send KYC mail and response to frontend
      const mailOptions = {
        from: fromMail,
        replyTo: replyToMail,
        to: user.email, // the user's email
        subject: `HelpWithFund: Complete Your KYC to Proceed with Withdrawal`,
        html: `
          <div style="background-color: #f5f5f5; padding: 20px; font-family: 'Arial', sans-serif; color: #333;">
            <!-- Header Section -->
            <div style="background-color: rgb(103, 141, 57); padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: #ffffff; font-weight: bold; font-size: 28px; margin: 0;">Action Required: Complete Your KYC</h1>
              <p style="color: #e0f7e7; font-size: 16px; margin: 5px 0;">Verify your identity to unlock withdrawals</p>
            </div>
      
            <!-- Main Content Area -->
            <div style="background-color: #ffffff; padding: 30px; border: 1px solid #dedede; border-radius: 0 0 10px 10px;">
              <h2 style="color: #333333; font-size: 22px; font-weight: 600;">Dear ${user.name},</h2>
              <p style="font-size: 16px; color: #555555; line-height: 1.7;">
                We noticed you attempted a withdrawal from your HelpWithFund account. To proceed, please complete the KYC (Know Your Customer) verification process, which ensures the security of your transactions.
              </p>
      
              <!-- KYC Details -->
              <h3 style="color: rgb(103, 141, 57); font-size: 20px; font-weight: 600;">KYC Verification Process</h3>
              <p style="font-size: 16px; color: #555555; line-height: 1.7;">
                To verify your identity, please email a copy of a valid government-issued ID to our KYC team at 
                <a href="mailto:support@helpwithfund.com" style="color: rgb(103, 141, 57); font-weight: 600;">support@helpwithfund.com</a>. Our team will review your documentation and notify you once your account is fully verified.
              </p>
      
              <!-- Reminder and CTA -->
              <div style="margin: 20px 0;">
                <p style="font-size: 16px; color: #555555; line-height: 1.7;">
                  Completing KYC is a one-time process, and once verified, you will have full access to withdrawal services.
                </p>
                <a href="${appUrl}/profile" style="background-color: rgb(103, 141, 57); color: #ffffff; padding: 12px 25px; border-radius: 5px; text-decoration: none; font-size: 16px; display: inline-block; margin-top: 15px;">Go to Profile</a>
              </div>
      
              <!-- Footer Section -->
              <div style="border-top: 1px solid #dedede; margin-top: 40px; padding-top: 20px; text-align: center;">
                <p style="font-size: 14px; color: #888888;">
                  Need help? <a href="${appUrl}/help-center" style="color: rgb(103, 141, 57);">Contact Support</a>
                </p>
                <p style="font-size: 14px; color: #888888;">
                  Thank you for being a part of HelpWithFund.
                </p>
              </div>
            </div>
          </div>
        `,
      };

      const info = await transporter.sendMail(mailOptions);
      console.log("Welcome email sent: %s", info.messageId);

      return res.status(200).json("Complete Your KYC to proceed");
    }

    // deduct withdrawal amount from user's balance
    user.balance -= amountToWithdraw;

    // add withdrawal request to user's withdrawal requests
    user.withdrawals.push({ amountToWithdraw });

    // save the updated user document
    await user.save();

    res.status(200).json("Withdrawal request submitted successfully");
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
});

module.exports = router;
