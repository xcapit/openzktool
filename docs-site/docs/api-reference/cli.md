---
sidebar_position: 1
---

# Command Line Interface

Complete reference for OpenZKTool CLI commands for proof generation and verification.

## Installation

OpenZKTool CLI is included when you clone the repository:

```bash
git clone https://github.com/xcapit/openzktool.git
cd openzktool
npm install
npm run setup  # Compile circuits and generate keys
```

## Available Commands

### `npm run prove`

Generate a zero-knowledge proof from input data.

**Usage:**
```bash
npm run prove [-- input.json]
```

**Arguments:**
- `input.json` (optional) - Path to input JSON file. Defaults to `input.json` in root.

**Example:**
```bash
# Using default input.json
npm run prove

# Using custom input file
npm run prove -- examples/age-verification.json

# Using stdin
cat my_input.json | npm run prove
```

**Input Format:**

```json
{
  "age": "25",
  "balance": "1000",
  "country": "1",
  "minAge": "18",
  "maxAge": "99",
  "minBalance": "100",
  "allowedCountries": ["1", "2", "3", "0", "0", "0", "0", "0", "0", "0"]
}
```

**Important:**
- All values must be strings (Circom requirement)
- Numbers are decimal strings (no quotes around field names)
- `allowedCountries` must have exactly 10 elements

**Output:**
- `circuits/build/proof.json` - The zero-knowledge proof
- `circuits/build/public.json` - Public outputs (kycValid: 0 or 1)
- `witness.wtns` - Witness file (intermediate computation)

**Exit Codes:**
- `0` - Success
- `1` - Invalid input or constraint violation
- `2` - WASM file not found (run `npm run setup` first)

### `npm run verify`

Verify a proof locally (off-chain).

**Usage:**
```bash
npm run verify [-- proof.json public.json]
```

**Arguments:**
- `proof.json` (optional) - Path to proof file. Defaults to `circuits/build/proof.json`
- `public.json` (optional) - Path to public inputs. Defaults to `circuits/build/public.json`

**Example:**
```bash
# Verify default proof
npm run verify

# Verify custom proof
npm run verify -- my_proof.json my_public.json
```

**Output:**
```
[INFO]  snarkJS: OK!
✓ Proof verified successfully
```

**Exit Codes:**
- `0` - Proof is valid
- `1` - Proof is invalid
- `2` - Missing verification key

### `npm run demo:privacy`

Run the complete privacy demo (prove + verify locally).

**Usage:**
```bash
npm run demo:privacy
```

**What it does:**
1. Generates proof with sample data (age: 25, balance: 150, country: Argentina)
2. Verifies proof locally
3. Displays results

**Example Output:**
```
🔐 OpenZKTool Privacy Demo

Step 1: Generating witness...
✓ Witness generated (543ms)

Step 2: Generating proof...
✓ Proof generated (891ms)

Step 3: Verifying locally...
✓ Proof verified successfully

Results:
  Age: ✓ Valid (18 ≤ age ≤ 99)
  Balance: ✓ Valid (balance ≥ 50)
  Country: ✓ Valid (in allowed list)
  KYC Status: PASSED

Proof size: 768 bytes
Verification time: 47ms
```

### `npm run demo:soroban`

Verify proof on Stellar Soroban testnet.

**Usage:**
```bash
npm run demo:soroban [-- proof.json]
```

**Prerequisites:**
- Proof file generated (run `npm run prove` first)
- Internet connection (connects to Stellar testnet)

**Example:**
```bash
# Verify default proof on Soroban
npm run demo:soroban

# Verify custom proof
npm run demo:soroban -- my_proof.json
```

**Example Output:**
```
🌟 Stellar Soroban Verification

Contract: CBPBVJJW5NMV4UVEDKSR6UO4DRBNWRQEMYKRYZI3CW6YK3O7HAZA43OI
Network: Testnet

Submitting proof...
✓ Transaction confirmed

Result: VALID ✓
Gas used: ~200,000 operations
Transaction: https://stellar.expert/explorer/testnet/tx/abc123...

The verifier confirmed KYC requirements are met WITHOUT
learning your actual age, balance, or country!
```

### `npm run setup`

Compile circuits and generate proving/verification keys.

**Usage:**
```bash
npm run setup
```

**What it does:**
1. Compiles Circom circuit to R1CS
2. Generates WASM witness calculator
3. Performs trusted setup (Powers of Tau)
4. Exports verification key
5. Generates Soroban verifier contract

**Time:** ~2-3 minutes (one-time operation)

**Output:**
```
circuits/build/
├── kyc_transfer.r1cs
├── kyc_transfer.wasm
├── kyc_transfer_final.zkey
├── verification_key.json
└── kyc_transfer_js/
    └── kyc_transfer.wasm
```

