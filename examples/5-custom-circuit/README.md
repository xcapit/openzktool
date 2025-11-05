# Example 5: Custom Circuit

> Build your own zero-knowledge circuit from scratch

**Status:** Structure only - Implementation coming in next phase

---

## 📖 What You'll Learn

- Circom circuit design
- Constraint writing
- Trusted setup ceremony
- Circuit compilation
- Proof generation for custom circuits
- Security considerations

---

## 🚀 Quick Start

```bash
# Install Circom
wget https://github.com/iden3/circom/releases/download/v2.1.9/circom-linux-amd64
chmod +x circom-linux-amd64
sudo mv circom-linux-amd64 /usr/local/bin/circom

# Compile circuit
npm run compile

# Generate trusted setup
npm run setup

# Test circuit
npm test
```

---

## 📁 Files

```
5-custom-circuit/
├── README.md
├── package.json
├── circuits/
│   ├── my_circuit.circom       # Your custom circuit
│   ├── age_check.circom        # Example: Age verification
│   └── merkle_proof.circom     # Example: Merkle tree proof
├── scripts/
│   ├── compile.sh              # Compile circuit
│   ├── setup.sh                # Trusted setup
│   └── test.sh                 # Test circuit
└── test/
    └── circuit.test.js
```

---

## 💻 Example Circuits

### Age Verification Circuit

```circom
pragma circom 2.1.9;

/**
 * Age Verification Circuit
 *
 * Proves that age >= minAge without revealing exact age
 */
template AgeVerification() {
    signal input age;           // Private
    signal input minAge;        // Public
    signal output isValid;      // Public

    // Check age >= minAge
    component greaterThan = GreaterEqThan(8);
    greaterThan.in[0] <== age;
    greaterThan.in[1] <== minAge;

    // Output result
    isValid <== greaterThan.out;
}

component main = AgeVerification();
```

### Merkle Tree Membership Proof

```circom
pragma circom 2.1.9;

include "circomlib/circuits/poseidon.circom";
include "circomlib/circuits/mux1.circom";

/**
 * Merkle Tree Membership Proof
 *
 * Proves that a leaf exists in a Merkle tree
 * without revealing the leaf or its position
 */
template MerkleTreeChecker(levels) {
    signal input leaf;                  // Private
    signal input pathElements[levels];  // Private
    signal input pathIndices[levels];   // Private
    signal input root;                  // Public
    signal output isValid;              // Public

    component hashers[levels];
    component mux[levels];

    signal hashes[levels + 1];
    hashes[0] <== leaf;

    for (var i = 0; i < levels; i++) {
        // Hash current level
        hashers[i] = Poseidon(2);

        // Select left/right based on pathIndices[i]
        mux[i] = MultiMux1(2);
        mux[i].c[0][0] <== hashes[i];
        mux[i].c[0][1] <== pathElements[i];
        mux[i].c[1][0] <== pathElements[i];
        mux[i].c[1][1] <== hashes[i];
        mux[i].s <== pathIndices[i];

        // Hash the pair
        hashers[i].inputs[0] <== mux[i].out[0];
        hashers[i].inputs[1] <== mux[i].out[1];

        hashes[i + 1] <== hashers[i].out;
    }

    // Verify root matches
    isValid <== (hashes[levels] === root);
}

component main = MerkleTreeChecker(20);
```

---

## Circuit Development Workflow

1. **Design Circuit**
   ```bash
   # Create .circom file
   vim circuits/my_circuit.circom
   ```

2. **Compile Circuit**
   ```bash
   circom circuits/my_circuit.circom --r1cs --wasm --sym -o build/
   ```

3. **Generate Trusted Setup**
   ```bash
   # Download Powers of Tau
   wget https://hermez.s3-eu-west-1.amazonaws.com/powersOfTau28_hez_final_14.ptau

   # Generate zkey
   snarkjs groth16 setup build/my_circuit.r1cs powersOfTau28_hez_final_14.ptau build/my_circuit_0000.zkey

   # Contribute to ceremony
   snarkjs zkey contribute build/my_circuit_0000.zkey build/my_circuit_final.zkey

   # Export verification key
   snarkjs zkey export verificationkey build/my_circuit_final.zkey build/verification_key.json
   ```

4. **Generate Proof**
   ```bash
   # Create input
   echo '{"age": 25, "minAge": 18}' > input.json

   # Generate witness
   node build/my_circuit_js/generate_witness.js build/my_circuit_js/my_circuit.wasm input.json witness.wtns

   # Generate proof
   snarkjs groth16 prove build/my_circuit_final.zkey witness.wtns proof.json public.json

   # Verify proof
   snarkjs groth16 verify build/verification_key.json public.json proof.json
   ```

---

## 🧪 Testing Your Circuit

```javascript
const { groth16 } = require('snarkjs');

describe('Custom Circuit', () => {
  it('should prove age >= minAge', async () => {
    const input = {
      age: 25,
      minAge: 18
    };

    const { proof, publicSignals } = await groth16.fullProve(
      input,
      'build/my_circuit.wasm',
      'build/my_circuit_final.zkey'
    );

    const verified = await groth16.verify(
      verificationKey,
      publicSignals,
      proof
    );

    expect(verified).toBe(true);
    expect(publicSignals[0]).toBe('1'); // isValid = true
  });
});
```

---

## 🔒 Security Considerations

1. **Trusted Setup**
   - Always use multi-party ceremony for production
   - Never reuse toxic waste
   - Document all ceremony participants

2. **Circuit Constraints**
   - Verify all constraints are necessary
   - Check for under-constrained circuits
   - Test with edge cases

3. **Input Validation**
   - Validate all inputs
   - Check range constraints
   - Handle overflow/underflow

---

## 📚 Circuit Design Patterns

### Range Proofs
```circom
// Prove value is in range [min, max]
template RangeProof(bits) {
    signal input value;
    signal input min;
    signal input max;
    signal output isValid;

    // Implementation
}
```

### Set Membership
```circom
// Prove value is in a set
template SetMembership(setSize) {
    signal input value;
    signal input set[setSize];
    signal output isValid;

    // Implementation
}
```

### Nullifier
```circom
// Prevent double-spending
template Nullifier() {
    signal input secret;
    signal output nullifier;

    // nullifier = hash(secret)
}
```

---

## 🔗 Resources

- [Circom Documentation](https://docs.circom.io/)
- [circomlib Library](https://github.com/iden3/circomlib)
- [ZK Learning Resources](https://zkp.science/)
- [Groth16 Paper](https://eprint.iacr.org/2016/260.pdf)

---

## 📝 Example Use Cases

- Age verification (18+, 21+)
- Credit score proof
- Membership proof (whitelist)
- Solvency proof
- Identity verification
- Voting eligibility
- Geographic restrictions
- Time-locked secrets

---

**Note:** Custom circuits require careful security review. Always audit before production use.
