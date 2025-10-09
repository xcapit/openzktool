# 💻 Integration Examples

**Practical code examples for integrating ZKPrivacy into your applications**

---

## 📂 Available Examples

### 1. [React Integration](./react-integration/) 🎨
**Full-stack React app with ZK proof generation**

**What's included:**
- ✅ Browser-based proof generation
- ✅ Form UI for user inputs
- ✅ Real-time verification status
- ✅ MetaMask integration for on-chain verification
- ✅ Stellar wallet integration

**Tech stack:** React, TypeScript, snarkjs, ethers.js, Stellar SDK

**Use case:** Frontend DApp with privacy features

**Run it:**
```bash
cd react-integration
npm install
npm run dev
# Open http://localhost:3000
```

---

### 2. [Node.js Backend](./nodejs-backend/) ⚙️
**Express.js API server with proof verification**

**What's included:**
- ✅ REST API for proof submission
- ✅ Server-side proof verification
- ✅ Database integration (SQLite)
- ✅ Rate limiting and validation
- ✅ Multi-chain verification endpoints

**Tech stack:** Express.js, snarkjs, SQLite, ethers.js

**Use case:** Backend service for privacy-preserving authentication

**Run it:**
```bash
cd nodejs-backend
npm install
npm start
# API available at http://localhost:3001
```

---

### 3. [Custom Circuit](./custom-circuit/) 🔧
**Build your own ZK circuit from scratch**

**What's included:**
- ✅ Simple age verification circuit
- ✅ Credit score range proof circuit
- ✅ Step-by-step build scripts
- ✅ Testing framework
- ✅ Deployment guide

**Tech stack:** Circom, snarkjs, Foundry

**Use case:** Creating application-specific privacy proofs

**Run it:**
```bash
cd custom-circuit
bash build.sh
bash test.sh
```

---

## 🚀 Quick Start

### Prerequisites

Make sure you have:
- Node.js v18+
- npm or yarn
- Foundry (for EVM examples)
- Stellar CLI (for Soroban examples)

**Check your environment:**
```bash
node --version   # v18+
npm --version    # 8+
forge --version  # Any version
stellar --version # Any version
```

---

### Clone and Setup

```bash
# Clone the repo
git clone https://github.com/xcapit/stellar-privacy-poc.git
cd stellar-privacy-poc

# Setup circuits (one-time)
npm install
npm run setup

# Navigate to any example
cd examples/react-integration
npm install
npm run dev
```

---

## 📖 Learning Path

**Recommended order:**

1. **Start here:** [Custom Circuit](./custom-circuit/) - Understand how circuits work
2. **Then try:** [Node.js Backend](./nodejs-backend/) - Learn server-side verification
3. **Finally:** [React Integration](./react-integration/) - Build complete DApp

**Already know ZK basics?** Jump straight to [React Integration](./react-integration/)!

---

## 🎯 Use Case Matrix

| Example | Proof Generation | Verification | Best For |
|---------|------------------|--------------|----------|
| **React** | ✅ Browser | On-chain (MetaMask) | DApps, wallets |
| **Node.js** | ✅ Server | Off-chain (API) | Backend services, APIs |
| **Custom Circuit** | ✅ CLI | Both | New use cases, research |

---

## 📚 Code Snippets

### Generate Proof (Browser)

```javascript
import { groth16 } from "snarkjs";

async function generateProof(age, balance) {
  const input = {
    age: age,
    balance: balance,
    country: 11,
    minAge: 18,
    minBalance: 50,
    allowedCountries: [11, 1, 5]
  };

  const { proof, publicSignals } = await groth16.fullProve(
    input,
    "/kyc_transfer.wasm",
    "/kyc_transfer_final.zkey"
  );

  return { proof, publicSignals };
}

// Usage
const { proof, publicSignals } = await generateProof(25, 150);
console.log("KYC Valid:", publicSignals[0] === "1");
```

---

### Verify Proof (Node.js)

```javascript
const snarkjs = require("snarkjs");
const fs = require("fs");

async function verifyProof(proof, publicSignals) {
  const vKey = JSON.parse(
    fs.readFileSync("kyc_transfer_vkey.json", "utf8")
  );

  const verified = await snarkjs.groth16.verify(
    vKey,
    publicSignals,
    proof
  );

  return verified;
}

// Usage
const verified = await verifyProof(proof, publicSignals);
console.log("Proof valid:", verified); // true/false
```

---

### Verify On-Chain (Solidity)

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Verifier.sol";

contract KYCVerification is Groth16Verifier {
    mapping(address => bool) public verified;

    function submitKYCProof(
        uint[2] memory a,
        uint[2][2] memory b,
        uint[2] memory c,
        uint[1] memory input
    ) public {
        require(input[0] == 1, "KYC check failed");
        require(verifyProof(a, b, c, input), "Invalid proof");

        verified[msg.sender] = true;
    }

    function isVerified(address user) public view returns (bool) {
        return verified[user];
    }
}
```

**Deploy and use:**
```bash
forge create --rpc-url $RPC_URL \
  --private-key $PRIVATE_KEY \
  src/KYCVerification.sol:KYCVerification
```

---

### Verify On Soroban (Rust)

```rust
#![no_std]
use soroban_sdk::{contract, contractimpl, Env, Vec, U256};

