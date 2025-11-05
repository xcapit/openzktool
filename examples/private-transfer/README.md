# Private Transfer Example

Full-stack application demonstrating privacy-preserving transfers using Zero-Knowledge Proofs on multiple blockchains.

## Overview

This example shows how to build a complete application that:
- Generates ZK proofs in the browser
- Connects to MetaMask (EVM) and Freighter (Stellar) wallets
- Verifies proofs on-chain across multiple networks
- Provides a user-friendly interface for privacy-preserving KYC verification

## Features

- React frontend with TypeScript
- Multi-chain wallet integration
- Real-time proof generation with progress indicators
- On-chain verification with transaction tracking
- Network switching (Ethereum, Polygon, Stellar)
- Responsive UI with dark mode support

## Architecture

```
private-transfer/
├── frontend/                 # React application
│   ├── src/
│   │   ├── components/
│   │   │   ├── ProofGenerator.tsx
│   │   │   ├── WalletConnect.tsx
│   │   │   ├── NetworkSelector.tsx
│   │   │   └── VerificationStatus.tsx
│   │   ├── hooks/
│   │   │   ├── useWallet.ts
│   │   │   ├── useProofGeneration.ts
│   │   │   └── useVerification.ts
│   │   ├── utils/
│   │   │   ├── proofService.ts
│   │   │   └── contractInteraction.ts
│   │   └── App.tsx
│   └── package.json
├── contracts/                # Smart contracts
│   ├── evm/
│   │   └── Groth16Verifier.sol
│   └── stellar/
│       └── lib.rs
└── README.md
```

## Prerequisites

- Node.js 18+
- MetaMask browser extension
- Freighter wallet extension
- Local blockchain (Anvil for EVM testing)
- Stellar sandbox (for Stellar testing)

## Installation

```bash
# Clone repository
git clone https://github.com/xcapit/stellar-privacy-poc.git
cd examples/private-transfer

# Install dependencies
npm install

# Setup circuit artifacts
cd ../../circuits
bash scripts/prepare_and_setup.sh
cd ../examples/private-transfer
```

## Running Locally

### Start Local Blockchains

Terminal 1 - EVM:
```bash
anvil
```

Terminal 2 - Stellar:
```bash
docker run -d -p 8000:8000 stellar/quickstart:testing --standalone
```

### Deploy Contracts

```bash
# Deploy EVM verifier
cd contracts/evm
forge create --rpc-url http://localhost:8545 \
  --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 \
  src/Groth16Verifier.sol:Groth16Verifier

# Deploy Stellar verifier
cd ../stellar
stellar contract deploy \
  --wasm target/wasm32-unknown-unknown/release/zk_verifier.wasm \
  --source ADMIN_SECRET_KEY \
  --rpc-url http://localhost:8000/soroban/rpc \
  --network-passphrase "Standalone Network ; February 2017"
```

### Configure Environment

Create `.env` file:

```bash
# EVM Configuration
VITE_EVM_RPC_URL=http://localhost:8545
VITE_EVM_CHAIN_ID=31337
VITE_EVM_VERIFIER_ADDRESS=0x...

# Stellar Configuration
VITE_STELLAR_RPC_URL=http://localhost:8000/soroban/rpc
VITE_STELLAR_NETWORK_PASSPHRASE="Standalone Network ; February 2017"
VITE_STELLAR_CONTRACT_ID=C...

# Circuit Artifacts
VITE_CIRCUIT_WASM_PATH=/circuits/kyc_transfer.wasm
VITE_CIRCUIT_ZKEY_PATH=/circuits/kyc_transfer_final.zkey
```

### Start Development Server

```bash
npm run dev
```

Open http://localhost:5173

## User Flow

### Step 1: Connect Wallet

1. Click "Connect Wallet"
2. Choose network (Ethereum or Stellar)
3. Approve wallet connection
4. Wallet address displayed in header

### Step 2: Enter Private Information

User enters sensitive data that will NOT be revealed on-chain:

```
Age: 25
Balance: 150
Country: Argentina (ID: 11)
```

### Step 3: Set Public Constraints

Configure verification requirements (public parameters):

```
Minimum Age: 18
Maximum Age: 99
Minimum Balance: 50
Allowed Countries: Argentina, USA, UK
```

