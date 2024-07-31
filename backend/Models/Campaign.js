const mongoose = require("mongoose");

const Schema = mongoose.Schema;

// Function to calculate the end date, which is 30 days from the current date
const calculateEndDate = () => {
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + 30);
  return currentDate;
};

// Define the donor sub-schema
const DonorSchema = new Schema({
  email: { type: String },
  name: { type: String, default: "Anonymous" },
  customerPaymentId: { type: String },
  amountReceivedViaPaymentMethod: { type: Number },
  amountUSD: { type: Number },
  currency: { type: String },
  paymentId: { type: String },
  paymentMethod: { type: String },
  date: { type: Date, default: Date.now },
});

// Define the campaign sub-schema
const CampaignSchema = new Schema(
  {
    campaignName: { type: String, required: true },
    category: { type: String, required: true },
    amount: { type: Number, required: true },
    amountRaised: { type: Number, required: true, default: 0 },
    condition: {
      type: String,
      enum: ["incomplete", "in-progress", "completed"],
      required: true,
      default: "incomplete",
    },
    story: { type: String, required: true },
    endDate: { type: Date, required: true, default: calculateEndDate },
    image: { type: String },
    donors: [DonorSchema], // use the donor sub-schema
  },
  { timestamps: true }
);

const UserSchema = new Schema(
  {
    creator: { type: String, required: true },
    creatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    creatorRole: {
      type: String,
      required: true,
      enum: ["admin", "user"],
      default: "user",
    },
    campaigns: [CampaignSchema],
  },
  {
    timestamps: true,
  }
);

const CampaignModel = mongoose.model("Campaign", UserSchema);
module.exports = CampaignModel;
