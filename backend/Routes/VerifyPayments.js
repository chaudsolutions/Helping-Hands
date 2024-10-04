const express = require("express");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
// const stripe = require("stripe")(
//   "sk_test_51PuQmI048oKJvEHnpLSTer83YncIkvJFdV4uK9ZqYPkGfxAoSFQDwB0zr04wKq0Pz0F1o279wQYGdpbrRVXIWDgi003qnLIkSe"
// );
const https = require("https");

const CampaignModel = require("../Models/Campaign.js");
const UsersModel = require("../Models/Users.js");
const transporter = require("../Modules/nodemailer.js");

// paystack env
const paystackKey = process.env.PAYSTACK_SECRET_KEY;

const appUrl = "https://helpinghands.com";
const fromMail = `HelpingHands <noreply@helpinghands.com>`;
const replyToMail = `noreply@helpinghands.com`;

const router = express.Router();

// endpoint to verify stripe payments
router.post("/stripe/create-checkout-session", async (req, res) => {
  const { amount, currency, email, paymentType, url, id } = req.body;
  try {
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: currency,
            product_data: {
              name: paymentType,
            },
            unit_amount: amount * 100, // amount in cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      customer_email: email,
      success_url: `${url}/success/${paymentType}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${url}/failed`,
      metadata: { id },
    });

    res.json({ id: session.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.error(error);
  }
});

router.post("/verify-stripe", async (req, res) => {
  const { sessionId } = req.body;

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    res.json(session);
  } catch (error) {
    res.status(500).send({ error: error.message });
    console.error(error);
  }
});

