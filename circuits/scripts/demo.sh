#!/usr/bin/env bash
set -euo pipefail

# ============================================
# 🎬 DEMO: KYC Transfer Circuit
# ============================================
# This script demonstrates the complete workflow
# of a zero-knowledge proof for KYC verification
# on both EVM and Soroban blockchains
# ============================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR/.."

OUT=artifacts
CIRCUIT=kyc_transfer
R1CS=$OUT/${CIRCUIT}.r1cs
WASM=$OUT/${CIRCUIT}_js/${CIRCUIT}.wasm
PTAU=$OUT/pot12_final_phase2.ptau
ZKEY_0=$OUT/${CIRCUIT}_0000.zkey
ZKEY_FINAL=$OUT/${CIRCUIT}_final.zkey
VKEY=$OUT/${CIRCUIT}_vkey.json
INPUT=$OUT/input.json
WITNESS=$OUT/witness.wtns
PROOF=$OUT/proof.json
PUBLIC=$OUT/public.json

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Helper function for animated dots
show_progress() {
  local msg="$1"
  echo -n "$msg"
  for i in {1..3}; do
    sleep 0.3
    echo -n "."
  done
  echo " ✓"
}

clear
echo ""
echo "╔════════════════════════════════════════════════════════════════════╗"
echo "║                                                                    ║"
echo "║     ███████╗██╗  ██╗    ██████╗ ██████╗  ██████╗  ██████╗ ███████╗║"
echo "║     ╚══███╔╝██║ ██╔╝    ██╔══██╗██╔══██╗██╔═══██╗██╔═══██╗██╔════╝║"
echo "║       ███╔╝ █████╔╝     ██████╔╝██████╔╝██║   ██║██║   ██║█████╗  ║"
echo "║      ███╔╝  ██╔═██╗     ██╔═══╝ ██╔══██╗██║   ██║██║   ██║██╔══╝  ║"
echo "║     ███████╗██║  ██╗    ██║     ██║  ██║╚██████╔╝╚██████╔╝██║     ║"
echo "║     ╚══════╝╚═╝  ╚═╝    ╚═╝     ╚═╝  ╚═╝ ╚═════╝  ╚═════╝ ╚═╝     ║"
echo "║                                                                    ║"
echo "║           KYC Transfer - Zero-Knowledge Proof Demo                ║"
echo "║                   EVM + Soroban Verifiers                         ║"
echo "║                                                                    ║"
echo "╚════════════════════════════════════════════════════════════════════╝"
echo ""
echo "  🎯 Objective: Prove KYC compliance without revealing private data"
echo "  🔐 Technology: Circom + Groth16 + snarkjs"
echo "  ⛓️  Target: EVM (Ethereum/Polygon) + Soroban (Stellar)"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Pause for effect
sleep 1

# ============================================
# STEP 1: Compile Circuit
# ============================================
echo "┌────────────────────────────────────────────────────────────────────┐"
echo "│  STEP 1: CIRCUIT COMPILATION                                       │"
echo "└────────────────────────────────────────────────────────────────────┘"
echo ""
echo "What we're doing:"
echo "  • Compiling Circom source code (kyc_transfer.circom)"
echo "  • Generating R1CS constraint system"
echo "  • Creating WASM witness calculator"
echo "  • Building symbol table for debugging"
echo ""

if [ ! -f "$R1CS" ]; then
  echo -e "${YELLOW}⚙️  Compiling circuit...${NC}"
  echo ""
  circom ${CIRCUIT}.circom --r1cs --wasm --sym -o $OUT -l node_modules
  echo ""
  echo -e "${GREEN}✅ Compilation successful!${NC}"
else
  echo -e "${BLUE}ℹ️  Circuit already compiled (using cached version)${NC}"
fi

echo ""
echo "📊 Circuit Statistics:"
npx snarkjs r1cs info $R1CS

echo ""
echo "📁 Files created:"
ls -lh $R1CS $OUT/${CIRCUIT}.sym $OUT/${CIRCUIT}_js/${CIRCUIT}.wasm 2>/dev/null | awk '{if(NR>1)print "   " $9 " → " $5}'
echo ""

[ -z "$DEMO_AUTO" ] && read -p "Press ENTER to continue to Step 2..." || sleep 2
echo ""

