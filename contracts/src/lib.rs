#![no_std]

use soroban_sdk::{contract, contractimpl, contracttype, symbol_short, Address, Bytes, BytesN, Env, Map, Vec};

/// Storage keys for the contract
#[contracttype]
#[derive(Clone)]
pub enum DataKey {
    Admin,
    NullifierSet,
    CredentialRegistry,
}

/// Simplified proof structure for POC
/// Production will use full Groth16 proof with pairing checks
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Proof {
    pub commitment: BytesN<32>,
    pub nullifier: BytesN<32>,
    pub proof_data: Bytes,
}

/// Verification result
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct VerificationResult {
    pub valid: bool,
    pub timestamp: u64,
}

#[contract]
pub struct PrivacyVerifier;

#[contractimpl]
impl PrivacyVerifier {
    /// Initialize the contract
    pub fn initialize(env: Env, admin: Address) {
        admin.require_auth();
        env.storage().instance().set(&DataKey::Admin, &admin);
        
        // Initialize empty nullifier set
        let nullifiers: Map<BytesN<32>, u64> = Map::new(&env);
        env.storage().persistent().set(&DataKey::NullifierSet, &nullifiers);
        
        // Emit initialization event
        env.events().publish(
            (symbol_short!("init"),),
            admin,
        );
    }

    /// Verify a zero-knowledge proof
    /// 
    /// In this POC, verification is simplified for demonstration.
    /// Production will implement full Groth16 verification with:
    /// - Pairing checks (BLS12-381 curve)
    /// - Verification key validation
    /// - Public signal verification
    pub fn verify_proof(
        env: Env,
        proof: Proof,
        encrypted_data: Bytes,
    ) -> VerificationResult {
        // 1. Check nullifier hasn't been used (prevent double-spend)
        let mut nullifiers: Map<BytesN<32>, u64> = env
            .storage()
            .persistent()
            .get(&DataKey::NullifierSet)
            .unwrap_or(Map::new(&env));

        if nullifiers.contains_key(proof.nullifier.clone()) {
            // Nullifier already used!
            return VerificationResult {
                valid: false,
                timestamp: env.ledger().timestamp(),
            };
        }

        // 2. Verify proof (SIMPLIFIED FOR POC)
        // Production: Full Groth16 pairing check
        // e(A, B) = e(alpha, beta) * e(vk_x, gamma) * e(C, delta)
        let is_valid = Self::verify_groth16_simplified(&env, &proof);

        if !is_valid {
            return VerificationResult {
                valid: false,
                timestamp: env.ledger().timestamp(),
            };
        }

        // 3. Mark nullifier as used
        let block_number = env.ledger().sequence();
        nullifiers.set(proof.nullifier.clone(), block_number);
        env.storage().persistent().set(&DataKey::NullifierSet, &nullifiers);

        // 4. Emit verification event with encrypted data
        env.events().publish(
            (symbol_short!("verified"), proof.nullifier.clone()),
            encrypted_data,
        );

        VerificationResult {
            valid: true,
            timestamp: env.ledger().timestamp(),
        }
    }

    /// Check if a nullifier has been used
    pub fn is_nullifier_used(env: Env, nullifier: BytesN<32>) -> bool {
        let nullifiers: Map<BytesN<32>, u64> = env
            .storage()
            .persistent()
            .get(&DataKey::NullifierSet)
            .unwrap_or(Map::new(&env));

        nullifiers.contains_key(nullifier)
    }

    /// Get the block number when nullifier was used
    pub fn get_nullifier_block(env: Env, nullifier: BytesN<32>) -> Option<u64> {
        let nullifiers: Map<BytesN<32>, u64> = env
            .storage()
            .persistent()
            .get(&DataKey::NullifierSet)
            .unwrap_or(Map::new(&env));

        nullifiers.get(nullifier)
    }

    /// Register a credential (KYC commitment)
    pub fn register_credential(
        env: Env,
        admin: Address,
        commitment: BytesN<32>,
    ) {
        // Only admin can register credentials
        admin.require_auth();

        let stored_admin: Address = env
            .storage()
            .instance()
            .get(&DataKey::Admin)
            .unwrap();

        if admin != stored_admin {
            panic!("Unauthorized");
        }

        // Store credential
        let mut registry: Map<BytesN<32>, u64> = env
            .storage()
            .persistent()
            .get(&DataKey::CredentialRegistry)
            .unwrap_or(Map::new(&env));

        let timestamp = env.ledger().timestamp();
        registry.set(commitment, timestamp);
        env.storage().persistent().set(&DataKey::CredentialRegistry, &registry);

        // Emit event
        env.events().publish(
            (symbol_short!("cred_reg"), commitment),
            timestamp,
        );
    }

    /// Check if credential exists
    pub fn has_credential(env: Env, commitment: BytesN<32>) -> bool {
        let registry: Map<BytesN<32>, u64> = env
            .storage()
            .persistent()
            .get(&DataKey::CredentialRegistry)
            .unwrap_or(Map::new(&env));

        registry.contains_key(commitment)
    }

