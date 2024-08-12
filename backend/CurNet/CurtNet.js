const express = require("express");
const transporter = require("../Modules/nodemailer");

const router = express.Router();

// route to send mail to admin mail
router.post("/contact-message", async (req, res) => {
  // extract data from request body
  const { user_name, user_email, phone, subject, message } = req.body;

  try {
    const mailOptions = {
      from: user_email,
      replyTo: user_email,
      to: "davidodion898@gmail.com",
      subject: `Curt Net Website - ${subject}`,
      html: `
          <h1>New Message from ${user_name}</h1>
          <div>${message}</div>
          <br /> phone: ${phone}
        `,
    };

    // Use await to ensure the email is sent before continuing
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: %s", info.messageId);

    res.status(200).json("Message sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json("Error sending email");
  }
});

module.exports = router;
