#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

OUT=artifacts

echo "🧪 Generating proof for kyc_transfer..."

# ✅ Corrected inputs for the updated circuit
cat > $OUT/input.json <<'JSON'
{
  "age": 25,
  "minAge": 18,
  "maxAge": 99,
  "balance": 100,
  "minBalance": 1,
  "countryId": 32
}
JSON

# ✅ Generate witness
node $OUT/kyc_transfer_js/generate_witness.js \
  $OUT/kyc_transfer_js/kyc_transfer.wasm \
  $OUT/input.json \
  $OUT/witness.wtns

# ✅ Generate proof
snarkjs groth16 prove $OUT/kyc_transfer_final.zkey $OUT/witness.wtns \
  $OUT/proof.json $OUT/public.json

# ✅ Verify proof
snarkjs groth16 verify $OUT/kyc_transfer_vkey.json $OUT/public.json $OUT/proof.json

echo "✅ Proof successfully generated and verified."
