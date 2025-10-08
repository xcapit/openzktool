#!/usr/bin/env bash
set -euo pipefail
CIRCUIT_DIR=circuits
OUT_DIR=artifacts
PTAU=pot12_final.ptau

mkdir -p ${OUT_DIR}

# 1) compile both circuits
circom ${CIRCUIT_DIR}/age_credential.circom --r1cs --wasm --sym -o ${OUT_DIR}
circom ${CIRCUIT_DIR}/balance_credential.circom --r1cs --wasm --sym -o ${OUT_DIR}

# 2) (if you don't have ptau) download or generate pot12_final.ptau (instructions in docs). Here we assume exists.

# 3) setup Groth16 (circuit-specific)
for CIR in age_credential balance_credential; do
  r1cs=${OUT_DIR}/${CIR}.r1cs
  zkey0=${OUT_DIR}/${CIR}_0000.zkey
  zkeyf=${OUT_DIR}/${CIR}_final.zkey

  snarkjs groth16 setup ${r1cs} ${PTAU} ${zkey0}
  echo "first contribution" | snarkjs zkey contribute ${zkey0} ${zkeyf} -v -e="entropy for dev"
  snarkjs zkey export verificationkey ${zkeyf} ${OUT_DIR}/${CIR}_vkey.json
done

echo "Compiled + setup complete. Artifacts in ${OUT_DIR}."
