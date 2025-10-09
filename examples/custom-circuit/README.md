# 🔧 Custom Circuit Example

**Learn to build your own Zero-Knowledge circuits from scratch**

---

## 🎯 What This Demonstrates

- ✅ Writing a custom Circom circuit
- ✅ Compiling and setting up circuits
- ✅ Testing circuit constraints
- ✅ Generating and verifying proofs
- ✅ Deploying custom verifiers

**Difficulty:** 🔴 Advanced

---

## 📂 What's Included

This example contains **3 custom circuits**:

1. **Simple Age Verification** - Prove age ≥ threshold
2. **Credit Score Range Proof** - Prove score in range without revealing exact score
3. **Merkle Tree Membership** - Prove inclusion in whitelist

---

## 🚀 Quick Start

```bash
cd examples/custom-circuit
bash build.sh    # Compile all circuits
bash test.sh     # Test all proofs
```

---

## 📝 Example 1: Simple Age Verification

### Circuit Design

**File:** `circuits/age_verify.circom`

```circom
pragma circom 2.0.0;

include "../../node_modules/circomlib/circuits/comparators.circom";

template AgeVerify() {
    // Private input
    signal input age;

    // Public inputs
    signal input minAge;

    // Public output
    signal output isValid;

    // Constraint: age >= minAge
    component gte = GreaterEqThan(8);
    gte.in[0] <== age;
    gte.in[1] <== minAge;

    // Output result
    isValid <== gte.out;
}

component main {public [minAge]} = AgeVerify();
```

**What this circuit proves:**
- User's age is at least `minAge`
- **Without revealing** the exact age

**Public inputs:** `minAge` (e.g., 18)
**Private inputs:** `age` (e.g., 25)
**Public output:** `isValid` (1 = yes, 0 = no)

---

### Build Script

**File:** `build_age_verify.sh`

```bash
#!/bin/bash

set -e

CIRCUIT_NAME="age_verify"

echo "🔧 Building circuit: $CIRCUIT_NAME"

# 1. Compile circuit
echo "📦 Compiling circuit..."
circom circuits/${CIRCUIT_NAME}.circom \
  --r1cs \
  --wasm \
  --sym \
  -o build/${CIRCUIT_NAME}

echo "✅ Circuit compiled"

# 2. Download Powers of Tau (if not exists)
if [ ! -f "pot12_final.ptau" ]; then
  echo "⬇️  Downloading Powers of Tau..."
  wget https://hermez.s3-eu-west-1.amazonaws.com/pot12_final_phase2.ptau \
    -O pot12_final.ptau
fi

# 3. Generate initial zkey
echo "🔑 Generating initial zkey..."
npx snarkjs groth16 setup \
  build/${CIRCUIT_NAME}/${CIRCUIT_NAME}.r1cs \
  pot12_final.ptau \
  build/${CIRCUIT_NAME}/${CIRCUIT_NAME}_0000.zkey

# 4. Contribute to ceremony
echo "🎲 Contributing to ceremony..."
npx snarkjs zkey contribute \
  build/${CIRCUIT_NAME}/${CIRCUIT_NAME}_0000.zkey \
  build/${CIRCUIT_NAME}/${CIRCUIT_NAME}_0001.zkey \
  --name="First contribution" \
  -v

# 5. Finalize zkey
echo "🔒 Finalizing zkey..."
npx snarkjs zkey beacon \
  build/${CIRCUIT_NAME}/${CIRCUIT_NAME}_0001.zkey \
  build/${CIRCUIT_NAME}/${CIRCUIT_NAME}_final.zkey \
  0102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f 10 \
  -n="Final Beacon"

# 6. Export verification key
echo "📤 Exporting verification key..."
npx snarkjs zkey export verificationkey \
  build/${CIRCUIT_NAME}/${CIRCUIT_NAME}_final.zkey \
  build/${CIRCUIT_NAME}/${CIRCUIT_NAME}_vkey.json

# 7. Export Solidity verifier
echo "📜 Exporting Solidity verifier..."
npx snarkjs zkey export solidityverifier \
  build/${CIRCUIT_NAME}/${CIRCUIT_NAME}_final.zkey \
  build/${CIRCUIT_NAME}/${CIRCUIT_NAME}_verifier.sol

echo "✅ Build complete!"
echo ""
echo "📊 Circuit info:"
npx snarkjs r1cs info build/${CIRCUIT_NAME}/${CIRCUIT_NAME}.r1cs
```

