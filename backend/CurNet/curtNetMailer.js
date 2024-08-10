const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "sm1.cloudoon.com",
  port: 465,
  secure: true,
  auth: {
    user: "admin@coinsafecrypto.com",
    pass: "coinsafecrypto@ADMIN2000",
  },
});

module.exports = transporter;
