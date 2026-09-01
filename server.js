import express from 'express';
import cors from 'cors';
import crypto from 'crypto';
const app = express();
app.use(cors());
app.use(express.json());
const PORT = 4000;
const SECRET_SALT = 'algorand_anti_sybil_hackathon_super_secret_salt_2026';
const ISSUER_DID = 'did:sybil:algorand:authority:0x001';
const registeredNullifiers = new Map();
function hashIdentity(rawIdentifier) {
  return crypto
    .createHash('sha256')
    .update(rawIdentifier.trim().toLowerCase())
    .digest('hex');
}
function generateNullifier(rawIdentifier, idType = 'GITHUB') {
  const baseHash = hashIdentity(rawIdentifier);
  const nullifier = crypto
    .createHmac('sha256', SECRET_SALT)
    .update(`${idType}:${baseHash}`)
    .digest('hex');
  return {
    identityType: idType,
    identityHash: '0x' + baseHash,
    nullifierHash: '0x' + nullifier,
    timestamp: new Date().toISOString()
  };
}
function issueVerifiableCredential({ userWalletAddress, identityType, nullifierHash }) {
  const credentialSubject = {
    id: `did:algo:${userWalletAddress}`,
    isHuman: true,
    verificationType: identityType,
    nullifier: nullifierHash,
    verifiedAt: new Date().toISOString(),
    status: 'ACTIVE'
  };
  const signature = crypto
    .createHmac('sha256', SECRET_SALT)
    .update(JSON.stringify(credentialSubject))
    .digest('hex');
  return {
    '@context': ['https://www.w3.org/2018/credentials/v1'],
    id: `urn:uuid:${crypto.randomUUID()}`,
    type: ['VerifiableCredential', 'HumanIdentityCredential'],
    issuer: ISSUER_DID,
    issuanceDate: new Date().toISOString(),
    credentialSubject: credentialSubject,
    proof: {
      type: 'HmacSHA256Signature2026',
      created: new Date().toISOString(),
      proofPurpose: 'assertionMethod',
      verificationMethod: `${ISSUER_DID}#key-1`,
      proofValue: '0x' + signature
    }
  };
}
app.get('/', (req, res) => {
  res.json({
    status: 'ONLINE 🟢',
    role: 'Member 3 - DID & Privacy Engine',
    network: 'Algorand Anti-Sybil Framework',
    endpoints: [
      'POST /api/did/verify-and-issue',
      'POST /api/did/verify-credential',
      'GET /api/did/all-nullifiers'
    ]
  });
});
app.post('/api/did/verify-and-issue', (req, res) => {
  try {
    const { rawIdentifier, idType = 'GITHUB', userWallet = 'ALGORAND_DEFAULT_WALLET' } = req.body;
    if (!rawIdentifier) {
      return res.status(400).json({ error: 'rawIdentifier is required (e.g. GitHub username or Email or Aadhaar hash)' });
    }
    const privacy = generateNullifier(rawIdentifier, idType);
    if (registeredNullifiers.has(privacy.nullifierHash)) {
      const existingWallet = registeredNullifiers.get(privacy.nullifierHash);
      return res.status(409).json({
        success: false,
        error: 'SYBIL_ATTACK_DETECTED 🚨',
        message: 'This person is already registered with another wallet! 1 Real Human = 1 DID.',
        registeredWallet: existingWallet,
        nullifier: privacy.nullifierHash
      });
    }
    const credential = issueVerifiableCredential({
      userWalletAddress: userWallet,
      identityType: idType,
      nullifierHash: privacy.nullifierHash
    });
    registeredNullifiers.set(privacy.nullifierHash, userWallet);
    return res.status(200).json({
      success: true,
      message: '✅ Human Verified! DID Credential generated successfully.',
      nullifier: privacy.nullifierHash,
      credential: credential
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});
app.get('/api/did/all-nullifiers', (req, res) => {
  const list = [];
  registeredNullifiers.forEach((wallet, nullifier) => {
    list.push({ nullifier, wallet });
  });
  res.json({ totalVerifiedHumans: list.length, humans: list });
});
app.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🚀 DID & Privacy API Server is running on:`);
  console.log(`👉 http://localhost:${PORT}`);
  console.log(`======================================================\n`);
});