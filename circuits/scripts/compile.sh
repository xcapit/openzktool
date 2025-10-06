#!/bin/bash

set -e

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔧 Compiling Circom Circuit"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check if circom is installed
if ! command -v circom &> /dev/null; then
    echo "❌ Error: circom not found"
    echo "Install with: npm install -g circom"
    exit 1
fi

echo "📝 Input file: simple_proof.circom"
echo ""
echo "⚙️  Compiling..."

# Compile circuit
circom simple_proof.circom --r1cs --wasm --sym -o .

echo ""
echo "✅ Compilation successful!"
echo ""

# Display circuit info
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 Circuit Statistics"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

snarkjs r1cs info simple_proof.r1cs

echo ""
echo "📁 Generated files:"
echo "   • simple_proof.r1cs      (Constraint system)"
echo "   • simple_proof.sym       (Symbol table)"
echo "   • simple_proof_js/       (WASM witness generator)"
echo ""
echo "✅ Ready for key generation (run ./scripts/generate_keys.sh)"
echo ""
