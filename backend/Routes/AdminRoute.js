const express = require("express");
const UsersModel = require("../Models/Users");

const router = express.Router();

// end point to get all users for admin
router.get("/all-users", async (req, res) => {
  const userId = req.userId;
  try {
    // find user
    const user = await UsersModel.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    if (user.role !== "admin") {
      return res.status(404).json("Unauthorized");
    }

    // find all users
    const users = await UsersModel.find({}).sort({ createdAt: -1 });

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json("Internal Server Error");
    console.log(error);
  }
});

// end point for admin to approve withdrawals
router.put(
  "/approve-withdrawal/:withdrawerId/:withdrawalId",
  async (req, res) => {
    const { withdrawerId, withdrawalId } = req.params;
    const userId = req.userId;

    try {
      // find user
      const user = await UsersModel.findById(userId);
      if (!user) {
        throw new Error("User not found");
      }
      if (user.role !== "admin") {
        return res.status(404).json("Unauthorized");
      }

      // find user that made withdrawal request
      const withdrawer = await UsersModel.findById(withdrawerId);
      if (!withdrawer) {
        throw new Error("User not found");
      }

      // find the withdrawal
      const withdrawal = withdrawer.withdrawals.find(
        (withdrawal) => withdrawal._id.toString() === withdrawalId
      );
      if (!withdrawal) {
        throw new Error("Withdrawal not found");
      }

      // approve the withdrawal
      withdrawal.state = "Success";
      withdrawer.balance -= withdrawal.amountToWithdraw;

      await withdrawer.save();

      res.status(200).json("Withdrawal approved successfully");
    } catch (error) {
      res.status(500).json("Internal Server Error");
      console.error(error);
    }
  }
);

module.exports = router;