### Step 4: Generate Proof

1. Click "Generate Proof"
2. Proof generation happens locally in browser (<1 second)
3. Progress indicator shows status
4. Proof and public signals displayed

### Step 5: Verify On-Chain

1. Click "Verify on [Network]"
2. Wallet prompts for transaction approval
3. Proof submitted to smart contract
4. Transaction hash displayed
5. Verification result shown (Valid/Invalid)

### Step 6: Multi-Chain Verification

1. Switch network using network selector
2. Click "Verify on [New Network]"
3. Same proof verified on different blockchain
4. Compare results across chains

## Code Examples

### Proof Generation Hook

```typescript
// hooks/useProofGeneration.ts
import { useState } from 'react';
import { ZKProver } from '@openzktool/sdk';

export function useProofGeneration() {
  const [loading, setLoading] = useState(false);
  const [proof, setProof] = useState(null);
  const [error, setError] = useState(null);

  const generateProof = async (inputs) => {
    setLoading(true);
    setError(null);

    try {
      const prover = new ZKProver({
        wasmPath: import.meta.env.VITE_CIRCUIT_WASM_PATH,
        zkeyPath: import.meta.env.VITE_CIRCUIT_ZKEY_PATH
      });

      await prover.initialize();

      const result = await prover.prove(inputs);
      setProof(result);

      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { generateProof, loading, proof, error };
}
```

### Wallet Connection

```typescript
// hooks/useWallet.ts
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import * as StellarSDK from '@stellar/stellar-sdk';

export function useWallet(network: 'evm' | 'stellar') {
  const [address, setAddress] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);

  const connectEVM = async () => {
    if (!window.ethereum) {
      throw new Error('MetaMask not installed');
    }

    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts'
    });

    setAddress(accounts[0]);
    setConnected(true);
  };

  const connectStellar = async () => {
    if (!window.freighter) {
      throw new Error('Freighter wallet not installed');
    }

    const publicKey = await window.freighter.getPublicKey();
    setAddress(publicKey);
    setConnected(true);
  };

  const connect = network === 'evm' ? connectEVM : connectStellar;

  return { address, connected, connect };
}
```

### On-Chain Verification

```typescript
// utils/contractInteraction.ts
import { EVMVerifier, StellarVerifier } from '@openzktool/sdk';

export async function verifyOnEVM(proof, publicSignals, provider, signer) {
  const verifier = new EVMVerifier({
    contractAddress: import.meta.env.VITE_EVM_VERIFIER_ADDRESS,
    provider,
    signer
  });

  const tx = await verifier.verify(proof, publicSignals);
  const receipt = await tx.wait();

  return {
    success: receipt.status === 1,
    transactionHash: receipt.transactionHash,
    gasUsed: receipt.gasUsed.toString()
  };
}

export async function verifyOnStellar(proof, publicSignals, server, keypair) {
  const verifier = new StellarVerifier({
    contractId: import.meta.env.VITE_STELLAR_CONTRACT_ID,
    network: 'testnet',
    server
  });

  const result = await verifier.verify(proof, publicSignals, keypair);

  return {
    success: result.success,
    transactionHash: result.transactionHash
  };
}
```

### ProofGenerator Component

