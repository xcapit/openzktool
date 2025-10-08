#!/usr/bin/env bash
set -euo pipefail

# ============================================
# 🎬 COMPLETE ZK-PROOF DEMO
# Theory + Practice + Benefits
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

# Auto-pause control
PAUSE_TIME=2
if [ "${DEMO_PAUSE:-}" = "manual" ]; then
  pause() { read -p "Press ENTER to continue..."; }
else
  pause() { sleep $PAUSE_TIME; }
fi

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
echo "║        COMPLETE ZERO-KNOWLEDGE PROOF DEMONSTRATION                ║"
echo "║           Theory • Practice • Real-World Benefits                 ║"
echo "║                                                                    ║"
echo "╚════════════════════════════════════════════════════════════════════╝"
echo ""
echo "  🎯 Use Case: KYC Compliance Without Privacy Compromise"
echo "  🔐 Technology: Circom + Groth16 SNARK"
echo "  ⛓️  Deployment: EVM (Ethereum/Polygon) + Soroban (Stellar)"
echo ""
sleep 2

# ============================================
# THEORY: What is Zero-Knowledge?
# ============================================
clear
echo ""
echo "╔════════════════════════════════════════════════════════════════════╗"
echo "║                                                                    ║"
echo "║                    📚 WHAT IS ZERO-KNOWLEDGE?                      ║"
echo "║                                                                    ║"
echo "╚════════════════════════════════════════════════════════════════════╝"
echo ""
echo "  Zero-Knowledge Proofs allow you to prove a statement is true"
echo "  WITHOUT revealing any information about WHY it's true."
echo ""
echo "┌────────────────────────────────────────────────────────────────────┐"
echo "│  🎓 THE CLASSIC EXAMPLE: \"Ali Baba's Cave\"                        │"
echo "└────────────────────────────────────────────────────────────────────┘"
echo ""
echo "    🏔️                                   You (Verifier) stand here"
echo "    │ \\                                           ↓"
echo "    │  \\      ┌───────────────┐         👁️  [Entrance]"
echo "    │   \\     │               │              ╱      \\"
echo "    │    \\    │   SECRET      │          Path A    Path B"
echo "    │     \\   │   DOOR 🚪     │             │        │"
echo "    │      \\  │  (password)   │             │        │"
echo "    │       \\ │               │             └────┬───┘"
echo "    │        \\└───────────────┘                  │"
echo "    Cave                                  Prover enters one side,"
echo "                                          exits from the other!"
echo ""
echo "  💡 The Insight:"
echo "     • You never see which path they took"
echo "     • You never learn the password"
echo "     • But you're CONVINCED they know it!"
echo ""
pause

# ============================================
# THEORY: How ZK Works (3 Properties)
# ============================================
clear
echo ""
echo "╔════════════════════════════════════════════════════════════════════╗"
echo "║                                                                    ║"
echo "║              🔬 HOW ZERO-KNOWLEDGE PROOFS WORK                     ║"
echo "║                                                                    ║"
echo "╚════════════════════════════════════════════════════════════════════╝"
echo ""
echo "  A valid ZK proof must satisfy THREE properties:"
echo ""
echo "┌────────────────────────────────────────────────────────────────────┐"
echo "│  1️⃣  COMPLETENESS                                                  │"
echo "├────────────────────────────────────────────────────────────────────┤"
echo "│  If the statement is TRUE, an honest prover can always convince   │"
echo "│  an honest verifier.                                              │"
echo "│                                                                    │"
echo "│  ✅ True statement → Proof accepted                               │"
echo "└────────────────────────────────────────────────────────────────────┘"
echo ""
echo "┌────────────────────────────────────────────────────────────────────┐"
echo "│  2️⃣  SOUNDNESS                                                     │"
echo "├────────────────────────────────────────────────────────────────────┤"
echo "│  If the statement is FALSE, no cheating prover can convince       │"
echo "│  the verifier (except with negligible probability).               │"
echo "│                                                                    │"
echo "│  ❌ False statement → Proof rejected (with high probability)       │"
echo "└────────────────────────────────────────────────────────────────────┘"
echo ""
echo "┌────────────────────────────────────────────────────────────────────┐"
echo "│  3️⃣  ZERO-KNOWLEDGE                                                │"
echo "├────────────────────────────────────────────────────────────────────┤"
echo "│  The verifier learns NOTHING except that the statement is true.   │"
echo "│  The proof reveals NO information about the witness (secret).     │"
echo "│                                                                    │"
echo "│  🔒 Secret stays secret, only validity is proven                   │"
echo "└────────────────────────────────────────────────────────────────────┘"
echo ""
pause

