import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";

const Schema = mongoose.Schema;

const UsersSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "user"], default: "user" },
    active: { type: Boolean, default: false },
    profilePicture: { type: String },
    address: {
      streetName: { type: String },
      city: { type: String },
      state: { type: String },
      country: { type: String },
      phoneNumber: { type: String },
    },
    verificationCode: { type: String, required: true },
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
  active
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
export default UsersModel;
