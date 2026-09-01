import { ALGORAND_TESTNET } from "./testnet.js";

export interface PaymentRequirementConfig {
  recipientAddress: string;
  amount: number; // in base units (e.g. 1 USDC = 1_000_000 micro-USDC)
  description: string;
}

export function createPaymentRequirement({
  recipientAddress,
  amount,
  description,
}: PaymentRequirementConfig) {
  return {
    scheme: "exact",
    network: ALGORAND_TESTNET.network,
    assetId: ALGORAND_TESTNET.usdcAssetId,
    amount: amount.toString(),
    recipient: recipientAddress,
    description,
  };
}