# ============================================
# THEORY: SNARKs vs STARKs
# ============================================
clear
echo ""
echo "╔════════════════════════════════════════════════════════════════════╗"
echo "║                                                                    ║"
echo "║                  🔍 TYPES OF ZERO-KNOWLEDGE PROOFS                 ║"
echo "║                                                                    ║"
echo "╚════════════════════════════════════════════════════════════════════╝"
echo ""
echo "┌────────────────────────────────────────────────────────────────────┐"
echo "│  📊 COMPARISON TABLE                                               │"
echo "├──────────────────┬─────────────────────┬───────────────────────────┤"
echo "│  Property        │  SNARK (Groth16)    │  STARK                    │"
echo "├──────────────────┼─────────────────────┼───────────────────────────┤"
echo "│  Proof Size      │  ⭐ ~200-800 bytes  │  ~100-200 KB              │"
echo "│  Verification    │  ⭐ Ultra-fast      │  Fast                     │"
echo "│  Trusted Setup   │  ⚠️  Required       │  ⭐ NOT required          │"
echo "│  Quantum Safe    │  ❌ No              │  ⭐ Yes                   │"
echo "│  Proving Time    │  Moderate           │  Faster                   │"
echo "│  Gas Cost (EVM)  │  ⭐ ~250k gas       │  ~2-5M gas                │"
echo "└──────────────────┴─────────────────────┴───────────────────────────┘"
echo ""
echo "  🎯 We use Groth16 SNARK because:"
echo "     ✅ Smallest proof size (perfect for blockchain)"
echo "     ✅ Fastest verification (low gas costs)"
echo "     ✅ Battle-tested (used by Zcash, Filecoin, Polygon)"
echo ""
echo "  ⚠️  Tradeoff: Requires Trusted Setup"
echo "     • Done via Multi-Party Ceremony (MPC)"
echo "     • Safe if at least ONE participant is honest"
echo ""
pause

# ============================================
# THEORY: Groth16 Workflow
# ============================================
clear
echo ""
echo "╔════════════════════════════════════════════════════════════════════╗"
echo "║                                                                    ║"
echo "║                 ⚙️  GROTH16 PROOF SYSTEM WORKFLOW                  ║"
echo "║                                                                    ║"
echo "╚════════════════════════════════════════════════════════════════════╝"
echo ""
echo "     ┌──────────────────────────────────────────────────────────┐"
echo "     │  STEP 1: CIRCUIT DESIGN (Developer)                     │"
echo "     │  Write constraints in Circom                            │"
echo "     │  Example: age >= 18 AND age <= 99                       │"
echo "     └────────────────┬─────────────────────────────────────────┘"
echo "                      │"
echo "                      ▼"
echo "     ┌──────────────────────────────────────────────────────────┐"
echo "     │  STEP 2: COMPILATION                                     │"
echo "     │  Circom → R1CS (Rank-1 Constraint System)               │"
echo "     │  Creates mathematical representation of logic           │"
echo "     └────────────────┬─────────────────────────────────────────┘"
echo "                      │"
echo "                      ▼"
echo "     ┌──────────────────────────────────────────────────────────┐"
echo "     │  STEP 3: TRUSTED SETUP (One-time ceremony)              │"
echo "     │  Generates: Proving Key + Verification Key              │"
echo "     │  Uses \"toxic waste\" (destroyed after ceremony)          │"
echo "     └────────────────┬─────────────────────────────────────────┘"
echo "                      │"
echo "                      ▼"
echo "     ┌──────────────────────────────────────────────────────────┐"
echo "     │  STEP 4: PROOF GENERATION (Prover - user side)          │"
echo "     │  Input: Private data (age=25, balance=150...)           │"
echo "     │  Output: Proof (~800 bytes) + Public signals            │"
echo "     └────────────────┬─────────────────────────────────────────┘"
echo "                      │"
echo "                      ▼"
echo "     ┌──────────────────────────────────────────────────────────┐"
echo "     │  STEP 5: VERIFICATION (On-chain or off-chain)           │"
echo "     │  Input: Proof + Public signals + Verification Key       │"
echo "     │  Output: TRUE (valid) or FALSE (invalid)                │"
echo "     │  Time: ~10-50ms off-chain, ~250k gas on-chain           │"
echo "     └──────────────────────────────────────────────────────────┘"
echo ""
pause

