# 📜 Scripts Overview — ZKPrivacy

**Quick reference guide for all demo and test scripts**

---

## 🎯 Choose Your Script

### For Non-Technical Audiences 💡

**Use:** `demo_privacy_proof.sh`

```bash
npm run demo:privacy
```

- 👥 **Best for:** CEOs, investors, business stakeholders, regulators
- 🕐 **Duration:** 5-7 minutes
- 📖 **Style:** Story-driven, no jargon, clear value proposition
- 🎬 **What it shows:** Alice proves eligibility without revealing data (age, balance, country)
- ⛓️ **Multi-chain:** Verifies same proof on Ethereum AND Stellar

**The Story:**
1. The Problem: Traditional KYC exposes all data
2. The Solution: ZK proofs prove without revealing
3. Generate proof for Alice (800 bytes)
4. Verify on Ethereum blockchain
5. Verify on Stellar blockchain (same proof!)
6. Result: Privacy + Compliance ✨

---

### For Technical Audiences ⭐

**Use:** `demo_multichain.sh`

```bash
npm run demo
```

- 👥 **Best for:** Developers, grant reviewers, technical investors, engineers
- 🕐 **Duration:** 5-7 minutes
- 📖 **Style:** Technical, shows architecture and implementation
- 🎬 **What it shows:** Groth16 proof generation and multi-chain verification
- ⛓️ **Multi-chain:** EVM (Solidity) and Soroban (Rust/WASM)

**Flow:**
1. Generate ZK-SNARK proof (Circom + Groth16)
2. Deploy & verify on Ethereum (Foundry/Anvil)
3. Deploy & verify on Stellar (Soroban)
4. Show interoperability metrics

---

### For Quick Testing 🚀

**Use:** `test_full_flow_auto.sh`

```bash
npm test
```

- 👥 **Best for:** Developers, CI/CD, pre-demo validation
- 🕐 **Duration:** 3-5 minutes
- 📖 **Style:** Automated, no pauses, concise output
- 🎬 **What it tests:** Everything (setup → proof → EVM → Soroban)
- ✅ **Exit code:** 0 if all pass, 1 if any fail

**Tests:**
- ✅ Circuit compilation
- ✅ Trusted setup
- ✅ Proof generation
- ✅ Local verification
- ✅ EVM verification
- ✅ Soroban verification

---

## 📊 Complete Script Comparison

| Script | Duration | Audience | Technical Level | Interactive | Best For |
|--------|----------|----------|-----------------|-------------|----------|
| **demo_privacy_proof.sh** | 5-7 min | Business/Investors | ⭐☆☆☆☆ | Yes | Non-technical demos |
| **demo_multichain.sh** | 5-7 min | Technical/Grant | ⭐⭐⭐⭐☆ | Yes | SCF presentations |
| **test_full_flow_auto.sh** | 3-5 min | Developers | ⭐⭐⭐☆☆ | No | Quick validation |
| **test_full_flow.sh** | 3-5 min | Developers | ⭐⭐⭐☆☆ | Yes | Learning/debugging |
| **full_demo.sh** | 8-10 min | Educational | ⭐⭐⭐⭐⭐ | Yes | Workshops/training |
| **prove_and_verify.sh** | 30 sec | Developers | ⭐⭐⭐☆☆ | No | Quick proof test |
| **demo.sh** | 5-6 min | General | ⭐⭐⭐☆☆ | Yes | Basic demos |
| **demo_auto.sh** | 3-4 min | Video creation | ⭐⭐⭐☆☆ | No | Recording |

---

## 🚀 NPM Scripts (Recommended)

```bash
# Demos
npm run demo:privacy      # Non-technical narrative (Alice's story)
npm run demo              # Technical multi-chain demo

# Testing
npm test                  # Quick automated test
npm run test:interactive  # Test with pauses

# Individual operations
npm run setup             # Compile circuit & generate keys
npm run prove             # Generate proof & verify locally
npm run demo:evm          # Verify on Ethereum only
npm run demo:soroban      # Verify on Soroban only
```

