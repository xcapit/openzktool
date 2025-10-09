# 🎬 Demo Scripts Guide

**Complete reference for all demonstration and testing scripts**

---

## 📊 Quick Reference

| Script | Command | Duration | Audience | Purpose |
|--------|---------|----------|----------|---------|
| **Privacy Demo** 💡 | `npm run demo:privacy` | 5-7 min | Non-technical | Story-driven narrative |
| **Multi-Chain Demo** ⭐ | `npm run demo` | 5-7 min | Technical | Interoperability focus |
| **Auto Test** 🚀 | `npm test` | 3-5 min | Developers | Quick validation |
| **Interactive Test** | `npm run test:interactive` | 3-5 min | Learning | Step-by-step |
| **Setup Only** | `npm run setup` | 30-60 sec | Setup | One-time initialization |
| **Prove Only** | `npm run prove` | <5 sec | Development | Quick proof test |
| **EVM Only** | `npm run demo:evm` | 10 sec | EVM testing | Ethereum verification |
| **Soroban Only** | `npm run demo:soroban` | 15 sec | Soroban testing | Stellar verification |

---

## 💡 Demo: Privacy Proof (Non-Technical)

### Overview

**Best for:** CEOs, investors, business stakeholders, regulators

**The Story:** Alice needs to prove she's eligible for a financial service without revealing her personal data.

### How to Run

```bash
# Interactive mode (recommended for live demos)
npm run demo:privacy

# Auto mode (for recording videos)
DEMO_AUTO=1 bash demo_privacy_proof.sh
```

### What It Shows

**The Problem (1 min)**
- Traditional KYC requires sharing ALL data
- Privacy vs. Compliance dilemma

**The Solution (1 min)**
- Zero-Knowledge Proofs explained simply
- Prove without revealing

**Alice's Story (3 min)**
- Alice has: Age 25, Balance $150, Country AR (private)
- Alice proves: Age ≥ 18, Balance ≥ $50, Country allowed
- Generates 800-byte proof

**Multi-Chain Verification (2 min)**
- Verifies on Ethereum ✅
- Verifies on Stellar ✅ (same proof!)
- Privacy + Compliance achieved

### Key Messages

- 🔒 **Privacy**: No data revealed
- ✅ **Compliance**: Requirements proven
- ⚡ **Fast**: <1 second proof generation
- 🌐 **Interoperable**: One proof, multiple blockchains

### Use Cases

- Board meetings
- Investor pitches
- Business development meetings
- Regulatory discussions
- User education

---

## ⭐ Demo: Multi-Chain (Technical)

### Overview

**Best for:** Developers, grant reviewers, technical investors, engineers

**Focus:** Multi-chain ZK proof verification architecture

### How to Run

```bash
# Interactive mode
npm run demo

# Auto mode (for recording)
DEMO_AUTO=1 bash demo_multichain.sh
```

### What It Shows

**Step 1: Proof Generation (1 min)**
- Circom circuit compilation
- Groth16 SNARK generation
- Witness calculation
- Local verification with snarkjs

**Step 2: EVM Verification (2 min)**
- Start Anvil (local Ethereum)
- Deploy Solidity verifier contract
- Submit proof to contract
- Elliptic curve pairing check
- Gas usage: ~200k gas

**Step 3: Soroban Verification (2 min)**
- Start local Stellar network
- Deploy Rust/WASM verifier
- Submit SAME proof
- Structure validation
- Low resource consumption

**Summary (1 min)**
- Performance metrics
- Multi-chain benefits
- Architecture highlights

### Technical Details Shown

- Circuit constraints: 586
- Proof size: ~800 bytes
- BN254 curve operations
- Groth16 protocol
- Contract addresses
- Deployment transactions

### Use Cases

- SCF grant presentations
- Technical workshops
- Developer onboarding
- Architecture reviews
- Academic presentations

---

## 🚀 Test: Automated Full Flow

### Overview

**Best for:** CI/CD, quick validation, pre-demo checks

**Purpose:** Validate entire system in 3-5 minutes automatically

### How to Run

