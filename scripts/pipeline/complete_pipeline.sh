#!/bin/bash
set -e

# ============================================
# 🚀 COMPLETE ZK PROOF PIPELINE
# From Circuit to On-Chain Verification
# ============================================

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Configuration
NETWORK="${NETWORK:-testnet}"
IDENTITY="${IDENTITY:-alice}"
BASE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SKIP_BUILD="${SKIP_BUILD:-false}"
SKIP_DEPLOY="${SKIP_DEPLOY:-false}"

echo ""
echo "╔═══════════════════════════════════════════════════════════════════╗"
echo "║                                                                   ║"
echo "║     🚀 COMPLETE ZERO-KNOWLEDGE PROOF PIPELINE                    ║"
echo "║     From Circuit Generation to On-Chain Verification             ║"
echo "║                                                                   ║"
echo "╚═══════════════════════════════════════════════════════════════════╝"
echo ""
echo -e "${BLUE}Configuration:${NC}"
echo "  Network: $NETWORK"
echo "  Identity: $IDENTITY"
echo "  Base Directory: $BASE_DIR"
echo ""

# Check prerequisites
echo -e "${YELLOW}🔍 Checking prerequisites...${NC}"

command -v circom >/dev/null 2>&1 || {
  echo -e "${RED}❌ circom not found. Install: npm install -g circom${NC}"
  exit 1
}

command -v snarkjs >/dev/null 2>&1 || {
  echo -e "${RED}❌ snarkjs not found. Install: npm install -g snarkjs${NC}"
  exit 1
}

command -v stellar >/dev/null 2>&1 || {
  echo -e "${RED}❌ stellar CLI not found. Install from: https://developers.stellar.org/docs/tools/developer-tools${NC}"
  exit 1
}

command -v node >/dev/null 2>&1 || {
  echo -e "${RED}❌ node not found. Install Node.js v18+${NC}"
  exit 1
}

echo -e "${GREEN}✅ All prerequisites installed${NC}"
echo ""

# ===========================================
# STEP 1: Build Circuits (if needed)
# ===========================================
echo -e "${YELLOW}📐 STEP 1: Circuit Compilation${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

cd "$BASE_DIR/circuits"

CIRCUIT_NAME="kyc_transfer"
R1CS="artifacts/${CIRCUIT_NAME}.r1cs"
WASM="artifacts/${CIRCUIT_NAME}_js/${CIRCUIT_NAME}.wasm"

if [ ! -f "$WASM" ] || [ "$SKIP_BUILD" != "true" ]; then
  echo "Compiling circuit: ${CIRCUIT_NAME}.circom"

  # Compile circuit
  circom ${CIRCUIT_NAME}.circom \
    --r1cs \
    --wasm \
    --sym \
    -o artifacts/

  echo -e "${GREEN}✅ Circuit compiled successfully${NC}"
  echo "   - R1CS: $R1CS"
  echo "   - WASM: $WASM"
else
  echo -e "${GREEN}✅ Circuit already compiled (skipping)${NC}"
fi
echo ""

# ===========================================
# STEP 2: Trusted Setup (if needed)
# ===========================================
echo -e "${YELLOW}🔑 STEP 2: Trusted Setup${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

PTAU="artifacts/pot12_final_phase2.ptau"
ZKEY_0="artifacts/${CIRCUIT_NAME}_0000.zkey"
ZKEY_FINAL="artifacts/${CIRCUIT_NAME}_final.zkey"
VKEY="artifacts/${CIRCUIT_NAME}_vkey.json"

