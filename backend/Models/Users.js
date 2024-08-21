const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const Schema = mongoose.Schema;

const RequestSchema = new Schema(
  {
    link: { type: String, unique: true },
    requestAmount: { type: Number },
    paymentDetails: {
      email: { type: String },
      name: { type: String },
      customerPaymentId: { type: String },
      paymentMethod: { type: String },
      amountReceivedViaPaymentMethod: { type: String },
      paymentId: { type: String },
      currency: { type: String },
      amountToDonate: { type: Number },
    },
  },
  { timestamps: true }
);

const WithdrawalSchema = new Schema(
  {
    amountToWithdraw: { type: Number },
    state: {
      type: String,
      enum: ["Pending", "Success", "Cancelled"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

const UsersSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "user"], default: "user" },
    active: { type: Boolean, default: false },
    balance: { type: Number, default: 0 },
    adminCampaignPercentage: { type: Number, default: 0 },
    adminOneToOnePaymentPercentage: { type: Number, default: 0 },
    profilePicture: { type: String },
    address: {
      streetName: { type: String },
      city: { type: String },
      state: { type: String },
      country: { type: String },
      phoneNumber: { type: String },
    },
    bank: {
      bankName: { type: String },
      accountNumber: { type: Number },
      message: { type: String },
    },
    verificationCode: { type: String, required: true },
    requests: [RequestSchema],
    withdrawals: [WithdrawalSchema],
  },
  { timestamps: true }
);

// Static sign up method and hashing password
UsersSchema.statics.signup = async function (
  email,
  name,
  password,
  verificationCode,
  country,
  role,
  active,
  balance
) {
  // validation
  if (!name || !email || !password) {
    throw Error("All Fields must be filled");
  } else if (password.length < 3) {
    throw Error("password too short");
  } else if (!validator.isEmail(email)) {
    throw Error("Not a valid Email");
  }

  const exists = await this.findOne({ email });

  if (exists) {
    throw Error("User already exists");
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const user = await this.create({
    name,
    email,
    password: hash,
    role,
    active,
    verificationCode,
    balance,
    address: {
      country,
    },
  });

  return user;
};

//static login method
UsersSchema.statics.login = async function (email, password) {
  // validation
  if (!email || !password) {
    throw Error("All Fields must be filled");
  }

  // check is user exists
  const user = await this.findOne({ email });

  if (!user) {
    throw Error("User does not exist");
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw Error("Incorrect password");
  }

  return user;
};

// Create Mongoose model
const UsersModel = mongoose.model("User", UsersSchema);
module.exports = UsersModel;