```bash
npm test
```

### What It Tests

```
[1/4] Setup
  - Circuit compilation
  - Trusted setup
  - Key generation

[2/4] Proof Generation
  - Witness calculation
  - Proof creation
  - Local verification

[3/4] EVM Verification
  - Anvil startup
  - Contract deployment
  - On-chain verification

[4/4] Soroban Verification
  - Network startup
  - Contract deployment
  - On-chain verification
```

### Expected Output

```
✅ FULL FLOW TEST: PASSED

All tests completed successfully:
  ✅ Circuit compilation & setup
  ✅ Proof generation & local verification
  ✅ EVM verification (Ethereum/Anvil)
  ✅ Soroban verification (Stellar)

🌐 Multi-chain interoperability confirmed!
```

### Use Cases

- Pre-presentation validation
- CI/CD pipelines
- After code changes
- Environment validation
- Quick smoke test

---

## 🎓 Test: Interactive Full Flow

### Overview

**Best for:** Learning, debugging, showing process

**Purpose:** Step-by-step walkthrough with pauses

### How to Run

```bash
npm run test:interactive
```

### What It Does

Same as automated test but:
- Pauses between each step
- Shows detailed explanations
- Waits for ENTER to continue
- Educational commentary

### Use Cases

- First-time users
- Understanding the flow
- Debugging issues
- Teaching others
- Detailed demonstrations

---

## 🔧 Individual Component Tests

### Setup Only

```bash
npm run setup
```

**What it does:**
- Compiles Circom circuit
- Generates R1CS and WASM
- Runs Powers of Tau ceremony
- Creates proving/verification keys

**When to use:**
- First time setup
- After circuit changes
- Clean environment setup

**Duration:** 30-60 seconds

---

### Proof Generation Only

```bash
npm run prove
```

**What it does:**
- Calculates witness
- Generates Groth16 proof
- Verifies locally with snarkjs
- Exports Solidity verifier

**When to use:**
- Testing proof generation
- After input changes
- Quick proof validation

**Duration:** <5 seconds

---

### EVM Verification Only

```bash
npm run demo:evm
```

**What it does:**
- Starts Anvil
- Deploys Solidity verifier
- Verifies proof on-chain
- Shows gas usage

**When to use:**
- Testing EVM integration
- Gas optimization
- Contract debugging

**Duration:** ~10 seconds

---

### Soroban Verification Only

```bash
npm run demo:soroban
```

**What it does:**
- Builds Rust contract
- Starts Stellar network
- Deploys WASM verifier
- Verifies proof

**When to use:**
- Testing Soroban integration
- Contract debugging
- Stellar-specific testing

**Duration:** ~15 seconds

---

## 🎯 Choosing the Right Script

### Decision Tree

```
What's your goal?

├─ Quick validation?
│  └─ npm test (3-5 min)
│
├─ Business presentation?
│  └─ npm run demo:privacy (5-7 min)
│
├─ Technical presentation?
│  └─ npm run demo (5-7 min)
│
├─ Learning the system?
│  └─ npm run test:interactive (3-5 min)
│
├─ Testing specific component?
│  ├─ npm run prove (proof only)
│  ├─ npm run demo:evm (EVM only)
│  └─ npm run demo:soroban (Soroban only)
│
└─ First time setup?
   └─ npm run setup (30-60 sec)
```

---

## 📋 Common Scenarios

### Scenario 1: Before SCF Grant Presentation

**Goal:** Ensure everything works + prepare for demo

```bash
# 1. Quick validation (3 min)
npm test

# 2. If all pass, practice the demo
npm run demo

# 3. Have backup ready
npm run demo:privacy  # For non-technical Q&A
```

---

### Scenario 2: Investor Meeting (Non-Technical)

**Goal:** Show business value without technical details

```bash
npm run demo:privacy
```

**Focus on:**
- Privacy problem (data exposure)
- ZK solution (prove without revealing)
- Multi-chain benefit (one proof, many chains)
- Business impact (banks, fintechs can adopt blockchain)

---

### Scenario 3: Developer Workshop

