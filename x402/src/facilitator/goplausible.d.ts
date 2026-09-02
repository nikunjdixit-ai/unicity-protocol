export declare class GoPlausibleFacilitator {
    private facilitator;
    address: string;
    constructor(privateKeyBase64?: string);
    verifyPayment(paymentPayload: any, requirements: any): Promise<{
        isValid: boolean;
        invalidReason?: undefined;
        invalidMessage?: undefined;
    } | {
        isValid: boolean;
        invalidReason: any;
        invalidMessage: any;
    }>;
    settlePayment(paymentPayload: any, requirements: any): Promise<{
        success: boolean;
        txId: string;
        errorReason?: undefined;
        errorMessage?: undefined;
    } | {
        success: boolean;
        txId: any;
        errorReason: any;
        errorMessage: any;
    } | {
        txId?: undefined;
        success: boolean;
        errorReason: string;
        errorMessage: any;
    }>;
}
