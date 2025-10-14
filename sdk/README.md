# @openzktool/sdk

> TypeScript SDK for OpenZKTool - Zero-Knowledge Proof toolkit for multi-chain privacy

⚠️ **Status:** Alpha - Structure only, implementation in progress

## 📦 Installation

```bash
npm install @openzktool/sdk
# or
yarn add @openzktool/sdk
```

## 🚀 Quick Start

```typescript
import { OpenZKTool } from '@openzktool/sdk';

// Initialize the SDK
const zktool = new OpenZKTool({
  network: 'testnet',
  circuitPath: './circuits/kyc_transfer.circom'
});

// Generate a proof
const proof = await zktool.generateProof({
  age: 25,
  balance: 150,
  country: 32
});

// Verify on-chain (Stellar)
const valid = await zktool.verifyOnChain(proof, {
  chain: 'stellar',
  contractId: 'CBPBVJJW...'
});

console.log('Proof valid:', valid);
```

## 📚 Documentation

### Prover

Generate zero-knowledge proofs:

```typescript
import { Prover } from '@openzktool/sdk';

const prover = new Prover({
  wasmPath: './kyc_transfer.wasm',
  zkeyPath: './kyc_transfer_final.zkey'
});

const { proof, publicSignals } = await prover.generateProof({
  age: 25,
  balance: 150,
  country: 32,
  minAge: 18,
  minBalance: 50,
  allowedCountries: [11, 1, 5, 32]
});
```

### Verifier

Verify proofs locally or on-chain:

```typescript
import { Verifier } from '@openzktool/sdk';

// Local verification
const verifier = new Verifier({
  vkeyPath: './verification_key.json'
});

const isValid = await verifier.verifyLocal(proof, publicSignals);

// On-chain verification (EVM)
const evmVerifier = new Verifier({
  chain: 'ethereum',
  contractAddress: '0x...',
  provider: ethersProvider
});

const result = await evmVerifier.verifyOnChain(proof, publicSignals);

// On-chain verification (Soroban)
const sorobanVerifier = new Verifier({
  chain: 'stellar',
  contractId: 'CBPBVJJW...',
  network: 'testnet'
});

const stellarResult = await sorobanVerifier.verifyOnChain(proof, publicSignals);
```

## 🏗️ Architecture

```
@openzktool/sdk
├── Prover          # Proof generation
├── Verifier        # Proof verification (local & on-chain)
├── Contracts       # Smart contract interactions
│   ├── EVM         # Ethereum/EVM chains
│   └── Soroban     # Stellar/Soroban
└── Utils           # Helper functions
```

## 🌐 Supported Chains

- ✅ Ethereum (EVM)
- ✅ Stellar (Soroban)
- ⏳ Polygon
- ⏳ Arbitrum
- ⏳ Optimism

## 📖 API Reference

### `OpenZKTool`

Main SDK class.

**Constructor:**
```typescript
new OpenZKTool(config: OpenZKToolConfig)
```

**Methods:**
- `generateProof(inputs: ProofInputs): Promise<Proof>`
- `verifyLocal(proof: Proof, publicSignals: PublicSignals): Promise<boolean>`
- `verifyOnChain(proof: Proof, options: ChainOptions): Promise<boolean>`

### `Prover`

Proof generation utilities.

**Methods:**
- `generateProof(inputs: CircuitInputs): Promise<{ proof: Proof, publicSignals: PublicSignals }>`
- `exportSolidityCallData(proof: Proof, publicSignals: PublicSignals): string`

### `Verifier`

Proof verification utilities.

**Methods:**
- `verifyLocal(proof: Proof, publicSignals: PublicSignals): Promise<boolean>`
- `verifyOnChain(proof: Proof, publicSignals: PublicSignals): Promise<boolean>`

### Types

```typescript
interface ProofInputs {
  age: number;
  balance: number;
  country: number;
  minAge?: number;
  minBalance?: number;
  allowedCountries?: number[];
}

interface Proof {
  pi_a: string[];
  pi_b: string[][];
  pi_c: string[];
  protocol: string;
  curve: string;
}

interface PublicSignals {
  kycValid: number;
}

interface ChainOptions {
  chain: 'ethereum' | 'stellar' | 'polygon';
  contractAddress?: string;    // EVM
  contractId?: string;          // Soroban
  network?: 'mainnet' | 'testnet';
}
```

## 🧪 Testing

```bash
npm test              # Run all tests
npm run test:watch    # Watch mode
npm run test:coverage # Coverage report
```

## 🛠️ Development

```bash
npm run build    # Build TypeScript
npm run lint     # Lint code
npm run format   # Format code
```

## 📝 Examples

See the [examples/](../examples/) directory for complete integration examples:

- [Basic Proof Generation](../examples/1-basic-proof/)
- [React Integration](../examples/2-react-app/)
- [Node.js Backend](../examples/3-nodejs-backend/)
- [Stellar Integration](../examples/4-stellar-integration/)

## 🤝 Contributing

See [CONTRIBUTING.md](../CONTRIBUTING.md) for development guidelines.

## 📄 License

AGPL-3.0-or-later

## 🔗 Links

- **Website:** https://openzktool.vercel.app
- **Documentation:** https://github.com/xcapit/stellar-privacy-poc/tree/main/docs
- **Issues:** https://github.com/xcapit/stellar-privacy-poc/issues

---

**⚠️ Note:** This SDK is in alpha stage. Structure is complete but implementation is in progress. Not recommended for production use.
