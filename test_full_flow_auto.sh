#!/usr/bin/env bash
set -euo pipefail

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo ""
echo -e "${CYAN}🧪 FULL FLOW TEST — OpenZKTool Multi-Chain (AUTO MODE)${NC}"
echo ""
echo "Testing: Setup → Proof → EVM → Soroban"
echo ""

# ============================================================================
# STEP 1: Setup
# ============================================================================

echo -e "${BLUE}[1/4] Setup...${NC}"

if [ -f "circuits/artifacts/kyc_transfer_final.zkey" ]; then
  echo "  ✅ Setup already complete"
else
  cd circuits/scripts
  bash prepare_and_setup.sh > /tmp/openzktool_setup.log 2>&1
  cd ../..
  if [ $? -eq 0 ]; then
    echo "  ✅ Setup complete"
  else
    echo "  ❌ Setup failed"
    cat /tmp/openzktool_setup.log
    exit 1
  fi
fi

# ============================================================================
# STEP 2: Proof Generation
# ============================================================================

echo -e "${BLUE}[2/4] Generating proof...${NC}"

cd circuits/scripts
bash prove_and_verify.sh > /tmp/openzktool_proof.log 2>&1

if grep -q "OK!" /tmp/openzktool_proof.log; then
    echo "  ✅ Proof generated and verified locally"
else
    echo "  ❌ Proof generation failed"
    cat /tmp/openzktool_proof.log
    exit 1
fi

cd ../..

# ============================================================================
# STEP 3: EVM Verification
# ============================================================================

echo -e "${BLUE}[3/4] Verifying on Ethereum...${NC}"

cd evm-verification
export PATH="$HOME/.foundry/bin:$PATH"

bash verify_on_chain.sh > /tmp/openzktool_evm.log 2>&1

if grep -q "VERIFICATION SUCCESSFUL" /tmp/openzktool_evm.log; then
    echo "  ✅ Ethereum verification: SUCCESS"
else
    echo "  ❌ Ethereum verification failed"
    cat /tmp/openzktool_evm.log
    exit 1
fi

cd ..

# ============================================================================
# STEP 4: Soroban Verification
# ============================================================================

echo -e "${BLUE}[4/4] Verifying on Soroban...${NC}"

cd soroban

bash verify_on_chain.sh > /tmp/openzktool_soroban.log 2>&1

if grep -q "VERIFICATION SUCCESSFUL" /tmp/openzktool_soroban.log; then
    echo "  ✅ Soroban verification: SUCCESS"
else
    echo "  ❌ Soroban verification failed"
    cat /tmp/openzktool_soroban.log
    exit 1
fi

cd ..

# ============================================================================
# SUMMARY
# ============================================================================

echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✅ FULL FLOW TEST: PASSED${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "All tests completed successfully:"
echo "  ✅ Circuit compilation & setup"
echo "  ✅ Proof generation & local verification"
echo "  ✅ EVM verification (Ethereum/Anvil)"
echo "  ✅ Soroban verification (Stellar)"
echo ""
echo -e "${PURPLE}🌐 Multi-chain interoperability confirmed!${NC}"
echo ""
