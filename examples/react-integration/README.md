# 🎨 React Integration Example

**Complete React app with ZK proof generation and blockchain verification**

---

## 🎯 What This Demonstrates

- ✅ Browser-based ZK proof generation
- ✅ User-friendly form UI
- ✅ Real-time proof generation status
- ✅ MetaMask integration for Ethereum verification
- ✅ Stellar wallet integration
- ✅ Multi-chain proof submission

**Live demo:** *(coming soon)*

---

## 🚀 Quick Start

### Prerequisites

- Node.js v18+
- npm or yarn
- MetaMask browser extension
- Stellar wallet (Freighter)

### Installation

```bash
# Navigate to this directory
cd examples/react-integration

# Install dependencies
npm install

# Start development server
npm run dev
```

**Open:** http://localhost:3000

---

## 📂 Project Structure

```
react-integration/
├── public/
│   ├── kyc_transfer.wasm        # Witness calculator
│   └── kyc_transfer_final.zkey  # Proving key
├── src/
│   ├── components/
│   │   ├── ProofGenerator.tsx   # Main proof generation UI
│   │   ├── VerifyOnChain.tsx    # Blockchain verification
│   │   └── StatusDisplay.tsx    # Real-time status
│   ├── lib/
│   │   ├── zkproof.ts          # ZK proof utilities
│   │   ├── ethereum.ts         # Ethereum integration
│   │   └── stellar.ts          # Stellar integration
│   ├── App.tsx
│   └── main.tsx
├── package.json
└── README.md
```

---

## 💻 Key Components

### 1. Proof Generator Component

**File:** `src/components/ProofGenerator.tsx`

```typescript
import { useState } from 'react';
import { generateProof } from '../lib/zkproof';

export function ProofGenerator() {
  const [age, setAge] = useState('');
  const [balance, setBalance] = useState('');
  const [country, setCountry] = useState('11'); // Argentina
  const [proof, setProof] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleGenerate() {
    setLoading(true);
    try {
      const result = await generateProof({
        age: parseInt(age),
        balance: parseInt(balance),
        country: parseInt(country),
        minAge: 18,
        minBalance: 50,
        allowedCountries: [11, 1, 5] // AR, US, UK
      });

      setProof(result);

      // Check if KYC passed
      if (result.publicSignals[0] === "1") {
        alert("✅ KYC Check Passed!");
      } else {
        alert("❌ KYC Check Failed");
      }
    } catch (error) {
      console.error("Proof generation failed:", error);
      alert("Error generating proof");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="proof-generator">
      <h2>Generate Privacy Proof</h2>

      <div className="form">
        <label>
          Age (private)
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="Enter your age"
          />
        </label>

        <label>
          Balance (private)
          <input
            type="number"
            value={balance}
            onChange={(e) => setBalance(e.target.value)}
            placeholder="Enter your balance"
          />
        </label>

        <label>
          Country (private)
          <select value={country} onChange={(e) => setCountry(e.target.value)}>
            <option value="11">Argentina</option>
            <option value="1">United States</option>
            <option value="5">United Kingdom</option>
            <option value="99">Other (will fail)</option>
          </select>
        </label>

        <button onClick={handleGenerate} disabled={loading}>
          {loading ? "Generating..." : "Generate Proof"}
        </button>
      </div>

      {proof && (
        <div className="proof-result">
          <h3>Proof Generated! ✅</h3>
          <p>KYC Valid: {proof.publicSignals[0] === "1" ? "Yes ✅" : "No ❌"}</p>
          <p>Proof size: ~800 bytes</p>
          <details>
            <summary>View Proof (click to expand)</summary>
            <pre>{JSON.stringify(proof.proof, null, 2)}</pre>
          </details>
        </div>
      )}
    </div>
  );
}
```

---

### 2. ZK Proof Utility Library

**File:** `src/lib/zkproof.ts`

