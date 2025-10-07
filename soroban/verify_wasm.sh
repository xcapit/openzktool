#!/bin/bash
WASM="target/wasm32-unknown-unknown/release/soroban_groth16_verifier.wasm"

if [ ! -f "$WASM" ]; then
  echo "❌ No se encontró el archivo wasm en $WASM"
  exit 1
fi

echo "✅ Tamaño del binario:"
ls -lh "$WASM"

echo -e "\n🔍 Verificando imports y features..."
wasm-objdump -x "$WASM" | grep -E "import|reference-types" || echo "Sin reference-types activas ✅"

echo -e "\n📦 Verificando símbolos de std (debería estar vacío):"
wasm-nm "$WASM" | grep std || echo "Sin símbolos de std ✅"

echo -e "\n✅ Verificación completada correctamente."
