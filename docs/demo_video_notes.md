# Demo Video Script and Notes

Production notes for creating an effective demo video for OpenZKTool.

## Video Overview

**Duration:** 3-5 minutes
**Target audience:** Technical developers, CTOs, blockchain project leads
**Tone:** Professional, technical, clear
**Goal:** Show that privacy + compliance is achievable and practical

## Script Structure

### Act 1: The Problem (30 seconds)

**Visual:** Split screen showing conflicting requirements

**Narration:**
```
Financial applications on blockchain face a fundamental conflict:
Users need privacy. Regulators need compliance.

Current solutions force you to choose:
- Full transparency: Everyone sees your transactions
- Full privacy: No regulatory oversight possible

There's a better way.
```

**On screen:**
- Animation showing transaction data visible to all
- Lock icon crossed out
- Regulatory document with red X

### Act 2: The Solution (30 seconds)

**Visual:** Diagram of ZK proof flow appearing layer by layer

**Narration:**
```
OpenZKTool uses Zero-Knowledge Proofs to solve this.

You prove you meet requirements without revealing private data.

Example: Prove you're over 18 without showing your exact age.
Prove you have sufficient funds without revealing your balance.
```

**On screen:**
- ZK circuit diagram building up
- "Private: age = 25" → "Public: age ≥ 18 = TRUE"
- Green checkmark appearing

### Act 3: Live Demo - Proof Generation (60 seconds)

**Visual:** Terminal with clear, readable text

**Narration:**
```
Let me show you this in action.

I'll generate a proof for a private transfer.
My actual age, balance, and country remain private.

[Run command]
node generateProof.js --age 25 --balance 150 --country 11

Watch what happens...
[Screen shows execution]

Proof generated in under 1 second.
Size: 800 bytes - smaller than a tweet.
```

**On screen:**
```
$ node generateProof.js --age 25 --balance 150 --country 11

Private inputs (will NOT be revealed):
  Age: 25
  Balance: 150
  Country: 11

Public constraints:
  Min age: 18
  Min balance: 50

[1/3] Generating witness... Done in 234ms
[2/3] Proof generated successfully
      KYC Valid: YES
[3/3] Proof saved to files
      Proof: output/proof.json
      Size: 797 bytes
```

**Key points to emphasize:**
- Speed (<1 second)
- Small size (~800 bytes)
- Private data never revealed

### Act 4: Multi-Chain Verification (60 seconds)

**Visual:** Split screen showing EVM and Stellar

**Narration:**
```
The same proof works on multiple blockchains.

First, Ethereum.
[Show EVM verification]

Gas cost: 250,000 - about $5 at current prices.

Now, Stellar.
[Show Stellar verification]

Cost: 2 million stroops - about 20 cents.

Same proof. Same privacy. Multiple chains.
```

**On screen:**
Left side - Ethereum:
```
Deploying verifier contract...
Submitting proof...
✓ Verified on-chain
Gas used: 251,432
```

Right side - Stellar:
```
Invoking Soroban contract...
✓ Verified on-chain
Cost: 1,847,329 stroops
```

### Act 5: Technical Architecture (45 seconds)

**Visual:** Architecture diagram with animated flow

**Narration:**
```
How does it work?

Three layers:

First: Circom circuits define what to prove.
Second: Groth16 proof system generates cryptographic proofs.
Third: Smart contracts verify proofs on-chain.

The SDK wraps this in a simple API.
Ready to integrate into your application.
```

**On screen:**
- Flow diagram: Circuit → Proof → Verification
- Code snippet:
```typescript
const proof = await prover.prove(privateData);
const valid = await verifier.verify(proof);
```

### Act 6: Compliance Layer (30 seconds)

**Visual:** Dashboard showing audit interface

**Narration:**
```
For compliance: selective disclosure.

Regulators can verify proofs with additional context.
Users maintain privacy from the public.
Auditors get what they need.

Privacy and compliance working together.
```

**On screen:**
- Mock compliance dashboard
- Proof verification with disclosure option
- Green checkmarks for both privacy and compliance

### Act 7: Call to Action (15 seconds)

**Visual:** GitHub repo, documentation links

**Narration:**
```
OpenZKTool is open source.

Try it now:
Clone the repo. Run the examples. Build with it.

Privacy-preserving finance starts here.
```

**On screen:**
```
github.com/xcapit/stellar-privacy-poc

Quick start:
npm install @openzktool/sdk

Documentation:
docs.openzktool.dev

AGPL-3.0 License
```

## Visual Guidelines

### Screen Recording Setup

**Terminal:**
- Font: Menlo or Monaco, 18pt
- Theme: Dark background, high contrast
- Window: Full screen or 1920x1080
- Record at 30fps minimum

**Code Editor:**
- VS Code with dark theme
- Zoom level: 150%
- Hide minimap and sidebars
- Focus on relevant code only

### Animations

**Tools:**
- Excalidraw for diagrams
- After Effects for animations
- Or simple reveal animations in editing software

**Timing:**
- Diagrams: Appear layer by layer (0.5s per layer)
- Code: Type effect or instant reveal with highlight
- Terminal output: Real-time or 2x speed

