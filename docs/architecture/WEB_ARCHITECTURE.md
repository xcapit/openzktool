# 🌐 OpenZKTool Web Architecture

**Complete architecture documentation for the OpenZKTool landing page and future web platform**

---

## 📋 Table of Contents

1. [Current Architecture (v1.0)](#current-architecture-v10)
2. [Technology Stack](#technology-stack)
3. [Component Structure](#component-structure)
4. [Improved Architecture Proposal (v2.0)](#improved-architecture-proposal-v20)
5. [Future Enhancements](#future-enhancements)

---

## 🎯 Current Architecture (v1.0)

### Overview

The current web implementation is a **static Next.js landing page** deployed on Vercel, focused on presenting the project and providing documentation links.

```
┌─────────────────────────────────────────────────────┐
│                   User's Browser                     │
│  ┌────────────────────────────────────────────────┐ │
│  │  Next.js 14 Static Site (SSG)                  │ │
│  │  ┌──────────────────────────────────────────┐  │ │
│  │  │ Components (React)                       │  │ │
│  │  │  - Hero                                   │  │ │
│  │  │  - Demo                                   │  │ │
│  │  │  - Features                              │  │ │
│  │  │  - UseCases                              │  │ │
│  │  │  - Team                                  │  │ │
│  │  │  - FAQ                                   │  │ │
│  │  │  - Community                             │  │ │
│  │  └──────────────────────────────────────────┘  │ │
│  └────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────┘
           │
           │ External Links
           ▼
┌─────────────────────────────────────────────────────┐
│  External Resources                                  │
│  - GitHub Repository                                 │
│  - Documentation (GitHub)                            │
│  - Demo Scripts (GitHub)                             │
└─────────────────────────────────────────────────────┘
```

### Current File Structure

```
web/
├── app/
│   ├── page.tsx              # Main page (imports all components)
│   ├── layout.tsx            # Layout with metadata & SEO
│   └── globals.css           # Global styles + animations
├── components/
│   ├── Hero.tsx              # Hero section with CTA
│   ├── Demo.tsx              # Demo showcase
│   ├── Features.tsx          # Feature grid
│   ├── Architecture.tsx      # How it works
│   ├── Interoperability.tsx  # Multi-chain support
│   ├── UseCases.tsx          # Use cases grid
│   ├── Team.tsx              # Team members
│   ├── Roadmap.tsx           # Project roadmap
│   ├── FAQ.tsx               # FAQ accordion
│   ├── Community.tsx         # Community links
│   └── Footer.tsx            # Footer with links
├── public/
│   ├── manifest.json         # PWA manifest
│   ├── favicon.svg           # Favicon
│   └── *.svg                 # Icons & images
├── package.json
├── next.config.js
├── tailwind.config.js
└── tsconfig.json
```

### Current Capabilities

✅ **What it does well:**
- Static site generation (SSG) for fast loading
- SEO optimized (metadata, JSON-LD, OpenGraph)
- Responsive design (mobile-first)
- Modern animations (glassmorphism, hover effects)
- Good structure and component organization

❌ **What it lacks:**
- No interactivity (can't generate proofs)
- No backend/API integration
- No user authentication
- No database or state management
- All demos redirect to GitHub

---

## 🛠️ Technology Stack

### Current Stack (v1.0)

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| **Framework** | Next.js | 14.2.33 | React framework with SSG |
| **UI Library** | React | 18.2.0 | Component-based UI |
| **Styling** | Tailwind CSS | 3.4.0 | Utility-first CSS |
| **Language** | TypeScript | 5.3.3 | Type safety |
| **Deployment** | Vercel | - | Hosting & CDN |
| **Analytics** | Vercel Analytics | 1.5.0 | Basic analytics |

### Dependencies

```json
{
  "dependencies": {
    "@vercel/analytics": "^1.5.0",
    "next": "^14.0.4",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@types/node": "^20.10.6",
    "@types/react": "^18.2.46",
    "@types/react-dom": "^18.2.18",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.32",
    "tailwindcss": "^3.4.0",
    "typescript": "^5.3.3"
  }
}
```

---

## 📐 Component Structure

### Component Hierarchy

```
App (page.tsx)
│
├── Hero
│   ├── Badge group (PoC Complete, DPG, etc.)
│   ├── Headline
│   ├── Description
│   ├── CTA buttons
│   ├── Metrics grid (4 metrics)
│   └── Phase indicator
│
├── Demo
│   ├── Demo mode selector (3 modes)
│   ├── Selected demo details
│   ├── Demo flow (4 steps)
│   ├── Alice's story (2 cards)
│   └── Prerequisites
│
├── Features
│   ├── Feature grid (6-8 features)
│   └── Each feature card
│
├── Architecture
│   ├── Architecture flow (4 steps)
│   ├── Code examples (2 columns)
│   └── Benefits (3 cards)
│
├── Interoperability
│   ├── Multi-chain showcase
│   └── Chain compatibility grid
│
├── UseCases
│   ├── Use case grid (6 use cases)
│   ├── Market opportunity stats
│   └── CTA section
│
├── Team
│   ├── Team stats
│   ├── Team grid (6 members)
│   ├── Team strengths
│   └── Track record
│
├── Roadmap
│   ├── Phase cards (4 phases)
│   └── Timeline visualization
│
├── FAQ
│   ├── FAQ accordion (12 questions)
│   └── CTA with links
│
├── Community
│   ├── Community links grid (6 links)
│   ├── Contribution methods
│   └── License info
│
└── Footer
    ├── Brand & social links
    ├── Resources links
    ├── Community links
    └── Bottom bar (copyright, license)
```

### Shared Styles

**Global CSS Classes:**
```css
/* Glassmorphism effects */
.glass
.glass-strong

/* Gradient text */
.text-gradient
.text-gradient-fast

/* Animations */
.fade-in-up
.scale-in
.shimmer
.pulse
.bounce
.hover-lift
.ripple

/* Glow effects */
.glow-box
.glow-box-blue
.glow-box-green
.hover-glow

/* Floating animations */
.particle
.float-animation
.float-animation-slow
```

**Tailwind Custom Colors:**
```javascript
colors: {
  'stellar-dark': '#0a0a0f',
  'stellar-purple': '#7b61ff',
  'stellar-blue': '#00d4ff',
  'zk-green': '#00ff88',
  'zk-cyan': '#00d4ff',
}
```

---

## 🚀 Improved Architecture Proposal (v2.0)

### Vision

Transform from a **static landing page** to an **interactive ZK playground** where users can:
1. Learn about ZK proofs interactively
2. Generate proofs directly in the browser
3. Verify proofs on testnets
4. Build custom circuits visually
5. Manage credentials and proofs

### Proposed Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                         Frontend (Next.js)                        │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Pages                                                       │  │
│  │  - Landing (current)                                        │  │
│  │  - Playground (NEW)                                         │  │
│  │  - Dashboard (NEW)                                          │  │
│  │  - Documentation (NEW)                                      │  │
│  └────────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ State Management (Zustand/Redux)                           │  │
│  │  - User state                                               │  │
│  │  - Wallet connections                                       │  │
│  │  - Proof history                                            │  │
│  └────────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Web Workers (Browser)                                       │  │
│  │  - snarkjs WASM (proof generation)                         │  │
│  │  - Circuit compilation                                      │  │
│  │  - Heavy computation off main thread                        │  │
│  └────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
                              │
                              │ API Calls
                              ▼
┌──────────────────────────────────────────────────────────────────┐
│                    Backend API (Node.js/Rust)                     │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ REST/GraphQL API                                            │  │
│  │  - /api/proof/generate                                      │  │
│  │  - /api/proof/verify                                        │  │
│  │  - /api/circuit/compile                                     │  │
│  │  - /api/user/proofs                                         │  │
│  └────────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Services                                                    │  │
│  │  - ProofService (snarkjs integration)                      │  │
│  │  - CircuitService (circom compilation)                     │  │
│  │  - BlockchainService (on-chain verification)               │  │
│  └────────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │ Queue System (Bull/BullMQ)                                  │  │
│  │  - Heavy proof generation jobs                              │  │
│  │  - Circuit compilation jobs                                 │  │
│  └────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
                              │
                              │ Storage
                              ▼
┌──────────────────────────────────────────────────────────────────┐
│                    Data Layer                                     │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
│  │   PostgreSQL    │  │      Redis      │  │       IPFS      │  │
│  │   (Metadata)    │  │    (Cache)      │  │  (Proofs/VKs)   │  │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
                              │
                              │ Blockchain
                              ▼
┌──────────────────────────────────────────────────────────────────┐
│                    Blockchain Layer                               │
│  ┌─────────────────┐  ┌─────────────────┐                        │
│  │   Stellar       │  │   Ethereum      │                        │
│  │   Testnet       │  │   Sepolia       │                        │
│  └─────────────────┘  └─────────────────┘                        │
└──────────────────────────────────────────────────────────────────┘
```

### New Components Needed

#### 1. **Playground Component** (Interactive ZK Lab)
```typescript
// components/Playground/
├── CircuitEditor.tsx        // Visual circuit builder
├── ProofGenerator.tsx       // Proof generation UI
├── ProofVerifier.tsx        // Verification UI
├── InputForm.tsx            // Private input form
└── ResultDisplay.tsx        // Proof output display
```

#### 2. **Dashboard Component** (User Proof History)
```typescript
// components/Dashboard/
├── ProofList.tsx            // List of generated proofs
├── ProofCard.tsx            // Individual proof card
├── ProofDetails.tsx         // Detailed proof view
└── Statistics.tsx           // User statistics
```

#### 3. **SDK Integration Component**
```typescript
// components/SDK/
├── WalletConnect.tsx        // MetaMask, Freighter
├── ChainSelector.tsx        // Choose chain
├── TransactionStatus.tsx    // Tx status
└── ErrorDisplay.tsx         // Error handling
```

### Enhanced Technology Stack (v2.0)

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | Next.js 14 + React 18 | SSR + Client-side interactivity |
| **State** | Zustand | Lightweight state management |
| **ZK Library** | snarkjs (WASM) | Browser-based proof generation |
| **Wallet** | wagmi + viem | Ethereum wallet integration |
| **Wallet (Stellar)** | @stellar/freighter-api | Stellar wallet integration |
| **Backend** | Next.js API Routes (initial) | Serverless API |
| **Backend (future)** | Node.js + Express OR Rust + Axum | Dedicated backend |
| **Database** | PostgreSQL (Supabase) | User data, proof metadata |
| **Cache** | Redis | Performance optimization |
| **Storage** | IPFS (Pinata) | Decentralized proof storage |
| **Blockchain** | Stellar SDK + Ethers.js | On-chain interactions |

---

## 🔮 Future Enhancements

### Phase 1: Browser-Based Proof Generation (Month 1-2)
**Goal:** Let users generate proofs directly in the browser

**Features:**
- Upload or select circuit
- Input private data via form
- Generate proof using snarkjs WASM
- Display proof JSON
- Copy/download proof

**Tech Stack:**
- snarkjs v0.7.0+ (with WASM support)
- Web Workers for heavy computation
- IndexedDB for local storage

**Example Flow:**
```typescript
import { groth16 } from 'snarkjs';

async function generateProof(inputs) {
  // Load circuit WASM and zkey
  const { proof, publicSignals } = await groth16.fullProve(
    inputs,
    '/circuits/kyc_transfer.wasm',
    '/circuits/kyc_transfer_final.zkey'
  );

  return { proof, publicSignals };
}
```

### Phase 2: On-Chain Verification UI (Month 2-3)
**Goal:** Verify proofs on testnets directly from the UI

**Features:**
- Connect wallet (MetaMask, Freighter)
- Select blockchain (Ethereum Sepolia, Stellar Testnet)
- Submit proof to verifier contract
- Display transaction status
- Show verification result

**Tech Stack:**
- wagmi + viem (Ethereum)
- @stellar/stellar-sdk (Stellar)
- Web3Modal for wallet connection
- React Query for async state

**Example Flow:**
```typescript
import { useStellarWallet } from '@/hooks/useStellarWallet';
import { useVerifyProof } from '@/hooks/useVerifyProof';

function VerifyProofButton({ proof }) {
  const { connected, address } = useStellarWallet();
  const { verify, isLoading } = useVerifyProof();

  const handleVerify = async () => {
    const result = await verify({
      proof,
      contractId: 'CBPBVJJW5NMV4...',
      network: 'testnet'
    });

    console.log('Verified:', result);
  };

  return (
    <button onClick={handleVerify} disabled={!connected || isLoading}>
      {isLoading ? 'Verifying...' : 'Verify on Stellar'}
    </button>
  );
}
```

### Phase 3: Visual Circuit Builder (Month 4-5)
**Goal:** Build circuits visually without writing Circom code

**Features:**
- Drag-and-drop circuit components
- Visual constraint builder
- Real-time constraint count
- Export to Circom
- Import existing circuits

**Tech Stack:**
- React Flow (node-based editor)
- Monaco Editor (code editor)
- Custom Circom parser

**Example UI:**
```
┌────────────────────────────────────────┐
│  Circuit Builder                        │
│  ┌────────────────────────────────────┐│
│  │ [Input: age]                        ││
│  │      │                              ││
│  │      ▼                              ││
│  │ [GreaterEqThan]                    ││
│  │      │                              ││
│  │      ▼                              ││
│  │ [AND Gate]                         ││
│  │      │                              ││
│  │      ▼                              ││
│  │ [Output: valid]                    ││
│  └────────────────────────────────────┘│
│  Constraints: 250                       │
│  [Export Circom] [Compile] [Test]      │
└────────────────────────────────────────┘
```

### Phase 4: SDK & Documentation Hub (Month 5-6)
**Goal:** Comprehensive developer experience

**Features:**
- Interactive documentation with runnable examples
- Code playground (CodeSandbox-like)
- API reference with live testing
- Tutorial videos embedded
- Community snippets

**Tech Stack:**
- Nextra (Next.js + MDX)
- CodeMirror for code editing
- Sandpack for live code execution
- Algolia DocSearch

### Phase 5: Advanced Features (Month 6+)
**Goal:** Production-ready platform

**Features:**
- User authentication (Privy, Dynamic)
- Proof history dashboard
- Collaborative circuit building
- Proof marketplace
- Circuit templates library
- Advanced analytics
- Monitoring & alerts

---

## 📊 Performance Optimization Strategy

### Current Performance (v1.0)
```
Bundle Size: 92.7 kB (First Load JS)
Build Time: ~30 seconds
Lighthouse Score: 95+ (all metrics)
```

### Optimization Targets (v2.0)

**1. Code Splitting**
```typescript
// Dynamic imports for heavy components
const Playground = dynamic(() => import('@/components/Playground'), {
  ssr: false,
  loading: () => <LoadingSpinner />
});
```

**2. WASM Optimization**
```typescript
// Load snarkjs WASM lazily
const loadSnarkjs = async () => {
  const snarkjs = await import('snarkjs');
  return snarkjs;
};
```

**3. Caching Strategy**
- Cache compiled circuits (IndexedDB)
- Cache verification keys (LocalStorage)
- Cache proof history (Redis on backend)

**4. Web Workers**
```typescript
// proof-worker.ts
self.addEventListener('message', async (e) => {
  const { inputs, circuit, zkey } = e.data;
  const snarkjs = await import('snarkjs');

  const { proof, publicSignals } = await snarkjs.groth16.fullProve(
    inputs,
    circuit,
    zkey
  );

  self.postMessage({ proof, publicSignals });
});
```

---

## 🔐 Security Considerations

### Current Security (v1.0)
✅ Static site (no attack surface)
✅ HTTPS by default (Vercel)
✅ No user data collected

### Enhanced Security (v2.0)

**1. Input Validation**
```typescript
// Validate all inputs before proof generation
const validateInputs = (inputs: any) => {
  if (!inputs.age || inputs.age < 0 || inputs.age > 150) {
    throw new Error('Invalid age');
  }
  // ... more validations
};
```

**2. Client-Side Encryption**
```typescript
// Encrypt sensitive data before storage
import { encrypt, decrypt } from '@/utils/crypto';

const storeProof = async (proof: Proof) => {
  const encrypted = await encrypt(JSON.stringify(proof));
  localStorage.setItem('proof', encrypted);
};
```

**3. Rate Limiting**
```typescript
// API route protection
import { ratelimit } from '@/lib/redis';

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for');
  const { success } = await ratelimit.limit(ip);

  if (!success) {
    return new Response('Too many requests', { status: 429 });
  }

  // Process request...
}
```

**4. Content Security Policy**
```typescript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval'; ..."
          }
        ]
      }
    ];
  }
};
```

---

## 📚 Documentation Integration

### Current Documentation
- External links to GitHub
- Markdown files in /docs
- No search functionality

### Enhanced Documentation Hub

**Structure:**
```
/docs (Next.js app)
├── /getting-started
│   ├── introduction
│   ├── quickstart
│   └── installation
├── /circuits
│   ├── basics
│   ├── custom-circuits
│   └── examples
├── /api-reference
│   ├── proof-generation
│   ├── verification
│   └── utilities
├── /guides
│   ├── ethereum
│   ├── stellar
│   └── multi-chain
└── /examples
    ├── kyc-verification
    ├── age-proof
    └── solvency-check
