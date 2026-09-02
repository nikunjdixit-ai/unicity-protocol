export interface PaymentRequirementConfig {
    recipientAddress: string;
    amount: number;
    description: string;
}
export declare function createPaymentRequirement({ recipientAddress, amount, description, }: PaymentRequirementConfig): {
    scheme: string;
    network: "algorand:SGO1GKSzyE7IEPItTxCByw9x8FmnrCDe";
    assetId: 10458941;
    amount: string;
    recipient: string;
    description: string;
};
