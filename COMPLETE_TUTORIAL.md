# Complete Tutorial: Zero-Knowledge Proofs on Stellar

This tutorial guides you through the **complete end-to-end process** of generating and verifying zero-knowledge proofs on Stellar's Soroban platform.

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Step 1: Setup Environment](#step-1-setup-environment)
3. [Step 2: Generate ZK Circuit](#step-2-generate-zk-circuit)
4. [Step 3: Create Proof](#step-3-create-proof)
5. [Step 4: Convert to Soroban Format](#step-4-convert-to-soroban-format)
6. [Step 5: Deploy Contract](#step-5-deploy-contract)
7. [Step 6: Verify On-Chain](#step-6-verify-on-chain)
8. [Complete Example Script](#complete-example-script)

---

## Prerequisites

### Required Tools

```bash
# Node.js and npm
node --version  # v18+ recommended
npm --version

# Rust and Cargo
rustc --version
cargo --version

# Stellar CLI
stellar --version

# Circom
circom --version  # 2.1.9+

# snarkjs
npm install -g snarkjs
```

### Required Identities

```bash
# Create Stellar identity for testing
stellar keys generate alice --network testnet

# Fund the account
stellar keys fund alice --network testnet
```

---

## Step 1: Setup Environment

### Clone and Install Dependencies

```bash
cd /Users/fboiero/Documents/STELLAR/stellar-privacy-poc

# Install circuit dependencies
cd circuits
npm install

# Install Soroban dependencies
cd ../soroban
cargo build

cd ../contracts
cargo build
```

### Verify Setup

```bash
# Check circom compiler
circom --version

# Check snarkjs
snarkjs --version

# Check Stellar CLI
stellar --version
```

---

## Step 2: Generate ZK Circuit

Our example uses a **KYC Transfer** circuit that proves:
- ✅ Age is within valid range (18-99)
- ✅ Balance meets minimum requirement
- ✅ Country is in allowed list

### Circuit Structure

**File:** `circuits/kyc_transfer.circom`

```circom
template KYCTransfer() {
    signal input age;
    signal input minAge;
    signal input maxAge;
    signal input balance;
    signal input minBalance;
    signal input countryId;

    signal output kycValid;

    // Combines RangeProof + SolvencyCheck + ComplianceVerify
}
```

### Compile the Circuit

```bash
cd circuits

# Method 1: Use automated build script
./scripts/build_all.sh

# Method 2: Manual compilation
circom kyc_transfer.circom --r1cs --wasm --sym -o artifacts/

# Output:
# ✅ artifacts/kyc_transfer.r1cs
# ✅ artifacts/kyc_transfer_js/kyc_transfer.wasm
# ✅ artifacts/kyc_transfer.sym
```

### Generate Trusted Setup

```bash
cd circuits

# Download Powers of Tau
curl -o artifacts/pot12_final_phase2.ptau \
  https://hermez.s3-eu-west-1.amazonaws.com/powersOfTau28_hez_final_12.ptau

# Generate initial zkey
snarkjs groth16 setup \
  artifacts/kyc_transfer.r1cs \
  artifacts/pot12_final_phase2.ptau \
  artifacts/kyc_transfer_0000.zkey

# Contribute to ceremony (adds randomness)
snarkjs zkey contribute \
  artifacts/kyc_transfer_0000.zkey \
  artifacts/kyc_transfer_final.zkey \
  --name="First contribution" \
  -v

# Export verification key
snarkjs zkey export verificationkey \
  artifacts/kyc_transfer_final.zkey \
  artifacts/kyc_transfer_vkey.json
```

**Output:**
- `artifacts/kyc_transfer_final.zkey` - Proving key
- `artifacts/kyc_transfer_vkey.json` - Verification key

---

## Step 3: Create Proof

### Prepare Input Data

**File:** `circuits/artifacts/input.json`

```json
{
  "age": 25,
  "minAge": 18,
  "maxAge": 99,
  "balance": 150,
  "minBalance": 50,
  "countryId": 32
}
```

**Privacy Note:** These values are **private inputs**. Only the proof is revealed on-chain.

### Generate Witness

```bash
cd circuits

# Generate witness from input
node artifacts/kyc_transfer_js/generate_witness.js \
  artifacts/kyc_transfer_js/kyc_transfer.wasm \
  artifacts/input.json \
  artifacts/witness.wtns

# Output: artifacts/witness.wtns
```

### Generate the Proof

```bash
cd circuits

# Create Groth16 proof
snarkjs groth16 prove \
  artifacts/kyc_transfer_final.zkey \
  artifacts/witness.wtns \
  artifacts/proof.json \
  artifacts/public.json

echo "✅ Proof generated!"
```

**Output Files:**
- `artifacts/proof.json` - The zero-knowledge proof
- `artifacts/public.json` - Public outputs (only kycValid = 1)

### Verify Locally (Optional)

```bash
cd circuits

# Verify proof matches verification key
snarkjs groth16 verify \
  artifacts/kyc_transfer_vkey.json \
  artifacts/public.json \
  artifacts/proof.json

# Expected output:
# [INFO]  snarkJS: OK!
```

---

## Step 4: Convert to Soroban Format

Stellar's Soroban uses a different format than snarkjs. We need to convert the proof.

### Use Conversion Script

```bash
cd soroban

# Convert proof + vkey to Soroban format
node zk_convert.js \
  ../circuits/artifacts/proof.json \
  ../circuits/artifacts/kyc_transfer_vkey.json

# Output: args.json (Soroban-compatible format)
```

### Understanding the Conversion

**Input (snarkjs format):**
```json
{
  "pi_a": ["x", "y", "1"],
  "pi_b": [["x1", "x0"], ["y1", "y0"], ["1", "0"]],
  "pi_c": ["x", "y", "1"],
  "protocol": "groth16"
}
```

**Output (Soroban format):**
```json
{
  "proof": {
    "pi_a": { "x": "0x...", "y": "0x..." },
    "pi_b": {
      "x": ["0x...", "0x..."],
      "y": ["0x...", "0x..."]
    },
    "pi_c": { "x": "0x...", "y": "0x..." }
  },
  "vk": {
    "alpha": { "x": "0x...", "y": "0x..." },
    "beta": { "x": [...], "y": [...] },
    "gamma": { "x": [...], "y": [...] },
    "delta": { "x": [...], "y": [...] },
    "ic": [...]
  },
  "public_inputs": ["0x01"]
}
```

---

## Step 5: Deploy Contract

### Option A: Deploy Groth16Verifier (Pure Math)

```bash
cd soroban

# Build contract
cargo build --target wasm32-unknown-unknown --release

# Deploy to testnet
stellar contract deploy \
  --wasm target/wasm32-unknown-unknown/release/soroban_groth16_verifier.wasm \
  --source alice \
  --network testnet

# Save contract ID
export CONTRACT_ID="CBPBVJJW5NMV4UVEDKSR6UO4DRBNWRQEMYKRYZI3CW6YK3O7HAZA43OI"
```

### Option B: Deploy PrivacyVerifier (Full Application)

```bash
cd contracts

# Build contract
cargo build --target wasm32-unknown-unknown --release

# Deploy to testnet
CONTRACT_ID=$(stellar contract deploy \
  --wasm target/wasm32-unknown-unknown/release/stellar_privacy_verifier.wasm \
  --source alice \
  --network testnet)

echo "Contract deployed: $CONTRACT_ID"

# Initialize contract
ADMIN_ADDRESS=$(stellar keys address alice)

stellar contract invoke \
  --id "$CONTRACT_ID" \
  --source alice \
  --network testnet \
  -- \
  initialize \
  --admin "$ADMIN_ADDRESS"
```

---

## Step 6: Verify On-Chain

### Method 1: Using Groth16Verifier

```bash
cd soroban

# Automated verification
./zk_run.sh

# Or manual:
stellar contract invoke \
  --id "$CONTRACT_ID" \
  --source alice \
  --network testnet \
  -- \
  verify_proof \
  --proof "$(cat args.json | jq -c .proof)" \
  --vk "$(cat args.json | jq -c .vk)" \
  --public_inputs "$(cat args.json | jq -c .public_inputs)"
```

**Expected Output:**
```
true
```

### Method 2: Using PrivacyVerifier (with Nullifiers)

```bash
cd contracts

# 1. Register credential commitment (admin only)
COMMITMENT="0000000000000000000000000000000000000000000000000000000000000001"

stellar contract invoke \
  --id "$CONTRACT_ID" \
  --source alice \
  --network testnet \
  -- \
  register_credential \
  --admin "$ADMIN_ADDRESS" \
  --commitment "$COMMITMENT"

# 2. Generate unique nullifier
NULLIFIER="$(openssl rand -hex 32)"
echo "Nullifier: $NULLIFIER"

# 3. Verify proof with nullifier tracking
stellar contract invoke \
  --id "$CONTRACT_ID" \
  --source alice \
  --network testnet \
  -- \
  verify_proof \
  --proof "{
    \"commitment\": \"$COMMITMENT\",
    \"nullifier\": \"$NULLIFIER\",
    \"pi_a\": $(cat args.json | jq .proof.pi_a),
    \"pi_b\": $(cat args.json | jq .proof.pi_b),
    \"pi_c\": $(cat args.json | jq .proof.pi_c),
    \"public_inputs\": $(cat args.json | jq .public_inputs)
  }" \
  --encrypted_data "00"

# 4. Try to reuse same nullifier (should fail)
stellar contract invoke \
  --id "$CONTRACT_ID" \
  --source alice \
  --network testnet \
  -- \
  is_nullifier_used \
  --nullifier "$NULLIFIER"

# Expected: true (nullifier is now used)
```

---

## Complete Example Script

Here's a complete automated script that runs the entire pipeline:

```bash
#!/bin/bash
set -e

echo "🚀 Complete ZK Proof Pipeline"
echo "=============================="
echo ""

# Configuration
NETWORK="testnet"
IDENTITY="alice"
BASE_DIR="/Users/fboiero/Documents/STELLAR/stellar-privacy-poc"

# Step 1: Build circuits
echo "📐 Step 1: Building circuits..."
cd "$BASE_DIR/circuits"
./scripts/build_all.sh
echo "✅ Circuits built"
echo ""

# Step 2: Generate proof
echo "🔐 Step 2: Generating proof..."
cd "$BASE_DIR/circuits"

# Generate witness
node artifacts/kyc_transfer_js/generate_witness.js \
  artifacts/kyc_transfer_js/kyc_transfer.wasm \
  artifacts/input.json \
  artifacts/witness.wtns

# Generate proof
snarkjs groth16 prove \
  artifacts/kyc_transfer_final.zkey \
  artifacts/witness.wtns \
  artifacts/proof.json \
  artifacts/public.json

echo "✅ Proof generated"
echo ""

# Step 3: Verify locally
echo "✔️  Step 3: Verifying locally..."
snarkjs groth16 verify \
  artifacts/kyc_transfer_vkey.json \
  artifacts/public.json \
  artifacts/proof.json

echo "✅ Local verification passed"
echo ""

# Step 4: Convert to Soroban format
echo "🔄 Step 4: Converting to Soroban format..."
cd "$BASE_DIR/soroban"
node zk_convert.js \
  ../circuits/artifacts/proof.json \
  ../circuits/artifacts/kyc_transfer_vkey.json

echo "✅ Conversion complete"
echo ""

# Step 5: Deploy contract (if needed)
echo "🚀 Step 5: Deploying contract..."
cd "$BASE_DIR/soroban"

if [ -z "$CONTRACT_ID" ]; then
  CONTRACT_ID=$(stellar contract deploy \
    --wasm target/wasm32-unknown-unknown/release/soroban_groth16_verifier.wasm \
    --source "$IDENTITY" \
    --network "$NETWORK")
  echo "Contract deployed: $CONTRACT_ID"
else
  echo "Using existing contract: $CONTRACT_ID"
fi
echo ""

# Step 6: Verify on-chain
echo "⛓️  Step 6: Verifying on-chain..."
cd "$BASE_DIR/soroban"
./zk_run.sh

echo ""
echo "✅ Complete pipeline finished successfully!"
echo ""
echo "View contract on explorer:"
echo "https://stellar.expert/explorer/$NETWORK/contract/$CONTRACT_ID"
```

**Save as:** `complete_pipeline.sh`

**Run:**
```bash
chmod +x complete_pipeline.sh
./complete_pipeline.sh
```

---

## 🎯 What You Just Did

1. ✅ **Compiled** a zero-knowledge circuit for KYC verification
2. ✅ **Generated** cryptographic keys (proving + verification)
3. ✅ **Created** a proof that age=25, balance=150, country=32
4. ✅ **Verified** the proof locally with snarkjs
5. ✅ **Converted** to Soroban-compatible format
6. ✅ **Deployed** smart contract to Stellar testnet
7. ✅ **Verified** the proof on-chain

**Privacy Preserved:** The blockchain only sees:
- ✅ Proof is valid
- ✅ kycValid = 1 (passed)

**Never Revealed:**
- ❌ Actual age (25)
- ❌ Actual balance (150)
- ❌ Actual country (32)

---

## 📊 Next Steps

### For Development

1. **Customize the circuit** - Edit `circuits/kyc_transfer.circom`
2. **Add more constraints** - Age ranges, balance limits, country lists
3. **Create UI** - Build frontend to generate proofs
4. **Integrate with dApp** - Call contract from Stellar dApp

### For Production

1. **Perform trusted setup ceremony** - Multi-party computation
2. **Optimize circuit** - Reduce constraint count
3. **Audit smart contracts** - Security review
4. **Add monitoring** - Track proof submissions
5. **Implement key management** - Secure nullifier generation

---

## 🔍 Troubleshooting

### Issue: Circuit compilation fails

```bash
# Solution: Reinstall circom
npm install -g circom

# Or use specific version
npm install -g circom@2.1.9
```

### Issue: snarkjs not found

```bash
# Solution: Install globally
npm install -g snarkjs

# Verify installation
snarkjs --version
```

### Issue: Contract deployment fails

```bash
# Solution 1: Check account is funded
stellar account --source alice --network testnet

# Solution 2: Fund account
stellar keys fund alice --network testnet

# Solution 3: Check WASM exists
ls -lh target/wasm32-unknown-unknown/release/*.wasm
```

### Issue: Proof verification fails on-chain

```bash
# Solution 1: Verify proof locally first
cd circuits
snarkjs groth16 verify \
  artifacts/kyc_transfer_vkey.json \
  artifacts/public.json \
  artifacts/proof.json

# Solution 2: Check conversion
cd soroban
node zk_convert.js ../circuits/artifacts/proof.json

# Solution 3: Verify contract version
stellar contract invoke \
  --id $CONTRACT_ID \
  --source alice \
  --network testnet \
  -- \
  version
```

---

## 📚 Resources

- **Circom Documentation:** https://docs.circom.io/
- **snarkjs GitHub:** https://github.com/iden3/snarkjs
- **Stellar Soroban Docs:** https://developers.stellar.org/docs/smart-contracts
- **Groth16 Paper:** https://eprint.iacr.org/2016/260.pdf
- **This Repository:** https://github.com/xcapit/openzktool

---

## 📝 Summary

You now have a **complete end-to-end zero-knowledge proof system** running on Stellar:

- **Off-chain:** Generate proofs with circom + snarkjs
- **On-chain:** Verify proofs with Soroban smart contracts
- **Privacy:** Sensitive data never leaves your machine
- **Security:** Cryptographically verified compliance

**Total Time:** ~10 minutes for first run, ~30 seconds for subsequent proofs.

**Cost:** Minimal - only gas fees for on-chain verification (~0.00001 XLM per verification).

---

**Last Updated:** October 13, 2024
**Version:** 1.0
**Author:** OpenZKTool Team
