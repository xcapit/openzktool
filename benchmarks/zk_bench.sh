#!/bin/bash

# OpenZKTool Benchmarking Script
# Tracks performance metrics for ZK proof generation and verification
# Usage: ./benchmarks/zk_bench.sh [--circuit CIRCUIT_NAME] [--iterations N] [--output FILE]

set -e

# Configuration
CIRCUIT_NAME="${CIRCUIT_NAME:-kyc_transfer}"
ITERATIONS="${ITERATIONS:-10}"
OUTPUT_DIR="benchmarks/results"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
OUTPUT_FILE="${OUTPUT_DIR}/bench_${CIRCUIT_NAME}_${TIMESTAMP}.json"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Parse arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --circuit)
      CIRCUIT_NAME="$2"
      shift 2
      ;;
    --iterations)
      ITERATIONS="$2"
      shift 2
      ;;
    --output)
      OUTPUT_FILE="$2"
      shift 2
      ;;
    --help)
      echo "Usage: $0 [OPTIONS]"
      echo ""
      echo "Options:"
      echo "  --circuit NAME       Circuit to benchmark (default: kyc_transfer)"
      echo "  --iterations N       Number of iterations (default: 10)"
      echo "  --output FILE        Output file (default: benchmarks/results/bench_CIRCUIT_TIMESTAMP.json)"
      echo "  --help              Show this help message"
      exit 0
      ;;
    *)
      echo "Unknown option: $1"
      echo "Use --help for usage information"
      exit 1
      ;;
  esac
done

