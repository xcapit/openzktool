---
sidebar_position: 2
---

# SDK Reference

Complete JavaScript/TypeScript SDK for integrating OpenZKTool into your applications.

## Installation

```bash
npm install openzktool
```

Or with yarn:

```bash
yarn add openzktool
```

## Quick Start

```typescript
import { ProofGenerator, ProofVerifier } from 'openzktool';

// Generate a proof
const generator = new ProofGenerator();
const proof = await generator.generate({
  age: 25,
  balance: 1000,
  country: 1,
  minAge: 18,
  maxAge: 99,
  minBalance: 100,
  allowedCountries: [1, 2, 3, 0, 0, 0, 0, 0, 0, 0]
});

// Verify locally
const verifier = new ProofVerifier();
const isValid = await verifier.verify(proof);
console.log('Proof valid:', isValid);
```

## Core API

### ProofGenerator

Generate zero-knowledge proofs from input data.

#### Constructor

```typescript
new ProofGenerator(options?: GeneratorOptions)
```

**Options:**

```typescript
interface GeneratorOptions {
  wasmPath?: string;        // Path to circuit WASM file
  zkeyPath?: string;        // Path to proving key
  verbose?: boolean;        // Enable detailed logging
}
```

**Example:**

```typescript
const generator = new ProofGenerator({
  wasmPath: './circuits/build/kyc_transfer.wasm',
  zkeyPath: './circuits/build/kyc_transfer_final.zkey',
  verbose: true
});
```

#### generate()

Generate a proof from input data.

```typescript
async generate(input: CircuitInput): Promise<Proof>
```

**Parameters:**

```typescript
interface CircuitInput {
  // Private inputs
  age: number;
  balance: number;
  country: number;

  // Public inputs
  minAge: number;
  maxAge: number;
  minBalance: number;
  allowedCountries: number[];  // Array of 10 country codes
}
```

**Returns:**

```typescript
interface Proof {
  proof: {
    pi_a: string[];      // G1 point [x, y]
    pi_b: string[][];    // G2 point [[x1, x2], [y1, y2]]
    pi_c: string[];      // G1 point [x, y]
    protocol: string;    // "groth16"
    curve: string;       // "bn128"
  };
  publicSignals: string[];  // Public outputs [kycValid]
}
```

**Example:**

```typescript
try {
  const proof = await generator.generate({
    age: 25,
    balance: 1000,
    country: 1,
    minAge: 18,
    maxAge: 99,
    minBalance: 100,
    allowedCountries: [1, 2, 3, 0, 0, 0, 0, 0, 0, 0]
  });

  console.log('KYC Valid:', proof.publicSignals[0] === '1');
  console.log('Proof size:', JSON.stringify(proof).length, 'bytes');
} catch (error) {
  console.error('Proof generation failed:', error);
}
```

**Throws:**

- `Error` - If witness generation fails (constraint violation)
- `Error` - If WASM or zkey files are missing
- `Error` - If input format is invalid

#### generateWitness()

Generate witness without computing proof (useful for debugging).

```typescript
async generateWitness(input: CircuitInput): Promise<Uint8Array>
```

**Example:**

```typescript
const witness = await generator.generateWitness({
  age: 25,
  balance: 1000,
  country: 1,
  minAge: 18,
  maxAge: 99,
  minBalance: 100,
  allowedCountries: [1, 2, 3, 0, 0, 0, 0, 0, 0, 0]
});

console.log('Witness generated:', witness.length, 'bytes');
```

### ProofVerifier

Verify zero-knowledge proofs locally (off-chain).

#### Constructor

```typescript
new ProofVerifier(options?: VerifierOptions)
```

**Options:**

```typescript
interface VerifierOptions {
  vkeyPath?: string;    // Path to verification key
  verbose?: boolean;    // Enable detailed logging
}
```

**Example:**

```typescript
const verifier = new ProofVerifier({
  vkeyPath: './circuits/build/verification_key.json',
  verbose: true
});
```

#### verify()

Verify a proof against public inputs.

```typescript
async verify(proof: Proof): Promise<boolean>
```

**Example:**

```typescript
const isValid = await verifier.verify(proof);

if (isValid) {
  console.log('✓ Proof is valid');
  console.log('✓ User meets KYC requirements');
} else {
  console.log('✗ Proof is invalid');
}
```

**Returns:**

- `true` - Proof is valid
- `false` - Proof is invalid or malformed

#### verifyWithPublicInputs()

Verify proof with explicit public inputs.

```typescript
async verifyWithPublicInputs(
  proof: ProofData,
  publicInputs: string[]
): Promise<boolean>
```

**Example:**

```typescript
const isValid = await verifier.verifyWithPublicInputs(
  proof.proof,
  ['1']  // kycValid = 1
);
```

