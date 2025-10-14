# 🎥 Video Recording Guide - Stellar Privacy SDK

**Complete guide for recording a professional demo video**

---

## 📋 Quick Summary

**Best Script:** `demo_video.sh` (NEW - optimized for video)
**Duration:** ~7 minutes
**Resolution:** 1080p minimum
**Tools:** OBS Studio or QuickTime

---

## 🎬 The Perfect Script for Video

### Use `demo_video.sh` (NEW)

```bash
# Auto mode (no pauses, perfect for recording)
DEMO_AUTO=1 bash demo_video.sh
```

**Why this script is best for video:**
- ✅ Perfect timing (2-second pauses in auto mode)
- ✅ Complete narrative (problem → solution → demo → results)
- ✅ Shows REAL blockchain verification evidence
- ✅ Clear visual sections with headers
- ✅ Comprehensive final summary
- ✅ Professional presentation

**What it shows:**
1. **Intro** (30s) - Problem statement
2. **The Privacy Problem** (1 min) - Why it matters
3. **The Solution** (1 min) - ZK proofs explained simply
4. **Use Case** (1 min) - Alice's story
5. **Proof Generation** (1 min) - Technical details + evidence
6. **Ethereum Verification** (1.5 min) - Real blockchain proof
7. **Stellar Verification** (1.5 min) - Multi-chain evidence
8. **Final Summary** (1.5 min) - Impact, metrics, use cases

---

## 🖥️ Terminal Setup

### 1. Choose the Right Terminal

**macOS - Recommended:** iTerm2
```bash
brew install --cask iterm2
```

**macOS - Alternative:** Built-in Terminal.app
**Linux:** Terminator, Tilix, or GNOME Terminal
**Windows:** Windows Terminal

---

### 2. Configure Terminal Appearance

**Font Size:**
```
Minimum: 16pt
Recommended: 18-20pt
For 4K: 24pt
```

**Font Family:**
```
Recommended:
- JetBrains Mono
- Fira Code
- Cascadia Code
- Menlo (macOS default)
```

**Color Scheme:**
```
Recommended:
- Dracula (high contrast)
- Monokai (warm colors)
- Solarized Dark (professional)
- One Dark (modern)
```

**Window Size:**
```
Width: 100-120 characters
Height: 35-40 lines
Full screen or maximized window
```

---

### 3. Clean Prompt

Simplify your prompt for recording:

```bash
# Temporary clean prompt
export PS1="\$ "

# Or slightly fancier
export PS1="\[\033[01;32m\]\u@openzktool\[\033[00m\]:\[\033[01;34m\]\w\[\033[00m\]\$ "
```

---

## 🎬 Recording Tools

### Option 1: OBS Studio (FREE - Best Quality)

**Download:** https://obsproject.com/

**Settings:**
```
Resolution: 1920x1080 (or 2560x1440 for 2K)
FPS: 30
Encoder: x264
Bitrate: 2500 Kbps (1080p) or 5000 Kbps (1440p)
Format: MP4
```

**Setup:**
1. Add "Window Capture" or "Display Capture"
2. Select your terminal window
3. Add "Audio Input Capture" for microphone
4. Test audio levels (speak at -12dB to -6dB)

**Pros:**
- Free and open source
- Professional quality
- Multi-source (terminal + webcam)
- Live streaming capable

---

### Option 2: QuickTime (macOS - Simple)

**Built-in on macOS**

**Steps:**
1. Open QuickTime Player
2. File → New Screen Recording
3. Click options → Select microphone
4. Click record button
5. Select terminal window or full screen

**Pros:**
- Simple and quick
- No setup needed
- Good quality

**Cons:**
- Basic features only
- No overlays

---

### Option 3: ScreenFlow (macOS - Professional)

**Download:** https://www.telestream.net/screenflow/

**Cost:** $169 (one-time)

**Pros:**
- Professional editing tools
- Annotations and callouts
- Zoom and pan effects
- Multi-track timeline

---

### Option 4: asciinema (Terminal Only)

**For terminal-only recording:**

```bash
# Install
brew install asciinema

# Record
asciinema rec openzktool-demo.cast --title "OpenZKTool Multi-Chain Demo"

# Run demo
DEMO_AUTO=1 bash demo_video.sh

# Stop: Ctrl+D

# Upload to share
asciinema upload openzktool-demo.cast
```

**Pros:**
- Perfect for developers
- Text-based (small file size)
- Shareable as web player

**Cons:**
- Terminal only (no voice/face)
- Limited audience

