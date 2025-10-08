#![no_std]
extern crate alloc;

// SPDX-License-Identifier: AGPL-3.0-or-later
// -----------------------------------------------------------------------------
//  Stellar Privacy Proof-of-Concept – Soroban Verifier (Groth16 on BN254)
// -----------------------------------------------------------------------------
// Verifies Groth16 proofs generated from the same Circom circuits used by the
// EVM `Verifier.sol`, so both chains accept the identical proof/inputs.
//
// Contract entrypoint: `verify_proof(a, b, c, input)`
// - a: (ax, ay) as U256
// - b: ((bx1, bx2), (by1, by2)) as U256
// - c: (cx, cy) as U256
// - input: Vec<U256> public signals
//
// Fill the VK constants in `vk()` with the values exported from snarkjs.
// -----------------------------------------------------------------------------

use alloc::{vec, vec::Vec};
use soroban_sdk::{contract, contractimpl, symbol_short, Env, Vec as SVec, U256};

use ark_bn254::{Bn254, Fq, Fr, G1Affine, G2Affine};
use ark_groth16::{prepare_verifying_key, verify_proof, Proof, VerifyingKey};
use ark_serialize::{CanonicalDeserialize, CanonicalSerialize};

#[contract]
pub struct Groth16Verifier;

#[contractimpl]
impl Groth16Verifier {
    /// Verify a Groth16 proof over BN254 with the same layout as Solidity verifier.
    /// Returns true if valid.
    pub fn verify_proof(
        _env: Env,
        a: (U256, U256),
        b: ((U256, U256), (U256, U256)),
        c: (U256, U256),
        input: SVec<U256>,
    ) -> bool {
        // Convert inputs
        let a_g1 = g1_from_u256(a.0, a.1);
        let b_g2 = g2_from_u256(b.0 .0, b.0 .1, b.1 .0, b.1 .1);
        let c_g1 = g1_from_u256(c.0, c.1);

        let proof = Proof::<Bn254> {
            a: a_g1,
            b: b_g2,
            c: c_g1,
        };

        let public_inputs: Vec<Fr> = input
            .iter()
            .map(|u| fr_from_u256(u))
            .collect();

        // Load VK (TODO: fill constants below)
        let vk = vk();
        if public_inputs.len() + 1 != vk.ic.len() {
            return false;
        }

        let pvk = prepare_verifying_key(&vk);
        verify_proof(&pvk, &proof, &public_inputs).unwrap_or(false)
    }
}

// ---------------------------- Conversions ------------------------------------

fn fq_from_u256(x: &U256) -> Fq {
    // U256 -> big-endian 32 bytes -> Fq
    let mut be = [0u8; 32];
    x.to_be_bytes(&mut be);
    Fq::from_be_bytes_mod_order(&be)
}

fn fr_from_u256(x: &U256) -> Fr {
    let mut be = [0u8; 32];
    x.to_be_bytes(&mut be);
    Fr::from_be_bytes_mod_order(&be)
}

fn g1_from_u256(x: U256, y: U256) -> G1Affine {
    let px = fq_from_u256(&x);
    let py = fq_from_u256(&y);
    G1Affine::new(px, py)
}

fn g2_from_u256(x1: U256, x2: U256, y1: U256, y2: U256) -> G2Affine {
    use ark_bn254::Fq2;
    let x = Fq2::new(fq_from_u256(&x1), fq_from_u256(&x2));
    let y = Fq2::new(fq_from_u256(&y1), fq_from_u256(&y2));
    G2Affine::new(x, y)
}

// ------------------------- Verifying Key (PLACEHOLDER) -----------------------
// IMPORTANT: Replace the placeholders with real VK constants using the helper
// script below. These must match the zkey produced for kyc_transfer.circom.

fn vk() -> VerifyingKey<Bn254> {
    use ark_bn254::Fq2;
    // Alfa1 (G1), Beta2/Gamma2/Delta2 (G2), IC (Vec<G1>)
    // Replace with real values
    let alfa1 = g1_from_u256(u256(1), u256(2));

    let beta2 = {
        let x = Fq2::new(fq_from_u256(&u256(3)), fq_from_u256(&u256(4)));
        let y = Fq2::new(fq_from_u256(&u256(5)), fq_from_u256(&u256(6)));
        G2Affine::new(x, y)
    };

    let gamma2 = {
        let x = Fq2::new(fq_from_u256(&u256(7)), fq_from_u256(&u256(8)));
        let y = Fq2::new(fq_from_u256(&u256(9)), fq_from_u256(&u256(10)));
        G2Affine::new(x, y)
    };

    let delta2 = {
        let x = Fq2::new(fq_from_u256(&u256(11)), fq_from_u256(&u256(12)));
        let y = Fq2::new(fq_from_u256(&u256(13)), fq_from_u256(&u256(14)));
        G2Affine::new(x, y)
    };

    // Minimal IC with 1 element (adjust length to match your circuit public inputs + 1)
    let ic: Vec<G1Affine> = vec![
        g1_from_u256(u256(1), u256(2)),
        // push more IC points here...
    ];

    VerifyingKey::<Bn254> {
        alpha_g1: alfa1,
        beta_g2: beta2,
        gamma_g2: gamma2,
        delta_g2: delta2,
        ic,
    }
}

fn u256(n: u64) -> U256 {
    U256::from_u128(n as u128)
}
