const nodemailer = require("nodemailer");

// mailer

const transporter = nodemailer.createTransport({
  service: "gmail",
  secure: false,
  auth: {
    user: "helpinghandssource@gmail.com",
    pass: "urad ifhe lbcs gvuf",
  },
});

module.exports = transporter;