---

## 🎙️ Audio Setup

### Microphone

**Recommended:**
- Blue Yeti USB ($129)
- Rode NT-USB Mini ($99)
- Audio-Technica ATR2100x ($99)
- Or: AirPods Pro (decent quality)

**Position:**
- 6-12 inches from mouth
- Slightly below or to the side
- Away from keyboard

---

### Recording Tips

**Before Recording:**
- Test audio levels (-12dB to -6dB)
- Close notification apps
- Silence phone
- Use quiet room

**During Recording:**
- Speak clearly and slowly
- Pause between sections
- Don't rush technical terms
- Stay enthusiastic but professional

**Narration Script:**

See [NARRATION_SCRIPT.md](./NARRATION_SCRIPT.md) for word-by-word narration.

---

## 📹 Recording Process

### Pre-Recording Checklist

- [ ] Terminal configured (font, colors, size)
- [ ] Clean working directory
- [ ] All dependencies installed
- [ ] Test run completed successfully
- [ ] Recording software tested
- [ ] Audio levels checked
- [ ] Notifications disabled
- [ ] Phone on silent
- [ ] Glass of water ready

---

### Step-by-Step Recording

#### 1. Setup

```bash
# Go to project directory
cd ~/Documents/STELLAR/stellar-privacy-poc

# Clean terminal
clear

# Set clean prompt
export PS1="\$ "

# Test the demo (dry run)
DEMO_AUTO=1 bash demo_video.sh
```

#### 2. Start Recording

**OBS Studio:**
- Click "Start Recording"
- Wait 3 seconds
- Begin demo

**QuickTime:**
- Click record button
- Select terminal window
- Click "Start Recording"

#### 3. Run Demo

```bash
DEMO_AUTO=1 bash demo_video.sh
```

**Narration:** Narrate as the demo runs (see narration script)

#### 4. Stop Recording

- Let final screen show for 5 seconds
- Stop recording
- Save file

---

### Live Narration vs Voice-Over

**Option A: Live Narration (Easier)**
- Speak while demo runs
- More natural
- One-take recording
- Risk: mistakes

**Option B: Voice-Over (Better Quality)**
- Record demo silently
- Add voice later in editing
- Can re-record voice
- Professional result

---

## ✂️ Post-Production

### Basic Editing (Optional)

**Tools:**
- DaVinci Resolve (FREE)
- iMovie (macOS, FREE)
- Kdenlive (Linux, FREE)
- Adobe Premiere (Professional, $$$)

**Edit Steps:**
1. **Trim:** Cut dead space at start/end
2. **Speed:** Accelerate long compilation (1.5x-2x)
3. **Annotations:** Add text overlays for key points
4. **Music:** Add background music (low volume, ~10%)
5. **Outro:** Add call-to-action slide

---

### Adding Subtitles

**Why:**
- Accessibility
- Silent viewing
- Keyword emphasis

**Tools:**
- YouTube auto-captions (edit for accuracy)
- Rev.com ($1.50/min, human)
- Otter.ai (AI, free tier)
- Descript (AI + editing)

**Format:**
```
[0:00] Welcome to the Stellar Privacy SDK
[0:05] This demo shows zero-knowledge proofs
[0:10] for privacy-preserving compliance
```

---

### Key Points to Highlight (Text Overlays)

**During Proof Generation:**
```
⚡ <1 second generation
📦 800 bytes proof
🔐 Zero data leaked
```

**During EVM Verification:**
```
⛓️ Ethereum Blockchain
✅ Verified On-Chain
💰 ~$2 per verification
```

**During Stellar Verification:**
```
⛓️ Stellar Blockchain
✅ Same Proof, Different Chain
💰 <$0.01 per verification
```

---

## 🎨 Branding & Style

### Intro Slide (5 seconds)

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

       🔐 STELLAR PRIVACY SDK
    Zero-Knowledge Proofs for TradFi

         openzktool.vercel.app

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

### Outro Slide (10 seconds)

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

       ✨ Thank You! ✨

   🌐 openzktool.vercel.app
   📚 github.com/xcapit/stellar-privacy-poc
   💼 Open Source Privacy Toolkit

   Team X1 - Xcapit Labs

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 📤 Export Settings

### YouTube (Recommended)

```
Format: MP4
Codec: H.264
Resolution: 1920x1080 (1080p) or 2560x1440 (1440p)
Frame Rate: 30fps
Bitrate: 8-12 Mbps
Audio: AAC, 192 kbps, 48 kHz
```

