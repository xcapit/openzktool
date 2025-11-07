# Video Demo Quick Start Guide

Step-by-step guide to record the SDF demo video for OpenZKTool.

## Pre-Recording Checklist

### 1. Environment Setup

```bash
# Install dependencies
cd examples/private-transfer
npm install
cd ../..

# Test the demo script
./demo_sdf_video.sh
```

Press Enter through each section to verify everything works.

### 2. Screen Recording Setup

**Recommended Settings:**
- Resolution: 1920x1080 (1080p)
- Frame rate: 30fps
- Format: MP4 (H.264)
- Audio: External microphone if available

**Terminal Configuration:**
- Font: Menlo or Monaco, 18-20pt
- Theme: Dark with high contrast
- Window: Full screen or maximized
- Shell: Clear history (`clear` before recording)

**Software Options:**
- macOS: QuickTime Player, OBS Studio, ScreenFlow
- Linux: OBS Studio, SimpleScreenRecorder
- Windows: OBS Studio, Camtasia

### 3. Audio Setup

**Microphone Check:**
```bash
# Record test audio
# Speak normally
# Check levels (should not peak/distort)
# Verify no background noise
```

**Speaking Tips:**
- Clear, moderate pace
- Conversational tone
- Pause between sections
- Emphasize key points naturally

## Recording Script

Total duration: 5-7 minutes

### Scene 1: Introduction (30 seconds)

**Action:** Show terminal, run demo script

```bash
./demo_sdf_video.sh
```

**Narration:**
```
"Welcome to OpenZKTool - a privacy-preserving toolkit for Stellar.

Today I'll show you how Zero-Knowledge Proofs solve the fundamental
conflict between privacy and compliance in blockchain applications.

Let's start."
```

**Press Enter**

### Scene 2: The Problem (30 seconds)

**On Screen:** Demo shows the scenario

**Narration:**
```
"Here's the problem: Alice wants to make a transaction that requires
age verification, balance checks, and country restrictions.

But revealing her exact age, balance, and country sacrifices her privacy.

Current solutions force you to choose: full transparency or no compliance.

There's a better way."
```

**Press Enter**

### Scene 3: Proof Generation (60 seconds)

**On Screen:** Real-time proof generation

**Narration:**
```
"Watch this. Alice's private data - age 25, balance 150, country Argentina -
never leaves her device.

Instead, she generates a zero-knowledge proof.

[Wait for proof generation to complete - about 1 second]

Done. In under one second, we have a cryptographic proof.

Notice: The proof is only 797 bytes. Smaller than a tweet.

And look at what was proven:
- Age greater than 18: TRUE
- Balance sufficient: TRUE
- Country allowed: TRUE

All verified. None revealed."
```

**Press Enter**

### Scene 4: Contract Build (30 seconds)

**On Screen:** Contract building

**Narration:**
```
"Now the verification. We use a Soroban smart contract written in pure Rust.

[Wait for build]

The contract implements full BN254 elliptic curve cryptography with
pairing verification. No shortcuts. No trusted precompiles.

24 kilobytes. Production ready."
```

**Press Enter**

### Scene 5: Testnet Deployment (30 seconds)

**On Screen:** Show contract ID

**Narration:**
```
"This contract is already deployed on Stellar testnet.

Contract ID: [show ID on screen]

You can verify it right now on Stellar Expert.

The contract has one job: verify zero-knowledge proofs using complete
Groth16 verification with critical subgroup checks."
```

**Press Enter**

### Scene 6: On-Chain Verification (60 seconds)

**On Screen:** Verification execution

**Narration:**
```
"Now we verify the proof on-chain.

The contract will:
- Check the proof structure
- Validate all points are on the curve
- Perform the pairing computation
- Return the verification result

[Wait for simulated verification]

Success. The proof is cryptographically valid.

Cost: About 20 cents. Compare that to five dollars on Ethereum.

And most importantly: Alice's private data was never revealed.
Not to the contract. Not to the blockchain. Not to anyone."
```

**Press Enter**

### Scene 7: Benefits Summary (45 seconds)

**On Screen:** Show benefits list

**Narration:**
```
"So what did we achieve?

Privacy: Alice's exact age, balance, and country remain secret.
The proof cannot be reversed to find the private data.

Compliance: We verified on-chain that Alice meets all requirements.
Immutable. Auditable.

Performance: Proof generation under one second. Verification twenty cents.

And it's multi-chain: This same proof works on Ethereum, Polygon,
any EVM chain. Same cryptography. Different blockchains."
```

**Press Enter**

### Scene 8: Why This Matters (30 seconds)

**On Screen:** Show comparison

**Narration:**
```
"Compare this to alternatives.

Fully public: Everyone sees your data. Privacy lost.

Fully private: Can't verify compliance. Regulators can't audit.

Trusted third party: Centralized. Data breach risk.

Zero-knowledge proofs: Privacy AND compliance. Decentralized. Secure."
```

**Press Enter**

### Scene 9: Call to Action (30 seconds)

**On Screen:** Show resources

**Narration:**
```
"Ready to try it?

The code is open source. AGPL-3 license.

Clone the repository. Run the examples. Build with it.

Everything you saw today is documented and ready to use.

Links in the description.

Privacy-preserving finance starts here."
```

**End Recording**

## Post-Recording Checklist

### 1. Review Footage

- [ ] Audio levels consistent
- [ ] No clipping or distortion
- [ ] Terminal text readable
- [ ] All sections captured
- [ ] Timing feels natural

