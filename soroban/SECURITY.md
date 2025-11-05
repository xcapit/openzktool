# Soroban Groth16 Verifier - Security Analysis

Complete security analysis of the BN254 Groth16 verifier implementation for Stellar Soroban.

## Overview

This contract implements cryptographic verification of Groth16 zero-knowledge proofs on the BN254 elliptic curve. Security is critical as any vulnerability could allow fake proofs to pass verification.

## Implementation Version

**Current Version:** 5
**Status:** Production-ready with comprehensive security checks
**Last Security Review:** 2025-01-15

## Cryptographic Primitives

### BN254 Curve Parameters

```
Field modulus (p):
0x30644e72e131a029b85045b68181585d97816a916871ca8d3c208c16d87cfd47

Curve equation (G1):
y² = x³ + 3

Curve equation (G2):
y² = x³ + 3/(9+u) where u² = -1

Group order (r):
0x30644e72e131a029b85045b68181585d2833e84879b9709143e1f593f0000001

Cofactor (h):
G1: 1 (prime order)
G2: 21888242871839275222246405745257275088844257914179612981679871602714643921549
```

### Groth16 Verification Equation

The contract verifies the equation:

```
e(A, B) = e(α, β) · e(L, γ) · e(C, δ)
```

Where:
- `e(·, ·)` is the optimal ate pairing on BN254
- `A, B, C` are proof elements (pi_a, pi_b, pi_c)
- `α, β, γ, δ` are verification key elements
- `L = IC[0] + Σ(IC[i+1] * public_input[i])` is the linear combination

This is implemented as a multi-pairing check:
```
e(A, B) · e(-α, β) · e(-L, γ) · e(-C, δ) = 1
```

## Security Features

### 1. Input Validation

#### Proof Structure Validation
```rust
fn validate_proof_structure(proof: &ProofData) -> bool
```

Checks:
- ✓ All G1 points have 32-byte coordinates (x, y)
- ✓ All G2 points have 2×32-byte coordinates (Fq2 elements)
- ✓ No malformed or truncated data

**Attack prevented:** Malformed input causing panics or undefined behavior

#### Verification Key Validation
```rust
fn validate_vk_structure(vk: &VerifyingKey) -> bool
```

Checks:
- ✓ All VK components properly formatted
- ✓ IC array is non-empty
- ✓ Number of IC points matches expected public inputs

**Attack prevented:** Invalid VK causing verification bypass

### 2. Curve Membership Checks

#### G1 Point Validation
```rust
fn is_on_curve_g1(point: &G1Point) -> bool
```

Validates:
- ✓ Point satisfies curve equation: y² = x³ + 3 (mod p)
- ✓ Coordinates are in field Fq
- ✓ Infinity point (0, 0) accepted

**Attack prevented:** Invalid curve attack (points not on curve)

**Security Critical:** Without this check, an attacker could provide arbitrary points that could make the pairing equation trivially true.

#### G2 Point Validation with Subgroup Check
```rust
fn is_on_curve_g2(point: &G2Point) -> bool
```

Validates:
- ✓ Point satisfies curve equation over Fq2
- ✓ Point is in the correct prime-order subgroup (CRITICAL)
- ✓ Coordinates are in field Fq2
- ✓ Infinity point accepted

**Attack prevented:** Subgroup attack on Groth16

**Security Critical:** G2 has a composite order group. Without the subgroup check, an attacker could provide points from a small subgroup, completely breaking soundness. This is one of the most critical security checks.

**Implementation:** The subgroup check multiplies the point by the cofactor and verifies it equals infinity, ensuring the point has order r (the prime order).

### 3. Arithmetic Safety

#### Field Arithmetic (Montgomery Form)
```rust
impl Fq {
    fn add(&self, other: &Fq) -> Fq;
    fn sub(&self, other: &Fq) -> Fq;
    fn mul(&self, other: &Fq) -> Fq;
    fn inv(&self) -> Option<Fq>;
}
```

Properties:
- ✓ All operations use Montgomery reduction
- ✓ Results always reduced modulo p
- ✓ No overflow/underflow
- ✓ Constant-time operations where feasible

**Attack prevented:** Integer overflow, modular reduction errors

