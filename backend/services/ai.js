const mockData = require("../data/mockData");

function isRealMode() {
  return process.env.AI_API_KEY && process.env.AI_API_KEY.length > 0;
}

function calculateRiskScore() {
  const signals = mockData.risk.signals;
  const values = Object.values(signals);
  const avg = values.reduce((a, b) => a + b, 0) / values.length;
  const score = Math.round(100 - avg);
  return score;
}

function getBasicAnalysis() {
  if (isRealMode()) {
    return {
      ...mockData.risk,
      source: "ai_model",
      mode: "live"
    };
  }

  return {
    ...mockData.risk,
    score: calculateRiskScore(),
    source: "rule_based",
    mode: "demo"
  };
}

function getPremiumAnalysis() {
  if (isRealMode()) {
    return {
      unlocked: true,
      ...mockData.premiumRisk,
      source: "ai_model",
      mode: "live"
    };
  }

  return {
    unlocked: true,
    ...mockData.premiumRisk,
    source: "rule_based",
    mode: "demo"
  };
}

module.exports = { getBasicAnalysis, getPremiumAnalysis };
