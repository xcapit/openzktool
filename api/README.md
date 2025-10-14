# API Documentation

> OpenAPI specification for OpenZKTool SDK and REST API

## 📁 Structure

```
api/
├── README.md
├── openapi.yml              # OpenAPI 3.0 specification
├── schemas/                 # JSON schemas
│   ├── proof.json
│   ├── circuit.json
│   └── verification.json
└── examples/                # Example requests/responses
    ├── generate_proof.json
    ├── verify_local.json
    └── verify_onchain.json
```

## 🚀 Quick Start

### View Documentation
```bash
# Install Swagger UI
npm install -g swagger-ui-watcher

# Serve documentation
swagger-ui-watcher api/openapi.yml
```

Visit: `http://localhost:8000`

### Validate Spec
```bash
npm install -g @apidevtools/swagger-cli

swagger-cli validate api/openapi.yml
```

## 📖 API Overview

OpenZKTool provides both:
1. **TypeScript SDK** - Direct integration
2. **REST API** - HTTP endpoints (future)

### Base URL
```
SDK: import { OpenZKTool } from '@openzktool/sdk'
REST: https://api.openzktool.com/v1 (planned)
```

## 🔧 SDK Methods

### 1. Generate Proof

Generate a zero-knowledge proof from circuit inputs.

**TypeScript:**
```typescript
const { proof, publicSignals } = await zktool.generateProof({
  age: 25,
  balance: 150,
  country: 32,
  minAge: 18,
  minBalance: 50,
  allowedCountries: [11, 1, 5, 32]
});
```

**REST API (Planned):**
```http
POST /api/v1/proof/generate
Content-Type: application/json

{
  "age": 25,
  "balance": 150,
  "country": 32,
  "minAge": 18,
  "minBalance": 50,
  "allowedCountries": [11, 1, 5, 32]
}
```

**Response:**
```json
{
  "proof": {
    "pi_a": ["0x...", "0x..."],
    "pi_b": [["0x...", "0x..."], ["0x...", "0x..."]],
    "pi_c": ["0x...", "0x..."],
    "protocol": "groth16",
    "curve": "bn128"
  },
  "publicSignals": ["1"]
}
```

---

### 2. Verify Proof Locally

Verify a proof off-chain without blockchain interaction.

**TypeScript:**
```typescript
const isValid = await zktool.verifyLocal(proof, publicSignals);
```

**REST API (Planned):**
```http
POST /api/v1/proof/verify
Content-Type: application/json

{
  "proof": { ... },
  "publicSignals": ["1"]
}
```

**Response:**
```json
{
  "valid": true,
  "verifiedAt": "2025-01-14T12:00:00Z"
}
```

---

### 3. Verify Proof On-Chain

Verify a proof on a blockchain (EVM or Soroban).

**TypeScript:**
```typescript
// EVM
const result = await zktool.verifyOnChain(proof, {
  chain: 'ethereum',
  contractAddress: '0x...',
  network: 'sepolia'
});

// Soroban
const result = await zktool.verifyOnChain(proof, {
  chain: 'stellar',
  contractId: 'CBPBVJJW...',
  network: 'testnet'
});
```

**REST API (Planned):**
```http
POST /api/v1/proof/verify-onchain
Content-Type: application/json

{
  "proof": { ... },
  "publicSignals": ["1"],
  "chain": "ethereum",
  "contractAddress": "0x...",
  "network": "sepolia"
}
```

**Response:**
```json
{
  "valid": true,
  "txHash": "0x...",
  "blockNumber": 12345,
  "gasUsed": 245673,
  "verifiedAt": "2025-01-14T12:00:00Z"
}
```

---

### 4. Get Contract Info

Get information about deployed verifier contracts.

**TypeScript:**
```typescript
// EVM
const info = await evmContract.getInfo();

// Soroban
const version = await sorobanContract.getVersion();
```

**REST API (Planned):**
```http
GET /api/v1/contracts/ethereum/0x...
GET /api/v1/contracts/stellar/CBPBVJJW...
```

**Response:**
```json
{
  "chain": "ethereum",
  "address": "0x...",
  "network": "sepolia",
  "version": 4,
  "deployed": true,
  "deployedAt": "2025-01-01T00:00:00Z"
}
```

---

## 📊 Data Models

### Proof
```json
{
  "pi_a": ["string", "string"],
  "pi_b": [["string", "string"], ["string", "string"]],
  "pi_c": ["string", "string"],
  "protocol": "groth16",
  "curve": "bn128"
}
```

### Circuit Inputs
```json
{
  "age": "number",
  "balance": "number",
  "country": "number",
  "minAge": "number",
  "minBalance": "number",
  "allowedCountries": ["number"]
}
```

### Chain Options
```json
{
  "chain": "ethereum | stellar | polygon | arbitrum | optimism",
  "contractAddress": "string (for EVM)",
  "contractId": "string (for Soroban)",
  "network": "mainnet | testnet"
}
```

### Verification Result
```json
{
  "valid": "boolean",
  "txHash": "string (on-chain only)",
  "blockNumber": "number (on-chain only)",
  "gasUsed": "number (EVM only)",
  "computeUnits": "number (Soroban only)",
  "verifiedAt": "string (ISO 8601)"
}
```

---

## 🔐 Authentication (Planned)

Future REST API will support:

```http
Authorization: Bearer YOUR_API_KEY
```

Get API keys at: https://dashboard.openzktool.com (planned)

---

## ⚠️ Error Responses

### 400 Bad Request
```json
{
  "error": "InvalidInput",
  "message": "Age must be a positive number",
  "details": {
    "field": "age",
    "value": -5
  }
}
```

### 404 Not Found
```json
{
  "error": "ContractNotFound",
  "message": "Contract not found at address 0x...",
  "details": {
    "address": "0x...",
    "network": "sepolia"
  }
}
```

### 500 Internal Server Error
```json
{
  "error": "ProofGenerationFailed",
  "message": "Failed to generate proof",
  "details": {
    "reason": "Circuit file not found"
  }
}
```

---

## 📈 Rate Limits (Planned)

| Tier | Requests/min | Requests/day |
|------|-------------|--------------|
| Free | 10 | 1,000 |
| Pro | 100 | 100,000 |
| Enterprise | Unlimited | Unlimited |

---

## 🔗 Interactive Documentation

### Swagger UI
```bash
npm run docs:serve
```

Visit: http://localhost:8000

### Redoc
```bash
npm run docs:redoc
```

### Postman Collection
Import `api/openapi.yml` into Postman for testing.

---

## 🧪 Testing API

### cURL Examples
```bash
# Generate proof
curl -X POST https://api.openzktool.com/v1/proof/generate \
  -H "Content-Type: application/json" \
  -d '{"age": 25, "balance": 150, "country": 32}'

# Verify proof
curl -X POST https://api.openzktool.com/v1/proof/verify \
  -H "Content-Type: application/json" \
  -d '{"proof": {...}, "publicSignals": ["1"]}'
```

### JavaScript Examples
```javascript
const response = await fetch('https://api.openzktool.com/v1/proof/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    age: 25,
    balance: 150,
    country: 32
  })
});

const { proof, publicSignals } = await response.json();
```

---

## 📝 Changelog

### v1.0.0 (Planned)
- Initial API specification
- Proof generation endpoint
- Local verification endpoint
- On-chain verification endpoint
- Multi-chain support

---

## 🔗 Related Documentation

- [OpenAPI Specification](https://swagger.io/specification/)
- [SDK Documentation](../sdk/README.md)
- [Integration Examples](../examples/README.md)

---

**Status:** 🚧 Specification created - REST API implementation planned for future phase
