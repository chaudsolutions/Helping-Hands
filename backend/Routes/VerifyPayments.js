const express = require("express");
const https = require("https");
// flutterwave
const Flutterwave = require("flutterwave-node-v3");
const CampaignModel = require("../Models/Campaign.js");
const UsersModel = require("../Models/Users.js");

const router = express.Router();

// paystack env
const paystackKey = process.env.PAYSTACK_SECRET_KEY;
// flutterwave envs
const flw = new Flutterwave(
  process.env.FLW_PUBLIC_KEY,
  process.env.FLW_SECRET_KEY
);

// endpoint to verify payments
// Verify Paystack payments
router.post("/paystack", async (req, res) => {
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

// verify flutterWave payments
router.post("/flutterwave", async (req, res) => {
  const { transactionId, expectedAmount, expectedCurrency } = req.body;

  try {
    const response = await flw.Transaction.verify({ id: transactionId });

    if (
      response.data.status === "successful" &&
      response.data.amount === expectedAmount &&
      response.data.currency === expectedCurrency
    ) {
      // Success! Confirm the customer's payment
      res.status(200).send("Payment verified successfully");
    } else {
      // Inform the customer their payment was unsuccessful
      res.status(400).send("Payment verification failed");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while verifying the payment");
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

      // update user balance after successful payment
      user.balance += amountToDonate;

      await user.save();

      res.status(200).json("Recipient has been credited successfully");
    } catch (error) {
      console.error(error);
      res.status(500).json("Internal Server Error");
    }
  }
);

module.exports = router;
