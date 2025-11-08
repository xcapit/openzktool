---
sidebar_position: 0
---

# API Reference Overview

Complete API documentation for OpenZKTool proof generation, verification, and Stellar Soroban integration.

## Available APIs

### Command Line Interface (CLI)

The fastest way to generate and verify proofs locally.

```bash
npm run prove -- input.json
npm run verify
npm run demo:soroban
```

[CLI Documentation →](./cli)

### JavaScript/TypeScript SDK (Coming Soon)

Programmatic proof generation for web and Node.js applications.

```typescript
import { KYCTransfer } from '@openzktool/sdk';
const proof = await KYCTransfer.generateProof(inputs);
```

[SDK Documentation →](./sdk)

### Soroban Smart Contract API

On-chain verification interface for Stellar smart contracts.

```rust
let result: bool = env.invoke_contract(
    &verifier_address,
    &symbol_short!("verify"),
    (&proof,).into_val(&env)
);
```

[Contract API →](./contract-api)

### REST API (Coming Soon)

HTTP endpoints for proof generation and verification services.

```bash
POST /api/v1/proofs
GET  /api/v1/proofs/{id}/verify
```

[REST API Documentation →](./rest-api)

## Quick Start

### Generate a Proof

**Using CLI:**

```bash
cd openzktool

# Create input file
cat > my_proof.json << EOF
{
  "age": "25",
  "balance": "1000",
  "country": "1",
  "minAge": "18",
  "maxAge": "99",
  "minBalance": "100",
  "allowedCountries": ["1", "2", "3", "0", "0", "0", "0", "0", "0", "0"]
}
EOF

# Generate proof
npm run prove -- my_proof.json
```

**Output:**
- `circuits/build/proof.json` - The ZK proof
- `circuits/build/public.json` - Public inputs

### Verify a Proof

**Local verification:**

```bash
snarkjs groth16 verify \
  circuits/build/verification_key.json \
  circuits/build/public.json \
  circuits/build/proof.json
```

**On-chain verification (Stellar Soroban):**

```bash
npm run demo:soroban
```

## API Patterns

### Pattern 1: Client-Side Generation

Generate proofs in the browser for maximum privacy.

```typescript
// User's browser
const proof = await generateProof({
  age: 25,        // Never sent to server
  balance: 1000,  // Stays on client
  country: 1,     // Private
  ...
});

// Submit only the proof
await fetch('/api/verify', {
  method: 'POST',
  body: JSON.stringify({ proof })
});
```

### Pattern 2: Server-Side Generation

Generate proofs on your backend for simpler UX.

```typescript
// Your backend
app.post('/generate-proof', async (req, res) => {
  const { age, balance, country } = req.body;

  const proof = await generateProof({
    age,
    balance,
    country,
    minAge: 18,
    maxAge: 99,
    minBalance: 100,
    allowedCountries: [1, 2, 3, 0, 0, 0, 0, 0, 0, 0]
  });

  res.json({ proof });
});
```

### Pattern 3: Hybrid Approach

Generate locally, verify both locally and on-chain.

```typescript
// 1. Generate on client
const proof = await generateProof(privateData);

// 2. Quick local verification
const localValid = await verifyLocally(proof);

// 3. On-chain verification for consensus
if (localValid) {
  const onChainValid = await verifySoroban(proof);
}
```

## Common Parameters

All proof generation functions accept similar parameters:

### Private Inputs (Hidden)

| Parameter | Type | Description |
|-----------|------|-------------|
| `age` | number/string | User's actual age |
| `balance` | number/string | User's actual balance |
| `country` | number/string | User's country ID |

### Public Inputs (Constraints)

| Parameter | Type | Description |
|-----------|------|-------------|
| `minAge` | number/string | Minimum allowed age |
| `maxAge` | number/string | Maximum allowed age |
| `minBalance` | number/string | Minimum required balance |
| `allowedCountries` | array[10] | Whitelisted country IDs |

### Output

| Field | Type | Description |
|-------|------|-------------|
| `proof` | object | Groth16 proof (pi_a, pi_b, pi_c) |
| `publicSignals` | array | Public outputs [kycValid] |

## Error Handling

All APIs use consistent error codes:

| Code | Description | Resolution |
|------|-------------|------------|
| `INVALID_INPUT` | Input doesn't satisfy constraints | Check min/max ranges |
| `WITNESS_GENERATION_FAILED` | Circuit compilation error | Verify input format |
| `PROOF_INVALID` | Verification failed | Regenerate proof |
| `CONTRACT_ERROR` | Soroban contract issue | Check contract address |

### Example Error Response

```json
{
  "error": {
    "code": "INVALID_INPUT",
    "message": "Age 15 is below minimum 18",
    "field": "age"
  }
}
```

## Rate Limits (REST API)

When using the hosted REST API:

| Tier | Requests/min | Requests/day |
|------|--------------|--------------|
| Free | 10 | 1,000 |
| Developer | 100 | 50,000 |
| Enterprise | Unlimited | Unlimited |

## Authentication (REST API)

REST API endpoints require API keys:

```bash
curl -X POST https://api.openzktool.com/v1/proofs \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"age": "25", ...}'
```

## Versioning

OpenZKTool follows semantic versioning:

- **CLI:** Current version in `package.json`
- **SDK:** `@openzktool/sdk@1.x.x`
- **REST API:** Versioned endpoints `/api/v1/...`
- **Smart Contracts:** Immutable on-chain

## Migration Guides

### Upgrading from v0.x to v1.x

```diff
- import { generateProof } from 'openzktool';
+ import { KYCTransfer } from '@openzktool/sdk';

- const proof = generateProof(inputs);
+ const proof = await KYCTransfer.generateProof(inputs);
```

## Support & Community

- **GitHub Issues:** Bug reports and feature requests
- **Discussions:** General questions and ideas
- **Discord:** Real-time community support (coming soon)

## Next Steps

- **[CLI Reference →](./cli)** - Command line usage
- **[SDK Documentation →](./sdk)** - JavaScript/TypeScript API
- **[Contract API →](./contract-api)** - Soroban integration

---

**Questions?** [GitHub Discussions](https://github.com/xcapit/openzktool/discussions)
