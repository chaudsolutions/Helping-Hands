const express = require("express");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const https = require("https");

const CampaignModel = require("../Models/Campaign.js");
const UsersModel = require("../Models/Users.js");
const transporter = require("../Modules/nodemailer.js");

// paystack env
const paystackKey = process.env.PAYSTACK_SECRET_KEY;

const appUrl = "https://HelpWithFund.com";
const fromMail = `HelpWithFund <noreply@HelpWithFund.com>`;
const replyToMail = `noreply@HelpWithFund.com`;

const router = express.Router();

// endpoint to verify stripe payments
router.post("/stripe/create-checkout-session", async (req, res) => {
  const { amount, currency, email, paymentType, url, id, anonymousDonor } =
    req.body;

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
      metadata: { id, anonymous: anonymousDonor },
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
    anonymous,
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
          anonymous,
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

        // send mail
        const mailOptions = {
          from: fromMail,
          to: email,
          subject: "Donation Received Successfully",
          html: `
            <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; background-color: #f9f9f9; padding: 20px;">
              <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);">
                
                <!-- Hero Section with Campaign Image -->
                <div style="width: 100%; height: 200px; background-image: url('${
                  campaign.image
                }'); background-size: cover; background-position: center;"></div>
        
                <!-- Content Section -->
                <div style="padding: 20px;">
                  <h2 style="color: rgb(103, 141, 57);">Thank You for Your Donation!</h2>
                  <p>Dear ${anonymous ? "Valued Donor" : name},</p>
                  <p>We are deeply grateful for your generous donation of <strong>$${amountToDonate}</strong> to our campaign <strong>"${
            campaign.campaignName
          }"</strong>.</p>
                  
                  <p>Your contribution helps us get closer to our goal of <strong>$${
                    campaign.amount
                  }</strong>. So far, we've raised <strong>$${
            campaign.amountRaised
          }</strong>, and your support means the world to us.</p>
        
                  <h3 style="color: rgb(103, 141, 57);">Donation Details:</h3>
                  <ul style="list-style-type: none; padding: 0;">
                    <li><strong>Donation Amount:</strong> $${amountToDonate}</li>
                    <li><strong>Payment Method:</strong> ${paymentMethod}</li>
                    <li><strong>Transaction ID:</strong> ${paymentId}</li>
                  </ul>
        
                  <p style="margin-top: 20px;">If you have any questions or need a receipt for your records, please feel free to reach out to us.</p>
                  
                  <p>Thank you once again for your kindness and support!</p>
        
                  <p style="font-weight: bold;">Warm regards,<br/>
                  The HelpWithFund Team</p>
                </div>
        
                <!-- Footer Section -->
                <div style="background-color: rgb(103, 141, 57); color: white; text-align: center; padding: 10px; border-radius: 0 0 8px 8px;">
                  <p style="margin: 0;">HelpWithFund &copy; ${new Date().getFullYear()}</p>
                  <p style="margin: 0;">We appreciate your support!</p>
                </div>
              </div>
            </div>
          `,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Welcome email sent: %s", info.messageId);

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
              <p style="color: #e0f7e7; font-size: 16px; margin: 5px 0;">You've just received a payment via HelpWithFund!</p>
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
                  HelpWithFund has applied a platform fee of 5%.
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
                  Thank you for using HelpWithFund. Together, we can make a positive impact!
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
