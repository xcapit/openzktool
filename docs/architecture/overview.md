# OpenZKTool Architecture

## Overview

OpenZKTool is a Zero-Knowledge SNARK toolkit for privacy-preserving applications on Stellar and EVM-compatible chains. The system enables proving statements about private data without revealing the data itself.

## System Components

```
┌─────────────────────────────────────────────────────────────┐
│                     User Application                         │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│                     SDK Layer (TypeScript)                   │
│  • Proof generation API                                      │
│  • Contract interaction helpers                              │
│  • Input validation                                          │
└─────────────┬───────────────────────────────┬───────────────┘
              │                               │
              ▼                               ▼
┌─────────────────────────┐     ┌─────────────────────────────┐
│   ZK Circuit Layer      │     │   Blockchain Layer          │
│   (Circom + snarkjs)    │     │                             │
│                         │     │  ┌──────────────────────┐   │
│  • Circuit definitions  │     │  │  EVM Contracts       │   │
│  • Witness generation   │     │  │  (Solidity)          │   │
│  • Proof generation     │     │  └──────────────────────┘   │
│  • Trusted setup        │     │                             │
│                         │     │  ┌──────────────────────┐   │
│                         │     │  │  Stellar Contracts   │   │
│                         │     │  │  (Rust/Soroban)      │   │
│                         │     │  └──────────────────────┘   │
└─────────────────────────┘     └─────────────────────────────┘
```

## Data Flow

### Proof Generation Flow

1. **Input Preparation**
   - User provides private inputs (age, balance, country)
   - Application validates input format
   - Public parameters are configured (min age, min balance, allowed countries)

2. **Witness Generation**
   - Circuit compiles inputs into witness data
   - Witness contains all intermediate values needed for proof
   - Circuit constraints are evaluated

3. **Proof Creation**
   - Groth16 prover generates cryptographic proof
   - Proof size: ~800 bytes
   - Generation time: <1 second
   - Output: proof + public signals

4. **On-Chain Verification**
   - Proof submitted to smart contract
   - Contract verifies using Groth16 verifier
   - Returns boolean: valid/invalid

### Circuit: KYC Transfer

```
Inputs (private):
  - age: user's actual age
  - balance: user's actual balance
  - countryId: user's country code

Public parameters:
  - minAge, maxAge: age range requirements
  - minBalance: minimum balance requirement
  - allowedCountries: array of permitted country IDs

Output (public):
  - kycValid: 1 if all checks pass, 0 otherwise

Constraints: 586
```

Circuit logic:
- Range check: minAge ≤ age ≤ maxAge
- Balance check: balance ≥ minBalance
- Country check: countryId ∈ allowedCountries
- Final AND gate: kycValid = rangeCheck AND balanceCheck AND countryCheck

## Smart Contract Architecture

### EVM Implementation

Location: `/evm/contracts/Verifier.sol`

Uses precompiled contracts for BN254 operations:
- 0x06: EC addition (G1)
- 0x07: EC scalar multiplication (G1)
- 0x08: Pairing check

Gas cost: ~250,000 gas per verification

Interface:
```solidity
function verifyProof(
    uint[2] memory a,
    uint[2][2] memory b,
    uint[2] memory c,
    uint[1] memory input
) public view returns (bool)
```

### Stellar Implementation

Location: `/soroban/src/lib.rs`

Pure Rust implementation with:
- BN254 field arithmetic (Fq, Fq2, Fq6, Fq12)
- G1/G2 elliptic curve operations
- Optimal ate pairing
- Miller loop + final exponentiation

WASM size: ~20KB
Contract ID (testnet): `CBPBVJJW5NMV4UVEDKSR6UO4DRBNWRQEMYKRYZI3CW6YK3O7HAZA43OI`

Interface:
```rust
pub fn verify_proof(
    env: Env,
    proof: ProofData,
    vk: VerifyingKey,
    public_inputs: Vec<Bytes>,
) -> bool
```

## SDK Architecture

### Core Modules

**1. Prover Module** (`sdk/src/prover.ts`)
- Loads circuit WASM and proving key
- Generates witnesses from inputs
- Creates Groth16 proofs
- Exports proof data for blockchain submission

