const nodemailer = require("nodemailer");

// mail sender

const transporter = nodemailer.createTransport({
  service: "gmail",
  secure: false,
  auth: {
    user: "helpinghandssource@gmail.com",
    pass: "urad ifhe lbcs gvuf",
  },
});

module.exports = transporter;
