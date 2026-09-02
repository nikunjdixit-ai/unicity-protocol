import { ALGORAND_TESTNET } from "./testnet.js";
export function createPaymentRequirement({ recipientAddress, amount, description, }) {
    return {
        scheme: "exact",
        network: ALGORAND_TESTNET.network,
        assetId: ALGORAND_TESTNET.usdcAssetId,
        amount: amount.toString(),
        recipient: recipientAddress,
        description,
    };
}
//# sourceMappingURL=payment.js.map