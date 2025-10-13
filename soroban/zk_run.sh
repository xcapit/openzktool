#!/bin/bash
set -e

CONTRACT_ID="CCCIQQESAE5ILIGWBDDS7BEH4TPNBOJQXGBOXRCANMPFU6O4KRU6VLHG"
ACCOUNT="futurenet-key"
NETWORK="futurenet"
CONVERTER="soroban/zk_convert.js"

echo "🚀 Ejecutando pipeline ZK → Soroban (v3 Full Crypto)"
echo "--------------------------------------------------------"

PROOF_FILE="../circuits/artifacts/proof.json"
VKEY_FILE="../circuits/artifacts/kyc_transfer_vkey.json"

if [ ! -f "$PROOF_FILE" ]; then
  echo "❌ Error: no se encontró $PROOF_FILE"
  exit 1
fi
if [ ! -f "$VKEY_FILE" ]; then
  echo "❌ Error: no se encontró $VKEY_FILE"
  exit 1
fi
if [ ! -f "$CONVERTER" ]; then
  echo "❌ Error: no se encontró $CONVERTER"
  exit 1
fi

echo "📝 Convirtiendo proof + vkey a formato Soroban v3..."
node "$CONVERTER" "$PROOF_FILE" "$VKEY_FILE"

echo "📦 Argumentos generados:"
jq . args.json

echo ""
read -p "¿Deseás enviar la transacción on-chain? (y/N): " choice
SEND_FLAG="--send=no"
if [[ "$choice" == "y" || "$choice" == "Y" ]]; then
  SEND_FLAG="--send=yes"
  echo "🚀 Ejecutando con envío on-chain..."
else
  echo "🧪 Ejecutando en modo simulación..."
fi
echo ""

stellar contract invoke \
  --id "$CONTRACT_ID" \
  --source-account "$ACCOUNT" \
  --network "$NETWORK" \
  $SEND_FLAG \
  -- \
  verify_proof \
  --proof "$(jq -c .proof args.json)" \
  --vk "$(jq -c .vk args.json)" \
  --public_inputs "$(jq -c .public_inputs args.json)"

echo ""
echo "✅ Ejecución completada."