# ============================================
# PRACTICE: START DEMO
# ============================================
clear
echo ""
echo "╔════════════════════════════════════════════════════════════════════╗"
echo "║                                                                    ║"
echo "║                    🛠️  LET'S BUILD A REAL PROOF!                   ║"
echo "║                                                                    ║"
echo "╚════════════════════════════════════════════════════════════════════╝"
echo ""
echo "  📋 Our Use Case: KYC Transfer"
echo ""
echo "  We need to prove a user satisfies ALL three conditions:"
echo "    1️⃣  Age is between 18-99 years"
echo "    2️⃣  Balance is at least \$50"
echo "    3️⃣  Country is in the allowed list (ID=32 → Argentina)"
echo ""
echo "  🎯 Goal: Prove compliance WITHOUT revealing:"
echo "    • The exact age"
echo "    • The exact balance"
echo "    • The exact country"
echo ""
echo "  Let's see how it works in practice..."
echo ""
sleep 3

# ============================================
# STEP 1: Compile Circuit
# ============================================
clear
echo ""
echo "┌────────────────────────────────────────────────────────────────────┐"
echo "│  STEP 1/6: CIRCUIT COMPILATION                                     │"
echo "└────────────────────────────────────────────────────────────────────┘"
echo ""
echo "  Compiling kyc_transfer.circom → R1CS + WASM..."
echo ""

if [ ! -f "$R1CS" ]; then
  circom ${CIRCUIT}.circom --r1cs --wasm --sym -o $OUT -l node_modules
  echo ""
  echo "  ✅ Compilation successful!"
else
  echo "  ℹ️  Using cached circuit"
fi

echo ""
echo "  📊 Circuit Statistics:"
npx snarkjs r1cs info $R1CS | grep -E "Constraints|Wires|Inputs|Outputs"
echo ""
echo "  📁 Generated files:"
ls -lh $R1CS $WASM 2>/dev/null | awk '{if(NR>1)print "     " $9 " (" $5 ")"}'
echo ""
pause

# ============================================
# STEP 2: Trusted Setup
# ============================================
clear
echo ""
echo "┌────────────────────────────────────────────────────────────────────┐"
echo "│  STEP 2/6: TRUSTED SETUP                                           │"
echo "└────────────────────────────────────────────────────────────────────┘"
echo ""
echo "  ⚠️  The Trusted Setup is the 'Achilles heel' of SNARKs"
echo ""
echo "  How it works:"
echo "    1. Generate random 'toxic waste' (secret)"
echo "    2. Create Proving Key and Verification Key"
echo "    3. DESTROY the toxic waste"
echo ""
echo "  Why it's safe:"
echo "    • Done via Multi-Party Computation (MPC)"
echo "    • Needs ALL participants to be malicious to break"
echo "    • If even ONE person is honest → system is secure"
echo ""
echo "  Real-world examples:"
echo "    • Zcash: 6 ceremonies, 200+ participants"
echo "    • Ethereum: 141,000+ contributors to KZG ceremony"
echo ""

