const express = require("express");
const CampaignModel = require("../Models/Campaign.js");
const UsersModel = require("../Models/Users.js");

const router = express.Router();

// Endpoint to get active campaigns
router.get("/active-campaigns", async (req, res) => {
  try {
    // Get the current date
    const currentDate = new Date();

    // Find users with campaigns that are in-progress and not expired
    const usersCampaignDoc = await CampaignModel.find({
      "campaigns.condition": "in-progress",
      "campaigns.endDate": { $gte: currentDate },
    });

    // Extract active campaigns from usersCampaignDoc
    const activeCampaigns = [];
    usersCampaignDoc.forEach((user) => {
      user.campaigns.forEach((campaign) => {
        if (
          campaign.condition === "in-progress" &&
          new Date(campaign.endDate) >= currentDate
        ) {
          activeCampaigns.push({
            creator: user.creator,
            creatorRole: user.creatorRole,
            ...campaign.toObject(), // Convert sub document to plain object
          });
        }
      });
    });

    // Sort active campaigns by createdAt, most recent first
    activeCampaigns.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    res.status(200).json(activeCampaigns);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

// Endpoint to get a single campaign from DB
router.get("/campaign/:campaignId", async (req, res) => {
  const { campaignId } = req.params;

  try {
    // Fetch all user documents with campaigns
    const usersCampaignDoc = await CampaignModel.find();

    let foundCampaign = null;
    let userInfo = null;

    // Iterate over each user document
    for (const userDoc of usersCampaignDoc) {
      // Find the campaign within the user's campaigns array
      const campaign = userDoc.campaigns.find(
        (campaign) => campaign._id.toString() === campaignId
      );

      if (campaign) {
        foundCampaign = campaign;
        userInfo = {
          creator: userDoc.creator,
          creatorRole: userDoc.creatorRole,
          creatorId: userDoc.creatorId,
        };
        break; // Stop iterating once the campaign is found
      }
    }

    if (!foundCampaign) {
      throw Error("Campaign not found");
    }

    // Send the campaign details along with user information
    res.status(200).json({
      ...userInfo,
      ...foundCampaign.toObject(),
    });
  } catch (error) {
    res.status(500).json("Internal Server Error");
    console.error(error);
  }
});

// endpoint to fetch payment request information for the client
router.get(
  "/payment-request/:requestUserId/:requestFundsLink",
  async (req, res) => {
    const { requestUserId, requestFundsLink } = req.params;
    try {
      // find user
      const user = await UsersModel.findById(requestUserId);
      if (!user) {
        throw Error("User not found");
      }

      // find the request
      const request = user.requests.find(
        (request) => request.link === requestFundsLink
      );
      if (!request) {
        throw Error("Request not found");
      }

      res.status(200).send(request);
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  }
);

module.exports = router;