### SorobanVerifier

Verify proofs on Stellar Soroban (on-chain).

#### Constructor

```typescript
new SorobanVerifier(options: SorobanOptions)
```

**Options:**

```typescript
interface SorobanOptions {
  contractId: string;          // Contract address
  network: 'testnet' | 'mainnet';
  rpcUrl?: string;            // Custom RPC endpoint
  secretKey?: string;         // Stellar secret key (for transactions)
}
```

**Example:**

```typescript
import { SorobanVerifier } from 'openzktool';

const verifier = new SorobanVerifier({
  contractId: 'CBPBVJJW5NMV4UVEDKSR6UO4DRBNWRQEMYKRYZI3CW6YK3O7HAZA43OI',
  network: 'testnet',
  secretKey: 'SXXX...'  // Optional, required for submit()
});
```

#### verify()

Verify proof on Soroban (read-only simulation).

```typescript
async verify(proof: Proof): Promise<boolean>
```

**Example:**

```typescript
const isValid = await verifier.verify(proof);
console.log('On-chain verification:', isValid);
```

**Cost:** Free (simulation only, no transaction fees)

#### submit()

Submit proof to blockchain and get transaction result.

```typescript
async submit(proof: Proof): Promise<TransactionResult>
```

**Returns:**

```typescript
interface TransactionResult {
  success: boolean;
  txHash: string;
  ledger: number;
  result: boolean;      // Verification result
  cost: {
    fee: number;        // Fee in stroops
    operations: number; // CPU operations
  };
}
```

**Example:**

```typescript
try {
  const result = await verifier.submit(proof);

  console.log('Transaction:', result.txHash);
  console.log('Verification result:', result.result);
  console.log('Fee paid:', result.cost.fee / 1e7, 'XLM');
  console.log('Explorer:', `https://stellar.expert/explorer/testnet/tx/${result.txHash}`);
} catch (error) {
  console.error('Submission failed:', error);
}
```

**Throws:**

- `Error` - If secretKey is not provided
- `Error` - If account has insufficient XLM
- `Error` - If transaction fails

#### getContractInfo()

Get information about the deployed contract.

```typescript
async getContractInfo(): Promise<ContractInfo>
```

**Returns:**

```typescript
interface ContractInfo {
  contractId: string;
  wasmHash: string;
  network: string;
  publicKey: string;
}
```

**Example:**

```typescript
const info = await verifier.getContractInfo();
console.log('Contract ID:', info.contractId);
console.log('WASM hash:', info.wasmHash);
```

## Advanced Usage

### Custom Circuits

Use the SDK with your own custom circuits:

```typescript
import { ProofGenerator } from 'openzktool';

const generator = new ProofGenerator({
  wasmPath: './my_circuit.wasm',
  zkeyPath: './my_circuit_final.zkey'
});

const proof = await generator.generate({
  // Your circuit inputs
  creditScore: 750,
  minScore: 700
});
```

### Batch Proof Generation

Generate multiple proofs in parallel:

```typescript
const inputs = [
  { age: 25, balance: 1000, country: 1, ... },
  { age: 30, balance: 2000, country: 2, ... },
  { age: 35, balance: 3000, country: 3, ... }
];

const proofs = await Promise.all(
  inputs.map(input => generator.generate(input))
);

console.log(`Generated ${proofs.length} proofs`);
```

### Error Handling

Comprehensive error handling:

```typescript
import { ProofGenerator, ProofError } from 'openzktool';

try {
  const proof = await generator.generate(input);
} catch (error) {
  if (error instanceof ProofError) {
    switch (error.code) {
      case 'CONSTRAINT_VIOLATION':
        console.error('Input violates circuit constraints');
        console.error('Details:', error.constraint);
        break;
      case 'INVALID_INPUT':
        console.error('Invalid input format');
        break;
      case 'MISSING_FILES':
        console.error('Circuit files not found');
        console.error('Missing:', error.files);
        break;
      default:
        console.error('Unknown error:', error.message);
    }
  }
}
```

### React Integration

Use OpenZKTool in React applications:

```typescript
import { useState } from 'react';
import { ProofGenerator } from 'openzktool';

