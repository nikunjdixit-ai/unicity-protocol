import * as avm from "@x402/avm";
// Standard 64-byte mock fallback key for local dev testing
const MOCK_AVM_KEY = "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==";
export class GoPlausibleFacilitator {
    facilitator;
    address;
    constructor(privateKeyBase64) {
        const key = privateKeyBase64 && privateKeyBase64 !== "YOUR_BASE64_ALGORAND_PRIVATE_KEY"
            ? privateKeyBase64
            : MOCK_AVM_KEY;
        const toSigner = avm.toFacilitatorAvmSigner || avm.toAvmSigner;
        const FacilitatorClass = avm.ExactAvmFacilitator || avm.AvmFacilitator;
        if (toSigner && FacilitatorClass) {
            try {
                const signer = toSigner(key);
                this.facilitator = new FacilitatorClass(signer);
                const addresses = typeof signer?.getAddresses === "function" ? signer.getAddresses() : [signer?.address];
                this.address = addresses[0] || "MOCK_FACILITATOR_ADDRESS";
            }
            catch {
                this.address = "MOCK_FACILITATOR_ADDRESS";
            }
        }
        else {
            this.address = "MOCK_FACILITATOR_ADDRESS";
        }
    }
    async verifyPayment(paymentPayload, requirements) {
        if (!this.facilitator?.verify)
            return { isValid: true };
        try {
            const result = await this.facilitator.verify(paymentPayload, requirements);
            return {
                isValid: Boolean(result?.isValid),
                invalidReason: result?.invalidReason,
                invalidMessage: result?.invalidMessage,
            };
        }
        catch (error) {
            return {
                isValid: false,
                invalidReason: "invalid_exact_avm_verification_failed",
                invalidMessage: error?.message || "Payment verification failed",
            };
        }
    }
    async settlePayment(paymentPayload, requirements) {
        if (!this.facilitator?.settle)
            return { success: true, txId: "TX_TESTNET_SETTLED_MOCK" };
        try {
            const result = await this.facilitator.settle(paymentPayload, requirements);
            return {
                success: Boolean(result?.success),
                txId: result?.txId,
                errorReason: result?.errorReason,
                errorMessage: result?.errorMessage,
            };
        }
        catch (error) {
            return {
                success: false,
                errorReason: "invalid_exact_avm_settlement_failed",
                errorMessage: error?.message || "Settlement failed on Algorand",
            };
        }
    }
}
//# sourceMappingURL=goplausible.js.map