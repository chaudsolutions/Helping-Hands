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
    const link = uuidv4().slice(0, 10);

    user.requests.push({ link, requestAmount });

    await user.save();

    res.status(200).send({ requestFundsLink: `${userId}/${link}` });
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

// route to delete request funds link
router.delete("/delete-link/:requestId", async (req, res) => {
  const { requestId } = req.params;
  const userId = req.userId;

  try {
    // find user
    const user = await UsersModel.findById(userId);
    if (!user) {
      throw Error("User not found");
    }

    // Find the index of the request to be removed
    const requestIndex = user.requests.findIndex(
      (request) => request._id.toString() === requestId
    );

    if (requestIndex === -1) {
      throw Error("Request not found");
    }

    // Remove the request from the user's requests
    user.requests.splice(requestIndex, 1);

    // Save the updated user document
    await user.save();

    res.status(200).send("Request link deleted successfully");
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

// route to add bank details to user account
router.put("/add-bank", async (req, res) => {
  const { bankName, accountNumber, message } = req.body;
  const userId = req.userId;

  try {
    // find user
    const user = await UsersModel.findById(userId);
    if (!user) {
      throw Error("User not found");
    }

    // add bank details to user's account
    user.bank = { bankName, accountNumber, message };

    // save the updated user document
    await user.save();

    res.status(200).json("Bank details added successfully");
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

// endpoint to request withdrawal
router.put("/request-withdrawal/:amountToWithdraw", async (req, res) => {
  const { amountToWithdraw } = req.params;
  const userId = req.userId;

  try {
    // find user
    const user = await UsersModel.findById(userId);
    if (!user) {
      throw Error("User not found");
    }

    // check if user has bank details
    if (!user.bank) {
      throw new Error("Update bank details to request withdrawals");
    }

    // check if user has sufficient funds
    if (user.balance < amountToWithdraw) {
      throw Error("Insufficient funds");
    }

    // deduct withdrawal amount from user's balance
    user.balance -= amountToWithdraw;

    // add withdrawal request to user's withdrawal requests
    user.withdrawals.push({ amountToWithdraw });

    // save the updated user document
    await user.save();

    res.status(200).json("Withdrawal request submitted successfully");
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
});

module.exports = router;