### Transitions

- Fade or cut (avoid flashy transitions)
- Consistent timing (1 second max)
- Keep focus on content

## Audio

### Recording Equipment

Minimum:
- USB microphone (Blue Yeti, AT2020, etc.)
- Quiet room
- Pop filter

Professional:
- Condenser microphone
- Audio interface
- Treated recording space

### Audio Editing

- Remove background noise
- Normalize volume levels
- Add subtle background music (optional, keep quiet)
- Export at 192 kbps or higher

### Voice Direction

- Clear, conversational tone
- Moderate pace (not too fast)
- Emphasize key points naturally
- Pause between sections

## B-Roll Options

Additional footage to keep video dynamic:

1. **Code scrolling** through the SDK
2. **GitHub activity** (stars, commits)
3. **Blockchain explorers** showing verified transactions
4. **Dashboard mockups** of potential applications
5. **Diagram animations** of ZK concepts

## Technical Specifications

### Video Export Settings

- Resolution: 1920x1080 (1080p)
- Frame rate: 30fps
- Codec: H.264
- Bitrate: 8-10 Mbps
- Audio: AAC, 192 kbps

### File Sizes

Target: 50-100 MB for 3-5 minute video

### Hosting

- YouTube (primary)
- GitHub (embedded in README)
- Website (direct link)

## Alternative Formats

### Short Version (60 seconds)

Focus only on:
1. Problem statement (10s)
2. Solution concept (15s)
3. Quick demo (30s)
4. Call to action (5s)

Use for:
- Twitter/X
- LinkedIn
- Conference submissions

### Technical Deep Dive (10-15 minutes)

Extended version covering:
1. All content from main video
2. Detailed circuit walkthrough
3. Contract architecture explanation
4. SDK integration tutorial
5. Performance benchmarks
6. Security model discussion

Use for:
- Developer conferences
- Technical blog posts
- Grant applications

### Live Demo (Variable)

Interactive presentation:
1. Slide deck with key concepts
2. Live terminal demonstration
3. Q&A session
4. Code walkthrough

Use for:
- Meetups
- Workshops
- Hackathons

## Common Mistakes to Avoid

1. **Too much text on screen** - Keep slides minimal
2. **Going too fast** - Developers need time to read code
3. **Skipping setup** - Show dependencies and prerequisites
4. **No error handling** - Show what happens when things fail
5. **Ignoring audio quality** - Bad audio kills good content
6. **Too long** - Keep it under 5 minutes for main demo
7. **No clear call to action** - Tell viewers what to do next

## Pre-Production Checklist

- [ ] Script finalized and reviewed
- [ ] All demo commands tested and working
- [ ] Screen recording software configured
- [ ] Microphone tested
- [ ] Quiet recording environment
- [ ] All visual assets prepared (diagrams, logos)
- [ ] Backup plan if live demo fails
- [ ] Time allocated for multiple takes
- [ ] Editing software ready
- [ ] Final export settings configured

## Post-Production Checklist

- [ ] Video edited and trimmed
- [ ] Audio levels normalized
- [ ] Transitions added
- [ ] Captions/subtitles created
- [ ] Thumbnail designed
- [ ] Video description written
- [ ] Timestamps added to description
- [ ] Links verified (GitHub, docs, website)
- [ ] Reviewed by team
- [ ] Test uploaded privately
- [ ] Published and shared

## Analytics Targets

Track video performance:

**Engagement metrics:**
- View duration > 60%
- Like/view ratio > 5%
- Comments with questions (shows interest)
- Shares (indicates value)

**Conversion metrics:**
- GitHub stars increase
- Documentation visits
- SDK downloads
- Community Discord joins

## Distribution Plan

### Day 1 - Launch
- Publish on YouTube
- Post on Twitter/X with demo GIF
- Share in Stellar Discord
- Post on r/stellar and r/zkp

### Week 1 - Community
- Share in relevant Slack/Discord communities
- Post on Hacker News (Show HN)
- Submit to DappRadar, DeFi Pulse, etc.
- Email to grant reviewers

### Month 1 - Conferences
- Submit to conference talk proposals
- Share with developer relations teams
- Reach out to blockchain media
- Create blog post with embedded video

## Updates and Revisions

Plan to update video when:
- Major version releases (0.3.0, 1.0.0)
- New chain support added
- Significant performance improvements
- New features (batch verification, etc.)

Maintain:
- Video changelog in this document
- Version tags on YouTube
- Redirect old links to latest version

## Resources

**Stock assets:**
- Icons: Feather Icons, Font Awesome
- Background music: YouTube Audio Library, Epidemic Sound
- Graphics: Unsplash, Pexels (free license)

**Tutorials:**
- Screen recording: OBS Studio documentation
- Video editing: DaVinci Resolve tutorials
- Audio: Audacity user guide

**Examples of good ZK demos:**
- zkSync demo videos
- Aleo demonstrations
- Mina Protocol tutorials

## Contact

For questions about video production:
- GitHub Discussions: [repo]/discussions
- Technical questions: See docs/README.md

---

**Document version:** 1.0
**Last updated:** 2025-01-15
**Next review:** Before video production begins
