import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { generateNullifier, generateZKCommitment } from './privacy/hasher.js';
import { issueVerifiableCredential, verifyCredential } from './did/credentialIssuer.js';
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
const registeredNullifiers = new Set();
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    service: 'DID & Privacy Engine (Member 3)',
    network: 'Algorand Testnet Ready'
  });
});
app.post('/api/did/verify-and-issue', (req, res) => {
  try {
    const { rawIdentifier, idType = 'GITHUB', userWallet = 'ALGORAND_WALLET_TEST_ADDRESS' } = req.body;
    if (!rawIdentifier) {
      return res.status(400).json({ error: 'rawIdentifier is required' });
    }
    const privacyData = generateNullifier(rawIdentifier, idType);
    if (registeredNullifiers.has(privacyData.nullifierHash)) {
      return res.status(409).json({
        success: false,
        error: 'SYBIL_DETECTED',
        message: 'This identity is already registered with another wallet! 1 Person = 1 DID.',
        nullifier: privacyData.nullifierHash
      });
    }
    const zkProof = generateZKCommitment(rawIdentifier, 'user_secret_entropy');
    const credential = issueVerifiableCredential({
      userWalletAddress: userWallet,
      identityType: idType,
      nullifierHash: privacyData.nullifierHash,
      zkProof: zkProof
    });
    registeredNullifiers.add(privacyData.nullifierHash);
    return res.status(200).json({
      success: true,
      message: 'Identity Verified & DID Credential Issued successfully!',
      nullifier: privacyData.nullifierHash,
      identityHash: privacyData.identityHash,
      credential: credential
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});
app.post('/api/did/verify-credential', (req, res) => {
  const { credential } = req.body;
  const result = verifyCredential(credential);
  res.json(result);
});
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🔐 DID & Privacy Service is running on http://localhost:${PORT}`);
  console.log(`======================================================\n`);
});