#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

OUT=artifacts
EVM_OUT=../evm
SOROBAN_OUT=../soroban

mkdir -p $EVM_OUT $SOROBAN_OUT

echo "🧱 Exporting Solidity verifier..."
snarkjs zkey export solidityverifier $OUT/kyc_transfer_final.zkey $EVM_OUT/Verifier.sol
echo "✅ Solidity verifier saved to $EVM_OUT/Verifier.sol"

echo "🦀 Generating Soroban-compatible verifier..."
cat > $SOROBAN_OUT/verifier_contract.rs <<'RUST'
//! Soroban Groth16 Verifier (template)

#![no_std]
use soroban_sdk::{contract, contractimpl, symbol_short, vec, Env, Bytes, BytesN, Symbol};

#[contract]
pub struct Groth16Verifier;

#[contractimpl]
impl Groth16Verifier {
    pub fn verify(env: Env, proof: Bytes, public_inputs: Bytes) -> bool {
        // Placeholder logic — replace with real verifier after integration
        env.events().publish((symbol_short!("verify"),), proof.clone());
        env.log().debug("Groth16 verification called (stub)");
        true
    }
}

#[cfg(test)]
mod test {
    use super::*;
    use soroban_sdk::{testutils::EnvTestUtils};

    #[test]
    fn test_verify_stub() {
        let env = Env::default();
        let verifier = Groth16Verifier;
        let ok = verifier.verify(env.clone(), Bytes::from_array(&env, &[1,2,3]), Bytes::from_array(&env, &[4,5]));
        assert!(ok);
    }
}
RUST
echo "✅ Soroban verifier created at $SOROBAN_OUT/verifier_contract.rs"
