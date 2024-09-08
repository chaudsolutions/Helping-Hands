const express = require("express");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const CampaignModel = require("../Models/Campaign.js");
const UsersModel = require("../Models/Users.js");

const router = express.Router();

// endpoint to verify payments
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
            unit_amount: amount * 100, // Stripe accepts the amount in cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      customer_email: email,
      success_url: `${url}/success/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${url}/failed`,
      metadata: { id },
    });

    res.json({ id: session.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.error(error);
  }
});

// Route to verify payment session
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