---

### Twitter/X

```
Format: MP4
Resolution: 1280x720 (720p)
Duration: <2:20 (for full upload)
Size: <512MB
Frame Rate: 30fps
```

---

### LinkedIn

```
Format: MP4
Resolution: 1920x1080
Duration: <10 minutes
Size: <5GB
```

---

## 🎬 Multiple Video Versions

### Version 1: Full Demo (7 min)

**Use:** YouTube, website
**Content:** Complete demo (demo_video.sh)
**Audience:** Everyone

---

### Version 2: Quick Teaser (60 sec)

**Use:** Twitter, LinkedIn, Instagram
**Content:**
- Problem (15s)
- Solution (15s)
- Demo highlights (20s)
- Call to action (10s)

**Edit from:** Full demo, speed up, cut to highlights

---

### Version 3: Technical Deep Dive (15 min)

**Use:** Developer audiences, conferences
**Content:**
- Full demo
- Code walkthrough
- Architecture explanation
- Q&A

---

## 📝 Narration Script

### Opening (0:00 - 0:30)

```
"Welcome to the Stellar Privacy SDK.

In this demo, I'll show you how Zero-Knowledge Proofs
enable privacy-preserving compliance on multiple blockchains.

We'll generate a cryptographic proof, verify it on Ethereum,
and then verify the SAME proof on Stellar.

All without revealing any private data.

Let's dive in."
```

---

### Problem Statement (0:30 - 1:30)

```
"Today, banks and fintechs face a critical problem:

Public blockchains expose all transaction data.
Account balances, amounts, counterparties - everything is visible.

For traditional finance, this is a non-starter.

Current KYC processes require users to share everything:
Their ID, passport, bank statements, complete financial history.

But the service only needs to know ONE thing:
Does the user meet the requirements?

This creates a dilemma: Privacy versus Compliance.

Banks need privacy but can't use public blockchains.
Regulators need transparency but can't accept fully private systems.

The Stellar Privacy SDK solves this."
```

---

### Solution (1:30 - 2:30)

```
"With Zero-Knowledge Proofs, you can prove something
without revealing the underlying data.

Let me show you how:

Alice wants to access a DeFi platform.
The platform requires:
- Age over 18
- Balance over $50
- Approved country

Alice HAS:
- Age 25
- Balance $150
- Lives in Argentina

Instead of sharing these exact values,
Alice generates a cryptographic proof.

This proof is only 800 bytes.
It proves she meets ALL requirements.
But it reveals NOTHING about her actual age, balance, or country.

Watch as we generate this proof now..."
```

---

### Proof Generation (2:30 - 3:30)

```
"The system is now generating a Zero-Knowledge Proof using:
- Circom circuits
- Groth16 SNARKs
- BN254 elliptic curve

This takes less than one second.

[Pause as proof generates]

Done! We now have an 800-byte proof.

This proof contains mathematical commitments on an elliptic curve.
It proves Alice's data satisfies the constraints.
But the proof itself contains ZERO private information.

Her age, balance, and country remain completely private.

Now let's verify this proof on two different blockchains..."
```

---

### Ethereum Verification (3:30 - 5:00)

```
"First, Ethereum.

We're starting a local Ethereum node using Foundry's Anvil.
Deploying a Solidity smart contract.
And submitting Alice's proof for verification.

[Pause as verification runs]

The contract performs a BN254 elliptic curve pairing check.
This is the cryptographic operation that validates the proof.

[Pause for result]

Success! The Ethereum blockchain confirms:
Alice's proof is valid.
She meets all requirements.

But the blockchain has NO IDEA what her actual age, balance,
or country are.

The cost? About $2 worth of gas at current prices.
The time? Less than 50 milliseconds.

Now let's verify the SAME proof on Stellar..."
```

---

### Stellar Verification (5:00 - 6:30)

```
"Now we're moving to Stellar's Soroban smart contracts.

This is the key: We're using the EXACT SAME 800-byte proof.
No regeneration. No modification.
The same proof that worked on Ethereum.

We're building a Rust contract to WebAssembly.
Starting a local Stellar network.
And deploying the verifier contract.

[Pause as verification runs]

The Soroban contract validates the proof structure.
It checks all the field elements are valid.

[Pause for result]

Success again! Stellar confirms:
The proof is valid.
Alice meets all requirements.

And again, the blockchain knows NOTHING about her private data.

The cost? Less than a penny.
The contract size? Just 2.1 kilobytes of WebAssembly.

This is true multi-chain interoperability."
```

