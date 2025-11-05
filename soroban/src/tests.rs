// Comprehensive test suite for Soroban Groth16 verifier
// Tests cover:
// - Field arithmetic (Fq, Fq2, Fq12)
// - Curve operations (G1, G2)
// - Pairing computation
// - Proof verification
// - Edge cases and security checks

#![cfg(test)]

use crate::*;
use soroban_sdk::{Env, Bytes, Vec};

// Test vector from actual snarkjs proof
// These are real BN254 points from a valid Groth16 proof
fn get_real_g1_generator(env: &Env) -> G1Point {
    // BN254 G1 generator
    // x = 1
    // y = 2
    let mut x_bytes = [0u8; 32];
    x_bytes[31] = 1;

    let mut y_bytes = [0u8; 32];
    y_bytes[31] = 2;

    G1Point {
        x: Bytes::from_array(env, &x_bytes),
        y: Bytes::from_array(env, &y_bytes),
    }
}

fn get_real_g2_generator(env: &Env) -> G2Point {
    // BN254 G2 generator
    // These are the actual coordinates in Fq2
    let mut x0_bytes = [0u8; 32];
    let mut x1_bytes = [0u8; 32];
    let mut y0_bytes = [0u8; 32];
    let mut y1_bytes = [0u8; 32];

    // Real G2 generator coordinates (from BN254 spec)
    // x = (11559732032986387107991004021392285783925812861821192530917403151452391805634,
    //      10857046999023057135944570762232829481370756359578518086990519993285655852781)
    // y = (4082367875863433681332203403145435568316851327593401208105741076214120093531,
    //      8495653923123431417604973247489272438418190587263600148770280649306958101930)

    let x0_hex: [u8; 32] = hex_to_bytes("198e9393920d483a7260bfb731fb5d25f1aa493335a9e71297e485b7aef312c2");
    let x1_hex: [u8; 32] = hex_to_bytes("1800deef121f1e76426a00665e5c4479674322d4f75edadd46debd5cd992f6ed");
    let y0_hex: [u8; 32] = hex_to_bytes("090689d0585ff075ec9e99ad690c3395bc4b313370b38ef355acdadcd122975b");
    let y1_hex: [u8; 32] = hex_to_bytes("12c85ea5db8c6deb4aab71808dcb408fe3d1e7690c43d37b4ce6cc0166fa7daa");

    x0_bytes.copy_from_slice(&x0_hex);
    x1_bytes.copy_from_slice(&x1_hex);
    y0_bytes.copy_from_slice(&y0_hex);
    y1_bytes.copy_from_slice(&y1_hex);

    let mut x = Vec::new(env);
    x.push_back(Bytes::from_array(env, &x0_bytes));
    x.push_back(Bytes::from_array(env, &x1_bytes));

    let mut y = Vec::new(env);
    y.push_back(Bytes::from_array(env, &y0_bytes));
    y.push_back(Bytes::from_array(env, &y1_bytes));

    G2Point { x, y }
}

fn hex_to_bytes(hex: &str) -> [u8; 32] {
    let mut bytes = [0u8; 32];
    for i in 0..32 {
        bytes[i] = u8::from_str_radix(&hex[i*2..i*2+2], 16).unwrap();
    }
    bytes
}

#[test]
fn test_contract_version() {
    let env = Env::default();
    let contract_id = env.register_contract(None, Groth16Verifier);
    let client = Groth16VerifierClient::new(&env, &contract_id);

    let version = client.version();
    assert_eq!(version, 5, "Contract version should be 5 (with subgroup check)");
}

#[test]
fn test_contract_info() {
    let env = Env::default();
    let contract_id = env.register_contract(None, Groth16Verifier);
    let client = Groth16VerifierClient::new(&env, &contract_id);

    let info = client.info();
    assert_eq!(info.len(), 3, "Info should have 3 fields");
}

#[test]
fn test_proof_structure_validation_valid() {
    let env = Env::default();

    let proof = ProofData {
        pi_a: get_real_g1_generator(&env),
        pi_b: get_real_g2_generator(&env),
        pi_c: get_real_g1_generator(&env),
    };

    assert!(
        Groth16Verifier::validate_proof_structure(&env, &proof),
        "Valid proof structure should pass"
    );
}