if [ ! -f "$ZKEY_FINAL" ] || [ "$SKIP_BUILD" != "true" ]; then

  # Download Powers of Tau if needed
  if [ ! -f "$PTAU" ]; then
    echo "Downloading Powers of Tau (this may take a few minutes)..."
    curl -# -o "$PTAU" \
      https://hermez.s3-eu-west-1.amazonaws.com/powersOfTau28_hez_final_12.ptau
    echo -e "${GREEN}✅ Powers of Tau downloaded${NC}"
  fi

  # Generate initial zkey
  echo "Generating proving key..."
  snarkjs groth16 setup \
    "$R1CS" \
    "$PTAU" \
    "$ZKEY_0"

  # Contribute to ceremony
  echo "Contributing to ceremony..."
  echo "random entropy" | snarkjs zkey contribute \
    "$ZKEY_0" \
    "$ZKEY_FINAL" \
    --name="Pipeline contribution" \
    -v

  # Export verification key
  echo "Exporting verification key..."
  snarkjs zkey export verificationkey \
    "$ZKEY_FINAL" \
    "$VKEY"

  echo -e "${GREEN}✅ Trusted setup complete${NC}"
  echo "   - Proving key: $ZKEY_FINAL"
  echo "   - Verification key: $VKEY"
else
  echo -e "${GREEN}✅ Trusted setup already complete (skipping)${NC}"
fi
echo ""

# ===========================================
# STEP 3: Generate Proof
# ===========================================
echo -e "${YELLOW}🔐 STEP 3: Proof Generation${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

INPUT="artifacts/input.json"
WITNESS="artifacts/witness.wtns"
PROOF="artifacts/proof.json"
PUBLIC="artifacts/public.json"

# Show input data (private - not revealed on-chain)
echo "Input data (PRIVATE):"
cat "$INPUT" | jq .
echo ""

# Generate witness
echo "Generating witness..."
node artifacts/${CIRCUIT_NAME}_js/generate_witness.js \
  artifacts/${CIRCUIT_NAME}_js/${CIRCUIT_NAME}.wasm \
  "$INPUT" \
  "$WITNESS"

# Generate proof
echo "Generating zero-knowledge proof..."
snarkjs groth16 prove \
  "$ZKEY_FINAL" \
  "$WITNESS" \
  "$PROOF" \
  "$PUBLIC"

echo -e "${GREEN}✅ Proof generated${NC}"
echo "   - Proof: $PROOF"
echo "   - Public signals: $PUBLIC"
echo ""

# ===========================================
# STEP 4: Verify Locally
# ===========================================
echo -e "${YELLOW}✔️  STEP 4: Local Verification${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

echo "Verifying proof locally with snarkjs..."
snarkjs groth16 verify \
  "$VKEY" \
  "$PUBLIC" \
  "$PROOF"

echo -e "${GREEN}✅ Local verification passed${NC}"
echo ""

# ===========================================
# STEP 5: Convert to Soroban Format
# ===========================================
echo -e "${YELLOW}🔄 STEP 5: Convert to Soroban Format${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

cd "$BASE_DIR/soroban"

echo "Converting proof to Soroban-compatible format..."
node zk_convert.js \
  "$BASE_DIR/circuits/$PROOF" \
  "$BASE_DIR/circuits/$VKEY"

echo -e "${GREEN}✅ Conversion complete${NC}"
echo "   - Output: soroban/args.json"
echo ""

# ===========================================
# STEP 6: Deploy Contract (if needed)
# ===========================================
echo -e "${YELLOW}🚀 STEP 6: Contract Deployment${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

cd "$BASE_DIR/soroban"

# Build contract if needed
WASM_CONTRACT="target/wasm32-unknown-unknown/release/soroban_groth16_verifier.wasm"

if [ ! -f "$WASM_CONTRACT" ]; then
  echo "Building Soroban contract..."
  cargo build --target wasm32-unknown-unknown --release
  echo -e "${GREEN}✅ Contract built${NC}"
fi

