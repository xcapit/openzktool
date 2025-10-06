# Soroban Smart Contracts

Zero-knowledge proof verifier for Stellar blockchain.

## Overview

This contract verifies ZK-SNARK proofs on-chain:
- Verify proofs without revealing secrets
- Prevent double-spending (nullifier set)
- Register KYC credentials
- Track verification history
- Emit events for audit trail

---

## Quick Start

### Prerequisites

Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

Install Soroban CLI
cargo install --locked soroban-cli --version 20.0.0

Add wasm32 target
rustup target add wasm32-unknown-unknown

Verify installation
soroban --version

### Build and Test

Run tests
cargo test

Build contract
cargo build --release --target wasm32-unknown-unknown

Optimize (optional)
soroban contract optimize --wasm target/wasm32-unknown-unknown/release/stellar_privacy_verifier.wasm

Expected Output:
running 5 tests
test test::test_initialize ... ok
test test::test_verify_proof ... ok
test test::test_cannot_reuse_nullifier ... ok
test test::test_credential_registration ... ok
test test::test_nullifier_tracking ... ok

test result: ok. 5 passed; 0 failed

---

## Contract Functions

### initialize(admin: Address)
Initialize contract with admin address.

Parameters:
- admin - Admin address for privileged operations

Example:
client.initialize(&admin_address);

---

### verify_proof(proof: Proof, encrypted_data: Bytes) -> VerificationResult
Verify a zero-knowledge proof.

Parameters:
- proof - ZK proof structure (commitment, nullifier, proof_data)
- encrypted_data - Encrypted transaction data for audit

Returns:
- VerificationResult - Contains valid (bool) and timestamp (u64)

Checks:
1. Nullifier not previously used
2. Proof cryptographically valid
3. Marks nullifier as used
4. Emits verification event

Example:
let proof = Proof {
    commitment: BytesN::from_array(&env, &[1u8; 32]),
    nullifier: BytesN::from_array(&env, &[2u8; 32]),
    proof_data: Bytes::from_array(&env, &[3u8; 128]),
};

let encrypted = Bytes::from_array(&env, &[4u8; 64]);
let result = client.verify_proof(&proof, &encrypted);

if result.valid {
    // Proof verified!
}

---

### is_nullifier_used(nullifier: BytesN<32>) -> bool
Check if a nullifier has been used.

Parameters:
- nullifier - Nullifier to check

Returns:
- bool - True if used, false otherwise

Example:
if client.is_nullifier_used(&nullifier) {
    // Already used - reject!
}

---

### get_nullifier_block(nullifier: BytesN<32>) -> Option<u64>
Get block number when nullifier was used.

Parameters:
- nullifier - Nullifier to query

Returns:
- Option<u64> - Block number or None