    // ========================================
    // PRIVATE HELPER FUNCTIONS
    // ========================================

    /// Simplified Groth16 verification for POC
    /// 
    /// Production implementation will include:
    /// - Full pairing check on BLS12-381 curve
    /// - Verification key validation
    /// - Public signal processing
    /// - Gas-optimized pairing operations
    fn verify_groth16_simplified(_env: &Env, proof: &Proof) -> bool {
        // POC: Basic validation
        // Check that proof data is not empty
        if proof.proof_data.len() == 0 {
            return false;
        }

        // Check that commitment and nullifier are non-zero
        let zero_bytes = BytesN::from_array(_env, &[0u8; 32]);
        if proof.commitment == zero_bytes || proof.nullifier == zero_bytes {
            return false;
        }

        // POC: Always return true for demo purposes
        // Production will implement full cryptographic verification
        true
    }
}

// ========================================
// TESTS
// ========================================

#[cfg(test)]
mod test {
    use super::*;
    use soroban_sdk::{testutils::Address as _, Address, Bytes, BytesN, Env};

    #[test]
    fn test_initialize() {
        let env = Env::default();
        let contract_id = env.register_contract(None, PrivacyVerifier);
        let client = PrivacyVerifierClient::new(&env, &contract_id);

        let admin = Address::generate(&env);

        client.initialize(&admin);

        // Contract initialized successfully
    }

    #[test]
    fn test_verify_proof() {
        let env = Env::default();
        let contract_id = env.register_contract(None, PrivacyVerifier);
        let client = PrivacyVerifierClient::new(&env, &contract_id);

        let admin = Address::generate(&env);
        client.initialize(&admin);

        // Create a test proof
        let commitment = BytesN::from_array(&env, &[1u8; 32]);
        let nullifier = BytesN::from_array(&env, &[2u8; 32]);
        let proof_data = Bytes::from_array(&env, &[3u8; 128]);

        let proof = Proof {
            commitment: commitment.clone(),
            nullifier: nullifier.clone(),
            proof_data,
        };

        let encrypted_data = Bytes::from_array(&env, &[4u8; 64]);

        // Verify proof
        let result = client.verify_proof(&proof, &encrypted_data);

        assert!(result.valid);
        assert!(result.timestamp > 0);
    }

    #[test]
    fn test_cannot_reuse_nullifier() {
        let env = Env::default();
        let contract_id = env.register_contract(None, PrivacyVerifier);
        let client = PrivacyVerifierClient::new(&env, &contract_id);

        let admin = Address::generate(&env);
        client.initialize(&admin);

        let commitment = BytesN::from_array(&env, &[1u8; 32]);
        let nullifier = BytesN::from_array(&env, &[2u8; 32]);
        let proof_data = Bytes::from_array(&env, &[3u8; 128]);

        let proof = Proof {
            commitment: commitment.clone(),
            nullifier: nullifier.clone(),
            proof_data: proof_data.clone(),
        };

        let encrypted_data = Bytes::from_array(&env, &[4u8; 64]);

        // First verification: should succeed
        let result1 = client.verify_proof(&proof, &encrypted_data);
        assert!(result1.valid);

        // Second verification with same nullifier: should fail
        let proof2 = Proof {
            commitment: commitment.clone(),
            nullifier: nullifier.clone(),
            proof_data: proof_data.clone(),
        };

        let result2 = client.verify_proof(&proof2, &encrypted_data);
        assert!(!result2.valid); // Should be invalid due to reused nullifier
    }

    #[test]
    fn test_credential_registration() {
        let env = Env::default();
        let contract_id = env.register_contract(None, PrivacyVerifier);
        let client = PrivacyVerifierClient::new(&env, &contract_id);

        let admin = Address::generate(&env);
        client.initialize(&admin);

        let commitment = BytesN::from_array(&env, &[1u8; 32]);

        // Register credential
        client.register_credential(&admin, &commitment);

        // Check credential exists
        assert!(client.has_credential(&commitment));
    }

    #[test]
    fn test_nullifier_tracking() {
        let env = Env::default();
        let contract_id = env.register_contract(None, PrivacyVerifier);
        let client = PrivacyVerifierClient::new(&env, &contract_id);

        let admin = Address::generate(&env);
        client.initialize(&admin);

        let nullifier = BytesN::from_array(&env, &[2u8; 32]);

        // Initially not used
        assert!(!client.is_nullifier_used(&nullifier));

        // Use the nullifier
        let proof = Proof {
            commitment: BytesN::from_array(&env, &[1u8; 32]),
            nullifier: nullifier.clone(),
            proof_data: Bytes::from_array(&env, &[3u8; 128]),
        };

        let encrypted_data = Bytes::from_array(&env, &[4u8; 64]);
        client.verify_proof(&proof, &encrypted_data);

        // Now it should be used
        assert!(client.is_nullifier_used(&nullifier));

        // Can retrieve block number
        let block = client.get_nullifier_block(&nullifier);
        assert!(block.is_some());
    }
}