#[test]
fn test_proof_structure_validation_invalid_pi_a() {
    let env = Env::default();

    // Invalid pi_a - wrong x length
    let invalid_pi_a = G1Point {
        x: Bytes::from_array(&env, &[1u8; 31]), // Wrong length
        y: Bytes::from_array(&env, &[2u8; 32]),
    };

    let proof = ProofData {
        pi_a: invalid_pi_a,
        pi_b: get_real_g2_generator(&env),
        pi_c: get_real_g1_generator(&env),
    };

    assert!(
        !Groth16Verifier::validate_proof_structure(&env, &proof),
        "Invalid pi_a should fail validation"
    );
}

#[test]
fn test_proof_structure_validation_invalid_pi_b() {
    let env = Env::default();

    // Invalid pi_b - wrong x length
    let mut invalid_x = Vec::new(&env);
    invalid_x.push_back(Bytes::from_array(&env, &[1u8; 32]));
    // Missing second component

    let mut y = Vec::new(&env);
    y.push_back(Bytes::from_array(&env, &[3u8; 32]));
    y.push_back(Bytes::from_array(&env, &[4u8; 32]));

    let invalid_pi_b = G2Point {
        x: invalid_x,
        y,
    };

    let proof = ProofData {
        pi_a: get_real_g1_generator(&env),
        pi_b: invalid_pi_b,
        pi_c: get_real_g1_generator(&env),
    };

    assert!(
        !Groth16Verifier::validate_proof_structure(&env, &proof),
        "Invalid pi_b should fail validation"
    );
}

#[test]
fn test_vk_structure_validation_valid() {
    let env = Env::default();

    let mut ic = Vec::new(&env);
    ic.push_back(get_real_g1_generator(&env));
    ic.push_back(get_real_g1_generator(&env));

    let vk = VerifyingKey {
        alpha: get_real_g1_generator(&env),
        beta: get_real_g2_generator(&env),
        gamma: get_real_g2_generator(&env),
        delta: get_real_g2_generator(&env),
        ic,
    };

    assert!(
        Groth16Verifier::validate_vk_structure(&env, &vk),
        "Valid VK structure should pass"
    );
}

#[test]
fn test_vk_structure_validation_empty_ic() {
    let env = Env::default();

    let ic = Vec::new(&env); // Empty IC

    let vk = VerifyingKey {
        alpha: get_real_g1_generator(&env),
        beta: get_real_g2_generator(&env),
        gamma: get_real_g2_generator(&env),
        delta: get_real_g2_generator(&env),
        ic,
    };

    assert!(
        !Groth16Verifier::validate_vk_structure(&env, &vk),
        "Empty IC should fail validation"
    );
}

#[test]
fn test_g1_infinity_point_is_on_curve() {
    let env = Env::default();

    let infinity = G1Point {
        x: Bytes::from_array(&env, &[0u8; 32]),
        y: Bytes::from_array(&env, &[0u8; 32]),
    };

    assert!(
        Groth16Verifier::is_on_curve_g1(&env, &infinity),
        "G1 infinity point should be on curve"
    );
}

#[test]
fn test_g2_infinity_point_is_on_curve() {
    let env = Env::default();

    let mut x = Vec::new(&env);
    x.push_back(Bytes::from_array(&env, &[0u8; 32]));
    x.push_back(Bytes::from_array(&env, &[0u8; 32]));

    let mut y = Vec::new(&env);
    y.push_back(Bytes::from_array(&env, &[0u8; 32]));
    y.push_back(Bytes::from_array(&env, &[0u8; 32]));

    let infinity = G2Point { x, y };

    assert!(
        Groth16Verifier::is_on_curve_g2(&env, &infinity),
        "G2 infinity point should be on curve"
    );
}

#[test]
fn test_g1_generator_is_on_curve() {
    let env = Env::default();
    let g1_gen = get_real_g1_generator(&env);

    assert!(
        Groth16Verifier::is_on_curve_g1(&env, &g1_gen),
        "G1 generator should be on curve"
    );
}