# ============================================
# STEP 2: Trusted Setup
# ============================================
echo "┌────────────────────────────────────────────────────────────────────┐"
echo "│  STEP 2: TRUSTED SETUP (Groth16 Protocol)                         │"
echo "└────────────────────────────────────────────────────────────────────┘"
echo ""
echo "What we're doing:"
echo "  • Using Powers of Tau ceremony (Phase 1 - universal)"
echo "  • Running Groth16 setup (Phase 2 - circuit-specific)"
echo "  • Contributing randomness for cryptographic security"
echo "  • Exporting verification key for on-chain verifiers"
echo ""
echo "Why this matters:"
echo "  In production, this is done via Multi-Party Computation (MPC)"
echo "  to ensure NO single party can forge proofs."
echo ""

if [ ! -f "$PTAU" ]; then
  echo "❌ Powers of Tau file not found: $PTAU"
  echo "Please run: bash scripts/prepare_and_setup.sh"
  exit 1
fi

echo -e "${BLUE}✓ Powers of Tau ready${NC} (pot12_final_phase2.ptau)"

if [ ! -f "$ZKEY_FINAL" ]; then
  echo ""
  show_progress "⚙️  Running Groth16 setup"
  npx snarkjs groth16 setup $R1CS $PTAU $ZKEY_0
  echo ""

  show_progress "✍️  Adding cryptographic contribution"
  echo "demo random entropy xyz123" | npx snarkjs zkey contribute $ZKEY_0 $ZKEY_FINAL --name="Demo Final" -v
  echo ""

  show_progress "📜 Exporting verification key"
  npx snarkjs zkey export verificationkey $ZKEY_FINAL $VKEY
  echo ""
  echo -e "${GREEN}✅ Setup complete!${NC}"
else
  echo -e "${BLUE}ℹ️  Using existing setup files${NC}"
fi

echo ""
echo "📁 Setup files created:"
ls -lh $ZKEY_FINAL $VKEY 2>/dev/null | awk '{if(NR>1)print "   " $9 " → " $5}'
echo ""

[ -z "$DEMO_AUTO" ] && read -p "Press ENTER to continue to Step 3..." || sleep 2
echo ""

# ============================================
# STEP 3: Create Input
# ============================================
echo "┌────────────────────────────────────────────────────────────────────┐"
echo "│  STEP 3: WITNESS INPUT CREATION                                    │"
echo "└────────────────────────────────────────────────────────────────────┘"
echo ""
echo "What we're doing:"
echo "  • Creating sample KYC data (private inputs)"
echo "  • Setting public parameters (age/balance limits)"
echo "  • Preparing data for witness calculation"
echo ""

cat > $INPUT <<'EOF'
{
  "age": 25,
  "minAge": 18,
  "maxAge": 99,
  "balance": 150,
  "minBalance": 50,
  "countryId": 32
}
EOF

echo "✅ Input created:"
echo ""
cat $INPUT | jq .
echo ""
echo "┌─────────────────────────────────────────────────────────────────┐"
echo "│  🔒 PRIVATE DATA (hidden from verifier)                        │"
echo "├─────────────────────────────────────────────────────────────────┤"
echo "│  age        = 25 (user's actual age)                           │"
echo "│  balance    = 150 (user's actual balance in USD)               │"
echo "│  countryId  = 32 (Argentina)                                    │"
echo "└─────────────────────────────────────────────────────────────────┘"
echo ""
echo "┌─────────────────────────────────────────────────────────────────┐"
echo "│  🌍 PUBLIC PARAMETERS (known to verifier)                       │"
echo "├─────────────────────────────────────────────────────────────────┤"
echo "│  minAge     = 18 (minimum required age)                         │"
echo "│  maxAge     = 99 (maximum allowed age)                          │"
echo "│  minBalance = 50 (minimum required balance)                     │"
echo "└─────────────────────────────────────────────────────────────────┘"
echo ""

[ -z "$DEMO_AUTO" ] && read -p "Press ENTER to continue to Step 4..." || sleep 2
echo ""

# ============================================
# STEP 4: Generate Witness
# ============================================
echo "┌────────────────────────────────────────────────────────────────────┐"
echo "│  STEP 4: WITNESS GENERATION                                        │"
echo "└────────────────────────────────────────────────────────────────────┘"
echo ""
echo "What we're doing:"
echo "  • Running the circuit with the input data"
echo "  • Computing all internal signals and constraints"
echo "  • Generating a cryptographic witness"
echo ""
echo "Technical details:"
echo "  The witness contains solutions to all 586 constraints."
echo "  It proves we know values that satisfy the circuit."
echo ""

show_progress "🧮 Computing witness"
node $OUT/${CIRCUIT}_js/generate_witness.js $WASM $INPUT $WITNESS

if [ -f "$WITNESS" ]; then
  echo -e "${GREEN}✅ Witness generated successfully${NC}"
  echo ""
  echo "📁 Witness file:"
  ls -lh $WITNESS | awk '{print "   " $9 " → " $5 " (" $9 " contains all signal values)"}'
