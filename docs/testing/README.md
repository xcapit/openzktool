# 🧪 Testing Guide - Stellar Privacy SDK

**Complete guide for testing the OpenZKTool multi-chain proof system**

---

## 📋 Table of Contents

1. [Quick Test](#quick-test)
2. [Test Components](#test-components)
3. [Running Tests](#running-tests)
4. [Demo Scripts](#demo-scripts)
5. [Troubleshooting](#troubleshooting)
6. [CI/CD Integration](#cicd-integration)

---

## ⚡ Quick Test

Validate everything works in 3-5 minutes:

```bash
# Install dependencies
npm install

# Run automated test suite
npm test
```

**Expected output:**
```
[1/4] Setup...
  ✅ Setup already complete
[2/4] Generating proof...
  ✅ Proof generated and verified locally
[3/4] Verifying on Ethereum...
  ✅ Ethereum verification: SUCCESS
[4/4] Verifying on Soroban...
  ✅ Soroban verification: SUCCESS

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ FULL FLOW TEST: PASSED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Exit code:** 0 = success, 1 = failure

---

## 🧩 Test Components

### What Gets Tested

#### 1. Circuit Compilation
- **File**: `circuits/kyc_transfer.circom`
- **Output**: `kyc_transfer.r1cs`, `kyc_transfer.wasm`
- **Validates**: Circuit syntax, constraint system
- **Time**: ~5 seconds

#### 2. Trusted Setup
- **Process**: Powers of Tau + Groth16 ceremony
- **Output**: `kyc_transfer_final.zkey`, verification key
- **Validates**: Cryptographic parameters
- **Time**: ~30 seconds (first run only)

#### 3. Proof Generation
- **Input**: Private data (age: 25, balance: $150, country: AR)
- **Output**: `proof.json` (~800 bytes)
- **Validates**: Witness calculation, proof creation
- **Time**: <1 second

#### 4. Local Verification
- **Tool**: snarkjs
- **Validates**: Proof mathematical validity
- **Time**: <50ms

#### 5. EVM Verification
- **Chain**: Ethereum (Anvil local testnet)
- **Contract**: `Groth16Verifier.sol`
- **Validates**: On-chain pairing check, gas usage
- **Time**: ~5 seconds

#### 6. Soroban Verification
- **Chain**: Stellar (local network)
- **Contract**: Rust/WASM verifier
- **Validates**: Proof structure, field validation
- **Time**: ~10 seconds

---

## 🚀 Running Tests

### Option 1: Automated Full Flow (Recommended)

```bash
npm test
```

**What it does:**
- Runs all tests automatically
- No user interaction required
- Outputs concise progress
- Perfect for CI/CD

**Use when:**
- Quick validation needed
- Before presentations
- In automated pipelines
- After code changes

---

### Option 2: Interactive Full Flow

```bash
npm run test:interactive
```

**What it does:**
- Pauses between each step
- Shows detailed explanations
- Waits for ENTER to continue
- Educational mode

**Use when:**
- Learning how the system works
- Debugging issues
- Demonstrating to others
- First time running tests

---

### Option 3: Individual Components

Test specific parts of the system:

```bash
# Setup only (one-time)
npm run setup

# Proof generation only
npm run prove

# EVM verification only
npm run demo:evm

# Soroban verification only
npm run demo:soroban
```

---

### Option 4: Demo Scripts

For presentations and demonstrations:

```bash
# Non-technical audience (business, investors)
npm run demo:privacy

# Technical audience (developers, grant reviewers)
npm run demo
```

See [Demo Scripts Guide](./demo-scripts.md) for details.

---

## 📊 Test Results Explained

### Successful Test Output

```
✅ FULL FLOW TEST: PASSED

All tests completed successfully:
  ✅ Circuit compilation & setup
  ✅ Proof generation & local verification
  ✅ EVM verification (Ethereum/Anvil)
  ✅ Soroban verification (Stellar)

🌐 Multi-chain interoperability confirmed!
```

### What This Proves

| Component | Proof |
|-----------|-------|
| **Circuit** | Compiles without errors, constraints are valid |
| **Proof** | Generated successfully, mathematically sound |
| **EVM** | Solidity contract verifies proof on-chain |
| **Soroban** | Rust/WASM contract validates proof structure |
| **Multi-chain** | Same proof works on 2+ different blockchains |

---

## 🔍 Detailed Test Breakdown

### Test 1: Setup

**Command:** `npm run setup`

**What happens:**
1. Compiles `kyc_transfer.circom` to R1CS
2. Generates witness calculator (WASM)
3. Downloads Powers of Tau (if needed)
4. Runs Groth16 setup ceremony
5. Generates proving and verification keys

**Expected files:**
```
circuits/artifacts/
├── kyc_transfer.r1cs          (93 KB)
├── kyc_transfer.wasm          (43 KB)
├── kyc_transfer_final.zkey    (324 KB)
└── kyc_transfer_vkey.json     (3 KB)
```

**Troubleshooting:**
- Missing `circom`: Install from https://docs.circom.io/
- Missing `snarkjs`: Run `npm install -g snarkjs`
- Permission errors: Check file permissions

---

### Test 2: Proof Generation

**Command:** `npm run prove`

**What happens:**
1. Reads input data from `input.json`
2. Compiles witness with private inputs
3. Generates Groth16 proof
4. Verifies proof locally with snarkjs
5. Exports Solidity verifier

**Input data:**
```json
{
  "age": 25,
  "minAge": 18,
  "maxAge": 99,
  "balance": 150,
  "minBalance": 50,
  "country": 32
}
```

**Expected output:**
```
✅ Proof generated: artifacts/proof.json
✅ Public inputs: artifacts/public.json
✅ Proof verified successfully!
```

**Proof structure:**
```json
{
  "pi_a": ["...", "...", "1"],
  "pi_b": [[...], [...], ["1", "0"]],
  "pi_c": ["...", "...", "1"],
  "protocol": "groth16",
  "curve": "bn128"
}
```

**Public output:**
```json
["1"]  // kycValid = 1 (VALID)
```

---

### Test 3: EVM Verification

**Command:** `npm run demo:evm`

**What happens:**
1. Starts Anvil (local Ethereum node)
2. Compiles `Groth16Verifier.sol` with Foundry
3. Deploys verifier contract
4. Submits proof to contract
5. Contract performs pairing check
6. Returns verification result

**Expected output:**
```
🚀 Starting local Ethereum node (Anvil)...
✅ Anvil running (PID: 12345)

📤 Deploying Groth16 Verifier contract...
✅ Contract deployed at: 0x5FbDB2315678afecb367f032d93F642f64180aa3

🔍 Verifying proof on-chain...
✅ VERIFICATION SUCCESSFUL!

✓ Proof verified on Ethereum local testnet
✓ Gas used: ~200,000 gas
✓ Verification time: <50ms
```

**What the contract does:**
1. Receives proof components (pi_a, pi_b, pi_c)
2. Receives public inputs ([1])
3. Performs BN254 elliptic curve pairing
4. Returns `true` if proof is valid

**Gas usage:**
- Contract deployment: ~1.5M gas
- Proof verification: ~200k gas

---

### Test 4: Soroban Verification

**Command:** `npm run demo:soroban`

**What happens:**
1. Builds Rust contract to WASM
2. Starts local Stellar network
3. Deploys verifier contract
4. Invokes `verify_proof` function
5. Contract validates proof structure
6. Returns verification result

**Expected output:**
```
🔨 Building Soroban contract...
✅ Contract built: 2.1KB

🚀 Starting local Stellar network...
✅ Stellar local network running

📤 Deploying Groth16 Verifier contract...
✅ Contract deployed!
  📝 Contract ID: CAAAAAAA...

🔍 Verifying proof on-chain...
✅ VERIFICATION SUCCESSFUL!

✓ Proof verified on Stellar/Soroban
✓ Contract size: 2.1KB WASM
✓ Low resource consumption
```

**What the contract does:**
1. Receives proof as Soroban types
2. Validates proof structure
3. Checks field values are in range
4. Returns `true` if structure is valid

**Note:** Current POC validates structure; full pairing check roadmap for Tranche 2.

---

## 🐛 Troubleshooting

### Common Issues

#### 1. Setup Fails - "circom: command not found"

**Solution:**
```bash
# Install Circom
curl --proto '=https' --tlsv1.2 https://sh.rustup.rs -sSf | sh
cargo install --git https://github.com/iden3/circom.git circom
```

#### 2. EVM Test Fails - "Foundry not found"

**Solution:**
```bash
# Install Foundry
curl -L https://foundry.paradigm.xyz | bash
foundryup

# Verify installation
forge --version
anvil --version
```

#### 3. Soroban Test Fails - "stellar: command not found"

**Solution:**
```bash
# Install Stellar CLI
cargo install --locked stellar-cli --features opt

# Verify installation
stellar --version
```

#### 4. Port Already in Use

**Error:** `Error: address already in use`

**Solution:**
```bash
# Kill existing processes
pkill anvil
pkill stellar

# Or find and kill specific PIDs
lsof -i :8545  # Anvil default port
lsof -i :8000  # Stellar default port
```

#### 5. Proof Generation Fails

**Error:** `Error: Witness calculation failed`

**Possible causes:**
- Invalid input data (check `input.json`)
- Corrupted circuit files
- Missing setup files

**Solution:**
```bash
# Clean and rebuild
rm -rf circuits/artifacts/*
npm run setup
npm run prove
```

#### 6. Tests Pass Locally But Fail in CI

**Common issues:**
- Missing environment variables
- Insufficient memory
- Missing dependencies

**Solution:**
```yaml
# .github/workflows/test.yml
- name: Install dependencies
  run: |
    npm install -g snarkjs
    cargo install circom stellar-cli
    curl -L https://foundry.paradigm.xyz | bash
    source ~/.bashrc
    foundryup
```

---

## 🔄 CI/CD Integration

### GitHub Actions Example

```yaml
name: Test OpenZKTool

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v3

    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'

    - name: Install Rust
      uses: actions-rs/toolchain@v1
      with:
        toolchain: stable

    - name: Install Circom
      run: cargo install --git https://github.com/iden3/circom.git circom

    - name: Install Foundry
      run: |
        curl -L https://foundry.paradigm.xyz | bash
        source ~/.bashrc
        foundryup

    - name: Install Stellar CLI
      run: cargo install --locked stellar-cli --features opt

    - name: Install npm dependencies
      run: npm install

    - name: Run tests
      run: npm test
```

### GitLab CI Example

```yaml
test:
  image: node:18
  before_script:
    - apt-get update && apt-get install -y curl build-essential
    - curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
    - source $HOME/.cargo/env
    - cargo install circom stellar-cli
    - curl -L https://foundry.paradigm.xyz | bash
    - npm install
  script:
    - npm test
```

---

## 📈 Performance Benchmarks

| Operation | Time | Gas (EVM) | Resources |
|-----------|------|-----------|-----------|
| Circuit compilation | ~5s | - | CPU |
| Trusted setup | ~30s | - | CPU |
| Proof generation | <1s | - | CPU |
| Local verification | <50ms | - | CPU |
| EVM deployment | ~2s | 1.5M gas | Network |
| EVM verification | ~100ms | 200k gas | Network |
| Soroban deployment | ~3s | - | Network |
| Soroban verification | ~200ms | Low | Network |

**Hardware used:** MacBook Pro M1, 16GB RAM

---

## 📚 Additional Resources

- [Demo Scripts Guide](./demo-scripts.md) - All available demo scripts
- [Multi-Chain Testing](./multi-chain.md) - Cross-chain test strategy
- [Architecture Overview](../getting-started/architecture.md) - System design
- [Circuit Design](../circuits/README.md) - How circuits work

---

## ✅ Pre-Presentation Checklist

Before any demo or presentation:

- [ ] Run `npm test` - All tests pass
- [ ] Check proof size: `ls -lh circuits/artifacts/proof.json` (~800 bytes)
- [ ] Verify EVM contract deploys: No Foundry errors
- [ ] Verify Soroban builds: `cargo build` succeeds
- [ ] Test in clean environment: Fresh terminal, no cached state
- [ ] Backup option: Have `demo_privacy_proof.sh` ready for non-technical audiences

---

*Last updated: 2025-01-10*
*Testing documentation v0.1.0*