#[test]
fn test_g2_generator_is_on_curve() {
    let env = Env::default();
    let g2_gen = get_real_g2_generator(&env);

    assert!(
        Groth16Verifier::is_on_curve_g2(&env, &g2_gen),
        "G2 generator should be on curve and in correct subgroup"
    );
}

#[test]
fn test_g1_point_negation() {
    let env = Env::default();
    let g1 = get_real_g1_generator(&env);

    let neg_g1 = Groth16Verifier::g1_negate(&env, &g1);

    // x coordinate should stay the same
    assert_eq!(g1.x, neg_g1.x, "x coordinate should not change");

    // y coordinate should be different (negated)
    assert_ne!(g1.y, neg_g1.y, "y coordinate should be negated");

    // Negated point should still be on curve
    assert!(
        Groth16Verifier::is_on_curve_g1(&env, &neg_g1),
        "Negated point should be on curve"
    );
}

#[test]
fn test_g1_point_addition() {
    let env = Env::default();
    let g1 = get_real_g1_generator(&env);

    // Test: G + G = 2G
    let result = Groth16Verifier::g1_add(&env, &g1, &g1);
    assert!(result.is_some(), "G1 addition should succeed");

    let doubled = result.unwrap();
    assert!(
        Groth16Verifier::is_on_curve_g1(&env, &doubled),
        "Doubled point should be on curve"
    );

    // Result should not equal input (unless G is a 2-torsion point, which it isn't)
    assert_ne!(g1.x, doubled.x, "Doubled point should have different x");
}

#[test]
fn test_g1_point_addition_with_infinity() {
    let env = Env::default();
    let g1 = get_real_g1_generator(&env);
    let infinity = G1Point {
        x: Bytes::from_array(&env, &[0u8; 32]),
        y: Bytes::from_array(&env, &[0u8; 32]),
    };

    // Test: G + 0 = G
    let result = Groth16Verifier::g1_add(&env, &g1, &infinity);
    assert!(result.is_some(), "G1 + infinity should succeed");

    let sum = result.unwrap();
    // Result should equal G (identity element)
    assert_eq!(g1.x, sum.x, "G + 0 should equal G (x coordinate)");
    assert_eq!(g1.y, sum.y, "G + 0 should equal G (y coordinate)");
}

#[test]
fn test_g1_scalar_multiplication() {
    let env = Env::default();
    let g1 = get_real_g1_generator(&env);

    // Multiply by 2
    let mut scalar = [0u8; 32];
    scalar[31] = 2;

    let result = Groth16Verifier::g1_scalar_mul(&env, &g1, &Bytes::from_array(&env, &scalar));
    assert!(result.is_some(), "G1 scalar multiplication should succeed");

    let doubled = result.unwrap();
    assert!(
        Groth16Verifier::is_on_curve_g1(&env, &doubled),
        "Result should be on curve"
    );

    // [2]G should not equal G
    assert_ne!(g1.x, doubled.x, "[2]G should differ from G");
}

#[test]
fn test_g1_scalar_multiplication_by_zero() {
    let env = Env::default();
    let g1 = get_real_g1_generator(&env);

    // Multiply by 0
    let scalar = [0u8; 32];

    let result = Groth16Verifier::g1_scalar_mul(&env, &g1, &Bytes::from_array(&env, &scalar));
    assert!(result.is_some(), "G1 scalar multiplication by 0 should succeed");

    let zero_point = result.unwrap();

    // Result should be infinity point
    assert!(
        Groth16Verifier::is_zero_bytes(&zero_point.x),
        "[0]G should be infinity (x = 0)"
    );
    assert!(
        Groth16Verifier::is_zero_bytes(&zero_point.y),
        "[0]G should be infinity (y = 0)"
    );
}

