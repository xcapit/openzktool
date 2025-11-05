# SDK Integration Guide

Complete guide for integrating OpenZKTool into your application.

## Prerequisites

- Node.js 18+ or browser with WASM support
- Basic understanding of Zero-Knowledge Proofs
- Familiarity with async/await JavaScript

## Installation

```bash
npm install @openzktool/sdk
# or
yarn add @openzktool/sdk
```

## Basic Usage

### 1. Initialize the Prover

The prover handles witness generation and proof creation.

```typescript
import { ZKProver } from '@openzktool/sdk';

const prover = new ZKProver({
  wasmPath: './circuits/kyc_transfer.wasm',
  zkeyPath: './circuits/kyc_transfer_final.zkey'
});

await prover.initialize();
```

**Circuit artifacts location:**
- `kyc_transfer.wasm`: Circuit compiled to WebAssembly
- `kyc_transfer_final.zkey`: Proving key from trusted setup

### 2. Generate a Proof

```typescript
const inputs = {
  // Private inputs (never revealed)
  age: 25,
  balance: 150,
  countryId: 11,

  // Public parameters
  minAge: 18,
  maxAge: 99,
  minBalance: 50,
  allowedCountries: [11, 1, 5]
};

const { proof, publicSignals } = await prover.prove(inputs);

console.log('Proof generated:', proof);
console.log('Public output (kycValid):', publicSignals[0]); // 1 if valid, 0 if not
```

**Proof structure:**
```typescript
{
  pi_a: [string, string, string],
  pi_b: [[string, string], [string, string], [string, string]],
  pi_c: [string, string, string],
  protocol: "groth16",
  curve: "bn128"
}
```

### 3. Verify Locally (Off-Chain)

Useful for testing before submitting on-chain.

```typescript
import { Verifier } from '@openzktool/sdk';

const verifier = new Verifier({
  vkeyPath: './circuits/verification_key.json'
});

const isValid = await verifier.verifyLocal(proof, publicSignals);
console.log('Proof valid:', isValid);
```

### 4. Verify On-Chain

#### Ethereum/EVM Chains

```typescript
import { EVMVerifier } from '@openzktool/sdk';
import { ethers } from 'ethers';

// Connect to provider
const provider = new ethers.providers.JsonRpcProvider('https://rpc.ankr.com/eth_sepolia');
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

// Initialize verifier
const evmVerifier = new EVMVerifier({
  contractAddress: '0x1234567890abcdef1234567890abcdef12345678',
  provider: provider,
  signer: wallet
});

// Submit verification transaction
const tx = await evmVerifier.verify(proof, publicSignals);
await tx.wait();

console.log('Verification tx:', tx.hash);
```

**Gas estimation:**
```typescript
const gasEstimate = await evmVerifier.estimateGas(proof, publicSignals);
console.log('Estimated gas:', gasEstimate.toString()); // ~250,000 gas
```

#### Stellar/Soroban

```typescript
import { StellarVerifier } from '@openzktool/sdk';
import * as StellarSDK from '@stellar/stellar-sdk';

// Connect to network
const server = new StellarSDK.SorobanRpc.Server('https://soroban-testnet.stellar.org');
const sourceKeypair = StellarSDK.Keypair.fromSecret(process.env.STELLAR_SECRET);

// Initialize verifier
const stellarVerifier = new StellarVerifier({
  contractId: 'CBPBVJJW5NMV4UVEDKSR6UO4DRBNWRQEMYKRYZI3CW6YK3O7HAZA43OI',
  network: 'testnet',
  server: server
});

// Submit verification
const result = await stellarVerifier.verify(proof, publicSignals, sourceKeypair);
console.log('Verification result:', result.success);
```

## Advanced Usage

### Custom Circuit Inputs

If you're using a custom circuit, define your input types:

```typescript
interface MyCircuitInputs {
  privateValue: number;
  privateSecret: number;
  publicConstraint: number;
}

const customInputs: MyCircuitInputs = {
  privateValue: 42,
  privateSecret: 12345,
  publicConstraint: 100
};

const { proof, publicSignals } = await prover.prove(customInputs);
```

### Input Validation

Always validate inputs before proof generation:

```typescript
import { validateInputs } from '@openzktool/sdk/utils';

try {
  validateInputs(inputs, {
    age: { min: 0, max: 150 },
    balance: { min: 0, max: 1000000 },
    countryId: { min: 1, max: 249 }
  });
} catch (error) {
  console.error('Invalid inputs:', error.message);
}
```

### Format Conversion

Convert proof to Solidity calldata format:

```typescript
import { toSolidityCalldata } from '@openzktool/sdk/utils';

const calldata = toSolidityCalldata(proof, publicSignals);
// Use with web3.js or ethers.js contract calls
```

### Error Handling

```typescript
try {
  const { proof, publicSignals } = await prover.prove(inputs);
} catch (error) {
  if (error.code === 'CIRCUIT_CONSTRAINT_FAILED') {
    console.error('Input constraints not satisfied');
  } else if (error.code === 'WITNESS_GENERATION_FAILED') {
    console.error('Failed to generate witness');
  } else {
    console.error('Unknown error:', error);
  }
}
```

## Browser Integration

### Using with React

```typescript
import { useState, useEffect } from 'react';
import { ZKProver } from '@openzktool/sdk';

function ProofGenerator() {
  const [prover, setProver] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function init() {
      const p = new ZKProver({
        wasmPath: '/circuits/kyc_transfer.wasm',
        zkeyPath: '/circuits/kyc_transfer_final.zkey'
      });
      await p.initialize();
      setProver(p);
    }
    init();
  }, []);

  const generateProof = async (inputs) => {
    setLoading(true);
    try {
      const { proof, publicSignals } = await prover.prove(inputs);
      console.log('Proof:', proof);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={() => generateProof(myInputs)} disabled={loading || !prover}>
        {loading ? 'Generating...' : 'Generate Proof'}
      </button>
    </div>
  );
}
```

### Webpack Configuration

If using Webpack, add WASM support:

```javascript
// webpack.config.js
module.exports = {
  experiments: {
    asyncWebAssembly: true
  },
  module: {
    rules: [
      {
        test: /\.wasm$/,
        type: 'webassembly/async'
      }
    ]
  }
};
```

## Node.js Backend Integration

### Express.js API

```typescript
import express from 'express';
import { ZKProver, Verifier } from '@openzktool/sdk';

const app = express();
app.use(express.json());

// Initialize once at startup
const prover = new ZKProver({
  wasmPath: './circuits/kyc_transfer.wasm',
  zkeyPath: './circuits/kyc_transfer_final.zkey'
});
await prover.initialize();

const verifier = new Verifier({
  vkeyPath: './circuits/verification_key.json'
});

// Proof generation endpoint
app.post('/api/generate-proof', async (req, res) => {
  try {
    const inputs = req.body;
    const { proof, publicSignals } = await prover.prove(inputs);
    res.json({ proof, publicSignals });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Local verification endpoint
app.post('/api/verify-proof', async (req, res) => {
  try {
    const { proof, publicSignals } = req.body;
    const isValid = await verifier.verifyLocal(proof, publicSignals);
    res.json({ valid: isValid });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.listen(3000);
```

### Rate Limiting

```typescript
import rateLimit from 'express-rate-limit';

const proofLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 proofs per window
  message: 'Too many proof generation requests'
});

app.post('/api/generate-proof', proofLimiter, async (req, res) => {
  // ... proof generation
});
```

## Multi-Chain Verification

Verify the same proof on multiple chains:

```typescript
import { EVMVerifier, StellarVerifier } from '@openzktool/sdk';

async function verifyMultiChain(proof, publicSignals) {
  // Verify on Ethereum
  const evmVerifier = new EVMVerifier({
    contractAddress: '0x...',
    provider
  });
  const evmResult = await evmVerifier.verify(proof, publicSignals);

  // Verify on Stellar
  const stellarVerifier = new StellarVerifier({
    contractId: 'CBPB...',
    network: 'testnet'
  });
  const stellarResult = await stellarVerifier.verify(proof, publicSignals, keypair);

  return {
    ethereum: evmResult.success,
    stellar: stellarResult.success
  };
}
```

## Performance Optimization

### Prover Initialization

Initialize prover once and reuse:

```typescript
// Good: Initialize once
const prover = new ZKProver(config);
await prover.initialize();

for (const input of inputs) {
  await prover.prove(input); // Reuse initialized prover
}

// Bad: Initialize every time
for (const input of inputs) {
  const prover = new ZKProver(config);
  await prover.initialize(); // Slow!
  await prover.prove(input);
}
```

### Batch Processing

Process multiple proofs in parallel:

```typescript
const proofs = await Promise.all(
  inputArray.map(input => prover.prove(input))
);
```

### Memory Management

For long-running processes, explicitly clean up:

```typescript
await prover.cleanup();
```

## Testing

### Unit Tests