**Goal:** Teach how to integrate OpenZKTool

```bash
# 1. Show full flow interactively
npm run test:interactive

# 2. Then show technical demo
npm run demo

# 3. Show individual components
npm run prove
npm run demo:evm
npm run demo:soroban
```

---

### Scenario 4: CI/CD Pipeline

**Goal:** Automated testing on every commit

```bash
npm test
```

**GitHub Actions:**
```yaml
- name: Run tests
  run: npm test
```

Exit code: 0 = pass, 1 = fail

---

### Scenario 5: Video Recording

**Goal:** Create demo video for social media

```bash
# Auto mode (no pauses)
DEMO_AUTO=1 bash demo_privacy_proof.sh

# Or technical version
DEMO_AUTO=1 bash demo_multichain.sh
```

**Tips:**
- Use clean terminal
- Large font (18-20pt)
- Record with OBS Studio
- Add subtitles with key points

---

## 🎥 Recording Tips

### Terminal Setup

```bash
# Clean terminal
clear

# Set large font (for recording)
# iTerm2: ⌘ + to increase font size

# Hide timestamp in prompt (optional)
export PS1="\$ "

# Maximize window
# Full screen or specific resolution
```

### Recording Tools

**macOS:**
- QuickTime Screen Recording
- OBS Studio
- ScreenFlow

**Linux:**
- OBS Studio
- SimpleScreenRecorder
- asciinema (terminal only)

**Windows:**
- OBS Studio
- Windows Game Bar

### Best Practices

1. **Test first**: Run demo once before recording
2. **Clean state**: Remove old logs, clean artifacts
3. **Audio**: Record narration separately, sync later
4. **Lighting**: Good lighting if showing face
5. **Editing**: Cut long pauses, add subtitles

---

## 🐛 Troubleshooting Scripts

### Script Fails at Setup

```bash
# Check dependencies
which circom
which snarkjs
which forge
which stellar

# Reinstall if needed
npm install -g snarkjs
cargo install circom stellar-cli
curl -L https://foundry.paradigm.xyz | bash
```

### Script Fails at Proof Generation

```bash
# Check circuit files
ls circuits/artifacts/kyc_transfer.r1cs
ls circuits/artifacts/kyc_transfer_final.zkey

# Regenerate if missing
npm run setup
```

### Script Fails at EVM Verification

```bash
# Check Anvil
anvil --version

# Check port not in use
lsof -i :8545
pkill anvil

# Retry
npm run demo:evm
```

### Script Fails at Soroban Verification

```bash
# Check Stellar CLI
stellar --version

# Stop existing network
stellar network stop local

# Retry
npm run demo:soroban
```

### Script Hangs/Freezes

```bash
# Kill background processes
pkill anvil
pkill stellar

# Kill specific PID
ps aux | grep anvil
kill <PID>

# Clean and retry
npm test
```

---

## 📚 Script Source Files

All scripts are in the repository root:

```
stellar-privacy-poc/
├── demo_privacy_proof.sh      # Non-technical demo
├── demo_multichain.sh          # Technical demo
├── test_full_flow.sh           # Interactive test
├── test_full_flow_auto.sh      # Automated test
└── circuits/scripts/
    ├── prepare_and_setup.sh    # Setup script
    └── prove_and_verify.sh     # Proof script
```

**Directly callable:**
```bash
bash demo_privacy_proof.sh
bash demo_multichain.sh
bash test_full_flow_auto.sh
```

**Via npm scripts (recommended):**
```bash
npm run demo:privacy
npm run demo
npm test
```

---

## ✅ Pre-Demo Checklist

Before running any demo:

- [ ] Dependencies installed (`npm install`)
- [ ] Setup completed (`npm run setup`)
- [ ] Test passes (`npm test`)
- [ ] Clean terminal (no clutter)
- [ ] Good internet (for downloads)
- [ ] No conflicting processes (kill anvil/stellar)
- [ ] Backup plan (have 2-3 scripts ready)
- [ ] Time buffer (demos may take 20% longer)

---

*For more details, see [Testing Guide](./README.md)*
