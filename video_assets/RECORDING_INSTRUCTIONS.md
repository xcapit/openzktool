# OpenZKTool Video Recording Instructions
**Complete Guide for Recording Professional Demo Videos**

---

## Prerequisites

### Required Software
- **OBS Studio** (free) - https://obsproject.com/
- **iTerm2** (macOS) or **Windows Terminal** (Windows)
- **Modern browser** (Chrome/Firefox) for website recording
- **Audio recording**: Built-in mic or USB microphone

### Optional (for post-production)
- **DaVinci Resolve** (free) - Video editing
- **Audacity** (free) - Audio cleanup
- **Figma** or **Canva** - Thumbnail creation

---

## Recording Setup

### 1. Terminal Configuration (iTerm2/Terminal)

**Font & Colors**:
```bash
# Install a nice monospace font
brew tap homebrew/cask-fonts
brew install --cask font-fira-code

# iTerm2 settings:
# - Font: Fira Code, 16pt
# - Color scheme: Dark+ (or similar dark theme)
# - Transparency: 85-90%
# - Blur: Slight (5-10%)
```

**Window Size**:
- Set terminal to 120x30 characters
- Position in center of screen
- Remove unnecessary UI elements

**Test the demo script**:
```bash
cd /Users/fboiero/Documents/STELLAR/stellar-privacy-poc/video_assets
chmod +x record_demo.sh

# Test run (fast mode)
FAST=1 bash record_demo.sh

# Full speed test
bash record_demo.sh

# Auto mode (for recording)
DEMO_AUTO=1 bash record_demo.sh
```

---

### 2. OBS Studio Setup

#### Scene 1: Terminal (Primary)

**Sources**:
1. **Window Capture**: iTerm2 window
   - Select specific window (not "Auto")
   - Crop to remove title bar
   - Add subtle shadow (Filters → Drop Shadow)

2. **Color Correction** (optional):
   - Filters → Color Correction
   - Gamma: 1.1
   - Saturation: 1.1
   - Contrast: 1.05

**Settings**:
- Canvas: 1920x1080 (1080p)
- FPS: 60
- Position terminal in center

#### Scene 2: Browser (Website)

**Sources**:
1. **Browser Source** or **Window Capture**
   - URL: https://openzktool.vercel.app
   - Resolution: 1920x1080
   - FPS: 60

2. **Interaction**:
   - Enable mouse cursor
   - Show scroll animations
   - Highlight sections with cursor

#### Scene 3: Logo Animation

**Sources**:
1. **Image** or **Media Source**
   - Logo file (if available)
   - Center on canvas
   - Add glow effect (Filters → Glow)

---

### 3. Audio Configuration

#### Voiceover Recording

**Microphone Settings** (OBS):
- **Filters**:
  1. Noise Suppression: -30dB
  2. Noise Gate: -32dB close, -26dB open
  3. Compressor: Ratio 3:1, Threshold -18dB
  4. Gain: +5 to +10dB

**Recording Environment**:
- Quiet room (no background noise)
- Close windows/doors
- Turn off fans/AC during recording
- Position mic 6-8 inches from mouth
- Use pop filter if available

**Script Reading Tips**:
- Read slowly and clearly
- Pause between sentences
- Emphasize key metrics (800 bytes, <50ms, etc.)
- Sound enthusiastic but professional
- Re-record any mistakes (edit later)

---

## Recording Workflow

### Step 1: Record Terminal Demo (No Audio)

```bash
# Start OBS recording
# Switch to terminal scene
# Run the demo script
DEMO_AUTO=1 bash record_demo.sh

# Wait for completion (about 3-4 minutes)
# Stop OBS recording
```

**Output**: `terminal_demo_raw.mp4`

---

### Step 2: Record Website Walkthrough

1. Open https://openzktool.vercel.app in browser
2. Start OBS recording (browser scene)
3. Scroll slowly through sections:
   - Hero (pause 3s)
   - Features (pause 5s)
   - Architecture diagrams (pause 5s)
   - Use cases (pause 4s)
   - Roadmap (pause 4s)
   - Team (pause 3s)
