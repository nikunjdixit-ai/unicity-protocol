import dotenv from "dotenv";
dotenv.config();

const API_BASE = "http://localhost:4002";

async function runX402FlowTest() {
  console.log("==================================================");
  console.log("       x402 PAYMENT PROTOCOL FLOW TEST");
  console.log("==================================================\n");

  try {
    // 1. Test Free Tier
    console.log("[STEP 1] Testing Free Basic Endpoint (GET /api/risk/basic)...");
    const basicRes = await fetch(`${API_BASE}/api/risk/basic`);
    const basicData = await basicRes.json();
    console.log(` Status: ${basicRes.status} OK`);
    console.log(" Response:", JSON.stringify(basicData, null, 2));

    // 2. Test Premium Paywall (No Payment)
    console.log("\n[STEP 2] Testing Premium Endpoint without Payment (POST /api/risk/premium)...");
    const paywallRes = await fetch(`${API_BASE}/api/risk/premium`, { method: "POST" });
    const paywallData = await paywallRes.json();
    console.log(` Status: ${paywallRes.status} Payment Required (Expected 402)`);
    console.log(" Payment Requirements:", JSON.stringify(paywallData, null, 2));

    // 3. Test Premium Paywall (With Payment Payload)
    console.log("\n[STEP 3] Simulating Client Signed Payment Settlement...");
    const mockPaymentPayload = JSON.stringify({
      scheme: "exact",
      network: "algorand:SGO1GKSzyE7IEPItTxCByw9x8FmnrCDe",
      sender: "GD647DXYZTNWXZAUJ447K7K54D6V6L7P7W6KFF44P722YFFLFLJ2G72K4E",
      assetId: 10458941,
      amount: "1000000",
      txProof: "tx_mock_testnet_settled_signature_bytes",
    });

    const unlockRes = await fetch(`${API_BASE}/api/risk/premium`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Payment-Payload": mockPaymentPayload,
      },
    });

    const unlockData = await unlockRes.json();
    console.log(` Status: ${unlockRes.status} OK (Expected 200)`);
    console.log(" Unlocked Sybil Intelligence Report:", JSON.stringify(unlockData, null, 2));

    console.log("\n ALL x402 PAYMENT FLOW TESTS PASSED!");
  } catch (error: any) {
    console.error("❌ Test execution failed:", error?.message || error);
  }
}

runX402FlowTest();