```typescript
import { ZKProver, Verifier } from '@openzktool/sdk';

describe('Proof Generation', () => {
  let prover, verifier;

  beforeAll(async () => {
    prover = new ZKProver({
      wasmPath: './circuits/kyc_transfer.wasm',
      zkeyPath: './circuits/kyc_transfer_final.zkey'
    });
    await prover.initialize();

    verifier = new Verifier({
      vkeyPath: './circuits/verification_key.json'
    });
  });

  it('should generate valid proof for valid inputs', async () => {
    const inputs = {
      age: 25,
      balance: 150,
      countryId: 11,
      minAge: 18,
      maxAge: 99,
      minBalance: 50,
      allowedCountries: [11, 1, 5]
    };

    const { proof, publicSignals } = await prover.prove(inputs);
    expect(publicSignals[0]).toBe('1'); // kycValid = 1

    const isValid = await verifier.verifyLocal(proof, publicSignals);
    expect(isValid).toBe(true);
  });

  it('should generate invalid proof for invalid inputs', async () => {
    const inputs = {
      age: 15, // Below minAge
      balance: 150,
      countryId: 11,
      minAge: 18,
      maxAge: 99,
      minBalance: 50,
      allowedCountries: [11, 1, 5]
    };

    const { proof, publicSignals } = await prover.prove(inputs);
    expect(publicSignals[0]).toBe('0'); // kycValid = 0
  });
});
```

### Integration Tests

```typescript
describe('On-Chain Verification', () => {
  it('should verify proof on Stellar testnet', async () => {
    const stellarVerifier = new StellarVerifier({
      contractId: 'CBPBVJJW...',
      network: 'testnet'
    });

    const result = await stellarVerifier.verify(proof, publicSignals, keypair);
    expect(result.success).toBe(true);
  });
});
```

## Troubleshooting

### Common Issues

**Issue: "WASM module not found"**
```
Solution: Ensure WASM file path is correct and accessible
- Check wasmPath in config
- Verify file exists at specified location
- In browser, check that file is served correctly
```

**Issue: "Proving key mismatch"**
```
Solution: Ensure proving key matches circuit
- Regenerate trusted setup if circuit changed
- Verify zkeyPath points to correct .zkey file
```

**Issue: "Out of memory during proof generation"**
```
Solution: Increase Node.js heap size
node --max-old-space-size=4096 your-script.js
```

**Issue: "Transaction failed on-chain"**
```
Solution: Check gas/fee settings
- Estimate gas before submission
- Ensure wallet has sufficient balance
- Verify contract address is correct
```

### Debug Mode

Enable debug logging:

```typescript
const prover = new ZKProver({
  wasmPath: './circuits/kyc_transfer.wasm',
  zkeyPath: './circuits/kyc_transfer_final.zkey',
  debug: true
});

// Logs detailed information during proof generation
```

## Security Best Practices

1. **Never expose private inputs**
   - Private inputs should never be logged or transmitted unencrypted
   - Only share proofs and public signals

2. **Validate all inputs**
   - Check input ranges before proof generation
   - Sanitize user-provided data

3. **Use trusted setup from ceremony**
   - Never use test keys in production
   - Verify trusted setup parameters

4. **Secure key management**
   - Store private keys securely (environment variables, key management services)
   - Never commit keys to version control

5. **Verify proofs on-chain**
   - Don't rely solely on client-side verification
   - Always verify on smart contract for critical operations

## API Reference

See [API Documentation](./api/) for complete API reference.

### Core Classes

- `ZKProver`: Proof generation
- `Verifier`: Proof verification (local and on-chain)
- `EVMVerifier`: EVM-specific verification
- `StellarVerifier`: Soroban-specific verification

### Utility Functions

- `validateInputs(inputs, schema)`: Input validation
- `toSolidityCalldata(proof, publicSignals)`: Format conversion
- `estimateGas(proof)`: Gas estimation

## Examples

Complete integration examples:

- [Basic Proof Generation](../examples/1-basic-proof/)
- [React Integration](../examples/2-react-app/)
- [Node.js Backend](../examples/3-nodejs-backend/)
- [Stellar Integration](../examples/4-stellar-integration/)
- [Custom Circuit](../examples/5-custom-circuit/)

## Next Steps

1. Try the [Interactive Tutorial](./getting-started/interactive-tutorial.md)
2. Run the [Demo Scripts](./testing/demo-scripts.md)
3. Review [Architecture Documentation](./architecture/overview.md)
4. Explore [Testing Guide](./testing/README.md)

## Support

- GitHub Issues: https://github.com/xcapit/stellar-privacy-poc/issues
- Documentation: https://github.com/xcapit/stellar-privacy-poc/tree/main/docs
- FAQ: https://github.com/xcapit/stellar-privacy-poc/blob/main/docs/FAQ.md