---

### Conclusion (6:30 - 7:00)

```
"Let's recap what we just saw:

ONE proof. TWO blockchains.
Complete privacy. Full compliance.

Alice proved she met the requirements without revealing:
- Her exact age
- Her exact balance
- Her country

The proof worked on both Ethereum and Stellar.
It would also work on Polygon, Avalanche, BSC,
and any other EVM-compatible chain.

This opens up massive possibilities:
Banks can use public blockchains privately.
DeFi can verify credentials without seeing them.
Compliance and privacy can finally co-exist.

The Stellar Privacy SDK makes this real.

Links in the description.
GitHub repo is open source.
This is an open source project focused on privacy and compliance.

Thanks for watching!"
```

---

## 📊 Video Metrics to Track

After publishing:

- **Views** - Total reach
- **Watch time** - Engagement quality
- **Click-through rate** - Interest level
- **Shares** - Virality
- **Comments** - Engagement depth
- **Subscribers** - Long-term audience

---

## 🎯 Publishing Strategy

### YouTube

**Title:** "Privacy-Preserving Compliance on Blockchain | Stellar Privacy SDK Demo"

**Description:**
```
Watch how Zero-Knowledge Proofs enable privacy-preserving compliance verification
on multiple blockchains (Ethereum + Stellar).

In this demo:
✅ Generate a ZK proof (800 bytes, <1 second)
✅ Verify on Ethereum blockchain
✅ Verify SAME proof on Stellar blockchain
✅ NO private data revealed

Perfect for: Banks, Fintechs, DeFi, Compliance

🌐 Website: https://openzktool.vercel.app
📚 GitHub: https://github.com/xcapit/stellar-privacy-poc
💼 Grant: Open Source Privacy Toolkit

Timestamps:
0:00 - Introduction
0:30 - The Privacy Problem
1:30 - Zero-Knowledge Proof Solution
2:30 - Proof Generation Demo
3:30 - Ethereum Verification
5:00 - Stellar Verification
6:30 - Conclusion & Impact

#ZeroKnowledge #Blockchain #Privacy #Stellar #Ethereum #DeFi #TradFi
```

**Tags:**
```
zero knowledge proofs, blockchain privacy, stellar, ethereum,
soroban, defi, tradfi, kyc, compliance, zk-snarks, groth16,
multi-chain, interoperability
```

---

### Twitter/X

**Tweet:**
```
🔐 Privacy + Compliance on Blockchain

Watch: ONE proof verified on Ethereum AND Stellar

✅ 800 bytes
✅ <1 sec generation
✅ Zero data leaked
✅ True multi-chain

Perfect for banks, fintechs, DeFi 🏦

🎥 Demo: [link]
📚 Docs: openzktool.vercel.app

#ZKP #Stellar #Ethereum
```

---

### LinkedIn

**Post:**
```
🔐 Solving the Privacy vs Compliance Dilemma in Blockchain

I'm excited to share our work on the Stellar Privacy SDK -
a solution that enables banks and fintechs to use public
blockchains while maintaining data privacy.

Using Zero-Knowledge Proofs, institutions can:
✅ Verify compliance without seeing private data
✅ Use the same proof across multiple blockchains
✅ Maintain regulatory transparency with selective disclosure

In this 7-minute demo, we show:
• Proof generation (<1 second)
• Verification on Ethereum
• Verification on Stellar (same proof!)
• Complete privacy preservation

This opens up blockchain adoption for traditional finance.

This is being developed as an open source digital public good.

Watch the demo and let me know what you think!
[link to video]

#Blockchain #Privacy #TradFi #DeFi #ZeroKnowledge #Stellar
```

---

## ✅ Final Checklist

Before publishing:

- [ ] Video recorded in 1080p minimum
- [ ] Audio is clear (no background noise)
- [ ] Terminal is visible and readable
- [ ] Demo completes successfully
- [ ] All key points narrated
- [ ] Intro slide (5s)
- [ ] Outro slide (10s)
- [ ] Subtitles added
- [ ] Description written
- [ ] Tags added
- [ ] Thumbnail created
- [ ] Tested playback

---

## 🎬 Ready to Record!

**Your command:**

```bash
DEMO_AUTO=1 bash demo_video.sh
```

**Remember:**
- Speak slowly and clearly
- Let evidence show on screen
- Emphasize multi-chain aspect
- Show enthusiasm!

**Good luck! 🎉**

---

*For questions: Open an issue on GitHub*
*Team X1 - Xcapit Labs*
