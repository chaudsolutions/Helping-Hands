const express = require("express");
const { v4: uuidv4 } = require("uuid");
const UsersModel = require("../Models/Users");

const router = express.Router();

// route to create request funds link
router.put("/request-funds/:requestAmount", async (req, res) => {
  const { requestAmount } = req.params;
  const userId = req.userId;
  try {
    // find user
    const user = await UsersModel.findById(userId);
    if (!user) {
      throw Error("User not found");
    }

    // create the request amount link with user id and uuid
    const link = `${uuidv4()}`;

    user.requests.push({ link, requestAmount });

    await user.save();

    res.status(200).send({ requestFundsLink: `${userId}/${link}` });
  } catch (error) {
    console.error(error);
    res.status(404).send("Internal Server Error");
  }
});

module.exports = router;
