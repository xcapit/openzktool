#!/bin/bash
set -e

echo "🧹 Cleaning previous build..."
cargo clean

echo "🔨 Building without reference-types..."
RUSTFLAGS="-C target-feature=-reference-types,+mutable-globals,+nontrapping-fptoint" \
cargo build --target wasm32-unknown-unknown --release

echo "🔍 Verifying binary..."
if wasm-objdump -x target/wasm32-unknown-unknown/release/soroban_groth16_verifier.wasm | grep -q reference-types; then
  echo "❌ ERROR: binary still contains 'reference-types'."
  exit 1
else
  echo "✅ Clean binary (compatible with Soroban Futurenet)."
fi
