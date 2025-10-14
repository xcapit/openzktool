# 🎬 OpenZKTool - Complete Demo Guide

> **Comprehensive demonstration of OpenZKTool's zero-knowledge proof capabilities**

**Duration:** 5-7 minutes
**Difficulty:** Beginner-friendly
**Prerequisites:** Node.js, Circom

---

## 📋 Table of Contents

- [Quick Start](#quick-start)
- [The Story](#the-story)
- [Step-by-Step Walkthrough](#step-by-step-walkthrough)
- [What You'll Learn](#what-youll-learn)
- [Technical Details](#technical-details)
- [Troubleshooting](#troubleshooting)

---

## 🚀 Quick Start

### Run the Complete Demo

```bash
# Interactive mode (recommended for first-time viewers)
./DEMO_COMPLETE.sh

# Automatic mode (for presentations)
DEMO_AUTO=1 ./DEMO_COMPLETE.sh

# Skip setup if already configured
DEMO_SKIP_SETUP=1 ./DEMO_COMPLETE.sh
```

### Prerequisites Check

```bash
# Node.js (v16+)
node --version

# Circom (v2.1.9+)
circom --version

# jq (for JSON parsing)
jq --version
```

---

## 📖 The Story

### Meet Alice

Alice wants to access a financial service that requires KYC (Know Your Customer) compliance.

**Requirements:**
- ✅ Age ≥ 18
- ✅ Balance ≥ $50
- ✅ From an allowed country

**Alice's Actual Data (Private):**
- 🔒 Age: 25 years old
- 🔒 Balance: $150
- 🔒 Country: Argentina (code: 32)

### The Problem

Traditional KYC requires Alice to reveal:
- ❌ Her exact age
- ❌ Her exact balance
- ❌ Her exact location

**This creates privacy and security risks!**

### The Solution: Zero-Knowledge Proofs

With OpenZKTool, Alice can:
- ✅ **Prove** she meets ALL requirements
- ✅ **Without revealing** ANY specific data
- ✅ **Verify** on multiple blockchains

---

## 🎯 Step-by-Step Walkthrough

### Step 1: Circuit Setup (One-time)

**What happens:**
- Circom circuit is compiled
- Trusted setup generates proving/verification keys
- Circuit constraints are validated

**Output:**
```
✅ Circuit compiled: 586 constraints
✅ Powers of Tau downloaded
✅ Proving key generated (zkey)
✅ Verification key generated (vkey)
```

**Files created:**
- `circuits/artifacts/kyc_transfer.wasm` - Circuit WASM
- `circuits/artifacts/kyc_transfer_final.zkey` - Proving key
- `circuits/artifacts/kyc_transfer_vkey.json` - Verification key

---

### Step 2: Proof Generation

**Input (Alice's private data):**
```json
{
  "age": 25,
  "balance": 150,
  "country": 32,
  "minAge": 18,
  "maxAge": 99,
  "minBalance": 50,
  "allowedCountries": [11, 1, 5, 32]
}
```

**Process:**
1. Generate witness from inputs
2. Create ZK proof using Groth16
3. Extract public signals

**Output:**
```json
{
  "proof": {
    "pi_a": ["...", "..."],
    "pi_b": [["...", "..."], ["...", "..."]],
    "pi_c": ["...", "..."],
    "protocol": "groth16",
    "curve": "bn128"
  },
  "publicSignals": ["1"]
}
```

**Public Signal Meaning:**
- `1` = Alice passes ALL checks ✅
- `0` = Alice fails at least one check ❌

**Performance:**
- ⏱️ Generation time: <1 second
- 📦 Proof size: 800 bytes
- 🔒 Zero knowledge: No private data in proof

---

### Step 3: Local Verification

**What happens:**
- Proof is verified using verification key
- Mathematical check confirms proof validity
- No blockchain interaction required

**Command:**
```bash
snarkjs groth16 verify \
  kyc_transfer_vkey.json \
  public.json \
  proof.json
```

**Output:**
```
[INFO]  snarkJS: OK!
✅ Proof verified successfully!
```

**Performance:**
- ⚡ Verification time: <50ms
- 💻 Runs completely off-chain
- 🔐 Cryptographically sound

---

### Step 4: Multi-Chain Overview

The same proof can be verified on multiple blockchains!

#### Option A: Ethereum (EVM)

**Contract:** Solidity Groth16 Verifier
**Deployment:**
```bash
cd evm-verification
forge script deploy --rpc-url $ETH_RPC_URL
```

**Verification:**
```solidity
bool isValid = verifier.verifyProof(proof, publicSignals);
```

**Performance:**
- ⛽ Gas cost: ~245,000 gas
- ⏱️ Confirmation: ~12 seconds (Ethereum)
- 🌐 Works on: Ethereum, Polygon, Arbitrum, Optimism, BSC

---

#### Option B: Stellar (Soroban)

**Contract:** Rust Groth16 Verifier (v4)
**Contract ID:** `CBPBVJJW5NMV4UVEDKSR6UO4DRBNWRQEMYKRYZI3CW6YK3O7HAZA43OI`

**Deployment:**
```bash
cd soroban
cargo build --release --target wasm32-unknown-unknown
stellar contract deploy --wasm target/wasm32-unknown-unknown/release/*.wasm --network testnet
```

**Verification:**
```rust
contract.verify_proof(proof, public_signals)
```

**Performance:**
- ⚡ Compute units: ~48,000
- ⏱️ Confirmation: ~5 seconds
- 💰 Lower fees than EVM
- 📦 WASM size: 19.8KB

---

### Step 5: Complete Verification Flow

```
┌─────────────────┐
│  Private Data   │
│  age: 25        │
│  balance: $150  │
│  country: AR    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  ZK Circuit     │
│  (586 const.)   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Proof          │
│  800 bytes      │
│  kycValid: 1    │
└────────┬────────┘
         │
         ├─────────────────┬─────────────────┐
         ▼                 ▼                 ▼
   ┌─────────┐       ┌─────────┐       ┌─────────┐
   │  Local  │       │   EVM   │       │ Soroban │
   │ Verify  │       │ Verify  │       │ Verify  │
   │  <50ms  │       │ ~245kgas│       │ ~48k cu │
   └─────────┘       └─────────┘       └─────────┘
         │                 │                 │
         └─────────────────┴─────────────────┘
                           │
                           ▼
                    ✅ All verifications
                       confirm valid!
```

---

## 💡 What You'll Learn

### 1. Zero-Knowledge Proofs

**Concept:** Prove a statement is true without revealing why it's true

**Example:**
- Statement: "I am over 18"
- Traditional: Show ID (reveals exact age: 25)
- ZK Proof: Prove age ≥ 18 (doesn't reveal 25)

### 2. Groth16 SNARKs

**SNARK:** Succinct Non-interactive Argument of Knowledge
- **Succinct:** Small proof size (800 bytes)
- **Non-interactive:** One message from prover to verifier
- **Argument of Knowledge:** Prover must "know" the secret

**Groth16 Advantages:**
- ✅ Very fast verification
- ✅ Small proof size
- ✅ Well-studied and secure
- ⚠️ Requires trusted setup

### 3. Multi-Chain Interoperability

**Same proof, multiple chains:**
- Generate proof once
- Verify on Ethereum, Polygon, Stellar, etc.
- No need to regenerate for each chain

**Benefits:**
- 🔄 Flexibility: Choose cheapest/fastest chain
- 🌐 Reach: Access multiple ecosystems
- 💰 Cost optimization: Verify where fees are lowest

### 4. Privacy + Compliance

**The Holy Grail:**
- 🔒 User privacy preserved
- ✅ Regulatory compliance achieved
- 🔍 Auditors can verify on-chain
- 🚀 No trusted intermediary needed

---

## 🔧 Technical Details

### Circuit Structure

```circom
template KYCTransfer() {
    // Private inputs
    signal input age;
    signal input balance;
    signal input country;

    // Public inputs (requirements)
    signal input minAge;
    signal input maxAge;
    signal input minBalance;
    signal input allowedCountries[4];

    // Public output
    signal output kycValid;

    // Constraints
    component ageCheck = ...
    component balanceCheck = ...
    component countryCheck = ...

    // Final result
    kycValid <== ageCheck.out * balanceCheck.out * countryCheck.out;
}
```

**Total Constraints:** 586
**Curve:** BN254 (alt_bn128)
**Field:** Prime field ~2^254

---

### Proof Structure

```json
{
  "pi_a": [
    "elliptic curve point A (compressed)"
  ],
  "pi_b": [
    "elliptic curve point B (two coordinates)"
  ],
  "pi_c": [
    "elliptic curve point C (compressed)"
  ],
  "protocol": "groth16",
  "curve": "bn128"
}
```

**Size Breakdown:**
- pi_a: ~32 bytes
- pi_b: ~64 bytes
- pi_c: ~32 bytes
- Metadata: ~10 bytes
- **Total:** ~138 bytes (before serialization)
- **Serialized:** ~800 bytes (JSON with hex encoding)

---

### Verification Algorithm

**Groth16 Pairing Check:**
```
e(pi_a, pi_b) = e(alpha, beta) * e(L, gamma) * e(C, delta)
```

Where:
- `e()` = Pairing function
- `alpha, beta, gamma, delta` = Verification key points
- `L` = Linear combination of public inputs
- `C` = pi_c proof element

**If equation holds:** Proof is valid ✅
**If equation fails:** Proof is invalid ❌

---

## 🐛 Troubleshooting

### Error: "circom: command not found"

**Solution:**
```bash
# macOS/Linux
wget https://github.com/iden3/circom/releases/download/v2.1.9/circom-linux-amd64
chmod +x circom-linux-amd64
sudo mv circom-linux-amd64 /usr/local/bin/circom
```

---

### Error: "Cannot find module 'snarkjs'"

**Solution:**
```bash
cd circuits
npm install
```

---

### Error: "Proof verification failed"

**Possible causes:**
1. Input values out of range
2. Corrupted circuit files
3. Mismatched keys

**Solution:**
```bash
# Clean and rebuild
cd circuits
rm -rf artifacts/*
bash scripts/prepare_and_setup.sh
```

---

### Error: "Powers of Tau download failed"

**Solution:**
```bash
# Manual download
cd circuits/artifacts
wget https://hermez.s3-eu-west-1.amazonaws.com/powersOfTau28_hez_final_12.ptau
```

---

## 📊 Performance Benchmarks

### Proof Generation

| Metric | Value |
|--------|-------|
| Average time | 847ms |
| Min time | 782ms |
| Max time | 1024ms |
| Memory usage | 142MB |
| Throughput | 1.18 proofs/sec |

### Verification

| Platform | Time | Cost |
|----------|------|------|
| Local (off-chain) | <50ms | Free |
| EVM (on-chain) | ~2s | ~245k gas |
| Soroban (on-chain) | ~1.3s | ~48k compute units |

### Circuit Metrics

| Metric | Value |
|--------|-------|
| Total constraints | 586 |
| Compilation time | 3.2s |
| R1CS file size | 42KB |
| WASM file size | 156KB |
| Proving key size | 8.3MB |
| Verification key size | 1.2KB |

---

## 🎓 Educational Resources

### Learn More About ZK Proofs

- 📘 [Zero-Knowledge Proofs for Beginners](https://z.cash/technology/zksnarks/)
- 📗 [Circom Documentation](https://docs.circom.io/)
- 📙 [Groth16 Paper](https://eprint.iacr.org/2016/260.pdf)
- 📕 [ZK Learning Resources](https://zkp.science/)

### OpenZKTool Resources

- 📖 [Full Documentation](./docs/README.md)
- 🧪 [Interactive Tutorial](./docs/getting-started/interactive-tutorial.md)
- 💻 [Examples](./examples/README.md)
- 🛠️ [SDK Documentation](./sdk/README.md)

---

## 🎯 Next Steps

### Try It Yourself

1. **Modify Inputs**
   ```bash
   # Edit circuits/artifacts/input.json
   # Try different age/balance/country values
   # See when kycValid becomes 0
   ```

2. **Build Your Own Circuit**
   ```bash
   cd examples/5-custom-circuit
   # Follow the guide to create custom circuits
   ```

3. **Integrate in Your App**
   ```bash
   cd examples/2-react-app
   # See how to use OpenZKTool in a web app
   ```

---

## 🌟 Use Cases

OpenZKTool enables privacy-preserving applications:

- 🏦 **Financial Services:** KYC compliance without data exposure
- 🗳️ **Voting Systems:** Prove eligibility without revealing identity
- 🎓 **Credentials:** Prove qualifications without sharing transcripts
- 💰 **DeFi:** Prove solvency without revealing holdings
- 🌍 **Cross-border:** Prove compliance across jurisdictions
- 🔐 **Identity:** Selective disclosure of attributes

---

## 📞 Support

- 🐛 **Report Issues:** [GitHub Issues](https://github.com/xcapit/openzktool/issues)
- 💬 **Ask Questions:** [GitHub Discussions](https://github.com/xcapit/openzktool/discussions)
- 📧 **Email:** fboiero@frvm.utn.edu.ar

---

## 📄 License

OpenZKTool is licensed under [AGPL-3.0-or-later](./LICENSE)

---

**🎉 Congratulations!** You've completed the OpenZKTool demo.

**Ready to build privacy-preserving applications?** Start with our [examples](./examples/README.md)!

---

**⭐ If you find this useful, please star the repository!**

🌐 **Website:** [https://openzktool.vercel.app](https://openzktool.vercel.app)
📦 **GitHub:** [https://github.com/xcapit/openzktool](https://github.com/xcapit/openzktool)
