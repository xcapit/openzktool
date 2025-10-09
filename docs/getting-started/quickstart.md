# ⚡ Quick Start Guide

**Get up and running with ZKPrivacy in 5 minutes**

---

## Prerequisites

- **Node.js** 18+ and npm
- **Rust** and Cargo
- **Git**

---

## Installation

### 1. Clone Repository

```bash
git clone https://github.com/xcapit/stellar-privacy-poc.git
cd stellar-privacy-poc
```

### 2. Install Dependencies

```bash
# Install npm dependencies
npm install

# Install Circom (circuit compiler)
cargo install --git https://github.com/iden3/circom.git circom

# Install Foundry (Ethereum toolkit)
curl -L https://foundry.paradigm.xyz | bash
foundryup

# Install Stellar CLI
cargo install --locked stellar-cli --features opt
```

### 3. Run Setup

```bash
# Compile circuit and generate keys (one-time, ~60 seconds)
npm run setup
```

---

## Your First Test

### Option 1: Quick Validation

```bash
npm test
```

**Expected output (3-5 minutes):**
```
✅ FULL FLOW TEST: PASSED

All tests completed successfully:
  ✅ Circuit compilation & setup
  ✅ Proof generation & local verification
  ✅ EVM verification (Ethereum/Anvil)
  ✅ Soroban verification (Stellar)
```

---

### Option 2: Interactive Demo

```bash
npm run demo:privacy
```

**This will show:**
- Alice's privacy problem
- How ZK proofs work
- Proof generation
- Verification on Ethereum
- Verification on Stellar

**Press ENTER** to advance through each step.

---

## What Just Happened?

### 1. Circuit Compilation

```
circuits/kyc_transfer.circom
    ↓ circom compiler
circuits/artifacts/kyc_transfer.r1cs
circuits/artifacts/kyc_transfer.wasm
```

**What:** Converts human-readable circuit to machine format
**Why:** Needed for proof generation

---

### 2. Trusted Setup

```
Powers of Tau ceremony
    ↓
Groth16 setup
    ↓
kyc_transfer_final.zkey (proving key)
kyc_transfer_vkey.json (verification key)
```

**What:** Generates cryptographic parameters
**Why:** Required for proof generation and verification

---

### 3. Proof Generation

```
Input: { age: 25, balance: 150, country: 32 }
    ↓ witness calculation
    ↓ Groth16 proof generation
Output: proof.json (800 bytes)
```

**What:** Creates zero-knowledge proof
**Why:** Proves age ≥ 18, balance ≥ $50 WITHOUT revealing 25, $150

---

### 4. Multi-Chain Verification

```
proof.json
    ↓
    ├─► Ethereum (Solidity verifier) ✅
    └─► Stellar (Rust/WASM verifier) ✅
```

**What:** Same proof verified on 2 blockchains
**Why:** Demonstrates multi-chain interoperability

---

## Next Steps

### Learn More

- [Testing Guide](../testing/README.md) - All available tests
- [Demo Scripts](../testing/demo-scripts.md) - Script reference
- [Architecture](./architecture.md) - How it works

### Try Different Scenarios

```bash
# Non-technical demo
npm run demo:privacy

# Technical demo
npm run demo

# Test individual components
npm run prove
npm run demo:evm
npm run demo:soroban
```

### Customize Input

Edit `circuits/artifacts/input.json`:

```json
{
  "age": 30,
  "minAge": 18,
  "maxAge": 99,
  "balance": 200,
  "minBalance": 50,
  "country": 840
}
```

Then regenerate proof:

```bash
npm run prove
npm run demo:evm
npm run demo:soroban
```

---

## Common Issues

### "circom: command not found"

```bash
cargo install --git https://github.com/iden3/circom.git circom
```

### "forge: command not found"

```bash
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

### "stellar: command not found"

```bash
cargo install --locked stellar-cli --features opt
```

### "Port already in use"

```bash
pkill anvil
pkill stellar
```

---

## 🎉 Success!

If `npm test` passes, you're ready to:

- Build integrations
- Run demos
- Deploy to testnet
- Explore the SDK

**Need help?** Open an issue on [GitHub](https://github.com/xcapit/stellar-privacy-poc/issues)

---

*Next: [Architecture Overview](./architecture.md)*
