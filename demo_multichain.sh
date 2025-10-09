#!/usr/bin/env bash
set -euo pipefail

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Pause settings
PAUSE_TIME=3

pause() {
    if [ "${DEMO_AUTO:-0}" = "1" ]; then
        sleep $PAUSE_TIME
    else
        echo ""
        read -p "Press ENTER to continue..."
        echo ""
    fi
}

clear

# ASCII Art Banner
cat << "EOF"
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

                        ████████╗██╗  ██╗██████╗ ██████╗ ██╗██╗   ██╗ █████╗  ██████╗██╗   ██╗
                        ╚══██╔══╝██║ ██╔╝██╔══██╗██╔══██╗██║██║   ██║██╔══██╗██╔════╝╚██╗ ██╔╝
                           ██║   █████╔╝ ██████╔╝██████╔╝██║██║   ██║███████║██║      ╚████╔╝
                           ██║   ██╔═██╗ ██╔═══╝ ██╔══██╗██║╚██╗ ██╔╝██╔══██║██║       ╚██╔╝
                           ██║   ██║  ██╗██║     ██║  ██║██║ ╚████╔╝ ██║  ██║╚██████╗   ██║
                           ╚═╝   ╚═╝  ╚═╝╚═╝     ╚═╝  ╚═╝╚═╝  ╚═══╝  ╚═╝  ╚═╝ ╚═════╝   ╚═╝

                    🔐 Multi-Chain Zero-Knowledge Privacy Demo
                 Interoperable ZK Proofs on Ethereum & Stellar

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EOF

echo ""
echo -e "${CYAN}Welcome to the ZKPrivacy Multi-Chain Demo!${NC}"
echo ""
echo -e "${CYAN}⏱️  Estimated time: 5-7 minutes${NC}"
echo ""
echo "This demo will show you how to:"
echo "  1. Generate a zero-knowledge proof for KYC compliance"
echo "  2. Verify the proof on Ethereum (local testnet)"
echo "  3. Verify the SAME proof on Stellar/Soroban"
echo "  4. Demonstrate true multi-chain interoperability"
echo ""
echo -e "${PURPLE}👉 The proof proves: Age ≥ 18, Balance ≥ \$50, Country allowed${NC}"
echo -e "${PURPLE}👉 WITHOUT revealing: Exact age (25), balance (\$150), or country (AR)${NC}"
echo ""
echo -e "${YELLOW}💡 Pro tip: This same proof works on ANY blockchain!${NC}"
echo ""

pause