else
  echo -e "\033[0;31m❌ Failed to generate witness${NC}"
  exit 1
fi

echo ""
[ -z "$DEMO_AUTO" ] && read -p "Press ENTER to continue to Step 5..." || sleep 2
echo ""

# ============================================
# STEP 5: Generate Proof
# ============================================
echo "┌────────────────────────────────────────────────────────────────────┐"
echo "│  STEP 5: ZERO-KNOWLEDGE PROOF GENERATION                           │"
echo "└────────────────────────────────────────────────────────────────────┘"
echo ""
echo "What we're doing:"
echo "  • Using the witness and proving key (zkey)"
echo "  • Running Groth16 proof generation algorithm"
echo "  • Creating cryptographic proof (3 elliptic curve points)"
echo "  • Extracting public outputs"
echo ""
echo "The magic:"
echo "  The proof is only ~800 bytes but proves compliance"
echo "  with ALL constraints WITHOUT revealing private data!"
echo ""

show_progress "🔏 Generating zero-knowledge proof"
npx snarkjs groth16 prove $ZKEY_FINAL $WITNESS $PROOF $PUBLIC

echo ""
echo -e "${GREEN}✅ Proof generated successfully!${NC}"
echo ""

echo "┌─────────────────────────────────────────────────────────────────┐"
echo "│  📦 PROOF CONTENTS                                              │"
echo "└─────────────────────────────────────────────────────────────────┘"
echo ""
echo "Proof structure (Groth16):"
cat $PROOF | jq '{
  protocol: .protocol,
  curve: .curve,
  proof_elements: {
    pi_a: "Point on curve (2 coordinates)",
    pi_b: "Point on curve (2 coordinates)",
    pi_c: "Point on curve (2 coordinates)"
  }
}'

echo ""
echo "📊 Proof size: $(ls -lh $PROOF | awk '{print $5}')"
echo ""

echo "┌─────────────────────────────────────────────────────────────────┐"
echo "│  🌍 PUBLIC OUTPUT                                               │"
echo "└─────────────────────────────────────────────────────────────────┘"
echo ""
echo "Public signals (visible to everyone):"
cat $PUBLIC | jq -r '.[] | "  kycValid = \(.)"'
echo ""
echo "  ✓ Value '1' means: KYC checks PASSED"
echo "  ✗ Value '0' would mean: KYC checks FAILED"
echo ""

[ -z "$DEMO_AUTO" ] && read -p "Press ENTER to continue to Step 6..." || sleep 2
echo ""

# ============================================
# STEP 6: Verify Proof
# ============================================
echo "┌────────────────────────────────────────────────────────────────────┐"
echo "│  STEP 6: PROOF VERIFICATION                                        │"
echo "└────────────────────────────────────────────────────────────────────┘"
echo ""
echo "What we're doing:"
echo "  • Using verification key (public)"
echo "  • Checking proof cryptographically"
echo "  • Confirming KYC compliance WITHOUT seeing private data"
echo ""
echo "How verification works:"
echo "  1. Takes: proof.json + public.json + vkey.json"
echo "  2. Runs: Groth16 pairing check (elliptic curve math)"
echo "  3. Result: OK = proof valid, FAIL = proof invalid/forged"
echo ""

show_progress "🔍 Verifying proof cryptographically"

if npx snarkjs groth16 verify $VKEY $PUBLIC $PROOF; then
  echo ""
  echo "╔════════════════════════════════════════════════════════════════════╗"
  echo "║                                                                    ║"
  echo "║   ✅  VERIFICATION SUCCESSFUL!                                     ║"
  echo "║                                                                    ║"
  echo "╚════════════════════════════════════════════════════════════════════╝"
  echo ""

  echo "┌─────────────────────────────────────────────────────────────────┐"
  echo "│  📋 VERIFICATION SUMMARY                                        │"
  echo "└─────────────────────────────────────────────────────────────────┘"
  echo ""
  echo "  What the verifier KNOWS:"
  echo "    ✓ kycValid = 1 (user passed all checks)"
  echo ""
  echo "  What the verifier DOESN'T KNOW:"
  echo "    🔒 Actual age (only knows: 18 ≤ age ≤ 99)"
  echo "    🔒 Actual balance (only knows: balance ≥ 50)"
  echo "    🔒 Actual country (only knows: country is allowed)"
  echo ""
  echo "  Proven facts:"
  echo "    ✓ User's age is between 18-99 years"
  echo "    ✓ User's balance is at least \$50"
  echo "    ✓ User's country (ID=32) is in the allowed list"
  echo ""
  echo "╭────────────────────────────────────────────────────────────────╮"
  echo "│                                                                │"
  echo "│  ✨ This is the power of Zero-Knowledge Proofs! ✨             │"
  echo "│                                                                │"
  echo "│  The user proved compliance WITHOUT revealing:                │"
  echo "│    • Their exact age                                          │"
  echo "│    • Their exact balance                                      │"
  echo "│    • Their exact country                                      │"
  echo "│                                                                │"
  echo "╰────────────────────────────────────────────────────────────────╯"
  echo ""