4. Stop recording

**Output**: `website_walkthrough.mp4`

---

### Step 3: Record Voiceover

**Using OBS** (simplest):
1. Create new scene: "Voiceover"
2. Add audio input capture (microphone)
3. Read script from VIDEO_SCRIPT.md
4. Record each section separately:
   - Scene 1: Hook (10s)
   - Scene 2: Problem (10s)
   - Scene 3: Solution (15s)
   - Scene 4: Multi-Chain (25s)
   - Scene 5: Benefits (15s)
   - Scene 6: CTA (15s)

**Alternative** (Audacity):
1. Open Audacity
2. Click red record button
3. Read entire script (90 seconds)
4. Export as WAV or MP3
5. Apply effects:
   - Noise Reduction
   - Normalize to -1.0dB
   - Compressor
   - Equalization (boost 100-200Hz, 2-4kHz)

**Output**: `voiceover_01.wav`, `voiceover_02.wav`, etc.

---

### Step 4: Record B-Roll (Optional)

Additional footage that adds visual interest:

1. **GitHub Repository**:
   - Navigate to repo
   - Show README scrolling
   - Show file structure
   - Show recent commits

2. **Code Snippets**:
   - Open VS Code
   - Show circuit files
   - Show contract code (Solidity/Rust)

3. **Diagrams**:
   - Architecture diagrams
   - Flow charts
   - Multi-chain illustration

**Output**: `broll_github.mp4`, `broll_code.mp4`, etc.

---

## Post-Production (Editing)

### DaVinci Resolve Workflow

#### 1. Import Footage
```
Media Pool:
├── terminal_demo_raw.mp4
├── website_walkthrough.mp4
├── voiceover_01.wav
├── voiceover_02.wav
├── ... (all 6 voiceover clips)
└── broll/ (optional)
```

#### 2. Edit Timeline (90 seconds)

**Timeline Structure**:
```
00:00 - 00:10  | Scene 1: Hook
               | - Logo animation (if available)
               | - Voiceover: "What if you could prove..."
               | - Text overlay: "Zero-Knowledge Proofs"

00:10 - 00:20  | Scene 2: Problem
               | - Animated graphics (traditional KYC forms)
               | - Voiceover: "Traditional identity verification..."
               | - Text: ❌ Age, Balance, Country visible

00:20 - 00:35  | Scene 3: Solution
               | - Terminal demo (proof generation)
               | - Voiceover: "OpenZKTool uses Zero-Knowledge SNARKs..."
               | - Highlight: "800 bytes, <1 second"

00:35 - 00:60  | Scene 4: Multi-Chain
               | - Terminal demo (EVM verification)
               | - Terminal demo (Soroban verification)
               | - Voiceover: "Same proof, different chains..."
               | - Text: "ONE PROOF, TWO BLOCKCHAINS"

00:60 - 00:75  | Scene 5: Benefits
               | - Website walkthrough (features section)
               | - Voiceover: "Privacy-preserving. Production-grade..."
               | - Animated cards flying in

00:75 - 00:90  | Scene 6: CTA
               | - Website homepage
               | - GitHub stars counter (if visible)
               | - Voiceover: "Ready to build private dApps?..."
               | - Text: "openzktool.vercel.app"
               | - Final logo/title card
```

#### 3. Add Transitions
- **Cut** (default): Most transitions
- **Cross Dissolve**: Between website sections (0.5s)
- **Wipe** (optional): Between terminal and browser (0.3s)

#### 4. Color Grading
```
Color Page:
- Lift shadows slightly (+5)
- Boost saturation (1.1x)
- Enhance purples/cyans/greens (match website colors)
- Add slight vignette (subtle, 0.3 opacity)
```

#### 5. Audio Mixing
```
Fairlight Page:
- Voiceover track: -3dB to -6dB (loud and clear)
- Background music: -25dB to -30dB (subtle)
- Sound effects: -15dB to -20dB (noticeable but not overwhelming)
- Apply EQ to voiceover (cut <80Hz, boost 2-4kHz)
- Add reverb (Room, very subtle)
```

