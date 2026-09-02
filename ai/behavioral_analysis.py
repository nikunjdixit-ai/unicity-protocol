from collections import Counter


def analyze_behavior(wallet_data: dict) -> dict:
    transactions = wallet_data.get("transactions", [])

    transaction_count = len(transactions)

    # Support both "recipient" and "to"
    recipients = [
        tx.get("recipient") or tx.get("to")
        for tx in transactions
        if tx.get("recipient") or tx.get("to")
    ]

    unique_recipients = len(set(recipients))

    if unique_recipients > 0:
        tx_per_recipient = transaction_count / unique_recipients
    else:
        tx_per_recipient = 0

    if transaction_count > 0:
        recipient_counts = Counter(recipients)

        repeated_transactions = sum(
            count - 1
            for count in recipient_counts.values()
            if count > 1
        )

        repeated_recipient_ratio = (
            repeated_transactions / transaction_count
        )
    else:
        repeated_recipient_ratio = 0

    timestamps = [
        tx.get("timestamp")
        for tx in transactions
        if tx.get("timestamp")
    ]

    return {
        "transaction_count": transaction_count,
        "unique_recipients": unique_recipients,
        "tx_per_recipient": round(tx_per_recipient, 2),
        "repeated_recipient_ratio": round(
            repeated_recipient_ratio, 2
        ),
        "timestamp_count": len(timestamps),
    }