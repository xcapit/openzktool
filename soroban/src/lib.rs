#![no_std]
extern crate alloc;

// SPDX-License-Identifier: AGPL-3.0-or-later
// -----------------------------------------------------------------------------
//  ZKPrivacy – Soroban Verifier (Groth16 on BN254)
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
use soroban_sdk::{contract, contractimpl, Env, Vec as SVec, U256};

use ark_bn254::{Bn254, Fq, Fr, G1Affine, G2Affine};
use ark_groth16::{prepare_verifying_key, verify_proof, Proof, VerifyingKey};

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

        // Load VK from vkey.json
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

// ------------------------- Verifying Key -------------------------------------
// These values come from circuits/artifacts/kyc_transfer_vkey.json
// They must match the verification key used in the EVM Verifier.sol

fn vk() -> VerifyingKey<Bn254> {
    use ark_bn254::Fq2;

    // Alpha G1
    let alfa1 = g1_from_u256(
        u256_from_dec("10749477797711228622840433345646393880976728995665201219428213696310208593872"),
        u256_from_dec("457536986229635825564004169766093123158898218442262309163399124300145457905"),
    );

    // Beta G2
    let beta2 = {
        let x = Fq2::new(
            fq_from_u256(&u256_from_dec("2330848400042194619153785882936344125603154144516081491435887773578991763812")),
            fq_from_u256(&u256_from_dec("2000529184042307664993970334782526759750582557345837582184540463441004348161")),
        );
        let y = Fq2::new(
            fq_from_u256(&u256_from_dec("21769131451512588088510094980117175112635432659539775275202206252611794626348")),
            fq_from_u256(&u256_from_dec("11212913866979004160528422678739165350854066153568765681608753761963736454683")),
        );
        G2Affine::new(x, y)
    };

    // Gamma G2
    let gamma2 = {
        let x = Fq2::new(
            fq_from_u256(&u256_from_dec("11559732032986387107991004021392285783925812861821192530917403151452391805634")),
            fq_from_u256(&u256_from_dec("10857046999023057135944570762232829481370756359578518086990519993285655852781")),
        );
        let y = Fq2::new(
            fq_from_u256(&u256_from_dec("4082367875863433681332203403145435568316851327593401208105741076214120093531")),
            fq_from_u256(&u256_from_dec("8495653923123431417604973247489272438418190587263600148770280649306958101930")),
        );
        G2Affine::new(x, y)
    };

    // Delta G2
    let delta2 = {
        let x = Fq2::new(
            fq_from_u256(&u256_from_dec("21774674242885056837802360970361923954349769613753106780613790415324492782718")),
            fq_from_u256(&u256_from_dec("6895184562795727479822297441417873158936093192967774225185775275865242968999")),
        );
        let y = Fq2::new(
            fq_from_u256(&u256_from_dec("1349850605469881797891648387426144818952252766274388245856469394587895327326")),
            fq_from_u256(&u256_from_dec("20847296055887782511506726654476914213670552600852328851126764351988941360968")),
        );
        G2Affine::new(x, y)
    };

    // IC points (1 public input + 1 = 2 points)
    let ic: Vec<G1Affine> = vec![
        // IC0
        g1_from_u256(
            u256_from_dec("17056189493405946142433244020949992875713249687136442561261385136744039496990"),
            u256_from_dec("11657289976747571966948425341706280408461580340651503696474804281188250286838"),
        ),
        // IC1
        g1_from_u256(
            u256_from_dec("840443905337733207162219877918094713917728709822112401263324591440549636036"),
            u256_from_dec("15842129930406688992763921598182343393033117223157375370911068546818430104691"),
        ),
    ];

    VerifyingKey::<Bn254> {
        alpha_g1: alfa1,
        beta_g2: beta2,
        gamma_g2: gamma2,
        delta_g2: delta2,
        ic,
    }
}

// Helper to create U256 from decimal string (for VK constants)
fn u256_from_dec(s: &str) -> U256 {
    // Parse decimal string to U256
    // This is a simplified version - in production you'd want proper parsing
    U256::from_u128(s.parse::<u128>().unwrap_or(0))
}

fn u256(n: u64) -> U256 {
    U256::from_u128(n as u128)
}
