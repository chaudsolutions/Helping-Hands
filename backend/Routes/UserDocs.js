const express = require("express");
const { v4: uuidv4 } = require("uuid");
//images store path
const multer = require("multer");
const cloudinary = require("cloudinary").v2;

const UsersModel = require("../Models/Users.js");
const CampaignModel = require("../Models/Campaign.js");

const router = express.Router();

// cloudinary configurations
const cloud_name = process.env.cloudinaryName;
const api_key = process.env.cloudinaryApiKey;
const api_secret = process.env.cloudinaryApiSecret;

// cloudinary config
cloudinary.config({
  cloud_name,
  api_key,
  api_secret,
});

// Configure multer for file upload
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Promisify the upload_stream function
const uploadToCloudinary = (buffer, originalName) => {
  return new Promise((resolve, reject) => {
    const uniqueName = `${uuidv4()}-${originalName}`;
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "Helping-Hands",
        public_id: uniqueName,
        format: "png", // Convert to PNG format
        transformation: [
          { width: 500, crop: "scale" },
          { quality: "auto:best" },
          { fetch_format: "auto" },
        ],
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve(result);
      }
    );
    stream.end(buffer);
  });
};

// endpoint to fetch user data from DB
router.get("/userObj", async (req, res) => {
  const userId = req.userId;

  try {
    // find user
    const user = await UsersModel.findById(userId);

    if (!user) {
      throw Error("User not found.");
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).send("Internal server error.");
  }
});

// endpoint to fetch user Campaign doc from DB
router.get("/campaigns", async (req, res) => {
  const userId = req.userId;

  try {
    // Retrieve the user's role from the database using the decoded user ID
    const campaignDoc = await CampaignModel.findOne({ creatorId: userId });

    if (!campaignDoc) {
      throw Error("User Campaign Doc not found.");
    }

    res.status(200).json(campaignDoc);
  } catch (error) {
    res.status(500).send("Internal server error.");
  }
});

// endpoint to verify user mail
router.put("/verify-token/:code", async (req, res) => {
  const userId = req.userId;
  const { code } = req.params;

  try {
    // find user
    const user = await UsersModel.findById(userId);

    if (!user) {
      throw Error("User not found.");
    }

    // verify email token
    const userToken = user.verificationCode;

    // match token
    const matchToken = userToken === code;

    if (!matchToken) {
      throw Error("Verification code is incorrect.");
    }

    // update account to active if tokens match
    if (matchToken) {
      user.active = true;
    }

    await user.save();

    res.status(200).json("Email verified successfully.");
  } catch (error) {
    res.status(500).send("Internal server error.");
    console.log(error);
  }
});

// POST endpoint to create a new campaign
router.post("/new-campaign", upload.array("images"), async (req, res) => {
  const userId = req.userId;
  const { campaignName, category, amount, description } = req.body;
  const images = req.files;

  try {
    // Check if files are uploaded
    if (!images || images.length === 0) {
      throw Error("No images uploaded");
    }

    // find user
    const user = await UsersModel.findById(userId);

    // find user campaigns
    let userCampaignDoc = await CampaignModel.findOne({ creatorId: userId });

    // Map the images to URLs or save them to a file system/cloud storage
    // Upload images to Cloudinary
    const uploadPromises = images.map((file) => {
      return uploadToCloudinary(file.buffer, file.originalName);
    });

    const uploadResults = await Promise.all(uploadPromises);
    const imageUrls = uploadResults.map((result) => result.secure_url);

    const campaign = {
      campaignName,
      category,
      amount,
      image: imageUrls[0],
      story: description,
      condition: "in-progress",
    };

    const adminRole = user.role === "admin";

    // check if user Campaign Doc exists
    if (!userCampaignDoc) {
      // create new campaign Doc
      userCampaignDoc = new CampaignModel({
        creatorId: userId,
        creator: user.name,
        creatorRole: adminRole ? "admin" : "user",
      });
      userCampaignDoc.campaigns.push(campaign);
    } else {
      // update existing campaign Doc
      userCampaignDoc.creatorRole = adminRole ? "admin" : "user";
      userCampaignDoc.campaigns.push(campaign);
    }

    await userCampaignDoc.save();

    res.status(201).json("Campaign created successfully!");
  } catch (error) {
    console.error("Error creating campaign:", error);
    res.status(500).json("Server error, please try again later");
  }
});

// endpoint to update User profile picture
router.put(
  "/profile-picture",
  upload.single("profilePicture"),
  async (req, res) => {
    const userId = req.userId;
    const profilePicture = req.file;

    try {
      // Upload profile picture to Cloudinary
      const uploadResult = await uploadToCloudinary(
        profilePicture.buffer,
        profilePicture.originalname
      );
      const imageUrl = uploadResult.secure_url;

      // find user and update profile picture
      const user = await UsersModel.findByIdAndUpdate(
        userId,
        { profilePicture: imageUrl },
        { new: true }
      );

      if (!user) {
        throw Error("User not found.");
      }

      res.status(200).json("Profile pic updated successfully");
    } catch (error) {
      res.status(500).send("Internal server error.");
      console.log(error);
    }
  }
);

// route to delete campaign
router.delete("/delete-campaign/:campaignId", async (req, res) => {
  const userId = req.userId;
  const { campaignId } = req.params;

  try {
    // find user
    const user = await UsersModel.findById(userId);

    if (!user) {
      throw new Error("User not found.");
    }

    // Fetch all user documents with campaigns
    const usersCampaignDoc = await CampaignModel.find();

    // Iterate over each user document
    for (const userDoc of usersCampaignDoc) {
      // Find the campaign within the user's campaigns array
      const campaign = userDoc.campaigns.find(
        (campaign) => campaign._id.toString() === campaignId
      );

      // check if admin or creator of campaign
      const ifAdmin =
        user.role === "admin" ||
        user._id.toString() === campaign.creatorId.toString();

      if (!ifAdmin) {
        throw new Error("Only admins or creator can delete campaigns.");
      }

      if (campaign) {
        // check if campaign has donors
        if (campaign.donors && campaign.donors.length > 0) {
          throw new Error("Campaign has donors, cannot delete.");
        }

        // delete image from cloudinary
        const imageUrl = campaign.image;
        const publicId = imageUrl.split("/").slice(-2).join("/").split(".")[0];
        await cloudinary.uploader.destroy(publicId);

        //  delete the campaign within the user's campaigns array
        userDoc.campaigns = userDoc.campaigns.filter(
          (c) => c._id.toString() !== campaignId
        );

        await userDoc.save();
        break; // Stop iterating once the campaign is found
      }
    }

    res.status(200).json("Campaign deleted successfully");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
