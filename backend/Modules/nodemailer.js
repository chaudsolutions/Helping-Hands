const nodemailer = require("nodemailer");

// nodemailer for sending mails

const transporter = nodemailer.createTransport({
  service: "gmail",
  secure: false,
  auth: {
    user: "helpinghandssource@gmail.com",
    pass: "urad ifhe lbcs gvuf",
  },
});

module.exports = transporter;