# Create output directory
mkdir -p "$OUTPUT_DIR"

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}OpenZKTool Benchmark Suite${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "Circuit: $CIRCUIT_NAME"
echo "Iterations: $ITERATIONS"
echo "Output: $OUTPUT_FILE"
echo ""

# Initialize results
echo "{" > "$OUTPUT_FILE"
echo "  \"circuit\": \"$CIRCUIT_NAME\"," >> "$OUTPUT_FILE"
echo "  \"timestamp\": \"$(date -Iseconds)\"," >> "$OUTPUT_FILE"
echo "  \"iterations\": $ITERATIONS," >> "$OUTPUT_FILE"
echo "  \"metrics\": {" >> "$OUTPUT_FILE"

# Function to benchmark command
benchmark_command() {
  local name=$1
  local command=$2
  local iterations=$3

  echo -e "${YELLOW}Benchmarking: $name${NC}"

  local total_time=0
  local min_time=999999
  local max_time=0

  for i in $(seq 1 $iterations); do
    # Run command and measure time
    start=$(date +%s%N)
    eval "$command" > /dev/null 2>&1
    end=$(date +%s%N)

    # Calculate duration in milliseconds
    duration=$(( (end - start) / 1000000 ))
    total_time=$(( total_time + duration ))

    if [ $duration -lt $min_time ]; then
      min_time=$duration
    fi

    if [ $duration -gt $max_time ]; then
      max_time=$duration
    fi

    echo -n "."
  done

  echo ""

  # Calculate average
  avg_time=$(( total_time / iterations ))

  echo "  Average: ${avg_time}ms"
  echo "  Min: ${min_time}ms"
  echo "  Max: ${max_time}ms"
  echo ""

  # Return results as JSON
  echo "    \"$name\": {"
  echo "      \"avg_ms\": $avg_time,"
  echo "      \"min_ms\": $min_time,"
  echo "      \"max_ms\": $max_time,"
  echo "      \"total_ms\": $total_time,"
  echo "      \"iterations\": $iterations"
  echo "    },"
}

# 1. Circuit Compilation
echo -e "${GREEN}1. Circuit Compilation${NC}"
cd circuits
COMPILE_RESULT=$(benchmark_command "circuit_compilation" \
  "circom ${CIRCUIT_NAME}.circom --r1cs --wasm --sym --output build/" \
  3)
echo "$COMPILE_RESULT" >> "../$OUTPUT_FILE"
cd ..

# 2. Witness Generation
echo -e "${GREEN}2. Witness Generation${NC}"
WITNESS_RESULT=$(benchmark_command "witness_generation" \
  "node circuits/build/${CIRCUIT_NAME}_js/generate_witness.js circuits/build/${CIRCUIT_NAME}_js/${CIRCUIT_NAME}.wasm circuits/test_input.json circuits/witness.wtns" \
  "$ITERATIONS")
echo "$WITNESS_RESULT" >> "$OUTPUT_FILE"

# 3. Proof Generation
echo -e "${GREEN}3. Proof Generation${NC}"
PROOF_RESULT=$(benchmark_command "proof_generation" \
  "snarkjs groth16 prove circuits/build/${CIRCUIT_NAME}_final.zkey circuits/witness.wtns circuits/proof.json circuits/public.json" \
  "$ITERATIONS")
echo "$PROOF_RESULT" >> "$OUTPUT_FILE"

# 4. Proof Size
echo -e "${GREEN}4. Proof Size${NC}"
if [ -f "circuits/proof.json" ]; then
  PROOF_SIZE=$(wc -c < circuits/proof.json | tr -d ' ')
  echo "  Proof size: ${PROOF_SIZE} bytes"
  echo ""
  echo "    \"proof_size\": {" >> "$OUTPUT_FILE"
  echo "      \"bytes\": $PROOF_SIZE" >> "$OUTPUT_FILE"
  echo "    }," >> "$OUTPUT_FILE"
else
  echo -e "${RED}  Warning: proof.json not found${NC}"
  echo ""
fi

# 5. Local Verification
echo -e "${GREEN}5. Local Verification (off-chain)${NC}"
VERIFY_RESULT=$(benchmark_command "local_verification" \
  "snarkjs groth16 verify circuits/build/verification_key.json circuits/public.json circuits/proof.json" \
  "$ITERATIONS")
echo "$VERIFY_RESULT" >> "$OUTPUT_FILE"

# 6. EVM Gas Cost (if Anvil is running)
echo -e "${GREEN}6. EVM Verification Gas Cost${NC}"
if nc -z localhost 8545 2>/dev/null; then
  echo "  Anvil detected, running EVM benchmark..."

  # Deploy and test contract
  cd evm
  GAS_OUTPUT=$(forge test --match-test testVerifyProof --gas-report 2>&1 | grep "verifyProof" | awk '{print $3}')
  cd ..

  if [ -n "$GAS_OUTPUT" ]; then
    echo "  Gas used: $GAS_OUTPUT"
    echo ""
    echo "    \"evm_gas\": {" >> "$OUTPUT_FILE"
    echo "      \"verifyProof\": $GAS_OUTPUT" >> "$OUTPUT_FILE"
    echo "    }," >> "$OUTPUT_FILE"
  else
    echo -e "${YELLOW}  Could not measure gas (tests may have failed)${NC}"
    echo ""
  fi
else
  echo -e "${YELLOW}  Skipping (Anvil not running on port 8545)${NC}"
  echo "  Start Anvil to enable EVM benchmarking: anvil"
  echo ""
fi

# 7. Stellar/Soroban Cost (if Stellar sandbox is running)
echo -e "${GREEN}7. Stellar Verification Cost${NC}"
if nc -z localhost 8000 2>/dev/null; then
  echo "  Stellar sandbox detected, running Soroban benchmark..."

  cd soroban
  # Build contract
  cargo build --target wasm32-unknown-unknown --release

  # Deploy and invoke (this would need proper Stellar CLI integration)
  # For now, just measure WASM size as a proxy
  WASM_SIZE=$(wc -c < target/wasm32-unknown-unknown/release/zk_verifier.wasm | tr -d ' ')
  echo "  Contract WASM size: $WASM_SIZE bytes"
  echo ""
  echo "    \"stellar_wasm\": {" >> "$OUTPUT_FILE"
  echo "      \"size_bytes\": $WASM_SIZE" >> "$OUTPUT_FILE"
  echo "    }," >> "$OUTPUT_FILE"
  cd ..
else
  echo -e "${YELLOW}  Skipping (Stellar sandbox not running on port 8000)${NC}"
  echo "  Start sandbox to enable Soroban benchmarking:"
  echo "  docker run -d -p 8000:8000 stellar/quickstart:testing --standalone"
  echo ""
fi

# 8. Memory Usage
echo -e "${GREEN}8. Memory Usage${NC}"
echo "  Measuring peak memory during proof generation..."

# Run proof generation with memory tracking
if command -v /usr/bin/time &> /dev/null; then
  MEMORY_OUTPUT=$(/usr/bin/time -v node circuits/build/${CIRCUIT_NAME}_js/generate_witness.js \
    circuits/build/${CIRCUIT_NAME}_js/${CIRCUIT_NAME}.wasm \
    circuits/test_input.json \
    circuits/witness.wtns 2>&1 | grep "Maximum resident" | awk '{print $6}')

  if [ -n "$MEMORY_OUTPUT" ]; then
    MEMORY_KB=$MEMORY_OUTPUT
    MEMORY_MB=$(( MEMORY_KB / 1024 ))
    echo "  Peak memory: ${MEMORY_MB} MB"
    echo ""
    echo "    \"memory\": {" >> "$OUTPUT_FILE"
    echo "      \"peak_kb\": $MEMORY_KB," >> "$OUTPUT_FILE"
    echo "      \"peak_mb\": $MEMORY_MB" >> "$OUTPUT_FILE"
    echo "    }," >> "$OUTPUT_FILE"
  fi
else
  echo -e "${YELLOW}  GNU time not available, skipping memory measurement${NC}"
  echo ""
fi

# Remove trailing comma from last metric
sed -i '$ s/,$//' "$OUTPUT_FILE"

# Close JSON
echo "  }" >> "$OUTPUT_FILE"
echo "}" >> "$OUTPUT_FILE"

# Generate summary
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Benchmark Summary${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

# Extract and display key metrics
if command -v jq &> /dev/null; then
  echo "Circuit Compilation: $(jq -r '.metrics.circuit_compilation.avg_ms' "$OUTPUT_FILE")ms avg"
  echo "Witness Generation:  $(jq -r '.metrics.witness_generation.avg_ms' "$OUTPUT_FILE")ms avg"
  echo "Proof Generation:    $(jq -r '.metrics.proof_generation.avg_ms' "$OUTPUT_FILE")ms avg"
  echo "Proof Size:          $(jq -r '.metrics.proof_size.bytes' "$OUTPUT_FILE") bytes"
  echo "Local Verification:  $(jq -r '.metrics.local_verification.avg_ms' "$OUTPUT_FILE")ms avg"

  if jq -e '.metrics.evm_gas' "$OUTPUT_FILE" > /dev/null; then
    echo "EVM Gas Cost:        $(jq -r '.metrics.evm_gas.verifyProof' "$OUTPUT_FILE") gas"
  fi

  if jq -e '.metrics.memory' "$OUTPUT_FILE" > /dev/null; then
    echo "Peak Memory:         $(jq -r '.metrics.memory.peak_mb' "$OUTPUT_FILE") MB"
  fi
else
  echo "Install jq for formatted summary output: brew install jq"
  echo ""
  echo "Raw results saved to: $OUTPUT_FILE"
fi

echo ""
echo -e "${GREEN}Results saved to: $OUTPUT_FILE${NC}"
echo ""

# Compare with baseline if it exists
BASELINE_FILE="${OUTPUT_DIR}/baseline_${CIRCUIT_NAME}.json"
if [ -f "$BASELINE_FILE" ]; then
  echo -e "${YELLOW}Comparing with baseline...${NC}"

  if command -v jq &> /dev/null; then
    BASELINE_PROOF_TIME=$(jq -r '.metrics.proof_generation.avg_ms' "$BASELINE_FILE")
    CURRENT_PROOF_TIME=$(jq -r '.metrics.proof_generation.avg_ms' "$OUTPUT_FILE")

    DIFF=$(( CURRENT_PROOF_TIME - BASELINE_PROOF_TIME ))
    PERCENT=$(( (DIFF * 100) / BASELINE_PROOF_TIME ))

    if [ $DIFF -gt 0 ]; then
      echo -e "Proof generation: ${RED}+${DIFF}ms (+${PERCENT}%) slower${NC}"
    elif [ $DIFF -lt 0 ]; then
      echo -e "Proof generation: ${GREEN}${DIFF}ms (${PERCENT}%) faster${NC}"
    else
      echo "Proof generation: No change"
    fi
  fi
  echo ""
else
  echo "No baseline found. To create baseline:"
  echo "  cp $OUTPUT_FILE $BASELINE_FILE"
  echo ""
fi

echo -e "${GREEN}Benchmark complete!${NC}"