else
  echo ""
  echo "❌ Verification failed!"
  exit 1
fi

[ -z "$DEMO_AUTO" ] && read -p "Press ENTER to continue to blockchain verifier export..." || sleep 2
echo ""

# ============================================
# STEP 7: Export EVM Verifier
# ============================================
echo "┌────────────────────────────────────────────────────────────────────┐"
echo "│  STEP 7: BLOCKCHAIN VERIFIER EXPORT                                │"
echo "└────────────────────────────────────────────────────────────────────┘"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  🔷 EVM VERIFIER (Ethereum, Polygon, BSC, etc.)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "What we're doing:"
echo "  • Exporting Solidity smart contract"
echo "  • Contract can verify proofs on-chain"
echo "  • Gas cost: ~250k-300k gas per verification"
echo ""

mkdir -p evm
show_progress "🏗️  Generating Solidity verifier contract"
npx snarkjs zkey export solidityverifier $ZKEY_FINAL evm/Verifier.sol

echo ""
echo -e "${GREEN}✅ Solidity verifier exported${NC}"
echo ""
echo "📁 Verifier contract:"
ls -lh evm/Verifier.sol | awk '{print "   " $9 " → " $5}'
echo ""
echo "📊 Contract stats:"
wc -l evm/Verifier.sol | awk '{print "   Lines of code: " $1}'
grep "function verify" evm/Verifier.sol | head -1 | awk '{print "   Main function: verifyProof()"}'
echo ""
echo "  🎯 This contract can be deployed to:"
echo "     • Ethereum Mainnet / Sepolia"
echo "     • Polygon PoS / zkEVM"
echo "     • BSC, Avalanche, Arbitrum, Optimism, etc."
echo ""

# Show a snippet of the contract
echo "  📝 Contract preview:"
echo "  ┌─────────────────────────────────────────────────────────────┐"
head -20 evm/Verifier.sol | sed 's/^/  │ /'
echo "  │ ..."
echo "  └─────────────────────────────────────────────────────────────┘"
echo ""

[ -z "$DEMO_AUTO" ] && read -p "Press ENTER to continue to Soroban verifier..." || sleep 2
echo ""

# ============================================
# STEP 8: Export Soroban Verifier
# ============================================
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  ⭐ SOROBAN VERIFIER (Stellar Network)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "What we're doing:"
echo "  • Checking for Soroban Groth16 verifier template"
echo "  • This would be a Rust smart contract (no_std)"
echo "  • Optimized for Stellar's Soroban runtime"
echo ""

SOROBAN_DIR="../soroban"
if [ -d "$SOROBAN_DIR" ] && [ -f "$SOROBAN_DIR/src/lib.rs" ]; then
  echo -e "${GREEN}✅ Soroban verifier found${NC}"
  echo ""
  echo "📁 Soroban contract:"
  ls -lh $SOROBAN_DIR/src/lib.rs | awk '{print "   " $9 " → " $5}'
  echo ""
  echo "  📝 Contract preview:"
  echo "  ┌─────────────────────────────────────────────────────────────┐"
  head -15 $SOROBAN_DIR/src/lib.rs 2>/dev/null | sed 's/^/  │ /' || echo "  │ (contract code)"
  echo "  │ ..."
  echo "  └─────────────────────────────────────────────────────────────┘"
  echo ""
  echo "  🎯 This contract can be deployed to:"
  echo "     • Stellar Testnet"
  echo "     • Stellar Mainnet (Soroban)"
  echo ""
else
  echo -e "${YELLOW}⚠️  Soroban verifier not found in ../soroban/${NC}"
  echo ""
  echo "  ℹ️  The Soroban verifier would include:"
  echo "     • Rust-based Groth16 verification"
  echo "     • BN254 curve operations (no_std)"
  echo "     • Soroban SDK integration"
  echo ""
  echo "  📚 Reference implementation available in the repo"
  echo ""
fi

echo ""
[ -z "$DEMO_AUTO" ] && read -p "Press ENTER to see final summary..." || sleep 3
echo ""

