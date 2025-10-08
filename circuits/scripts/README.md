# 🎬 Demo Scripts

This directory contains automated scripts for demonstrating the KYC Transfer zero-knowledge proof circuit.

## 🚀 Quick Start

### For Video Recording (Recommended)
```bash
bash demo_auto.sh
```

**Features:**
- ✅ Automatic execution (no manual pauses)
- ✅ Beautiful ASCII art
- ✅ Step-by-step English explanations
- ✅ Evidence of execution shown
- ✅ EVM + Soroban verifier export
- ⏱️ Duration: ~3-4 minutes

### For Live Presentations
```bash
bash demo.sh
```

**Features:**
- Same as auto version but with manual pauses
- Press ENTER to advance to next step
- Perfect for controlled demonstrations

---

## 📋 What the Demo Does

### Step 1: Circuit Compilation
- Compiles `kyc_transfer.circom`
- Generates R1CS, WASM, and symbol files
- Shows circuit statistics (586 constraints, 590 wires)

### Step 2: Trusted Setup
- Uses Powers of Tau (Phase 1)
- Runs Groth16 setup (Phase 2)
- Exports verification key

### Step 3: Input Creation
- Creates sample KYC data
- Shows private vs public parameters
- Highlights what data is hidden

### Step 4: Witness Generation
- Computes circuit signals
- Generates cryptographic witness
- Shows file creation

### Step 5: Proof Generation
- Creates zero-knowledge proof (~800 bytes)
- Shows proof structure (Groth16)
- Displays public output (kycValid = 1)

### Step 6: Proof Verification
- Verifies proof cryptographically
- Confirms compliance without revealing data
- Highlights the "ZK magic"

### Step 7: EVM Verifier Export
- Exports Solidity smart contract
- Shows contract preview
- Lists deployment targets

### Step 8: Soroban Verifier
- Checks for Soroban verifier
- Shows Rust contract (if available)
- Lists Stellar deployment options

---

## 🎯 Demo Output

### Visual Elements

```
╔════════════════════════════════════════════════════════════════════╗
║     ███████╗██╗  ██╗    ██████╗ ██████╗  ██████╗  ██████╗ ███████╗║
║           KYC Transfer - Zero-Knowledge Proof Demo                ║
║                   EVM + Soroban Verifiers                         ║
╚════════════════════════════════════════════════════════════════════╝
```

### Key Information Displayed

- **Circuit Stats**: Constraints, wires, inputs, outputs
- **File Listings**: All generated artifacts with sizes
- **Proof Contents**: Structure and public signals
- **Verification Result**: Success/failure
- **Contract Previews**: EVM and Soroban code snippets

---

## 📁 Other Scripts

### `prepare_and_setup.sh`
Runs the full trusted setup process:
- Generates Powers of Tau
- Runs Groth16 setup
- Exports verification key

**Use when:** Setting up the circuit for the first time

### `prove_and_verify.sh`
Generates and verifies a proof:
- Creates input.json
- Generates witness
- Creates proof
- Verifies proof
- Exports Solidity verifier

**Use when:** You want to quickly test proof generation

### `compile.sh`
Just compiles the circuit:
- Runs circom compiler
- Shows circuit info

**Use when:** Making changes to circuit code

---

## 🎥 For Video Production

See [VIDEO_DEMO.md](../../VIDEO_DEMO.md) for:
- Recording tips
- Narration suggestions
- Key moments to capture
- Troubleshooting

---

## 🛠️ Prerequisites

```bash
# Install dependencies
npm install

# Verify tools
node --version   # >= v16
circom --version # >= 2.1.9
jq --version     # For JSON formatting
```

---

## 📊 Demo Stats

| Metric | Value |
|--------|-------|
| Circuit Constraints | 586 |
| Circuit Wires | 590 |
| Private Inputs | 6 |
| Public Outputs | 1 |
| Proof Size | ~800 bytes |
| Verification Time | ~10-50ms |
| EVM Gas Cost | ~250k-300k gas |

---

## 🔗 Related Documentation

- [DEMO.md](../../DEMO.md) - Detailed step-by-step guide
- [QUICKSTART.md](../../QUICKSTART.md) - Quick reference
- [VIDEO_DEMO.md](../../VIDEO_DEMO.md) - Video recording guide
- [README.md](../../README.md) - Project overview

---

## 💡 Tips

### For Best Results

1. **Terminal Setup**: Use a terminal with a nice color scheme
2. **Font Size**: Increase font size for better visibility
3. **Window Size**: Full screen or large window
4. **Recording**: Use tools like Asciinema or screen capture

### Common Issues

**"Powers of Tau not found"**
```bash
bash prepare_and_setup.sh
```

**"jq not found"**
```bash
brew install jq  # macOS
```

**"Circuit not compiled"**
```bash
# The demo will compile it automatically
# Or run manually:
circom kyc_transfer.circom --r1cs --wasm --sym -o artifacts/ -l node_modules
```

---

## 🎬 Ready to Demo?

```bash
# One command to rule them all:
bash demo_auto.sh
```

**Enjoy the show! 🚀**
