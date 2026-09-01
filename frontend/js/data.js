var user = {
    name: "Demo User",
    verified: true,
    email: "demo@unicity.io"
};

var risk = {
    score: 12,
    level: "LOW RISK",
    confidence: 87,
    identityConsistency: 96,
    accountAuthenticity: 91,
    networkBehavior: 82,
    activityPattern: 88,
    credentialValidity: 100
};

var credential = {
    status: "VALID",
    network: "Algorand Testnet",
    nullifier: "0x\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022",
    transaction: "0x\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"
};

var verifications = [
    { method: "GitHub", label: "Verify GitHub account", verified: true },
    { method: "Google", label: "Verify Google account", verified: true },
    { method: "Mock Government ID", label: "Demo verification", verified: true }
];

var payment = {
    amount: "0.10 ALGO",
    status: "required",
    network: "Algorand Testnet",
    protocol: "x402",
    facilitator: "GoPlausible",
    transaction: "0x\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"
};

var premiumRisk = {
    score: 18,
    level: "LOW RISK",
    identity: "Strong",
    account: "Strong",
    network: "Moderate",
    behavior: "Low Concern",
    explanation: "No significant evidence of coordinated Sybil behavior was detected from the available signals."
};

var activityLog = [
    { event: "Identity Verified", status: "completed", time: "2h ago" },
    { event: "Credential Created", status: "completed", time: "2h ago" },
    { event: "Basic Analysis Completed", status: "completed", time: "1h ago" },
    { event: "Premium Analysis Requested", status: "completed", time: "45m ago" },
    { event: "Payment Required", status: "completed", time: "44m ago" },
    { event: "Payment Settled", status: "completed", time: "43m ago" },
    { event: "Premium Analysis Unlocked", status: "completed", time: "43m ago" }
];

var state = {
    verified: true,
    payment: "required",
    premium: false
};