---

## 🎬 Presentation Decision Tree

```
Are your stakeholders technical?
│
├─ NO → Use demo_privacy_proof.sh
│        └─ Focus: Business value, privacy, compliance
│
└─ YES → Are they blockchain developers?
         │
         ├─ YES → Use demo_multichain.sh
         │        └─ Focus: Architecture, interoperability, ZK-SNARKs
         │
         └─ NO → Use demo_privacy_proof.sh FIRST
                  Then offer demo_multichain.sh for deep dive
```

---

## 📋 Pre-Presentation Checklist

Before any demo, run:

```bash
npm test
```

This validates that everything works in 3-5 minutes:
- ✅ Circuit compiles
- ✅ Keys are generated
- ✅ Proof generation works
- ✅ EVM verification works
- ✅ Soroban verification works

If `npm test` passes, you're ready to demo! 🎉

---

## 🎯 Common Scenarios

### Scenario 1: Board Meeting / C-Level

**Goal:** Get buy-in for privacy SDK adoption

```bash
npm run demo:privacy
```

**Key points to emphasize:**
- Privacy WITHOUT losing compliance
- Works on multiple blockchains
- 800 bytes, <1 second proof generation
- Real business value (customers keep data private)

---

### Scenario 2: SCF Grant Review

**Goal:** Show technical merit and multi-chain capability

```bash
npm run demo
```

**Key points to emphasize:**
- True multi-chain interoperability (EVM + Soroban)
- Production-ready implementation
- Small proof size, fast verification
- Groth16 SNARKs (industry standard)

---

### Scenario 3: Developer Workshop

**Goal:** Teach ZK proofs and integration

```bash
cd circuits/scripts
bash full_demo.sh
```

**Key points to emphasize:**
- How ZK proofs work (theory)
- Circuit compilation process
- Trusted setup ceremony
- Deployment to different chains
- SDK integration

---

### Scenario 4: Quick Demo (5 min meeting)

**Goal:** Spark interest, schedule longer demo

```bash
npm run demo:privacy
```

**Skip to key parts:**
- Problem statement (30 sec)
- Generate proof (1 min)
- Verify on blockchain (2 min)
- Business value summary (1 min)

---

### Scenario 5: Video for Social Media

**Goal:** Create shareable demo video

```bash
DEMO_AUTO=1 bash demo_privacy_proof.sh
```

**Record with:**
- OBS Studio (screen + audio)
- Clean terminal (large font)
- Add subtitles with key points
- 3-4 minute edit

---

## 🛠️ Troubleshooting

### All demos fail at setup

```bash
cd circuits/scripts
bash prepare_and_setup.sh
```

### Only EVM fails

```bash
# Check Foundry installation
which forge anvil cast

# Reinstall if needed
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

### Only Soroban fails

```bash
# Check Stellar CLI
which stellar

# Reinstall if needed
cargo install --locked stellar-cli --features opt
```

### Network issues (Anvil/Stellar already running)

```bash
# Kill existing processes
pkill anvil
pkill stellar

# Or use different ports (edit scripts)
```

---

## 📚 Additional Resources

- **DEMO_GUIDE.md** - Detailed guide for each scenario
- **README.md** - Full project documentation
- **Web:** https://zkprivacy.vercel.app
- **GitHub:** https://github.com/xcapit/stellar-privacy-poc

---

## ⚡ Quick Commands Reference

```bash
# Most common workflows

# First time setup
npm install
npm run setup

# Quick validation
npm test

# Non-technical demo
npm run demo:privacy

# Technical demo
npm run demo

# Just generate a proof
npm run prove
```

---

*Created by Team X1 - Xcapit Labs*
*Stellar Privacy SDK — Zero-Knowledge Proof Toolkit for TradFi*
