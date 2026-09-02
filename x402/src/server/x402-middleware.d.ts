import { Request, Response, NextFunction } from "express";
export interface PaywallOptions {
    payToAddress: string;
    facilitatorPrivateKey: string;
    amountMicroUsdc?: number;
    description?: string;
}
export declare function createX402Middleware(options: PaywallOptions): (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>>>;
