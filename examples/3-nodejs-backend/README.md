# Example 3: Node.js Backend API

> REST API for proof generation and verification

**Status:** Structure only - Implementation coming in next phase

---

## 📖 What You'll Learn

- Building a REST API for ZK proofs
- Database persistence (SQLite)
- Rate limiting and validation
- API authentication
- Error handling

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start server
npm start

# Start in development mode
npm run dev
```

---

## 📁 Project Structure

```
3-nodejs-backend/
├── README.md
├── package.json
├── src/
│   ├── server.ts          # Express server
│   ├── routes/
│   │   ├── proof.ts       # Proof endpoints
│   │   └── verify.ts      # Verification endpoints
│   ├── controllers/
│   │   ├── proofController.ts
│   │   └── verifyController.ts
│   ├── middleware/
│   │   ├── auth.ts
│   │   ├── rateLimit.ts
│   │   └── validator.ts
│   ├── services/
│   │   └── proofService.ts
│   ├── db/
│   │   └── database.ts
│   └── types/
│       └── api.ts
└── test/
    └── api.test.ts
```

---

## 🌐 API Endpoints

### POST /api/proof/generate

Generate a zero-knowledge proof.

**Request:**
```json
{
  "age": 25,
  "balance": 150,
  "country": 32
}
```

**Response:**
```json
{
  "success": true,
  "proof": { ... },
  "publicSignals": { ... },
  "proofId": "abc123"
}
```

### POST /api/proof/verify

Verify a proof locally.

**Request:**
```json
{
  "proof": { ... },
  "publicSignals": { ... }
}
```

**Response:**
```json
{
  "success": true,
  "valid": true,
  "message": "Proof is valid"
}
```

### POST /api/proof/verify-onchain

Verify a proof on-chain.

**Request:**
```json
{
  "proofId": "abc123",
  "chain": "ethereum",
  "network": "sepolia"
}
```

**Response:**
```json
{
  "success": true,
  "valid": true,
  "txHash": "0x...",
  "gasUsed": 250000
}
```

---

## 💻 Implementation Example

```typescript
import express from 'express';
import { OpenZKTool } from '@openzktool/sdk';

const app = express();
app.use(express.json());

const zktool = new OpenZKTool({
  wasmPath: './circuits/kyc_transfer.wasm',
  zkeyPath: './circuits/kyc_transfer_final.zkey'
});

app.post('/api/proof/generate', async (req, res) => {
  try {
    const { age, balance, country } = req.body;

    // Validate inputs
    if (!age || !balance || !country) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Generate proof
    const { proof, publicSignals } = await zktool.generateProof({
      age,
      balance,
      country,
      minAge: 18,
      minBalance: 50,
      allowedCountries: [11, 1, 5, 32]
    });

    // Save to database
    const proofId = await saveProof(proof, publicSignals);

    res.json({
      success: true,
      proof,
      publicSignals,
      proofId
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

---

## 🧪 Testing

```bash
npm test                # Run tests
npm run test:integration # Integration tests
npm run test:e2e        # End-to-end tests
```

---

## 📚 Features

- - RESTful API design
- - Rate limiting
- - Input validation
- - Database persistence
- - Error handling
- - API documentation (OpenAPI)
- - Authentication (JWT)

---

## 🔗 Resources

- [Express.js Documentation](https://expressjs.com/)
- [SQLite Documentation](https://www.sqlite.org/)
- [OpenAPI Specification](https://swagger.io/specification/)
