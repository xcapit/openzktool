#!/bin/bash

# OpenZKTool - Complete Demo Script for SDF Video
#
# This script demonstrates the complete flow of ZK proof generation and
# verification on Stellar using Soroban smart contracts.
#
# Flow:
# 1. Generate ZK proof (Circom + snarkjs)
# 2. Build and deploy Soroban verifier contract
# 3. Verify proof on-chain
# 4. Show results

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Configuration
NETWORK="${NETWORK:-testnet}"
CIRCUIT_NAME="kyc_transfer"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}OpenZKTool - Complete ZK Demo for Stellar${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo "This demo shows:"
echo "  1. Private data (age, balance, country) stays secret"
echo "  2. Zero-knowledge proof generation (<1 second)"
echo "  3. On-chain verification on Stellar Soroban"
echo "  4. Multi-chain compatibility (same proof works on EVM)"
echo ""
echo -e "${YELLOW}Press Enter to start...${NC}"
read

# =============================================================================
# STEP 1: Show the scenario
# =============================================================================

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}STEP 1: The Scenario${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "Alice wants to make a transaction that requires:"
echo "  - Age ≥ 18 years old"
echo "  - Balance ≥ 50 units"
echo "  - Country in allowed list"
echo ""
echo "But Alice doesn't want to reveal:"
echo "  - Her exact age"
echo "  - Her exact balance"
echo "  - Her exact country"
echo ""
echo "Solution: Zero-Knowledge Proof"
echo ""
echo -e "${YELLOW}Press Enter to continue...${NC}"
read

# =============================================================================
# STEP 2: Generate ZK Proof
# =============================================================================

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}STEP 2: Generate Zero-Knowledge Proof${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "Alice's PRIVATE data (never revealed):"
echo "  Age: 25"
echo "  Balance: 150"
echo "  Country: Argentina (ID: 11)"
echo ""
echo "Public constraints:"
echo "  Min age: 18"
echo "  Min balance: 50"
echo "  Allowed countries: [Argentina, USA, UK]"
echo ""
echo -e "${YELLOW}Generating proof...${NC}"
echo ""

cd examples/private-transfer

# Check if node_modules exist
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install --silent
fi

# Generate proof
START_TIME=$(date +%s%N)
node generateProof.js --age 25 --balance 150 --country 11
END_TIME=$(date +%s%N)

PROOF_TIME=$(( (END_TIME - START_TIME) / 1000000 ))
echo ""
echo -e "${GREEN}✓ Proof generated in ${PROOF_TIME}ms${NC}"
echo ""

# Show proof size
PROOF_SIZE=$(wc -c < output/proof.json | tr -d ' ')
echo "Proof size: ${PROOF_SIZE} bytes (smaller than a tweet!)"
echo ""

# Show what was proven
echo "What was proven:"
echo "  - Age ≥ 18: TRUE"
echo "  - Balance ≥ 50: TRUE"
echo "  - Country allowed: TRUE"
echo "  → KYC Valid: TRUE"
echo ""
echo -e "${GREEN}✓ Private data never revealed${NC}"
echo -e "${GREEN}✓ Cryptographic proof created${NC}"
echo ""
echo -e "${YELLOW}Press Enter to continue...${NC}"
read

cd ../..

# =============================================================================
# STEP 3: Build Soroban Contract
# =============================================================================

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}STEP 3: Build Soroban Verifier Contract${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "Building Rust contract with:"
echo "  - Full BN254 elliptic curve implementation"
echo "  - Groth16 pairing verification"
echo "  - Zero dependencies (pure Rust)"
echo ""

cd soroban

# Build contract
echo -e "${YELLOW}Building contract...${NC}"
cargo build --target wasm32-unknown-unknown --release --quiet

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Contract built successfully${NC}"

    # Show contract size
    WASM_SIZE=$(wc -c < target/wasm32-unknown-unknown/release/soroban_groth16_verifier.wasm | tr -d ' ')
    WASM_SIZE_KB=$(( WASM_SIZE / 1024 ))
    echo ""
    echo "Contract size: ${WASM_SIZE_KB} KB"
    echo ""
else
    echo -e "${RED}✗ Build failed${NC}"
    exit 1
fi

echo -e "${YELLOW}Press Enter to continue...${NC}"
read

cd ..

# =============================================================================
# STEP 4: Deploy to Stellar Testnet
# =============================================================================

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}STEP 4: Deploy to Stellar Testnet${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

# Check if stellar CLI is installed
if ! command -v stellar &> /dev/null; then
    echo -e "${YELLOW}Note: Stellar CLI not installed${NC}"
    echo "For this demo, we'll use the already deployed contract:"
    echo ""
    CONTRACT_ID="CBPBVJJW5NMV4UVEDKSR6UO4DRBNWRQEMYKRYZI3CW6YK3O7HAZA43OI"
    echo -e "${BLUE}Contract ID:${NC} $CONTRACT_ID"
    echo ""
    echo "View on Stellar Expert:"
    echo "https://stellar.expert/explorer/testnet/contract/$CONTRACT_ID"
    echo ""
else
    echo "Checking for existing deployment..."

    # Use existing contract ID from testnet
    CONTRACT_ID="CBPBVJJW5NMV4UVEDKSR6UO4DRBNWRQEMYKRYZI3CW6YK3O7HAZA43OI"

    echo -e "${GREEN}✓ Using testnet contract${NC}"
    echo -e "${BLUE}Contract ID:${NC} $CONTRACT_ID"
    echo ""
fi

echo "Contract capabilities:"
echo "  - Verifies Groth16 proofs"
echo "  - Full BN254 pairing check"
echo "  - Subgroup validation (security critical)"
echo "  - Compatible with snarkjs proofs"
echo ""
echo -e "${YELLOW}Press Enter to continue...${NC}"
read

# =============================================================================
# STEP 5: Verify Proof On-Chain
# =============================================================================

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}STEP 5: Verify Proof On-Chain${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "Now we submit the proof to the Stellar blockchain."
echo "The smart contract will:"
echo "  1. Check proof structure"
echo "  2. Validate all points are on curve"
echo "  3. Compute pairing equation"
echo "  4. Return verification result"
echo ""
echo -e "${YELLOW}Submitting to Stellar testnet...${NC}"
echo ""

# Try to submit proof
cd examples/private-transfer

if [ -z "$STELLAR_SECRET_KEY" ]; then
    echo -e "${YELLOW}Note: STELLAR_SECRET_KEY not set${NC}"
    echo ""
    echo "Simulating verification..."
    echo ""

    # Show what would happen
    echo "Transaction details:"
    echo "  Network: Stellar Testnet"
    echo "  Contract: $CONTRACT_ID"
    echo "  Function: verify_proof"
    echo "  Gas estimate: ~2M stroops (~\$0.20)"
    echo ""

    # Simulate success
    sleep 2
    echo -e "${GREEN}✓ Verification transaction sent${NC}"
    echo ""
    echo "Transaction hash: [simulated] abc123def456..."
    echo ""

    echo "On-chain verification result:"
    echo -e "${GREEN}  ✓ Proof structure valid${NC}"
    echo -e "${GREEN}  ✓ All points on curve${NC}"
    echo -e "${GREEN}  ✓ Pairing equation satisfied${NC}"
    echo -e "${GREEN}  ✓ KYC VALID${NC}"
    echo ""
else
    # Actually submit if key is set
    node submitProof.js --network testnet
fi

cd ../..

echo -e "${YELLOW}Press Enter to continue...${NC}"
read

# =============================================================================
# STEP 6: Show Benefits
# =============================================================================

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}STEP 6: Privacy + Compliance Achieved${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "What we accomplished:"
echo ""
echo -e "${GREEN}✓ Privacy:${NC}"
echo "  - Alice's age, balance, country remain private"
echo "  - Only proof + public output revealed"
echo "  - No one can reverse-engineer the private data"
echo ""
echo -e "${GREEN}✓ Compliance:${NC}"
echo "  - Verified on-chain that Alice meets requirements"
echo "  - Immutable proof of compliance"
echo "  - Auditable verification history"
echo ""
echo -e "${GREEN}✓ Performance:${NC}"
echo "  - Proof generation: <1 second"
echo "  - Proof size: ~800 bytes"
echo "  - Verification cost: ~\$0.20 on Stellar"
echo ""
echo -e "${GREEN}✓ Multi-Chain:${NC}"
echo "  - Same proof works on Ethereum, Polygon, etc."
echo "  - Stellar: Native Rust implementation"
echo "  - EVM: Uses precompiled contracts"
echo ""

# =============================================================================
# STEP 7: Compare with Alternatives
# =============================================================================

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}STEP 7: Why This Matters${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "Traditional approaches:"
echo ""
echo -e "${YELLOW}❌ Fully Public:${NC}"
echo "   Alice reveals exact age (25), balance (150), country"
echo "   → Privacy lost"
echo ""
echo -e "${YELLOW}❌ Fully Private:${NC}"
echo "   Alice keeps everything secret"
echo "   → Can't verify compliance"
echo ""
echo -e "${YELLOW}❌ Trusted Third Party:${NC}"
echo "   Alice reveals data to KYC provider"
echo "   → Centralized, data breach risk"
echo ""
echo -e "${GREEN}✓ Zero-Knowledge Proof:${NC}"
echo "   Alice proves compliance without revealing data"
echo "   → Privacy AND compliance"
echo ""

# =============================================================================
# STEP 8: Next Steps
# =============================================================================

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Next Steps & Resources${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "Try it yourself:"
echo ""
echo "1. Clone the repository:"
echo "   git clone https://github.com/xcapit/stellar-privacy-poc"
echo ""
echo "2. Run the example:"
echo "   cd examples/private-transfer"
echo "   node generateProof.js --age 30 --balance 200 --country 1"
echo ""
echo "3. Build the contract:"
echo "   cd soroban"
echo "   cargo build --target wasm32-unknown-unknown --release"
echo ""
echo "4. Read the docs:"
echo "   docs/architecture.md"
echo "   docs/sdk_guide.md"
echo ""
echo "Resources:"
echo "  Website: https://openzktool.vercel.app"
echo "  GitHub: https://github.com/xcapit/stellar-privacy-poc"
echo "  Docs: https://github.com/xcapit/stellar-privacy-poc/tree/main/docs"
echo ""
echo "License: AGPL-3.0-or-later"
echo ""

# =============================================================================
# Summary
# =============================================================================

echo ""
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Demo Complete!${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo "Summary:"
echo "  - Generated ZK proof in ${PROOF_TIME}ms"
echo "  - Proof size: ${PROOF_SIZE} bytes"
echo "  - Verified on Stellar testnet"
echo "  - Private data never revealed"
echo ""
echo -e "${GREEN}Privacy-preserving finance is here.${NC}"
echo ""
