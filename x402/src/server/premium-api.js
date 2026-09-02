import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createX402Middleware } from "./x402-middleware";
dotenv.config();
const app = express();
// Enable standard CORS for all origins and headers
app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "X-Payment-Payload", "Authorization"]
}));
app.use(express.json());
const PORT = Number(process.env.PORT) || 4002;
const DEFAULT_DEV_KEY = "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==";
const PAY_TO_ADDRESS = process.env.AVM_ADDRESS ||
    "GD647DXYZTNWXZAUJ447K7K54D6V6L7P7W6KFF44P722YFFLFLJ2G72K4E";
const FACILITATOR_KEY = process.env.AVM_PRIVATE_KEY || DEFAULT_DEV_KEY;
// Initialize x402 paywall middleware
const x402Paywall = createX402Middleware({
    payToAddress: PAY_TO_ADDRESS,
    facilitatorPrivateKey: FACILITATOR_KEY,
    amountMicroUsdc: 1_000_000,
    description: "Unlock Deep AI Anti-Sybil Risk Report",
});
// Free Endpoint
app.get("/api/risk/basic", (_req, res) => {
    res.json({
        status: "success",
        tier: "free",
        risk_level: "LOW",
        is_sybil: false,
        note: "Basic risk analysis. Upgrade to Premium for deep graph entropy clustering.",
    });
});
// Protected Premium Endpoint
app.post("/api/risk/premium", x402Paywall, (req, res) => {
    const paymentInfo = req.paymentInfo;
    res.json({
        status: "success",
        tier: "premium",
        access_granted: true,
        payment_settlement: paymentInfo,
        sybil_intelligence: {
            risk_score: 0.04,
            classification: "VERIFIED_HUMAN",
            confidence: 0.98,
            analysis: {
                cluster_density: "Low",
                entropy_index: 0.92,
                multi_account_linkage: false,
                onchain_reputation: "Optimal",
            },
        },
    });
});
export function startPremiumApiServer() {
    app.listen(PORT, "0.0.0.0", () => {
        console.log(`x402 Paywall API server running at http://127.0.0.1:${PORT}`);
    });
}
startPremiumApiServer();
//# sourceMappingURL=premium-api.js.map