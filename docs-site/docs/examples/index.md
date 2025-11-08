---
sidebar_position: 5
---

# Examples & Tutorials

Practical examples and integration guides for building with OpenZKTool.

## Quick Examples

### Basic KYC Verification

Generate and verify a proof locally:

```javascript
const { ProofGenerator, ProofVerifier } = require('openzktool');

async function verifyKYC() {
  // Initialize
  const generator = new ProofGenerator();
  const verifier = new ProofVerifier();

  // User's private data (never leaves their device!)
  const userData = {
    age: 25,
    balance: 1500,
    country: 1,  // Argentina
    minAge: 18,
    maxAge: 99,
    minBalance: 100,
    allowedCountries: [1, 2, 3, 0, 0, 0, 0, 0, 0, 0]
  };

  // Generate proof (takes ~1 second)
  console.log('Generating proof...');
  const proof = await generator.generate(userData);

  // Check result
  const kycValid = proof.publicSignals[0] === '1';
  console.log('KYC Valid:', kycValid);

  // Verify proof
  const isValid = await verifier.verify(proof);
  console.log('Proof verified:', isValid);
}

verifyKYC();
```

### On-Chain Verification (Soroban)

Submit proof to Stellar blockchain:

```javascript
const { ProofGenerator, SorobanVerifier } = require('openzktool');

async function verifyOnChain() {
  // Generate proof
  const generator = new ProofGenerator();
  const proof = await generator.generate({
    age: 30,
    balance: 2000,
    country: 2,
    minAge: 21,  // Minimum age for this dApp
    maxAge: 99,
    minBalance: 500,
    allowedCountries: [1, 2, 3, 4, 5, 0, 0, 0, 0, 0]
  });

  // Verify on Stellar Soroban
  const verifier = new SorobanVerifier({
    contractId: 'CBPBVJJW5NMV4UVEDKSR6UO4DRBNWRQEMYKRYZI3CW6YK3O7HAZA43OI',
    network: 'testnet',
    secretKey: process.env.STELLAR_SECRET_KEY
  });

  // Submit transaction
  const result = await verifier.submit(proof);

  console.log('Transaction:', result.txHash);
  console.log('Result:', result.result ? 'VALID' : 'INVALID');
  console.log('Fee:', result.cost.fee / 1e7, 'XLM');
  console.log('Explorer:', `https://stellar.expert/explorer/testnet/tx/${result.txHash}`);
}

verifyOnChain();
```

## Integration Examples

### React dApp

Complete React integration with wallet connection:

```typescript
// components/KYCVerification.tsx
import { useState } from 'react';
import { ProofGenerator, SorobanVerifier } from 'openzktool';
import { useStellarWallet } from '@stellar/wallet-kit';

