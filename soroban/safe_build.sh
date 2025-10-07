#!/bin/bash
set -e

echo "🧹 Limpiando build anterior..."
cargo clean

echo "🔨 Compilando sin reference-types..."
RUSTFLAGS="-C target-feature=-reference-types,+mutable-globals,+nontrapping-fptoint" \
cargo build --target wasm32-unknown-unknown --release

echo "🔍 Verificando binario..."
if wasm-objdump -x target/wasm32-unknown-unknown/release/soroban_groth16_verifier.wasm | grep -q reference-types; then
  echo "❌ ERROR: el binario aún contiene 'reference-types'."
  exit 1
else
  echo "✅ Binario limpio (compatible con Soroban Futurenet)."
fi