```typescript
declare const snarkjs: any;

export interface ProofInput {
  age: number;
  balance: number;
  country: number;
  minAge: number;
  minBalance: number;
  allowedCountries: number[];
}

export interface ProofResult {
  proof: any;
  publicSignals: string[];
}

export async function generateProof(input: ProofInput): Promise<ProofResult> {
  console.log("Starting proof generation...");

  const { proof, publicSignals } = await snarkjs.groth16.fullProve(
    input,
    "/kyc_transfer.wasm",
    "/kyc_transfer_final.zkey"
  );

  console.log("Proof generated successfully!");
  console.log("Public signals:", publicSignals);

  return { proof, publicSignals };
}

export async function verifyProofLocally(
  proof: any,
  publicSignals: string[]
): Promise<boolean> {
  const vKeyResponse = await fetch("/kyc_transfer_vkey.json");
  const vKey = await vKeyResponse.json();

  const verified = await snarkjs.groth16.verify(vKey, publicSignals, proof);
  return verified;
}
```

---

### 3. On-Chain Verification Component

**File:** `src/components/VerifyOnChain.tsx`

```typescript
import { useState } from 'react';
import { verifyOnEthereum } from '../lib/ethereum';
import { verifyOnStellar } from '../lib/stellar';

interface Props {
  proof: any;
  publicSignals: string[];
}

export function VerifyOnChain({ proof, publicSignals }: Props) {
  const [ethLoading, setEthLoading] = useState(false);
  const [stellarLoading, setStellarLoading] = useState(false);

  async function handleEthereumVerify() {
    setEthLoading(true);
    try {
      const result = await verifyOnEthereum(proof, publicSignals);
      alert(result.success ? "✅ Verified on Ethereum!" : "❌ Verification failed");
    } catch (error) {
      console.error(error);
      alert("Error: " + error.message);
    } finally {
      setEthLoading(false);
    }
  }

  async function handleStellarVerify() {
    setStellarLoading(true);
    try {
      const result = await verifyOnStellar(proof, publicSignals);
      alert(result.success ? "✅ Verified on Stellar!" : "❌ Verification failed");
    } catch (error) {
      console.error(error);
      alert("Error: " + error.message);
    } finally {
      setStellarLoading(false);
    }
  }

  return (
    <div className="verify-section">
      <h3>Verify On-Chain</h3>
      <p>Submit the same proof to multiple blockchains</p>

      <div className="buttons">
        <button onClick={handleEthereumVerify} disabled={ethLoading}>
          {ethLoading ? "Verifying..." : "Verify on Ethereum"}
        </button>

        <button onClick={handleStellarVerify} disabled={stellarLoading}>
          {stellarLoading ? "Verifying..." : "Verify on Stellar"}
        </button>
      </div>
    </div>
  );
}
```

---

### 4. Ethereum Integration

**File:** `src/lib/ethereum.ts`

```typescript
import { ethers } from 'ethers';

// Verifier contract ABI (minimal)
const VERIFIER_ABI = [
  "function verifyProof(uint[2] memory a, uint[2][2] memory b, uint[2] memory c, uint[1] memory input) public view returns (bool)"
];

// Deployed verifier address (replace with your deployment)
const VERIFIER_ADDRESS = "0x..."; // Deploy first!

export async function verifyOnEthereum(proof: any, publicSignals: string[]) {
  // Connect to MetaMask
  if (!window.ethereum) {
    throw new Error("MetaMask not installed");
  }

  const provider = new ethers.BrowserProvider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  const signer = await provider.getSigner();

  // Connect to verifier contract
  const verifier = new ethers.Contract(
    VERIFIER_ADDRESS,
    VERIFIER_ABI,
    signer
  );

  // Format proof for Solidity
  const a = [proof.pi_a[0], proof.pi_a[1]];
  const b = [
    [proof.pi_b[0][1], proof.pi_b[0][0]],
    [proof.pi_b[1][1], proof.pi_b[1][0]]
  ];
  const c = [proof.pi_c[0], proof.pi_c[1]];
  const input = [publicSignals[0]];

  // Call verifier
  const tx = await verifier.verifyProof(a, b, c, input);
  const receipt = await tx.wait();

  return {
    success: true,
    txHash: receipt.transactionHash
  };
}
```

---

### 5. Stellar Integration

**File:** `src/lib/stellar.ts`

