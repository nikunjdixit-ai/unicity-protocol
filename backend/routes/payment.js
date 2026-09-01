const express = require("express");
const router = express.Router();
const x402Service = require("../services/x402");

let paymentState = "required";

router.post("/request", (req, res) => {
  const requirement = x402Service.createPaymentRequirement();
  paymentState = "processing";
  res.status(200).json(requirement);
});

router.post("/verify", (req, res) => {
  const { transactionId } = req.body;

  if (!transactionId) {
    return res.status(400).json({ error: "Transaction ID is required" });
  }

  const result = x402Service.verifyPayment({ transactionId });

  if (!result.success) {
    paymentState = "failed";
    return res.status(400).json({ error: result.error });
  }

  paymentState = "settled";
  res.status(200).json({
    status: paymentState,
    transactionId: transactionId,
    message: "Payment verified successfully"
  });
});

router.get("/status", (req, res) => {
  res.status(200).json({ status: paymentState });
});

router.post("/reset", (req, res) => {
  paymentState = "required";
  res.status(200).json({ status: paymentState });
});

module.exports = router;
