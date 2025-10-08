#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")"   # Ir al directorio actual del script (por ejemplo circuits/artifacts)
mkdir -p artifacts
cd artifacts

echo "⚙️  Starting Powers of Tau ceremony..."
rm -f pot12_*.ptau kyc_transfer_*.zkey || true

# 1️⃣ Crear Powers of Tau
snarkjs powersoftau new bn128 12 pot12_0000.ptau -v
snarkjs powersoftau contribute pot12_0000.ptau pot12_final.ptau --name="First contribution" -v <<<'entropy_for_demo'

# 2️⃣ Generar ZKey setup
snarkjs groth16 setup kyc_transfer_js/kyc_transfer.r1cs pot12_final.ptau kyc_transfer_0000.zkey

# 3️⃣ Contribuir al zkey
snarkjs zkey contribute kyc_transfer_0000.zkey kyc_transfer_final.zkey --name="Final setup" -v <<<'entropy_2'

# 4️⃣ Exportar clave de verificación
snarkjs zkey export verificationkey kyc_transfer_final.zkey kyc_transfer_vkey.json

echo "✅ ZKey setup complete!"
ls -lh kyc_transfer_final.zkey kyc_transfer_vkey.json pot12_final.ptau
