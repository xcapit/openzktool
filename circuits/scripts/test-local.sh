#!/bin/bash
set -e

echo "🧩 Compiling circuit..."
circom range_circuit.circom --r1cs --wasm --sym

echo "🔧 Calculating witness..."
npx snarkjs wtns calculate range_circuit_js/range_circuit.wasm input.json witness.wtns

echo "🪄 Generating proof..."
npx snarkjs groth16 prove range_setup.zkey witness.wtns proof.json public.json

echo "🔍 Verifying proof..."
npx snarkjs groth16 verify verification_key.json public.json proof.json