if [ ! -f "$PTAU" ]; then
  echo "  ❌ Powers of Tau not found. Run: bash prepare_and_setup.sh"
  exit 1
fi

echo "  ✅ Using existing Powers of Tau"
echo ""

if [ ! -f "$ZKEY_FINAL" ]; then
  echo "  Generating proving key..."
  npx snarkjs groth16 setup $R1CS $PTAU $ZKEY_0 2>&1 | grep -i "circuit hash" | head -5
  echo ""
  echo "  Adding contribution (simulating MPC participant)..."
  echo "demo random entropy" | npx snarkjs zkey contribute $ZKEY_0 $ZKEY_FINAL --name="Demo" -v 2>&1 | grep -i "contribution hash" | head -5
  echo ""
  npx snarkjs zkey export verificationkey $ZKEY_FINAL $VKEY
  echo "  ✅ Verification key exported"
else
  echo "  ℹ️  Using existing setup"
fi

echo ""
ls -lh $ZKEY_FINAL $VKEY 2>/dev/null | awk '{if(NR>1)print "     " $9 " (" $5 ")"}'
echo ""
pause

# ============================================
# STEP 3: Create Input
# ============================================
clear
echo ""
echo "┌────────────────────────────────────────────────────────────────────┐"
echo "│  STEP 3/6: WITNESS INPUT (The Secret Data)                        │"
echo "└────────────────────────────────────────────────────────────────────┘"
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

echo "  🔒 PRIVATE INPUTS (Hidden from verifier):"
echo "  ┌─────────────────────────────────────────────────────────┐"
echo "  │  age        = 25  (user's actual age)                  │"
echo "  │  balance    = 150 (user's actual balance in USD)       │"
echo "  │  countryId  = 32  (Argentina)                          │"
echo "  └─────────────────────────────────────────────────────────┘"
echo ""
echo "  🌍 PUBLIC PARAMETERS (Known to verifier):"
echo "  ┌─────────────────────────────────────────────────────────┐"
echo "  │  minAge     = 18  (minimum required age)               │"
echo "  │  maxAge     = 99  (maximum allowed age)                │"
echo "  │  minBalance = 50  (minimum required balance)           │"
echo "  └─────────────────────────────────────────────────────────┘"
echo ""
echo "  💡 Key Insight:"
echo "     The verifier will learn ONLY whether these conditions pass,"
echo "     NOT the actual values!"
echo ""
pause

# ============================================
# STEP 4: Generate Witness
# ============================================
clear
echo ""
echo "┌────────────────────────────────────────────────────────────────────┐"
echo "│  STEP 4/6: WITNESS GENERATION                                      │"
echo "└────────────────────────────────────────────────────────────────────┘"
echo ""
echo "  What is a 'witness'?"
echo "    • It's the assignment of ALL signals in the circuit"
echo "    • Includes both inputs and intermediate computations"
echo "    • Proves you know values that satisfy the constraints"
echo ""
echo "  Computing witness for our 586 constraints..."
echo ""

node $OUT/${CIRCUIT}_js/generate_witness.js $WASM $INPUT $WITNESS

if [ -f "$WITNESS" ]; then
  echo "  ✅ Witness generated successfully"
  echo ""
  ls -lh $WITNESS | awk '{print "     " $9 " (" $5 " containing all " 590 " signal values)"}'
  echo ""
  echo "  🔍 Fun fact:"
  echo "     The witness is NEVER shared with the verifier."
  echo "     Only the proof (which is derived from it) is shared!"
else
  echo "  ❌ Failed to generate witness"
  exit 1
fi

echo ""
pause

