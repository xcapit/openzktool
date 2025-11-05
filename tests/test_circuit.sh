#!/bin/bash

# test_circuit.sh
#
# Tests Circom circuit compilation, witness generation, and proof verification.
# This validates the ZK circuit logic without requiring blockchain deployment.
#
# Usage: ./tests/test_circuit.sh [circuit_name]
# Example: ./tests/test_circuit.sh kyc_transfer

set -e

CIRCUIT_NAME="${1:-kyc_transfer}"
CIRCUITS_DIR="circuits"
BUILD_DIR="$CIRCUITS_DIR/build"
TEST_DIR="tests/fixtures"

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Circuit Test Suite${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "Circuit: $CIRCUIT_NAME"
echo "Build dir: $BUILD_DIR"
echo ""

# Check if circuit exists
if [ ! -f "$CIRCUITS_DIR/${CIRCUIT_NAME}.circom" ]; then
  echo -e "${RED}Error: Circuit not found: $CIRCUITS_DIR/${CIRCUIT_NAME}.circom${NC}"
  exit 1
fi

# Test 1: Compile circuit
echo -e "${YELLOW}[1/5] Compiling circuit...${NC}"
cd $CIRCUITS_DIR

circom ${CIRCUIT_NAME}.circom \
  --r1cs \
  --wasm \
  --sym \
  --output build/

if [ $? -eq 0 ]; then
  echo -e "${GREEN}      Compilation successful${NC}"
else
  echo -e "${RED}      Compilation failed${NC}"
  exit 1
fi

cd ..

# Test 2: Check constraint count
echo ""
echo -e "${YELLOW}[2/5] Analyzing constraints...${NC}"
CONSTRAINT_COUNT=$(snarkjs r1cs info ${BUILD_DIR}/${CIRCUIT_NAME}.r1cs | grep "# of Constraints" | awk '{print $4}')
echo "      Constraints: $CONSTRAINT_COUNT"

if [ "$CONSTRAINT_COUNT" -gt 10000 ]; then
  echo -e "${YELLOW}      Warning: High constraint count (>10k)${NC}"
fi

# Test 3: Generate witness with valid inputs
echo ""
echo -e "${YELLOW}[3/5] Testing witness generation (valid inputs)...${NC}"

# Create valid test input
cat > ${BUILD_DIR}/test_input_valid.json << EOF
{
  "age": 25,
  "balance": 150,
  "country": 11,
  "minAge": 18,
  "maxAge": 99,
  "minBalance": 50,
  "allowedCountries": [11, 1, 5]
}
EOF

node ${BUILD_DIR}/${CIRCUIT_NAME}_js/generate_witness.js \
  ${BUILD_DIR}/${CIRCUIT_NAME}_js/${CIRCUIT_NAME}.wasm \
  ${BUILD_DIR}/test_input_valid.json \
  ${BUILD_DIR}/witness_valid.wtns

if [ $? -eq 0 ]; then
  echo -e "${GREEN}      Witness generated successfully${NC}"
else
  echo -e "${RED}      Witness generation failed${NC}"
  exit 1
fi

# Test 4: Generate and verify proof (valid case)
echo ""
echo -e "${YELLOW}[4/5] Generating and verifying proof (valid case)...${NC}"

# Check if proving key exists
if [ ! -f "${BUILD_DIR}/${CIRCUIT_NAME}_final.zkey" ]; then
  echo -e "${YELLOW}      Proving key not found. Running trusted setup...${NC}"
  cd $CIRCUITS_DIR
  bash scripts/prepare_and_setup.sh
  cd ..
fi

snarkjs groth16 prove \
  ${BUILD_DIR}/${CIRCUIT_NAME}_final.zkey \
  ${BUILD_DIR}/witness_valid.wtns \
  ${BUILD_DIR}/proof_valid.json \
  ${BUILD_DIR}/public_valid.json

if [ $? -ne 0 ]; then
  echo -e "${RED}      Proof generation failed${NC}"
  exit 1
fi

# Verify the proof
snarkjs groth16 verify \
  ${BUILD_DIR}/verification_key.json \
  ${BUILD_DIR}/public_valid.json \
  ${BUILD_DIR}/proof_valid.json

if [ $? -eq 0 ]; then
  echo -e "${GREEN}      Proof verified successfully${NC}"
else
  echo -e "${RED}      Proof verification failed${NC}"
  exit 1
fi

# Check public output
KYC_VALID=$(cat ${BUILD_DIR}/public_valid.json | jq -r '.[0]')
if [ "$KYC_VALID" = "1" ]; then
  echo -e "${GREEN}      KYC output: VALID (as expected)${NC}"
else
  echo -e "${RED}      KYC output: INVALID (expected VALID)${NC}"
  exit 1
fi

# Test 5: Invalid inputs test
echo ""
echo -e "${YELLOW}[5/5] Testing with invalid inputs...${NC}"

# Create invalid test input (underage)
cat > ${BUILD_DIR}/test_input_invalid.json << EOF
{
  "age": 15,
  "balance": 150,
  "country": 11,
  "minAge": 18,
  "maxAge": 99,
  "minBalance": 50,
  "allowedCountries": [11, 1, 5]
}
EOF

node ${BUILD_DIR}/${CIRCUIT_NAME}_js/generate_witness.js \
  ${BUILD_DIR}/${CIRCUIT_NAME}_js/${CIRCUIT_NAME}.wasm \
  ${BUILD_DIR}/test_input_invalid.json \
  ${BUILD_DIR}/witness_invalid.wtns

snarkjs groth16 prove \
  ${BUILD_DIR}/${CIRCUIT_NAME}_final.zkey \
  ${BUILD_DIR}/witness_invalid.wtns \
  ${BUILD_DIR}/proof_invalid.json \
  ${BUILD_DIR}/public_invalid.json

snarkjs groth16 verify \
  ${BUILD_DIR}/verification_key.json \
  ${BUILD_DIR}/public_invalid.json \
  ${BUILD_DIR}/proof_invalid.json

# Check that KYC is invalid
KYC_INVALID=$(cat ${BUILD_DIR}/public_invalid.json | jq -r '.[0]')
if [ "$KYC_INVALID" = "0" ]; then
  echo -e "${GREEN}      KYC output: INVALID (as expected for underage)${NC}"
else
  echo -e "${RED}      KYC output: VALID (expected INVALID)${NC}"
  exit 1
fi

# Cleanup
echo ""
echo -e "${YELLOW}Cleaning up test artifacts...${NC}"
rm -f ${BUILD_DIR}/test_input_*.json
rm -f ${BUILD_DIR}/witness_*.wtns
rm -f ${BUILD_DIR}/proof_*.json
rm -f ${BUILD_DIR}/public_*.json

# Summary
echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}All circuit tests passed!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "Summary:"
echo "  - Circuit compiled successfully"
echo "  - Constraint count: $CONSTRAINT_COUNT"
echo "  - Valid inputs: proof verified, KYC = valid"
echo "  - Invalid inputs: proof verified, KYC = invalid"
echo ""
echo "Circuit is ready for integration testing."