# Deploy or use existing contract
if [ -z "$CONTRACT_ID" ] && [ "$SKIP_DEPLOY" != "true" ]; then
  echo "Deploying contract to $NETWORK..."

  CONTRACT_ID=$(stellar contract deploy \
    --wasm "$WASM_CONTRACT" \
    --source "$IDENTITY" \
    --network "$NETWORK" 2>&1 | tee /dev/tty | tail -1)

  echo -e "${GREEN}✅ Contract deployed${NC}"
  echo "   - Contract ID: $CONTRACT_ID"
  echo "   - Explorer: https://stellar.expert/explorer/$NETWORK/contract/$CONTRACT_ID"

  # Save contract ID for future runs
  echo "$CONTRACT_ID" > .contract_id
else
  if [ -f ".contract_id" ]; then
    CONTRACT_ID=$(cat .contract_id)
    echo -e "${BLUE}ℹ️  Using existing contract${NC}"
    echo "   - Contract ID: $CONTRACT_ID"
  else
    echo -e "${RED}❌ No contract ID found. Set CONTRACT_ID or remove SKIP_DEPLOY=true${NC}"
    exit 1
  fi
fi
echo ""

# ===========================================
# STEP 7: Verify On-Chain
# ===========================================
echo -e "${YELLOW}⛓️  STEP 7: On-Chain Verification${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

cd "$BASE_DIR/soroban"

echo "Submitting proof to Stellar blockchain..."
echo ""

# Read args.json
if [ ! -f "args.json" ]; then
  echo -e "${RED}❌ args.json not found${NC}"
  exit 1
fi

# Extract components from args.json
PROOF_DATA=$(cat args.json | jq -c '.proof')
VK_DATA=$(cat args.json | jq -c '.vk')
PUBLIC_INPUTS=$(cat args.json | jq -c '.public_inputs')

echo "Invoking verify_proof() on contract..."
RESULT=$(stellar contract invoke \
  --id "$CONTRACT_ID" \
  --source "$IDENTITY" \
  --network "$NETWORK" \
  -- \
  verify_proof \
  --proof "$PROOF_DATA" \
  --vk "$VK_DATA" \
  --public_inputs "$PUBLIC_INPUTS" 2>&1 | tee /dev/tty | tail -1)

echo ""
if [ "$RESULT" = "true" ]; then
  echo -e "${GREEN}✅ ON-CHAIN VERIFICATION SUCCESSFUL!${NC}"
else
  echo -e "${RED}❌ On-chain verification failed${NC}"
  exit 1
fi
echo ""

# ===========================================
# SUMMARY
# ===========================================
echo ""
echo "╔═══════════════════════════════════════════════════════════════════╗"
echo "║                                                                   ║"
echo "║     ✅ PIPELINE COMPLETED SUCCESSFULLY                           ║"
echo "║                                                                   ║"
echo "╚═══════════════════════════════════════════════════════════════════╝"
echo ""
echo -e "${BLUE}📊 Summary:${NC}"
echo ""
echo "  ✅ Circuit compiled: ${CIRCUIT_NAME}.circom"
echo "  ✅ Trusted setup completed"
echo "  ✅ Proof generated from private inputs"
echo "  ✅ Local verification: PASSED"
echo "  ✅ Converted to Soroban format"
echo "  ✅ Contract deployed: $CONTRACT_ID"
echo "  ✅ On-chain verification: PASSED"
echo ""
echo -e "${BLUE}🔒 Privacy Preserved:${NC}"
echo "  ✅ Age (25) - NOT revealed on-chain"
echo "  ✅ Balance (150) - NOT revealed on-chain"
echo "  ✅ Country (32) - NOT revealed on-chain"
echo "  ✅ Only proof validity published"
echo ""
echo -e "${BLUE}🔗 Links:${NC}"
echo "  Contract: https://stellar.expert/explorer/$NETWORK/contract/$CONTRACT_ID"
echo "  Documentation: $BASE_DIR/COMPLETE_TUTORIAL.md"
echo ""
echo -e "${GREEN}🎉 Zero-knowledge proof verified on Stellar!${NC}"
echo ""
