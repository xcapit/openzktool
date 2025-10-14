#!/bin/bash
set -e

# CONFIG
CONTRACT_ID="CCCIQQESAE5ILIGWBDDS7BEH4TPNBOJQXGBOXRCANMPFU6O4KRU6VLHG"
NETWORK="futurenet"
SOURCE="futurenet-key"

# Generamos los arrays compactos en formato JSON inline
A_JSON=$(jq -c '.a' args.json)
B_JSON=$(jq -c '.b' args.json)
C_JSON=$(jq -c '.c' args.json)
INPUT_JSON=$(jq -c '.input' args.json)

echo "🚀 Ejecutando contrato en $NETWORK con JSON inline..."
echo "🧩 a=$(echo $A_JSON | jq length) | b=$(echo $B_JSON | jq length)x$(echo $B_JSON | jq '.[0]|length') | c=$(echo $C_JSON | jq length) | input=$(echo $INPUT_JSON | jq length)"

stellar contract invoke \
  --id "$CONTRACT_ID" \
  --source-account "$SOURCE" \
  --network "$NETWORK" \
  --send=no \
  -- \
  verify_struct \
  --a "$A_JSON" \
  --b "$B_JSON" \
  --c "$C_JSON" \
  --input "$INPUT_JSON"
