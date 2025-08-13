const express = require("express");
const router = express.Router();
const loyaltyController = require("../controllers/loyaltyController");

router.get("/points/:clientId", loyaltyController.getClientPoints);
router.post("/points/add", loyaltyController.addPoints);
router.post("/points/redeem", loyaltyController.redeemPoints);

router.get("/rewards", loyaltyController.listRewards);
router.post("/rewards", loyaltyController.createReward);
router.get("/rewards/:id", loyaltyController.getRewardById);
router.put("/rewards/:id", loyaltyController.updateReward);
router.delete("/rewards/:id", loyaltyController.deleteReward);

router.get("/history/:clientId", loyaltyController.getHistory);

module.exports = router;