function KYCVerification() {
  const [proof, setProof] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateProof = async () => {
    setLoading(true);
    try {
      const generator = new ProofGenerator();
      const result = await generator.generate({
        age: 25,
        balance: 1000,
        country: 1,
        minAge: 18,
        maxAge: 99,
        minBalance: 100,
        allowedCountries: [1, 2, 3, 0, 0, 0, 0, 0, 0, 0]
      });
      setProof(result);
    } catch (error) {
      console.error('Failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={generateProof} disabled={loading}>
        {loading ? 'Generating...' : 'Generate Proof'}
      </button>
      {proof && <p>KYC Valid: {proof.publicSignals[0] === '1' ? '✓' : '✗'}</p>}
    </div>
  );
}
```

### Node.js Backend

Use in Express.js API:

```typescript
import express from 'express';
import { ProofGenerator, SorobanVerifier } from 'openzktool';

const app = express();
app.use(express.json());

const generator = new ProofGenerator();
const verifier = new SorobanVerifier({
  contractId: 'CBPBVJJW5NMV4UVEDKSR6UO4DRBNWRQEMYKRYZI3CW6YK3O7HAZA43OI',
  network: 'testnet'
});

app.post('/api/verify-kyc', async (req, res) => {
  try {
    // Generate proof (never expose private data!)
    const proof = await generator.generate(req.body);

    // Verify on Soroban
    const isValid = await verifier.verify(proof);

    res.json({
      success: true,
      kycValid: isValid,
      proof: proof  // Share proof with user
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log('API running on port 3000');
});
```

## TypeScript Types

Full TypeScript definitions are included:

```typescript
import type {
  CircuitInput,
  Proof,
  ProofData,
  TransactionResult,
  GeneratorOptions,
  VerifierOptions,
  SorobanOptions,
  ContractInfo
} from 'openzktool';
```

## Performance Optimization

### Preload WASM

Preload circuit WASM for faster proof generation:

```typescript
const generator = new ProofGenerator();

// Preload WASM (call once at startup)
await generator.preload();

// Subsequent proofs are faster
const proof1 = await generator.generate(input1);  // ~100ms
const proof2 = await generator.generate(input2);  // ~50ms
```

### Proof Caching

Cache proofs for identical inputs:

```typescript
import crypto from 'crypto';

const proofCache = new Map();

function getProofCacheKey(input: CircuitInput): string {
  return crypto.createHash('sha256')
    .update(JSON.stringify(input))
    .digest('hex');
}

async function generateCachedProof(input: CircuitInput): Promise<Proof> {
  const cacheKey = getProofCacheKey(input);

  if (proofCache.has(cacheKey)) {
    return proofCache.get(cacheKey);
  }

  const proof = await generator.generate(input);
  proofCache.set(cacheKey, proof);
  return proof;
}
```

## Testing

Write tests for your ZK integrations:

```typescript
import { ProofGenerator, ProofVerifier } from 'openzktool';
import { describe, it, expect } from 'vitest';

describe('KYC Proof Generation', () => {
  const generator = new ProofGenerator();
  const verifier = new ProofVerifier();

  it('should generate valid proof for eligible user', async () => {
    const proof = await generator.generate({
      age: 25,
      balance: 1000,
      country: 1,
      minAge: 18,
      maxAge: 99,
      minBalance: 100,
      allowedCountries: [1, 2, 3, 0, 0, 0, 0, 0, 0, 0]
    });

    expect(proof.publicSignals[0]).toBe('1');  // kycValid = 1

    const isValid = await verifier.verify(proof);
    expect(isValid).toBe(true);
  });

  it('should reject underage user', async () => {
    const proof = await generator.generate({
      age: 16,  // Below minimum
      balance: 1000,
      country: 1,
      minAge: 18,
      maxAge: 99,
      minBalance: 100,
      allowedCountries: [1, 2, 3, 0, 0, 0, 0, 0, 0, 0]
    });

    expect(proof.publicSignals[0]).toBe('0');  // kycValid = 0
  });
});
```

## Troubleshooting

### Common Issues

**"WASM file not found"**

```typescript
// Explicitly specify paths
const generator = new ProofGenerator({
  wasmPath: path.resolve(__dirname, '../circuits/build/kyc_transfer.wasm'),
  zkeyPath: path.resolve(__dirname, '../circuits/build/kyc_transfer_final.zkey')
});
```

**"Invalid witness"**

Check that inputs satisfy constraints:

```typescript
// Age must be in range [minAge, maxAge]
// Balance must be >= minBalance
// Country must be in allowedCountries array
```

**"Out of memory"**

Increase Node.js heap size:

```bash
NODE_OPTIONS="--max-old-space-size=4096" node your-app.js
```

## API Limits

| Operation | Rate Limit | Notes |
|-----------|------------|-------|
| Proof generation | Unlimited | CPU-bound, local computation |
| Local verification | Unlimited | CPU-bound, local computation |
| Soroban simulation | 10/sec | Testnet RPC limit |
| Soroban submission | 1/sec | Recommended for testnet |

## Next Steps

- **[CLI Reference →](./cli)** - Command-line tools
- **[Contract API →](./contract-api)** - Soroban integration
- **[Examples →](../examples)** - Code samples

---

**Questions?** [GitHub Discussions](https://github.com/xcapit/openzktool/discussions)
