---
sidebar_position: 2
---

# Best Practices

Production-ready patterns and security guidelines for building with OpenZKTool.

## Security Best Practices

### Never Expose Private Inputs

**❌ WRONG: Sending private data to server**

```javascript
// DON'T DO THIS!
async function badExample(userData) {
  // Sending private data to backend - PRIVACY VIOLATION!
  const response = await fetch('/api/verify', {
    method: 'POST',
    body: JSON.stringify({
      age: userData.age,         // Private! Should NEVER leave client
      balance: userData.balance, // Private! Should NEVER leave client
      country: userData.country  // Private! Should NEVER leave client
    })
  });
}
```

**✅ CORRECT: Generate proof on client**

```javascript
// DO THIS INSTEAD
async function goodExample(userData) {
  // Generate proof on CLIENT SIDE (browser/mobile app)
  const generator = new ProofGenerator();
  const proof = await generator.generate(userData);

  // Only send the PROOF (which reveals nothing about private data)
  const response = await fetch('/api/verify', {
    method: 'POST',
    body: JSON.stringify({
      proof: proof  // Safe to send - reveals nothing!
    })
  });
}
```

**Why this matters:**
- Proof generation MUST happen on the user's device
- Private inputs (age, balance, country) NEVER leave the device
- Only the proof (which reveals nothing) is transmitted
- This is the core privacy guarantee of zero-knowledge proofs

### Validate Public Inputs

Always validate that public inputs match your application's requirements:

```javascript
function validatePublicInputs(minAge, maxAge, minBalance, allowedCountries) {
  // Ensure age range is reasonable
  if (minAge < 0 || minAge > 150) {
    throw new Error('Invalid minAge');
  }
  if (maxAge < minAge || maxAge > 150) {
    throw new Error('Invalid maxAge');
  }

  // Ensure balance threshold is non-negative
  if (minBalance < 0) {
    throw new Error('Invalid minBalance');
  }

  // Ensure exactly 10 country codes
  if (allowedCountries.length !== 10) {
    throw new Error('allowedCountries must have exactly 10 elements');
  }

  // Ensure all country codes are in valid range
  for (const code of allowedCountries) {
    if (code < 0 || code > 999) {
      throw new Error('Invalid country code');
    }
  }

  return true;
}

// Use before generating proofs
validatePublicInputs(18, 99, 100, [1, 2, 3, 0, 0, 0, 0, 0, 0, 0]);
```

### Verify Proofs On-Chain

For critical applications, always verify proofs on-chain:

```javascript
// ❌ WRONG: Trusting client-side verification
async function insecureFlow(proof) {
  // Local verification can be faked by modified client!
  const verifier = new ProofVerifier();
  const isValid = await verifier.verify(proof);

  if (isValid) {
    // Granting access based on LOCAL verification - INSECURE!
    await grantPremiumAccess(userId);
  }
}

// ✅ CORRECT: On-chain verification
async function secureFlow(proof) {
  // Verify on Stellar Soroban - tamper-proof!
  const verifier = new SorobanVerifier({
    contractId: CONTRACT_ID,
    network: 'mainnet',
    secretKey: SERVER_SECRET_KEY
  });

  const result = await verifier.submit(proof);

  if (result.success && result.result === true) {
    // Now safe to grant access - blockchain verified!
    await grantPremiumAccess(userId, result.txHash);
  }
}
```

### Protect Against Proof Replay

Prevent reuse of the same proof across different users:

```javascript
// Add user-specific binding to public inputs
async function generateBoundProof(userData, userId) {
  const generator = new ProofGenerator();

  // Hash userId into one of the public inputs
  const userHash = hashUserId(userId);

  const proof = await generator.generate({
    ...userData,
    // Bind proof to specific user (example: use first allowed country slot)
    allowedCountries: [userHash % 1000, 2, 3, 0, 0, 0, 0, 0, 0, 0]
  });

  return proof;
}

// Verification checks the binding
async function verifyBoundProof(proof, userId) {
  const userHash = hashUserId(userId);

  // Ensure proof was generated for THIS user
  // (Implementation depends on how you encode the binding)

  const verifier = new SorobanVerifier({...});
  return await verifier.verify(proof);
}
```

### Secure Key Management

**For Development:**