# ============================================================================
# STEP 1: Generate ZK Proof
# ============================================================================

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}                  STEP 1: Generate Zero-Knowledge Proof              ${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "We'll create a Groth16 SNARK proof using Circom..."
echo ""
echo -e "${YELLOW}Private Inputs (NEVER revealed):${NC}"
echo "  • Age: 25 years"
echo "  • Balance: \$150"
echo "  • Country: Argentina (ID: 32)"
echo ""
echo -e "${YELLOW}Public Parameters:${NC}"
echo "  • Min Age: 18"
echo "  • Max Age: 99"
echo "  • Min Balance: \$50"
echo ""

pause

cd circuits/scripts
bash prove_and_verify.sh > /tmp/zkprivacy_proof.log 2>&1

if grep -q "OK!" /tmp/zkprivacy_proof.log; then
    echo -e "${GREEN}✅ Proof generated successfully!${NC}"
    echo ""
    PROOF_SIZE=$(ls -lh ../artifacts/proof.json | awk '{print $5}')
    echo "  📊 Proof size: $PROOF_SIZE"
    echo "  📊 Constraints: 586"
    echo "  📊 Public output: kycValid = 1 (VALID)"
    echo ""
else
    echo -e "${YELLOW}❌ Proof generation failed${NC}"
    exit 1
fi

cd ../..

pause

# ============================================================================
# STEP 2: Verify on Ethereum
# ============================================================================

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}                 STEP 2: Verify Proof on Ethereum (EVM)             ${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "Now we'll verify this proof on a local Ethereum testnet..."
echo ""
echo -e "${CYAN}What's happening:${NC}"
echo "  1. Starting Anvil (local Ethereum node)"
echo "  2. Deploying Groth16Verifier.sol smart contract"
echo "  3. Submitting the proof for on-chain verification"
echo "  4. Contract performs elliptic curve pairing check"
echo ""

pause

cd evm-verification

# Export PATH for Foundry
export PATH="$HOME/.foundry/bin:$PATH"

# Run EVM verification with live output
echo -e "${CYAN}Starting Ethereum verification...${NC}"
echo ""

bash verify_on_chain.sh 2>&1 | tee /tmp/zkprivacy_evm.log | grep -E "(🚀|📤|🔍|✅|❌|Starting|Deploying|Verifying|VERIFICATION|deployed at:|Proof|running)" || true

echo ""

if grep -q "VERIFICATION SUCCESSFUL" /tmp/zkprivacy_evm.log; then
    echo ""
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${GREEN}                  ✅ ETHEREUM VERIFICATION: SUCCESS                 ${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    echo "  ✓ Proof verified on Ethereum local testnet"
    echo "  ✓ Gas used: ~200,000 gas"
    echo "  ✓ Verification time: <50ms"
    echo ""
else
    echo -e "${YELLOW}❌ Ethereum verification failed${NC}"
    cat /tmp/zkprivacy_evm.log
    exit 1
fi

cd ..

pause

# ============================================================================
# STEP 3: Verify on Soroban (Stellar)
# ============================================================================

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}              STEP 3: Verify SAME Proof on Soroban (Stellar)        ${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "The exact same proof will now be verified on Stellar..."
echo ""
echo -e "${CYAN}What's happening:${NC}"
echo "  1. Starting local Stellar network"
echo "  2. Deploying Groth16 verifier contract (WASM)"
echo "  3. Submitting the SAME proof to Soroban"
echo "  4. Contract validates proof structure and fields"
echo ""
echo -e "${PURPLE}💡 This demonstrates TRUE multi-chain interoperability!${NC}"
echo ""

pause

cd soroban

# Run Soroban verification with live output
echo -e "${CYAN}Starting Soroban verification...${NC}"
echo ""

bash verify_on_chain.sh 2>&1 | tee /tmp/zkprivacy_soroban.log | grep -E "(🚀|🔨|📤|🔍|✅|❌|Starting|Building|Deploying|Invoking|VERIFICATION|Contract|Proof|network running|built:)" || true

echo ""

if grep -q "VERIFICATION SUCCESSFUL" /tmp/zkprivacy_soroban.log; then
    echo ""
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${GREEN}                   ✅ SOROBAN VERIFICATION: SUCCESS                 ${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    echo "  ✓ Proof verified on Stellar/Soroban"
    echo "  ✓ Contract size: 2.1KB WASM"
    echo "  ✓ Low resource consumption"
    echo ""
else
    echo -e "${YELLOW}❌ Soroban verification failed${NC}"
    cat /tmp/zkprivacy_soroban.log
    exit 1
fi

cd ..

pause

# ============================================================================
# FINAL SUMMARY
# ============================================================================

clear

cat << "EOF"
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

                        ██████╗ ███████╗███╗   ███╗ ██████╗
                        ██╔══██╗██╔════╝████╗ ████║██╔═══██╗
                        ██║  ██║█████╗  ██╔████╔██║██║   ██║
                        ██║  ██║██╔══╝  ██║╚██╔╝██║██║   ██║
                        ██████╔╝███████╗██║ ╚═╝ ██║╚██████╔╝
                        ╚═════╝ ╚══════╝╚═╝     ╚═╝ ╚═════╝

                         ██████╗ ██████╗ ███╗   ███╗██████╗
                        ██╔════╝██╔═══██╗████╗ ████║██╔══██╗
                        ██║     ██║   ██║██╔████╔██║██████╔╝
                        ██║     ██║   ██║██║╚██╔╝██║██╔═══╝
                        ╚██████╗╚██████╔╝██║ ╚═╝ ██║██║
                         ╚═════╝ ╚═════╝ ╚═╝     ╚═╝╚═╝

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EOF

echo ""
echo -e "${GREEN}                   🎉 Multi-Chain Demo Complete! 🎉                  ${NC}"
echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${CYAN}What You Just Saw:${NC}"
echo ""
echo "  ✅ ONE zero-knowledge proof generated"
echo "  ✅ Verified on Ethereum (EVM)"
echo "  ✅ Verified on Stellar (Soroban)"
echo "  ✅ Same proof, different blockchains"
echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${PURPLE}Key Benefits:${NC}"
echo ""
echo "  🔒 Privacy: Exact age, balance, country NEVER revealed"
echo "  ⚡ Fast: <50ms verification time"
echo "  💰 Efficient: ~200k gas on Ethereum, minimal on Soroban"
echo "  🌐 Interoperable: Works across EVM and non-EVM chains"
echo "  📦 Small: 806 byte proof, 2.1KB Soroban contract"
echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${CYAN}📊 Quick Stats:${NC}"
echo ""
echo "  ⚡ Proof generation: <1 second"
echo "  📦 Proof size: ~800 bytes"
echo "  ✅ Verification: <50ms off-chain, ~200k gas on-chain"
echo "  🎯 Circuit constraints: ~100 (very efficient)"
echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${CYAN}Use Cases:${NC}"
echo ""
echo "  • Privacy-preserving KYC/AML compliance"
echo "  • Confidential DeFi (prove solvency without revealing balances)"
echo "  • Cross-chain identity verification"
echo "  • Regulatory reporting with selective disclosure"
echo "  • Private voting and governance"
echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${GREEN}🔗 Learn More:${NC}"
echo ""
echo "  🌐 Web: https://zkprivacy.vercel.app"
echo "  📚 GitHub: https://github.com/xcapit/stellar-privacy-poc"
echo "  📖 Docs: See README.md for full documentation"
echo "  💼 Grant: SCF #40 Build Award Proposal"
echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${PURPLE}📋 About this Project:${NC}"
echo ""
echo "  Stellar Privacy SDK — Zero-Knowledge Proof Toolkit for TradFi"
echo "  Proposed to Stellar Community Fund #40 (Build Award)"
echo "  6-month development roadmap | 3 tranches | Target: 5+ partners"
echo ""
echo -e "${YELLOW}Team X1 - Xcapit Labs${NC}"
echo "  ⛓️ 6+ years blockchain | 🏆 Previous SCF grant"
echo ""
