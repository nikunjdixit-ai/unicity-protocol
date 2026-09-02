from .behavioral_analysis import analyze_behavior
from .sybil_detector import detect_sybil
from .risk_scorer import calculate_risk_score


def analyze_wallet(wallet_data: dict) -> dict:
    """
    Complete Anti-Sybil analysis pipeline.
    """

    features = analyze_behavior(wallet_data)

    sybil_result = detect_sybil(features)

    risk_result = calculate_risk_score(
        features,
        sybil_result
    )

    return {
        "features": features,
        "sybil_detection": sybil_result,
        "risk": risk_result,
    }