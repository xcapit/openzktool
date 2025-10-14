# 🔐 OpenZKTool

**Open Source Zero-Knowledge Proof Toolkit for Multi-Chain Privacy**

> *Project Name:* **OpenZKTool**
> *Status:* **Proof of Concept**

An open source toolkit enabling developers and institutions to build **privacy-preserving applications** using **ZK-SNARKs** across multiple blockchains — with full regulatory compliance and auditability for real-world use.

> 🎯 **Mission:** Make Zero-Knowledge Proofs accessible for developers on Stellar Soroban, EVM chains, and beyond — enabling private transactions while maintaining regulatory transparency.

[![License: AGPL-3.0](https://img.shields.io/badge/License-AGPL%203.0-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)
[![GitHub Stars](https://img.shields.io/github/stars/xcapit/openzktool?style=social)](https://github.com/xcapit/openzktool)
[![Website](https://img.shields.io/website?url=https%3A%2F%2Fopenzktool.vercel.app)](https://openzktool.vercel.app)
[![Digital Public Good](https://img.shields.io/badge/Digital%20Public%20Good-Certified-brightgreen)](./docs/governance/SDG_MAPPING.md)

![Soroban Tests](https://github.com/xcapit/openzktool/workflows/Soroban%20Tests/badge.svg)
![EVM Tests](https://github.com/xcapit/openzktool/workflows/EVM%20Tests/badge.svg)
![Circuit Tests](https://github.com/xcapit/openzktool/workflows/Circuit%20Tests/badge.svg)
![Web Build](https://github.com/xcapit/openzktool/workflows/Web%20Build/badge.svg)
![Security](https://github.com/xcapit/openzktool/workflows/Security/badge.svg)

[![Circom](https://img.shields.io/badge/Circom-2.1.9-brightgreen)](https://docs.circom.io/)
[![Solidity](https://img.shields.io/badge/Solidity-0.8+-orange)](https://soliditylang.org/)
[![Rust](https://img.shields.io/badge/Rust-1.75+-red)](https://www.rust-lang.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue)](https://www.typescriptlang.org/)

🌐 **Website:** [https://openzktool.vercel.app](https://openzktool.vercel.app)

---

## 🎬 Complete Demo (NEW!)

**Watch the full capabilities of OpenZKTool in 5 minutes!**

```bash
# Interactive demonstration (recommended)
./DEMO_COMPLETE.sh

# Automatic mode (for presentations)
DEMO_AUTO=1 ./DEMO_COMPLETE.sh
```

**What you'll see:**
- 🔐 Zero-Knowledge Proof Generation (Alice's story)
- ✅ Local Verification (<50ms)
- ⛓️ Multi-Chain Verification (EVM + Soroban)
- 🌐 Real-World Use Case (Privacy + Compliance)

📖 **[Complete Demo Guide](./DEMO_GUIDE_COMPLETE.md)** | 📝 **[Quick Start](./DEMO_README.md)**

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

## 🎥 Video Demo

**Watch the complete demo in action:**

[![OpenZKTool Demo Video](https://img.shields.io/badge/▶️_Watch_Demo-Google_Drive-red?style=for-the-badge)](https://drive.google.com/file/d/1SSQCAanCcpsVqp4rNuM3Vh6triRtknzt/view?usp=sharing)

This video shows the full execution of `DEMO_AUTO=1 bash demo_video.sh`, including:
- 🔐 Zero-knowledge proof generation with live logs
- ⛓️  Ethereum verification with Foundry (forge test output)
- 🌟 Stellar/Soroban verification with Docker deployment
- ✅ Real blockchain evidence from both chains
- 📊 Complete multi-chain interoperability demonstration

**Duration:** ~7 minutes | **Perfect for:** Understanding how everything works end-to-end

---

## 📚 Documentation

**Complete technical documentation is available in the `/docs` folder:**

- 📖 **[Documentation Home](./docs/README.md)** - Start here
- ⚡ **[Quick Start Guide](./docs/getting-started/quickstart.md)** - 5-minute setup
- 🧪 **[Testing Guide](./docs/testing/README.md)** - Complete testing reference
- 🎬 **[Demo Scripts](./docs/testing/demo-scripts.md)** - All demo scripts explained
- 🌐 **[Multi-Chain Testing](./docs/testing/multi-chain.md)** - Cross-chain verification

**Quick links:**
- Need help? → [Testing Guide](./docs/testing/README.md)
- First time? → [Quick Start](./docs/getting-started/quickstart.md)
- Want demos? → [Demo Scripts](./docs/testing/demo-scripts.md)

---

## 🏗️ Architecture

**Understand how OpenZKTool works with visual diagrams:**

### 📐 [**Architecture Overview →**](./docs/architecture/overview.md)
Complete visual guide with Mermaid diagrams showing:
- 🎯 System overview (how components interact)
- 🌐 Multi-chain architecture (same proof, multiple blockchains)
- 🔧 Circuit structure (586 constraints breakdown)
- 🔐 Security properties & performance metrics

### 🔄 [**Proof Flow →**](./docs/architecture/proof-flow.md)
Step-by-step technical flow with sequence diagrams:
- ⚙️  Setup phase (one-time circuit compilation)
- ⚡ Proof generation (<1 second)
- ✅ Verification (off-chain & on-chain)
- 📊 Complete data flow example with Alice's data

**Key Metrics:**
- **Proof Size:** 800 bytes
- **Generation Time:** <1 second
- **Verification:** <50ms off-chain, ~200k gas on-chain
- **Circuit Constraints:** 586 (very efficient)

---

## 🎮 Interactive Tutorial

**New to Zero-Knowledge Proofs? Start with our interactive tutorial:**

👉 **[Interactive Tutorial: Your First Privacy Proof →](./docs/getting-started/interactive-tutorial.md)**

**Learn by doing in 10 minutes:**
- ✅ Generate your first ZK proof (age ≥ 18 without revealing exact age)
- ✅ Verify proofs locally and on-chain
- ✅ Test on both Ethereum and Stellar
- ✅ Experiment with different inputs
- ✅ Understand the complete flow

**Perfect for:** Developers new to ZK, hands-on learners, workshop participants

---

## 💻 Integration Examples

**Ready to integrate OpenZKTool into your app?**

👉 **[View All Integration Examples →](./examples/README.md)**

### Quick Examples:

**1. [React Integration](./examples/react-integration/)** 🎨
- Browser-based proof generation
- MetaMask + Freighter wallet support
- Full UI with real-time status

**2. [Node.js Backend](./examples/nodejs-backend/)** ⚙️
- REST API for proof verification
- Database integration (SQLite)
- Rate limiting & validation

**3. [Custom Circuits](./examples/custom-circuit/)** 🔧
- Build your own ZK circuits
- Age verification, credit scores, Merkle proofs
- Step-by-step from scratch

**Code Snippet (Browser):**
```javascript
import { groth16 } from "snarkjs";

const { proof, publicSignals } = await groth16.fullProve(
  { age: 25, balance: 150, country: 11, minAge: 18, minBalance: 50, allowedCountries: [11, 1, 5] },
  "kyc_transfer.wasm",
  "kyc_transfer_final.zkey"
);

// publicSignals[0] === "1" means KYC passed ✅
```

---

## ❓ FAQ

**Common questions answered:**

👉 **[Frequently Asked Questions →](./docs/FAQ.md)**

**Quick answers:**
- 🤔 What is a Zero-Knowledge Proof?
- 🌐 Which blockchains are supported?
- 🔐 Is it secure? Has it been audited?
- ⚡ How much does verification cost?
- 💻 How do I integrate this into my app?
- 🔧 Can I create custom circuits?

**100+ questions answered** covering general, technical, integration, multi-chain, security, and performance topics.

---

## 🧠 What This SDK Does

### The Problem
Retail partners and financial institutions face a critical barrier to adopting public blockchains:

- 🔓 **No Transaction Privacy**: Every balance, counterparty, and amount is publicly visible
- 🔓 **Business Data Exposure**: Sensitive commercial information is on-chain
- 🔓 **Regulatory Barriers**: Privacy protocols must meet compliance standards requiring selective auditability

### The Solution
**OpenZKTool** uses **Zero-Knowledge Proofs (ZK-SNARKs)** to enable:

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
├── docs/                         # 📚 Documentation (reorganized!)
│   ├── guides/                  # User guides and tutorials
│   │   ├── QUICKSTART.md
│   │   ├── COMPLETE_DEMO.md
│   │   └── DEMO_GUIDE.md
│   ├── architecture/            # Technical documentation
│   │   ├── CRYPTOGRAPHIC_COMPARISON.md
│   │   └── CONTRACTS_ARCHITECTURE.md
│   ├── testing/                 # Testing documentation
│   │   └── TESTING_STRATEGY.md
│   ├── deployment/              # Deployment guides
│   ├── governance/              # Project governance
│   └── analytics/               # Project management
│       └── ROADMAP.md
│
├── scripts/                      # 🔧 Executable scripts (reorganized!)
│   ├── demo/                    # Demo scripts
│   │   ├── demo_multichain.sh
│   │   ├── demo_privacy_proof.sh
│   │   └── demo_video.sh
│   ├── testing/                 # Test scripts
│   │   ├── quick_test.sh
│   │   └── test_full_flow.sh
│   └── pipeline/                # Build/deploy scripts
│       └── complete_pipeline.sh
│
├── README.md                    # This file
├── LICENSE                      # AGPL-3.0-or-later
└── package.json                 # npm configuration
```

> **Note:** Repository reorganized for better clarity. All documentation is now in `docs/` and executable scripts in `scripts/`.

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

### ✅ Ethereum / EVM Chains (Implemented)

**Verifier Contract:** `circuits/evm/Verifier.sol`

**Status:** ✅ Fully implemented and tested on Ethereum

**Deployment ready for:**
- ✅ Ethereum (Mainnet, Sepolia)
- ⏳ Polygon (same contract, needs deployment)
- ⏳ BSC (same contract, needs deployment)
- ⏳ Arbitrum, Optimism, Base (same contract, needs deployment)

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

### ✅ Stellar Soroban (Complete Pairing Implementation v4)

**Verifier Contract:** `soroban/src/lib.rs`

**Status:** ✅ **Version 4 - COMPLETE BN254 pairing implementation**

**What's Implemented:**
- ✅ Complete BN254 field arithmetic (Fq, Fq2, Fq6, Fq12) with Montgomery form
- ✅ Full tower extension: Fq → Fq2 → Fq6 → Fq12
- ✅ Real G1/G2 elliptic curve operations (add, double, scalar mul)
- ✅ **Optimal ate pairing** with Miller loop algorithm
- ✅ **Final exponentiation** (easy + hard parts)
- ✅ Actual curve point validation (y² = x³ + 3)
- ✅ Full Groth16 verification with pairing check
- ✅ 20KB optimized WASM binary

**Live Testnet Deployment:**
- **Contract ID:** `CBPBVJJW5NMV4UVEDKSR6UO4DRBNWRQEMYKRYZI3CW6YK3O7HAZA43OI`
- **Explorer:** [View on Stellar Expert](https://stellar.expert/explorer/testnet/contract/CBPBVJJW5NMV4UVEDKSR6UO4DRBNWRQEMYKRYZI3CW6YK3O7HAZA43OI)
- **Deploy TX:** [View Transaction](https://stellar.expert/explorer/testnet/tx/39654bd739908d093d6d7e9362ea5cae3298332b3c7e385c49996ba08796cefc)

```bash
# Build from source
cd soroban
cargo build --release --target wasm32-unknown-unknown

# Deploy to testnet
soroban contract deploy \
  --wasm target/wasm32-unknown-unknown/release/soroban_groth16_verifier.wasm \
  --network testnet
```

**Benefits:**
- 🔐 Production-grade cryptographic implementation (not a stub!)
- ⚡ Lower fees than EVM chains
- 🚀 Fast finality (~5 seconds)
- 💰 Native multi-asset support
- 📦 Compact 20KB WASM size
- 🧪 49+ comprehensive unit tests

**Technical Details:**
- [Cryptographic Comparison](docs/architecture/CRYPTOGRAPHIC_COMPARISON.md) - EVM vs Soroban implementation
- [Testing Strategy](docs/testing/TESTING_STRATEGY.md) - Complete test methodology
- [Implementation Status](soroban/IMPLEMENTATION_STATUS.md) - Development progress

### ⏳ Future Blockchain Support (Planned)

Additional blockchain integrations planned for future phases:
- Solana
- Cosmos/IBC chains
- Polkadot parachains
- Other Layer 2s

---

## 📚 Documentation

- **[QUICKSTART.md](docs/guides/QUICKSTART.md)** - Get started in 1 command
- **[DEMO.md](docs/guides/DEMO.md)** - Detailed step-by-step guide
- **[COMPLETE_DEMO.md](docs/guides/COMPLETE_DEMO.md)** - Full demo documentation
- **[VIDEO_DEMO.md](docs/guides/VIDEO_DEMO.md)** - Tips for recording videos
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

## 🌍 Digital Public Good (DPG) Compliance

OpenZKTool complies with **Digital Public Goods Alliance (DPGA)** standards to be recognized as a Digital Public Good that contributes to the UN Sustainable Development Goals (SDGs).

### ✅ DPG Standard - 9 Indicators

| Indicator | Requirement | Evidence | Status |
|-----------|-------------|----------|--------|
| **1. SDG Relevance** | Alignment with SDGs | [SDG_MAPPING.md](./docs/governance/SDG_MAPPING.md) | ✅ Complete |
| **2. Open License** | Approved open source license | [LICENSE](./LICENSE) (AGPL-3.0) | ✅ Complete |
| **3. Clear Ownership** | Defined ownership | Team X1 - Xcapit Labs | ✅ Complete |
| **4. Platform Independence** | No vendor lock-in | [PLATFORM_INDEPENDENCE.md](./docs/architecture/PLATFORM_INDEPENDENCE.md) | ✅ Complete |
| **5. Documentation** | Technical documentation | [docs/](./docs/) | ✅ Complete |
| **6. Non-PII Data** | Non-PII data extraction | Proofs without PII, open formats | ✅ Complete |
| **7. Privacy & Legal** | Legal compliance | [PRIVACY.md](./docs/governance/PRIVACY.md) | ✅ Complete |
| **8. Open Standards** | Open standards | Groth16, Circom, Solidity, Rust | ✅ Complete |
| **9. Do No Harm** | Protection policies | [DO_NO_HARM.md](./docs/governance/DO_NO_HARM.md) | ✅ Complete |

### 🎯 SDG Contributions

OpenZKTool directly contributes to:

- **SDG 9:** Industry, Innovation and Infrastructure
  - Open source privacy infrastructure for blockchains
  - Financial technology innovation with ZK-SNARKs
  - Multi-chain interoperability

- **SDG 10:** Reduced Inequalities
  - Financial privacy accessible to everyone (not just institutions)
  - Prevents discrimination based on personal data
  - Inclusion of 1.7 billion unbanked people

- **SDG 16:** Peace, Justice and Strong Institutions
  - Transparency with privacy (selective disclosure for regulators)
  - Protection of fundamental freedoms (financial privacy)
  - Accountable and auditable institutions

- **SDG 8:** Decent Work and Economic Growth
  - New economic opportunities in private DeFi
  - Access to financial services (microcredit, remittances)
  - Empowers entrepreneurs with free infrastructure

**Full details:** [SDG_MAPPING.md](./docs/governance/SDG_MAPPING.md)

### 📋 Compliance Documentation

| Document | Description | Link |
|----------|-------------|------|
| **CODE_OF_CONDUCT.md** | Community code of conduct | [View](./docs/governance/CODE_OF_CONDUCT.md) |
| **SDG_MAPPING.md** | Alignment with Sustainable Development Goals | [View](./docs/governance/SDG_MAPPING.md) |
| **PRIVACY.md** | Privacy policy and data protection | [View](./docs/governance/PRIVACY.md) |
| **PLATFORM_INDEPENDENCE.md** | Platform independence and alternatives | [View](./docs/architecture/PLATFORM_INDEPENDENCE.md) |
| **DO_NO_HARM.md** | "Do No Harm by Design" policy | [View](./docs/governance/DO_NO_HARM.md) |
| **LICENSE** | Open source license (AGPL-3.0) | [View](./LICENSE) |
| **SECURITY.md** | Security policies and vulnerability reporting | [View](./SECURITY.md) |

### 🏆 DPGA Registry Application

**Status:** Preparing for submission

**Next steps:**
1. ✅ Complete compliance documentation (done)
2. 🔜 Professional security audit (Q1 2026) - By UTN FRVM Blockchain Lab research team
   - Francisco Anuar Ardúh (Principal Researcher)
   - Joel Edgar Dellamaggiore Kuns (Blockchain Specialist)
3. 🔜 Formal DPGA submission
4. 🔜 Technical review by DPGA (30 days)
5. 🔜 Inclusion in DPG Registry

**More information:** https://digitalpublicgoods.net/submission-guide

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

## 🚀 Roadmap – Multi-Chain Privacy Infrastructure

**PoC → MVP → Testnet → Mainnet**

### Phase 0 – Proof of Concept (✅ Completed)

**Goal:** Validate the feasibility of privacy-preserving verification using Zero-Knowledge Proofs across multiple blockchain environments.

**Deliverables:**
- [x] Circuits: `range_proof`, `solvency_check`, `compliance_verify`, and `kyc_transfer`
- [x] Working proof generation and verification scripts (snarkjs CLI)
- [x] **Ethereum verifier** (Solidity smart contract) ✅
- [x] **Stellar Soroban verifier** (Rust no_std) ✅
- [x] Demonstration of end-to-end proof verification for KYC attributes (age, solvency, compliance)
- [x] Web landing page (openzktool.vercel.app)

**Multi-Chain Status:**
- ✅ **Ethereum/EVM** - Fully implemented and tested
- ✅ **Stellar Soroban** - Fully implemented and tested
- ⏳ **Other EVM chains** (Polygon, BSC, etc.) - Pending (same verifier can be deployed)
- ⏳ **Other chains** - Future roadmap items

**Outcome:** A reproducible proof lifecycle showing full ZKP generation → proof → on-chain verification on Ethereum and Stellar Soroban. Forms the technical foundation for the next 3 phases.

---

### Phase 1 – MVP (🚧 Upcoming)

**Goal:** Build the minimum viable product to make ZKP privacy verification accessible for developers through a clean SDK and modular architecture.

**Deliverables (Milestones):**

1. **ZKP Core SDK (TypeScript/JS)**
   - [ ] Interfaces for proof generation, verification, and circuit management
   - [ ] WASM/browser support
   - [ ] Sample applications and demos

2. **Unified API Layer**
   - [ ] REST/GraphQL endpoints to interact with proofs from external systems
   - [ ] Authentication and rate limiting
   - [ ] Documentation and OpenAPI spec

3. **Integration Examples**
   - [ ] Stellar integration examples
   - [ ] EVM integration (Polygon Amoy/Sepolia)
   - [ ] Developer tutorials and quickstart guides

**Verification:** Functional SDK and API tested locally; verified proofs across dev networks.

---

### Phase 2 – Testnet (🧭 Planned)

**Goal:** Deploy the MVP to Stellar and EVM testnets, enabling interoperability and real network testing.

**Deliverables (Milestones):**

1. **Contract Deployment**
   - [ ] Deploy verification contracts on Stellar Soroban testnet
   - [ ] Deploy on EVM testnets (Polygon Amoy, Sepolia)
   - [ ] Gas optimization and monitoring

2. **Hosted SDK/API Service**
   - [ ] Public API endpoint for testnet
   - [ ] Rate limiting and abuse prevention
   - [ ] Monitoring and analytics

3. **Documentation & Developer Tools**
   - [ ] Technical documentation portal
   - [ ] API reference documentation
   - [ ] Integration guides and tutorials
   - [ ] Sample dApps and reference implementations

**Verification:** End-to-end proof validation between Stellar and EVM testnets with reproducible results.

---

### Phase 3 – Mainnet (🌐 Future)

**Goal:** Launch production-ready privacy and identity infrastructure on Stellar and EVM mainnets, supported by a no-code interface and developer tooling.

**Deliverables (Milestones):**

1. **Playground UI**
   - [ ] Visual interface to create and simulate ZKP circuits (no-code)
   - [ ] Circuit testing and debugging tools
   - [ ] Proof visualization and validation

2. **Open-Source SDK Release**
   - [ ] Publish `@stellar-privacy/sdk` to npm
   - [ ] Complete API documentation
   - [ ] Video tutorials and demos
   - [ ] Community support channels

3. **Mainnet Deployment**
   - [ ] Deploy verification contracts on Stellar and EVM mainnets
   - [ ] Production infrastructure (RPC, indexers)
   - [ ] Security audit and penetration testing
   - [ ] Public documentation portal

**Verification:** Public SDK, functional Playground, and verified proofs on mainnets.

---

### Roadmap Summary Table

| Phase | Network Scope | Focus | Key Deliverables | Verification |
|-------|--------------|-------|------------------|-------------|
| **0 – PoC** | Local / Dev | Circuits & CLI | Functional ZKP proof system | ✅ Reproducible repo |
| **1 – MVP** | Dev / Local | SDK + API design | TS/JS SDK + API endpoints | Unit testing |
| **2 – Testnet** | Stellar + EVM Testnets | Interoperability | Public contracts + hosted SDK | Cross-chain validation |
| **3 – Mainnet** | Stellar + EVM Mainnets | Production & UI | Playground + SDK release | Public proof verification |

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
- Deep Stellar/Soroban familiarity (6+ months)
- 6+ years blockchain development experience
- Academic partnerships (UTN - Universidad Tecnológica Nacional)

**Location:** Argentina (remote-friendly, global focus, LATAM expertise)

---

## 🎯 Impact & Vision

**Unlocking Privacy for All Blockchains:**
- Enable institutional adoption across multiple chains for private transactions
- Support cross-border B2B payments with high transaction volumes
- Compete with traditional finance by adding privacy + auditability
- Bridge Web2 financial institutions to Web3 across Stellar, Ethereum, and beyond

**Network Effects:**
- Developers build privacy-preserving dApps on any supported chain
- Institutions bring liquidity and transaction volume across ecosystems
- Multi-chain privacy infrastructure grows the entire Web3 space
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

- **🌐 OpenZKTool Website:** https://openzktool.vercel.app
- **Repository:** https://github.com/xcapit/stellar-privacy-poc
- **Xcapit Labs:** https://xcapit.com
- **Circom Docs:** https://docs.circom.io
- **ZK Learning Resources:** https://zkp.science

---

**⭐ If you find this project useful, please star the repository!**

**Ready to prove without revealing?**

🌐 **Visit:** [openzktool.vercel.app](https://openzktool.vercel.app)

🚀 **Try the demo:** `bash scripts/demo/demo_multichain.sh`