export function KYCVerification() {
  const [proof, setProof] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const wallet = useStellarWallet();

  const handleVerify = async () => {
    setLoading(true);
    setStatus('Generating proof...');

    try {
      // Get user data from form/state
      const userData = {
        age: 25,
        balance: 1000,
        country: 1,
        minAge: 18,
        maxAge: 99,
        minBalance: 100,
        allowedCountries: [1, 2, 3, 0, 0, 0, 0, 0, 0, 0]
      };

      // Generate proof locally (privacy preserved!)
      const generator = new ProofGenerator();
      const generatedProof = await generator.generate(userData);
      setProof(generatedProof);
      setStatus('Proof generated! Submitting to blockchain...');

      // Verify on Soroban
      const verifier = new SorobanVerifier({
        contractId: 'CBPBVJJW5NMV4UVEDKSR6UO4DRBNWRQEMYKRYZI3CW6YK3O7HAZA43OI',
        network: 'testnet',
        secretKey: wallet.secretKey
      });

      const result = await verifier.submit(generatedProof);
      setStatus(`Verified! TX: ${result.txHash}`);
    } catch (error) {
      setStatus(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="kyc-verification">
      <h2>KYC Verification</h2>
      <button onClick={handleVerify} disabled={loading}>
        {loading ? 'Processing...' : 'Verify KYC'}
      </button>
      {status && <p>{status}</p>}
      {proof && (
        <div>
          <h3>Proof Generated</h3>
          <p>KYC Valid: {proof.publicSignals[0] === '1' ? '✓' : '✗'}</p>
          <p>Size: {JSON.stringify(proof).length} bytes</p>
        </div>
      )}
    </div>
  );
}
```

### Express.js API

Backend API for proof generation and verification:

```javascript
// server.js
const express = require('express');
const { ProofGenerator, SorobanVerifier } = require('openzktool');
const rateLimit = require('express-rate-limit');

const app = express();
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Initialize
const generator = new ProofGenerator();
const verifier = new SorobanVerifier({
  contractId: process.env.CONTRACT_ID,
  network: 'testnet'
});

// Generate proof endpoint
app.post('/api/proof/generate', async (req, res) => {
  try {
    const { age, balance, country, minAge, maxAge, minBalance, allowedCountries } = req.body;

    // Validate inputs
    if (!age || !balance || !country) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Generate proof
    const proof = await generator.generate({
      age,
      balance,
      country,
      minAge: minAge || 18,
      maxAge: maxAge || 99,
      minBalance: minBalance || 0,
      allowedCountries: allowedCountries || [1, 2, 3, 0, 0, 0, 0, 0, 0, 0]
    });

    res.json({
      success: true,
      proof,
      kycValid: proof.publicSignals[0] === '1'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Verify proof endpoint
app.post('/api/proof/verify', async (req, res) => {
  try {
    const { proof } = req.body;

    if (!proof) {
      return res.status(400).json({ error: 'Missing proof' });
    }

    // Verify on Soroban
    const isValid = await verifier.verify(proof);

    res.json({
      success: true,
      valid: isValid
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`OpenZKTool API running on port ${PORT}`);
});
```

### Next.js Application

Full-stack Next.js app with API routes:

```typescript
// pages/api/verify-kyc.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { ProofGenerator, SorobanVerifier } from 'openzktool';

const generator = new ProofGenerator();
const verifier = new SorobanVerifier({
  contractId: process.env.CONTRACT_ID!,
  network: 'testnet'
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { age, balance, country } = req.body;

    // Generate proof
    const proof = await generator.generate({
      age,
      balance,
      country,
      minAge: 18,
      maxAge: 99,
      minBalance: 100,
      allowedCountries: [1, 2, 3, 0, 0, 0, 0, 0, 0, 0]
    });

    // Verify on Soroban (optional)
    const isValid = await verifier.verify(proof);

    res.status(200).json({
      proof,
      verified: isValid,
      kycValid: proof.publicSignals[0] === '1'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
```

```typescript
// pages/verify.tsx
import { useState } from 'react';
import type { NextPage } from 'next';

const VerifyPage: NextPage = () => {
  const [formData, setFormData] = useState({
    age: '',
    balance: '',
    country: '1'
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/verify-kyc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          age: parseInt(formData.age),
          balance: parseInt(formData.balance),
          country: parseInt(formData.country)
        })
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>KYC Verification</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          placeholder="Age"
          value={formData.age}
          onChange={(e) => setFormData({ ...formData, age: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Balance"
          value={formData.balance}
          onChange={(e) => setFormData({ ...formData, balance: e.target.value })}
          required
        />
        <select
          value={formData.country}
          onChange={(e) => setFormData({ ...formData, country: e.target.value })}
        >
          <option value="1">Argentina</option>
          <option value="2">Brazil</option>
          <option value="3">Chile</option>
        </select>
        <button type="submit" disabled={loading}>
          {loading ? 'Verifying...' : 'Verify'}
        </button>
      </form>

      {result && (
        <div className="result">
          <h2>Result</h2>
          <p>KYC Valid: {result.kycValid ? '✓ Yes' : '✗ No'}</p>
          <p>Proof Verified: {result.verified ? '✓ Yes' : '✗ No'}</p>
        </div>
      )}
    </div>
  );
};

export default VerifyPage;
```

## Use Case Examples

### Age Verification (18+)

Prove you're over 18 without revealing exact age:

```javascript
const { ProofGenerator } = require('openzktool');

async function verifyAdult(userAge) {
  const generator = new ProofGenerator();

  const proof = await generator.generate({
    age: userAge,        // Private: actual age (e.g., 25)
    balance: 0,          // Not used
    country: 1,          // Not used
    minAge: 18,          // Public: minimum required
    maxAge: 150,         // Public: maximum
    minBalance: 0,       // Not used
    allowedCountries: [1, 2, 3, 0, 0, 0, 0, 0, 0, 0]
  });

  const isAdult = proof.publicSignals[0] === '1';
  return { proof, isAdult };
}

// Usage
const { proof, isAdult } = await verifyAdult(25);
console.log('User is 18+:', isAdult);
// The verifier learns: "User is 18+"
// The verifier NEVER learns: "User is 25"
```

### Balance Threshold

Prove balance > $1000 without revealing exact amount:

```javascript
async function verifyBalance(userBalance) {
  const generator = new ProofGenerator();

  const proof = await generator.generate({
    age: 18,             // Not used
    balance: userBalance, // Private: actual balance (e.g., $5000)
    country: 1,          // Not used
    minAge: 0,
    maxAge: 999,
    minBalance: 1000,    // Public: minimum required
    allowedCountries: [1, 2, 3, 0, 0, 0, 0, 0, 0, 0]
  });

  const meetsThreshold = proof.publicSignals[0] === '1';
  return { proof, meetsThreshold };
}

// Usage
const { proof, meetsThreshold } = await verifyBalance(5000);
console.log('Balance > $1000:', meetsThreshold);
// Verifier learns: "Balance > $1000"
// Verifier NEVER learns: "Balance = $5000"
```

### Geographic Compliance

Prove you're in an allowed country without revealing which one:

```javascript
async function verifyCountry(userCountry) {
  const generator = new ProofGenerator();

  const proof = await generator.generate({
    age: 18,
    balance: 0,
    country: userCountry,  // Private: actual country (e.g., 2 = Brazil)
    minAge: 0,
    maxAge: 999,
    minBalance: 0,
    allowedCountries: [1, 2, 3, 4, 5, 0, 0, 0, 0, 0] // Public: allowed list
  });

  const isAllowed = proof.publicSignals[0] === '1';
  return { proof, isAllowed };
}

// Usage
const { proof, isAllowed } = await verifyCountry(2);
console.log('Country allowed:', isAllowed);
// Verifier learns: "Country is in allowed list"
// Verifier NEVER learns: "Country is Brazil"
```

### Combined KYC (All Checks)

Verify age + balance + country in one proof:

```javascript
async function verifyFullKYC(userData) {
  const generator = new ProofGenerator();

  const proof = await generator.generate({
    age: userData.age,           // Private: 30
    balance: userData.balance,   // Private: $2500
    country: userData.country,   // Private: Argentina (1)
    minAge: 21,                  // Public: must be 21+
    maxAge: 65,                  // Public: must be under 65
    minBalance: 1000,            // Public: must have $1000+
    allowedCountries: [1, 2, 3, 0, 0, 0, 0, 0, 0, 0]  // Public: allowed countries
  });

  const kycValid = proof.publicSignals[0] === '1';
  return { proof, kycValid };
}

// Usage
const { proof, kycValid } = await verifyFullKYC({
  age: 30,
  balance: 2500,
  country: 1
});

console.log('KYC Valid:', kycValid);
// Verifier learns: "User meets ALL requirements"
// Verifier NEVER learns: actual age, balance, or country
```

## Advanced Patterns

### Proof Reuse

Generate once, verify multiple times:

```javascript
// User generates proof once
const proof = await generator.generate(userData);

// Store proof (e.g., in database, IPFS, or user's wallet)
await db.storeProof(userId, proof);

// Verify same proof multiple times
const verifier1 = new SorobanVerifier({ contractId: CONTRACT_A, ... });
const verifier2 = new SorobanVerifier({ contractId: CONTRACT_B, ... });

const valid1 = await verifier1.verify(proof);  // DeFi protocol
const valid2 = await verifier2.verify(proof);  // Gaming platform

// Same proof works across multiple dApps!
```

### Batch Verification

Verify multiple users efficiently:

```javascript
async function batchVerify(users) {
  const proofs = await Promise.all(
    users.map(user => generator.generate(user))
  );

  const results = await Promise.all(
    proofs.map(proof => verifier.verify(proof))
  );

  return users.map((user, i) => ({
    userId: user.id,
    valid: results[i]
  }));
}

// Usage
const results = await batchVerify([
  { id: 1, age: 25, balance: 1000, country: 1, ... },
  { id: 2, age: 30, balance: 2000, country: 2, ... },
  { id: 3, age: 35, balance: 3000, country: 3, ... }
]);

console.log(results);
// [{ userId: 1, valid: true }, { userId: 2, valid: true }, ...]
```

### Conditional Access Control

Grant access based on ZK proof:

```javascript
// Middleware for protected routes
async function requireKYC(req, res, next) {
  const { proof } = req.headers;

  if (!proof) {
    return res.status(401).json({ error: 'Proof required' });
  }

  try {
    const proofData = JSON.parse(proof);
    const verifier = new ProofVerifier();
    const isValid = await verifier.verify(proofData);

    if (!isValid || proofData.publicSignals[0] !== '1') {
      return res.status(403).json({ error: 'KYC verification failed' });
    }

    next();
  } catch (error) {
    res.status(400).json({ error: 'Invalid proof' });
  }
}

// Protected endpoint
app.get('/api/premium-features', requireKYC, (req, res) => {
  res.json({ message: 'Access granted!' });
});
```

## Testing Examples

### Unit Tests

```javascript
const { ProofGenerator, ProofVerifier } = require('openzktool');
const { expect } = require('chai');

describe('KYC Proof System', () => {
  let generator, verifier;

  before(async () => {
    generator = new ProofGenerator();
    verifier = new ProofVerifier();
  });

  it('should generate valid proof for eligible user', async () => {
    const proof = await generator.generate({
      age: 25,
      balance: 1000,
      country: 1,
      minAge: 18,
      maxAge: 99,
      minBalance: 100,
      allowedCountries: [1, 2, 3, 0, 0, 0, 0, 0, 0, 0]
    });

    expect(proof.publicSignals[0]).to.equal('1');
    const isValid = await verifier.verify(proof);
    expect(isValid).to.be.true;
  });

  it('should reject underage user', async () => {
    const proof = await generator.generate({
      age: 16,
      balance: 1000,
      country: 1,
      minAge: 18,
      maxAge: 99,
      minBalance: 100,
      allowedCountries: [1, 2, 3, 0, 0, 0, 0, 0, 0, 0]
    });

    expect(proof.publicSignals[0]).to.equal('0');
  });

  it('should reject insufficient balance', async () => {
    const proof = await generator.generate({
      age: 25,
      balance: 50,
      country: 1,
      minAge: 18,
      maxAge: 99,
      minBalance: 100,
      allowedCountries: [1, 2, 3, 0, 0, 0, 0, 0, 0, 0]
    });

    expect(proof.publicSignals[0]).to.equal('0');
  });
});
```

## Performance Benchmarks

```javascript
const { performance } = require('perf_hooks');

async function benchmark() {
  const generator = new ProofGenerator();
  const verifier = new ProofVerifier();

  const input = {
    age: 25,
    balance: 1000,
    country: 1,
    minAge: 18,
    maxAge: 99,
    minBalance: 100,
    allowedCountries: [1, 2, 3, 0, 0, 0, 0, 0, 0, 0]
  };

  // Proof generation benchmark
  const genStart = performance.now();
  const proof = await generator.generate(input);
  const genEnd = performance.now();
  console.log(`Proof generation: ${(genEnd - genStart).toFixed(2)}ms`);

  // Verification benchmark
  const verStart = performance.now();
  const isValid = await verifier.verify(proof);
  const verEnd = performance.now();
  console.log(`Verification: ${(verEnd - verStart).toFixed(2)}ms`);

  // Proof size
  const proofSize = JSON.stringify(proof).length;
  console.log(`Proof size: ${proofSize} bytes`);
}

benchmark();
```

## Next Steps

- **[Custom Circuits →](../advanced/custom-circuits)** - Build your own
- **[SDK Reference →](../api-reference/sdk)** - Full API docs
- **[Best Practices →](../advanced/best-practices)** - Production tips

---

**More examples?** [GitHub Repository](https://github.com/xcapit/openzktool/tree/main/examples)