// Verify Paystack payments
router.post("/verify-paystack/reference", async (req, res) => {
  try {
    const { reference } = req.body; // Extracting reference from query params

    const options = {
      hostname: "api.paystack.co",
      port: 443,
      path: `/transaction/verify/${reference}`, // Correct path format
      method: "GET",
      headers: {
        Authorization: `Bearer ${paystackKey}`, // Replace with your Paystack secret key
      },
    };

    const paystackReq = https.request(options, (paystackRes) => {
      let data = "";

      paystackRes.on("data", (chunk) => {
        data += chunk;
      });

      paystackRes.on("end", () => {
        const responseData = JSON.parse(data);
        res.send(responseData);
      });
    });

    paystackReq.on("error", (error) => {
      console.error(error);
      res.status(500).send("Failed to verify payment");
    });

    paystackReq.end(); // Don't forget to end the request
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});

// end-point to update campaign after successful payment
router.put("/donate/:campaignId", async (req, res) => {
  const { campaignId } = req.params;
  const { donateData } = req.body;

  const {
    email,
    name,
    customerPaymentId,
    paymentMethod,
    amountReceivedViaPaymentMethod,
    paymentId,
    currency,
    amountToDonate,
  } = donateData;

  try {
    // Find the user containing the campaign
    const userCampaignDoc = await CampaignModel.find({});

    let campaignFound = false;

    for (const user of userCampaignDoc) {
      // Iterate through each user's campaigns to find the matching campaign
      const campaign = user.campaigns.find(
        (campaign) => campaign._id.toString() === campaignId
      );

      if (campaign) {
        // Update campaign details
        // Ensure campaign.amountRaised is initialized and a valid number
        const currentAmountRaised = campaign.amountRaised || 0;

        // Update campaign details
        campaign.amountRaised = currentAmountRaised + amountToDonate;

        // Update campaign condition based on amount raised
        if (campaign.amountRaised >= campaign.amount) {
          campaign.condition = "completed";
        } else {
          campaign.condition = "in-progress";
        }

        // Add the donor to the campaign's donors list
        campaign.donors.push({
          email,
          name,
          customerPaymentId,
          amountReceivedViaPaymentMethod,
          amountUSD: amountToDonate,
          currency,
          paymentId,
          paymentMethod,
        });

        // Save the updated user document
        await user.save();

        campaignFound = true;
        res.status(200).json("Donation added successfully");
        break;
      }
    }

    if (!campaignFound) {
      throw Error("Campaign not found");
    }
  } catch (error) {
    console.error(error);
    res.status(500).json("Internal Server Error");
  }
});

// endpoint to update one to one payment receiver
router.put(
  "/pay-request/:requestUserId/:requestFundsLink",
  async (req, res) => {
    const { requestUserId, requestFundsLink } = req.params;

    const { paymentRequestData } = req.body;
    const {
      email,
      name,
      customerPaymentId,
      paymentMethod,
      amountReceivedViaPaymentMethod,
      paymentId,
      currency,
      amountToDonate,
    } = paymentRequestData;

    try {
      // find user
      const user = await UsersModel.findById(requestUserId);
      if (!user) {
        throw Error("User not found.");
      }
      // find admin
      const adminUser = await UsersModel.findOne({ role: "admin" });

      // find the payment request
      const paymentRequest = user.requests.find(
        (request) => request.link === requestFundsLink
      );
      if (!paymentRequest) {
        throw Error("Payment request not found.");
      }

      paymentRequest.paymentDetails = {
        email,
        name,
        customerPaymentId,
        paymentMethod,
        amountReceivedViaPaymentMethod,
        paymentId,
        currency,
        amountToDonate,
      };

      // add 5% to admin Earnings
      adminUser.adminOneToOnePaymentPercentage += amountToDonate * 0.1;

      // add 90% campaign earnings to user balance
      // update user balance after successful payment
      user.balance += amountToDonate * 0.8;

      // send a mail to Recipient
      const mailOptions = {
        from: fromMail,
        replyTo: replyToMail,
        to: user.email, // the user's email
        subject: `You've Received a Payment! 🎉`,
        html: `
          <div style="background-color: #f5f5f5; padding: 20px; font-family: Arial, sans-serif; color: #333;">
            <!-- Header section -->
            <div style="background-color: #4CAF50; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: #ffffff; font-weight: bold; font-size: 28px; margin: 0;">Payment Received</h1>
              <p style="color: #e0f7e7; font-size: 16px; margin: 5px 0;">You've just received a payment via HelpingHands!</p>
            </div>
      
            <!-- Main content area -->
            <div style="background-color: #ffffff; padding: 30px; border: 1px solid #dedede; border-radius: 0 0 10px 10px;">
              <h2 style="color: #333333; font-size: 22px; font-weight: 600;">Hi ${
                user.name
              },</h2>
              <p style="font-size: 16px; color: #555555; line-height: 1.7;">
                We are happy to inform you that you’ve received a one-to-one payment from your client, <strong>${name}</strong>.
              </p>
      
              <!-- Payment details -->
              <div style="margin: 20px 0;">
                <h3 style="color: #4CAF50; font-size: 20px; font-weight: 600;">Payment Details</h3>
                <ul style="font-size: 16px; color: #555555; list-style: none; padding-left: 0;">
                  <li><strong>Payment Method:</strong> ${paymentMethod}</li>
                  <li><strong>Amount Received:</strong> ${amountToDonate} USD</li>
                  <li><strong>Payment ID:</strong> ${paymentId}</li>
                </ul>
              </div>
      
              <!-- Earnings breakdown -->
              <div style="margin: 20px 0;">
                <h3 style="color: #4CAF50; font-size: 20px; font-weight: 600;">Earnings Breakdown</h3>
                <p style="font-size: 16px; color: #555555; line-height: 1.7;">
                  The total amount received is <strong>${amountToDonate} USD</strong>. 
                  HelpingHands has applied a platform fee of 5%.
                </p>
                <p style="font-size: 16px; color: #555555; line-height: 1.7;">
                  After the platform fee deduction, your credited earnings are:
                </p>
                <ul style="font-size: 16px; color: #555555; list-style: none; padding-left: 0;">
                  <li><strong>Net Earnings:</strong> ${(
                    amountToDonate * 0.8
                  ).toFixed(2)} USD</li>
                </ul>
              </div>
      
              <!-- Call to Action -->
              <div style="margin-top: 30px; text-align: center;">
                <a href="${appUrl}/profile" style="background-color: #4CAF50; color: #ffffff; padding: 12px 25px; border-radius: 5px; text-decoration: none; font-size: 16px; display: inline-block;">View Transaction</a>
              </div>
      
              <!-- Footer section -->
              <div style="border-top: 1px solid #dedede; margin-top: 40px; padding-top: 20px; text-align: center;">
                <p style="font-size: 14px; color: #888888;">
                  Need help? <a href="${appUrl}/help-center" style="color: #4CAF50;">Contact Support</a>
                </p>
                <p style="font-size: 14px; color: #888888;">
                  Thank you for using HelpingHands. Together, we can make a positive impact!
                </p>
              </div>
            </div>
          </div>
        `,
      };

      const info = await transporter.sendMail(mailOptions);
      console.log("Welcome email sent: %s", info.messageId);

      await user.save();
      await adminUser.save();

      res.status(200).json("Recipient has been credited successfully");
    } catch (error) {
      console.error(error);
      res.status(500).json("Internal Server Error");
    }
  }
);

module.exports = router;