```bash
# Use environment variables
export STELLAR_SECRET_KEY="SXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
export CONTRACT_ID="CBPBVJJW5NMV4UVEDKSR6UO4DRBNWRQEMYKRYZI3CW6YK3O7HAZA43OI"

# Never commit secrets to git
echo ".env" >> .gitignore
echo "*.key" >> .gitignore
```

**For Production:**

```javascript
// Use secure secret management service
import { SecretManagerServiceClient } from '@google-cloud/secret-manager';

async function getSecret(name) {
  const client = new SecretManagerServiceClient();
  const [version] = await client.accessSecretVersion({
    name: `projects/my-project/secrets/${name}/versions/latest`,
  });
  return version.payload.data.toString();
}

const SECRET_KEY = await getSecret('stellar-secret-key');
const CONTRACT_ID = await getSecret('verifier-contract-id');
```

## Performance Best Practices

### Preload Circuit Files

Avoid loading WASM files on every proof generation:

```javascript
// ❌ SLOW: Loading WASM each time
async function slowProofGeneration(input) {
  const generator = new ProofGenerator();  // Loads WASM
  return await generator.generate(input);   // Generates proof
}

// ✅ FAST: Preload once, reuse many times
const generator = new ProofGenerator();
await generator.preload();  // Load WASM once at startup

async function fastProofGeneration(input) {
  return await generator.generate(input);  // Only generates proof
}
```

**Performance improvement:** 2-3x faster for subsequent proofs

### Use Web Workers (Browser)

Offload proof generation to prevent UI blocking:

```javascript
// proof-worker.js
import { ProofGenerator } from 'openzktool';

const generator = new ProofGenerator();
await generator.preload();

self.addEventListener('message', async (event) => {
  const { userData } = event.data;

  try {
    const proof = await generator.generate(userData);
    self.postMessage({ success: true, proof });
  } catch (error) {
    self.postMessage({ success: false, error: error.message });
  }
});
```

```javascript
// main.js
const worker = new Worker('proof-worker.js');

function generateProofAsync(userData) {
  return new Promise((resolve, reject) => {
    worker.onmessage = (event) => {
      if (event.data.success) {
        resolve(event.data.proof);
      } else {
        reject(new Error(event.data.error));
      }
    };

    worker.postMessage({ userData });
  });
}

// UI stays responsive during proof generation!
const proof = await generateProofAsync(userData);
```

### Batch Verifications

Verify multiple proofs in parallel:

```javascript
// ❌ SLOW: Sequential verification
async function slowBatchVerify(proofs) {
  const results = [];
  for (const proof of proofs) {
    const isValid = await verifier.verify(proof);
    results.push(isValid);
  }
  return results;
}

// ✅ FAST: Parallel verification
async function fastBatchVerify(proofs) {
  const results = await Promise.all(
    proofs.map(proof => verifier.verify(proof))
  );
  return results;
}
```

**Performance improvement:** N times faster for N proofs

### Cache Verification Results

For proofs that don't change, cache verification results:

```javascript
const verificationCache = new Map();

async function verifyWithCache(proof) {
  const proofHash = hashProof(proof);

  if (verificationCache.has(proofHash)) {
    return verificationCache.get(proofHash);
  }

  const isValid = await verifier.verify(proof);
  verificationCache.set(proofHash, isValid);

  return isValid;
}

function hashProof(proof) {
  return crypto
    .createHash('sha256')
    .update(JSON.stringify(proof))
    .digest('hex');
}
```

## Error Handling Best Practices

### Comprehensive Error Handling

```javascript
import { ProofGenerator, ProofError } from 'openzktool';

async function robustProofGeneration(userData) {
  try {
    const generator = new ProofGenerator();
    const proof = await generator.generate(userData);

    return {
      success: true,
      proof,
      kycValid: proof.publicSignals[0] === '1'
    };

  } catch (error) {
    if (error instanceof ProofError) {
      switch (error.code) {
        case 'CONSTRAINT_VIOLATION':
          // User's data doesn't meet requirements
          return {
            success: false,
            error: 'Requirements not met',
            details: {
              age: userData.age < userData.minAge || userData.age > userData.maxAge,
              balance: userData.balance < userData.minBalance,
              country: !userData.allowedCountries.includes(userData.country)
            }
          };

        case 'INVALID_INPUT':
          // Input format is wrong
          return {
            success: false,
            error: 'Invalid input format',
            message: error.message
          };

        case 'MISSING_FILES':
          // Circuit files not found
          return {
            success: false,
            error: 'System not configured',
            files: error.files
          };

        default:
          // Unknown error
          console.error('Unknown proof error:', error);
          return {
            success: false,
            error: 'Proof generation failed'
          };
      }
    } else {
      // Non-proof error
      console.error('Unexpected error:', error);
      return {
        success: false,
        error: 'Unexpected error occurred'
      };
    }
  }
}
```

