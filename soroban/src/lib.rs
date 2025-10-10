#![no_std]

use soroban_sdk::{contract, contractimpl, contracttype, Bytes, Env, Vec};

// SPDX-License-Identifier: AGPL-3.0-or-later
// -----------------------------------------------------------------------------
//  OpenZKTool – Soroban Verifier (Groth16 on BN254) - Demo Version
// -----------------------------------------------------------------------------
// This is a simplified demo verifier for Soroban that validates proof structure
// and performs basic checks. A full ark-groth16 implementation requires more
// optimization for WASM constraints.
//
// For production, use optimized no_std pairing libraries or off-chain verification
// with on-chain proof submission.
// -----------------------------------------------------------------------------

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct ProofData {
    pub pi_a: Vec<Bytes>,
    pub pi_b: Vec<Vec<Bytes>>,
    pub pi_c: Vec<Bytes>,
}

#[contract]
pub struct Groth16Verifier;

#[contractimpl]
impl Groth16Verifier {
    /// Verify a Groth16 proof structure
    /// Returns true if the proof structure is valid
    ///
    /// Note: This is a demo implementation that validates proof structure.
    /// Full cryptographic verification requires optimized pairing operations.
    pub fn verify_proof(
        env: Env,
        proof: ProofData,
        public_input: Vec<Bytes>,
    ) -> bool {
        // Validate proof structure
        if proof.pi_a.len() != 3 {
            return false;
        }

        if proof.pi_b.len() != 3 {
            return false;
        }

        for b_component in proof.pi_b.iter() {
            if b_component.len() != 2 {
                return false;
            }
        }

        if proof.pi_c.len() != 3 {
            return false;
        }

        // Validate public input (should be kycValid = 1)
        if public_input.len() != 1 {
            return false;
        }

        // Check that each field element is 32 bytes (BN254 field size)
        for element in proof.pi_a.iter() {
            if element.len() != 32 {
                return false;
            }
        }

        for b_comp in proof.pi_b.iter() {
            for element in b_comp.iter() {
                if element.len() != 32 {
                    return false;
                }
            }
        }

        for element in proof.pi_c.iter() {
            if element.len() != 32 {
                return false;
            }
        }

        for element in public_input.iter() {
            if element.len() != 32 {
                return false;
            }
        }

        true
    }

    /// Get verifier contract version
    pub fn version(_env: Env) -> u32 {
        1
    }
}

#[cfg(test)]
mod test {
    use super::*;
    use soroban_sdk::{Env};

    #[test]
    fn test_verify_valid_proof() {
        let env = Env::default();
        let contract_id = env.register_contract(None, Groth16Verifier);
        let client = Groth16VerifierClient::new(&env, &contract_id);

        // Create mock proof with correct structure
        let mut pi_a = Vec::new(&env);
        for _ in 0..3 {
            pi_a.push_back(Bytes::from_array(&env, &[0u8; 32]));
        }

        let mut pi_b = Vec::new(&env);
        for _ in 0..3 {
            let mut component = Vec::new(&env);
            for _ in 0..2 {
                component.push_back(Bytes::from_array(&env, &[0u8; 32]));
            }
            pi_b.push_back(component);
        }

        let mut pi_c = Vec::new(&env);
        for _ in 0..3 {
            pi_c.push_back(Bytes::from_array(&env, &[0u8; 32]));
        }

        let proof = ProofData { pi_a, pi_b, pi_c };

        let mut public_input = Vec::new(&env);
        public_input.push_back(Bytes::from_array(&env, &[0u8; 32]));

        let result = client.verify_proof(&proof, &public_input);
        assert!(result, "Valid proof should verify");
    }

    #[test]
    fn test_invalid_proof_structure() {
        let env = Env::default();
        let contract_id = env.register_contract(None, Groth16Verifier);
        let client = Groth16VerifierClient::new(&env, &contract_id);

        // Create proof with wrong structure (only 2 elements in pi_a)
        let mut pi_a = Vec::new(&env);
        for _ in 0..2 {
            pi_a.push_back(Bytes::from_array(&env, &[0u8; 32]));
        }

        let mut pi_b = Vec::new(&env);
        for _ in 0..3 {
            let mut component = Vec::new(&env);
            for _ in 0..2 {
                component.push_back(Bytes::from_array(&env, &[0u8; 32]));
            }
            pi_b.push_back(component);
        }

        let mut pi_c = Vec::new(&env);
        for _ in 0..3 {
            pi_c.push_back(Bytes::from_array(&env, &[0u8; 32]));
        }

        let proof = ProofData { pi_a, pi_b, pi_c };

        let mut public_input = Vec::new(&env);
        public_input.push_back(Bytes::from_array(&env, &[0u8; 32]));

        let result = client.verify_proof(&proof, &public_input);
        assert!(!result, "Invalid proof should not verify");
    }
}
