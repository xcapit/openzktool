pragma circom 2.0.0;

include "node_modules/circomlib/circuits/poseidon.circom";

/*
 * SimpleProof Circuit
 * 
 * Purpose: Prove knowledge of a secret value without revealing it
 * 
 * Public Input:  publicHash  - Hash that everyone can see
 * Private Input: secretValue - Secret only the prover knows
 * 
 * Constraint: hash(secretValue) === publicHash
 * 
 * This demonstrates the foundation for:
 * - Private transfers (prove you have funds without showing balance)
 * - KYC verification (prove you're verified without revealing identity)
 * - Compliance checks (prove you're compliant without exposing data)
 */
template SimpleProof() {
    // PUBLIC: This value is visible on-chain
    signal input publicHash;
    
    // PRIVATE: This value stays secret, never revealed
    signal input secretValue;
    
    // Compute Poseidon hash of the secret
    // Poseidon is ZK-friendly (efficient in circuits)
    component hasher = Poseidon(1);
    hasher.inputs[0] <== secretValue;
    
    // CONSTRAINT: Verify the hash matches
    // This is what makes it "zero-knowledge":
    // - Prover shows they know secretValue
    // - Without revealing what secretValue is
    // - Public only sees the hash
    publicHash === hasher.out;
}

// Main component with public input specified
component main {public [publicHash]} = SimpleProof();
