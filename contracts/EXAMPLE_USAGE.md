# PrivacyVerifier - Example Usage

Complete examples for using the PrivacyVerifier contract with nullifier tracking and credential management.

---

## 📋 Table of Contents

1. [Basic Setup](#basic-setup)
2. [Example 1: Simple KYC Verification](#example-1-simple-kyc-verification)
3. [Example 2: Credential Registration Flow](#example-2-credential-registration-flow)
4. [Example 3: Nullifier Tracking](#example-3-nullifier-tracking)
5. [Example 4: Complete Production Flow](#example-4-complete-production-flow)

---

## Basic Setup

### Prerequisites

```bash
# Build the contract
cd contracts
cargo build --target wasm32-unknown-unknown --release

# Deploy to testnet
CONTRACT_ID=$(stellar contract deploy \
  --wasm target/wasm32-unknown-unknown/release/stellar_privacy_verifier.wasm \
  --source alice \
  --network testnet)

echo "Contract deployed: $CONTRACT_ID"

# Initialize with admin
ADMIN_ADDRESS=$(stellar keys address alice)

stellar contract invoke \
  --id "$CONTRACT_ID" \
  --source alice \
  --network testnet \
  -- \
  initialize \
  --admin "$ADMIN_ADDRESS"

echo "✅ Contract initialized"
```

---

## Example 1: Simple KYC Verification

Basic proof verification without credential registry.

### Step 1: Generate Proof Off-Chain

```bash
cd ../circuits

# Create input with user's private data
cat > artifacts/input.json <<EOF
{
  "age": 25,
  "minAge": 18,
  "maxAge": 99,
  "balance": 150,
  "minBalance": 50,
  "countryId": 32
}
EOF

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
```

### Step 2: Create Commitment and Nullifier

```bash
# Generate commitment (hash of user's data)
COMMITMENT=$(echo -n "user123_age25_balance150_country32" | sha256sum | cut -d' ' -f1 | head -c 64)
echo "Commitment: $COMMITMENT"

# Generate unique nullifier (prevents reuse)
SECRET=$(openssl rand -hex 32)
NULLIFIER=$(echo -n "${SECRET}_${COMMITMENT}" | sha256sum | cut -d' ' -f1 | head -c 64)
echo "Nullifier: $NULLIFIER"
echo "Secret (SAVE THIS): $SECRET"
```

### Step 3: Submit Proof for Verification

```bash
cd ../soroban

# Convert proof to Soroban format
node zk_convert.js \
  ../circuits/artifacts/proof.json \
  ../circuits/artifacts/kyc_transfer_vkey.json

# Extract proof components
PI_A_X=$(cat args.json | jq -r '.proof.pi_a.x')
PI_A_Y=$(cat args.json | jq -r '.proof.pi_a.y')
# ... (similar for pi_b, pi_c)

# Submit to PrivacyVerifier
cd ../contracts

stellar contract invoke \
  --id "$CONTRACT_ID" \
  --source alice \
  --network testnet \
  -- \
  verify_proof \
  --proof "{
    \"commitment\": \"$COMMITMENT\",
    \"nullifier\": \"$NULLIFIER\",
    \"pi_a\": {\"x\": \"$PI_A_X\", \"y\": \"$PI_A_Y\"},
    \"pi_b\": {...},
    \"pi_c\": {...},
    \"public_inputs\": [\"0x01\"]
  }" \
  --encrypted_data "00"

# Expected output:
# {
#   "valid": true,
#   "timestamp": 1234567890
# }
```

---

## Example 2: Credential Registration Flow

Admin registers user's KYC credential before verification.

### Step 1: Admin Registers Credential

```bash
cd contracts

# Admin creates commitment for user
USER_ID="user_12345"
KYC_DATA="age:25,country:US,verified:2024-10-13"
COMMITMENT=$(echo -n "${USER_ID}_${KYC_DATA}" | sha256sum | cut -d' ' -f1 | head -c 64)

echo "Registering credential for user: $USER_ID"
echo "Commitment: $COMMITMENT"

# Admin registers the credential
stellar contract invoke \
  --id "$CONTRACT_ID" \
  --source alice \
  --network testnet \
  -- \
  register_credential \
  --admin "$ADMIN_ADDRESS" \
  --commitment "$COMMITMENT"

echo "✅ Credential registered"
```

### Step 2: Verify Credential is Registered

```bash
# Check if credential exists
HAS_CRED=$(stellar contract invoke \
  --id "$CONTRACT_ID" \
  --source alice \
  --network testnet \
  -- \
  has_credential \
  --commitment "$COMMITMENT")

echo "Credential registered: $HAS_CRED"
# Expected: true
```

### Step 3: User Generates Proof

```bash
# User generates proof with their secret
USER_SECRET="my_secret_key_12345"
NULLIFIER=$(echo -n "${USER_SECRET}_${COMMITMENT}" | sha256sum | cut -d' ' -f1 | head -c 64)

# Generate ZK proof (same as Example 1)
cd ../circuits
# ... generate proof.json ...

# Submit for verification
cd ../contracts
stellar contract invoke \
  --id "$CONTRACT_ID" \
  --source alice \
  --network testnet \
  -- \
  verify_proof \
  --proof "{
    \"commitment\": \"$COMMITMENT\",
    \"nullifier\": \"$NULLIFIER\",
    ...
  }" \
  --encrypted_data "00"
```

---

## Example 3: Nullifier Tracking

Demonstrates double-spend prevention.

### Step 1: First Verification (Success)

```bash
cd contracts

# Generate unique nullifier
NULLIFIER1=$(openssl rand -hex 32 | head -c 64)

echo "Attempting first verification with nullifier: $NULLIFIER1"

# Verify proof (should succeed)
RESULT1=$(stellar contract invoke \
  --id "$CONTRACT_ID" \
  --source alice \
  --network testnet \
  -- \
  verify_proof \
  --proof "{
    \"commitment\": \"$COMMITMENT\",
    \"nullifier\": \"$NULLIFIER1\",
    ...
  }" \
  --encrypted_data "00")

echo "First verification result:"
echo "$RESULT1" | jq .
# Expected: { "valid": true, "timestamp": ... }
```

### Step 2: Check Nullifier is Tracked

```bash
# Check if nullifier was recorded
IS_USED=$(stellar contract invoke \
  --id "$CONTRACT_ID" \
  --source alice \
  --network testnet \
  -- \
  is_nullifier_used \
  --nullifier "$NULLIFIER1")

echo "Nullifier used: $IS_USED"
# Expected: true

# Get block number when it was used
BLOCK=$(stellar contract invoke \
  --id "$CONTRACT_ID" \
  --source alice \
  --network testnet \
  -- \
  get_nullifier_block \
  --nullifier "$NULLIFIER1")

echo "Used at block: $BLOCK"
```

### Step 3: Attempt Reuse (Fails)

```bash
# Try to use the same nullifier again
echo "Attempting to reuse nullifier: $NULLIFIER1"

RESULT2=$(stellar contract invoke \
  --id "$CONTRACT_ID" \
  --source alice \
  --network testnet \
  -- \
  verify_proof \
  --proof "{
    \"commitment\": \"$COMMITMENT\",
    \"nullifier\": \"$NULLIFIER1\",
    ...
  }" \
  --encrypted_data "00")

echo "Second verification result:"
echo "$RESULT2" | jq .
# Expected: { "valid": false, "timestamp": ... }
```

---

## Example 4: Complete Production Flow

Full end-to-end example with error handling.

### production_verify.sh

```bash
#!/bin/bash
set -e

# Configuration
CONTRACT_ID="YOUR_CONTRACT_ID"
ADMIN_IDENTITY="alice"
USER_IDENTITY="bob"
NETWORK="testnet"

echo "🔒 Production KYC Verification Flow"
echo "===================================="
echo ""

# Step 1: Admin registers user's credential
echo "Step 1: Admin registers credential..."

USER_ID="user_$(date +%s)"
KYC_DATA="age:30,country:US,balance:5000,verified:$(date -I)"
COMMITMENT=$(echo -n "${USER_ID}_${KYC_DATA}" | sha256sum | cut -d' ' -f1 | head -c 64)

ADMIN_ADDRESS=$(stellar keys address "$ADMIN_IDENTITY")

stellar contract invoke \
  --id "$CONTRACT_ID" \
  --source "$ADMIN_IDENTITY" \
  --network "$NETWORK" \
  -- \
  register_credential \
  --admin "$ADMIN_ADDRESS" \
  --commitment "$COMMITMENT"

echo "✅ Credential registered"
echo "   User ID: $USER_ID"
echo "   Commitment: $COMMITMENT"
echo ""

# Step 2: User generates proof off-chain
echo "Step 2: User generates ZK proof..."

cd circuits

# Create input with user's PRIVATE data
cat > artifacts/input_prod.json <<EOF
{
  "age": 30,
  "minAge": 18,
  "maxAge": 65,
  "balance": 5000,
  "minBalance": 1000,
  "countryId": 1
}
EOF

# Generate witness
node artifacts/kyc_transfer_js/generate_witness.js \
  artifacts/kyc_transfer_js/kyc_transfer.wasm \
  artifacts/input_prod.json \
  artifacts/witness_prod.wtns

# Generate proof
snarkjs groth16 prove \
  artifacts/kyc_transfer_final.zkey \
  artifacts/witness_prod.wtns \
  artifacts/proof_prod.json \
  artifacts/public_prod.json

# Verify locally first
echo "Verifying proof locally..."
if ! snarkjs groth16 verify \
  artifacts/kyc_transfer_vkey.json \
  artifacts/public_prod.json \
  artifacts/proof_prod.json; then
  echo "❌ Local verification failed"
  exit 1
fi

echo "✅ Proof generated and verified locally"
echo ""

# Step 3: Generate nullifier
echo "Step 3: Generating nullifier..."

USER_SECRET="secret_key_${USER_ID}_$(openssl rand -hex 16)"
NULLIFIER=$(echo -n "${USER_SECRET}_${COMMITMENT}" | sha256sum | cut -d' ' -f1 | head -c 64)

# Save secret securely (in production, use key management system)
echo "$USER_SECRET" > ".user_secret_${USER_ID}.txt"
chmod 600 ".user_secret_${USER_ID}.txt"

echo "✅ Nullifier generated"
echo "   Nullifier: $NULLIFIER"
echo "   Secret saved to: .user_secret_${USER_ID}.txt"
echo ""

# Step 4: Convert to Soroban format
echo "Step 4: Converting to Soroban format..."

cd ../soroban
node zk_convert.js \
  ../circuits/artifacts/proof_prod.json \
  ../circuits/artifacts/kyc_transfer_vkey.json

mv args.json args_prod.json

echo "✅ Converted to Soroban format"
echo ""

# Step 5: Check nullifier not already used
echo "Step 5: Checking nullifier availability..."

cd ../contracts

IS_USED=$(stellar contract invoke \
  --id "$CONTRACT_ID" \
  --source "$USER_IDENTITY" \
  --network "$NETWORK" \
  -- \
  is_nullifier_used \
  --nullifier "$NULLIFIER")

if [ "$IS_USED" = "true" ]; then
  echo "❌ Nullifier already used. Cannot proceed."
  exit 1
fi

echo "✅ Nullifier available"
echo ""

# Step 6: Submit proof for verification
echo "Step 6: Submitting proof to blockchain..."

# Extract proof components from args_prod.json
PROOF_JSON=$(cat ../soroban/args_prod.json | jq -c '{
  commitment: "'"$COMMITMENT"'",
  nullifier: "'"$NULLIFIER"'",
  pi_a: .proof.pi_a,
  pi_b: .proof.pi_b,
  pi_c: .proof.pi_c,
  public_inputs: .public_inputs
}')

RESULT=$(stellar contract invoke \
  --id "$CONTRACT_ID" \
  --source "$USER_IDENTITY" \
  --network "$NETWORK" \
  -- \
  verify_proof \
  --proof "$PROOF_JSON" \
  --encrypted_data "00" | jq .)

echo "✅ Verification complete"
echo ""
echo "Result:"
echo "$RESULT"

# Check result
VALID=$(echo "$RESULT" | jq -r .valid)
TIMESTAMP=$(echo "$RESULT" | jq -r .timestamp)

if [ "$VALID" = "true" ]; then
  echo ""
  echo "✅ SUCCESS: KYC verification passed"
  echo "   Timestamp: $TIMESTAMP"
  echo "   User can now proceed with transaction"
  echo ""
  echo "📊 Summary:"
  echo "   - Private data (age, balance, country) NOT revealed"
  echo "   - Proof verified on Stellar blockchain"
  echo "   - Nullifier tracked (prevents reuse)"
else
  echo ""
  echo "❌ FAILURE: KYC verification failed"
  exit 1
fi

# Step 7: Verify nullifier is now tracked
echo "Step 7: Confirming nullifier tracking..."

IS_USED_NOW=$(stellar contract invoke \
  --id "$CONTRACT_ID" \
  --source "$USER_IDENTITY" \
  --network "$NETWORK" \
  -- \
  is_nullifier_used \
  --nullifier "$NULLIFIER")

USED_BLOCK=$(stellar contract invoke \
  --id "$CONTRACT_ID" \
  --source "$USER_IDENTITY" \
  --network "$NETWORK" \
  -- \
  get_nullifier_block \
  --nullifier "$NULLIFIER")

echo "✅ Nullifier tracking confirmed"
echo "   Used: $IS_USED_NOW"
echo "   Block: $USED_BLOCK"
echo ""

echo "🎉 Complete production flow successful!"
echo ""
echo "View on explorer:"
echo "https://stellar.expert/explorer/$NETWORK/contract/$CONTRACT_ID"
echo ""
```

### Make it executable

```bash
chmod +x production_verify.sh
```

### Run it

```bash
# Set your contract ID
export CONTRACT_ID="YOUR_CONTRACT_ID_HERE"

# Run the production flow
./production_verify.sh
```

---

## 🔐 Security Best Practices

### Nullifier Generation

✅ **DO:**
```bash
# Use user's secret + commitment
USER_SECRET="$(openssl rand -hex 32)"
NULLIFIER=$(echo -n "${USER_SECRET}_${COMMITMENT}" | sha256sum | cut -d' ' -f1)
```

❌ **DON'T:**
```bash
# Just hash the commitment (can be reused!)
NULLIFIER=$(echo -n "${COMMITMENT}" | sha256sum | cut -d' ' -f1)
```

### Commitment Creation

✅ **DO:**
```bash
# Include salt
SALT="$(openssl rand -hex 16)"
COMMITMENT=$(echo -n "${SALT}_${USER_DATA}" | sha256sum | cut -d' ' -f1)
```

❌ **DON'T:**
```bash
# Direct hash (vulnerable to dictionary attacks)
COMMITMENT=$(echo -n "${USER_DATA}" | sha256sum | cut -d' ' -f1)
```

### Secret Storage

✅ **DO:**
```bash
# Store encrypted with proper key management
echo "$USER_SECRET" | gpg --encrypt > secret.gpg
chmod 600 secret.gpg
```

❌ **DON'T:**
```bash
# Store plaintext
echo "$USER_SECRET" > secret.txt
```

---

## 📊 Common Use Cases

### Use Case 1: Age Verification for DeFi

User proves they are 18+ without revealing exact age:

```json
{
  "age": 25,
  "minAge": 18,
  "maxAge": 150,
  "balance": 0,
  "minBalance": 0,
  "countryId": 0
}
```

### Use Case 2: Solvency Proof

User proves they have sufficient balance:

```json
{
  "age": 0,
  "minAge": 0,
  "maxAge": 200,
  "balance": 10000,
  "minBalance": 5000,
  "countryId": 0
}
```

### Use Case 3: Geo-Compliance

User proves they're from allowed country:

```json
{
  "age": 0,
  "minAge": 0,
  "maxAge": 200,
  "balance": 0,
  "minBalance": 0,
  "countryId": 1
}
```

### Use Case 4: Complete KYC

All checks combined:

```json
{
  "age": 30,
  "minAge": 18,
  "maxAge": 65,
  "balance": 5000,
  "minBalance": 1000,
  "countryId": 1
}
```

---

## 🔍 Debugging

### Check Contract Events

```bash
# Get recent transactions
stellar contract invoke \
  --id "$CONTRACT_ID" \
  --source alice \
  --network testnet \
  -- \
  get_events

# View on explorer
open "https://stellar.expert/explorer/testnet/contract/$CONTRACT_ID"
```

### Test Nullifier Tracking

```bash
# List all used nullifiers (not available in contract, use indexer)
# In production, use a separate indexer service
```

### Verify Credential Registry

```bash
# Check specific commitment
stellar contract invoke \
  --id "$CONTRACT_ID" \
  --source alice \
  --network testnet \
  -- \
  has_credential \
  --commitment "$COMMITMENT"
```

---

## 📚 Related Documentation

- **[COMPLETE_TUTORIAL.md](../COMPLETE_TUTORIAL.md)** - Full tutorial
- **[PRIVACY_VERIFIER_GUIDE.md](./PRIVACY_VERIFIER_GUIDE.md)** - Contract reference
- **[CONTRACTS_ARCHITECTURE.md](../CONTRACTS_ARCHITECTURE.md)** - Architecture overview

---

**Last Updated:** October 13, 2024
**Version:** 1.0
**License:** AGPL-3.0-or-later