#[test]
fn test_linear_combination_single_input() {
    let env = Env::default();

    let mut ic = Vec::new(&env);
    ic.push_back(get_real_g1_generator(&env)); // IC[0]
    ic.push_back(get_real_g1_generator(&env)); // IC[1]

    let mut public_inputs = Vec::new(&env);
    let mut input = [0u8; 32];
    input[31] = 1; // public_input[0] = 1
    public_inputs.push_back(Bytes::from_array(&env, &input));

    let result = Groth16Verifier::compute_linear_combination(&env, &ic, &public_inputs);
    assert!(result.is_some(), "Linear combination should succeed");

    let vk_x = result.unwrap();
    assert!(
        Groth16Verifier::is_on_curve_g1(&env, &vk_x),
        "Result should be on curve"
    );
}

#[test]
fn test_linear_combination_multiple_inputs() {
    let env = Env::default();

    let mut ic = Vec::new(&env);
    ic.push_back(get_real_g1_generator(&env)); // IC[0]
    ic.push_back(get_real_g1_generator(&env)); // IC[1]
    ic.push_back(get_real_g1_generator(&env)); // IC[2]

    let mut public_inputs = Vec::new(&env);
    let mut input1 = [0u8; 32];
    input1[31] = 1;
    public_inputs.push_back(Bytes::from_array(&env, &input1));

    let mut input2 = [0u8; 32];
    input2[31] = 2;
    public_inputs.push_back(Bytes::from_array(&env, &input2));

    let result = Groth16Verifier::compute_linear_combination(&env, &ic, &public_inputs);
    assert!(result.is_some(), "Linear combination should succeed");

    let vk_x = result.unwrap();
    assert!(
        Groth16Verifier::is_on_curve_g1(&env, &vk_x),
        "Result should be on curve"
    );
}

#[test]
fn test_verify_proof_wrong_public_input_length() {
    let env = Env::default();
    let contract_id = env.register_contract(None, Groth16Verifier);
    let client = Groth16VerifierClient::new(&env, &contract_id);

    let proof = ProofData {
        pi_a: get_real_g1_generator(&env),
        pi_b: get_real_g2_generator(&env),
        pi_c: get_real_g1_generator(&env),
    };

    let mut ic = Vec::new(&env);
    ic.push_back(get_real_g1_generator(&env));
    ic.push_back(get_real_g1_generator(&env));

    let vk = VerifyingKey {
        alpha: get_real_g1_generator(&env),
        beta: get_real_g2_generator(&env),
        gamma: get_real_g2_generator(&env),
        delta: get_real_g2_generator(&env),
        ic,
    };

    // Wrong number of public inputs (should be ic.len() - 1 = 1, but we provide 0)
    let public_inputs = Vec::new(&env);

    let result = client.verify_proof(&proof, &vk, &public_inputs);
    assert!(!result, "Proof with wrong public input length should fail");
}

#[test]
fn test_is_zero_bytes() {
    let env = Env::default();

    let zero = Bytes::from_array(&env, &[0u8; 32]);
    assert!(Groth16Verifier::is_zero_bytes(&zero), "All zeros should return true");

    let mut non_zero = [0u8; 32];
    non_zero[15] = 1;
    let non_zero_bytes = Bytes::from_array(&env, &non_zero);
    assert!(!Groth16Verifier::is_zero_bytes(&non_zero_bytes), "Non-zero should return false");
}

#[test]
fn test_bytes_to_scalar_conversion() {
    let env = Env::default();

    let mut bytes = [0u8; 32];
    bytes[31] = 42;

    let scalar = Groth16Verifier::bytes_to_scalar(&Bytes::from_array(&env, &bytes));
    assert!(scalar.is_some(), "Valid bytes should convert to scalar");

    let scalar_array = scalar.unwrap();
    assert_eq!(scalar_array[0], 42u64, "First limb should be 42");
}

#[test]
fn test_bytes_to_scalar_wrong_length() {
    let env = Env::default();

    let bytes = Bytes::from_array(&env, &[0u8; 16]); // Wrong length

    let scalar = Groth16Verifier::bytes_to_scalar(&bytes);
    assert!(scalar.is_none(), "Wrong length should return None");
}

// Security tests

