#!/bin/bash

# Quick proof generation and verification script
# This is used by automated tests

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

CIRCUIT_NAME="kyc_transfer"
CIRCUIT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BUILD_DIR="$CIRCUIT_DIR/build"
ROOT_DIR="$(cd "$CIRCUIT_DIR/.." && pwd)"

cd "$CIRCUIT_DIR"

# Check if circuit is compiled
if [ ! -f "$BUILD_DIR/${CIRCUIT_NAME}_final.zkey" ]; then
    echo -e "${RED}Error: Circuit not compiled. Run 'npm run setup' first.${NC}"
    exit 1
fi

# Check if test input exists
if [ ! -f "$BUILD_DIR/test_input.json" ]; then
    echo -e "${YELLOW}Creating test input...${NC}"
    cat > "$BUILD_DIR/test_input.json" << EOF
{
  "age": "25",
  "balance": "150",
  "country": "11",
  "minAge": "18",
  "maxAge": "99",
  "minBalance": "50",
  "allowedCountries": ["11", "1", "5", "0", "0", "0", "0", "0", "0", "0"]
}
EOF
fi

# Generate witness
echo -e "${YELLOW}Generating witness...${NC}"
node "$BUILD_DIR/${CIRCUIT_NAME}_js/generate_witness.js" \
    "$BUILD_DIR/${CIRCUIT_NAME}_js/${CIRCUIT_NAME}.wasm" \
    "$BUILD_DIR/test_input.json" \
    "$BUILD_DIR/test_witness.wtns"

# Generate proof
echo -e "${YELLOW}Generating proof...${NC}"
snarkjs groth16 prove "$BUILD_DIR/${CIRCUIT_NAME}_final.zkey" \
    "$BUILD_DIR/test_witness.wtns" \
    "$BUILD_DIR/test_proof.json" \
    "$BUILD_DIR/test_public.json"

# Verify proof
echo -e "${YELLOW}Verifying proof...${NC}"
snarkjs groth16 verify "$BUILD_DIR/verification_key.json" \
    "$BUILD_DIR/test_public.json" \
    "$BUILD_DIR/test_proof.json"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}[INFO]  snarkJS: OK!${NC}"
else
    echo -e "${RED}Verification failed${NC}"
    exit 1
fi

# Cleanup
rm -f "$BUILD_DIR/test_witness.wtns"

echo -e "${GREEN}✓ Proof generation and verification complete${NC}"