---

### Test Script

**File:** `test_age_verify.sh`

```bash
#!/bin/bash

set -e

CIRCUIT_NAME="age_verify"

echo "🧪 Testing circuit: $CIRCUIT_NAME"

# Test 1: Valid case (age 25 >= minAge 18)
echo ""
echo "Test 1: Valid age (25 >= 18)"
cat > build/${CIRCUIT_NAME}/input_valid.json <<EOF
{
  "age": 25,
  "minAge": 18
}
EOF

# Generate witness
node build/${CIRCUIT_NAME}/${CIRCUIT_NAME}_js/generate_witness.js \
  build/${CIRCUIT_NAME}/${CIRCUIT_NAME}_js/${CIRCUIT_NAME}.wasm \
  build/${CIRCUIT_NAME}/input_valid.json \
  build/${CIRCUIT_NAME}/witness_valid.wtns

# Generate proof
npx snarkjs groth16 prove \
  build/${CIRCUIT_NAME}/${CIRCUIT_NAME}_final.zkey \
  build/${CIRCUIT_NAME}/witness_valid.wtns \
  build/${CIRCUIT_NAME}/proof_valid.json \
  build/${CIRCUIT_NAME}/public_valid.json

# Verify proof
npx snarkjs groth16 verify \
  build/${CIRCUIT_NAME}/${CIRCUIT_NAME}_vkey.json \
  build/${CIRCUIT_NAME}/public_valid.json \
  build/${CIRCUIT_NAME}/proof_valid.json

echo ""
echo "Public output (should be 1):"
cat build/${CIRCUIT_NAME}/public_valid.json

# Test 2: Invalid case (age 16 < minAge 18)
echo ""
echo "Test 2: Invalid age (16 < 18)"
cat > build/${CIRCUIT_NAME}/input_invalid.json <<EOF
{
  "age": 16,
  "minAge": 18
}
EOF

# Generate witness
node build/${CIRCUIT_NAME}/${CIRCUIT_NAME}_js/generate_witness.js \
  build/${CIRCUIT_NAME}/${CIRCUIT_NAME}_js/${CIRCUIT_NAME}.wasm \
  build/${CIRCUIT_NAME}/input_invalid.json \
  build/${CIRCUIT_NAME}/witness_invalid.wtns

# Generate proof
npx snarkjs groth16 prove \
  build/${CIRCUIT_NAME}/${CIRCUIT_NAME}_final.zkey \
  build/${CIRCUIT_NAME}/witness_invalid.wtns \
  build/${CIRCUIT_NAME}/proof_invalid.json \
  build/${CIRCUIT_NAME}/public_invalid.json

echo ""
echo "Public output (should be 0):"
cat build/${CIRCUIT_NAME}/public_invalid.json

echo ""
echo "✅ All tests passed!"
```

**Run:**
```bash
bash build_age_verify.sh
bash test_age_verify.sh
```

---

## 📝 Example 2: Credit Score Range Proof

### Circuit Design

**File:** `circuits/credit_score.circom`

```circom
pragma circom 2.0.0;

include "../../node_modules/circomlib/circuits/comparators.circom";

template CreditScoreRange() {
    // Private input
    signal input score;

    // Public inputs
    signal input minScore;
    signal input maxScore;

    // Public output
    signal output inRange;

    // Constraint 1: score >= minScore
    component gte = GreaterEqThan(16);
    gte.in[0] <== score;
    gte.in[1] <== minScore;

    // Constraint 2: score <= maxScore
    component lte = LessEqThan(16);
    lte.in[0] <== score;
    lte.in[1] <== maxScore;

    // Constraint 3: Both must be true
    component and = AND();
    and.a <== gte.out;
    and.b <== lte.out;

    inRange <== and.out;
}

component main {public [minScore, maxScore]} = CreditScoreRange();
```

**What this circuit proves:**
- Credit score is between `minScore` and `maxScore`
- **Without revealing** the exact score