#[contract]
pub struct KYCVerifier;

#[contractimpl]
impl KYCVerifier {
    pub fn verify_kyc(
        env: Env,
        proof: Proof,
        public_inputs: Vec<U256>
    ) -> bool {
        // Check KYC passed
        require!(public_inputs.get(0) == U256::from(1), "KYC failed");

        // Verify proof
        groth16_verify(&env, &proof, &public_inputs)
    }
}
```

---

## 🔧 Common Patterns

### Pattern 1: Browser Proof Generation + On-Chain Verification

**Use case:** DApp where users prove KYC without revealing data

```javascript
// 1. User generates proof in browser
const { proof, publicSignals } = await generateProof(userData);

// 2. Submit to smart contract
const tx = await contract.submitKYCProof(
  proof.pi_a,
  proof.pi_b,
  proof.pi_c,
  publicSignals
);

// 3. User is now verified on-chain
console.log("Verified!", tx.hash);
```

---

### Pattern 2: Server-Side Proof Generation + API Verification

**Use case:** Backend service that verifies user credentials privately

```javascript
// Express.js endpoint
app.post('/api/verify-kyc', async (req, res) => {
  const { age, balance, country } = req.body;

  // Generate proof server-side
  const { proof, publicSignals } = await generateProof(
    age, balance, country
  );

  // Verify locally
  const verified = await verifyProof(proof, publicSignals);

  // Store result in database
  await db.users.update({
    userId: req.user.id,
    kycVerified: verified && publicSignals[0] === "1"
  });

  res.json({ success: verified });
});
```

---

### Pattern 3: Multi-Chain Verification

**Use case:** Prove KYC once, use on multiple blockchains

```javascript
async function verifyMultiChain(proof, publicSignals) {
  // Same proof, different chains
  const results = await Promise.all([
    verifyOnEthereum(proof, publicSignals),
    verifyOnStellar(proof, publicSignals),
    verifyOnPolygon(proof, publicSignals)
  ]);

  console.log("Ethereum:", results[0]);  // true
  console.log("Stellar:", results[1]);    // true
  console.log("Polygon:", results[2]);    // true
}
```

---

## 🛠️ Development Tips

### Performance Optimization

**1. Cache WASM and zkey files**
```javascript
// Load once, reuse
let wasmBuffer, zkeyBuffer;

async function loadOnce() {
  if (!wasmBuffer) {
    wasmBuffer = await fetch('/kyc_transfer.wasm').then(r => r.arrayBuffer());
    zkeyBuffer = await fetch('/kyc_transfer_final.zkey').then(r => r.arrayBuffer());
  }
}
```

**2. Use Web Workers for proof generation**
```javascript
// worker.js
self.onmessage = async (e) => {
  const { proof, publicSignals } = await generateProof(e.data);
  self.postMessage({ proof, publicSignals });
};

// main.js
const worker = new Worker('worker.js');
worker.postMessage({ age: 25, balance: 150 });
worker.onmessage = (e) => {
  console.log("Proof ready:", e.data.proof);
};
```

**3. Lazy-load snarkjs**
```javascript
// Only load when needed
const generateProof = async (...args) => {
  const snarkjs = await import('snarkjs');
  return snarkjs.groth16.fullProve(...);
};
```

---

### Security Best Practices

1. **Validate all inputs** before proof generation
2. **Check public signals** match expected constraints
3. **Never trust client-side verification** - always verify on-chain or server-side
4. **Rate limit** proof submission endpoints
5. **Use HTTPS** for all API communication
6. **Store proving keys** securely (don't expose zkey files publicly)

---

## 📊 Example Comparison

| Metric | React Example | Node.js Example | Custom Circuit |
|--------|---------------|-----------------|----------------|
| **Setup Time** | 2 min | 1 min | 5 min |
| **Code Size** | ~300 lines | ~200 lines | ~100 lines |
| **Proof Gen** | Browser | Server | CLI |
| **Verification** | On-chain | Off-chain | Both |
| **Difficulty** | 🟡 Medium | 🟢 Easy | 🔴 Advanced |

---

## 🤝 Contributing Examples

**Have a cool integration?** Share it with the community!

1. Create a new directory in `examples/`
2. Add a detailed README
3. Include working code + tests
4. Submit a PR

**Example ideas we'd love to see:**
- Next.js integration
- Mobile app (React Native)
- Python backend
- Rust CLI tool
- Browser extension
- Discord bot

---

## 📚 Additional Resources

- 📖 [Getting Started Tutorial](../docs/getting-started/interactive-tutorial.md)
- 🏗️ [Architecture Overview](../docs/architecture/overview.md)
- ❓ [FAQ](../docs/FAQ.md)
- 📄 [API Reference](../docs/api/) *(coming soon)*

---

## 💬 Need Help?

- 🐛 Found a bug in an example? [Open an issue](https://github.com/xcapit/stellar-privacy-poc/issues)
- 💡 Have a question? Check the [FAQ](../docs/FAQ.md)
- 💬 Want to discuss? [Start a discussion](https://github.com/xcapit/stellar-privacy-poc/discussions)

---

*Examples last updated: 2025-01-10*
*Team X1 - Xcapit Labs*
