#!/bin/bash
set -e

# ============================================
# ⚡ QUICK TEST - ZK Proof Pipeline
# Fast test using pre-built artifacts
# ============================================

BASE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
NETWORK="${NETWORK:-testnet}"
IDENTITY="${IDENTITY:-alice}"

echo "⚡ Quick ZK Proof Test"
echo "====================="
echo ""

# Check if artifacts exist
cd "$BASE_DIR/circuits"

if [ ! -f "artifacts/kyc_transfer_final.zkey" ]; then
  echo "❌ Artifacts not found. Run complete_pipeline.sh first"
  exit 1
fi

echo "✅ Using existing artifacts"
echo ""

# Step 1: Generate new witness with custom input
echo "📝 Step 1: Creating custom input..."

cat > artifacts/input.json <<EOF
{
  "age": 30,
  "minAge": 18,
  "maxAge": 99,
  "balance": 1000,
  "minBalance": 100,
  "countryId": 1
}
EOF

echo "✅ Input created:"
cat artifacts/input.json | jq .
echo ""

# Step 2: Generate witness
echo "🔐 Step 2: Generating witness..."
node artifacts/kyc_transfer_js/generate_witness.js \
  artifacts/kyc_transfer_js/kyc_transfer.wasm \
  artifacts/input.json \
  artifacts/witness.wtns

echo "✅ Witness generated"
echo ""

# Step 3: Generate proof
echo "🔐 Step 3: Generating proof..."
snarkjs groth16 prove \
  artifacts/kyc_transfer_final.zkey \
  artifacts/witness.wtns \
  artifacts/proof.json \
  artifacts/public.json

echo "✅ Proof generated"
echo ""

# Step 4: Verify locally
echo "✔️  Step 4: Verifying locally..."
if snarkjs groth16 verify \
  artifacts/kyc_transfer_vkey.json \
  artifacts/public.json \
  artifacts/proof.json; then
  echo "✅ Local verification: PASSED"
else
  echo "❌ Local verification: FAILED"
  exit 1
fi
echo ""

# Step 5: Convert to Soroban
echo "🔄 Step 5: Converting to Soroban format..."
cd "$BASE_DIR/soroban"
node zk_convert.js \
  ../circuits/artifacts/proof.json \
  ../circuits/artifacts/kyc_transfer_vkey.json

echo "✅ Converted"
echo ""

# Step 6: Verify on-chain (if contract exists)
if [ -f ".contract_id" ]; then
  CONTRACT_ID=$(cat .contract_id)
  echo "⛓️  Step 6: Verifying on-chain..."
  echo "Contract: $CONTRACT_ID"
  echo ""

  PROOF_DATA=$(cat args.json | jq -c '.proof')
  VK_DATA=$(cat args.json | jq -c '.vk')
  PUBLIC_INPUTS=$(cat args.json | jq -c '.public_inputs')

  RESULT=$(stellar contract invoke \
    --id "$CONTRACT_ID" \
    --source "$IDENTITY" \
    --network "$NETWORK" \
    -- \
    verify_proof \
    --proof "$PROOF_DATA" \
    --vk "$VK_DATA" \
    --public_inputs "$PUBLIC_INPUTS" 2>&1 | tail -1)

  if [ "$RESULT" = "true" ]; then
    echo "✅ On-chain verification: PASSED"
  else
    echo "❌ On-chain verification: FAILED"
    exit 1
  fi
else
  echo "ℹ️  No contract deployed. Run complete_pipeline.sh first."
fi

echo ""
echo "✅ Quick test complete!"
echo ""
