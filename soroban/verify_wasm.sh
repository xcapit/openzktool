#!/bin/bash
WASM="target/wasm32-unknown-unknown/release/soroban_groth16_verifier.wasm"

if [ ! -f "$WASM" ]; then
  echo "❌ WASM file not found at $WASM"
  exit 1
fi

echo "✅ Binary size:"
ls -lh "$WASM"

echo -e "\n🔍 Verifying imports and features..."
wasm-objdump -x "$WASM" | grep -E "import|reference-types" || echo "No active reference-types ✅"

echo -e "\n📦 Verifying std symbols (should be empty):"
wasm-nm "$WASM" | grep std || echo "No std symbols ✅"

echo -e "\n✅ Verification completed successfully."