```typescript
import * as StellarSdk from '@stellar/stellar-sdk';

const VERIFIER_CONTRACT_ID = "C..."; // Deploy first!
const RPC_URL = "https://soroban-testnet.stellar.org";

export async function verifyOnStellar(proof: any, publicSignals: string[]) {
  // Connect to Freighter wallet
  if (!window.freighterApi) {
    throw new Error("Freighter wallet not installed");
  }

  const { address } = await window.freighterApi.getAddress();

  // Build transaction
  const server = new StellarSdk.SorobanRpc.Server(RPC_URL);
  const contract = new StellarSdk.Contract(VERIFIER_CONTRACT_ID);

  const tx = new StellarSdk.TransactionBuilder(
    await server.getAccount(address),
    { fee: "100000", networkPassphrase: StellarSdk.Networks.TESTNET }
  )
    .addOperation(
      contract.call(
        "verify",
        StellarSdk.xdr.ScVal.scvBytes(Buffer.from(JSON.stringify(proof))),
        StellarSdk.xdr.ScVal.scvVec([
          StellarSdk.xdr.ScVal.scvU256(BigInt(publicSignals[0]))
        ])
      )
    )
    .setTimeout(30)
    .build();

  // Sign with Freighter
  const signedTx = await window.freighterApi.signTransaction(tx.toXDR());

  // Submit
  const result = await server.sendTransaction(
    StellarSdk.TransactionBuilder.fromXDR(signedTx, StellarSdk.Networks.TESTNET)
  );

  return {
    success: result.status === "SUCCESS",
    txHash: result.hash
  };
}
```

---

## 📦 package.json

```json
{
  "name": "openzktool-react-example",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "ethers": "^6.9.0",
    "@stellar/stellar-sdk": "^11.0.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@vitejs/plugin-react": "^4.2.0",
    "typescript": "^5.3.0",
    "vite": "^5.0.0"
  }
}
```

---

## 🎨 Styling (Optional)

**File:** `src/App.css`

```css
.proof-generator {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
}

.form label {
  display: block;
  margin-bottom: 1rem;
}

.form input,
.form select {
  display: block;
  width: 100%;
  padding: 0.5rem;
  margin-top: 0.25rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.form button {
  background: #007bff;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}

.form button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.proof-result {
  margin-top: 2rem;
  padding: 1rem;
  background: #e8f5e9;
  border-radius: 4px;
}

.verify-section {
  margin-top: 2rem;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.buttons {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}
```

---

## 🔧 Setup Instructions

### 1. Copy Circuit Files

```bash
# From project root
cp circuits/artifacts/kyc_transfer.wasm examples/react-integration/public/
cp circuits/artifacts/kyc_transfer_final.zkey examples/react-integration/public/
cp circuits/artifacts/kyc_transfer_vkey.json examples/react-integration/public/
```

### 2. Include snarkjs

Add to `index.html`:
```html
<script src="https://cdn.jsdelivr.net/npm/snarkjs@latest/build/snarkjs.min.js"></script>
```

### 3. Deploy Verifier Contracts

**Ethereum (testnet):**
```bash
cd ../../evm-verification
forge create --rpc-url $SEPOLIA_RPC \
  --private-key $PRIVATE_KEY \
  src/Verifier.sol:Groth16Verifier
```

**Stellar (testnet):**
```bash
cd ../../soroban
stellar contract deploy \
  --wasm target/wasm32-unknown-unknown/release/verifier.wasm \
  --source alice \
  --network testnet
```

Update contract addresses in `src/lib/ethereum.ts` and `src/lib/stellar.ts`.

---

## 🚀 Running the Example

```bash
npm run dev
```

**Test flow:**
1. Enter age (e.g., 25), balance (e.g., 150), country (Argentina)
2. Click "Generate Proof"
3. Wait ~1 second
4. See "KYC Valid: Yes ✅"
5. Click "Verify on Ethereum" (needs MetaMask)
6. Click "Verify on Stellar" (needs Freighter)
7. Both verifications succeed! 🎉

---

## 📚 Learn More

- [Interactive Tutorial](../../docs/getting-started/interactive-tutorial.md)
- [Architecture Overview](../../docs/architecture/overview.md)
- [FAQ](../../docs/FAQ.md)

---

*Example last updated: 2025-01-10*
*Team X1 - Xcapit Labs*
