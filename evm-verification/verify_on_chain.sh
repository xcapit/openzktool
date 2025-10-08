#!/usr/bin/env bash
set -euo pipefail

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}          🔐 ZKPrivacy - On-Chain Verification Demo (EVM)         ${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Change to script directory
cd "$(dirname "$0")"

# Check if Foundry is installed
if ! command -v forge &> /dev/null; then
    echo -e "${YELLOW}⚠️  Foundry not found!${NC}"
    echo ""
    echo "Please install Foundry first:"
    echo "  curl -L https://foundry.paradigm.xyz | bash"
    echo "  foundryup"
    echo ""
    exit 1
fi

# Check if proof.json exists
PROOF_FILE="../circuits/artifacts/proof.json"
PUBLIC_FILE="../circuits/artifacts/public.json"

if [ ! -f "$PROOF_FILE" ] || [ ! -f "$PUBLIC_FILE" ]; then
    echo -e "${YELLOW}⚠️  Proof files not found!${NC}"
    echo ""
    echo "Please generate a proof first:"
    echo "  cd circuits/scripts"
    echo "  bash prove_and_verify.sh"
    echo ""
    exit 1
fi

echo -e "${GREEN}✅ Proof files found${NC}"
echo "  📄 Proof: $PROOF_FILE"
echo "  📄 Public: $PUBLIC_FILE"
echo ""

# Generate test with actual proof data
echo -e "${GREEN}📝 Generating test with actual proof data...${NC}"
node generate_test.js
echo ""

# Install forge-std if not present
if [ ! -d "lib/forge-std" ]; then
    echo -e "${YELLOW}📦 Installing forge-std library...${NC}"
    forge install foundry-rs/forge-std --no-git
    echo ""
fi

# Start local Anvil node in background
echo -e "${GREEN}🚀 Starting local Ethereum node (Anvil)...${NC}"
anvil > /dev/null 2>&1 &
ANVIL_PID=$!
sleep 2
echo -e "${GREEN}✅ Anvil running (PID: $ANVIL_PID)${NC}"
echo ""

# Cleanup function
cleanup() {
    echo ""
    echo -e "${YELLOW}🛑 Stopping Anvil...${NC}"
    kill $ANVIL_PID 2>/dev/null || true
}
trap cleanup EXIT

# Deploy verifier contract
echo -e "${GREEN}📤 Deploying Groth16 Verifier contract...${NC}"
DEPLOY_OUTPUT=$(forge script script/DeployAndVerify.s.sol:DeployAndVerify --rpc-url http://localhost:8545 --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 --broadcast 2>&1)

# Extract contract address
CONTRACT_ADDR=$(echo "$DEPLOY_OUTPUT" | grep "Groth16Verifier deployed at:" | awk '{print $4}')

if [ -z "$CONTRACT_ADDR" ]; then
    echo -e "${YELLOW}❌ Failed to deploy contract${NC}"
    echo "$DEPLOY_OUTPUT"
    exit 1
fi

echo -e "${GREEN}✅ Contract deployed at: ${CONTRACT_ADDR}${NC}"
echo ""

# Run verification test
echo -e "${GREEN}🔍 Verifying proof on-chain...${NC}"
echo ""

TEST_OUTPUT=$(forge test --match-contract VerifierTest -vv 2>&1 || true)

if echo "$TEST_OUTPUT" | grep -q "Suite result: ok"; then
    echo ""
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${GREEN}                    ✅ VERIFICATION SUCCESSFUL!                     ${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    echo -e "${GREEN}🎯 Proof verified on Ethereum (local testnet)${NC}"
    echo "  ✓ KYC Transfer proof is valid"
    echo "  ✓ Smart contract verification passed"
    echo "  ✓ Zero-knowledge property preserved"
    echo ""
else
    echo -e "${YELLOW}❌ Verification failed${NC}"
    echo "$TEST_OUTPUT"
    exit 1
fi

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}                         Demo Complete!                            ${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
