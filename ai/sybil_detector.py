def detect_sybil(features: dict) -> dict:
    suspicion_points = 0
    indicators = []

    if features["tx_per_recipient"] >= 4:
        suspicion_points += 25
        indicators.append(
            "Transactions concentrated on few recipients"
        )

    if features["repeated_recipient_ratio"] >= 0.5:
        suspicion_points += 25
        indicators.append(
            "High repeated transaction pattern"
        )

    if features["transaction_count"] >= 20:
        suspicion_points += 20
        indicators.append(
            "Unusually high transaction activity"
        )

    is_suspicious = suspicion_points >= 50

    return {
        "is_suspicious": is_suspicious,
        "suspicion_points": suspicion_points,
        "indicators": indicators,
    }