```

**Features:**
- Full-text search (Algolia)
- Interactive code examples
- Live playground integration
- Versioned documentation
- Community contributions

---

## 🎨 Design System

### Current Design (v1.0)
- Dark theme
- Purple/Blue/Green color palette
- Glassmorphism effects
- Smooth animations

### Enhanced Design System (v2.0)

**Component Library:**
```
components/ui/
├── Button.tsx
├── Card.tsx
├── Input.tsx
├── Modal.tsx
├── Toast.tsx
├── Dropdown.tsx
├── Table.tsx
└── Badge.tsx
```

**Theme Configuration:**
```typescript
// theme/index.ts
export const theme = {
  colors: {
    primary: {
      50: '#f5f3ff',
      100: '#ede9fe',
      // ... up to 900
    },
    // ... more colors
  },
  spacing: {
    // ...
  },
  typography: {
    // ...
  }
};
```

---

## 🚀 Deployment Strategy

### Current Deployment (v1.0)
- Vercel (automatic from GitHub)
- Single environment (production)
- No preview deployments

### Enhanced Deployment (v2.0)

**Environments:**
```
- Development (localhost)
- Staging (staging.openzktool.com)
- Production (openzktool.vercel.app)
```

**CI/CD Pipeline:**
```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main, develop]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
      - name: Install dependencies
        run: npm ci
      - name: Run tests
        run: npm test
      - name: Build
        run: npm run build
      - name: Deploy to Vercel
        run: vercel --prod
