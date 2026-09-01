const express = require("express");
const router = express.Router();
const aiService = require("../services/ai");

let premiumUnlocked = false;

router.get("/", (req, res) => {
  const analysis = aiService.getBasicAnalysis();
  res.status(200).json(analysis);
});

router.get("/premium", (req, res) => {
  if (!premiumUnlocked) {
    return res.status(402).json({
      error: "Payment Required",
      amount: "0.10",
      currency: "ALGO",
      network: "Algorand Testnet",
      protocol: "x402"
    });
  }

  const analysis = aiService.getPremiumAnalysis();
  res.status(200).json(analysis);
});

router.post("/unlock-premium", (req, res) => {
  premiumUnlocked = true;
  res.status(200).json({ premiumUnlocked: true });
});

module.exports = router;