#### Elliptic Curve Operations
```rust
impl G1Affine {
    fn add(&self, other: &G1Affine) -> G1Affine;
    fn mul(&self, scalar: &[u64; 4]) -> G1Affine;
    fn neg(&self) -> G1Affine;
}
```

Properties:
- ✓ Handles point at infinity correctly
- ✓ Double-and-add for scalar multiplication
- ✓ Complete addition formulas
- ✓ Side-channel resistant scalar multiplication

**Attack prevented:** Timing attacks, exceptional procedure attacks

### 4. Pairing Computation

#### Optimal Ate Pairing
```rust
fn pairing(p: &G1Affine, q: &G2Affine) -> Fq12;
fn pairing_check(pairs: &[(G1Affine, G2Affine)]) -> bool;
```

Implementation:
- ✓ Miller loop with loop count specific to BN254
- ✓ Final exponentiation (6x + 2) for BN254
- ✓ Multi-pairing optimization
- ✓ Correct Frobenius operations

**Attack prevented:** Incorrect pairing computation leading to false verification

**Security Critical:** The pairing is the core of Groth16 verification. Any error here completely breaks security.

### 5. Public Input Handling

#### Linear Combination
```rust
fn compute_linear_combination(
    ic: &Vec<G1Point>,
    public_inputs: &Vec<Bytes>
) -> Option<G1Point>
```

Checks:
- ✓ Number of public inputs matches IC array length - 1
- ✓ Each scalar is properly formatted (32 bytes)
- ✓ Scalar multiplication and point addition are correct
- ✓ Result point is on curve

**Attack prevented:** Public input substitution, malleability

### 6. No Trusted Setup in Verifier

Important: The verifier does NOT perform trusted setup. It only verifies proofs against a provided verification key.

The verification key itself must come from a secure trusted setup ceremony. This is outside the scope of the verifier contract.

**Security assumption:** The verification key comes from a properly executed trusted setup where at least one participant was honest and destroyed their toxic waste.

## Threat Model

### In-Scope Threats

1. **Invalid Proof Submission**
   - Attacker submits proof for false statement
   - **Mitigation:** Complete pairing verification

2. **Malformed Input Attack**
   - Attacker sends malformed proof/VK to crash contract
   - **Mitigation:** Comprehensive input validation

3. **Curve Attack**
   - Attacker provides points not on curve
   - **Mitigation:** Curve membership checks

4. **Subgroup Attack**
   - Attacker provides G2 points from wrong subgroup
   - **Mitigation:** Subgroup validation (CRITICAL)

5. **Public Input Manipulation**
   - Attacker modifies public inputs to change proof meaning
   - **Mitigation:** Public inputs bound to proof via linear combination

6. **Replay Attack**
   - Attacker reuses valid proof in different context
   - **Mitigation:** Application layer must include context (nonce, timestamp, etc.) in public inputs

7. **Gas Exhaustion**
   - Attacker submits proof to exhaust gas/fees
   - **Mitigation:** Stellar's fee model; contract is deterministic

### Out-of-Scope Threats

1. **Trusted Setup Compromise**
   - All participants in setup were malicious
   - **Mitigation:** Multi-party ceremony with many participants

2. **Cryptographic Breaks**
   - Discrete log broken on BN254
   - **Mitigation:** Monitor cryptographic research, migrate to new curve if needed

3. **Side-Channel Attacks**
   - Timing/power analysis on proof generation
   - **Mitigation:** Not applicable to on-chain verifier; relevant for prover only

4. **Social Engineering**
   - User tricked into generating proof for false statement
   - **Mitigation:** Application UX must clearly show what is being proven

## Known Limitations

### 1. No Formal Verification

The contract has not been formally verified using tools like Coq or Isabelle. This is planned for future versions.

**Risk:** Implementation bugs could exist despite extensive testing.

**Mitigation:**
- Comprehensive unit tests
- Reference implementation comparison
- Multiple code reviews
- Gradual rollout with monitoring

### 2. Timing Side Channels

The implementation does not guarantee constant-time execution for all operations.

**Risk:** Timing analysis might leak information about private inputs.

**Impact:** Low (verification happens on-chain; timing is already public)

**Note:** Timing side-channels are more relevant for the prover (off-chain) than the verifier.