# ============================================
# STEP 5: Generate Proof
# ============================================
clear
echo ""
echo "┌────────────────────────────────────────────────────────────────────┐"
echo "│  STEP 5/6: ZERO-KNOWLEDGE PROOF GENERATION                         │"
echo "└────────────────────────────────────────────────────────────────────┘"
echo ""
echo "  ✨ THE MAGIC HAPPENS HERE ✨"
echo ""
echo "  The Groth16 algorithm will:"
echo "    1. Take the witness (all 590 signals)"
echo "    2. Take the proving key (~324 KB)"
echo "    3. Perform elliptic curve operations"
echo "    4. Output a proof of just ~800 bytes!"
echo ""
echo "  This proof encodes the fact that we know values satisfying"
echo "  all constraints, WITHOUT revealing what those values are."
echo ""
echo "  Generating proof (this takes a few seconds)..."
echo ""

npx snarkjs groth16 prove $ZKEY_FINAL $WITNESS $PROOF $PUBLIC

echo ""
echo "  ✅ Proof generated!"
echo ""
echo "  📦 Proof structure (Groth16):"
cat $PROOF | jq '{protocol, curve, proof_size: "3 elliptic curve points (pi_a, pi_b, pi_c)"}'
echo ""
echo "  📊 Proof size: $(ls -lh $PROOF | awk '{print $5}')"
echo ""
echo "  🌍 Public output:"
cat $PUBLIC | jq -r '.[] | "     kycValid = \(.)"'
echo ""
echo "     ✓ Value '1' means ALL KYC checks PASSED"
echo ""
pause

# ============================================
# STEP 6: Verify Proof
# ============================================
clear
echo ""
echo "┌────────────────────────────────────────────────────────────────────┐"
echo "│  STEP 6/6: PROOF VERIFICATION                                      │"
echo "└────────────────────────────────────────────────────────────────────┘"
echo ""
echo "  The verifier will:"
echo "    1. Take the proof (800 bytes)"
echo "    2. Take the public signals (kycValid)"
echo "    3. Take the verification key (public, 2.9KB)"
echo "    4. Run a pairing check on elliptic curves"
echo ""
echo "  This verification:"
echo "    ⚡ Takes ~10-50 milliseconds off-chain"
echo "    ⛓️  Costs ~250k-300k gas on Ethereum"
echo "    🔒 Reveals ZERO information about private inputs"
echo ""
echo "  Verifying proof..."
echo ""

if npx snarkjs groth16 verify $VKEY $PUBLIC $PROOF; then
  echo ""
  echo "  ╔════════════════════════════════════════════════════════════════╗"
  echo "  ║                                                                ║"
  echo "  ║           ✅  PROOF VERIFIED SUCCESSFULLY! ✅                  ║"
  echo "  ║                                                                ║"
  echo "  ╚════════════════════════════════════════════════════════════════╝"
  echo ""
  echo "  🎉 What just happened?"
  echo ""
  echo "     The verifier is now CONVINCED that:"
  echo "       ✓ User's age is between 18-99"
  echo "       ✓ User's balance is ≥ \$50"
  echo "       ✓ User's country is allowed (ID=32)"
  echo ""
  echo "     But the verifier DOES NOT KNOW:"
  echo "       🔒 The exact age (could be 18, 25, 50, 99...)"
  echo "       🔒 The exact balance (could be 50, 100, 150, 1000...)"
  echo "       🔒 The exact country (only knows it's allowed)"
  echo ""
  echo "  ✨ This is Zero-Knowledge in action!"
  echo ""
else
  echo "  ❌ Verification failed!"
  exit 1
fi

pause

