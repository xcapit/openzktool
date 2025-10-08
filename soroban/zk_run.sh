#!/bin/bash
set -e

CONTRACT_ID="CCCIQQESAE5ILIGWBDDS7BEH4TPNBOJQXGBOXRCANMPFU6O4KRU6VLHG"
ACCOUNT="futurenet-key"
NETWORK="futurenet"
CONVERTER="soroban/zk_convert.js"

echo "🚀 Ejecutando pipeline ZK → Soroban"
echo "-----------------------------------"

if [ ! -f "calldata.json" ]; then
  echo "❌ Error: no se encontró calldata.json en $(pwd)"
  exit 1
fi
if [ ! -f "$CONVERTER" ]; then
  echo "❌ Error: no se encontró $CONVERTER"
  exit 1
fi

node "$CONVERTER" calldata.json > args.json

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
  verify_struct \
  --a "$(jq -c .a args.json)" \
  --b "$(jq -c .b args.json)" \
  --c "$(jq -c .c args.json)" \
  --input "$(jq -c .input args.json)"

echo ""
echo "✅ Ejecución completada."
