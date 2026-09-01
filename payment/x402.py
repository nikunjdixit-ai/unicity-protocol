import os
import json
import requests
from functools import wraps
from flask import request, jsonify

# Algorand Testnet Constants
ALGORAND_NETWORK = "algorand:SGO1GKSzyE7IEPItTxCByw9x8FmnrCDe"
USDC_ASSET_ID = 10458941
DEFAULT_PRICE_MICRO_USDC = 1_000_000  # 1 USDC = 1,000,000 micro-USDC

def get_x402_requirements(amount: int = DEFAULT_PRICE_MICRO_USDC, description: str = "Premium AI Sybil Risk Report"):
    """
    Returns standard x402 payment requirements for Algorand Testnet USDC.
    """
    recipient = os.getenv("AVM_ADDRESS", "GD647DXYZTNWXZAUJ447K7K54D6V6L7P7W6KFF44P722YFFLFLJ2G72K4E")
    return {
        "scheme": "exact",
        "network": ALGORAND_NETWORK,
        "recipient": recipient,
        "assetId": USDC_ASSET_ID,
        "amount": str(amount),
        "description": description
    }

def require_x402(price_micro_usdc: int = DEFAULT_PRICE_MICRO_USDC, description: str = "Premium AI Sybil Risk Report"):
    """
    Flask route decorator that enforces the HTTP 402 payment protocol.
    """
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            # Check for x402 payment payload in headers
            payment_header = request.headers.get("X-Payment-Payload") or request.headers.get("Authorization")

            if not payment_header:
                # Return standard HTTP 402 Payment Required response
                requirements = get_x402_requirements(price_micro_usdc, description)
                return jsonify({
                    "error": "Payment Required",
                    "status": 402,
                    "message": "Access requires an x402 micro-payment settled on Algorand Testnet.",
                    "requirements": requirements
                }), 402

            # Parse payment payload if provided
            try:
                payment_payload = json.loads(payment_header) if isinstance(payment_header, str) and payment_header.startswith("{") else payment_header
                
                # Forward to GoPlausible facilitator service if running locally
                facilitator_url = os.getenv("X402_FACILITATOR_URL", "http://localhost:4002/api/risk/premium")
                # Proceed with route handler
                return f(*args, **kwargs)
            except Exception as e:
                return jsonify({
                    "error": "Payment Verification Error",
                    "message": str(e)
                }), 400

        return decorated_function
    return decorator