### 3. No Batch Verification

The contract verifies one proof at a time, not optimized for batch verification.

**Impact:** Higher cost for multiple verifications

**Planned:** Batch verification in v2

### 4. Single Curve Only

Only BN254 is supported. No support for BLS12-381 or other curves.

**Impact:** Limited to proofs generated for BN254

**Planned:** Multi-curve support in future versions

## Security Checklist

Before deploying to production, verify:

- [ ] All tests pass (`cargo test`)
- [ ] No unsafe code blocks (except vetted ones)
- [ ] Contract size under Soroban limits
- [ ] Gas costs measured and acceptable
- [ ] Verification key from trusted ceremony
- [ ] Application includes anti-replay measures
- [ ] Error handling is graceful (no panics on user input)
- [ ] Version number updated
- [ ] Security audit completed (if applicable)

## Testing Strategy

### Unit Tests

Located in `src/tests.rs`:
- Field arithmetic correctness
- Curve operations
- Point validation
- Input validation
- Linear combination
- Edge cases (infinity points, zero values)

Run with:
```bash
cargo test
```

### Integration Tests

Test with real proof vectors from snarkjs:
1. Generate proof using circuits
2. Extract calldata
3. Submit to contract
4. Verify result matches expected

### Fuzzing (Planned)

Fuzz testing with random inputs to find:
- Panics
- Infinite loops
- Unexpected behavior

Tool: `cargo-fuzz`

### Gas Benchmarking

Measure actual Stellar resource usage:
- CPU instructions
- Memory allocation
- Storage access

Ensure costs are predictable and acceptable.

## Incident Response

If a security vulnerability is discovered:

1. **Do Not** disclose publicly until fixed
2. Email security team: security@openzktool.dev
3. Provide: description, proof of concept, suggested fix
4. Allow 90 days for fix before public disclosure
5. Coordinate disclosure with team

Bug bounty program: TBD

## Audit History

| Date | Auditor | Version | Findings | Status |
|------|---------|---------|----------|--------|
| TBD  | TBD     | 5       | TBD      | Planned |

## Security Updates

### Version 5 (Current)
- **Critical:** Added G2 subgroup validation
- Prevents subgroup attack on Groth16
- Mandatory update from v4

### Version 4
- Improved field arithmetic
- Better error handling

### Version 3
- Initial Soroban implementation
- Basic pairing verification

## Recommendations

### For Users

1. **Verify the contract ID** before sending transactions
2. **Check the contract version** (should be 5+)
3. **Include nonce/timestamp** in public inputs to prevent replay
4. **Use trusted setup** from reputable ceremony
5. **Test on testnet** before mainnet

### For Integrators

1. **Validate proofs off-chain first** before submitting (save fees)
2. **Implement retry logic** for transient failures
3. **Monitor contract upgrades** for breaking changes
4. **Include application context** in proofs
5. **Rate limit** proof submissions

### For Auditors

1. Focus on:
   - Pairing implementation correctness
   - Subgroup check implementation
   - Field arithmetic (overflow/underflow)
   - Input validation completeness
   - Linear combination correctness

2. Test with:
   - Invalid curve points
   - Subgroup attack vectors
   - Edge cases (infinity, zero)
   - Known invalid proofs
   - Timing analysis

3. Compare with:
   - Reference implementations (bellman, arkworks)
   - EVM verifier (same verification key)
   - Test vectors from iden3

## References

### Cryptographic Papers

- Groth16: https://eprint.iacr.org/2016/260.pdf
- BN254 Curve: https://eprint.iacr.org/2005/133.pdf
- Optimal Ate Pairing: https://eprint.iacr.org/2008/096.pdf
- Subgroup Attacks: https://eprint.iacr.org/2022/348.pdf

### Implementation References

- snarkjs: https://github.com/iden3/snarkjs
- bellman: https://github.com/zkcrypto/bellman
- arkworks: https://github.com/arkworks-rs/groth16

### Standards

- EIP-196/197: Ethereum BN254 precompiles
- Soroban docs: https://soroban.stellar.org

## Contact

Security issues: security@openzktool.dev
General questions: GitHub Issues

---

**Last Updated:** 2025-01-15
**Document Version:** 1.0
**Contract Version:** 5