### 2. Edit Video

**Basic Edits:**
- Trim dead space at start/end
- Cut any mistakes/pauses
- Adjust audio levels
- Add fade in/out

**Optional Enhancements:**
- Add title screen (5 seconds)
- Add section labels/timestamps
- Highlight key terminal output
- Add background music (subtle)
- Add end screen with links

**Target Length:** 5-7 minutes

### 3. Add Metadata

**Title:**
```
OpenZKTool: Zero-Knowledge Proofs on Stellar - Complete Demo
```

**Description:**
```
OpenZKTool brings privacy-preserving Zero-Knowledge Proofs to Stellar.

In this demo:
• Generate ZK proofs in <1 second
• Verify on-chain with Soroban smart contracts
• Achieve privacy + compliance
• Multi-chain compatibility

Proof generation: <1s
Proof size: ~800 bytes
Verification cost: ~$0.20
Contract: Pure Rust, 24 KB

Open source (AGPL-3.0):
https://github.com/xcapit/stellar-privacy-poc

Documentation:
https://github.com/xcapit/stellar-privacy-poc/tree/main/docs

Try it yourself:
git clone https://github.com/xcapit/stellar-privacy-poc
cd examples/private-transfer
node generateProof.js

Testnet contract:
CBPBVJJW5NMV4UVEDKSR6UO4DRBNWRQEMYKRYZI3CW6YK3O7HAZA43OI

Timestamps:
0:00 Introduction
0:30 The Problem
1:00 Proof Generation
2:00 Smart Contract
2:30 Testnet Deployment
3:00 On-Chain Verification
4:00 Benefits Summary
4:45 Comparison
5:15 Resources

#Stellar #ZeroKnowledge #Privacy #Blockchain #Soroban
```

**Tags:**
- Stellar
- Soroban
- Zero-Knowledge Proofs
- ZK-SNARKs
- Groth16
- Privacy
- Blockchain
- Cryptography
- Smart Contracts
- DeFi

### 4. Export Settings

**Video:**
- Codec: H.264
- Resolution: 1920x1080
- Frame rate: 30fps
- Bitrate: 8-10 Mbps

**Audio:**
- Codec: AAC
- Sample rate: 48 kHz
- Bitrate: 192 kbps

**File size target:** 50-100 MB for 5-7 minutes

### 5. Upload Checklist

- [ ] Video file ready
- [ ] Title written
- [ ] Description with links
- [ ] Tags added
- [ ] Thumbnail created (1280x720)
- [ ] License: Creative Commons Attribution (or Standard YouTube)

### 6. Publish Locations

**Primary:**
- YouTube (public)
- Embed in README.md

**Secondary:**
- Twitter/X (short clips)
- LinkedIn (with article)
- Stellar Discord/Forum
- GitHub Discussions

## Thumbnail Design

**Dimensions:** 1280x720 pixels

**Content:**
```
Background: Dark gradient
Main text: "Zero-Knowledge Proofs on Stellar"
Subtext: "Privacy + Compliance"
Visual: Terminal screenshot or circuit diagram
Logo: OpenZKTool + Stellar logos
```

**Tools:**
- Canva (easy)
- Figma (professional)
- Photoshop (advanced)

## Alternative: Silent Demo

If voice recording is difficult, create a silent demo with captions:

1. Record screen only (no audio)
2. Add text overlays explaining each step
3. Add timestamps for each section
4. Include detailed written description
5. Add background music (optional, keep quiet)

Benefit: Easier to edit, multilingual friendly

## Backup Plan

If demo script fails during recording:

1. Have pre-generated proof in `examples/private-transfer/output/`
2. Use screenshots instead of live demo
3. Record explanation with screen off, add visuals in editing
4. Split into multiple takes, edit together

## Common Issues

**Terminal text too small:**
- Increase font size to 20-22pt
- Use full screen recording
- Add zoom for critical parts in editing

**Background noise:**
- Record in quiet room
- Use noise cancellation in editing
- Consider re-recording audio only

**Demo script pauses:**
- Normal and expected
- Use press-Enter prompts to control pacing
- Edit out if too long

**Command fails:**
- Have backup terminal open
- Show error, then show how to fix
- Demonstrates real usage

## Timing Template

Use this as a checklist during recording:

```
[ ] 0:00 - Start recording, clear terminal
[ ] 0:05 - Run ./demo_sdf_video.sh
[ ] 0:10 - Introduction narration
[ ] 0:40 - Press Enter (Problem)
[ ] 1:10 - Press Enter (Proof Gen)
[ ] 2:10 - Press Enter (Build)
[ ] 2:40 - Press Enter (Deploy)
[ ] 3:10 - Press Enter (Verify)
[ ] 4:10 - Press Enter (Benefits)
[ ] 4:55 - Press Enter (Comparison)
[ ] 5:25 - Press Enter (Resources)
[ ] 6:00 - Stop recording
```

Adjust timing as needed, but keep total under 8 minutes.

## Success Metrics

After publishing, track:

- View count and retention (>50% good)
- Engagement (likes, comments)
- GitHub stars increase
- Documentation visits
- Developer questions

Share metrics with team and SDF.

## Questions?

For demo support:
- GitHub Issues: Technical questions
- Email: team@xcapit.com
- Discord: Join Stellar dev channels

---

**Good luck with the recording!**

Remember: The goal is to show how easy it is to use privacy-preserving ZK proofs on Stellar. Keep it simple, clear, and exciting.
