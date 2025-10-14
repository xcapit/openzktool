# Cryptographic Implementation Comparison: EVM vs Soroban Groth16 Verifiers

## Executive Summary

This document provides a comprehensive technical comparison between the Groth16 zero-knowledge proof verification implementations on Ethereum Virtual Machine (EVM) and Stellar Soroban platforms. Both implementations verify proofs using the BN254 (alt_bn128) elliptic curve, but employ fundamentally different architectural approaches.

**Key Finding**: Soroban implementation now includes complete pairing cryptography (Version 4), matching EVM's cryptographic capabilities without relying on precompiled contracts.

---

## Table of Contents

1. [Introduction](#introduction)
2. [Architectural Overview](#architectural-overview)
3. [Cryptographic Primitives Comparison](#cryptographic-primitives-comparison)
4. [Implementation Details](#implementation-details)
5. [Performance Analysis](#performance-analysis)
6. [Code Metrics](#code-metrics)
7. [Security Considerations](#security-considerations)
8. [Conclusions](#conclusions)

---

## 1. Introduction

### 1.1 Purpose

Zero-knowledge proofs enable privacy-preserving verification in blockchain systems. Groth16 is one of the most efficient SNARK (Succinct Non-Interactive Argument of Knowledge) schemes, requiring only a single pairing check for verification.

### 1.2 The Groth16 Verification Equation

Both implementations verify the same mathematical equation:

```
e(A, B) = e(α, β) · e(L, γ) · e(C, δ)
```

Where:
- `e(·, ·)` is the optimal ate pairing function
- `A, B, C` are proof elements (pi_a, pi_b, pi_c)
- `α, β, γ, δ` are verification key parameters
- `L` is the linear combination of public inputs

This is typically checked as:

```
e(A, B) · e(-α, β) · e(-L, γ) · e(-C, δ) = 1
```

---

## 2. Architectural Overview

### 2.1 EVM Approach: Precompiled Contracts

EVM provides native precompiled contracts for BN254 operations:

| Address | Function | Gas Cost |
|---------|----------|----------|
| 0x06 | EC Addition (G1) | 150 gas |
| 0x07 | EC Scalar Multiplication (G1) | 6,000 gas |
| 0x08 | Pairing Check | 45,000 + 34,000 per pair |

**Advantages:**
- Native performance (implemented in Go/Rust at client level)
- Battle-tested (used since Byzantium fork, EIP-196/197)
- Minimal contract code (~250 lines of Solidity)
- Low gas costs

**Disadvantages:**
- Black-box operation (no visibility into pairing computation)
- Limited to BN254 curve
- Cannot customize or optimize for specific use cases

### 2.2 Soroban Approach: Pure Rust Implementation

Soroban implements all cryptographic primitives from scratch in Rust (no_std):

**Advantages:**
- Full transparency and auditability
- Portable across any WASM environment
- Extensible to other curves/schemes
- Educational value and documentation
- Complete control over optimization

**Disadvantages:**
- Larger WASM binary size (~10KB vs EVM's native code)
- Potentially higher execution costs
- Requires careful security review

---

## 3. Cryptographic Primitives Comparison

### 3.1 Field Arithmetic

#### EVM
- **Implementation**: Native (part of precompiles)
- **Field**: Fq (prime field, 254 bits)
- **Extension**: Fq2, Fq6, Fq12 (implicit in precompile 0x08)

#### Soroban
- **Implementation**: Custom Montgomery arithmetic
- **Field**: Explicit Fq struct with 4x u64 limbs
- **Extension**: Fully implemented tower extension
  ```
  Fq → Fq2 (u² + 1 = 0)
     → Fq6 (v³ - ξ = 0, ξ = u + 9)
     → Fq12 (w² - v = 0)
  ```
- **Location**: `src/field.rs` (350 lines), `src/fq12.rs` (372 lines)

**Key Operations Implemented**:
- Montgomery multiplication (constant-time)
- Modular inversion (Fermat's little theorem)
- Frobenius endomorphism (for pairing)
- Karatsuba multiplication (for Fq6)

### 3.2 Elliptic Curve Operations

#### EVM Precompile 0x06 & 0x07
```solidity
// Point addition (G1)
staticcall(sub(gas(), 2000), 6, input, 128, output, 64)

// Scalar multiplication (G1)
staticcall(sub(gas(), 2000), 7, input, 96, output, 64)
```

#### Soroban Implementation
```rust
// src/curve.rs (292 lines)

// G1 affine point addition
pub fn add(&self, other: &G1Affine) -> G1Affine {
    // λ = (y2 - y1) / (x2 - x1)
    let dy = other.y.sub(&self.y);
    let dx = other.x.sub(&self.x);
    let lambda = dy.mul(&dx.inverse().unwrap());

    // x3 = λ² - x1 - x2
    // y3 = λ(x1 - x3) - y1
    ...
}

// Scalar multiplication (double-and-add)
pub fn mul(&self, scalar: &[u64; 4]) -> G1Affine {
    let mut result = G1Affine::infinity();
    for each bit in scalar {
        if bit == 1 { result = result.add(temp); }
        temp = temp.double();
    }
    result
}
```

**Comparison**:
- EVM: Black-box, highly optimized
- Soroban: Transparent, standard double-and-add algorithm
- Both support G1 (Fq) and G2 (Fq2) points

### 3.3 Pairing Computation

This is the most significant difference between the two implementations.

#### EVM Precompile 0x08

```solidity
// Pairing check: e(P1,Q1)·e(P2,Q2)·...·e(Pn,Qn) = 1
// Input: 192 bytes per pair (G1 point + G2 point)
// Output: 32 bytes (0x01 if true, 0x00 if false)

function pairingCheck(
    uint256[2] memory a1, uint256[2][2] memory b1,
    uint256[2] memory a2, uint256[2][2] memory b2,
    ...
) internal view returns (bool) {
    uint256[1] memory out;
    bool success;
    assembly {
        success := staticcall(
            sub(gas(), 2000),
            8,              // Precompile address
            input,          // 192n bytes
            768,            // For 4 pairs
            out,
            0x20
        )
    }
    return out[0] != 0;
}
```

**What happens inside (hidden from Solidity)**:
1. Parse input pairs
2. Compute Miller loop for each pair
3. Multiply results
4. Perform final exponentiation
5. Check if result equals 1

#### Soroban Complete Implementation

```rust
// src/pairing.rs (453 lines)

/// Optimal ate pairing for BN254
pub fn pairing(p: &G1Affine, q: &G2Affine) -> Fq12 {
    if p.is_infinity() || q.is_infinity() {
        return Fq12::one();
    }

    // Miller loop: accumulate line functions
    let f = miller_loop(p, q);

    // Final exponentiation: raise to (p^12 - 1) / r
    final_exponentiation(&f)
}

/// Miller loop implementation
fn miller_loop(p: &G1Affine, q: &G2Affine) -> Fq12 {
    let mut f = Fq12::one();
    let mut r = *q;

    // Iterate over ate loop count bits (6u + 2)
    for bit in ate_loop_bits {
        // Double step: f = f² · line_{R,R}(P)
        let (line, doubled) = double_step(&r, p);
        f = f.square().mul(&line);
        r = doubled;

        // Add step if bit = 1
        if bit {
            let (line, added) = add_step(&r, q, p);
            f = f.mul(&line);
            r = added;
        }
    }
    f
}

/// Final exponentiation (optimized for BN curves)
fn final_exponentiation(f: &Fq12) -> Fq12 {
    // Easy part: (p^6 - 1)(p^2 + 1)
    let f1 = easy_part(f);

    // Hard part: (p^4 - p^2 + 1) / r
    hard_part(&f1)
}

/// Multi-pairing for batch verification
pub fn multi_pairing(pairs: &[(G1Affine, G2Affine)]) -> Fq12 {
    let mut f = Fq12::one();
    for (p, q) in pairs {
        let fi = miller_loop(p, q);
        f = f.mul(&fi);
    }
    final_exponentiation(&f)
}

/// Pairing check (Groth16 verification)
pub fn pairing_check(pairs: &[(G1Affine, G2Affine)]) -> bool {
    let result = multi_pairing(pairs);
    result.is_one()
}
```

**Key Components**:

1. **Miller Loop** (70 lines)
   - Implements double-and-add algorithm
   - Evaluates line functions at each step
   - Accumulates results in Fq12

2. **Line Function Evaluation** (30 lines)
   - Computes tangent line for doubling
   - Computes secant line for addition
   - Embeds result in Fq12 (sparse representation)

3. **Final Exponentiation** (60 lines)
   - Easy part: Frobenius maps and multiplications
   - Hard part: Optimal addition chain for BN254
   - Uses curve-specific optimizations

4. **Batch Verification** (20 lines)
   - Combines multiple pairings efficiently
   - Single final exponentiation for all pairs

---

## 4. Implementation Details

### 4.1 Complete File Breakdown

#### EVM (Solidity)

**File**: `circuits/evm/Verifier.sol`
```
Total: 168 lines
- Auto-generated by snarkJS
- Template code: ~30 lines
- Verification key hardcoded: ~60 lines
- Verification logic: ~40 lines
- Assembly for precompiles: ~30 lines
```

**Key Functions**:
```solidity
function verify(
    uint[2] memory a,
    uint[2][2] memory b,
    uint[2] memory c,
    uint[1] memory input
) public view returns (bool)
```

#### Soroban (Rust)

**Complete Module Structure**:

```
soroban/src/
├── lib.rs          (520 lines) - Main contract + integration
├── field.rs        (350 lines) - Fq and Fq2 arithmetic
├── curve.rs        (292 lines) - G1 and G2 operations
├── fq12.rs         (372 lines) - Fq6 and Fq12 tower extension
└── pairing.rs      (453 lines) - Complete pairing implementation

Total: 1,987 lines of Rust (excluding tests and comments)
```

**Key Integration** (`lib.rs`):

```rust
fn verify_pairing_equation(
    env: &Env,
    proof: &ProofData,
    vk: &VerifyingKey,
    vk_x: &G1Point,
) -> bool {
    // 1. Validate points are on curve
    // 2. Convert contract types to affine points
    // 3. Negate G1 points for the equation
    let neg_alpha = alpha.neg();
    let neg_vk_x = vk_x_affine.neg();
    let neg_pi_c = pi_c.neg();

    // 4. Prepare pairs: e(A,B)·e(-α,β)·e(-L,γ)·e(-C,δ) = 1
    let pairs = [
        (pi_a, pi_b),
        (neg_alpha, beta),
        (neg_vk_x, gamma),
        (neg_pi_c, delta),
    ];

    // 5. Perform the pairing check
    pairing_check(&pairs)  // ← Now uses complete implementation!
}
```

### 4.2 Data Structure Comparison

#### EVM
```solidity
// Points are arrays of uint256
uint[2] memory g1_point;           // [x, y] in Fq
uint[2][2] memory g2_point;        // [[x0, x1], [y0, y1]] in Fq2

// Proof structure
struct Proof {
    uint[2] a;        // G1
    uint[2][2] b;     // G2
    uint[2] c;        // G1
}
```

#### Soroban
```rust
// Custom types with Soroban SDK
#[contracttype]
pub struct G1Point {
    pub x: Bytes,  // 32 bytes (big-endian)
    pub y: Bytes,  // 32 bytes
}

#[contracttype]
pub struct G2Point {
    pub x: Vec<Bytes>,  // [x0, x1] each 32 bytes
    pub y: Vec<Bytes>,  // [y0, y1] each 32 bytes
}

// Internal representation
pub struct G1Affine {
    pub x: Fq,          // 4x u64 limbs (Montgomery form)
    pub y: Fq,
    pub infinity: bool,
}

pub struct G2Affine {
    pub x: Fq2,
    pub y: Fq2,
    pub infinity: bool,
}
```

---

## 5. Performance Analysis

### 5.1 EVM Gas Costs

**Groth16 Verification** (4 pairing checks):
```
Base pairing check:  45,000 gas
Additional pairs:    34,000 × 3 = 102,000 gas
G1 operations:       ~1,000 gas
Total:               ~148,000 gas

At 50 gwei:          ~$0.37 (at $2500/ETH)
```

**Breakdown by Operation**:
- EC addition (0x06): 150 gas
- EC mul (0x07): 6,000 gas
- Pairing (0x08): 45,000 + 34,000n gas

### 5.2 Soroban Resource Costs

**Contract Size**:
```
WASM binary: ~10 KB (release build)
- Without optimization: ~50 KB
- With wasm-opt: ~10 KB
```

**Expected CPU/Memory** (estimates):
- Field operations: ~10-50 instructions each
- Pairing computation: ~10,000-50,000 instructions
- Memory: ~100 KB working set

**Note**: Exact Soroban costs depend on network calibration and are still being optimized.

### 5.3 Theoretical Complexity

| Operation | EVM | Soroban | Complexity |
|-----------|-----|---------|------------|
| Field mul | Native | ~40 ops | O(n²) for n limbs |
| Field inv | Native | ~1000 ops | O(log p) via Fermat |
| EC add | Native | ~20 field ops | O(1) affine |
| EC mul | Native | ~256 doubles | O(log n) |
| Pairing | Native | ~5000 field ops | O(log r) Miller + exp |

**Miller Loop Operations**:
- Iterations: ~60 (based on ate parameter)
- Per iteration: 1 Fq12 square + 1 Fq12 mul + line function
- Line function: ~10 Fq2 operations

**Final Exponentiation**:
- Easy part: ~10 Fq12 operations
- Hard part: ~50 Fq12 operations

---

## 6. Code Metrics

### 6.1 Lines of Code

| Component | EVM | Soroban |
|-----------|-----|---------|
| Verification logic | 40 | 520 |
| Field arithmetic | 0 (precompile) | 350 |
| Curve operations | 0 (precompile) | 292 |
| Tower extension | 0 (precompile) | 372 |
| Pairing | 0 (precompile) | 453 |
| **Total** | **168** | **1,987** |

### 6.2 Cyclomatic Complexity

**EVM Verifier**:
- Main function: Complexity 5 (simple branches)
- Assembly blocks: Complexity 1 each
- Overall: Low complexity (template-generated)

**Soroban Verifier**:
- Field ops: Complexity 3-8 per function
- Curve ops: Complexity 5-12 per function
- Miller loop: Complexity 15
- Final exp: Complexity 20
- Overall: Moderate complexity (well-structured)

### 6.3 Test Coverage

**EVM**:
- Integration tests with snarkJS
- Test vectors from Circom compiler
- Limited unit tests (precompiles tested at client level)

**Soroban**:
- 25+ unit tests across all modules
- Property-based tests (identity, associativity)
- Integration tests for full verification
- Test vectors from known proofs

---

## 7. Security Considerations

### 7.1 EVM Security Model

**Strengths**:
- Precompiles audited by Ethereum Foundation
- Used in production for years (Constantinople fork)
- Implementation bugs would affect entire network (incentivized fixes)
- Formal verification of EIP-196/197 spec

**Risks**:
- No visibility into actual computation
- Cannot detect subtle implementation bugs
- Dependent on specific client implementations

### 7.2 Soroban Security Model

**Strengths**:
- Fully auditable code
- Transparent implementation
- Can be formally verified
- Testable at all levels
- Rust memory safety

**Risks**:
- New implementation (less battle-tested)
- Potential for bugs in complex pairing code
- Requires independent security audit
- Timing attacks (constant-time operations needed)

### 7.3 Security Recommendations

**For Soroban Implementation**:

1. **Formal Verification**
   - Verify Montgomery arithmetic correctness
   - Prove pairing bilinearity property
   - Check constant-time execution

2. **Security Audit**
   - Independent third-party review
   - Focus on pairing implementation
   - Side-channel analysis

3. **Testing**
   - Cross-verify with EVM results
   - Test with malicious inputs
   - Fuzz testing for edge cases

4. **Constant-Time Operations**
   - Ensure no secret-dependent branches
   - Use constant-time field operations
   - Avoid timing side channels

---

## 8. Conclusions

### 8.1 Key Achievements

The Soroban Groth16 verifier (Version 4) now includes:

✅ **Complete BN254 field arithmetic** (Fq, Fq2, Fq6, Fq12)
✅ **Full elliptic curve operations** (G1 and G2)
✅ **Optimal ate pairing implementation** (Miller loop + final exp)
✅ **Batch pairing verification** (efficient multi-pairing)
✅ **Production-ready structure** (modular, testable, documented)

### 8.2 Comparison Summary

| Aspect | EVM | Soroban |
|--------|-----|---------|
| **Cryptographic Completeness** | ✅ Full (precompiles) | ✅ Full (native implementation) |
| **Implementation** | Native (black-box) | Rust WASM (transparent) |
| **Code Size** | 168 lines Solidity | 1,987 lines Rust |
| **Binary Size** | N/A (native) | ~10 KB WASM |
| **Auditability** | Limited | Complete |
| **Performance** | Optimal (native) | Good (WASM) |
| **Extensibility** | Limited to BN254 | Can support multiple curves |
| **Battle-Testing** | Production (5+ years) | New (requires audit) |
| **Documentation** | EIP-196/197 | Extensive inline docs |

### 8.3 When to Use Each

**Use EVM Verifier When**:
- Deploying on Ethereum mainnet or EVM L2s
- Minimizing gas costs is critical
- Using standard BN254 Groth16 proofs
- Want battle-tested implementation

**Use Soroban Verifier When**:
- Building on Stellar network
- Need full transparency and auditability
- Want educational implementation
- Planning to extend to other curves
- Require customized optimizations

### 8.4 Future Work

**Optimization Opportunities**:
1. Sparse multiplication in Miller loop
2. Precomputed Frobenius constants
3. Assembly-level field operations
4. Batch inversion techniques
5. Lazy reduction strategies

**Testing & Validation**:
1. Cross-chain test vectors (compare EVM ↔ Soroban)
2. Formal verification of critical paths
3. Performance benchmarking
4. Fuzz testing campaign
5. Independent security audit

**Documentation**:
1. Developer integration guide
2. Performance tuning guide
3. Security best practices
4. Migration guide (EVM → Soroban)

---

## Appendix A: BN254 Curve Parameters

```
# Field modulus (254 bits)
p = 21888242871839275222246405745257275088696311157297823662689037894645226208583

# Curve equation: y² = x³ + 3
b = 3

# Order of G1 and G2
r = 21888242871839275222246405745257275088548364400416034343698204186575808495617

# BN parameter
u = 4965661367192848881

# Ate loop count
ate_loop = 6*u + 2 = 29793968203157093288

# Embedding degree
k = 12

# G1 generator (over Fq)
G1_x = 1
G1_y = 2

# G2 generator (over Fq2)
G2_x = [10857046999023057135944570762232829481370756359578518086990519993285655852781,
        11559732032986387107991004021392285783925812861821192530917403151452391805634]
G2_y = [8495653923123431417604973247489272438418190587263600148770280649306958101930,
        4082367875863433681332203403145435568316851327593401208105741076214120093531]
```

## Appendix B: References

1. **EIP-196**: Precompiled contracts for addition and scalar multiplication on the elliptic curve alt_bn128
   https://eips.ethereum.org/EIPS/eip-196

2. **EIP-197**: Precompiled contracts for optimal ate pairing check on the elliptic curve alt_bn128
   https://eips.ethereum.org/EIPS/eip-197

3. **Groth16 Paper**: "On the Size of Pairing-based Non-interactive Arguments" by Jens Groth (2016)
   https://eprint.iacr.org/2016/260

4. **BN254 Implementation**: "High-Speed Software Implementation of the Optimal Ate Pairing over Barreto-Naehrig Curves"
   https://eprint.iacr.org/2010/354

5. **snarkJS**: JavaScript implementation of zkSNARK schemes
   https://github.com/iden3/snarkjs

6. **Soroban Documentation**: Stellar smart contracts platform
   https://developers.stellar.org/docs/smart-contracts

---

## Document Information

**Version**: 1.0
**Date**: 2025
**Author**: OpenZKTool Development Team
**Repository**: https://github.com/xcapit/stellar-privacy-poc
**License**: AGPL-3.0-or-later

**Related Files**:
- `circuits/evm/Verifier.sol` - EVM Groth16 verifier
- `soroban/src/lib.rs` - Soroban main contract
- `soroban/src/pairing.rs` - Complete pairing implementation
- `soroban/src/fq12.rs` - Tower extension fields
- `soroban/src/curve.rs` - Elliptic curve operations
- `soroban/src/field.rs` - Base field arithmetic

---

*This document demonstrates that the Soroban implementation has achieved feature parity with EVM's precompiled contracts, providing a fully transparent and auditable alternative for Groth16 verification on the Stellar network.*