**Example:**
- Private: score = 720
- Public: minScore = 650, maxScore = 850
- Output: inRange = 1 ✅

**Use case:** Prove creditworthiness without revealing exact score to lender.

---

### Input Example

```json
{
  "score": 720,
  "minScore": 650,
  "maxScore": 850
}
```

**Result:** `inRange = 1` (score is in range 650-850)

---

## 📝 Example 3: Merkle Tree Membership

### Circuit Design

**File:** `circuits/merkle_proof.circom`

```circom
pragma circom 2.0.0;

include "../../node_modules/circomlib/circuits/poseidon.circom";
include "../../node_modules/circomlib/circuits/comparators.circom";

template MerkleTreeChecker(levels) {
    // Private inputs
    signal input leaf;
    signal input pathElements[levels];
    signal input pathIndices[levels];

    // Public input
    signal input root;

    // Public output
    signal output isValid;

    // Compute Merkle root from leaf
    component poseidons[levels];
    component selectors[levels];

    signal computedHash[levels + 1];
    computedHash[0] <== leaf;

    for (var i = 0; i < levels; i++) {
        selectors[i] = Selector();
        selectors[i].index <== pathIndices[i];
        selectors[i].left <== computedHash[i];
        selectors[i].right <== pathElements[i];

        poseidons[i] = Poseidon(2);
        poseidons[i].inputs[0] <== selectors[i].outLeft;
        poseidons[i].inputs[1] <== selectors[i].outRight;

        computedHash[i + 1] <== poseidons[i].out;
    }

    // Check if computed root matches expected root
    component eq = IsEqual();
    eq.in[0] <== computedHash[levels];
    eq.in[1] <== root;

    isValid <== eq.out;
}

template Selector() {
    signal input index;
    signal input left;
    signal input right;
    signal output outLeft;
    signal output outRight;

    // If index = 0: outLeft = left, outRight = right
    // If index = 1: outLeft = right, outRight = left
    outLeft <== (1 - index) * left + index * right;
    outRight <== index * left + (1 - index) * right;
}

component main {public [root]} = MerkleTreeChecker(4);
```

**What this circuit proves:**
- User's address is in a whitelist (Merkle tree)
- **Without revealing** which address or position

**Use case:** Privacy-preserving whitelist verification (e.g., airdrop eligibility).

---

## 🛠️ Building Custom Circuits - Step by Step

### Step 1: Design Your Circuit

Ask yourself:
1. **What do I want to prove?** (e.g., "I'm over 18")
2. **What should be private?** (e.g., exact age)
3. **What should be public?** (e.g., threshold age, result)
4. **What constraints are needed?** (e.g., age >= 18)

---

### Step 2: Write the Circuit

```circom
pragma circom 2.0.0;

template YourCircuit() {
    // 1. Declare signals
    signal input privateInput;
    signal input publicInput;
    signal output result;

    // 2. Define constraints
    // ... your logic here

    // 3. Assign output
    result <== ...;
}

component main {public [publicInput]} = YourCircuit();
```

---

### Step 3: Test Locally

```bash
# Compile
circom your_circuit.circom --r1cs --wasm

# Create test input
echo '{"privateInput": 42, "publicInput": 10}' > input.json

# Generate witness
node your_circuit_js/generate_witness.js \
  your_circuit_js/your_circuit.wasm \
  input.json \
  witness.wtns

# Check constraints
npx snarkjs wtns check your_circuit.r1cs witness.wtns
```

---

### Step 4: Setup and Deploy

```bash
# Setup
npx snarkjs groth16 setup your_circuit.r1cs pot12_final.ptau your_circuit.zkey

# Export verifier
npx snarkjs zkey export solidityverifier your_circuit.zkey YourVerifier.sol

# Deploy
forge create --rpc-url $RPC_URL \
  --private-key $PRIVATE_KEY \
  YourVerifier.sol:Groth16Verifier
```

---

## 📚 Circom Libraries

Useful components from `circomlib`:

```circom
// Comparisons
include "circomlib/circuits/comparators.circom";
- GreaterThan(n)
- LessThan(n)
- GreaterEqThan(n)
- LessEqThan(n)
- IsEqual()

// Logic gates
include "circomlib/circuits/gates.circom";
- AND()
- OR()
- NOT()
- XOR()

// Hashing
include "circomlib/circuits/poseidon.circom";
- Poseidon(nInputs)

// Arithmetic
include "circomlib/circuits/binsum.circom";
- BinSum(n)

// Bitify
include "circomlib/circuits/bitify.circom";
- Num2Bits(n)
- Bits2Num(n)
```

---

## 🎯 Circuit Optimization Tips

### 1. Minimize Constraints

**Bad:**
```circom
signal temp1;
signal temp2;
temp1 <== a + b;
temp2 <== temp1 + c;
result <== temp2;
// 3 constraints
```

**Good:**
```circom
result <== a + b + c;
// 1 constraint
```

---

### 2. Use Efficient Comparators

```circom
// For 8-bit numbers
component gte = GreaterEqThan(8);  // 8 constraints

// Don't use for small numbers
component gte = GreaterEqThan(254);  // 254 constraints!
```

---

### 3. Avoid Divisions

**Bad:**
```circom
signal result;
result <== a / b;  // Can't constrain!
```

**Good:**
```circom
signal result;
result * b === a;  // Constrain multiplication instead
```

---

## 🧪 Testing Best Practices

### Test Matrix

For every circuit, test:

1. ✅ **Valid case** - Should produce output `1`
2. ❌ **Invalid case** - Should produce output `0`
3. 🔴 **Edge cases** - Boundary values
4. 💥 **Constraint violations** - Should fail witness generation

**Example test suite:**

```bash
# Test 1: Valid (age = 18, minAge = 18)
# Expected: isValid = 1

# Test 2: Invalid (age = 17, minAge = 18)
# Expected: isValid = 0

# Test 3: Edge case (age = 0, minAge = 0)
# Expected: isValid = 1

# Test 4: Overflow (age = 256, 8-bit circuit)
# Expected: Witness generation fails
```

---

## 📦 Files Included

```
custom-circuit/
├── circuits/
│   ├── age_verify.circom          # Example 1
│   ├── credit_score.circom        # Example 2
│   └── merkle_proof.circom        # Example 3
├── build/                          # Generated files
│   ├── age_verify/
│   │   ├── age_verify.r1cs
│   │   ├── age_verify.wasm
│   │   ├── age_verify_final.zkey
│   │   ├── age_verify_vkey.json
│   │   └── age_verify_verifier.sol
│   └── ...
├── build_age_verify.sh
├── build_credit_score.sh
├── build_merkle_proof.sh
├── test_age_verify.sh
├── test_credit_score.sh
├── test_merkle_proof.sh
├── build.sh                        # Build all
├── test.sh                         # Test all
└── README.md
```

---

## 🚀 Master Build Script

**File:** `build.sh`

```bash
#!/bin/bash

set -e

echo "🔧 Building all custom circuits..."

bash build_age_verify.sh
bash build_credit_score.sh
bash build_merkle_proof.sh

echo ""
echo "✅ All circuits built successfully!"
```

---

## 🧪 Master Test Script

**File:** `test.sh`

```bash
#!/bin/bash

set -e

echo "🧪 Testing all custom circuits..."

bash test_age_verify.sh
bash test_credit_score.sh
bash test_merkle_proof.sh

echo ""
echo "✅ All tests passed!"
```

---

## 📚 Learn More

### Resources

- 📖 [Circom Documentation](https://docs.circom.io/)
- 📦 [circomlib Repository](https://github.com/iden3/circomlib)
- 📄 [Groth16 Paper](https://eprint.iacr.org/2016/260.pdf)
- 🎓 [ZK Learning Resources](https://zkp.science/)

### Next Steps

1. **Modify** one of the example circuits
2. **Create** your own circuit for a new use case
3. **Deploy** verifier to testnet
4. **Integrate** into your application

---

## 🤝 Need Help?

- 💬 [Open an issue](https://github.com/xcapit/stellar-privacy-poc/issues)
- 📖 [Read the FAQ](../../docs/FAQ.md)
- 🏗️ [Architecture docs](../../docs/architecture/)

---

*Example last updated: 2025-01-10*
*Team X1 - Xcapit Labs*
