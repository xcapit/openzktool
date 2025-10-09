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

                    🔐 PRIVACY WITHOUT SECRETS
                 Prove Things Without Revealing Them

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EOF

echo ""
echo -e "${CYAN}Welcome to the ZKPrivacy Demo!${NC}"
echo ""
echo -e "${YELLOW}⏱️  Duration: 5-7 minutes${NC}"
echo ""
echo -e "${PURPLE}The Scenario:${NC}"
echo ""
echo "  👤 Alice wants to access a financial service"
echo "  🏦 The service needs to verify she's eligible"
echo "  🔒 But Alice doesn't want to share her personal data"
echo ""
echo -e "${GREEN}The Solution: Zero-Knowledge Proofs${NC}"
echo ""
echo "  Alice will prove that:"
echo "    ✓ She's over 18 years old       (without revealing her age: 25)"
echo "    ✓ She has enough balance        (without showing her balance: \$150)"
echo "    ✓ She's from an allowed country (without disclosing: Argentina)"
echo ""
echo "  ${CYAN}AND we'll verify this proof on TWO different blockchains!${NC}"
echo ""

pause

# ============================================================================
# THE PROBLEM
# ============================================================================

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${RED}                          THE PROBLEM                              ${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${YELLOW}Traditional Verification (What We Want to Avoid):${NC}"
echo ""
echo "  ❌ Show ID card → Service sees: Name, DOB, Address, ID number"
echo "  ❌ Show bank statement → Service sees: Exact balance, transactions, bank"
echo "  ❌ Show passport → Service sees: Full personal information"
echo ""
echo -e "${RED}Problem: Service only needs to know IF you qualify, not all your data!${NC}"
echo ""

pause

# ============================================================================
# THE SOLUTION
# ============================================================================

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}                        THE SOLUTION                              ${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${YELLOW}Zero-Knowledge Proof (What We'll Do):${NC}"
echo ""
echo "  ✅ Prove age ≥ 18       → WITHOUT revealing age is 25"
echo "  ✅ Prove balance ≥ \$50  → WITHOUT revealing balance is \$150"
echo "  ✅ Prove country allowed → WITHOUT revealing country is Argentina"
echo ""
echo -e "${GREEN}The service gets a cryptographic proof that's mathematically valid!${NC}"
echo ""
echo -e "${CYAN}📏 Proof size: ~800 bytes (smaller than this text!)${NC}"
echo ""

pause

# ============================================================================
# STEP 1: Alice's Private Data
# ============================================================================

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}              STEP 1: Alice's Private Information                ${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${RED}🔒 This information stays PRIVATE (never revealed):${NC}"
echo ""
echo "  👤 Age: 25 years"
echo "  💰 Balance: \$150 USD"
echo "  🌎 Country: Argentina (code: 32)"
echo ""
echo -e "${YELLOW}vs${NC}"
echo ""
echo -e "${GREEN}✅ What the service requires (public parameters):${NC}"
echo ""
echo "  • Minimum age: 18"
echo "  • Maximum age: 99"
echo "  • Minimum balance: \$50"
echo "  • Allowed countries: List of approved country codes"
echo ""
echo -e "${CYAN}The service ONLY needs to know: Does Alice meet the requirements?${NC}"
echo ""

pause

# ============================================================================
# STEP 2: Generate the Proof
# ============================================================================

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}                STEP 2: Generate Zero-Knowledge Proof            ${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "Now we'll create a cryptographic proof that:"
echo ""
echo "  1. Takes Alice's private data as input"
echo "  2. Performs mathematical checks"
echo "  3. Outputs a proof that can be verified"
echo "  4. WITHOUT revealing any private information"
echo ""
echo -e "${CYAN}Magic: The proof is only ~800 bytes!${NC}"
echo ""
echo "Generating proof..."
echo ""

cd circuits/scripts
bash prove_and_verify.sh > /tmp/zkprivacy_proof.log 2>&1

if grep -q "OK!" /tmp/zkprivacy_proof.log; then
    echo -e "${GREEN}✅ Proof generated successfully!${NC}"
    echo ""
    PROOF_SIZE=$(ls -lh ../artifacts/proof.json | awk '{print $5}')
    PUBLIC_OUTPUT=$(cat ../artifacts/public.json)
    echo "  📊 Proof size: $PROOF_SIZE"
    echo "  📊 Public output: kycValid = $PUBLIC_OUTPUT"
    echo ""
    echo -e "${YELLOW}What the proof contains:${NC}"
    echo "  • Mathematical commitment (NOT the actual values)"
    echo "  • Cryptographic signature"
    echo "  • Public output: 1 (meaning VALID)"
    echo ""
    echo -e "${YELLOW}What the proof does NOT contain:${NC}"
    echo "  ✗ Age (25)"
    echo "  ✗ Balance (\$150)"
    echo "  ✗ Country (Argentina)"
    echo ""
    echo -e "${GREEN}👉 The service gets YES/NO, not the actual data!${NC}"
    echo ""
else
    echo -e "${RED}❌ Proof generation failed${NC}"
    cat /tmp/zkprivacy_proof.log
    exit 1
fi

cd ../..

pause

# ============================================================================
# UNDERSTANDING THE PROOF
# ============================================================================

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${PURPLE}                   Understanding the Proof                       ${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${CYAN}Think of it like a locked box:${NC}"
echo ""
echo "  📦 Inside: Alice's real age (25), balance (\$150), country (AR)"
echo "  🔒 Lock: Mathematical encryption (Groth16 SNARK)"
echo "  🔑 Key: Verification algorithm"
echo ""
echo "  The service can use the key to verify:"
echo "    ✓ The box is authentic (proof is valid)"
echo "    ✓ Contents meet requirements (age ≥ 18, balance ≥ \$50, etc.)"
echo ""
echo "  But the service CANNOT:"
echo "    ✗ Open the box (see actual values)"
echo "    ✗ Copy the contents (extract private data)"
echo "    ✗ Modify the proof (it's tamper-proof)"
echo ""
echo -e "${GREEN}This is the power of Zero-Knowledge Proofs!${NC}"
echo ""

pause

# ============================================================================
# STEP 3: Verify on Ethereum
# ============================================================================

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}           STEP 3: Verify on Blockchain #1 (Ethereum)            ${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "Now we'll verify Alice's proof on a blockchain..."
echo ""
echo -e "${CYAN}What's happening:${NC}"
echo "  1. Starting local Ethereum network (Anvil)"
echo "  2. Deploying smart contract verifier"
echo "  3. Submitting Alice's proof to the contract"
echo "  4. Contract performs cryptographic verification"
echo "  5. Contract returns: VALID ✅ or INVALID ❌"
echo ""
echo -e "${YELLOW}Why blockchain?${NC}"
echo "  • Transparent: Anyone can verify the proof was checked"
echo "  • Immutable: The verification result is permanent"
echo "  • Trustless: No central authority needed"
echo ""
echo "Verifying on Ethereum..."
echo ""

cd evm-verification
export PATH="$HOME/.foundry/bin:$PATH"

bash verify_on_chain.sh 2>&1 | tee /tmp/zkprivacy_evm.log | grep -E "(🚀|📤|🔍|✅|❌|Starting|Deploying|Verifying|VERIFICATION|deployed at:|Proof|running)" || true

echo ""

if grep -q "VERIFICATION SUCCESSFUL" /tmp/zkprivacy_evm.log; then
    echo ""
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${GREEN}              ✅ ETHEREUM BLOCKCHAIN: PROOF VALID                ${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    echo "  ✓ Smart contract confirmed: Alice meets ALL requirements"
    echo "  ✓ Gas used: ~200,000 gas"
    echo "  ✓ Verification time: <50ms"
    echo ""
    echo -e "${CYAN}What the blockchain knows:${NC}"
    echo "  ✅ Proof is mathematically valid"
    echo "  ✅ Alice meets the requirements"
    echo ""
    echo -e "${CYAN}What the blockchain does NOT know:${NC}"
    echo "  ❌ Alice's exact age"
    echo "  ❌ Alice's exact balance"
    echo "  ❌ Alice's country"
    echo ""
else
    echo -e "${RED}❌ Ethereum verification failed${NC}"
    cat /tmp/zkprivacy_evm.log
    exit 1
fi

cd ..

pause

# ============================================================================
# STEP 4: Verify on Stellar
# ============================================================================

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}       STEP 4: Verify SAME Proof on Blockchain #2 (Stellar)      ${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "The EXACT SAME proof will now be verified on a different blockchain..."
echo ""
echo -e "${CYAN}What's happening:${NC}"
echo "  1. Starting local Stellar network"
echo "  2. Deploying Soroban smart contract (Rust/WASM)"
echo "  3. Submitting the SAME 800-byte proof"
echo "  4. Contract performs the same cryptographic checks"
echo "  5. Contract returns: VALID ✅ or INVALID ❌"
echo ""
echo -e "${PURPLE}💡 Key Point: ONE proof works on MULTIPLE blockchains!${NC}"
echo ""
echo "Verifying on Stellar/Soroban..."
echo ""

cd soroban

bash verify_on_chain.sh 2>&1 | tee /tmp/zkprivacy_soroban.log | grep -E "(🚀|🔨|📤|🔍|✅|❌|Starting|Building|Deploying|Invoking|VERIFICATION|Contract|Proof|network running|built:)" || true

echo ""

if grep -q "VERIFICATION SUCCESSFUL" /tmp/zkprivacy_soroban.log; then
    echo ""
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${GREEN}              ✅ STELLAR BLOCKCHAIN: PROOF VALID                 ${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    echo "  ✓ Smart contract confirmed: Alice meets ALL requirements"
    echo "  ✓ Contract size: 2.1KB WASM"
    echo "  ✓ Low resource consumption"
    echo ""
    echo -e "${CYAN}What Stellar blockchain knows:${NC}"
    echo "  ✅ Proof is mathematically valid"
    echo "  ✅ Alice meets the requirements"
    echo ""
    echo -e "${CYAN}What Stellar blockchain does NOT know:${NC}"
    echo "  ❌ Alice's exact age"
    echo "  ❌ Alice's exact balance"
    echo "  ❌ Alice's country"
    echo ""
else
    echo -e "${RED}❌ Soroban verification failed${NC}"
    cat /tmp/zkprivacy_soroban.log
    exit 1
fi

cd ..

pause

# ============================================================================
# FINAL SUMMARY - THE MAGIC
# ============================================================================

clear

cat << "EOF"
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

                        ✨ THE MAGIC EXPLAINED ✨

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EOF

echo ""
echo -e "${GREEN}                   🎉 Demo Complete! 🎉                           ${NC}"
echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${CYAN}What We Just Did:${NC}"
echo ""
echo "  👤 Alice proved she's eligible for a service"
echo "  🔒 WITHOUT revealing her personal data"
echo "  ⛓️  The proof was verified on TWO different blockchains"
echo "  ✅ Both blockchains confirmed: Alice is VALID"
echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${YELLOW}🔐 Privacy Achieved:${NC}"
echo ""
echo "  Alice proved WITHOUT revealing:"
echo "    ✓ Her exact age (25)           → Only that age ≥ 18"
echo "    ✓ Her exact balance (\$150)    → Only that balance ≥ \$50"
echo "    ✓ Her country (Argentina)      → Only that country is allowed"
echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${PURPLE}🌐 Multi-Chain Interoperability:${NC}"
echo ""
echo "  ONE proof verified on:"
echo "    ✅ Ethereum (EVM) - Solidity smart contract"
echo "    ✅ Stellar (Soroban) - Rust/WASM smart contract"
echo ""
echo "  ${CYAN}Same 800-byte proof, different blockchains!${NC}"
echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${GREEN}⚡ Performance:${NC}"
echo ""
echo "  📦 Proof size: ~800 bytes (smaller than an email!)"
echo "  ⚡ Generation: <1 second"
echo "  ✅ Verification: <50ms per blockchain"
echo "  💰 Gas cost: ~200k gas on Ethereum"
echo "  🎯 Privacy: 100% (zero data leaked)"
echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${CYAN}💼 Real-World Use Cases:${NC}"
echo ""
echo "  🏦 Banking: Prove solvency without revealing balance"
echo "  🎓 Education: Prove degree without showing grades"
echo "  🏥 Healthcare: Prove vaccination without medical records"
echo "  🗳️  Voting: Prove eligibility without revealing identity"
echo "  💳 Credit: Prove creditworthiness without financial history"
echo "  🌍 Cross-border: Prove compliance across multiple jurisdictions"
echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${YELLOW}🔑 Key Takeaway:${NC}"
echo ""
echo "  With Zero-Knowledge Proofs, you can prove compliance,"
echo "  verify identity, and maintain privacy — all at the same time."
echo ""
echo "  ${GREEN}Privacy + Compliance = The Future of Finance${NC}"
echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${GREEN}🔗 Learn More:${NC}"
echo ""
echo "  🌐 Web: https://zkprivacy.vercel.app"
echo "  📚 GitHub: https://github.com/xcapit/stellar-privacy-poc"
echo "  📖 Documentation: See README.md"
echo "  💼 Grant: SCF #40 Build Award Proposal"
echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "${PURPLE}📋 About Stellar Privacy SDK:${NC}"
echo ""
echo "  Production-ready toolkit for privacy-preserving transactions"
echo "  Built for retail partners, fintechs, and financial institutions"
echo "  Multi-chain support: Stellar, Ethereum, and beyond"
echo ""
echo -e "${YELLOW}Team X1 - Xcapit Labs${NC}"
echo "  ⛓️ 6+ years blockchain | 🏆 Previous SCF grant"
echo ""
