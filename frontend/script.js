const API_BASE_URL = "http://127.0.0.1:4002";

// Store connected wallet address
let connectedAddress = null;

// DOM Elements
const connectWalletBtn = document.getElementById("connect-wallet-btn");
const walletStatus = document.getElementById("wallet-status");
const basicCheckBtn = document.getElementById("basic-check-btn");
const premiumCheckBtn = document.getElementById("premium-check-btn");
const resultsOutput = document.getElementById("results-output");

// 1. Simulate Algorand Wallet Connection (e.g. Pera / Defly / Lute)
connectWalletBtn?.addEventListener("click", () => {
  connectedAddress = "GD647DXYZTNWXZAUJ447K7K54D6V6L7P7W6KFF44P722YFFLFLJ2G72K4E";
  walletStatus.innerText = `Connected: ${connectedAddress.substring(0, 6)}...${connectedAddress.substring(connectedAddress.length - 4)}`;
  walletStatus.className = "status-connected";
  connectWalletBtn.disabled = true;
});

// 2. Free Tier Risk Analysis (No Payment)
basicCheckBtn?.addEventListener("click", async () => {
  renderLog("Fetching free basic risk score...");
  try {
    const res = await fetch(`${API_BASE_URL}/api/risk/basic`);
    const data = await res.json();
    renderLog("Basic Analysis Result:\n" + JSON.stringify(data, null, 2));
  } catch (err) {
    renderLog("Error connecting to server: " + err.message);
  }
});

// 3. Premium Deep AI Anti-Sybil Analysis (x402 Paywall Flow)
premiumCheckBtn?.addEventListener("click", async () => {
  if (!connectedAddress) {
    alert("Please connect your Algorand wallet first.");
    return;
  }

  renderLog("Requesting Deep AI Anti-Sybil Analysis...");

  try {
    // Step 1: Initial Request (Expects HTTP 402)
    const initialRes = await fetch(`${API_BASE_URL}/api/risk/premium`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ address: connectedAddress })
    });

    if (initialRes.status === 402) {
      const paywallData = await initialRes.json();
      const reqs = paywallData.requirements;
      const usdcAmount = Number(reqs.amount) / 1_000_000;

      renderLog(`HTTP 402 Received: Payment of ${usdcAmount} USDC required on Algorand Testnet.`);

      // Prompt user confirmation to sign payment
      const confirmPayment = confirm(
        `[x402 Paywall]\n\nUnlock Deep AI Sybil Report for ${usdcAmount} USDC?\nNetwork: ${reqs.network}\nAsset ID: ${reqs.assetId}`
      );

      if (!confirmPayment) {
        renderLog("Payment rejected by user.");
        return;
      }

      // Step 2: Sign and build payment payload
      renderLog("Signing Algorand Testnet ASA transfer...");
      const paymentPayload = JSON.stringify({
        scheme: reqs.scheme,
        network: reqs.network,
        sender: connectedAddress,
        recipient: reqs.recipient,
        assetId: reqs.assetId,
        amount: reqs.amount,
        txProof: "sig_" + Date.now()
      });

      // Step 3: Retry request with signed payload
      renderLog("Submitting payment to GoPlausible facilitator for settlement...");
      const unlockRes = await fetch(`${API_BASE_URL}/api/risk/premium`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Payment-Payload": paymentPayload
        },
        body: JSON.stringify({ address: connectedAddress })
      });

      const unlockedReport = await unlockRes.json();
      renderLog(" Premium AI Report Unlocked:\n" + JSON.stringify(unlockedReport, null, 2));
    } else {
      const data = await initialRes.json();
      renderLog("Response:\n" + JSON.stringify(data, null, 2));
    }
  } catch (err) {
    renderLog("Payment Flow Error: " + err.message);
  }
});

function renderLog(message) {
  if (resultsOutput) {
    resultsOutput.textContent = message;
  }
}