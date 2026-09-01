async function startPayment() {
    var req = await requestPremiumAnalysis();
    if (req && req.amount) {
        return { success: true, amount: req.amount, network: req.network };
    }
    return { success: false };
}

async function checkPayment() {
    return await getPaymentStatus();
}

async function settlePayment(transactionId) {
    return await verifyPayment(transactionId);
}

async function resetPaymentState() {
    return await resetPayment();
}

async function doUnlockPremium() {
    return await unlockPremium();
}
