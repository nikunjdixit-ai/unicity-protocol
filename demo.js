import crypto from 'crypto';

// ================================================================
// 🔐 MEMBER 3: DID & PRIVACY ENGINE (STANDALONE ANTI-SYBIL SYSTEM)
// ================================================================

const SECRET_SALT = 'algorand_anti_sybil_hackathon_super_secret_salt_2026';
const ISSUER_DID = 'did:sybil:algorand:authority:0x001';

// 1. Identity Hashing (Privacy Layer)
function hashIdentity(rawIdentifier) {
  return crypto
    .createHash('sha256')
    .update(rawIdentifier.trim().toLowerCase())
    .digest('hex');
}

// 2. Unique Nullifier Generation (Anti-Sybil 1 Person = 1 DID)
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

// 3. Mock ZK-Proof Commitment
function generateZKCommitment(rawIdentifier, userSecret) {
  const commitment = crypto
    .createHash('sha256')
    .update(`${rawIdentifier}:${userSecret}:${SECRET_SALT}`)
    .digest('hex');

  return 'zkp_commit_0x' + commitment;
}

// 4. Issue W3C-Standard Verifiable DID Credential
function issueVerifiableCredential({ userWalletAddress, identityType, nullifierHash, zkProof }) {
  const credentialSubject = {
    id: `did:algo:${userWalletAddress}`,
    isHuman: true,
    verificationType: identityType,
    nullifier: nullifierHash,
    zkProof: zkProof,
    verifiedAt: new Date().toISOString(),
    status: 'ACTIVE'
  };

  const credentialData = JSON.stringify(credentialSubject);
  const signature = crypto
    .createHmac('sha256', SECRET_SALT)
    .update(credentialData)
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

// 5. Verify Credential Authenticity
function verifyCredential(credential) {
  if (!credential || !credential.credentialSubject || !credential.proof) {
    return { valid: false, reason: 'Malformed credential' };
  }

  const expectedSignature = crypto
    .createHmac('sha256', SECRET_SALT)
    .update(JSON.stringify(credential.credentialSubject))
    .digest('hex');

  const isValid = ('0x' + expectedSignature) === credential.proof.proofValue;

  return {
    valid: isValid,
    nullifier: credential.credentialSubject.nullifier,
    wallet: credential.credentialSubject.id,
    isHuman: credential.credentialSubject.isHuman
  };
}
console.log('\n================================================================');
console.log('🚀 DEMO: DID & PRIVACY LAYER (MEMBER 3 - ANTI-SYBIL ENGINE)');
console.log('================================================================\n');
const rawAadhaarMock = "AADHAAR-IN-9876-5432-1098";
const wallet1 = "ALGO_WALLET_USER_ONE_AAA777";
const wallet2_attacker = "ALGO_WALLET_ATTACKER_FAKE_BBB888";
console.log('1️⃣ USER INPUT:');
console.log(`   Real ID: ${rawAadhaarMock}`);
console.log(`   User Wallet: ${wallet1}\n`);
const privacyResult = generateNullifier(rawAadhaarMock, 'GOVT_ID_MOCK');
console.log('2️⃣ PRIVACY & NULLIFIER LAYER:');
console.log(`   Hashed ID (Hidden):   ${privacyResult.identityHash}`);
console.log(`   Unique Nullifier:     ${privacyResult.nullifierHash}\n`);
const zkProof = generateZKCommitment(rawAadhaarMock, 'secret_pass_123');
const credential = issueVerifiableCredential({
  userWalletAddress: wallet1,
  identityType: 'GOVT_ID_MOCK',
  nullifierHash: privacyResult.nullifierHash,
  zkProof: zkProof
});
console.log('3️⃣ VERIFIABLE DID CREDENTIAL CREATED:');
console.log(JSON.stringify(credential, null, 2));
console.log('\n4️⃣ CREDENTIAL VALIDATION CHECK:');
const check = verifyCredential(credential);
console.log(`   Is Credential Valid? -> ${check.valid ? '✅ YES (Legit Human Verified)' : '❌ NO'}`);
console.log('\n5️⃣ SYBIL ATTACK SIMULATION (Attacker tries to make 2nd account with same ID):');
const attackNullifier = generateNullifier(rawAadhaarMock, 'GOVT_ID_MOCK');
console.log(`   Attacker Wallet: ${wallet2_attacker}`);
console.log(`   Attacker generated Nullifier: ${attackNullifier.nullifierHash}`);
if (attackNullifier.nullifierHash === privacyResult.nullifierHash) {
  console.log('   🚨 SYBIL ATTACK BLOCKED! Nullifier already exists on Algorand Registry!');
  console.log('   🛡️ RESULT: 1 Person cannot create multiple identities!');
}
console.log('\n================================================================\n');