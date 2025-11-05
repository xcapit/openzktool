# OpenZKTool

**Open source ZK-SNARK toolkit for multi-chain privacy**

*Status: Proof of Concept*

A toolkit for building privacy-preserving applications using ZK-SNARKs across multiple blockchains. Supports both Stellar Soroban and EVM chains with compliance-friendly features.

The goal is simple: make Zero-Knowledge Proofs accessible to developers who want to add privacy to their dApps without losing the ability to comply with regulations when needed.

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

🌐 **Website:** [https://openzktool.vercel.app](https://openzktool.vercel.app)

## Demo

See everything working in 5 minutes:

```bash
# Interactive mode
./DEMO_COMPLETE.sh

# Auto mode for presentations
DEMO_AUTO=1 ./DEMO_COMPLETE.sh
```

Shows:
- ZK proof generation
- Local verification (<50ms)
- Multi-chain verification (EVM + Soroban)
- Privacy + compliance example

Docs: [Complete Demo Guide](./DEMO_GUIDE_COMPLETE.md) | [Quick Start](./DEMO_README.md)

---

## Quick Start

### Option 1: Test everything

```bash
npm install
npm test                    # auto mode
npm run test:interactive    # with prompts
```

Takes 3-5 minutes. Tests:
- Circuit compilation & trusted setup
- Proof generation & local verification
- EVM verification (Ethereum/Anvil)
- Soroban verification (Stellar)

### Option 2: Privacy demo (for non-technical folks)

Alice proves she's eligible without revealing her data:

```bash
npm install
npm run setup
npm run demo:privacy
```

Takes 5-7 minutes. Alice proves:
- Age ≥ 18, Balance ≥ $50, Country allowed
- WITHOUT revealing her exact age (25), balance ($150), or country (Argentina)
- Proof verified on both Ethereum and Stellar

### Option 3: Multi-chain demo (for devs)

```bash
npm run demo
```

Takes 5-7 minutes. Shows:
- ZK proof generation
- Verification on Ethereum (local testnet)
- Verification on Stellar/Soroban
- Multi-chain interoperability

### Option 4: Individual commands

```bash
npm run setup         # compile circuit & generate keys (one-time)
npm run prove         # generate proof & verify locally
npm run demo:evm      # verify on Ethereum only
npm run demo:soroban  # verify on Soroban only
```

---

## Video Demo

[![Watch Demo](https://img.shields.io/badge/▶️_Watch_Demo-Google_Drive-red?style=for-the-badge)](https://drive.google.com/file/d/1SSQCAanCcpsVqp4rNuM3Vh6triRtknzt/view?usp=sharing)

Shows full execution of `DEMO_AUTO=1 bash demo_video.sh`:
- ZK proof generation with live logs
- Ethereum verification with Foundry
- Stellar/Soroban verification with Docker
- Real blockchain evidence from both chains

7 minutes, end-to-end.

---

## Documentation

All docs in `/docs`:

- [Documentation Home](./docs/README.md) - start here
- [Quick Start Guide](./docs/getting-started/quickstart.md) - 5-minute setup
- [Testing Guide](./docs/testing/README.md) - testing reference
- [Demo Scripts](./docs/testing/demo-scripts.md) - demo scripts explained
- [Multi-Chain Testing](./docs/testing/multi-chain.md) - cross-chain verification

---

## Architecture

See how it works:

### [Architecture Overview](./docs/architecture/overview.md)
Visual guide with diagrams:
- System overview (component interactions)
- Multi-chain architecture (same proof, multiple blockchains)
- Circuit structure (586 constraints)
- Security properties & performance

### [Proof Flow](./docs/architecture/proof-flow.md)
Step-by-step technical flow:
- Setup phase (one-time circuit compilation)
- Proof generation (<1 second)
- Verification (off-chain & on-chain)
- Complete data flow example

Key metrics:
- Proof size: 800 bytes
- Generation time: <1 second
- Verification: <50ms off-chain, ~200k gas on-chain
- Circuit constraints: 586

---

## Interactive Tutorial

New to Zero-Knowledge Proofs?

[Interactive Tutorial: Your First Privacy Proof](./docs/getting-started/interactive-tutorial.md)

Learn by doing in 10 minutes:
- Generate your first ZK proof (age ≥ 18 without revealing exact age)
- Verify proofs locally and on-chain
- Test on both Ethereum and Stellar
- Experiment with different inputs

Good for: devs new to ZK, hands-on learners, workshop participants.

---

## Integration Examples

[View All Integration Examples](./examples/README.md)

Quick examples:

**1. [React Integration](./examples/react-integration/)**
- Browser-based proof generation
- MetaMask + Freighter wallet support
- UI with real-time status

**2. [Node.js Backend](./examples/nodejs-backend/)**
- REST API for proof verification
- Database integration (SQLite)
- Rate limiting & validation

**3. [Custom Circuits](./examples/custom-circuit/)**
- Build your own ZK circuits
- Age verification, credit scores, Merkle proofs
- Step-by-step from scratch

Code snippet (browser):
```javascript
import { groth16 } from "snarkjs";

const { proof, publicSignals } = await groth16.fullProve(
  { age: 25, balance: 150, country: 11, minAge: 18, minBalance: 50, allowedCountries: [11, 1, 5] },
  "kyc_transfer.wasm",
  "kyc_transfer_final.zkey"
);

// publicSignals[0] === "1" means KYC passed
```

---

## FAQ

[Frequently Asked Questions](./docs/FAQ.md)

Common questions:
- What is a Zero-Knowledge Proof?
- Which blockchains are supported?
- Is it secure? Has it been audited?
- How much does verification cost?
- How do I integrate this into my app?
- Can I create custom circuits?

100+ questions covering general, technical, integration, multi-chain, security, and performance.

---

## What This Does

### The Problem
Public blockchains have no transaction privacy:
- Every balance, counterparty, and amount is publicly visible
- Sensitive business data ends up on-chain
- Compliance requires selective auditability, not full privacy

### The Solution
OpenZKTool uses ZK-SNARKs to:
- Hide amounts, balances, and counterparties on-chain
- Allow full disclosure to authorized auditors and regulators
- Deploy in hours, not months
- Built-in KYC/AML audit capabilities

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

## Project Structure

```
stellar-privacy-poc/
├── circuits/                      # Circom circuits
│   ├── kyc_transfer.circom       # Main KYC circuit (combines all checks)
│   ├── range_proof.circom        # Age range validation
│   ├── solvency_check.circom     # Balance verification
│   ├── compliance_verify.circom  # Country allowlist check
│   ├── scripts/                  # Circuit build scripts
│   └── artifacts/                # Generated files (gitignored)
│
├── contracts/                     # Smart contract implementations
│   └── src/                      # Rust contracts
│
├── evm/                          # EVM verifier contracts
│   └── contracts/Verifier.sol    # Solidity Groth16 verifier
│
├── evm-verification/             # Ethereum/EVM verification
│   ├── src/Verifier.sol         # Groth16 verifier contract
│   └── test/VerifierTest.t.sol  # Foundry tests
│
├── soroban/                      # Stellar/Soroban verifier
│   ├── src/
│   │   ├── lib.rs               # Main verifier contract (v4)
│   │   ├── field.rs             # BN254 field arithmetic
│   │   ├── curve.rs             # G1/G2 curve operations
│   │   ├── fq12.rs              # Fq12 tower extension
│   │   └── pairing.rs           # Complete pairing implementation
│   └── TEST_EXECUTION_GUIDE.md  # Testing guide
│
├── web/                          # Landing page
│   ├── app/                     # Next.js application
│   └── components/              # React components
│
├── docs/                         # Documentation
│   ├── guides/                  # User guides and tutorials
│   ├── architecture/            # Technical documentation
│   ├── testing/                 # Testing documentation
│   ├── deployment/              # Deployment guides
│   ├── governance/              # Project governance
│   └── analytics/               # Project management
│
├── scripts/                      # Executable scripts
│   ├── demo/                    # Demo scripts
│   ├── testing/                 # Test scripts
│   └── pipeline/                # Build/deploy scripts
│
├── README.md
├── LICENSE                      # AGPL-3.0-or-later
└── package.json
```

Note: All documentation in `docs/`, executable scripts in `scripts/`.

---

## Technical Details

### Circuit: KYC Transfer

Inputs (private):
- `age` - user's actual age
- `balance` - user's actual balance
- `countryId` - user's country code

Public parameters:
- `minAge`, `maxAge` - age requirements (18-99)
- `minBalance` - minimum required balance ($50)

Output (public):
- `kycValid` - 1 if all checks pass, 0 otherwise

Constraints: 586
Proof size: ~800 bytes
Verification time: ~10-50ms (off-chain), ~250k gas (on-chain)

### Proof System

- Algorithm: Groth16 SNARK
- Curve: BN254 (alt_bn128)
- Trusted setup: Powers of Tau + circuit-specific setup
- Security: Computational soundness (relies on hardness of discrete log)

---

## Setup Instructions

### Prerequisites

```bash
node --version   # >= v16
circom --version # >= 2.1.9
jq --version     # for JSON formatting
```

### Installation

```bash
git clone https://github.com/fboiero/stellar-privacy-poc.git
cd stellar-privacy-poc
npm install

# Initial setup (generates Powers of Tau + proving/verification keys)
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

## Multi-Chain Deployment

### Ethereum / EVM Chains

Verifier: `circuits/evm/Verifier.sol`

Status: Fully implemented and tested on Ethereum

Deployment ready for:
- Ethereum (Mainnet, Sepolia)
- Polygon, BSC, Arbitrum, Optimism, Base (same contract, needs deployment)

```bash
# Deploy to your target network
npx hardhat run scripts/deploy.js --network polygon
```

Gas cost: ~250,000-300,000 gas per verification

Usage:
```solidity
bool valid = verifier.verifyProof(proof, publicSignals);
if (valid) {
    // User passed KYC, allow transaction
}
```

### Stellar Soroban

Verifier: `soroban/src/lib.rs`

Status: Version 4 - Complete BN254 pairing implementation

What's implemented:
- Complete BN254 field arithmetic (Fq, Fq2, Fq6, Fq12) with Montgomery form
- Full tower extension: Fq → Fq2 → Fq6 → Fq12
- Real G1/G2 elliptic curve operations (add, double, scalar mul)
- Optimal ate pairing with Miller loop algorithm
- Final exponentiation (easy + hard parts)
- Curve point validation (y² = x³ + 3)
- Full Groth16 verification with pairing check
- 20KB optimized WASM binary

Live testnet deployment:
- Contract ID: `CBPBVJJW5NMV4UVEDKSR6UO4DRBNWRQEMYKRYZI3CW6YK3O7HAZA43OI`
- [View on Stellar Expert](https://stellar.expert/explorer/testnet/contract/CBPBVJJW5NMV4UVEDKSR6UO4DRBNWRQEMYKRYZI3CW6YK3O7HAZA43OI)
- [View Deploy TX](https://stellar.expert/explorer/testnet/tx/39654bd739908d093d6d7e9362ea5cae3298332b3c7e385c49996ba08796cefc)

```bash
cd soroban
cargo build --release --target wasm32-unknown-unknown

soroban contract deploy \
  --wasm target/wasm32-unknown-unknown/release/soroban_groth16_verifier.wasm \
  --network testnet
```

Benefits:
- Production-grade crypto (not a stub)
- Lower fees than EVM chains
- Fast finality (~5 seconds)
- Native multi-asset support
- Compact 20KB WASM size
- 49+ unit tests

Docs:
- [Cryptographic Comparison](docs/architecture/CRYPTOGRAPHIC_COMPARISON.md) - EVM vs Soroban
- [Testing Strategy](docs/testing/TESTING_STRATEGY.md) - Test methodology
- [Implementation Status](soroban/IMPLEMENTATION_STATUS.md) - Dev progress

### Future Blockchain Support

Planned:
- Solana
- Cosmos/IBC chains
- Polkadot parachains
- Other Layer 2s

---

## Educational Resources

What you'll learn:
- What Zero-Knowledge Proofs are (intuitively)
- How SNARKs work (technically)
- Groth16 proof system workflow
- Circom circuit development
- Multi-chain deployment strategies

Real-world applications:
1. Privacy-preserving identity - KYC without revealing personal details
2. Blockchain scalability - zkRollups (Polygon, zkSync, StarkNet)
3. Private transactions - Zcash, Aztec Protocol
4. Verifiable computation - AI/ML model verification
5. Cross-chain bridges - Trustless state proofs
6. Regulatory compliance - Prove tax compliance without revealing income

---

## Example Use Cases

### Age Verification

```json
{
  "age": 25,
  "minAge": 18,
  "maxAge": 99
}
```

Proof: "User is between 18-99"
Hidden: Exact age (25)

### Solvency Check

```json
{
  "balance": 150,
  "minBalance": 50
}
```

Proof: "User has ≥ $50"
Hidden: Exact balance ($150)

### Country Compliance

```json
{
  "countryId": 32
}
```

Proof: "User is from allowed country"
Hidden: Exact country (Argentina)

---

## Products & Services (Planned)

Full SDK will include:

1. ZK Circuits (Circom)
   - Prebuilt, audited circuits for private transfers, balance proofs, counterparty masking
   - Optimized constraint systems

2. Soroban Verification Contracts (Rust)
   - Smart contracts on Soroban to verify ZK proofs on-chain
   - Gas-optimized verification logic
   - Mainnet ready

3. JavaScript/TypeScript SDK
   - Easy-to-use SDK for front-end/back-end developers
   - Generate proofs and integrate with verification contracts
   - Browser and Node.js support

4. Banking Integration Layer
   - Adapters for institutions (KYC/AML/audit disclosures)
   - Authorized party disclosures
   - Regulatory compliance tools

5. Compliance Dashboard
   - Dashboard for institutions and auditors
   - Audit trails and proof verification status
   - Monitoring and alerts

6. Security Audit & Documentation
   - Independent audit of circuits and contracts
   - Complete documentation
   - Best practices and integration guides

### Current POC Status

What's implemented:
- ZK circuit (Circom) generating valid proofs
- Soroban contract verifying proofs
- SDK connecting components
- Web demo showing flow
- Multi-chain verification (EVM + Soroban)
- Complete documentation

Performance:
- Proof generation: <1 second
- Circuit constraints: ~100 (very efficient)
- Contract deployed on testnet
- End-to-end flow works

Bottom line: Technical approach viable, performance acceptable, integration possible, ready to scale.

---

## Technical Performance

| Metric | Current POC | Production Target |
|--------|-------------|-------------------|
| Circuit Constraints | 586 | <10,000 |
| Proof Size | ~800 bytes | <2KB |
| Proof Generation | <1 second | <2 seconds |
| Verification (off-chain) | ~10-50ms | <100ms |
| Verification (Soroban) | Testnet | Mainnet ready |
| Security Audit | Pending | Completed |

---

## Digital Public Good (DPG) Compliance

OpenZKTool complies with Digital Public Goods Alliance (DPGA) standards to be recognized as a Digital Public Good contributing to the UN Sustainable Development Goals (SDGs).

### DPG Standard - 9 Indicators

| Indicator | Requirement | Evidence | Status |
|-----------|-------------|----------|--------|
| 1. SDG Relevance | Alignment with SDGs | [SDG_MAPPING.md](./docs/governance/SDG_MAPPING.md) | Complete |
| 2. Open License | Approved open source license | [LICENSE](./LICENSE) (AGPL-3.0) | Complete |
| 3. Clear Ownership | Defined ownership | Team X1 - Xcapit Labs | Complete |
| 4. Platform Independence | No vendor lock-in | [PLATFORM_INDEPENDENCE.md](./docs/architecture/PLATFORM_INDEPENDENCE.md) | Complete |
| 5. Documentation | Technical documentation | [docs/](./docs/) | Complete |
| 6. Non-PII Data | Non-PII data extraction | Proofs without PII, open formats | Complete |
| 7. Privacy & Legal | Legal compliance | [PRIVACY.md](./docs/governance/PRIVACY.md) | Complete |
| 8. Open Standards | Open standards | Groth16, Circom, Solidity, Rust | Complete |
| 9. Do No Harm | Protection policies | [DO_NO_HARM.md](./docs/governance/DO_NO_HARM.md) | Complete |

### SDG Contributions

OpenZKTool contributes to:

- SDG 9: Industry, Innovation and Infrastructure
  - Open source privacy infrastructure for blockchains
  - Financial technology innovation with ZK-SNARKs
  - Multi-chain interoperability

- SDG 10: Reduced Inequalities
  - Financial privacy accessible to everyone (not just institutions)
  - Prevents discrimination based on personal data
  - Inclusion of 1.7 billion unbanked people

- SDG 16: Peace, Justice and Strong Institutions
  - Transparency with privacy (selective disclosure for regulators)
  - Protection of fundamental freedoms (financial privacy)
  - Accountable and auditable institutions

- SDG 8: Decent Work and Economic Growth
  - New economic opportunities in private DeFi
  - Access to financial services (microcredit, remittances)
  - Empowers entrepreneurs with free infrastructure

Full details: [SDG_MAPPING.md](./docs/governance/SDG_MAPPING.md)

### Compliance Documentation

| Document | Description | Link |
|----------|-------------|------|
| CODE_OF_CONDUCT.md | Community code of conduct | [View](./docs/governance/CODE_OF_CONDUCT.md) |
| SDG_MAPPING.md | Alignment with Sustainable Development Goals | [View](./docs/governance/SDG_MAPPING.md) |
| PRIVACY.md | Privacy policy and data protection | [View](./docs/governance/PRIVACY.md) |
| PLATFORM_INDEPENDENCE.md | Platform independence and alternatives | [View](./docs/architecture/PLATFORM_INDEPENDENCE.md) |
| DO_NO_HARM.md | "Do No Harm by Design" policy | [View](./docs/governance/DO_NO_HARM.md) |
| LICENSE | Open source license (AGPL-3.0) | [View](./LICENSE) |
| SECURITY.md | Security policies and vulnerability reporting | [View](./SECURITY.md) |

### DPGA Registry Application

Status: Preparing for submission

Next steps:
1. Complete compliance documentation (done)
2. Professional security audit (Q1 2026) - By UTN FRVM Blockchain Lab research team
   - Francisco Anuar Ardúh (Principal Researcher)
   - Joel Edgar Dellamaggiore Kuns (Blockchain Specialist)
3. Formal DPGA submission
4. Technical review by DPGA (30 days)
5. Inclusion in DPG Registry

More info: https://digitalpublicgoods.net/submission-guide

---

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
- Twitter: [@XcapitOfficial](https://twitter.com/XcapitOfficial)

---

## Links

- OpenZKTool Website: https://openzktool.vercel.app
- Repository: https://github.com/fboiero/stellar-privacy-poc
- Xcapit Labs: https://xcapit.com
- Circom Docs: https://docs.circom.io
- ZK Learning Resources: https://zkp.science

---

If you find this useful, star the repo.

Ready to prove without revealing? Try the demo: `bash scripts/demo/demo_multichain.sh`
