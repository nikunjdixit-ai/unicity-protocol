def calculate_risk_score(
    behavioral_features: dict,
    sybil_result: dict
) -> dict:
    """
    Calculate a 0-100 Sybil risk score.
    """

    score = sybil_result.get("suspicion_points", 0)

    transaction_count = behavioral_features.get(
        "transaction_count", 0
    )

    unique_recipients = behavioral_features.get(
        "unique_recipients", 0
    )

    # Additional risk signals
    if transaction_count >= 100:
        score += 10

    if transaction_count >= 20 and unique_recipients <= 2:
        score += 10

    score = min(score, 100)

    if score < 30:
        risk_level = "LOW"
    elif score < 70:
        risk_level = "MEDIUM"
    else:
        risk_level = "HIGH"

    return {
        "risk_score": score,
        "risk_level": risk_level,
        "is_sybil": score >= 70,
        "indicators": sybil_result.get("indicators", []),
    }