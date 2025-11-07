# OpenZKTool

**Open source ZK-SNARK toolkit for Stellar with multi-chain support**

*Status: Proof of Concept*

A toolkit for building privacy-preserving applications using ZK-SNARKs on Stellar Soroban. Complete Groth16 verifier implementation in Rust. Also supports EVM chains.

Make Zero-Knowledge Proofs accessible to developers who want to add privacy to their dApps without losing the ability to comply with regulations.

[![License: AGPL-3.0](https://img.shields.io/badge/License-AGPL%203.0-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)
[![GitHub Stars](https://img.shields.io/github/stars/fboiero/stellar-privacy-poc?style=social)](https://github.com/fboiero/stellar-privacy-poc)
[![Website](https://img.shields.io/website?url=https%3A%2F%2Fopenzktool.vercel.app)](https://openzktool.vercel.app)
[![Digital Public Good](https://img.shields.io/badge/Digital%20Public%20Good-Certified-brightgreen)](./docs/governance/SDG_MAPPING.md)

![Soroban Tests](https://github.com/fboiero/stellar-privacy-poc/workflows/Soroban%20Tests/badge.svg)
![EVM Tests](https://github.com/fboiero/stellar-privacy-poc/workflows/EVM%20Tests/badge.svg)
![Circuit Tests](https://github.com/fboiero/stellar-privacy-poc/workflows/Circuit%20Tests/badge.svg)
![Web Build](https://github.com/fboiero/stellar-privacy-poc/workflows/Web%20Build/badge.svg)
![Security](https://github.com/fboiero/stellar-privacy-poc/workflows/Security/badge.svg)

[![Circom](https://img.shields.io/badge/Circom-2.1.9-brightgreen)](https://docs.circom.io/)
[![Solidity](https://img.shields.io/badge/Solidity-0.8+-orange)](https://soliditylang.org/)
[![Rust](https://img.shields.io/badge/Rust-1.75+-red)](https://www.rust-lang.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue)](https://www.typescriptlang.org/)

**Website:** https://openzktool.vercel.app

## Demo

Try it yourself:

```bash
# Interactive mode
./DEMO_COMPLETE.sh

# Auto mode for presentations
DEMO_AUTO=1 ./DEMO_COMPLETE.sh
```

Shows:
- ZK proof generation
- Local verification (<50ms)
- Soroban verification on Stellar
- Privacy + compliance example

See also: [Complete Demo Guide](./DEMO_GUIDE_COMPLETE.md) | [Quick Start](./DEMO_README.md)

## Quick Start

**⚠️ IMPORTANT:** Before running anything, install these dependencies:
1. **Node.js** (v16+) - Get from https://nodejs.org
2. **Circom** (v2.1.9+) - Requires Rust, see [INSTALL.md](./INSTALL.md)
3. **jq** - `brew install jq` (macOS) or `apt install jq` (Linux)

**Full instructions:** [INSTALL.md](./INSTALL.md)

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

If you're new to ZK proofs, start with the [Simple Explanation](./docs/EXPLICACION_SIMPLE.md).

Stellar ecosystem:
- [CAP-0059 Analysis](./docs/CAP_0059_ANALYSIS.md) - How this relates to Stellar's BLS12-381 proposal
- [Stellar Privacy Analysis](./docs/STELLAR_PRIVACY_ANALISIS.md) - SDF 2024 roadmap positioning
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
│  country: AR    │      │  586 constraints    │  kycValid = 1  │
└─────────────────┘      └──────────────┘      └────────────────┘
                                                         │
                                                         ▼
                                            ┌────────────────────┐
                                            │  Smart Contract    │
                                            │  Verifies proof    │
                                            │  (Stellar Soroban) │
                                            └────────────────────┘
```

## Project Structure

```
├── circuits/          # Circom ZK circuits (kyc_transfer.circom, etc.)
├── soroban/           # Stellar/Soroban verifier (Rust)
├── evm/               # EVM verifier (Solidity)
├── docs/              # Documentation
└── examples/          # Integration examples
```

See full structure in docs.

## Technical Details

**Circuit inputs:** age, balance, countryId (private) + minAge, maxAge, minBalance, allowedCountries (public)

**Output:** kycValid (1 = pass, 0 = fail)

**Proof system:** Groth16 on BN254 curve, 586 constraints, ~800 byte proofs

## Installation

**Step 1:** Install dependencies (Node.js, Circom, jq)
- See detailed instructions in [INSTALL.md](./INSTALL.md)

**Step 2:** Install the project
```bash
git clone https://github.com/xcapit/openzktool.git
cd openzktool
npm install
npm run setup  # one-time circuit compilation (2-3 minutes)
```

**Verify:**
```bash
npm test  # should complete successfully
```

## Blockchain Deployment

### Stellar Soroban

Verifier contract: `soroban/src/lib.rs`

Complete BN254 Groth16 implementation in Rust:
- Full field arithmetic (Fq, Fq2, Fq6, Fq12) with Montgomery form
- G1/G2 elliptic curve operations
- Optimal ate pairing with Miller loop
- Complete Groth16 verification
- 20KB WASM binary, 49+ tests

Live on Stellar testnet:
- Contract ID: `CBPBVJJW5NMV4UVEDKSR6UO4DRBNWRQEMYKRYZI3CW6YK3O7HAZA43OI`
- [View on Stellar Expert](https://stellar.expert/explorer/testnet/contract/CBPBVJJW5NMV4UVEDKSR6UO4DRBNWRQEMYKRYZI3CW6YK3O7HAZA43OI)

Deploy:
```bash
cd soroban
cargo build --release --target wasm32-unknown-unknown
soroban contract deploy \
  --wasm target/wasm32-unknown-unknown/release/soroban_groth16_verifier.wasm \
  --network testnet
```

Why Stellar:
- Lower fees than EVM
- Fast finality (~5 seconds)
- Native multi-asset support
- Production-grade crypto implementation

### EVM Compatible Chains

Basic Solidity verifier at `circuits/evm/Verifier.sol`. Tested on local Ethereum testnet. Gas cost ~250-300k.

Future work: deployment to other blockchains if there's demand.

More details:
- [Cryptographic Comparison](docs/architecture/CRYPTOGRAPHIC_COMPARISON.md) - EVM vs Soroban
- [Testing Strategy](docs/testing/TESTING_STRATEGY.md)
- [Implementation Status](soroban/IMPLEMENTATION_STATUS.md)

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

PoC → MVP → Testnet → Mainnet

### Phase 0 – Proof of Concept (Completed)

Goal: Validate privacy-preserving verification using ZK proofs across multiple blockchains.

Deliverables:
- [x] Circuits: `range_proof`, `solvency_check`, `compliance_verify`, `kyc_transfer`
- [x] Working proof generation and verification scripts
- [x] Ethereum verifier (Solidity)
- [x] Stellar Soroban verifier (Rust)
- [x] End-to-end proof verification for KYC attributes
- [x] Web landing page (openzktool.vercel.app)

Multi-chain status:
- Ethereum/EVM - Fully implemented and tested
- Stellar Soroban - Fully implemented and tested
- Other EVM chains (Polygon, BSC, etc.) - Same verifier can be deployed
- Other chains - Future roadmap items

### Phase 1 – MVP (Upcoming)

Goal: Build MVP to make ZKP privacy verification accessible through clean SDK.

Deliverables:

1. ZKP Core SDK (TypeScript/JS)
   - [ ] Interfaces for proof generation, verification, circuit management
   - [ ] WASM/browser support
   - [ ] Sample applications and demos

2. Unified API Layer
   - [ ] REST/GraphQL endpoints
   - [ ] Authentication and rate limiting
   - [ ] Documentation and OpenAPI spec

3. Integration Examples
   - [ ] Stellar integration examples
   - [ ] EVM integration (Polygon Amoy/Sepolia)
   - [ ] Developer tutorials

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

Unlocking privacy for all blockchains:
- Enable institutional adoption across multiple chains for private transactions
- Support cross-border B2B payments with high transaction volumes
- Compete with traditional finance by adding privacy + auditability
- Bridge Web2 financial institutions to Web3 across Stellar, Ethereum, and beyond

Network effects:
- Developers build privacy-preserving dApps on any supported chain
- Institutions bring liquidity and transaction volume across ecosystems
- Multi-chain privacy infrastructure grows the entire Web3 space
- Regulatory compliance becomes a feature, not a barrier

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

- OpenZKTool Website: https://openzktool.vercel.app
- Repository: https://github.com/fboiero/stellar-privacy-poc
- Xcapit Labs: https://xcapit.com
- Circom Docs: https://docs.circom.io
- ZK Learning Resources: https://zkp.science

---

If you find this useful, star the repo.

Ready to prove without revealing? Try the demo: `./DEMO_COMPLETE.sh`
