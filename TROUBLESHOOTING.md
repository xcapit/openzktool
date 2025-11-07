# Troubleshooting Guide

## Demo Script Issues

### Issue: Script hangs showing endless dots/spinner

**Symptom:**
```
Generating cryptographic proof...

  ........................................................................................................................................
```

**Root Cause:** Multiple `node` processes running simultaneously, competing for the same circuit artifacts files.

**Solution:**

```bash
# 1. Kill all node processes
killall node

# 2. Wait a moment
sleep 2

# 3. Verify no node processes remain (except Discord/IDE)
ps aux | grep node | grep -v "Discord\|Code"

# 4. Run the demo fresh
bash demo_sdf_video.sh
```

### Best Practices for Running Demo

**Always start fresh:**

```bash
# Before running the demo
killall node 2>/dev/null
sleep 2
bash demo_sdf_video.sh
```

**For recording:**

```bash
# Clean start before recording
killall node 2>/dev/null
sleep 2

# Start recording
./record_demo.sh

# Then run demo in another terminal
bash demo_sdf_video.sh
```

### Expected Timing

When running correctly, proof generation should take:
- **Normal**: 150-300ms
- **First run**: Up to 3 seconds (circuit loading)
- **Warning**: >60 seconds indicates a problem

### If Spinner Stops But Script Doesn't Continue

**Check the temp file:**

```bash
cat /tmp/proof_output.txt
```

If you see errors about missing files:

```bash
# Regenerate circuit artifacts
cd circuits
bash scripts/prepare_and_setup.sh
cd ..
```

### Circuit Artifact Check

Verify circuit files exist and have reasonable sizes:

```bash
ls -lh circuits/build/kyc_transfer_final.zkey
ls -lh circuits/build/kyc_transfer_js/kyc_transfer.wasm
```

**Expected:**
- `.zkey` file: ~100KB
- `.wasm` file: ~40KB

If files are missing or 0 bytes, regenerate:

```bash
cd circuits
bash scripts/prepare_and_setup.sh
```

## Performance Issues

### Proof Generation is Slow (>5 seconds)

**Possible causes:**

1. **Multiple processes**: Check with `ps aux | grep node`
2. **Low memory**: Check with `top` or `htop`
3. **Disk I/O**: Check if /tmp is full with `df -h /tmp`

**Solutions:**

```bash
# Free up memory
killall node

# Clear temp files
rm -f /tmp/proof_output.txt /tmp/proof_test.txt

# Restart demo
bash demo_sdf_video.sh
```

### Demo Colors Not Showing

**Symptom:** You see `-e` and `\033[1;32m` instead of colors

**Cause:** Running with `sh` instead of `bash`

**Solution:**

```bash
# Wrong:
sh demo_sdf_video.sh

# Correct:
bash demo_sdf_video.sh
```

## Recording Issues

### ffmpeg "No Such File or Directory"

**Solution:**

```bash
brew install ffmpeg
```

### Recording Shows Wrong Window

**Cause:** macOS captures the wrong display

**Solution:**

```bash
# Check your display number
ffmpeg -f avfoundation -list_devices true -i ""

# Use correct display number (usually 1 or 2)
ffmpeg -f avfoundation -framerate 30 -i "2:none" \
  -c:v libx264 -preset medium -crf 18 -pix_fmt yuv420p \
  demo_output.mp4
```

### Recording File is Huge

**Cause:** Using too low CRF value

**Solution:**

```bash
# For YouTube, CRF 18-23 is fine
# Lower = better quality but larger file
# 18 = visually lossless (~500MB/10min)
# 23 = high quality (~200MB/10min)

ffmpeg -f avfoundation -framerate 30 -i "1:none" \
  -c:v libx264 -preset medium -crf 23 -pix_fmt yuv420p \
  demo_smaller.mp4
```

## Circuit Compilation Issues

### Error: "circom not found"

**Solution:**

```bash
# Install circom
brew install circom

# Or build from source
git clone https://github.com/iden3/circom.git
cd circom
cargo build --release
cargo install --path circom
```

### Error: "snarkjs not found"

**Solution:**

```bash
cd circuits
npm install
```

### Trusted Setup Fails

**Symptom:** `prepare_and_setup.sh` fails at Powers of Tau

**Solution:**

```bash
cd circuits

# Download Powers of Tau file directly
curl -L -o pot15_final.ptau \
  https://hermez.s3-eu-west-1.amazonaws.com/powersOfTau28_hez_final_15.ptau

# Continue setup
bash scripts/prepare_and_setup.sh
```

## Getting Help

If issues persist after trying these solutions:

1. **Check logs:**
   ```bash
   cat /tmp/proof_output.txt
   ```

2. **Verify environment:**
   ```bash
   node --version  # Should be 18+
   npm --version
   bash --version  # Should be 3.2+
   ```

3. **Report issue:**
   - Repository: https://github.com/xcapit/openzktool/issues
   - Include: OS version, node version, error messages, `/tmp/proof_output.txt`

## Quick Reference Commands

```bash
# Clean slate before demo
killall node 2>/dev/null && sleep 2 && bash demo_sdf_video.sh

# Check if proof generation works
cd examples/private-transfer
node generateProof.js --age 25 --balance 150 --country 11

# Regenerate circuit artifacts
cd circuits && bash scripts/prepare_and_setup.sh

# Record demo for YouTube
killall node 2>/dev/null && sleep 2 && ./record_demo.sh
```
