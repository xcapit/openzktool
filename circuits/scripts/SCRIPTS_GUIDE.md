# 📜 Scripts Guide - Zero-Knowledge Proof Demo

Quick reference for all available demo scripts.

---

## 🎯 Choose Your Script

| Script | Best For | Duration | Interactive |
|--------|----------|----------|-------------|
| `full_demo.sh` | **🏆 Complete education** | ~8-10 min | Auto-pause |
| `demo_auto.sh` | Quick video recording | ~3-4 min | No pauses |
| `demo.sh` | Live presentations | ~5-6 min | Manual pauses |
| `prepare_and_setup.sh` | Initial setup only | ~1-2 min | No |
| `prove_and_verify.sh` | Quick proof test | ~30 sec | No |

---

## 📚 Script Descriptions

### 1. `full_demo.sh` ⭐ RECOMMENDED

**The complete educational experience**

```bash
bash full_demo.sh
```

**Includes:**
- ✅ Zero-Knowledge theory (Ali Baba's Cave, 3 properties)
- ✅ SNARKs vs STARKs comparison
- ✅ Groth16 workflow explanation
- ✅ Full circuit demo (6 steps)
- ✅ 6 real-world use cases
- ✅ Why ZK matters (benefits)
- ✅ Multi-chain deployment (EVM + Soroban)
- ✅ Beautiful ASCII art throughout

**Perfect for:**
- 🎓 Learning ZK from scratch
- 🎬 Creating educational videos
- 🎤 Conference presentations
- 📊 Stakeholder demos
- 👥 Teaching others

**Customization:**
```bash
# Manual pauses (for live presentations)
DEMO_PAUSE=manual bash full_demo.sh

# Adjust auto-pause duration (edit script)
PAUSE_TIME=3  # Default is 2 seconds
```

---

### 2. `demo_auto.sh`

**Quick auto-play for video recording**

```bash
bash demo_auto.sh
```

**Includes:**
- ✅ All 6 practical steps
- ✅ Circuit compilation → Verification
- ✅ EVM + Soroban export
- ✅ Auto-pauses (2 seconds)
- ❌ No theory sections

**Perfect for:**
- 🎥 Screen recording
- ⏱️ Time-constrained demos
- 🚀 Quick walkthroughs

---

### 3. `demo.sh`

**Interactive demo with manual control**

```bash
bash demo.sh
```

**Includes:**
- ✅ All 6 practical steps
- ✅ Beautiful ASCII art
- ✅ Step-by-step explanations
- ✅ Press ENTER to advance
- ❌ No theory sections

**Perfect for:**
- 🎤 Live presentations
- 👥 Workshop sessions
- 🎓 Classroom teaching
- 🤝 Client demos

---

### 4. `prepare_and_setup.sh`

**One-time trusted setup**

```bash
bash prepare_and_setup.sh
```

**What it does:**
1. Generates Powers of Tau (if needed)
2. Runs Groth16 setup
3. Exports verification key

**When to use:**
- 🆕 First time setup
- 🔄 After circuit changes
- 🔧 Regenerating keys

**Output:**
- `pot12_final_phase2.ptau` (4.5MB)
- `kyc_transfer_final.zkey` (324KB)
- `kyc_transfer_vkey.json` (2.9KB)

---

### 5. `prove_and_verify.sh`

**Quick proof generation and verification**

```bash
bash prove_and_verify.sh
```

**What it does:**
1. Creates sample input
2. Generates witness
3. Creates proof
4. Verifies proof
5. Exports Solidity verifier

**When to use:**
- 🧪 Testing changes
- ⚡ Quick validation
- 🔍 Debugging

**Output:**
- `proof.json` (806B)
- `public.json` (8B)
- `evm/Verifier.sol` (6.9KB)

---

## 🎬 Recommended Workflow

### For First-Time Users:

```bash
# 1. Install dependencies
npm install

# 2. Run initial setup
cd circuits/scripts
bash prepare_and_setup.sh

# 3. Watch the complete demo
bash full_demo.sh
```

### For Video Recording:

```bash
# Use auto-play version
bash demo_auto.sh
```

### For Live Presentations:

```bash
# Use manual-pause version
bash demo.sh
```

### For Development/Testing:

```bash
# Quick proof generation
bash prove_and_verify.sh
```

---

## 🎨 Visual Comparison

### `full_demo.sh` Structure:

```
📚 Theory: What is ZK?
📚 Theory: How ZK Works (3 properties)
📚 Theory: SNARKs vs STARKs
📚 Theory: Groth16 Workflow
─────────────────────────
🛠️  Step 1: Compilation
🛠️  Step 2: Trusted Setup
🛠️  Step 3: Input Creation
🛠️  Step 4: Witness Generation
🛠️  Step 5: Proof Generation
🛠️  Step 6: Verification
─────────────────────────
💎 Benefits: 6 Use Cases
💎 Benefits: Why ZK Matters
─────────────────────────
⛓️  Export: EVM Verifier
⛓️  Export: Soroban Verifier
─────────────────────────
🎉 Final Summary
```

### `demo_auto.sh` / `demo.sh` Structure:

```
🛠️  Step 1: Compilation
🛠️  Step 2: Trusted Setup
🛠️  Step 3: Input Creation
🛠️  Step 4: Witness Generation
🛠️  Step 5: Proof Generation
🛠️  Step 6: Verification
⛓️  Export: EVM Verifier
⛓️  Export: Soroban Verifier
🎉 Final Summary
```

---

## 📊 Feature Matrix

| Feature | full_demo | demo_auto | demo.sh | prepare | prove |
|---------|-----------|-----------|---------|---------|-------|
| **Theory Sections** | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Ali Baba Cave** | ✅ | ❌ | ❌ | ❌ | ❌ |
| **SNARKs vs STARKs** | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Workflow Diagram** | ✅ | ❌ | ❌ | ❌ | ❌ |
| **6 Use Cases** | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Circuit Compilation** | ✅ | ✅ | ✅ | ❌ | ✅ |
| **Trusted Setup** | ✅ | ✅ | ✅ | ✅ | ❌ |
| **Proof Generation** | ✅ | ✅ | ✅ | ❌ | ✅ |
| **Verification** | ✅ | ✅ | ✅ | ❌ | ✅ |
| **EVM Export** | ✅ | ✅ | ✅ | ❌ | ✅ |
| **Soroban Export** | ✅ | ✅ | ✅ | ❌ | ❌ |
| **ASCII Art** | ✅✅✅ | ✅✅ | ✅✅ | ✅ | ✅ |
| **Auto-Pause** | ✅ | ✅ | ❌ | N/A | N/A |
| **Manual Pause** | Optional | ❌ | ✅ | N/A | N/A |

---

## 🎓 Learning Path

### Beginner Path:

1. **Watch:** `bash full_demo.sh`
   - Learn theory
   - Understand concepts
   - See complete workflow

2. **Practice:** `bash demo.sh`
   - Run yourself (manual pauses)
   - Read each section carefully
   - Ask questions

3. **Experiment:** `bash prove_and_verify.sh`
   - Modify `input.json`
   - Try different values
   - See what happens

### Advanced Path:

1. **Setup:** `bash prepare_and_setup.sh`
2. **Develop:** Modify circuits
3. **Test:** `bash prove_and_verify.sh`
4. **Present:** `bash full_demo.sh`

---

## 💡 Pro Tips

### Tip 1: Record the Full Demo

```bash
# Install asciinema (terminal recorder)
brew install asciinema

# Record
asciinema rec full_demo.cast

# Run demo
bash full_demo.sh

# Exit when done (Ctrl+D)

# Upload to asciinema.org or share .cast file
```

### Tip 2: Create Custom Inputs

```bash
# Edit artifacts/input.json
{
  "age": 30,        # Try different ages
  "minAge": 21,     # Change requirements
  "maxAge": 65,
  "balance": 1000,  # Try different balances
  "minBalance": 100,
  "countryId": 32
}

# Then run
bash prove_and_verify.sh
```

### Tip 3: Measure Performance

```bash
# Add timing
time bash prove_and_verify.sh

# Check individual steps
time npx snarkjs groth16 prove ...
time npx snarkjs groth16 verify ...
```

---

## 🐛 Troubleshooting

### "Powers of Tau not found"

```bash
bash prepare_and_setup.sh
```

### "jq: command not found"

```bash
brew install jq  # macOS
sudo apt install jq  # Linux
```

### "Circuit not compiled"

Demo scripts compile automatically, but manual:

```bash
circom kyc_transfer.circom --r1cs --wasm --sym -o artifacts/ -l node_modules
```

### "Verification failed"

1. Check input values match constraints
2. Regenerate proof: `bash prove_and_verify.sh`
3. If still failing, regenerate setup: `bash prepare_and_setup.sh`

---

## 📚 Related Documentation

- [COMPLETE_DEMO.md](../../COMPLETE_DEMO.md) - Full demo documentation
- [VIDEO_DEMO.md](../../VIDEO_DEMO.md) - Video recording guide
- [DEMO.md](../../DEMO.md) - Step-by-step manual
- [QUICKSTART.md](../../QUICKSTART.md) - Quick reference

---

## 🎯 Quick Reference

```bash
# Complete education with theory
bash full_demo.sh

# Quick auto-play
bash demo_auto.sh

# Interactive presentation
bash demo.sh

# Setup only
bash prepare_and_setup.sh

# Proof only
bash prove_and_verify.sh
```

---

**Choose your adventure and start proving! 🚀**
