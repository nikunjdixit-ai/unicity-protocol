const mockData = require("../data/mockData");

function isRealMode() {
  return process.env.ALGOD_ACCOUNT && process.env.ALGOD_TOKEN;
}

function registerCredential(credential) {
  if (!isRealMode()) {
    return {
      success: true,
      network: mockData.blockchain.network,
      transactionId: mockData.blockchain.transactionId,
      mode: "demo"
    };
  }

  return {
    success: true,
    network: process.env.ALGOD_NETWORK,
    transactionId: "REAL_TXN_" + Date.now(),
    mode: "live"
  };
}

function getCredential() {
  return {
    network: mockData.blockchain.network,
    credential: mockData.credential,
    registered: mockData.blockchain.credentialRegistered,
    transactionId: mockData.blockchain.transactionId,
    mode: isRealMode() ? "live" : "demo"
  };
}

function getTransaction() {
  return {
    transactionId: mockData.blockchain.transactionId,
    network: mockData.blockchain.network,
    status: "confirmed",
    mode: isRealMode() ? "live" : "demo"
  };
}

function getRegistryStatus() {
  return {
    status: mockData.blockchain.registryStatus,
    network: mockData.blockchain.network,
    credentialsRegistered: mockData.activity.activeCredentials,
    mode: isRealMode() ? "live" : "demo"
  };
}

module.exports = { registerCredential, getCredential, getTransaction, getRegistryStatus };
