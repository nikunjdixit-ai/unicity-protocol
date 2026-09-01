async function getRiskAnalysis() {
    return await apiGet("/analysis");
}

async function fetchPremiumAnalysis() {
    return await apiGet("/analysis/premium");
}
