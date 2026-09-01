var API_BASE = "/api";

var state = {
    verified: false,
    payment: "required",
    premium: false
};

async function apiGet(path) {
    try {
        var res = await fetch(API_BASE + path);
        return await res.json();
    } catch (e) {
        console.error("API GET error:", path, e);
        return null;
    }
}

async function apiPost(path, body) {
    try {
        var res = await fetch(API_BASE + path, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });
        return await res.json();
    } catch (e) {
        console.error("API POST error:", path, e);
        return null;
    }
}

async function getDashboard() {
    var identity = await apiGet("/identity/status");
    var analysis = await apiGet("/analysis");
    return { identity: identity, analysis: analysis };
}

async function verifyIdentity(method) {
    return await apiPost("/identity/verify", { method: method });
}

async function getRiskAnalysis() {
    return await apiGet("/analysis");
}

async function requestPremiumAnalysis() {
    return await apiPost("/payment/request", {});
}

async function verifyPayment(transactionId) {
    return await apiPost("/payment/verify", { transactionId: transactionId });
}

async function getPaymentStatus() {
    return await apiGet("/payment/status");
}

async function resetPayment() {
    return await apiPost("/payment/reset", {});
}

async function unlockPremium() {
    return await apiPost("/analysis/unlock-premium", {});
}

async function getPremiumAnalysis() {
    return await apiGet("/analysis/premium");
}

async function getIdentityStatus() {
    return await apiGet("/identity/status");
}
