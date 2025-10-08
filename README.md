# Stellar Privacy Proof-of-Concept

**Zero-Knowledge Privacy Toolkit for Multi-Chain KYC Compliance**

This project demonstrates privacy-preserving KYC verification using **zero-knowledge proofs** (Groth16 SNARKs) that work on both **EVM** (Ethereum, Polygon, etc.) and **Soroban** (Stellar) blockchains.

> 🎯 **Use Case:** Prove KYC compliance (age, balance, country) without revealing exact personal data.

[![License: AGPL-3.0](https://img.shields.io/badge/License-AGPL%203.0-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)
[![Circom](https://img.shields.io/badge/Circom-2.1.9-brightgreen)](https://docs.circom.io/)
[![Solidity](https://img.shields.io/badge/Solidity-0.8+-orange)](https://soliditylang.org/)

---

## 🚀 Quick Start

### Run the Complete Demo (Recommended)

```bash
# Install dependencies
npm install

# Run the full educational demo (with ZK theory + practice)
cd circuits/scripts
bash full_demo.sh
```

**Duration:** 8-10 minutes | **Output:** Complete ZK-Proof explanation with ASCII art visualizations

---

## 🧠 What This Project Does

### The Problem
Traditional KYC requires revealing sensitive personal information:
- 🔓 Exact age and birthdate
- 🔓 Complete financial details
- 🔓 Identity documents

### The Solution
Zero-Knowledge Proofs allow proving compliance **without revealing exact data:**
- ✅ "I'm over 18" (not "I'm 25 years old")
- ✅ "I have sufficient balance" (not "I have $150")
- ✅ "I'm from an allowed country" (not "I'm from Argentina")

### How It Works

```
┌─────────────────┐      ┌──────────────┐      ┌────────────────┐
│  Private Data   │ ───> │  ZK Circuit  │ ───> │  800-byte      │
│  age: 25        │      │  (Groth16)   │      │  Proof         │
│  balance: $150  │      │              │      │                │
│  country: AR    │      │  586 constraints    │  kycValid = 1  │
└─────────────────┘      └──────────────┘      └────────────────┘
                                                         │
                                                         ▼
                                            ┌────────────────────┐
                                            │  Smart Contract    │
                                            │  Verifies proof    │
                                            │  (EVM/Soroban)     │
                                            └────────────────────┘
```

---

## 📋 Project Structure

```
stellar-privacy-poc/
├── circuits/                      # Circom circuits
│   ├── kyc_transfer.circom       # Main KYC circuit (combines all checks)
│   ├── range_proof.circom        # Age range validation
│   ├── solvency_check.circom     # Balance verification
│   ├── compliance_verify.circom  # Country allowlist check
│   │
│   ├── scripts/                  # Demo and build scripts
│   │   ├── full_demo.sh         # Complete educational demo ⭐
│   │   ├── demo.sh              # Interactive demo
│   │   ├── demo_auto.sh         # Auto-play demo (for videos)
│   │   ├── prepare_and_setup.sh # Trusted setup
│   │   └── prove_and_verify.sh  # Quick proof generation
│   │
│   ├── artifacts/               # Generated files (gitignored)
│   │   ├── kyc_transfer.wasm   # Witness calculator
│   │   ├── kyc_transfer_final.zkey  # Proving key
│   │   ├── kyc_transfer_vkey.json   # Verification key
│   │   ├── proof.json          # Example proof
│   │   └── input.json          # Sample inputs
│   │
│   └── evm/
│       └── Verifier.sol         # Solidity verifier contract
│
├── soroban/                     # Stellar/Soroban verifier
│   └── src/
│       └── lib.rs               # Rust verifier (no_std)
│
├── DEMO.md                      # Step-by-step tutorial
├── COMPLETE_DEMO.md             # Full demo documentation
├── VIDEO_DEMO.md                # Video recording guide
├── QUICKSTART.md                # Quick reference
└── README.md                    # This file
```

---

## 🎬 Available Demos

| Demo Script | Description | Duration | Best For |
|-------------|-------------|----------|----------|
| `full_demo.sh` ⭐ | Complete education: Theory + Practice + Benefits | 8-10 min | Learning, teaching, presentations |
| `demo_auto.sh` | Auto-play technical demo | 3-4 min | Video recording, quick walkthrough |
| `demo.sh` | Interactive demo with manual pauses | 5-6 min | Live presentations, workshops |
| `prove_and_verify.sh` | Quick proof generation only | 30 sec | Testing, development |

### Example: Full Demo

```bash
cd circuits/scripts
bash full_demo.sh
```

**What it shows:**
1. 📚 **ZK Theory**: Ali Baba's Cave, 3 properties, SNARKs vs STARKs
2. 🛠️ **Practice**: Compilation → Setup → Proof → Verification
3. 💎 **Benefits**: 6 real-world use cases (zkRollups, private identity, etc.)
4. ⛓️ **Deployment**: EVM and Soroban verifier export

---

## 🔧 Technical Details

### Circuit: KYC Transfer

**Inputs (Private):**
- `age` - User's actual age
- `balance` - User's actual balance
- `countryId` - User's country code

**Public Parameters:**
- `minAge`, `maxAge` - Age requirements (18-99)
- `minBalance` - Minimum required balance ($50)

**Output (Public):**
- `kycValid` - 1 if all checks pass, 0 otherwise

**Constraints:** 586
**Proof Size:** ~800 bytes
**Verification Time:** ~10-50ms (off-chain), ~250k gas (on-chain)

### Proof System

- **Algorithm:** Groth16 SNARK
- **Curve:** BN254 (alt_bn128)
- **Trusted Setup:** Powers of Tau + circuit-specific setup
- **Security:** Computational soundness (relies on hardness of discrete log)

---

## 🛠️ Setup Instructions

### Prerequisites

```bash
node --version   # >= v16
circom --version # >= 2.1.9
jq --version     # For JSON formatting
```

### Installation

```bash
# Clone the repository
git clone https://github.com/xcapit/stellar-privacy-poc.git
cd stellar-privacy-poc

# Install dependencies
npm install

# Run initial setup (generates Powers of Tau + proving/verification keys)
cd circuits/scripts
bash prepare_and_setup.sh
```

### Compile Circuits

```bash
cd circuits
circom kyc_transfer.circom --r1cs --wasm --sym -o artifacts/ -l node_modules
```

### Generate a Proof

```bash
cd circuits/scripts
bash prove_and_verify.sh
```

This will:
1. Create sample input (`artifacts/input.json`)
2. Generate witness
3. Create ZK proof
4. Verify the proof
5. Export Solidity verifier

---

## 🌍 Multi-Chain Deployment

### EVM (Ethereum, Polygon, BSC, etc.)

**Verifier Contract:** `circuits/evm/Verifier.sol`

```bash
# Deploy to your target network
# Example with Hardhat:
npx hardhat run scripts/deploy.js --network polygon
```

**Gas Cost:** ~250,000-300,000 gas per verification

**Usage:**
```solidity
bool valid = verifier.verifyProof(proof, publicSignals);
if (valid) {
    // User passed KYC, allow transaction
}
```

### Soroban (Stellar)

**Verifier Contract:** `soroban/src/lib.rs`

```bash
cd soroban
cargo build --release --target wasm32-unknown-unknown
soroban contract deploy --wasm target/wasm32-unknown-unknown/release/verifier.wasm
```

**Benefits:**
- Lower fees than EVM
- Fast finality (~5 seconds)
- Native multi-asset support

---

## 📚 Documentation

- **[QUICKSTART.md](QUICKSTART.md)** - Get started in 1 command
- **[DEMO.md](DEMO.md)** - Detailed step-by-step guide
- **[COMPLETE_DEMO.md](COMPLETE_DEMO.md)** - Full demo documentation
- **[VIDEO_DEMO.md](VIDEO_DEMO.md)** - Tips for recording videos
- **[circuits/scripts/SCRIPTS_GUIDE.md](circuits/scripts/SCRIPTS_GUIDE.md)** - All available scripts

---

## 🎓 Educational Resources

### What You'll Learn

- ✅ What Zero-Knowledge Proofs are (intuitively)
- ✅ How SNARKs work (technically)
- ✅ Groth16 proof system workflow
- ✅ Circom circuit development
- ✅ Multi-chain deployment strategies

### Real-World Applications

1. **Privacy-Preserving Identity** - KYC without revealing personal details
2. **Blockchain Scalability** - zkRollups (Polygon, zkSync, StarkNet)
3. **Private Transactions** - Zcash, Aztec Protocol
4. **Verifiable Computation** - AI/ML model verification
5. **Cross-Chain Bridges** - Trustless state proofs
6. **Regulatory Compliance** - Prove tax compliance without revealing income

---

## 🧪 Example Use Cases

### Age Verification

```json
{
  "age": 25,
  "minAge": 18,
  "maxAge": 99
}
```

**Proof:** "User is between 18-99" ✅
**Hidden:** Exact age (25)

### Solvency Check

```json
{
  "balance": 150,
  "minBalance": 50
}
```

**Proof:** "User has ≥ $50" ✅
**Hidden:** Exact balance ($150)

### Country Compliance

```json
{
  "countryId": 32
}
```

**Proof:** "User is from allowed country" ✅
**Hidden:** Exact country (Argentina)

---

## 📊 Performance Metrics

| Metric | Value |
|--------|-------|
| Circuit Constraints | 586 |
| Circuit Wires | 590 |
| Proof Size | ~800 bytes |
| Proof Generation | ~2-5 seconds |
| Verification (off-chain) | ~10-50ms |
| Verification (EVM) | ~250k-300k gas |
| Trusted Setup | One-time (reusable) |

---

## 🔒 Security Considerations

### Trusted Setup

The Groth16 proof system requires a one-time trusted setup:

- ✅ **Safe if:** At least ONE participant in the ceremony is honest
- ⚠️ **Risk:** If ALL participants collude, they could forge proofs
- 🛡️ **Mitigation:** Use multi-party ceremonies (100s-1000s of participants)

**Real-world examples:**
- Zcash: 6 ceremonies, 200+ participants
- Ethereum KZG: 141,000+ contributors

### Circuit Auditing

Before production use:
- [ ] Professional security audit of circuits
- [ ] Formal verification of constraints
- [ ] Extensive fuzzing and testing
- [ ] Review trusted setup ceremony

---

## 🚧 Roadmap

- [x] KYC Transfer circuit implementation
- [x] EVM Solidity verifier
- [x] Soroban Rust verifier
- [x] Complete demo scripts
- [x] Educational documentation
- [ ] Production-ready trusted setup ceremony
- [ ] Web UI for proof generation
- [ ] Mobile SDK integration
- [ ] Additional circuit libraries (Merkle proofs, signatures)
- [ ] Cross-chain proof aggregation

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

**AGPL-3.0-or-later**

Copyright © 2025 Xcapit Labs

This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

---

## 👥 Credits

**Developed by:**
- Team X1 - Xcapit Labs

**Built with:**
- [Circom](https://docs.circom.io/) - Circuit compiler
- [snarkjs](https://github.com/iden3/snarkjs) - SNARK toolkit
- [circomlib](https://github.com/iden3/circomlib) - Circuit library
- [Soroban SDK](https://soroban.stellar.org/) - Stellar smart contracts

---

## 📞 Support

- **GitHub Issues:** [Report a bug](https://github.com/xcapit/stellar-privacy-poc/issues)
- **Discussions:** [Ask questions](https://github.com/xcapit/stellar-privacy-poc/discussions)
- **Twitter:** [@XcapitOfficial](https://twitter.com/XcapitOfficial)

---

## 🔗 Links

- **Repository:** https://github.com/xcapit/stellar-privacy-poc
- **Xcapit Labs:** https://xcapit.com
- **Circom Docs:** https://docs.circom.io
- **ZK Learning Resources:** https://zkp.science

---

**⭐ If you find this project useful, please star the repository!**

**Ready to prove without revealing? Start with:** `bash circuits/scripts/full_demo.sh` 🚀
