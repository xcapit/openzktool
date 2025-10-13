#!/bin/bash
set -e

echo "🔒 PrivacyVerifier Contract - Complete Demo"
echo "==========================================="
echo ""

# Configuration
NETWORK="testnet"
CONTRACT_WASM="target/wasm32-unknown-unknown/release/stellar_privacy_verifier.wasm"
ADMIN_IDENTITY="alice"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}📋 Demo Steps:${NC}"
echo "1. Build the contract"
echo "2. Deploy to network"
echo "3. Initialize with admin"
echo "4. Register a KYC credential"
echo "5. Submit a proof for verification"
echo "6. Check nullifier tracking"
echo ""

# Step 1: Build
echo -e "${YELLOW}Step 1: Building PrivacyVerifier contract...${NC}"
cd /Users/fboiero/Documents/STELLAR/stellar-privacy-poc/contracts

if [ ! -f "$CONTRACT_WASM" ]; then
    echo "Building WASM..."
    cargo build --target wasm32-unknown-unknown --release
    echo -e "${GREEN}✅ Build complete${NC}"
else
    echo -e "${GREEN}✅ WASM already exists${NC}"
fi

WASM_SIZE=$(ls -lh "$CONTRACT_WASM" | awk '{print $5}')
echo -e "   WASM size: ${WASM_SIZE}"
echo ""

# Step 2: Deploy
echo -e "${YELLOW}Step 2: Deploying to ${NETWORK}...${NC}"
echo "Command: stellar contract deploy --wasm $CONTRACT_WASM --source $ADMIN_IDENTITY --network $NETWORK"

CONTRACT_ID=$(stellar contract deploy \
    --wasm "$CONTRACT_WASM" \
    --source "$ADMIN_IDENTITY" \
    --network "$NETWORK" 2>&1 | tee /dev/tty | tail -1)

if [ -z "$CONTRACT_ID" ]; then
    echo -e "${RED}❌ Deployment failed${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Contract deployed${NC}"
echo -e "   Contract ID: ${CONTRACT_ID}"
echo ""

# Get admin address
ADMIN_ADDRESS=$(stellar keys address "$ADMIN_IDENTITY")
echo -e "   Admin address: ${ADMIN_ADDRESS}"
echo ""

# Step 3: Initialize
echo -e "${YELLOW}Step 3: Initializing contract...${NC}"
stellar contract invoke \
    --id "$CONTRACT_ID" \
    --source "$ADMIN_IDENTITY" \
    --network "$NETWORK" \
    -- \
    initialize \
    --admin "$ADMIN_ADDRESS"

echo -e "${GREEN}✅ Contract initialized${NC}"
echo ""

# Step 4: Register credential
echo -e "${YELLOW}Step 4: Registering KYC credential...${NC}"

# Generate a mock commitment (32 bytes)
COMMITMENT="0000000000000000000000000000000000000000000000000000000000000001"

stellar contract invoke \
    --id "$CONTRACT_ID" \
    --source "$ADMIN_IDENTITY" \
    --network "$NETWORK" \
    -- \
    register_credential \
    --admin "$ADMIN_ADDRESS" \
    --commitment "$COMMITMENT"

echo -e "${GREEN}✅ Credential registered${NC}"
echo -e "   Commitment: ${COMMITMENT}"
echo ""

# Verify credential was registered
echo "Checking credential registration..."
HAS_CRED=$(stellar contract invoke \
    --id "$CONTRACT_ID" \
    --source "$ADMIN_IDENTITY" \
    --network "$NETWORK" \
    -- \
    has_credential \
    --commitment "$COMMITMENT")

echo -e "   Registered: ${HAS_CRED}"
echo ""

# Step 5: Submit proof for verification
echo -e "${YELLOW}Step 5: Submitting proof for verification...${NC}"

# Generate mock proof components
NULLIFIER="1000000000000000000000000000000000000000000000000000000000000001"

# Mock G1 point (generator point on BN254)
G1_X="0000000000000000000000000000000000000000000000000000000000000001"
G1_Y="0000000000000000000000000000000000000000000000000000000000000002"

# Mock G2 point
G2_X0="198e9393920d483a7260bfb731fb5d25f1aa493335a9e71297e485b7aef312c2"
G2_X1="1800deef121f1e76426a00665e5c4479674322d4f75edadd46debd5cd992f6ed"
G2_Y0="090689d0585ff075ec9e99ad690c3395bc4b313370b38ef355acdadcd122975b"
G2_Y1="12c85ea5db8c6deb4aab71808dcb408fe3d1e7690c43d37b4ce6cc0166fa7daa"

# Public inputs (just "1" for this demo)
PUBLIC_INPUT="0000000000000000000000000000000000000000000000000000000000000001"

echo "Creating proof with:"
echo "  - Commitment: $COMMITMENT"
echo "  - Nullifier: $NULLIFIER"
echo "  - Public input: $PUBLIC_INPUT"
echo ""

# Note: This is a simplified demo. In production, you would:
# 1. Generate proof off-chain using snarkjs or similar
# 2. Convert proof to Soroban format
# 3. Submit to contract

echo -e "${BLUE}ℹ️  In production:${NC}"
echo "   1. Generate proof off-chain with snarkjs"
echo "   2. Convert to Soroban format with zk_convert.js"
echo "   3. Submit to verify_proof()"
echo ""

# Step 6: Check nullifier tracking
echo -e "${YELLOW}Step 6: Testing nullifier tracking...${NC}"

# Check if nullifier is used
IS_USED=$(stellar contract invoke \
    --id "$CONTRACT_ID" \
    --source "$ADMIN_IDENTITY" \
    --network "$NETWORK" \
    -- \
    is_nullifier_used \
    --nullifier "$NULLIFIER" || echo "false")

echo -e "   Nullifier used: ${IS_USED}"
echo ""

# Summary
echo -e "${GREEN}=========================================${NC}"
echo -e "${GREEN}✅ Demo Complete!${NC}"
echo -e "${GREEN}=========================================${NC}"
echo ""
echo -e "${BLUE}Contract Information:${NC}"
echo "  Network: $NETWORK"
echo "  Contract ID: $CONTRACT_ID"
echo "  Admin: $ADMIN_ADDRESS"
echo ""
echo -e "${BLUE}Features Demonstrated:${NC}"
echo "  ✅ Contract deployment"
echo "  ✅ Admin initialization"
echo "  ✅ Credential registration"
echo "  ✅ Nullifier tracking"
echo ""
echo -e "${BLUE}Next Steps:${NC}"
echo "  1. Generate real ZK proof using circuits/"
echo "  2. Convert proof with zk_convert.js"
echo "  3. Call verify_proof() with real cryptographic data"
echo ""
echo -e "${BLUE}View on Stellar Expert:${NC}"
echo "  https://stellar.expert/explorer/$NETWORK/contract/$CONTRACT_ID"
echo ""
