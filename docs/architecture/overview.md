# 🏗️ ZKPrivacy Architecture Overview

This document provides a comprehensive visual overview of the ZKPrivacy system architecture.

---

## 📊 Table of Contents

1. [System Overview](#system-overview)
2. [Proof Generation & Verification Flow](#proof-generation--verification-flow)
3. [Multi-Chain Architecture](#multi-chain-architecture)
4. [Circuit Structure](#circuit-structure)
5. [Component Interaction](#component-interaction)

---

## 🎯 System Overview

High-level view of the entire ZKPrivacy system:

```mermaid
graph TB
    subgraph "User Layer"
        U[👤 User with Private Data]
        U --> |age: 25, balance: $150, country: AR| INPUT[Input Data]
    end

    subgraph "ZK Layer"
        INPUT --> CIRCUIT[Circom Circuit<br/>kyc_transfer.circom]
        CIRCUIT --> WITNESS[Witness Calculation]
        WITNESS --> PROVE[Proof Generation<br/>Groth16 SNARK]
        PROVE --> PROOF[📦 Proof<br/>800 bytes]
    end

    subgraph "Verification Layer"
        PROOF --> ROUTER{Blockchain<br/>Router}
        ROUTER --> |EVM| ETH[Ethereum/Anvil<br/>Verifier.sol]
        ROUTER --> |Soroban| STELLAR[Stellar<br/>Rust WASM]
    end

    subgraph "Result"
        ETH --> VALID[✅ Valid Proof<br/>Without revealing private data]
        STELLAR --> VALID
    end

    style U fill:#e1f5ff
    style CIRCUIT fill:#fff3e0
    style PROOF fill:#f3e5f5
    style VALID fill:#e8f5e9
```

**Key Points:**
- 🔐 Private data never leaves the user's control
- ⚡ Proof generation takes <1 second
- 🌐 Same proof works on multiple blockchains
- ✅ Verification confirms compliance without revealing data

---

## 🔄 Proof Generation & Verification Flow

Detailed step-by-step flow:

```mermaid
sequenceDiagram
    participant User
    participant Circuit
    participant Prover
    participant Verifier
    participant Blockchain

    User->>Circuit: Private inputs (age, balance, country)
    User->>Circuit: Public inputs (kycValid threshold)

    Note over Circuit: Compile circuit to R1CS
    Circuit->>Circuit: Generate constraints

    Circuit->>Prover: Witness calculation
    Note over Prover: Compute witness values

    Prover->>Prover: Generate Groth16 proof
    Note over Prover: Using trusted setup (Powers of Tau)

    Prover-->>User: 📦 Proof (800 bytes) + Public output

    User->>Verifier: Submit proof
    Note over Verifier: Local verification (off-chain)
    Verifier-->>User: ✅ Proof valid locally

    User->>Blockchain: Deploy verifier contract (one-time)
    User->>Blockchain: Submit proof on-chain

    Note over Blockchain: Pairing check on elliptic curve
    Blockchain-->>User: ✅ Proof verified on-chain
```

**Timeline:**
1. **Setup Phase** (one-time): ~2-3 minutes
   - Compile circuit
   - Generate trusted setup
   - Export verification key

2. **Proof Phase** (per transaction): <1 second
   - Calculate witness
   - Generate proof
   - Verify locally

3. **On-Chain Phase**: ~50ms (off-chain) or ~200k gas (on-chain)
   - Submit to blockchain
   - Contract verification
   - Result recorded

---

## 🌐 Multi-Chain Architecture

How the same proof works across different blockchains:

```mermaid
graph TD
    subgraph "Proof Generation (Universal)"
        INPUT[Private Data] --> CIRCUIT[Circom Circuit]
        CIRCUIT --> SETUP[Trusted Setup<br/>Powers of Tau]
        SETUP --> PROOF[🔐 ZK Proof<br/>pi_a, pi_b, pi_c<br/>800 bytes]
    end

    subgraph "Verification Keys (Chain-Specific)"
        SETUP --> VKEY_EVM[Verification Key<br/>EVM Format]
        SETUP --> VKEY_WASM[Verification Key<br/>WASM Format]
    end

    PROOF --> MULTI{Multi-Chain<br/>Verification}

    subgraph "Ethereum Ecosystem"
        MULTI --> |Same Proof| EVM1[Ethereum Mainnet]
        MULTI --> |Same Proof| EVM2[Polygon]
        MULTI --> |Same Proof| EVM3[Arbitrum]
        MULTI --> |Same Proof| EVM4[Optimism]

        VKEY_EVM --> CONTRACT_EVM[Groth16Verifier.sol]
        CONTRACT_EVM --> EVM1
        CONTRACT_EVM --> EVM2
        CONTRACT_EVM --> EVM3
        CONTRACT_EVM --> EVM4
    end

    subgraph "Stellar Ecosystem"
        MULTI --> |Same Proof| SOROBAN[Stellar/Soroban]

        VKEY_WASM --> CONTRACT_WASM[Rust WASM Verifier]
        CONTRACT_WASM --> SOROBAN
    end

    EVM1 --> RESULT[✅ Verified]
    EVM2 --> RESULT
    EVM3 --> RESULT
    EVM4 --> RESULT
    SOROBAN --> RESULT

    style PROOF fill:#f3e5f5
    style RESULT fill:#e8f5e9
    style EVM1 fill:#e3f2fd
    style EVM2 fill:#e3f2fd
    style EVM3 fill:#e3f2fd
    style EVM4 fill:#e3f2fd
    style SOROBAN fill:#fff9c4
```

**Key Insight:**
- ✅ **One proof, many chains** - The same 800-byte proof can be verified on any blockchain
- 🔑 **Verification key** is chain-specific (Solidity for EVM, Rust/WASM for Soroban)
- 🌍 **True interoperability** - Privacy doesn't lock you into one ecosystem

---

## 🔧 Circuit Structure

Internal structure of the KYC transfer circuit:

```mermaid
graph TB
    subgraph "Private Inputs (Hidden)"
        AGE[Age: 25]
        BALANCE[Balance: 150]
        COUNTRY[Country: AR]
    end

    subgraph "Public Inputs (Visible)"
        MIN_AGE[minAge: 18]
        MIN_BALANCE[minBalance: 50]
        ALLOWED[allowedCountries]
    end

    subgraph "Circuit Constraints (586 constraints)"
        AGE --> CHECK1[GreaterEqThan<br/>age >= minAge]
        BALANCE --> CHECK2[GreaterEqThan<br/>balance >= minBalance]
        COUNTRY --> CHECK3[CountryCheck<br/>country in allowed list]

        MIN_AGE --> CHECK1
        MIN_BALANCE --> CHECK2
        ALLOWED --> CHECK3

        CHECK1 --> AND[AND Gate]
        CHECK2 --> AND
        CHECK3 --> AND

        AND --> OUTPUT[kycValid]
    end

    subgraph "Public Output"
        OUTPUT --> RESULT[kycValid: 1<br/>✅ All checks passed]
    end

    style AGE fill:#ffebee
    style BALANCE fill:#ffebee
    style COUNTRY fill:#ffebee
    style MIN_AGE fill:#e8f5e9
    style MIN_BALANCE fill:#e8f5e9
    style ALLOWED fill:#e8f5e9
    style RESULT fill:#e8f5e9
```

**Constraint Breakdown:**
- `GreaterEqThan` circuits: ~200 constraints each
- `CountryCheck` (hash + comparison): ~150 constraints
- `AND` logic gates: ~36 constraints
- **Total:** 586 constraints (very efficient!)

**Circuit File:** `circuits/kyc_transfer.circom`

---

## 🔗 Component Interaction

How all components work together in practice:

```mermaid
graph LR
    subgraph "Development Phase"
        DEV[Developer] --> |1. Write| CIRCOM[Circuit File<br/>.circom]
        CIRCOM --> |2. Compile| COMPILER[circom compiler]
        COMPILER --> |3. Generate| R1CS[R1CS + WASM]
    end

    subgraph "Setup Phase (One-time)"
        R1CS --> |4. Trusted Setup| PTAU[Powers of Tau<br/>Ceremony]
        PTAU --> |5. Generate| ZKEY[Final .zkey]
        ZKEY --> |6. Export| VKEY[Verification Key]
        VKEY --> |7a. Generate| SOL[Verifier.sol]
        VKEY --> |7b. Generate| RUST[verifier.rs]
    end

    subgraph "Runtime Phase"
        USER[End User] --> |8. Input| INPUTS[Private Data]
        INPUTS --> |9. Generate| SNARK[snarkjs]
        ZKEY --> SNARK
        SNARK --> |10. Output| PROOF[Proof + Public]
    end

    subgraph "Verification Phase"
        PROOF --> |11a. Verify| EVM[EVM Chain]
        PROOF --> |11b. Verify| SOROBAN[Soroban Chain]
        SOL --> EVM
        RUST --> SOROBAN
        EVM --> |12. Result| SUCCESS[✅ Valid]
        SOROBAN --> SUCCESS
    end

    style CIRCOM fill:#fff3e0
    style PROOF fill:#f3e5f5
    style SUCCESS fill:#e8f5e9
```

**File Dependencies:**

```
project/
├── circuits/
│   ├── kyc_transfer.circom          # Source circuit
│   └── artifacts/
│       ├── kyc_transfer.r1cs        # Compiled circuit
│       ├── kyc_transfer.wasm        # Witness generator
│       ├── kyc_transfer_final.zkey  # Proving key
│       ├── kyc_transfer_vkey.json   # Verification key
│       ├── proof.json               # Generated proof
│       └── public.json              # Public signals
├── evm-verification/
│   └── src/
│       └── Verifier.sol             # EVM verifier
└── soroban/
    └── src/
        └── lib.rs                   # Soroban verifier
```

---

## 📈 Performance Metrics

| Metric | Value | Notes |
|--------|-------|-------|
| **Proof Size** | 800 bytes | Constant, regardless of input |
| **Generation Time** | <1 second | On modern hardware |
| **Verification Time (off-chain)** | <50ms | Local snarkjs |
| **Verification Gas (EVM)** | ~200,000 | ~$5-10 at 50 gwei |
| **Circuit Constraints** | 586 | Very efficient |
| **Trusted Setup** | Universal | Reuse existing ceremonies |
| **Supported Chains** | 2+ | Ethereum + Stellar (more coming) |

---

## 🔐 Security Properties

```mermaid
graph TB
    subgraph "Zero-Knowledge Properties"
        COMPLETE[Completeness<br/>✅ Valid proofs always verify]
        SOUND[Soundness<br/>✅ Invalid proofs never verify]
        ZK[Zero-Knowledge<br/>✅ No information leaked]
    end

    subgraph "Implementation Security"
        GROTH16[Groth16 Protocol<br/>Industry standard]
        BN254[BN254 Curve<br/>128-bit security]
        PTAU[Powers of Tau<br/>Trusted setup]
    end

    subgraph "Known Limitations (POC)"
        AUDIT[⚠️ Not audited yet]
        PROD[⚠️ Not production-ready]
        TEST[⚠️ Use testnet only]
    end

    COMPLETE --> GROTH16
    SOUND --> GROTH16
    ZK --> GROTH16
    GROTH16 --> BN254
    BN254 --> PTAU

    style COMPLETE fill:#e8f5e9
    style SOUND fill:#e8f5e9
    style ZK fill:#e8f5e9
    style AUDIT fill:#fff3e0
    style PROD fill:#fff3e0
    style TEST fill:#fff3e0
```

---

## 🎯 Next Steps

- 📖 Read the [Getting Started Guide](../getting-started/quickstart.md)
- 🧪 Try the [Interactive Tutorial](../getting-started/interactive-tutorial.md)
- 💻 Check [Integration Examples](../../examples/)
- 🔧 Learn about [Custom Circuits](../guides/custom-circuits.md)

---

## 📚 References

- [Groth16 Paper](https://eprint.iacr.org/2016/260.pdf)
- [Circom Documentation](https://docs.circom.io/)
- [snarkjs Repository](https://github.com/iden3/snarkjs)
- [Powers of Tau Ceremony](https://github.com/privacy-scaling-explorations/perpetualpowersoftau)

---

**Questions?** Open an issue or check the [FAQ](../FAQ.md)