### `npm test`

Run the test suite.

**Usage:**
```bash
npm test
```

**What it tests:**
1. Circuit compilation
2. Proof generation
3. Local verification
4. Soroban verification (testnet)

**Example Output:**
```
OpenZKTool Test Suite

✓ Circuit compiles successfully (1234ms)
✓ Generates valid proofs (892ms)
✓ Verifies proofs locally (45ms)
✓ Verifies on Stellar Soroban (2341ms)

4 passing (4.5s)
```

## Advanced Usage

### Custom Circuits

To use your own circuit:

```bash
# 1. Create your circuit
vim circuits/my_circuit.circom

# 2. Compile
circom circuits/my_circuit.circom \
  --r1cs \
  --wasm \
  --sym \
  --output circuits/build/

# 3. Generate keys
snarkjs groth16 setup \
  circuits/build/my_circuit.r1cs \
  powersOfTau28_hez_final_15.ptau \
  circuits/build/my_circuit_final.zkey

# 4. Export verification key
snarkjs zkey export verificationkey \
  circuits/build/my_circuit_final.zkey \
  circuits/build/my_vkey.json

# 5. Generate proof
snarkjs groth16 fullprove \
  input.json \
  circuits/build/my_circuit.wasm \
  circuits/build/my_circuit_final.zkey \
  proof.json \
  public.json
```

### Batch Proof Generation

Generate proofs for multiple inputs:

```bash
# Create input files
for i in {1..10}; do
  cat > input_$i.json << EOF
{
  "age": "$((RANDOM % 50 + 18))",
  "balance": "$((RANDOM % 10000))",
  ...
}
EOF
done

# Generate proofs in parallel
for i in {1..10}; do
  npm run prove -- input_$i.json &
done
wait

# Results in: proof_1.json, proof_2.json, ..., proof_10.json
```

### Environment Variables

Configure CLI behavior:

```bash
# Set custom circuit path
export CIRCUIT_PATH=circuits/build/custom_circuit

# Set custom keys path
export KEYS_PATH=circuits/build/custom_keys

# Enable debug logging
export DEBUG=openzktool:*

# Run with environment
npm run prove
```

### JSON Output

Get machine-readable output:

```bash
# Generate proof with JSON output
npm run prove -- input.json --json > result.json

# Parse result
cat result.json | jq '.proof.pi_a'
```

## Error Handling

### Common Errors

**"WASM file not found"**
```bash
# Fix: Run setup first
npm run setup
```

**"Invalid witness"**
```bash
# Fix: Check input values satisfy constraints
# Example: age must be in range [minAge, maxAge]
```

**"Verification failed"**
```bash
# Fix: Ensure proof and public inputs match
# Regenerate proof with correct inputs
```

**"Contract not found"**
```bash
# Fix: Check network connectivity
# Ensure Stellar testnet is accessible
ping soroban-testnet.stellar.org
```

### Debug Mode

Enable verbose logging:

```bash
# Set debug environment variable
export DEBUG=openzktool:*

# Run command
npm run prove

# See detailed logs
[openzktool:prove] Loading circuit...
[openzktool:prove] Generating witness...
[openzktool:prove] Computing proof...
```

## Scripting Examples

### Automated Verification Pipeline

```bash
#!/bin/bash
# verify_users.sh - Verify multiple users

for user in users/*.json; do
  echo "Processing $user..."

  # Generate proof
  npm run prove -- "$user" 2>&1 | grep -q "✓" || {
    echo "❌ Failed to generate proof for $user"
    continue
  }

  # Verify on Soroban
  npm run demo:soroban 2>&1 | grep -q "VALID" && {
    echo "✓ $user verified successfully"
  } || {
    echo "❌ $user verification failed"
  }
done
```

### Continuous Integration

```yaml
# .github/workflows/test.yml
name: Test ZK Proofs

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'

      - run: npm install
      - run: npm run setup
      - run: npm test
```

## Performance Tips

### Speed Up Proof Generation

```bash
# Use production mode
NODE_ENV=production npm run prove

# Increase Node.js memory
NODE_OPTIONS="--max-old-space-size=4096" npm run prove

# Use faster CPU
# Groth16 proof generation is CPU-bound
# Faster CPU = faster proofs
```

### Reduce Build Time

```bash
# Cache Powers of Tau (one-time download)
wget https://hermez.s3-eu-west-1.amazonaws.com/powersOfTau28_hez_final_15.ptau
# Use local file instead of downloading each time
```

## Next Steps

- **[SDK Documentation →](./sdk)** - Programmatic API
- **[Contract API →](./contract-api)** - Soroban integration
- **[Custom Circuits →](../advanced/custom-circuits)** - Build your own

---

**Questions?** [GitHub Discussions](https://github.com/xcapit/openzktool/discussions)
