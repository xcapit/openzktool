# OpenZKTool

**Privacy infrastructure for Stellar Soroban using Zero-Knowledge Proofs**

*Status: Proof of Concept*

OpenZKTool is a complete ZK-SNARK toolkit built specifically for Stellar's Soroban smart contract platform. It enables developers to add privacy-preserving features to their dApps while maintaining regulatory compliance through zero-knowledge proofs.

**Built for Stellar** - Production-grade Groth16 verifier in Rust with full BN254 elliptic curve implementation optimized for Soroban's WASM runtime.

[![License: AGPL-3.0](https://img.shields.io/badge/License-AGPL%203.0-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)
[![GitHub Stars](https://img.shields.io/github/stars/fboiero/stellar-privacy-poc?style=social)](https://github.com/fboiero/stellar-privacy-poc)
[![Digital Public Good](https://img.shields.io/badge/Digital%20Public%20Good-Certified-brightgreen)](./docs/governance/SDG_MAPPING.md)
[![Stellar](https://img.shields.io/badge/Built%20for-Stellar-blue)](https://stellar.org)

![Soroban Tests](https://github.com/fboiero/stellar-privacy-poc/workflows/Soroban%20Tests/badge.svg)
![EVM Tests](https://github.com/fboiero/stellar-privacy-poc/workflows/EVM%20Tests/badge.svg)
![Circuit Tests](https://github.com/fboiero/stellar-privacy-poc/workflows/Circuit%20Tests/badge.svg)
![Web Build](https://github.com/fboiero/stellar-privacy-poc/workflows/Web%20Build/badge.svg)
![Security](https://github.com/fboiero/stellar-privacy-poc/workflows/Security/badge.svg)

[![Circom](https://img.shields.io/badge/Circom-2.1.9-brightgreen)](https://docs.circom.io/)
[![Rust](https://img.shields.io/badge/Rust-1.75+-red)](https://www.rust-lang.org/)
[![Soroban](https://img.shields.io/badge/Soroban-SDK-purple)](https://soroban.stellar.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue)](https://www.typescriptlang.org/)

---

## Prerequisites

**⚠️ Install these FIRST before cloning the repo:**

1. **Node.js v16+**
   ```bash
   # macOS
   brew install node

   # Ubuntu/Debian
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

2. **Circom v2.1.9+** (requires Rust)
   ```bash
   # Install Rust first
   curl --proto '=https' --tlsv1.2 https://sh.rustup.rs -sSf | sh
   source $HOME/.cargo/env

   # Install Circom
   git clone https://github.com/iden3/circom.git
   cd circom
   cargo build --release
   cargo install --path circom
   cd ..

   # Verify
   circom --version
   ```

3. **jq** (JSON processor)
   ```bash
   # macOS
   brew install jq

   # Linux
   sudo apt-get install jq
   ```

**Full guide:** [INSTALL.md](./INSTALL.md)

---

## Quick Demo

Try OpenZKTool on Stellar Soroban:

```bash
# Interactive mode
./DEMO_COMPLETE.sh

# Auto mode for presentations
DEMO_AUTO=1 ./DEMO_COMPLETE.sh
```

What you'll see:
- ZK proof generation (Groth16 on BN254)
- Local verification (<50ms)
- **Soroban smart contract verification on Stellar testnet**
- Privacy-preserving KYC example

See also: [Complete Demo Guide](./DEMO_GUIDE_COMPLETE.md) | [Quick Start](./DEMO_README.md)

## Quick Start

After installing [prerequisites](#prerequisites):

### Run all tests

```bash
npm install
npm test                    # auto mode
npm run test:interactive    # with prompts
```

Takes 3-5 minutes, runs:
- Circuit compilation & trusted setup
- Proof generation & local verification
- Soroban verification on Stellar testnet
- Optional: EVM verification (local)

### Privacy demo

```bash
npm install
npm run setup
npm run demo:privacy
```

Proves: Age ≥ 18, Balance ≥ $50, Country allowed
WITHOUT revealing exact values (age 25, balance $150, country Argentina)

### Stellar demo

```bash
npm run demo:soroban
```

Shows ZK proof generation and verification on Stellar Soroban.

### Individual commands

```bash
npm run setup         # compile circuit & generate keys (one-time)
npm run prove         # generate proof & verify locally
npm run demo:soroban  # verify on Stellar Soroban
```

## Video Demo

[Watch demo on Google Drive](https://drive.google.com/file/d/1jIyHbtHRuPIrJkSi0zxZvISHtj33Hz3t/view?usp=drive_link) - Full execution showing proof generation and Stellar/Soroban verification on testnet. 7 minutes.

## Documentation

If you're new to ZK proofs, start with the [Simple Explanation](./docs/SIMPLE_EXPLANATION.md).

Stellar ecosystem:
- [CAP-0059 Analysis](./docs/CAP_0059_ANALYSIS.md) - How this relates to Stellar's BLS12-381 proposal
- [Stellar Privacy Analysis](./docs/STELLAR_PRIVACY_ANALYSIS.md) - SDF 2024 roadmap positioning
- [FHE Integration Analysis](./docs/FHE_INTEGRATION_ANALYSIS.md) - AI privacy capabilities

Other docs:
- [Documentation Hub](./docs/README.md)
- [Testing Guide](./docs/testing/README.md)
- [Troubleshooting](./docs/TROUBLESHOOTING.md)

## Architecture

[Architecture Overview](./docs/architecture/overview.md) - System design with diagrams showing multi-chain architecture (same proof verified on Ethereum and Stellar)

[Proof Flow](./docs/architecture/proof-flow.md) - Complete flow from setup to verification

Performance:
- Proof size: 800 bytes
- Generation: <1 second
- Verification: <50ms off-chain, ~200k gas on-chain
- Circuit: 586 constraints

## Integration Examples

See [examples/](./examples/README.md) for React, Node.js, and custom circuit examples.

Browser example:
```javascript
import { groth16 } from "snarkjs";

const { proof, publicSignals } = await groth16.fullProve(
  { age: 25, balance: 150, country: 11, minAge: 18, minBalance: 50, allowedCountries: [11, 1, 5] },
  "kyc_transfer.wasm",
  "kyc_transfer_final.zkey"
);

// publicSignals[0] === "1" means KYC passed
```

## What This Does

Public blockchains have zero transaction privacy - every balance, counterparty, and amount is visible on-chain. This is a problem for businesses and anyone who values privacy.

OpenZKTool uses ZK-SNARKs (Groth16) to prove things without revealing the underlying data. For example: prove you're over 18 without revealing your exact age, or prove you have enough balance without showing how much.

How it works:

```
┌─────────────────┐      ┌──────────────┐      ┌────────────────┐
│  Private Data   │ ───> │  ZK Circuit  │ ───> │  800-byte      │
│  age: 25        │      │  (Groth16)   │      │  Proof         │
│  balance: $150  │      │              │      │                │
│  country: AR    │      │  BN254 curve │      │  kycValid = 1  │
└─────────────────┘      └──────────────┘      └────────────────┘
                                                         │
                                                         ▼
                                        ┌────────────────────────────┐
                                        │  Stellar Soroban Contract  │
                                        │  Verifies proof on-chain   │
                                        │  20KB WASM, 49+ tests      │
                                        └────────────────────────────┘
```

## Project Structure

```
├── circuits/          # Circom ZK circuits (kyc_transfer.circom, etc.)
├── contracts/         # Stellar Soroban verifier contracts (Rust)
├── docs/              # Technical documentation
├── examples/          # Integration examples
└── evm-verification/  # Optional EVM verifier (experimental)
```

See [contracts/README.md](./contracts/README.md) for Soroban contract details.

## Technical Details

**Circuit inputs:** age, balance, countryId (private) + minAge, maxAge, minBalance, allowedCountries (public)

**Output:** kycValid (1 = pass, 0 = fail)

**Proof system:** Groth16 on BN254 curve, 586 constraints, ~800 byte proofs

## Installation

**Prerequisites:** Make sure you have Node.js, Circom and jq installed (see [Prerequisites](#prerequisites) above)

**Then:**
```bash
git clone https://github.com/xcapit/openzktool.git
cd openzktool
npm install
npm run setup  # one-time circuit compilation (2-3 minutes)
npm test       # verify everything works
```

## Stellar Soroban Deployment

OpenZKTool is built specifically for Stellar's Soroban smart contract platform with a production-ready Groth16 verifier.

### Soroban Verifier Contract

**Location:** `contracts/src/lib.rs`

Complete BN254 Groth16 implementation in pure Rust:
- **Field arithmetic:** Fq, Fq2, Fq6, Fq12 with Montgomery form optimization
- **Elliptic curves:** G1/G2 point operations with projective coordinates
- **Optimal ate pairing:** Miller loop with final exponentiation
- **Complete Groth16 verification:** Full cryptographic verification algorithm
- **Compact:** 20KB WASM binary
- **Well-tested:** 49+ unit and integration tests

### Live on Stellar Testnet

**Contract ID:** `CBPBVJJW5NMV4UVEDKSR6UO4DRBNWRQEMYKRYZI3CW6YK3O7HAZA43OI`

[View on Stellar Expert →](https://stellar.expert/explorer/testnet/contract/CBPBVJJW5NMV4UVEDKSR6UO4DRBNWRQEMYKRYZI3CW6YK3O7HAZA43OI)

### Deploy Your Own

```bash
cd contracts
cargo build --release --target wasm32-unknown-unknown
stellar contract deploy \
  --wasm target/wasm32-unknown-unknown/release/soroban_groth16_verifier.wasm \
  --network testnet
```

### Why Stellar?

OpenZKTool is optimized for Stellar because:

- **Lower fees:** 10-100x cheaper than Ethereum mainnet
- **Fast finality:** ~5 seconds vs 12-15 minutes
- **Native multi-asset:** Built-in support for custom tokens
- **WASM runtime:** Efficient smart contract execution
- **Production-grade crypto:** First-class cryptographic primitives
- **Growing DeFi ecosystem:** RWA tokenization, DEXs, stablecoins

### Soroban Architecture

The verifier contract implements the full Groth16 verification equation:

```
e(A, B) = e(α, β) · e(C, γ) · e(public_inputs, δ)
```

Using optimal ate pairing on the BN254 curve. See [contracts/README.md](./contracts/README.md) for implementation details.

### Additional Resources

- [Cryptographic Implementation](docs/architecture/CRYPTOGRAPHIC_COMPARISON.md) - Deep dive into Soroban verifier
- [Testing Strategy](docs/testing/TESTING_STRATEGY.md) - How we ensure correctness
- [Implementation Status](contracts/IMPLEMENTATION_STATUS.md) - Roadmap and features

---

## EVM Support (Experimental)

OpenZKTool includes experimental support for EVM-compatible chains via a Solidity verifier.

**Location:** `evm-verification/src/Verifier.sol`

This is provided for compatibility but is not the primary focus. For production use, we recommend Stellar Soroban.

**Note:** Multi-chain expansion is on the roadmap pending community demand. See [DEVELOPMENT_ROADMAP.md](./docs/DEVELOPMENT_ROADMAP.md).

## Use Cases

Age verification, solvency checks, country compliance - all provable without revealing exact values. See examples/ for code.

## Digital Public Good (DPG)

OpenZKTool complies with DPGA standards. Meets all 9 DPG indicators, contributes to SDGs 8, 9, 10, 16. See [SDG_MAPPING.md](./docs/governance/SDG_MAPPING.md) and [governance docs](./docs/governance/).

## Security Considerations

### Trusted Setup

Groth16 requires a one-time trusted setup:

- Safe if: At least ONE participant in the ceremony is honest
- Risk: If ALL participants collude, they could forge proofs
- Mitigation: Use multi-party ceremonies (100s-1000s of participants)

Real-world examples:
- Zcash: 6 ceremonies, 200+ participants
- Ethereum KZG: 141,000+ contributors

### Circuit Auditing

Before production:
- [ ] Professional security audit of circuits
- [ ] Formal verification of constraints
- [ ] Extensive fuzzing and testing
- [ ] Review trusted setup ceremony

---

## Roadmap

**Stellar-First Development:** PoC ✅ → SDK → SaaS Platform → Enterprise

**Full Details:** [DEVELOPMENT_ROADMAP.md](./docs/DEVELOPMENT_ROADMAP.md)

### Phase 0 – Proof of Concept ✅ Completed

Goal: Validate privacy-preserving ZK proofs on Stellar Soroban

Deliverables:
- [x] Circom circuits: `kyc_transfer`, `range_proof`, `compliance_verify`
- [x] **Production-ready Soroban verifier** (Rust, 20KB WASM, 49+ tests)
- [x] Proof generation and verification pipeline
- [x] **Deployed to Stellar testnet** ([View contract](https://stellar.expert/explorer/testnet/contract/CBPBVJJW5NMV4UVEDKSR6UO4DRBNWRQEMYKRYZI3CW6YK3O7HAZA43OI))
- [x] Comprehensive test suite with CI/CD
- [x] EVM verifier (experimental)

Status:
- ✅ **Stellar Soroban** - Fully implemented, tested, deployed
- ⚠️ EVM chains - Experimental support only

### Phase 1 – Developer SDK & Core Templates (In Progress)

Goal: Make OpenZKTool production-ready for Stellar developers

Deliverables:

1. **@openzktool/sdk** npm package
   - [ ] TypeScript SDK for Soroban integration
   - [ ] 6 production circuit templates
   - [ ] WASM/browser support
   - [ ] Complete type definitions

2. **Documentation Site** (Docusaurus)
   - [ ] Developer documentation
   - [ ] API reference
   - [ ] Circuit template catalog
   - [ ] Stellar/Soroban integration guides

3. **Examples & Tutorials**
   - [ ] Stellar dApp integration examples
   - [ ] Video tutorials
   - [ ] Sample applications

### Phase 2 – Testnet (Planned)

Goal: Deploy MVP to Stellar and EVM testnets.

Deliverables:

1. Contract Deployment
   - [ ] Deploy on Stellar Soroban testnet
   - [ ] Deploy on EVM testnets (Polygon Amoy, Sepolia)
   - [ ] Gas optimization and monitoring

2. Hosted SDK/API Service
   - [ ] Public API endpoint for testnet
   - [ ] Rate limiting and abuse prevention
   - [ ] Monitoring and analytics

3. Documentation & Developer Tools
   - [ ] Technical documentation portal
   - [ ] API reference
   - [ ] Integration guides
   - [ ] Sample dApps

### Phase 3 – Mainnet (Future)

Goal: Launch production-ready privacy infrastructure on mainnets.

Deliverables:

1. Playground UI
   - [ ] Visual interface to create and simulate ZKP circuits (no-code)
   - [ ] Circuit testing and debugging tools
   - [ ] Proof visualization

2. Open-Source SDK Release
   - [ ] Publish `@stellar-privacy/sdk` to npm
   - [ ] Complete API documentation
   - [ ] Video tutorials
   - [ ] Community support channels

3. Mainnet Deployment
   - [ ] Deploy on Stellar and EVM mainnets
   - [ ] Production infrastructure (RPC, indexers)
   - [ ] Security audit and penetration testing
   - [ ] Public documentation portal

### Summary

| Phase | Network | Focus | Key Deliverables | Verification |
|-------|---------|-------|------------------|-------------|
| 0 – PoC | Local / Dev | Circuits & CLI | Functional ZKP system | Reproducible repo |
| 1 – MVP | Dev / Local | SDK + API | TS/JS SDK + API | Unit testing |
| 2 – Testnet | Testnets | Interoperability | Public contracts + SDK | Cross-chain validation |
| 3 – Mainnet | Mainnets | Production & UI | Playground + SDK | Public proof verification |

---

## Contributing

Contributions welcome! Standard workflow:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit changes (`git commit -m 'Add feature'`)
4. Push to branch (`git push origin feature/your-feature`)
5. Open a Pull Request

---

## License

AGPL-3.0-or-later

Copyright © 2025 Xcapit Labs

This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

---

## Team

Team X1 - Xcapit Labs (6 members)

| Role | Name | Responsibilities |
|------|------|------------------|
| Project Lead & Cryptography Advisor | Fernando Boiero | Architecture, circuit design, security strategy |
| Soroban Contract Lead | Maximiliano César Nivoli | Rust contracts, verification logic, gas optimization |
| ZK Circuit / Cryptographer | Francisco Anuar Ardúh | Circom circuits, optimization, formal verification |
| ZKP Proof Specialist | Joel Edgar Dellamaggiore Kuns | Proof generation libraries, WASM/browser support |
| DevOps & Infrastructure Lead | Franco Schillage | CI/CD, testnet/mainnet deployment, monitoring |
| QA Specialists | Natalia Gatti, Carolina Medina | Testing, security, documentation quality |

Strengths:
- Deep Stellar/Soroban familiarity (6+ months)
- 6+ years blockchain development experience
- Academic partnerships (UTN - Universidad Tecnológica Nacional)

Location: Argentina (remote-friendly, global focus, LATAM expertise)

---

## Impact & Vision

Building privacy infrastructure for the Stellar ecosystem:

**For Developers:**
- Easy-to-use ZK-SNARK toolkit designed for Soroban
- Privacy-preserving dApps without sacrificing regulatory compliance
- Production-ready verifier contracts with comprehensive testing

**For Institutions:**
- Private transactions on Stellar's fast, low-cost network
- Compliance-friendly privacy (prove without revealing)
- Bridge Web2 financial institutions to Web3 via Stellar

**For the Ecosystem:**
- Enable use cases requiring privacy: RWA tokenization, private DEXs, confidential settlements
- Attract institutional liquidity to Stellar
- Regulatory compliance as a feature, not a barrier

**Long-term Vision:**
- De facto privacy standard for Stellar Soroban
- Expand to other blockchains based on community demand
- Advanced privacy primitives (FHE integration, private AI inference)

---

## Built With

Core technologies:
- [Circom](https://docs.circom.io/) - Circuit compiler
- [snarkjs](https://github.com/iden3/snarkjs) - SNARK toolkit
- [circomlib](https://github.com/iden3/circomlib) - Circuit library
- [Foundry](https://book.getfoundry.sh/) - Ethereum development framework
- [Soroban SDK](https://soroban.stellar.org/) - Stellar smart contracts
- [Stellar CLI](https://developers.stellar.org/docs/tools/developer-tools) - Soroban deployment

Cryptographic primitives:
- Groth16 SNARKs (BN254/alt_bn128 curve)
- Poseidon hash function
- Merkle tree proofs
- Range proofs

---

## Support

- GitHub Issues: [Report a bug](https://github.com/fboiero/stellar-privacy-poc/issues)
- Discussions: [Ask questions](https://github.com/fboiero/stellar-privacy-poc/discussions)
- Twitter: [@xcapit_](https://twitter.com/xcapit_)

---

## Links

- **Repository:** https://github.com/xcapit/openzktool
- **Stellar Testnet Contract:** [View on Stellar Expert](https://stellar.expert/explorer/testnet/contract/CBPBVJJW5NMV4UVEDKSR6UO4DRBNWRQEMYKRYZI3CW6YK3O7HAZA43OI)
- **Xcapit Labs:** https://xcapit.com
- **Soroban Docs:** https://soroban.stellar.org/
- **Circom Docs:** https://docs.circom.io
- **ZK Learning:** https://zkp.science

---

**Ready to add privacy to your Stellar dApp?**

⭐ Star the repo if you find this useful
📖 Read the [docs](./docs/README.md) to get started
🚀 Try the demo: `./DEMO_COMPLETE.sh`
