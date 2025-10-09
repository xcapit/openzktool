# 🔐 ZKPrivacy

**Stellar Privacy SDK — Zero-Knowledge Proof Toolkit for TradFi**

> *Project Name:* **Stellar Privacy SDK** | *Brand:* **ZKPrivacy**
> *Status:* **Proof of Concept** | *Grant Proposal:* **SCF #40 Build Award** | *Duration:* **6 months**

A production-ready SDK enabling developers, retail partners, and financial institutions to execute **privacy-preserving transactions** on Stellar using **ZK-SNARKs** — with full regulatory compliance and auditability for real-world institutional use.

> 🎯 **Mission:** Enable private transactions (hidden amounts, balances, counterparties) while maintaining regulatory transparency for authorized auditors.

[![License: AGPL-3.0](https://img.shields.io/badge/License-AGPL%203.0-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)
[![Circom](https://img.shields.io/badge/Circom-2.1.9-brightgreen)](https://docs.circom.io/)
[![Solidity](https://img.shields.io/badge/Solidity-0.8+-orange)](https://soliditylang.org/)
[![Website](https://img.shields.io/badge/Website-zkprivacy.vercel.app-purple)](https://zkprivacy.vercel.app)

🌐 **Website:** [https://zkprivacy.vercel.app](https://zkprivacy.vercel.app)

---

## 🚀 Quick Start

### Option 1: Full Flow Test (Automated) ⚡

Test everything in one command:

```bash
# Install dependencies
npm install

# Run complete test suite (auto mode)
npm test

# OR run with interactive prompts
npm run test:interactive
```

**Duration:** 3-5 minutes | **Tests:**
- ✅ Circuit compilation & trusted setup
- ✅ Proof generation & local verification
- ✅ EVM verification (Ethereum/Anvil)
- ✅ Soroban verification (Stellar)

### Option 2: Privacy Proof Demo (Best for Non-Technical Audiences) 💡

Tell the story of Alice proving she's eligible without revealing her data:

```bash
# Install dependencies
npm install

# Run initial setup (one-time)
npm run setup

# Run the privacy-focused narrative demo
npm run demo:privacy
```

**Duration:** 5-7 minutes | **Perfect for:** Business stakeholders, investors, non-technical audiences

**The Story:**
- 👤 Alice needs to prove she's eligible for a financial service
- 🔒 She proves: Age ≥ 18, Balance ≥ $50, Country allowed
- ❌ WITHOUT revealing: Her exact age (25), balance ($150), or country (Argentina)
- ⛓️ The proof is verified on BOTH Ethereum and Stellar blockchains
- ✨ Privacy + Compliance achieved!

### Option 3: Multi-Chain Demo (Technical Presentations) 🌐

```bash
# Run the multi-chain verification demo
npm run demo
```

**Duration:** 5-7 minutes | **Perfect for:** Technical audiences, grant reviewers, developers

**What you'll see:**
- 🔐 Zero-knowledge proof generation
- ⛓️ Verification on Ethereum (local testnet)
- 🌟 Verification on Stellar/Soroban
- 🎯 TRUE multi-chain interoperability

### Option 4: Individual Commands

```bash
npm run setup         # Compile circuit & generate keys (one-time)
npm run prove         # Generate proof & verify locally
npm run demo:evm      # Verify on Ethereum only
npm run demo:soroban  # Verify on Soroban only
```

---

## 🧠 What This SDK Does

### The Problem
Retail partners and financial institutions face a critical barrier to adopting public blockchains:

- 🔓 **No Transaction Privacy**: Every balance, counterparty, and amount is publicly visible
- 🔓 **Business Data Exposure**: Sensitive commercial information is on-chain
- 🔓 **Regulatory Barriers**: Privacy protocols must meet compliance standards requiring selective auditability

### The Solution
The **Stellar Privacy SDK** uses **Zero-Knowledge Proofs (ZK-SNARKs)** to enable:

- ✅ **Private Transactions**: Hide amounts, balances, and counterparties on-chain
- ✅ **Regulatory Transparency**: Full disclosure to authorized auditors and regulators
- ✅ **Developer-Ready Integration**: Deploy in hours, not months
- ✅ **Compliance by Design**: Built-in KYC/AML audit capabilities

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
│   │   ├── full_demo.sh         # Complete educational demo
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
├── evm-verification/            # Ethereum/EVM verification
│   ├── src/Verifier.sol        # Groth16 verifier contract
│   ├── test/VerifierTest.t.sol # Foundry test
│   └── verify_on_chain.sh      # Automated verification script
│
├── soroban/                     # Stellar/Soroban verifier
│   ├── src/lib.rs              # Rust verifier contract (no_std)
│   └── verify_on_chain.sh      # Automated verification script
│
├── test_full_flow.sh            # Complete test suite (interactive)
├── test_full_flow_auto.sh       # Complete test suite (auto mode)
├── demo_multichain.sh           # Multi-chain demo (technical)
└── demo_privacy_proof.sh        # Privacy narrative demo (non-technical)
│
├── web/                         # ZKPrivacy landing page
│   └── (Next.js 14 app)        # https://zkprivacy.vercel.app
│
├── demo_multichain.sh           # Multi-chain demo ⭐
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
| `demo_multichain.sh` 🌐 | **Multi-chain verification**: EVM + Soroban | 5-7 min | **Showcasing interoperability** ⭐ |
| `full_demo.sh` | Complete education: Theory + Practice + Benefits | 8-10 min | Learning, teaching, presentations |
| `demo_auto.sh` | Auto-play technical demo | 3-4 min | Video recording, quick walkthrough |
| `demo.sh` | Interactive demo with manual pauses | 5-6 min | Live presentations, workshops |
| `prove_and_verify.sh` | Quick proof generation only | 30 sec | Testing, development |

### Example: Multi-Chain Demo (Recommended) 🌐

```bash
bash demo_multichain.sh
```

**What it shows:**
1. 🔐 **Proof Generation**: Create a Groth16 ZK proof for KYC compliance
2. ⛓️ **EVM Verification**: Deploy and verify on local Ethereum testnet (Foundry/Anvil)
3. 🌟 **Soroban Verification**: Deploy and verify SAME proof on Stellar/Soroban
4. 🎯 **Interoperability**: One proof, multiple blockchains

### Example: Full Educational Demo

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

## 📦 Products & Services (Planned)

### Grant-Funded Deliverables

The full Stellar Privacy SDK will include:

1. **🔧 ZK Circuits (Circom)**
   - Prebuilt, audited circuits for private transfers, balance proofs, counterparty masking
   - Optimized constraint systems for production use

2. **⛓️ Soroban Verification Contracts (Rust)**
   - Smart contracts on Soroban to verify ZK proofs on-chain
   - Gas-optimized verification logic
   - Mainnet deployment ready

3. **📚 JavaScript/TypeScript SDK**
   - Easy-to-use SDK for front-end/back-end developers
   - Generate proofs and integrate with verification contracts
   - Browser and Node.js support

4. **🏦 Banking Integration Layer**
   - Adapters for institutions (KYC/AML/audit disclosures)
   - Enable authorized party disclosures
   - Regulatory compliance tools

5. **📊 Compliance Dashboard**
   - Dashboard for institutions and auditors
   - Audit trails and proof verification status
   - Monitoring and alerts

6. **🔒 Security Audit & Documentation**
   - Independent audit of circuits and contracts
   - Complete documentation for adoption
   - Best practices and integration guides

### Current POC Status

✅ **What's Implemented:**
- ZK circuit (Circom) generating valid proofs
- Soroban contract verifying proofs
- SDK connecting components
- Web demo showing flow
- Multi-chain verification (EVM + Soroban)
- Complete documentation

⚡ **Performance:**
- Proof generation: <1 second
- Circuit constraints: ~100 (very efficient)
- Contract deployed on testnet
- End-to-end flow works

**What This Proves:** Technical approach viable, performance acceptable, integration possible, ready to scale to production.

---

## 📊 Technical Performance

| Metric | Current POC | Production Target |
|--------|-------------|-------------------|
| Circuit Constraints | 586 | <10,000 |
| Proof Size | ~800 bytes | <2KB |
| Proof Generation | <1 second | <2 seconds |
| Verification (off-chain) | ~10-50ms | <100ms |
| Verification (Soroban) | Testnet ✅ | Mainnet ready |
| Security Audit | Pending | ✅ Completed |

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

## 🚧 Development Roadmap

### ✅ Completed: Proof of Concept (Pre-Grant)
- [x] KYC Transfer circuit implementation
- [x] EVM Solidity verifier
- [x] Soroban Rust verifier (testnet)
- [x] Multi-chain demo scripts
- [x] Educational documentation
- [x] Web landing page (zkprivacy.vercel.app)

### 🔨 Tranche 1: MVP Development (Months 1-5)

**Production ZK Circuits:**
- [ ] Private transaction circuits (amount hiding)
- [ ] Balance proof circuits
- [ ] Counterparty masking circuits
- [ ] Circuit optimization and formal verification

**Soroban Contracts:**
- [ ] Production verification contracts
- [ ] Gas optimization
- [ ] Testnet deployment and testing
- [ ] Integration testing

**SDK Development:**
- [ ] JavaScript/TypeScript SDK (v1.0)
- [ ] Proof generation libraries
- [ ] WASM/browser support
- [ ] Sample applications and demos

**Documentation:**
- [ ] API reference
- [ ] Integration guides
- [ ] Developer tutorials
- [ ] Architecture documentation

### 🏦 Tranche 2: Testnet & Pilot Integration (Month 6)

**Pilot Partner Integration:**
- [ ] Onboard 2 pilot partners on testnet
- [ ] Real-world transaction testing
- [ ] Performance monitoring and optimization

**Banking Integration Layer:**
- [ ] KYC/AML compliance interface
- [ ] Authorized auditor disclosure system
- [ ] Regulatory reporting tools

**Compliance Dashboard:**
- [ ] Audit trail viewer
- [ ] Proof verification status
- [ ] Monitoring and alerts
- [ ] Partner onboarding tools

**Security:**
- [ ] Independent security audit of circuits
- [ ] Contract audit
- [ ] Penetration testing
- [ ] Fix identified issues

### 🚀 Tranche 3: Mainnet Launch & Scaling (Month 6)

**Mainnet Deployment:**
- [ ] Deploy verification contracts on Soroban mainnet
- [ ] Gas cost optimization and monitoring
- [ ] Infrastructure setup (RPC, indexers)

**Production Release:**
- [ ] Publish final audit reports
- [ ] Complete documentation
- [ ] Demo videos and tutorials
- [ ] Open source release announcement

**Ecosystem Growth:**
- [ ] Onboard 5+ partners on mainnet (first 3 months)
- [ ] Developer community support
- [ ] Ongoing maintenance and updates
- [ ] Feature roadmap for Phase 2

### 🔮 Future Phases (Post-Grant)
- [ ] Mobile SDK integration
- [ ] Additional circuit libraries (Merkle proofs, signatures)
- [ ] Cross-chain proof aggregation
- [ ] Advanced privacy features (mixers, shielded pools)
- [ ] zkEVM integration for full smart contract privacy

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

## 👥 Team

**Team X1 - Xcapit Labs** (6 members)

| Role | Name | Responsibilities |
|------|------|------------------|
| Project Lead & Cryptography Advisor | Fernando Boiero | Architecture, circuit design, security strategy |
| Soroban Contract Lead | Maximiliano César Nivoli | Rust contracts, verification logic, gas optimization |
| ZK Circuit / Cryptographer | Francisco Anuar Ardúh | Circom circuits, optimization, formal verification |
| ZKP Proof Specialist | Joel Edgar Dellamaggiore Kuns | Proof generation libraries, WASM/browser support |
| DevOps & Infrastructure Lead | Franco Schillage | CI/CD, testnet/mainnet deployment, monitoring |
| QA Specialists | Natalia Gatti, Carolina Medina | Testing, security, documentation quality |

**Strengths:**
- PhD-level cryptography expertise
- Deep Stellar/Soroban familiarity (6+ months)
- 6+ years blockchain development experience
- Academic partnerships (UTN - Universidad Tecnológica Nacional)
- Previous SCF grant recipient (Offline Wallet)

**Location:** Argentina (remote-friendly, global focus, LATAM expertise)

---

## 💰 Grant Proposal

**Stellar Community Fund #40 - Build Award**
- **Category:** Infrastructure & Services / Developer Tools
- **Duration:** 6 months
- **Status:** Proposed
- **Type:** Privacy SDK for TradFi

**Proposed Tranche Structure:**
1. **Tranche 1 (Months 1-5):** MVP Development
2. **Tranche 2 (Month 6):** Testnet & Pilot Integration
3. **Tranche 3 (Month 6):** Mainnet Launch & Scaling

**Success Criteria:**
- Production-ready ZK circuits and Soroban contracts
- Complete JS/TS SDK with documentation
- Banking/regulatory integration layer functional
- Independent security audit completed
- **5+ ecosystem partners onboarded on mainnet** within first 3 months
- **2 pilot partners testing on testnet**

---

## 🎯 Impact & Vision

**Unlocking TradFi for Stellar:**
- Enable institutional adoption of Stellar for private transactions
- Support cross-border B2B payments with high transaction volumes
- Compete with traditional finance by adding privacy + auditability
- Bridge Web2 financial institutions to Web3

**Network Effects:**
- Developers build privacy-preserving dApps
- Institutions bring liquidity and transaction volume
- Stellar ecosystem grows in revenue and real-world usage
- Regulatory compliance becomes a feature, not a barrier

---

## 🏗️ Built With

**Core Technologies:**
- [Circom](https://docs.circom.io/) - Circuit compiler
- [snarkjs](https://github.com/iden3/snarkjs) - SNARK toolkit
- [circomlib](https://github.com/iden3/circomlib) - Circuit library
- [Foundry](https://book.getfoundry.sh/) - Ethereum development framework
- [Soroban SDK](https://soroban.stellar.org/) - Stellar smart contracts
- [Stellar CLI](https://developers.stellar.org/docs/tools/developer-tools) - Soroban deployment

**Cryptographic Primitives:**
- Groth16 SNARKs (BN254/alt_bn128 curve)
- Poseidon hash function
- Merkle tree proofs
- Range proofs

---

## 📞 Support

- **GitHub Issues:** [Report a bug](https://github.com/xcapit/stellar-privacy-poc/issues)
- **Discussions:** [Ask questions](https://github.com/xcapit/stellar-privacy-poc/discussions)
- **Twitter:** [@XcapitOfficial](https://twitter.com/XcapitOfficial)

---

## 🔗 Links

- **🌐 ZKPrivacy Website:** https://zkprivacy.vercel.app
- **Repository:** https://github.com/xcapit/stellar-privacy-poc
- **Xcapit Labs:** https://xcapit.com
- **Circom Docs:** https://docs.circom.io
- **ZK Learning Resources:** https://zkp.science

---

**⭐ If you find this project useful, please star the repository!**

**Ready to prove without revealing?**

🌐 **Visit:** [zkprivacy.vercel.app](https://zkprivacy.vercel.app)

🚀 **Try the demo:** `bash demo_multichain.sh`