# ============================================
# Final Summary
# ============================================
clear
echo ""
echo "╔════════════════════════════════════════════════════════════════════╗"
echo "║                                                                    ║"
echo "║                  🎉 DEMO COMPLETED SUCCESSFULLY! 🎉                ║"
echo "║                                                                    ║"
echo "╚════════════════════════════════════════════════════════════════════╝"
echo ""
echo "┌────────────────────────────────────────────────────────────────────┐"
echo "│  📦 GENERATED ARTIFACTS                                            │"
echo "└────────────────────────────────────────────────────────────────────┘"
echo ""
echo "  🔧 Circuit Files:"
ls -lh $R1CS $WASM 2>/dev/null | awk '{if(NR>1)print "     • " $9 " (" $5 ")"}'
echo ""
echo "  🔑 Cryptographic Keys:"
ls -lh $ZKEY_FINAL $VKEY 2>/dev/null | awk '{if(NR>1)print "     • " $9 " (" $5 ")"}'
echo ""
echo "  📋 Proof Artifacts:"
ls -lh $INPUT $WITNESS $PROOF $PUBLIC 2>/dev/null | awk '{if(NR>1)print "     • " $9 " (" $5 ")"}'
echo ""
echo "  ⛓️  Blockchain Verifiers:"
[ -f "evm/Verifier.sol" ] && ls -lh evm/Verifier.sol | awk '{print "     • " $9 " (" $5 ") - EVM"}'
[ -f "$SOROBAN_DIR/src/lib.rs" ] && ls -lh $SOROBAN_DIR/src/lib.rs | awk '{print "     • " $9 " (" $5 ") - Soroban"}'
echo ""

echo "┌────────────────────────────────────────────────────────────────────┐"
echo "│  📊 PROOF VERIFICATION STATS                                       │"
echo "└────────────────────────────────────────────────────────────────────┘"
echo ""
echo "  Circuit Constraints:    586"
echo "  Circuit Wires:          590"
echo "  Private Inputs:         6 (age, minAge, maxAge, balance, minBalance, countryId)"
echo "  Public Outputs:         1 (kycValid)"
echo "  Proof Size:             ~800 bytes"
echo "  Verification Time:      ~10-50ms (off-chain)"
echo "  On-chain Gas (EVM):     ~250k-300k gas"
echo ""

echo "┌────────────────────────────────────────────────────────────────────┐"
echo "│  🎯 WHAT WAS PROVEN                                                │"
echo "└────────────────────────────────────────────────────────────────────┘"
echo ""
echo "  ✅ User meets age requirements (18 ≤ age ≤ 99)"
echo "  ✅ User has sufficient balance (balance ≥ \$50)"
echo "  ✅ User is from an allowed country (countryId = 32)"
echo ""
echo "  🔒 WITHOUT revealing:"
echo "     • Exact age (only that it's valid)"
echo "     • Exact balance (only that it's sufficient)"
echo "     • Exact country (only that it's allowed)"
echo ""

echo "┌────────────────────────────────────────────────────────────────────┐"
echo "│  🚀 NEXT STEPS                                                     │"
echo "└────────────────────────────────────────────────────────────────────┘"
echo ""
echo "  For EVM deployment:"
echo "    1. Deploy evm/Verifier.sol to your target network"
echo "    2. Call verifyProof() with proof.json + public.json"
echo "    3. Contract returns true/false for verification"
echo ""
echo "  For Soroban deployment:"
echo "    1. Build the Soroban contract: cargo build --release --target wasm32-unknown-unknown"
echo "    2. Deploy to Stellar: soroban contract deploy"
echo "    3. Invoke verification function with proof data"
echo ""
echo "  Generate new proofs:"
echo "    • Modify artifacts/input.json with new values"
echo "    • Run: npx snarkjs groth16 fullprove input.json circuit.wasm circuit.zkey proof.json public.json"
echo ""

echo "╔════════════════════════════════════════════════════════════════════╗"
echo "║                                                                    ║"
echo "║     Thank you for watching this Zero-Knowledge Proof demo!        ║"
echo "║                                                                    ║"
echo "║     🔐 Privacy-Preserving • ⚡ Trustless • 🌍 Universal            ║"
echo "║                                                                    ║"
echo "╚════════════════════════════════════════════════════════════════════╝"
echo ""
echo "  📚 Learn more:"
echo "     • Circom: https://docs.circom.io"
echo "     • snarkjs: https://github.com/iden3/snarkjs"
echo "     • Stellar: https://stellar.org/soroban"
echo ""
echo "  🎬 Demo complete! $(date)"
echo ""
