const mockData = require("../data/mockData");

function isRealMode() {
  return process.env.X402_MODE !== "demo" && process.env.X402_FACILITATOR_URL;
}

function createPaymentRequirement() {
  return {
    amount: mockData.payment.amount,
    currency: mockData.payment.currency,
    network: mockData.payment.network,
    protocol: mockData.payment.protocol,
    facilitator: mockData.payment.facilitator,
    mode: isRealMode() ? "live" : "demo"
  };
}

function verifyPayment(paymentData) {
  if (isRealMode()) {
    if (!paymentData || !paymentData.transactionId) {
      return { success: false, error: "Invalid payment data" };
    }

    return {
      success: true,
      status: "settled",
      transactionId: paymentData.transactionId,
      mode: "live"
    };
  }

  if (paymentData && paymentData.transactionId) {
    return {
      success: true,
      status: "settled",
      transactionId: paymentData.transactionId,
      mode: "demo"
    };
  }

  return {
    success: false,
    error: "Missing transaction ID"
  };
}

function getPaymentStatus() {
  return {
    mode: isRealMode() ? "live" : "demo",
    facilitator: mockData.payment.facilitator
  };
}

module.exports = { createPaymentRequirement, verifyPayment, getPaymentStatus };