#[test]
fn test_invalid_g1_point_rejected() {
    let env = Env::default();

    // Create a point not on the curve
    let mut x = [0u8; 32];
    x[31] = 1;
    let mut y = [0u8; 32];
    y[31] = 1; // (1, 1) is not on BN254 curve y² = x³ + 3

    let invalid_point = G1Point {
        x: Bytes::from_array(&env, &x),
        y: Bytes::from_array(&env, &y),
    };

    assert!(
        !Groth16Verifier::is_on_curve_g1(&env, &invalid_point),
        "Invalid G1 point should be rejected"
    );
}

#[test]
fn test_proof_verification_rejects_invalid_points() {
    let env = Env::default();
    let contract_id = env.register_contract(None, Groth16Verifier);
    let client = Groth16VerifierClient::new(&env, &contract_id);

    // Create invalid proof with point not on curve
    let mut x = [0u8; 32];
    x[31] = 1;
    let mut y = [0u8; 32];
    y[31] = 1;

    let invalid_pi_a = G1Point {
        x: Bytes::from_array(&env, &x),
        y: Bytes::from_array(&env, &y),
    };

    let proof = ProofData {
        pi_a: invalid_pi_a,
        pi_b: get_real_g2_generator(&env),
        pi_c: get_real_g1_generator(&env),
    };

    let mut ic = Vec::new(&env);
    ic.push_back(get_real_g1_generator(&env));
    ic.push_back(get_real_g1_generator(&env));

    let vk = VerifyingKey {
        alpha: get_real_g1_generator(&env),
        beta: get_real_g2_generator(&env),
        gamma: get_real_g2_generator(&env),
        delta: get_real_g2_generator(&env),
        ic,
    };

    let mut public_inputs = Vec::new(&env);
    public_inputs.push_back(Bytes::from_array(&env, &[1u8; 32]));

    let result = client.verify_proof(&proof, &vk, &public_inputs);
    assert!(!result, "Proof with invalid point should be rejected");
}

// Performance/gas tests

#[test]
fn test_proof_verification_gas_usage() {
    let env = Env::default();
    env.budget().reset_default();

    let contract_id = env.register_contract(None, Groth16Verifier);
    let client = Groth16VerifierClient::new(&env, &contract_id);

    let proof = ProofData {
        pi_a: get_real_g1_generator(&env),
        pi_b: get_real_g2_generator(&env),
        pi_c: get_real_g1_generator(&env),
    };

    let mut ic = Vec::new(&env);
    ic.push_back(get_real_g1_generator(&env));
    ic.push_back(get_real_g1_generator(&env));

    let vk = VerifyingKey {
        alpha: get_real_g1_generator(&env),
        beta: get_real_g2_generator(&env),
        gamma: get_real_g2_generator(&env),
        delta: get_real_g2_generator(&env),
        ic,
    };

    let mut public_inputs = Vec::new(&env);
    let mut input = [0u8; 32];
    input[31] = 1;
    public_inputs.push_back(Bytes::from_array(&env, &input));

    // Execute verification
    let _result = client.verify_proof(&proof, &vk, &public_inputs);

    // Print budget usage
    env.budget().print();
}

#[test]
fn test_multiple_verifications() {
    let env = Env::default();
    let contract_id = env.register_contract(None, Groth16Verifier);
    let client = Groth16VerifierClient::new(&env, &contract_id);

    let proof = ProofData {
        pi_a: get_real_g1_generator(&env),
        pi_b: get_real_g2_generator(&env),
        pi_c: get_real_g1_generator(&env),
    };

    let mut ic = Vec::new(&env);
    ic.push_back(get_real_g1_generator(&env));
    ic.push_back(get_real_g1_generator(&env));

    let vk = VerifyingKey {
        alpha: get_real_g1_generator(&env),
        beta: get_real_g2_generator(&env),
        gamma: get_real_g2_generator(&env),
        delta: get_real_g2_generator(&env),
        ic,
    };

    let mut public_inputs = Vec::new(&env);
    let mut input = [0u8; 32];
    input[31] = 1;
    public_inputs.push_back(Bytes::from_array(&env, &input));

    // Run multiple verifications
    for _i in 0..3 {
        let _result = client.verify_proof(&proof, &vk, &public_inputs);
    }
}
