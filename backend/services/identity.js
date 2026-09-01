const crypto = require("crypto");
const mockData = require("../data/mockData");

function generateDID() {
  return "did:uni:" + Date.now().toString(36) + ":" + crypto.randomBytes(8).toString("hex");
}

function createHash(input) {
  return crypto.createHash("sha256").update(input).digest("hex");
}

function createNullifier(input) {
  return crypto.createHash("sha256").update("nullifier:" + input).digest("hex");
}

function createCredential(did, nullifier) {
  return {
    did: did,
    nullifier: nullifier,
    status: "VALID",
    issuedAt: new Date().toISOString(),
    network: "Algorand Testnet"
  };
}

function verifyIdentity(method) {
  const methods = ["github", "google", "mock-id"];
  if (!methods.includes(method)) {
    return null;
  }

  const input = method + ":" + Date.now();
  const did = generateDID();
  const hash = createHash(input);
  const nullifier = createNullifier(input);
  const credential = createCredential(did, nullifier);

  return {
    verified: true,
    did: did,
    hash: hash,
    nullifier: nullifier,
    credential: credential
  };
}

function getStatus() {
  return {
    verified: true,
    ...mockData.identity,
    credential: mockData.credential
  };
}

module.exports = { verifyIdentity, getStatus, createHash, createNullifier };
