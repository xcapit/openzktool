#!/bin/bash
set -e

CONTRACT_ID="CCCIQQESAE5ILIGWBDDS7BEH4TPNBOJQXGBOXRCANMPFU6O4KRU6VLHG"
ACCOUNT="futurenet-key"
NETWORK="futurenet"
CONVERTER="soroban/zk_convert.js"

echo "🚀 Running ZK → Soroban pipeline (v3 Full Crypto)"
echo "---------------------------------------------------"

PROOF_FILE="../circuits/artifacts/proof.json"
VKEY_FILE="../circuits/artifacts/kyc_transfer_vkey.json"

if [ ! -f "$PROOF_FILE" ]; then
  echo "❌ Error: $PROOF_FILE not found"
  exit 1
fi
if [ ! -f "$VKEY_FILE" ]; then
  echo "❌ Error: $VKEY_FILE not found"
  exit 1
fi
if [ ! -f "$CONVERTER" ]; then
  echo "❌ Error: $CONVERTER not found"
  exit 1
fi

echo "📝 Converting proof + vkey to Soroban v3 format..."
node "$CONVERTER" "$PROOF_FILE" "$VKEY_FILE"

echo "📦 Generated arguments:"
jq . args.json

echo ""
read -p "Do you want to send the transaction on-chain? (y/N): " choice
SEND_FLAG="--send=no"
if [[ "$choice" == "y" || "$choice" == "Y" ]]; then
  SEND_FLAG="--send=yes"
  echo "🚀 Running with on-chain submission..."
else
  echo "🧪 Running in simulation mode..."
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
echo "✅ Execution completed."
