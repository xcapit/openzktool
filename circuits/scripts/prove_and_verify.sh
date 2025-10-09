#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

OUT=artifacts
CIRCUIT=kyc_transfer
WASM=$OUT/${CIRCUIT}.wasm
ZKEY=$OUT/${CIRCUIT}_final.zkey
VKEY=$OUT/${CIRCUIT}_vkey.json
INPUT=$OUT/input.json
WITNESS=$OUT/witness.wtns
PROOF=$OUT/proof.json
PUBLIC=$OUT/public.json

echo "🎬 Starting end-to-end proof generation for $CIRCUIT..."
echo "--------------------------------------------------------"

# 1️⃣ Validate required files
for f in "$WASM" "$ZKEY" "$VKEY"; do
  if [ ! -f "$f" ]; then
    echo "❌ Missing required file: $f"
    exit 1
  fi
done

# 2️⃣ Create sample input (you can modify these)
echo "🧩 Creating sample input..."
cat > $INPUT <<'JSON'
{
  "age": 25,
  "minAge": 18,
  "maxAge": 99,
  "balance": 150,
  "minBalance": 50,
  "countryId": 32
}
JSON
echo "✅ Input file created: $INPUT"

# 3️⃣ Generate witness
echo "🧮 Generating witness..."
node $OUT/${CIRCUIT}_js/generate_witness.js $WASM $INPUT $WITNESS
echo "✅ Witness generated: $WITNESS"

# 4️⃣ Generate proof
echo "🔏 Generating zero-knowledge proof..."
snarkjs groth16 prove $ZKEY $WITNESS $PROOF $PUBLIC
echo "✅ Proof generated: $PROOF"
echo "✅ Public inputs: $PUBLIC"

# 5️⃣ Verify proof
echo "🧠 Verifying proof..."
snarkjs groth16 verify $VKEY $PUBLIC $PROOF && echo "✅ Proof verified successfully!" || echo "❌ Verification failed!"

# 6️⃣ Export Solidity verifier
echo "🏗️ Exporting Solidity verifier..."
mkdir -p evm
snarkjs zkey export solidityverifier $ZKEY evm/Verifier.sol
echo "✅ Solidity verifier exported to evm/Verifier.sol"

echo ""
echo "🎯 All done!"
echo "Artifacts generated:"
ls -lh $OUT/$CIRCUIT* $OUT/*.json evm/Verifier.sol 2>/dev/null || true