```

---

## 📈 Analytics & Monitoring

### Current Analytics (v1.0)
- Basic Vercel Analytics
- No error tracking

### Enhanced Monitoring (v2.0)

**Tools:**
- Vercel Analytics (Web Vitals)
- Sentry (Error tracking)
- PostHog (Product analytics)
- LogRocket (Session replay)

**Metrics to Track:**
```typescript
// Track proof generation
analytics.track('proof_generated', {
  circuit: 'kyc_transfer',
  time_ms: 1234,
  constraints: 586,
  success: true
});

// Track verification
analytics.track('proof_verified', {
  chain: 'stellar',
  network: 'testnet',
  success: true,
  gas_used: 48000
});
```

---

## 🎯 Success Metrics

### v1.0 (Current)
- Page views
- GitHub stars
- Documentation views

### v2.0 (Target)
- **User Engagement:**
  - Daily active users (DAU)
  - Proofs generated per day
  - Verifications per day

- **Technical Metrics:**
  - Average proof generation time
  - Success rate
  - Error rate

- **Growth Metrics:**
  - New users per week
  - Retention rate (7-day, 30-day)
  - Feature adoption rate

---

## 🔗 References

- [Next.js Documentation](https://nextjs.org/docs)
- [snarkjs GitHub](https://github.com/iden3/snarkjs)
- [Circom Documentation](https://docs.circom.io/)
- [React Flow](https://reactflow.dev/)
- [Wagmi Documentation](https://wagmi.sh/)

---

**Last Updated:** October 15, 2025
**Version:** 1.0 → 2.0 (Proposed)
**Author:** Fernando Boiero
