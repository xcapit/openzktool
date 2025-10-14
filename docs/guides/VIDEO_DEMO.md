# 🎥 Video Demo Instructions

## Quick Start for Video Recording

### Option 1: Auto-play Demo (No Pauses)
Perfect for screen recording:

```bash
cd circuits/scripts
bash demo_auto.sh
```

This runs the complete demo automatically with:
- ✅ Beautiful ASCII art header
- ✅ Step-by-step explanations in English
- ✅ Evidence of execution (file listings, proof contents)
- ✅ Both EVM and Soroban verifier export
- ✅ Automatic pauses (no ENTER required)

### Option 2: Interactive Demo (Manual Pauses)
Great for live presentations:

```bash
cd circuits/scripts
bash demo.sh
```

Press ENTER at each step to control the pace.

---

## What the Demo Shows

### 🎨 Visual Elements

1. **ASCII Art Banner**
   ```
   ███████╗██╗  ██╗    ██████╗ ██████╗  ██████╗  ██████╗ ███████╗
   ```

2. **Step-by-Step Breakdown**
   - Step 1: Circuit Compilation
   - Step 2: Trusted Setup (Groth16)
   - Step 3: Witness Input Creation
   - Step 4: Witness Generation
   - Step 5: Zero-Knowledge Proof Generation
   - Step 6: Proof Verification
   - Step 7: EVM Verifier Export
   - Step 8: Soroban Verifier Export

3. **Evidence Shown**
   - File sizes and timestamps
   - Circuit statistics (586 constraints, 590 wires)
   - Proof structure (pi_a, pi_b, pi_c)
   - Public output (kycValid = 1)
   - Contract code previews

---

## 📋 Script Features

### English Explanations

Each step includes:
- **"What we're doing"** - High-level overview
- **"Why this matters"** - Context and importance
- **"Technical details"** - How it works
- **"The magic"** - Key insights

### Evidence of Execution

- ✅ Real-time file creation
- ✅ File sizes displayed
- ✅ Proof contents shown (with jq formatting)
- ✅ Contract code previews
- ✅ Verification success confirmation

### Multi-Chain Support

- 🔷 **EVM**: Solidity verifier for Ethereum, Polygon, BSC, etc.
- ⭐ **Soroban**: Rust verifier for Stellar Network

---

## 🎬 Recording Tips

### Camera Angles

1. **Full Terminal** - Show the complete ASCII art
2. **Code Preview** - Zoom in on proof.json and contract code
3. **File Listings** - Show artifact sizes

### Narration Points

#### Introduction (0:00-0:30)
*"Today we're demonstrating a zero-knowledge proof for KYC compliance. We'll prove a user meets age, balance, and country requirements WITHOUT revealing their exact data."*

#### Step 1-2: Setup (0:30-1:30)
*"First, we compile the Circom circuit into constraints, then run the trusted setup. In production, this would be a multi-party ceremony."*

#### Step 3-4: Witness (1:30-2:30)
*"We create sample data: age 25, balance $150, country Argentina. The witness calculator computes all internal signals."*

#### Step 5-6: Proof & Verify (2:30-4:00)
*"Now the magic happens. We generate an 800-byte proof that confirms all requirements are met. The verifier checks this cryptographically - and it passes! Notice what the verifier DOESN'T see: the exact age, exact balance, or exact country."*

#### Step 7-8: Blockchain (4:00-5:00)
*"Finally, we export verifiers for both Ethereum and Stellar. These smart contracts can verify proofs on-chain."*

#### Conclusion (5:00-5:30)
*"That's zero-knowledge proofs in action: privacy-preserving, trustless, and ready for production on multiple blockchains."*

---

## 📊 Demo Highlights to Capture

### Key Moments

1. **ASCII Art Header** - Sets professional tone
2. **Circuit Stats** - "586 constraints, 590 wires"
3. **Private Data Box** - Shows what's hidden
4. **Proof Generation** - The "magic" moment
5. **Verification Success** - "✅ VERIFICATION SUCCESSFUL!"
6. **Proof Size** - "Only ~800 bytes!"
7. **Multi-Chain Export** - EVM + Soroban
8. **Final Summary** - Stats and next steps

---

## 🎯 What Gets Proven

The demo proves:
- ✅ User is 25 years old (NOT revealed)
- ✅ User has $150 balance (NOT revealed)
- ✅ User is from Argentina (NOT revealed)
- ✅ **Public output: kycValid = 1**

The verifier only knows:
- Age is between 18-99
- Balance is ≥ $50
- Country is allowed

---

## 🛠️ Troubleshooting

### If jq is not installed:
```bash
brew install jq  # macOS
# or
sudo apt install jq  # Linux
```

### If the script fails:
```bash
# Ensure Powers of Tau exist:
bash circuits/scripts/prepare_and_setup.sh

# Then re-run demo:
bash circuits/scripts/demo_auto.sh
```

---

## 📁 Output Files Showcased

The demo lists all generated files:

**Circuit Files:**
- kyc_transfer.r1cs (93K)
- kyc_transfer.wasm (43K)

**Keys:**
- kyc_transfer_final.zkey (324K)
- kyc_transfer_vkey.json (2.9K)

**Proof:**
- proof.json (806 bytes) ← **STAR OF THE SHOW**
- public.json (8 bytes)

**Verifiers:**
- evm/Verifier.sol (6.9K)
- soroban/src/lib.rs (if exists)

---

## 🎥 Video Length

**Recommended duration:** 5-7 minutes

- Auto-play version: ~3-4 minutes raw footage
- Add narration: +2-3 minutes
- Include intro/outro: Total 5-7 minutes

---

## 🚀 Ready to Record?

```bash
# Make sure you're in the right directory
cd /Users/fboiero/Documents/STELLAR/stellar-privacy-poc

# Run the auto-play demo
bash circuits/scripts/demo_auto.sh
```

**Pro tip:** Record in a terminal with a nice color scheme. The script uses colors for better visual impact!

---

## 📚 Additional Resources

After the demo, point viewers to:
- [DEMO.md](./DEMO.md) - Detailed step-by-step guide
- [QUICKSTART.md](./QUICKSTART.md) - Quick reference
- [README.md](./README.md) - Project overview
- [Repository](https://github.com/xcapit/stellar-privacy-poc)

---

**Happy recording! 🎬**