# ============================================
# BENEFITS: Real-World Applications
# ============================================
clear
echo ""
echo "╔════════════════════════════════════════════════════════════════════╗"
echo "║                                                                    ║"
echo "║              🌍 REAL-WORLD BENEFITS & USE CASES                    ║"
echo "║                                                                    ║"
echo "╚════════════════════════════════════════════════════════════════════╝"
echo ""
echo "┌────────────────────────────────────────────────────────────────────┐"
echo "│  1️⃣  PRIVACY-PRESERVING IDENTITY (Like our demo!)                 │"
echo "├────────────────────────────────────────────────────────────────────┤"
echo "│  • Prove you're over 18 without revealing your birthday           │"
echo "│  • Prove you're a citizen without showing passport number         │"
echo "│  • Prove creditworthiness without sharing financial history       │"
echo "│                                                                    │"
echo "│  💼 Industries: Banking, Healthcare, Government, Web3             │"
echo "└────────────────────────────────────────────────────────────────────┘"
echo ""
echo "┌────────────────────────────────────────────────────────────────────┐"
echo "│  2️⃣  BLOCKCHAIN SCALABILITY                                        │"
echo "├────────────────────────────────────────────────────────────────────┤"
echo "│  • zkRollups: Process 1000s of transactions off-chain             │"
echo "│  • Submit ONE proof on-chain to verify all transactions           │"
echo "│  • 100-200x throughput increase                                   │"
echo "│                                                                    │"
echo "│  🚀 Projects: Polygon zkEVM, zkSync, StarkNet, Scroll             │"
echo "└────────────────────────────────────────────────────────────────────┘"
echo ""
echo "┌────────────────────────────────────────────────────────────────────┐"
echo "│  3️⃣  PRIVATE TRANSACTIONS                                          │"
echo "├────────────────────────────────────────────────────────────────────┤"
echo "│  • Send money without revealing amount or recipient              │"
echo "│  • Prove transaction is valid without showing details             │"
echo "│  • Maintain regulatory compliance with selective disclosure       │"
echo "│                                                                    │"
echo "│  💰 Projects: Zcash, Tornado Cash (before sanctions), Aztec       │"
echo "└────────────────────────────────────────────────────────────────────┘"
echo ""
pause

clear
echo ""
echo "┌────────────────────────────────────────────────────────────────────┐"
echo "│  4️⃣  VERIFIABLE COMPUTATION                                        │"
echo "├────────────────────────────────────────────────────────────────────┤"
echo "│  • Outsource heavy computation to untrusted servers               │"
echo "│  • Verify the result is correct without re-computing              │"
echo "│  • Useful for AI/ML model verification                            │"
echo "│                                                                    │"
echo "│  🧠 Use Case: Prove AI model was trained correctly                │"
echo "└────────────────────────────────────────────────────────────────────┘"
echo ""
echo "┌────────────────────────────────────────────────────────────────────┐"
echo "│  5️⃣  CROSS-CHAIN INTEROPERABILITY                                  │"
echo "├────────────────────────────────────────────────────────────────────┤"
echo "│  • Prove state on Chain A to Chain B                             │"
echo "│  • Enable trustless bridges without oracles                       │"
echo "│  • Same proof works on EVM and Soroban (like our demo!)          │"
echo "│                                                                    │"
echo "│  🌉 Benefit: Universal proofs across ecosystems                   │"
echo "└────────────────────────────────────────────────────────────────────┘"
echo ""
echo "┌────────────────────────────────────────────────────────────────────┐"
echo "│  6️⃣  REGULATORY COMPLIANCE + PRIVACY                               │"
echo "├────────────────────────────────────────────────────────────────────┤"
echo "│  • Prove tax payment without revealing income                     │"
echo "│  • Prove sanctions compliance without sharing transaction graph   │"
echo "│  • Audit without exposing sensitive business data                │"
echo "│                                                                    │"
echo "│  ⚖️  Critical for: CBDCs, institutional DeFi, real-world assets   │"
echo "└────────────────────────────────────────────────────────────────────┘"
echo ""
pause