```typescript
// components/ProofGenerator.tsx
import React, { useState } from 'react';
import { useProofGeneration } from '../hooks/useProofGeneration';

export function ProofGenerator({ onProofGenerated }) {
  const [inputs, setInputs] = useState({
    age: '',
    balance: '',
    countryId: '',
    minAge: 18,
    maxAge: 99,
    minBalance: 50,
    allowedCountries: [11, 1, 5]
  });

  const { generateProof, loading, error } = useProofGeneration();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await generateProof({
        age: parseInt(inputs.age),
        balance: parseInt(inputs.balance),
        countryId: parseInt(inputs.countryId),
        minAge: inputs.minAge,
        maxAge: inputs.maxAge,
        minBalance: inputs.minBalance,
        allowedCountries: inputs.allowedCountries
      });

      onProofGenerated(result);
    } catch (err) {
      console.error('Proof generation failed:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Private Information</h2>
      <p>This data will never be revealed on-chain</p>

      <input
        type="number"
        placeholder="Age"
        value={inputs.age}
        onChange={(e) => setInputs({ ...inputs, age: e.target.value })}
        required
      />

      <input
        type="number"
        placeholder="Balance"
        value={inputs.balance}
        onChange={(e) => setInputs({ ...inputs, balance: e.target.value })}
        required
      />

      <input
        type="number"
        placeholder="Country ID"
        value={inputs.countryId}
        onChange={(e) => setInputs({ ...inputs, countryId: e.target.value })}
        required
      />

      <h3>Public Constraints</h3>
      <p>These parameters will be visible on-chain</p>

      <input
        type="number"
        placeholder="Minimum Age"
        value={inputs.minAge}
        onChange={(e) => setInputs({ ...inputs, minAge: parseInt(e.target.value) })}
      />

      <input
        type="number"
        placeholder="Minimum Balance"
        value={inputs.minBalance}
        onChange={(e) => setInputs({ ...inputs, minBalance: parseInt(e.target.value) })}
      />

      <button type="submit" disabled={loading}>
        {loading ? 'Generating Proof...' : 'Generate Proof'}
      </button>

      {error && <p className="error">{error}</p>}
    </form>
  );
}
```

## Testing

### Unit Tests

```bash
npm run test:unit
```

Tests proof generation, wallet connection, and utility functions.

### Integration Tests

```bash
npm run test:integration
```

Tests full flow with mocked wallets and contracts.

### E2E Tests

```bash
npm run test:e2e
```

Tests complete user flow with Playwright.

## Deployment

### Deploy to Testnet

Update `.env` for testnet:

```bash
# Ethereum Sepolia
VITE_EVM_RPC_URL=https://rpc.ankr.com/eth_sepolia
VITE_EVM_CHAIN_ID=11155111
VITE_EVM_VERIFIER_ADDRESS=0x... # Deploy first

# Stellar Testnet
VITE_STELLAR_RPC_URL=https://soroban-testnet.stellar.org
VITE_STELLAR_NETWORK_PASSPHRASE="Test SDF Network ; September 2015"
VITE_STELLAR_CONTRACT_ID=C... # Deploy first
```

Build and deploy:

```bash
npm run build
npm run deploy
```

### Deploy to Production

```bash
# Build production bundle
npm run build

# Deploy to Vercel
vercel --prod

# Or use your preferred hosting
```

## Security Considerations

1. **Private inputs never leave the browser**
   - All proof generation happens client-side
   - Only proofs and public signals are transmitted

2. **Wallet security**
   - Always verify contract addresses
   - Check transaction details before signing
   - Use hardware wallets in production

3. **Input validation**
   - Validate all user inputs
   - Check ranges before proof generation
   - Handle errors gracefully

4. **Network verification**
   - Verify network IDs match expectations
   - Check contract addresses on each network
   - Confirm transaction success

## Troubleshooting

### "Proof generation failed"

- Check that circuit artifacts are loaded correctly
- Verify WASM path in environment variables
- Ensure browser supports WebAssembly

### "Wallet connection failed"

- Install MetaMask or Freighter extension
- Check wallet is unlocked
- Verify correct network selected

### "Transaction failed"

- Ensure wallet has sufficient funds for gas/fees
- Check contract address is correct
- Verify proof is valid before submission

### "Network mismatch"

- Switch wallet to correct network
- Check RPC URLs in environment
- Verify chain IDs match configuration

## Performance

Expected performance metrics:

- Proof generation: <1 second
- Proof size: ~800 bytes
- EVM verification: ~250,000 gas (~$5 at 20 gwei)
- Stellar verification: ~2,000,000 stroops (~$0.20)
- Page load time: <2 seconds (with code splitting)

## Further Reading

- [SDK Integration Guide](../../docs/sdk_guide.md)
- [Architecture Overview](../../docs/architecture/overview.md)
- [Testing Strategy](../../docs/testing/TESTING_STRATEGY.md)
- [Multi-Chain Support](../../docs/architecture/PLATFORM_INDEPENDENCE.md)

## Support

Issues: https://github.com/xcapit/stellar-privacy-poc/issues

## License

AGPL-3.0-or-later
