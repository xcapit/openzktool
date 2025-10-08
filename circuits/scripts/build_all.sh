#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

OUT=artifacts
PTAU=pot12_final.ptau
mkdir -p $OUT

# Ensure Circom and SnarkJS exist
if ! command -v circom &> /dev/null; then
  echo "❌ circom not found. Install it with: npm install -g circom"
  exit 1
fi
if ! command -v snarkjs &> /dev/null; then
  echo "❌ snarkjs not found. Install it with: npm install -g snarkjs"
  exit 1
fi

# Generate ptau if missing
if [ ! -f "$PTAU" ]; then
  echo "⚠️ Missing $PTAU — generating a small one (for demo)"
  snarkjs powersoftau new bn128 12 $PTAU -v
  snarkjs powersoftau contribute $PTAU $PTAU -e="xcapit"
fi


# Prepare phase 2 (Groth16 setup requirement)
if [ ! -f "${OUT}/pot12_final_phase2.ptau" ]; then
  echo "⚙️ Preparing phase 2 from $PTAU..."
  snarkjs powersoftau prepare phase2 $PTAU ${OUT}/pot12_final_phase2.ptau -v
fi


for CIR in kyc_transfer; do
  echo "🔧 Building $CIR..."

  # Create subfolder before calling circom
  mkdir -p $OUT/${CIR}_js

  # Compile to wasm + r1cs + sym
 # circom ${CIR}.circom --r1cs --wasm --sym -o $OUT/${CIR}_js
 # circom ${CIR}.circom --r1cs --wasm --sym -o $OUT/${CIR}_js -l ../../node_modules/circomlib/circuits
  
 #  circom ../${CIR}.circom --r1cs --wasm --sym -o ../artifacts/${CIR}_js -l ../node_modules/circomlib/circuits

 circom ${CIR}.circom --r1cs --wasm --sym -o $OUT/${CIR}_js -l node_modules/circomlib/circuits

  # Move outputs to the artifacts root
  mv $OUT/${CIR}_js/${CIR}.r1cs $OUT/
  mv $OUT/${CIR}_js/${CIR}.sym $OUT/

  # detect wasm in subfolder
  if [ -f "$OUT/${CIR}_js/${CIR}.wasm" ]; then
  mv $OUT/${CIR}_js/${CIR}.wasm $OUT/
  else
   mv $OUT/${CIR}_js/${CIR}_js/${CIR}.wasm $OUT/
  fi
 

  # Setup Groth16
  #snarkjs groth16 setup $OUT/${CIR}.r1cs $PTAU $OUT/${CIR}_0000.zkey
  snarkjs groth16 setup $OUT/${CIR}.r1cs ${OUT}/pot12_final_phase2.ptau $OUT/${CIR}_0000.zkey
  snarkjs zkey contribute $OUT/${CIR}_0000.zkey $OUT/${CIR}_final.zkey -e="xcapit"
  snarkjs zkey export verificationkey $OUT/${CIR}_final.zkey $OUT/${CIR}_vkey.json

  echo "✅ $CIR compiled successfully."
done

echo "🎯 All circuits compiled successfully and ready in $OUT/"
