import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  secure: false,
  auth: {
    user: "helpinghandssource@gmail.com",
    pass: "urad ifhe lbcs gvuf",
  },
});

export default transporter;
