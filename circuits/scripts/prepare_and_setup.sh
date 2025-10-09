#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

CIRCUIT=kyc_transfer.circom
OUT=artifacts
PTAU1=$OUT/pot12_final.ptau
PTAU2=$OUT/pot12_final_phase2.ptau
R1CS=$OUT/kyc_transfer.r1cs
WASM=$OUT/kyc_transfer.wasm
ZKEY1=$OUT/kyc_transfer_0000.zkey
ZKEY2=$OUT/kyc_transfer_final.zkey
VKEY=$OUT/kyc_transfer_vkey.json

echo "🚀 Starting full setup for kyc_transfer..."

# 1️⃣ Validate existence of ptau
if [ ! -f "$PTAU1" ]; then
  echo "❌ $PTAU1 not found. Generate it first with:"
  echo "   snarkjs powersoftau new bn128 12 pot12_0000.ptau -v"
  echo "   snarkjs powersoftau contribute pot12_0000.ptau $PTAU1 -v"
  exit 1
fi

# 2️⃣ Compile circuit (skip if .r1cs already exists)
if [ ! -f "$R1CS" ]; then
  echo "🔧 Compiling circuit: $CIRCUIT..."
  circom $CIRCUIT --r1cs --wasm --sym --output $OUT
  echo "✅ Circuit compiled: $R1CS"
else
  echo "ℹ️ Using existing $R1CS"
fi

# 3️⃣ Prepare phase2 (skip if already exists)
if [ ! -f "$PTAU2" ]; then
  echo "⚙️ Preparing Phase 2 Powers of Tau..."
  snarkjs powersoftau prepare phase2 $PTAU1 $PTAU2 -v
  echo "✅ Phase 2 prepared: $PTAU2"
else
  echo "ℹ️ Using existing $PTAU2"
fi

# 4️⃣ Wait to ensure file is flushed
sleep 2

# 5️⃣ Setup Groth16 (skip if final zkey exists)
if [ ! -f "$ZKEY2" ]; then
  echo "🧩 Running Groth16 setup..."
  snarkjs groth16 setup $R1CS $PTAU2 $ZKEY1
  sleep 2

  # 6️⃣ Contribute to zkey
  echo "✍️ Contributing to zkey..."
  echo "xcapit_entropy_$(date +%s)" | snarkjs zkey contribute $ZKEY1 $ZKEY2 --name="final_xcapit" -v
  sleep 2
  echo "✅ ZKey generated: $ZKEY2"
else
  echo "ℹ️ Using existing $ZKEY2"
fi

# 7️⃣ Export verification key
echo "📜 Exporting verification key..."
snarkjs zkey export verificationkey $ZKEY2 $VKEY

echo ""
echo "✅ Setup complete!"
echo "📁 Files generated:"
ls -lh $PTAU2 $ZKEY1 $ZKEY2 $VKEY
