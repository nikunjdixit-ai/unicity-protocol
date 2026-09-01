module.exports = {
  identity: {
    did: "did:uni:demo:0x7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b",
    hash: "0x9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08",
    nullifier: "0x4e07408562bedb8b60ce05c1decfe3ad16b72230257743b7f996372cf17562aa",
    method: "mock-id"
  },
  credential: {
    did: "did:uni:demo:0x7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b",
    nullifier: "0x4e07408562bedb8b60ce05c1decfe3ad16b72230257743b7f996372cf17562aa",
    status: "VALID",
    issuedAt: "2025-01-15T12:00:00Z",
    network: "Algorand Testnet"
  },
  risk: {
    score: 12,
    level: "LOW RISK",
    confidence: 87,
    signals: {
      identityConsistency: 96,
      accountAuthenticity: 91,
      networkBehavior: 82,
      activityPattern: 88,
      credentialValidity: 100
    },
    assessment: "The account demonstrates strong identity consistency and no significant duplicate-identity indicators were detected in the available signals."
  },
  premiumRisk: {
    score: 18,
    level: "LOW RISK",
    confidence: 91,
    signals: {
      identity: "Strong",
      account: "Strong",
      network: "Moderate",
      behavior: "Low Concern"
    },
    assessment: "No significant evidence of coordinated Sybil behavior was detected from the available signals."
  },
  blockchain: {
    network: "Algorand Testnet",
    credentialRegistered: true,
    transactionId: "DEMO_TXN_0xabc123def456",
    registryStatus: "ACTIVE"
  },
  payment: {
    amount: "0.10",
    currency: "ALGO",
    network: "Algorand Testnet",
    protocol: "x402",
    facilitator: "GoPlausible"
  },
  activity: {
    recentVerifications: 1247,
    activeCredentials: 892,
    premiumsSold: 341
  }
};
