import { ALGORAND_TESTNET } from "../algorand/testnet";
import { GoPlausibleFacilitator } from "../facilitator/goplausible";
export function createX402Middleware(options) {
    const { payToAddress, facilitatorPrivateKey, amountMicroUsdc = 1_000_000, description = "Premium AI Sybil Risk Report", } = options;
    const facilitator = new GoPlausibleFacilitator(facilitatorPrivateKey);
    const paymentRequirements = {
        scheme: "exact",
        network: ALGORAND_TESTNET.network,
        recipient: payToAddress,
        assetId: ALGORAND_TESTNET.usdcAssetId,
        amount: amountMicroUsdc.toString(),
        description,
    };
    return async (req, res, next) => {
        // 1. Check for payment header from x402 client
        const paymentHeader = req.headers["x-payment-payload"] ||
            req.headers["authorization"];
        if (!paymentHeader) {
            return res.status(402).json({
                error: "Payment Required",
                message: "Access requires an x402 micropayment on Algorand Testnet.",
                requirements: paymentRequirements,
            });
        }
        try {
            let paymentPayload;
            try {
                paymentPayload = JSON.parse(paymentHeader);
            }
            catch {
                paymentPayload = paymentHeader;
            }
            // 2. Verify payment validity
            const verification = await facilitator.verifyPayment(paymentPayload, paymentRequirements);
            if (!verification.isValid) {
                return res.status(402).json({
                    error: "Invalid Payment",
                    reason: verification.invalidReason,
                    message: verification.invalidMessage,
                    requirements: paymentRequirements,
                });
            }
            // 3. Settle transaction on Algorand Testnet
            const settlement = await facilitator.settlePayment(paymentPayload, paymentRequirements);
            if (!settlement.success) {
                return res.status(500).json({
                    error: "Settlement Failed",
                    reason: settlement.errorReason,
                    message: settlement.errorMessage,
                });
            }
            // Attach settled payment info to request
            req.paymentInfo = {
                txId: settlement.txId,
                settled: true,
            };
            next();
        }
        catch (err) {
            return res.status(500).json({
                error: "Payment Processing Error",
                message: err?.message || "Internal payment processing error",
            });
        }
    };
}
//# sourceMappingURL=x402-middleware.js.map