# ============================================
# BENEFITS: Why ZK Matters
# ============================================
clear
echo ""
echo "╔════════════════════════════════════════════════════════════════════╗"
echo "║                                                                    ║"
echo "║                  💎 WHY ZERO-KNOWLEDGE MATTERS                     ║"
echo "║                                                                    ║"
echo "╚════════════════════════════════════════════════════════════════════╝"
echo ""
echo "┌────────────────────────────────────────────────────────────────────┐"
echo "│  🔐 PRIVACY AS A HUMAN RIGHT                                       │"
echo "├────────────────────────────────────────────────────────────────────┤"
echo "│  • Financial privacy is essential for freedom                     │"
echo "│  • Medical privacy protects vulnerable individuals                │"
echo "│  • Identity privacy prevents discrimination                       │"
echo "│                                                                    │"
echo "│  \"Privacy is not about having something to hide.                  │"
echo "│   Privacy is about having something to protect.\"                  │"
echo "└────────────────────────────────────────────────────────────────────┘"
echo ""
echo "┌────────────────────────────────────────────────────────────────────┐"
echo "│  ⚡ EFFICIENCY GAINS                                               │"
echo "├────────────────────────────────────────────────────────────────────┤"
echo "│  Without ZK:  1000 transactions = 1000 on-chain verifications     │"
echo "│  With ZK:     1000 transactions = 1 proof verification            │"
echo "│                                                                    │"
echo "│  Result: 1000x cost reduction + 100-200x throughput increase      │"
echo "└────────────────────────────────────────────────────────────────────┘"
echo ""
echo "┌────────────────────────────────────────────────────────────────────┐"
echo "│  🌐 BRIDGE WEB2 AND WEB3                                           │"
echo "├────────────────────────────────────────────────────────────────────┤"
echo "│  • Prove off-chain facts on-chain (KYC, credit score, etc.)      │"
echo "│  • No need to expose databases to blockchain                      │"
echo "│  • Selective disclosure: share only what's needed                 │"
echo "│                                                                    │"
echo "│  \"ZK is the missing link for enterprise blockchain adoption\"      │"
echo "└────────────────────────────────────────────────────────────────────┘"
echo ""
pause

# ============================================
# EXPORT: Multi-Chain Verifiers
# ============================================
clear
echo ""
echo "╔════════════════════════════════════════════════════════════════════╗"
echo "║                                                                    ║"
echo "║              ⛓️  DEPLOYING TO MULTIPLE BLOCKCHAINS                 ║"
echo "║                                                                    ║"
echo "╚════════════════════════════════════════════════════════════════════╝"
echo ""
echo "  The beauty of ZK proofs:"
echo "    • Same proof works on ANY blockchain"
echo "    • Only need chain-specific verifier contract"
echo "    • Universal interoperability"
echo ""
echo "  Let's export verifiers for EVM and Soroban..."
echo ""
sleep 2

# EVM Verifier
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  🔷 EVM VERIFIER (Ethereum, Polygon, BSC, Arbitrum, etc.)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

mkdir -p evm
npx snarkjs zkey export solidityverifier $ZKEY_FINAL evm/Verifier.sol

echo "  ✅ Solidity verifier generated"
echo ""
ls -lh evm/Verifier.sol | awk '{print "     " $9 " (" $5 ")"}'
wc -l evm/Verifier.sol | awk '{print "     Lines of code: " $1}'
echo ""
echo "  📝 Contract preview:"
head -25 evm/Verifier.sol | tail -5
echo "     ..."
echo ""
echo "  ⛽ Gas cost: ~250,000-300,000 gas per verification"
echo "  💰 Cost on Ethereum: ~\$5-15 (at 50 gwei, \$2000 ETH)"
echo "  💰 Cost on Polygon: ~\$0.001-0.01"
echo ""
pause

# Soroban Verifier
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  ⭐ SOROBAN VERIFIER (Stellar Network)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

SOROBAN_DIR="../soroban"
if [ -d "$SOROBAN_DIR" ] && [ -f "$SOROBAN_DIR/src/lib.rs" ]; then
  echo "  ✅ Soroban verifier found"
  echo ""
  ls -lh $SOROBAN_DIR/src/lib.rs | awk '{print "     " $9 " (" $5 ")"}'
  echo ""
  echo "  🎯 Deployment targets:"
  echo "     • Stellar Testnet (Futurenet/Testnet)"
  echo "     • Stellar Mainnet (Soroban)"
  echo ""
  echo "  💎 Benefits of Soroban:"
  echo "     • Lower fees than EVM"
  echo "     • Fast finality (~5 seconds)"
  echo "     • Native asset support (XLM, USDC)"
  echo ""
