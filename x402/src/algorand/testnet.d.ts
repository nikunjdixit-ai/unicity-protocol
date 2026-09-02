/**
 * Algorand Testnet configuration for the x402 payment layer.
 *
 * This module contains network-level configuration only.
 * Private keys and secrets must NEVER be stored here.
 */
export declare const ALGORAND_TESTNET: {
    /**
     * CAIP-2 network identifier used by x402.
     */
    readonly network: "algorand:SGO1GKSzyE7IEPItTxCByw9x8FmnrCDe";
    /**
     * Algorand Testnet USDC ASA.
     */
    readonly usdcAssetId: 10458941;
    /**
     * LoRA Algorand Testnet explorer.
     */
    readonly explorerUrl: "https://lora.algokit.io/testnet";
    /**
     * LoRA funding page.
     */
    readonly faucetUrl: "https://lora.algokit.io/testnet/fund";
};