### Retry Logic for Network Failures

```javascript
async function verifyWithRetry(proof, maxRetries = 3) {
  let lastError;

  for (let i = 0; i < maxRetries; i++) {
    try {
      const result = await verifier.submit(proof);
      return result;
    } catch (error) {
      lastError = error;

      // Only retry on network errors, not invalid proofs
      if (error.message.includes('network') || error.message.includes('timeout')) {
        console.log(`Retry ${i + 1}/${maxRetries}...`);
        await sleep(1000 * Math.pow(2, i));  // Exponential backoff
        continue;
      } else {
        // Don't retry for other errors (e.g., invalid proof)
        throw error;
      }
    }
  }

  throw new Error(`Failed after ${maxRetries} retries: ${lastError.message}`);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
```

## Testing Best Practices

### Unit Tests

```javascript
import { describe, it, expect, beforeAll } from 'vitest';
import { ProofGenerator, ProofVerifier } from 'openzktool';

describe('KYC Proof System', () => {
  let generator, verifier;

  beforeAll(async () => {
    generator = new ProofGenerator();
    verifier = new ProofVerifier();
    await generator.preload();  // Speed up tests
  });

  describe('Valid proofs', () => {
    it('should accept eligible user (all checks pass)', async () => {
      const proof = await generator.generate({
        age: 25,
        balance: 1000,
        country: 1,
        minAge: 18,
        maxAge: 99,
        minBalance: 100,
        allowedCountries: [1, 2, 3, 0, 0, 0, 0, 0, 0, 0]
      });

      expect(proof.publicSignals[0]).toBe('1');
      const isValid = await verifier.verify(proof);
      expect(isValid).toBe(true);
    });

    it('should accept user at minimum age boundary', async () => {
      const proof = await generator.generate({
        age: 18,  // Exactly minimum
        balance: 1000,
        country: 1,
        minAge: 18,
        maxAge: 99,
        minBalance: 100,
        allowedCountries: [1, 2, 3, 0, 0, 0, 0, 0, 0, 0]
      });

      expect(proof.publicSignals[0]).toBe('1');
    });
  });

  describe('Invalid proofs', () => {
    it('should reject underage user', async () => {
      const proof = await generator.generate({
        age: 17,  // Below minimum
        balance: 1000,
        country: 1,
        minAge: 18,
        maxAge: 99,
        minBalance: 100,
        allowedCountries: [1, 2, 3, 0, 0, 0, 0, 0, 0, 0]
      });

      expect(proof.publicSignals[0]).toBe('0');
    });

    it('should reject insufficient balance', async () => {
      const proof = await generator.generate({
        age: 25,
        balance: 99,  // Below minimum
        country: 1,
        minAge: 18,
        maxAge: 99,
        minBalance: 100,
        allowedCountries: [1, 2, 3, 0, 0, 0, 0, 0, 0, 0]
      });

      expect(proof.publicSignals[0]).toBe('0');
    });

    it('should reject disallowed country', async () => {
      const proof = await generator.generate({
        age: 25,
        balance: 1000,
        country: 99,  // Not in allowed list
        minAge: 18,
        maxAge: 99,
        minBalance: 100,
        allowedCountries: [1, 2, 3, 0, 0, 0, 0, 0, 0, 0]
      });

      expect(proof.publicSignals[0]).toBe('0');
    });
  });
});
```

### Integration Tests

```javascript
describe('Soroban Integration', () => {
  let generator, verifier;

  beforeAll(() => {
    generator = new ProofGenerator();
    verifier = new SorobanVerifier({
      contractId: process.env.TEST_CONTRACT_ID,
      network: 'testnet',
      secretKey: process.env.TEST_SECRET_KEY
    });
  });

  it('should verify valid proof on-chain', async () => {
    const proof = await generator.generate({
      age: 25,
      balance: 1000,
      country: 1,
      minAge: 18,
      maxAge: 99,
      minBalance: 100,
      allowedCountries: [1, 2, 3, 0, 0, 0, 0, 0, 0, 0]
    });

    const result = await verifier.submit(proof);

    expect(result.success).toBe(true);
    expect(result.result).toBe(true);
    expect(result.txHash).toBeDefined();
  });
});
```

