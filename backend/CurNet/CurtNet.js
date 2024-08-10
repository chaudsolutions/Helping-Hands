const express = require("express");

const router = express.Router();

const transporter = require("./curtNetMailer");

// route to send mail to admin mail
router.post("/contact-message", async (req, res) => {
  // extract data from request body
  const { user_name, user_email, phone, subject, message } = req.body;

  try {
    const mailOptions = {
      from: user_email,
      replyTo: user_email,
      to: "admin@coinsafecrypto.com",
      subject: `Curt Net Website - ${subject}`,
      html: `
        <h1>New Message from ${user_name}</h1>
  
        <div>${message}</div>
        <br /> phone: ${phone}
        `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        return res.status(500).send("Error sending email.");
      }
      console.log("Welcome email sent: %s", info.messageId);
    });

    res.status(200).send("Message sent successfully");
  } catch (error) {
    res.status(500).send("Error sending email");
  }
});

module.exports = router;