**2. Verifier Module** (`sdk/src/verifier.ts`)
- Off-chain proof verification
- Verifying key management
- Public input validation

**3. Contract Module** (`sdk/src/contracts/`)
- EVM contract interaction (ethers.js)
- Stellar contract interaction (stellar-sdk)
- Transaction building and signing
- Event parsing

**4. Utils Module** (`sdk/src/utils/`)
- Input validation
- Format conversion (proof → contract format)
- Error handling

### API Example

```typescript
import { ZKProver, StellarVerifier } from '@openzktool/sdk';

// Initialize prover
const prover = new ZKProver({
  wasmPath: './kyc_transfer.wasm',
  zkeyPath: './kyc_transfer_final.zkey'
});

// Generate proof
const { proof, publicSignals } = await prover.prove({
  age: 25,
  balance: 150,
  countryId: 11,
  minAge: 18,
  minBalance: 50,
  allowedCountries: [11, 1, 5]
});

// Verify on Stellar
const verifier = new StellarVerifier(contractId, network);
const isValid = await verifier.verify(proof, publicSignals);
```

## Cryptographic Primitives

### Groth16 SNARK

Algorithm: Groth16 proof system
Curve: BN254 (alt_bn128)
Security: ~128-bit

Verification equation:
```
e(A, B) = e(α, β) · e(L, γ) · e(C, δ)

where L = IC[0] + Σ(IC[i] * publicInput[i-1])
```

### Trusted Setup

Current: Powers of Tau ceremony (single-party, for PoC only)
Production: Multi-party ceremony required (100+ participants)

Phases:
1. Powers of Tau (universal setup)
2. Circuit-specific setup
3. Proving key generation
4. Verification key generation

## Security Model

### Trust Assumptions

1. Trusted setup honest participant assumption
   - At least one participant in ceremony must be honest
   - Toxic waste must be destroyed

2. Cryptographic assumptions
   - Discrete logarithm hardness on BN254
   - Computational soundness (not information-theoretic)

3. Contract security
   - Verifier logic correctness
   - Input validation
   - No integer overflow/underflow

### Privacy Guarantees

- Zero-knowledge: Verifier learns nothing except validity of statement
- Private inputs never revealed on-chain
- Proof size independent of input complexity
- Unlinkability: Multiple proofs from same user are unlinkable

### Limitations

- PoC trusted setup is NOT production-safe
- No formal verification of contracts
- Timing side-channels possible in field arithmetic
- No constant-time guarantees

## Performance Characteristics

### Circuit Metrics

| Metric | Value |
|--------|-------|
| Constraints | 586 |
| Proving time | <1s |
| Proof size | 800 bytes |
| Public inputs | 1 (kycValid) |

### Contract Performance

| Platform | Gas/Cost | Verification Time |
|----------|----------|-------------------|
| EVM | ~250k gas | <1 block |
| Stellar | TBD stroops | <5s finality |

### Scalability

- Proof generation: Client-side, parallel
- Verification: On-chain, sequential
- Batch verification: Not yet implemented
- State growth: Minimal (only proof results stored)

## Integration Points

### Frontend Integration

Compatible with:
- React, Vue, Angular
- Browser wallets (MetaMask, Freighter)
- WASM support required

### Backend Integration

Compatible with:
- Node.js servers
- Serverless functions
- CI/CD pipelines

### Blockchain Integration

Supported:
- Ethereum, Polygon, BSC (EVM)
- Stellar (Soroban)

Planned:
- Arbitrum, Optimism, Base
- Other EVM L2s

## Future Architecture

### Phase 2 Enhancements

- Batch proof verification
- Nullifier tracking (prevent double-spend)
- Credential registry
- Merkle tree integration

### Phase 3 Enhancements

- Multi-chain proof portability
- Recursive proof composition
- Universal verifier contract
- Compliance dashboard

## References

- Groth16 paper: https://eprint.iacr.org/2016/260.pdf
- BN254 curve: EIP-196, EIP-197
- Circom documentation: https://docs.circom.io/
- Soroban documentation: https://developers.stellar.org/docs/smart-contracts
