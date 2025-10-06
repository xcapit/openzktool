#!/bin/bash

set -e

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔑 Generating Proving & Verification Keys"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "⚠️  NOTE: This uses a simple trusted setup for POC."
echo "    Production requires MPC ceremony for security."
echo ""
echo "⏳ This process takes approximately 2 minutes..."
echo ""

# Check if snarkjs is installed
if ! command -v snarkjs &> /dev/null; then
    echo "❌ Error: snarkjs not found"
    echo "Install with: npm install -g snarkjs"
    exit 1
fi

# Check if circuit is compiled
if [ ! -f "simple_proof.r1cs" ]; then
    echo "❌ Error: simple_proof.r1cs not found"
    echo "Run ./scripts/compile.sh first"
    exit 1
fi

# Phase 1: Powers of Tau (Universal Setup)
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Phase 1: Powers of Tau Ceremony"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo "1️⃣  Creating initial Powers of Tau..."
snarkjs powersoftau new bn128 12 pot12_0000.ptau -v

echo ""
echo "2️⃣  Contributing randomness (contribution 1)..."
snarkjs powersoftau contribute pot12_0000.ptau pot12_0001.ptau \
    --name="POC First Contribution" \
    --entropy="$(date +%s)" \
    -v

echo ""
echo "3️⃣  Preparing for Phase 2..."
snarkjs powersoftau prepare phase2 pot12_0001.ptau pot12_final.ptau -v

echo ""
echo "✅ Phase 1 complete!"

# Phase 2: Circuit-Specific Setup
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Phase 2: Circuit-Specific Setup"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo "4️⃣  Generating initial zkey..."
snarkjs groth16 setup simple_proof.r1cs pot12_final.ptau simple_proof_0000.zkey

echo ""
echo "5️⃣  Contributing to zkey (contribution 2)..."
snarkjs zkey contribute simple_proof_0000.zkey simple_proof_final.zkey \
    --name="POC Second Contribution" \
    --entropy="$(date +%s)" \
    -v

echo ""
echo "6️⃣  Exporting verification key..."
snarkjs zkey export verificationkey simple_proof_final.zkey verification_key.json

echo ""
echo "✅ Phase 2 complete!"

# Display verification key info
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 Verification Key (first 20 lines)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
head -n 20 verification_key.json
echo "..."

# Cleanup intermediate files
echo ""
echo "🧹 Cleaning up intermediate files..."
rm -f pot12_0000.ptau pot12_0001.ptau simple_proof_0000.zkey

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Key Generation Complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📁 Generated files:"
echo "   • simple_proof_final.zkey    (Proving key - ~5MB)"
echo "   • verification_key.json      (Verification key - ~1KB)"
echo "   • pot12_final.ptau           (Powers of Tau - kept for reference)"
echo ""
echo "🚀 Ready to generate proofs! Run: npm test"
echo ""
