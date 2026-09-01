import { Request, Response, NextFunction } from "express";
import { ALGORAND_TESTNET } from "../algorand/testnet";
import { GoPlausibleFacilitator } from "../facilitator/goplausible";

export interface PaywallOptions {
  payToAddress: string;
  facilitatorPrivateKey: string;
  amountMicroUsdc?: number; // Default 1 USDC = 1_000_000 micro-USDC
  description?: string;
}

export function createX402Middleware(options: PaywallOptions) {
  const {
    payToAddress,
    facilitatorPrivateKey,
    amountMicroUsdc = 1_000_000,
    description = "Premium AI Sybil Risk Report",
  } = options;

  const facilitator = new GoPlausibleFacilitator(facilitatorPrivateKey);

  const paymentRequirements = {
    scheme: "exact",
    network: ALGORAND_TESTNET.network,
    recipient: payToAddress,
    assetId: ALGORAND_TESTNET.usdcAssetId,
    amount: amountMicroUsdc.toString(),
    description,
  };

  return async (req: Request, res: Response, next: NextFunction) => {
    // 1. Check for payment header from x402 client
    const paymentHeader =
      (req.headers["x-payment-payload"] as string) ||
      (req.headers["authorization"] as string);

    if (!paymentHeader) {
      return res.status(402).json({
        error: "Payment Required",
        message: "Access requires an x402 micropayment on Algorand Testnet.",
        requirements: paymentRequirements,
      });
    }

    try {
      let paymentPayload: any;
      try {
        paymentPayload = JSON.parse(paymentHeader);
      } catch {
        paymentPayload = paymentHeader;
      }

      // 2. Verify payment validity
      const verification = await facilitator.verifyPayment(
        paymentPayload,
        paymentRequirements
      );

      if (!verification.isValid) {
        return res.status(402).json({
          error: "Invalid Payment",
          reason: verification.invalidReason,
          message: verification.invalidMessage,
          requirements: paymentRequirements,
        });
      }

      // 3. Settle transaction on Algorand Testnet
      const settlement = await facilitator.settlePayment(
        paymentPayload,
        paymentRequirements
      );

      if (!settlement.success) {
        return res.status(500).json({
          error: "Settlement Failed",
          reason: settlement.errorReason,
          message: settlement.errorMessage,
        });
      }

      // Attach settled payment info to request
      (req as any).paymentInfo = {
        txId: settlement.txId,
        settled: true,
      };

      next();
    } catch (err: any) {
      return res.status(500).json({
        error: "Payment Processing Error",
        message: err?.message || "Internal payment processing error",
      });
    }
  };
}