## Deployment Best Practices

### Environment Configuration

```bash
# .env.development
NODE_ENV=development
STELLAR_NETWORK=testnet
STELLAR_SECRET_KEY=STEST...
CONTRACT_ID=CTEST...
DEBUG=true

# .env.production
NODE_ENV=production
STELLAR_NETWORK=mainnet
STELLAR_SECRET_KEY=SPROD...
CONTRACT_ID=CPROD...
DEBUG=false
```

```javascript
// config.js
export const config = {
  network: process.env.STELLAR_NETWORK || 'testnet',
  secretKey: process.env.STELLAR_SECRET_KEY,
  contractId: process.env.CONTRACT_ID,
  debug: process.env.DEBUG === 'true',

  // Circuit paths
  circuitWasm: process.env.CIRCUIT_WASM || './circuits/build/kyc_transfer.wasm',
  circuitZkey: process.env.CIRCUIT_ZKEY || './circuits/build/kyc_transfer_final.zkey',
  verificationKey: process.env.VERIFICATION_KEY || './circuits/build/verification_key.json'
};
```

### Monitoring & Logging

```javascript
import { ProofGenerator } from 'openzktool';
import * as Sentry from '@sentry/node';

async function monitoredProofGeneration(userData) {
  const startTime = Date.now();

  try {
    const generator = new ProofGenerator();
    const proof = await generator.generate(userData);

    const duration = Date.now() - startTime;

    // Log metrics
    console.log('Proof generated', {
      duration,
      kycValid: proof.publicSignals[0] === '1',
      proofSize: JSON.stringify(proof).length
    });

    // Send to monitoring service
    metrics.histogram('proof.generation.duration', duration);
    metrics.increment('proof.generation.success');

    return proof;

  } catch (error) {
    const duration = Date.now() - startTime;

    // Log error
    console.error('Proof generation failed', {
      duration,
      error: error.message,
      stack: error.stack
    });

    // Send to error tracking
    Sentry.captureException(error);
    metrics.increment('proof.generation.error');

    throw error;
  }
}
```

### Rate Limiting

```javascript
import rateLimit from 'express-rate-limit';

// Limit proof generation requests
const proofLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Max 10 proofs per 15 minutes per IP
  message: 'Too many proof generation requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.post('/api/proof/generate', proofLimiter, async (req, res) => {
  // Handle proof generation
});

// Limit verification requests
const verifyLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30, // Max 30 verifications per minute per IP
  message: 'Too many verification requests, please try again later.'
});

app.post('/api/proof/verify', verifyLimiter, async (req, res) => {
  // Handle verification
});
```

## Architecture Patterns

### Microservices Architecture

```
┌─────────────┐      ┌──────────────────┐      ┌─────────────┐
│   Client    │─────▶│  Proof Service   │─────▶│  Soroban    │
│  (Browser)  │      │   (Node.js API)  │      │  Verifier   │
└─────────────┘      └──────────────────┘      └─────────────┘
      │                       │
      │                       ▼
      │              ┌──────────────────┐
      └─────────────▶│  Static Assets   │
                     │   (CDN/IPFS)     │
                     └──────────────────┘
```

**Benefits:**
- Client generates proofs (privacy preserved)
- Backend only handles verification
- Scalable verification service
- Circuit files served from CDN

### Serverless Architecture

```javascript
// AWS Lambda handler
export const handler = async (event) => {
  const { proof } = JSON.parse(event.body);

  const verifier = new SorobanVerifier({
    contractId: process.env.CONTRACT_ID,
    network: 'mainnet'
  });

  try {
    const isValid = await verifier.verify(proof);

    return {
      statusCode: 200,
      body: JSON.stringify({ valid: isValid })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
```

## Next Steps

- **[Security Guide →](./security)** - Comprehensive security practices
- **[Monitoring →](./monitoring)** - Production monitoring setup
- **[Custom Circuits →](./custom-circuits)** - Build custom circuits

---

**Questions?** [GitHub Discussions](https://github.com/xcapit/openzktool/discussions)