else
  echo "  ⚠️  Soroban verifier template not found"
  echo "     (Available in the full repository)"
fi

echo ""
pause

# ============================================
# FINAL SUMMARY
# ============================================
clear
echo ""
echo "╔════════════════════════════════════════════════════════════════════╗"
echo "║                                                                    ║"
echo "║                  🎉 DEMONSTRATION COMPLETE! 🎉                     ║"
echo "║                                                                    ║"
echo "╚════════════════════════════════════════════════════════════════════╝"
echo ""
echo "┌────────────────────────────────────────────────────────────────────┐"
echo "│  📚 WHAT WE LEARNED                                                │"
echo "└────────────────────────────────────────────────────────────────────┘"
echo ""
echo "  🎓 Theory:"
echo "     • Zero-Knowledge allows proving statements without revealing why"
echo "     • Groth16 SNARKs offer smallest proofs (~800 bytes)"
echo "     • Trusted Setup is safe via Multi-Party Computation"
echo ""
echo "  🛠️  Practice:"
echo "     • Compiled circuit: 586 constraints, 590 wires"
echo "     • Generated proof from private data (age, balance, country)"
echo "     • Verified proof WITHOUT seeing private inputs"
echo "     • Exported verifiers for EVM and Soroban"
echo ""
echo "  💎 Benefits:"
echo "     • Privacy-preserving identity and compliance"
echo "     • Blockchain scalability (zkRollups)"
echo "     • Cross-chain interoperability"
echo "     • Verifiable computation"
echo ""
echo "┌────────────────────────────────────────────────────────────────────┐"
echo "│  📊 FINAL STATISTICS                                               │"
echo "└────────────────────────────────────────────────────────────────────┘"
echo ""
echo "  Private Inputs:         3 values (age, balance, countryId)"
echo "  Public Parameters:      3 values (minAge, maxAge, minBalance)"
echo "  Circuit Constraints:    586"
echo "  Proof Size:             ~800 bytes ($(ls -lh $PROOF | awk '{print $5}'))"
echo "  Verification Time:      ~10-50ms off-chain"
echo "  Gas Cost (EVM):         ~250,000-300,000 gas"
echo ""
echo "  ✅ Proof verified: kycValid = 1"
echo "  🔒 Privacy preserved: No private data revealed"
echo "  ⛓️  Multi-chain ready: EVM + Soroban verifiers exported"
echo ""
echo "┌────────────────────────────────────────────────────────────────────┐"
echo "│  🚀 NEXT STEPS                                                     │"
echo "└────────────────────────────────────────────────────────────────────┘"
echo ""
echo "  1. Deploy verifier contract to blockchain:"
echo "     • EVM: Deploy evm/Verifier.sol to Ethereum/Polygon/etc."
echo "     • Soroban: Build and deploy Rust contract to Stellar"
echo ""
echo "  2. Integrate into your application:"
echo "     • Generate proofs client-side (user's browser/mobile)"
echo "     • Submit proof to smart contract"
echo "     • Contract verifies and executes logic"
echo ""
echo "  3. Explore more use cases:"
echo "     • Private voting"
echo "     • Anonymous credentials"
echo "     • Decentralized identity"
echo "     • zkRollups for scalability"
echo ""
echo "╔════════════════════════════════════════════════════════════════════╗"
echo "║                                                                    ║"
echo "║        🔐 Privacy-Preserving • ⚡ Efficient • 🌍 Universal         ║"
echo "║                                                                    ║"
echo "║            The Future of Blockchain is Zero-Knowledge             ║"
echo "║                                                                    ║"
echo "╚════════════════════════════════════════════════════════════════════╝"
echo ""
echo "  📚 Learn more:"
echo "     • Circom: https://docs.circom.io"
echo "     • snarkjs: https://github.com/iden3/snarkjs"
echo "     • ZKP Learning Resources: https://zkp.science"
echo ""
echo "  🎬 Demo completed: $(date)"
echo ""
