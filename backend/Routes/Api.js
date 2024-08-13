const express = require("express");
const CampaignModel = require("../Models/Campaign");

const router = express.Router();

// Route to trigger expiration of campaigns
router.put("/expired-campaign/:campaignId", async (req, res) => {
  const { campaignId } = req.params;

  try {
    // Fetch all user documents with campaigns
    const usersCampaignDoc = await CampaignModel.find();

    // Iterate over each user document
    for (const userDoc of usersCampaignDoc) {
      // Find the campaign within the user's campaigns array
      const campaign = userDoc.campaigns.find(
        (campaign) => campaign._id.toString() === campaignId
      );

      if (campaign) {
        // Confirm if the campaign has really expired
        const currentDate = new Date();
        const campaignEndDate = new Date(campaign.endDate); // Assuming campaigns have an endDate field

        if (currentDate > campaignEndDate) {
          // Update the campaign status to expired
          campaign.status = "expired";

          // Save the updated user document
          await userDoc.save();

          res.status(200).json("Campaign expired successfully");
          return; // Exit the loop once the campaign is found and updated
        } else {
          res.status(400).json("Campaign has not expired yet");
          return;
        }
      }
    }

    // If no campaign was found
    res.status(404).json("Campaign not found");
  } catch (error) {
    console.error(error);
    res.status(500).json("Internal Server Error");
  }
});

module.exports = router;
