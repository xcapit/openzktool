# How to Run the SDF Demo

## Quick Start

```bash
# Make sure you're in the project root
cd /Users/fboiero/Documents/GitHub/openzktool

# Run the demo with bash (IMPORTANT: use bash, not sh)
bash demo_sdf_video.sh
```

## For Recording

If you want to record the demo automatically without manual Enter presses:

```bash
# This provides all 7 Enter keypresses needed
bash demo_sdf_video.sh <<< $'\n\n\n\n\n\n\n'
```

## Common Issues

### Issue 1: Colors don't display correctly

**Symptom:** You see `-e` characters and no colors:
```
-e ╔════════════════════════════════════════════════════════════════╗
-e ║  STEP 2: Generate Zero-Knowledge Proof                        ║
```

**Solution:** You're running with `sh` instead of `bash`. Use:
```bash
bash demo_sdf_video.sh
```

NOT:
```bash
sh demo_sdf_video.sh
```

### Issue 2: Script hangs or waits forever

**Solution:** The script has 7 interactive prompts. Either:
- Press Enter 7 times manually, or
- Use the automated version: `bash demo_sdf_video.sh <<< $'\n\n\n\n\n\n\n'`

### Issue 3: Circuit artifacts missing

**Symptom:** Error about missing `.wasm` or `.zkey` files

**Solution:** Run the setup script first:
```bash
cd circuits
bash scripts/prepare_and_setup.sh
```

## What the Demo Shows

1. **STEP 1:** Privacy vs Compliance Problem
2. **STEP 2:** Generate ZK Proof (~150ms, 723 bytes)
3. **STEP 3:** Soroban Contract Structure
4. **STEP 4:** Stellar Testnet Deployment
5. **STEP 5:** On-chain Verification
6. **STEP 6:** Cost Comparison (Stellar vs Ethereum)
7. **STEP 7:** Multi-chain Compatibility

## Performance Metrics

The demo will show:
- **Proof generation:** ~150ms
- **Proof size:** ~723 bytes
- **Cost on Stellar:** ~$0.20
- **Cost on Ethereum:** ~$5.00
- **Cost savings:** 25x cheaper on Stellar

## Repository

https://github.com/xcapit/openzktool
