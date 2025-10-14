# OpenZKTool Integration Guide
**Complete guide for integrating Zero-Knowledge Proofs into your application**

---

## Table of Contents

1. [Quick Start](#quick-start)
2. [Architecture Overview](#architecture-overview)
3. [Frontend Integration](#frontend-integration)
4. [Backend Integration](#backend-integration)
5. [Smart Contract Integration](#smart-contract-integration)
6. [Multi-Chain Deployment](#multi-chain-deployment)
7. [Production Checklist](#production-checklist)
8. [Troubleshooting](#troubleshooting)

---

## Quick Start

### 5-Minute Integration

```bash
# 1. Install dependencies
npm install snarkjs circomlib

# 2. Copy circuit artifacts to your project
cp circuits/artifacts/kyc_transfer.wasm public/
cp circuits/artifacts/kyc_transfer_final.zkey public/
cp circuits/artifacts/kyc_transfer_vkey.json public/

# 3. Generate a proof (Node.js or Browser)
import { groth16 } from "snarkjs";

const input = {
  age: 25,
  balance: 150,
  countryId: 32,
  minAge: 18,
  minBalance: 50,
  allowedCountries: [32, 1, 5]
};

const { proof, publicSignals } = await groth16.fullProve(
  input,
  "kyc_transfer.wasm",
  "kyc_transfer_final.zkey"
);

// publicSignals[0] === "1" means KYC passed ✅
console.log("KYC Valid:", publicSignals[0] === "1");
```

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      Your Application                        │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐         ┌──────────────┐                 │
│  │   Frontend   │         │   Backend    │                 │
│  │ (React/Vue)  │◄───────►│  (Node.js)   │                 │
│  └──────┬───────┘         └──────┬───────┘                 │
│         │                         │                          │
│         │ Proof Generation        │ Proof Verification       │
│         ▼                         ▼                          │
│  ┌──────────────┐         ┌──────────────┐                 │
│  │  snarkjs     │         │  snarkjs     │                 │
│  │  (Browser)   │         │  (Server)    │                 │
│  └──────┬───────┘         └──────┬───────┘                 │
│         │                         │                          │
└─────────┼─────────────────────────┼──────────────────────────┘
          │                         │
          │                         │
          ▼                         ▼
┌─────────────────────────────────────────────────────────────┐
│                   Blockchain Layer                           │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│   ┌──────────────────┐           ┌──────────────────┐      │
│   │   Ethereum/EVM   │           │ Stellar Soroban  │      │
│   │                  │           │                  │      │
│   │  ┌────────────┐  │           │  ┌────────────┐  │      │
│   │  │ Verifier   │  │           │  │ Verifier   │  │      │
│   │  │ Contract   │  │           │  │ Contract   │  │      │
│   │  │ (Solidity) │  │           │  │ (Rust)     │  │      │
│   │  └────────────┘  │           │  └────────────┘  │      │
│   └──────────────────┘           └──────────────────┘      │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## Frontend Integration

### React Example

#### 1. Install Dependencies

```bash
npm install snarkjs ethers @stellar/stellar-sdk
```

#### 2. Create Proof Generation Hook

```typescript
// hooks/useZKProof.ts
import { useState } from 'react';
import { groth16 } from 'snarkjs';

interface KYCInput {
  age: number;
  balance: number;
  countryId: number;
  minAge: number;
  minBalance: number;
  allowedCountries: number[];
}

export function useZKProof() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const generateProof = async (input: KYCInput) => {
    setLoading(true);
    setError(null);

    try {
      const { proof, publicSignals } = await groth16.fullProve(
        input,
        '/kyc_transfer.wasm',
        '/kyc_transfer_final.zkey'
      );

      const kycValid = publicSignals[0] === '1';

      return {
        proof,
        publicSignals,
        kycValid,
        proofSize: JSON.stringify(proof).length
      };
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { generateProof, loading, error };
}
```

#### 3. Create KYC Verification Component

```typescript
// components/KYCVerification.tsx
import { useState } from 'react';
import { useZKProof } from '../hooks/useZKProof';

export function KYCVerification() {
  const { generateProof, loading } = useZKProof();
  const [result, setResult] = useState<any>(null);

  const [formData, setFormData] = useState({
    age: '',
    balance: '',
    countryId: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const input = {
      age: parseInt(formData.age),
      balance: parseInt(formData.balance),
      countryId: parseInt(formData.countryId),
      minAge: 18,
      minBalance: 50,
      allowedCountries: [1, 5, 32, 44, 54] // US, Brazil, Argentina, UK, Australia
    };

    try {
      const proofResult = await generateProof(input);
      setResult(proofResult);
    } catch (error) {
      console.error('Proof generation failed:', error);
    }
  };

  return (
    <div className="kyc-verification">
      <h2>Private KYC Verification</h2>
      <p>Your data stays private. Only the result is public.</p>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Age:</label>
          <input
            type="number"
            value={formData.age}
            onChange={(e) => setFormData({ ...formData, age: e.target.value })}
            required
          />
        </div>

        <div>
          <label>Balance ($):</label>
          <input
            type="number"
            value={formData.balance}
            onChange={(e) => setFormData({ ...formData, balance: e.target.value })}
            required
          />
        </div>

        <div>
          <label>Country Code:</label>
          <input
            type="number"
            value={formData.countryId}
            onChange={(e) => setFormData({ ...formData, countryId: e.target.value })}
            required
          />
          <small>1=USA, 5=Brazil, 32=Argentina, 44=UK, 54=Australia</small>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Generating Proof...' : 'Generate Proof'}
        </button>
      </form>

      {result && (
        <div className="result">
          <h3>Proof Generated! 🎉</h3>
          <p>
            <strong>KYC Status:</strong>{' '}
            {result.kycValid ? (
              <span style={{ color: 'green' }}>✅ Valid</span>
            ) : (
              <span style={{ color: 'red' }}>❌ Invalid</span>
            )}
          </p>
          <p>
            <strong>Proof Size:</strong> {result.proofSize} bytes
          </p>
          <details>
            <summary>View Proof Data</summary>
            <pre>{JSON.stringify(result.proof, null, 2)}</pre>
          </details>
        </div>
      )}
    </div>
  );
}
```

#### 4. On-Chain Verification (Ethereum)

```typescript
// utils/verifyOnChain.ts
import { ethers } from 'ethers';

const VERIFIER_ABI = [
  'function verifyProof(uint256[2] memory a, uint256[2][2] memory b, uint256[2] memory c, uint256[1] memory input) public view returns (bool)'
];

export async function verifyOnEthereum(
  proof: any,
  publicSignals: string[],
  contractAddress: string
) {
  // Connect to Ethereum
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send('eth_requestAccounts', []);
  const signer = provider.getSigner();

  // Load contract
  const verifier = new ethers.Contract(contractAddress, VERIFIER_ABI, signer);

  // Format proof for Solidity
  const formattedProof = {
    a: [proof.pi_a[0], proof.pi_a[1]],
    b: [
      [proof.pi_b[0][1], proof.pi_b[0][0]],
      [proof.pi_b[1][1], proof.pi_b[1][0]]
    ],
    c: [proof.pi_c[0], proof.pi_c[1]],
    input: publicSignals
  };

  // Verify on-chain
  const tx = await verifier.verifyProof(
    formattedProof.a,
    formattedProof.b,
    formattedProof.c,
    formattedProof.input
  );

  return tx;
}
```

#### 5. On-Chain Verification (Stellar Soroban)

```typescript
// utils/verifyOnSoroban.ts
import * as StellarSdk from '@stellar/stellar-sdk';

export async function verifyOnSoroban(
  proof: any,
  publicSignals: string[],
  contractId: string,
  networkPassphrase: string
) {
  // Connect to Stellar
  const server = new StellarSdk.Server('https://soroban-testnet.stellar.org');

  // Load contract
  const contract = new StellarSdk.Contract(contractId);

  // Format proof for Soroban
  const proofBytes = StellarSdk.xdr.ScVal.scvBytes(
    Buffer.from(JSON.stringify(proof))
  );

  const publicSignalsBytes = StellarSdk.xdr.ScVal.scvBytes(
    Buffer.from(JSON.stringify(publicSignals))
  );

  // Build transaction
  const account = await server.getAccount(sourceAccount);

  const transaction = new StellarSdk.TransactionBuilder(account, {
    fee: StellarSdk.BASE_FEE,
    networkPassphrase
  })
    .addOperation(
      contract.call('verify_proof', proofBytes, publicSignalsBytes)
    )
    .setTimeout(30)
    .build();

  // Sign and submit
  transaction.sign(StellarSdk.Keypair.fromSecret(secretKey));
  const result = await server.sendTransaction(transaction);

  return result;
}
```

---

## Backend Integration

### Node.js Express Example

#### 1. Setup Server

```javascript
// server.js
const express = require('express');
const { groth16 } = require('snarkjs');
const fs = require('fs');

const app = express();
app.use(express.json());

// Load verification key once at startup
const vkey = JSON.parse(
  fs.readFileSync('./artifacts/kyc_transfer_vkey.json', 'utf8')
);

// Endpoint to verify proofs
app.post('/api/verify-proof', async (req, res) => {
  try {
    const { proof, publicSignals } = req.body;

    // Verify proof server-side
    const isValid = await groth16.verify(vkey, publicSignals, proof);

    if (!isValid) {
      return res.status(400).json({
        success: false,
        error: 'Invalid proof'
      });
    }

    // Check if KYC passed
    const kycPassed = publicSignals[0] === '1';

    if (kycPassed) {
      // Grant access to user
      // Store result in database
      // Issue JWT token
      // etc.

      return res.json({
        success: true,
        message: 'KYC verification passed',
        kycValid: true
      });
    } else {
      return res.status(403).json({
        success: false,
        error: 'KYC requirements not met'
      });
    }
  } catch (error) {
    console.error('Verification error:', error);
    return res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
});

// Endpoint to generate proofs server-side (optional)
app.post('/api/generate-proof', async (req, res) => {
  try {
    const { age, balance, countryId } = req.body;

    const input = {
      age,
      balance,
      countryId,
      minAge: 18,
      minBalance: 50,
      allowedCountries: [1, 5, 32, 44, 54]
    };

    const { proof, publicSignals } = await groth16.fullProve(
      input,
      './artifacts/kyc_transfer.wasm',
      './artifacts/kyc_transfer_final.zkey'
    );

    return res.json({
      success: true,
      proof,
      publicSignals,
      kycValid: publicSignals[0] === '1'
    });
  } catch (error) {
    console.error('Proof generation error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to generate proof'
    });
  }
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
```

#### 2. Database Integration (SQLite Example)

```javascript
// db.js
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./proofs.db');

// Create table for storing proof verification results
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS verifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      proof_hash TEXT NOT NULL,
      kyc_valid BOOLEAN NOT NULL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      blockchain TEXT,
      tx_hash TEXT
    )
  `);
});

// Store verification result
function storeVerification(userId, proofHash, kycValid, blockchain, txHash) {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO verifications (user_id, proof_hash, kyc_valid, blockchain, tx_hash)
       VALUES (?, ?, ?, ?, ?)`,
      [userId, proofHash, kycValid, blockchain, txHash],
      function (err) {
        if (err) reject(err);
        else resolve(this.lastID);
      }
    );
  });
}

// Retrieve verification history
function getVerificationHistory(userId) {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT * FROM verifications WHERE user_id = ? ORDER BY timestamp DESC`,
      [userId],
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      }
    );
  });
}

module.exports = { storeVerification, getVerificationHistory };
```

---

## Smart Contract Integration

### Ethereum/Solidity Example

```solidity
// contracts/KYCGate.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Verifier.sol"; // Generated by snarkjs

contract KYCGate {
    Verifier public verifier;
    mapping(address => bool) public kycVerified;
    mapping(address => uint256) public lastVerificationTime;

    event KYCVerified(address indexed user, uint256 timestamp);

    constructor(address _verifierAddress) {
        verifier = Verifier(_verifierAddress);
    }

    /**
     * @dev Verify KYC proof and grant access
     * @param a Proof component
     * @param b Proof component
     * @param c Proof component
     * @param input Public signals (kycValid)
     */
    function verifyKYC(
        uint256[2] memory a,
        uint256[2][2] memory b,
        uint256[2] memory c,
        uint256[1] memory input
    ) external {
        // Verify proof on-chain
        bool isValid = verifier.verifyProof(a, b, c, input);
        require(isValid, "Invalid proof");

        // Check if KYC passed (input[0] === 1)
        require(input[0] == 1, "KYC requirements not met");

        // Grant access
        kycVerified[msg.sender] = true;
        lastVerificationTime[msg.sender] = block.timestamp;

        emit KYCVerified(msg.sender, block.timestamp);
    }

    /**
     * @dev Check if user has valid KYC
     * @param user Address to check
     */
    function isKYCValid(address user) external view returns (bool) {
        // Optionally add expiration check
        uint256 expirationTime = 30 days;

        if (!kycVerified[user]) return false;

        if (block.timestamp > lastVerificationTime[user] + expirationTime) {
            return false;
        }

        return true;
    }

    /**
     * @dev Restricted function that requires KYC
     */
    function restrictedAction() external view {
        require(kycVerified[msg.sender], "KYC verification required");
        require(
            block.timestamp <= lastVerificationTime[msg.sender] + 30 days,
            "KYC expired"
        );

        // Your restricted logic here
        // e.g., allow token transfers, access to services, etc.
    }
}
```

### Stellar Soroban/Rust Example

```rust
// soroban/src/lib.rs
#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, Env, Symbol, Vec};

#[contracttype]
pub struct Proof {
    pub pi_a: Vec<u8>,
    pub pi_b: Vec<u8>,
    pub pi_c: Vec<u8>,
}

#[contract]
pub struct KYCGate;

#[contractimpl]
impl KYCGate {
    /// Verify ZK proof and grant KYC access
    pub fn verify_kyc(
        env: Env,
        user: Address,
        proof: Proof,
        public_signals: Vec<u8>,
    ) -> Result<bool, Error> {
        // Verify proof (actual Groth16 verification)
        let is_valid = Self::verify_groth16_proof(&proof, &public_signals)?;

        if !is_valid {
            return Err(Error::InvalidProof);
        }

        // Parse public signals to check if KYC passed
        let kyc_valid = Self::parse_kyc_result(&public_signals)?;

        if !kyc_valid {
            return Err(Error::KYCFailed);
        }

        // Store verification result
        let storage_key = Symbol::new(&env, "kyc_verified");
        env.storage().persistent().set(&storage_key, &user);

        // Emit event
        env.events()
            .publish((Symbol::new(&env, "KYCVerified"), user), ());

        Ok(true)
    }

    /// Check if user has valid KYC
    pub fn is_kyc_valid(env: Env, user: Address) -> bool {
        let storage_key = Symbol::new(&env, "kyc_verified");
        env.storage().persistent().has(&storage_key)
    }

    // Internal verification logic
    fn verify_groth16_proof(proof: &Proof, public_signals: &Vec<u8>) -> Result<bool, Error> {
        // Full BN254 pairing check implementation
        // (See soroban/src/lib.rs for complete implementation)
        // ...
        Ok(true)
    }

    fn parse_kyc_result(public_signals: &Vec<u8>) -> Result<bool, Error> {
        // First byte should be 1 for valid KYC
        if public_signals.len() < 1 {
            return Err(Error::InvalidInput);
        }
        Ok(public_signals.get(0).unwrap() == 1)
    }
}
```

---

## Multi-Chain Deployment

### Deploy to Ethereum (using Hardhat)

```javascript
// scripts/deploy.js
const hre = require("hardhat");

async function main() {
  // Deploy Verifier contract
  const Verifier = await hre.ethers.getContractFactory("Verifier");
  const verifier = await Verifier.deploy();
  await verifier.deployed();
  console.log("Verifier deployed to:", verifier.address);

  // Deploy KYCGate contract
  const KYCGate = await hre.ethers.getContractFactory("KYCGate");
  const kycGate = await KYCGate.deploy(verifier.address);
  await kycGate.deployed();
  console.log("KYCGate deployed to:", kycGate.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```

```bash
# Deploy to various networks
npx hardhat run scripts/deploy.js --network localhost  # Local Anvil
npx hardhat run scripts/deploy.js --network sepolia    # Ethereum Sepolia
npx hardhat run scripts/deploy.js --network polygon    # Polygon Mainnet
npx hardhat run scripts/deploy.js --network optimism   # Optimism
npx hardhat run scripts/deploy.js --network arbitrum   # Arbitrum
```

### Deploy to Stellar Soroban

```bash
# Build contract
cd soroban
cargo build --target wasm32-unknown-unknown --release

# Optimize WASM
soroban contract optimize \
  --wasm target/wasm32-unknown-unknown/release/soroban_groth16_verifier.wasm

# Deploy to testnet
soroban contract deploy \
  --wasm target/wasm32-unknown-unknown/release/soroban_groth16_verifier_optimized.wasm \
  --network testnet \
  --source <YOUR_SECRET_KEY>

# Deploy to mainnet (when ready)
soroban contract deploy \
  --wasm target/wasm32-unknown-unknown/release/soroban_groth16_verifier_optimized.wasm \
  --network mainnet \
  --source <YOUR_SECRET_KEY>
```

---

## Production Checklist

### Security
- [ ] Circuit audited by professional security firm
- [ ] Trusted setup ceremony completed (multi-party)
- [ ] Smart contracts audited
- [ ] Rate limiting on proof generation endpoints
- [ ] Input validation and sanitization
- [ ] Secure key management (never expose proving keys publicly)

### Performance
- [ ] Circuit optimized (<10,000 constraints)
- [ ] Proof generation <2 seconds
- [ ] Verification <100ms off-chain
- [ ] Gas costs optimized (<300k gas for EVM)
- [ ] WASM binary size optimized (<50KB for Soroban)

### Infrastructure
- [ ] CDN for serving circuit artifacts (WASM, zkey files)
- [ ] Caching for verification keys
- [ ] Load balancing for API endpoints
- [ ] Monitoring and alerting
- [ ] Backup and disaster recovery

### User Experience
- [ ] Clear error messages
- [ ] Loading states during proof generation
- [ ] Progress indicators
- [ ] Fallback for unsupported browsers
- [ ] Mobile-responsive design

### Compliance
- [ ] Privacy policy (GDPR, CCPA compliance)
- [ ] Terms of service
- [ ] Data retention policies
- [ ] Audit trail for verifications
- [ ] Regulatory compliance (if applicable)

---

## Troubleshooting

### Common Issues

#### Issue: Proof generation is slow (>5 seconds)

**Solutions**:
- Use Web Workers in browser to avoid blocking main thread
- Optimize circuit (reduce constraints)
- Use server-side generation for complex proofs
- Pre-load WASM files

```javascript
// Use Web Worker
const worker = new Worker('/proof-worker.js');
worker.postMessage({ input, wasmPath, zkeyPath });
worker.onmessage = (e) => {
  const { proof, publicSignals } = e.data;
  console.log('Proof generated!', proof);
};
```

#### Issue: "Cannot find module 'snarkjs'"

**Solution**: Ensure snarkjs is installed
```bash
npm install snarkjs
```

#### Issue: Proof verification fails on-chain but works off-chain

**Solutions**:
- Check proof formatting (Solidity expects different format than snarkjs)
- Ensure verification key matches deployed contract
- Check gas limit (may need >250k gas)

#### Issue: CORS errors when loading WASM files

**Solution**: Configure server headers
```javascript
// Express.js
app.use((req, res, next) => {
  res.header('Cross-Origin-Embedder-Policy', 'require-corp');
  res.header('Cross-Origin-Opener-Policy', 'same-origin');
  next();
});
```

#### Issue: Out of memory during proof generation

**Solutions**:
- Increase Node.js memory limit: `NODE_OPTIONS=--max-old-space-size=4096 node script.js`
- Use streaming for large inputs
- Optimize circuit to reduce constraints

---

## Next Steps

1. **Read the examples**: Check `/examples` directory for complete integration examples
2. **Customize the circuit**: Modify `circuits/kyc_transfer.circom` for your use case
3. **Test thoroughly**: Use `npm test` to run full test suite
4. **Deploy to testnet**: Test on Sepolia (Ethereum) or Testnet (Stellar)
5. **Get audited**: Professional security audit before mainnet deployment

---

## Resources

- **snarkjs documentation**: https://github.com/iden3/snarkjs
- **Circom language**: https://docs.circom.io/
- **Ethers.js**: https://docs.ethers.io/
- **Stellar SDK**: https://developers.stellar.org/docs
- **OpenZKTool GitHub**: https://github.com/xcapit/stellar-privacy-poc

---

**Questions?** Open an issue on GitHub or join our community discussions!