**Background Music Suggestions**:
- Search "tech ambient royalty free" on YouTube Audio Library
- Look for:
  - Low energy (doesn't compete with voiceover)
  - Electronic/synthetic sounds
  - 80-100 BPM
  - No vocals

**Sound Effects**:
- Whoosh (scene transitions): -18dB
- Typing sounds (optional): -25dB
- Success chimes (checkmarks): -20dB
- Download from: freesound.org, zapsplat.com

#### 6. Text Overlays & Graphics

**Lower Thirds** (name/title):
```
Font: Inter or Roboto (modern sans-serif)
Size: 36-48pt
Color: #FFFFFF (white) with #7B61FF (purple) background
Position: Bottom left, 10% from edges
Animation: Slide in from left (0.3s), slide out to left (0.3s)
```

**Key Metrics** (e.g., "800 bytes"):
```
Font: Inter Bold or Roboto Bold
Size: 72-96pt
Color: #00FF94 (green) with glow effect
Position: Center or bottom center
Animation: Scale in (0.5s), fade out (0.3s)
Duration: 2-3 seconds on screen
```

**Call to Action** (website URL):
```
Font: Inter Bold
Size: 48pt
Color: #00D1FF (cyan)
Position: Bottom center
Animation: Fade in (0.5s), stay on screen until end
Duration: Last 5-10 seconds of video
```

---

### 7. Captions/Subtitles (Accessibility)

**Create SRT file**:
```
1
00:00:00,000 --> 00:00:03,500
What if you could prove you're eligible for a service

2
00:00:03,500 --> 00:00:06,000
without revealing any personal data?

3
00:00:10,000 --> 00:00:13,000
Traditional identity verification exposes everything
```

**DaVinci Resolve**:
1. Edit Page → Subtitles → Import SRT
2. Style: Font Inter, 32pt, White with black background
3. Position: Bottom center

**YouTube** (alternative):
- Upload video
- Use auto-generated captions
- Edit for accuracy
- Download SRT for backup

---

### 8. Export Settings

**DaVinci Resolve Export**:
```
Format: MP4
Codec: H.264
Resolution: 1920x1080 (1080p)
Frame Rate: 60fps
Quality: High (15-20 Mbps)
Audio: AAC, 320 kbps, 48kHz
```

**File Naming**:
- `openzktool_demo_90s_v1.mp4` (main version)
- `openzktool_teaser_30s_v1.mp4` (short version)
- `openzktool_demo_2min_v1.mp4` (extended version)

---

## Alternative: Quick Version (1 Hour)

If you need a video FAST:

1. **Record terminal demo** (5 min):
   ```bash
   DEMO_AUTO=1 bash record_demo.sh | tee demo.log
   ```
   Record with OBS

2. **Add voiceover later** (30 min):
   - Import video into DaVinci Resolve
   - Record voiceover in Audacity
   - Sync audio to video

3. **Minimal editing** (20 min):
   - Trim beginning/end
   - Add title card (5s)
   - Add CTA text overlay (last 10s)
   - Export

4. **Upload** (5 min)

**Total**: ~60 minutes

---

## Distribution

### YouTube
- **Title**: "OpenZKTool: Multi-Chain Zero-Knowledge Proofs Demo | Ethereum + Stellar"
- **Description**: Include links to GitHub, website, docs
- **Tags**: zero-knowledge proofs, zk-snarks, stellar, soroban, ethereum, privacy, blockchain
- **Thumbnail**: High contrast, large text, "MULTI-CHAIN ZK PROOFS"

### Twitter/X
- **90s version**: Full video
- **30s teaser**: Cut to Scenes 1, 3, 6
- **Tweet text**:
  > "🔐 OpenZKTool: Prove you're eligible WITHOUT revealing personal data
  >
  > ✅ 800 byte proofs
  > ✅ <1s generation
  > ✅ Works on Ethereum + Stellar
  >
  > 🔓 Open source, free forever
  >
  > Watch the demo 👇"

### LinkedIn
- Professional audience
- Emphasize business use cases (compliance, privacy)
- Tag relevant companies/people

### GitHub README
- Embed video at top of README
- Use YouTube iframe or GIF preview

---

## Troubleshooting

**Problem**: Audio is too quiet
- **Solution**: Increase gain in OBS filters, or boost in Audacity (Amplify effect)

**Problem**: Terminal text is blurry
- **Solution**: Increase terminal font size to 18-20pt, ensure OBS is recording at 1080p

**Problem**: Colors look washed out
- **Solution**: Apply color grading in DaVinci Resolve, boost saturation 1.1-1.2x

**Problem**: File size too large (>500MB)
- **Solution**: Re-export with lower bitrate (10-12 Mbps still looks good)

**Problem**: Demo script runs too fast/slow
- **Solution**: Adjust `DELAY_*` variables at top of script

---

## Checklist

### Pre-Recording
- [ ] Test demo script multiple times
- [ ] Configure terminal font and colors
- [ ] Set up OBS scenes
- [ ] Test microphone levels
- [ ] Prepare voiceover script
- [ ] Quiet environment (close windows, turn off fans)

### Recording
- [ ] Record terminal demo (DEMO_AUTO=1)
- [ ] Record website walkthrough
- [ ] Record voiceover (all 6 sections)
- [ ] Record B-roll (optional)

### Post-Production
- [ ] Import all footage into DaVinci Resolve
- [ ] Arrange clips on timeline (match voiceover to visuals)
- [ ] Add transitions between scenes
- [ ] Add text overlays (metrics, CTA)
- [ ] Color grade (enhance purples/cyans/greens)
- [ ] Mix audio (voiceover, music, SFX)
- [ ] Add captions/subtitles
- [ ] Export final video

### Distribution
- [ ] Upload to YouTube (unlisted or public)
- [ ] Create thumbnail
- [ ] Post on Twitter/X with hashtags
- [ ] Share on LinkedIn
- [ ] Embed in GitHub README
- [ ] Share in project Discord/Telegram

---

## Resources

### Free Assets
- **Music**: YouTube Audio Library, Incompetech
- **Sound Effects**: Freesound.org, Zapsplat.com
- **Icons/Graphics**: Flaticon, Undraw
- **Fonts**: Google Fonts (Inter, Roboto, Fira Code)

### Learning Resources
- **OBS Studio Guide**: https://obsproject.com/wiki/
- **DaVinci Resolve Tutorials**: YouTube (official channel)
- **Color Grading**: "Color Grading 101" on YouTube
- **Audio Mixing**: "Audio for Video" tutorials

---

## Example Timeline (Detailed)

| Time | Visual | Audio | Text Overlay |
|------|--------|-------|--------------|
| 0:00 | Logo animation | Voiceover: "What if..." | "Zero-Knowledge Proofs" |
| 0:10 | KYC form graphics | Voiceover: "Traditional verification..." | ❌ Age, Balance, Country |
| 0:20 | Terminal (proof gen) | Voiceover: "OpenZKTool uses..." | "800 bytes, <1s" |
| 0:35 | Terminal (EVM verify) | Voiceover: "Watch it verify on Ethereum..." | "Ethereum: 250k gas" |
| 0:45 | Terminal (Soroban verify) | Voiceover: "...and Stellar Soroban." | "Soroban: 0.00001 XLM" |
| 0:55 | Multi-chain summary | Voiceover: "Same proof, different chains." | "ONE PROOF, TWO CHAINS" |
| 1:00 | Website features | Voiceover: "Privacy-preserving..." | Feature cards fly in |
| 1:15 | Website homepage | Voiceover: "Ready to build..." | "openzktool.vercel.app" |
| 1:25 | Final logo card | Music fades out | "OpenZKTool | GitHub: xcapit/stellar-privacy-poc" |

---

**Good luck with your recording!** 🎬🚀
