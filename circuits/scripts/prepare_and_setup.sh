#!/bin/bash

# Circuit compilation and trusted setup script
# This script compiles the Circom circuit and performs a trusted setup

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Circuit Compilation and Trusted Setup${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

CIRCUIT_NAME="kyc_transfer"
CIRCUIT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BUILD_DIR="$CIRCUIT_DIR/build"

cd "$CIRCUIT_DIR"

# Check dependencies
echo -e "${YELLOW}Checking dependencies...${NC}"

if ! command -v circom &> /dev/null; then
    echo -e "${RED}Error: circom not found${NC}"
    echo ""
    echo -e "${YELLOW}Circom must be installed manually (requires Rust):${NC}"
    echo ""
    echo "1. Install Rust (if not installed):"
    echo "   curl --proto '=https' --tlsv1.2 https://sh.rustup.rs -sSf | sh"
    echo "   source \$HOME/.cargo/env"
    echo ""
    echo "2. Install Circom:"
    echo "   git clone https://github.com/iden3/circom.git"
    echo "   cd circom"
    echo "   cargo build --release"
    echo "   cargo install --path circom"
    echo ""
    echo "3. Verify installation:"
    echo "   circom --version"
    echo ""
    echo -e "${CYAN}Full guide: ./INSTALL.md${NC}"
    exit 1
fi

if ! command -v snarkjs &> /dev/null; then
    echo -e "${YELLOW}Installing snarkjs...${NC}"
    npm install -g snarkjs
fi

echo -e "${GREEN}✓ Dependencies OK${NC}"
echo ""

# Create build directory
mkdir -p "$BUILD_DIR"

# Step 1: Compile circuit
echo -e "${YELLOW}[1/6] Compiling circuit...${NC}"
circom ${CIRCUIT_NAME}.circom \
    --r1cs \
    --wasm \
    --sym \
    --c \
    -l node_modules \
    --output "$BUILD_DIR"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Circuit compiled${NC}"
else
    echo -e "${RED}✗ Compilation failed${NC}"
    exit 1
fi

# Show circuit info
echo ""
echo -e "${YELLOW}Circuit statistics:${NC}"
snarkjs r1cs info "$BUILD_DIR/${CIRCUIT_NAME}.r1cs"
echo ""

# Step 2: Powers of Tau ceremony (Phase 1)
echo -e "${YELLOW}[2/6] Generating Powers of Tau...${NC}"
if [ ! -f "$BUILD_DIR/pot12_final.ptau" ]; then
    echo "  Starting new Powers of Tau ceremony..."
    snarkjs powersoftau new bn128 12 "$BUILD_DIR/pot12_0000.ptau" -v

    echo "  Contributing to ceremony..."
    snarkjs powersoftau contribute "$BUILD_DIR/pot12_0000.ptau" \
        "$BUILD_DIR/pot12_0001.ptau" \
        --name="First contribution" \
        -v -e="random entropy"

    echo "  Preparing phase 2..."
    snarkjs powersoftau prepare phase2 "$BUILD_DIR/pot12_0001.ptau" \
        "$BUILD_DIR/pot12_final.ptau" \
        -v

    # Cleanup intermediate files
    rm -f "$BUILD_DIR/pot12_0000.ptau" "$BUILD_DIR/pot12_0001.ptau"

    echo -e "${GREEN}✓ Powers of Tau generated${NC}"
else
    echo -e "${GREEN}✓ Using existing Powers of Tau${NC}"
fi
echo ""

# Step 3: Generate zkey (Phase 2)
echo -e "${YELLOW}[3/6] Generating proving key (Phase 2)...${NC}"
snarkjs groth16 setup "$BUILD_DIR/${CIRCUIT_NAME}.r1cs" \
    "$BUILD_DIR/pot12_final.ptau" \
    "$BUILD_DIR/${CIRCUIT_NAME}_0000.zkey"

echo -e "${GREEN}✓ Initial zkey generated${NC}"
echo ""

# Step 4: Contribute to Phase 2
echo -e "${YELLOW}[4/6] Contributing to Phase 2...${NC}"
snarkjs zkey contribute "$BUILD_DIR/${CIRCUIT_NAME}_0000.zkey" \
    "$BUILD_DIR/${CIRCUIT_NAME}_final.zkey" \
    --name="First contribution" \
    -v -e="random entropy for phase 2"

# Cleanup intermediate zkey
rm -f "$BUILD_DIR/${CIRCUIT_NAME}_0000.zkey"

echo -e "${GREEN}✓ Final proving key generated${NC}"
echo ""

# Step 5: Export verification key
echo -e "${YELLOW}[5/6] Exporting verification key...${NC}"
snarkjs zkey export verificationkey "$BUILD_DIR/${CIRCUIT_NAME}_final.zkey" \
    "$BUILD_DIR/verification_key.json"

echo -e "${GREEN}✓ Verification key exported${NC}"
echo ""

# Step 6: Export Solidity verifier (optional, for EVM compatibility check)
echo -e "${YELLOW}[6/6] Exporting Solidity verifier...${NC}"
snarkjs zkey export solidityverifier "$BUILD_DIR/${CIRCUIT_NAME}_final.zkey" \
    "$BUILD_DIR/Verifier.sol"

echo -e "${GREEN}✓ Solidity verifier exported${NC}"
echo ""

# Create test input
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

echo -e "${GREEN}✓ Test input created${NC}"
echo ""

# Test proof generation
echo -e "${YELLOW}Testing proof generation...${NC}"
node "$BUILD_DIR/${CIRCUIT_NAME}_js/generate_witness.js" \
    "$BUILD_DIR/${CIRCUIT_NAME}_js/${CIRCUIT_NAME}.wasm" \
    "$BUILD_DIR/test_input.json" \
    "$BUILD_DIR/test_witness.wtns"

snarkjs groth16 prove "$BUILD_DIR/${CIRCUIT_NAME}_final.zkey" \
    "$BUILD_DIR/test_witness.wtns" \
    "$BUILD_DIR/test_proof.json" \
    "$BUILD_DIR/test_public.json"

echo -e "${GREEN}✓ Test proof generated${NC}"

# Verify test proof
echo -e "${YELLOW}Verifying test proof...${NC}"
snarkjs groth16 verify "$BUILD_DIR/verification_key.json" \
    "$BUILD_DIR/test_public.json" \
    "$BUILD_DIR/test_proof.json"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Test proof verified!${NC}"
else
    echo -e "${RED}✗ Test proof verification failed${NC}"
    exit 1
fi

# Cleanup test files
rm -f "$BUILD_DIR/test_witness.wtns" \
      "$BUILD_DIR/test_proof.json" \
      "$BUILD_DIR/test_public.json"

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Setup Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "Generated files:"
echo "  Circuit WASM:     $BUILD_DIR/${CIRCUIT_NAME}_js/${CIRCUIT_NAME}.wasm"
echo "  Proving key:      $BUILD_DIR/${CIRCUIT_NAME}_final.zkey"
echo "  Verification key: $BUILD_DIR/verification_key.json"
echo "  Solidity contract: $BUILD_DIR/Verifier.sol"
echo ""
echo "Next steps:"
echo "  1. Generate proof:     node ../examples/private-transfer/generateProof.js"
echo "  2. Verify locally:     snarkjs groth16 verify ..."
echo "  3. Deploy to chain:    See deployment documentation"
echo ""
echo -e "${YELLOW}WARNING: This is a development setup. For production, use a${NC}"
echo -e "${YELLOW}multi-party trusted setup ceremony with many participants.${NC}"
echo ""
