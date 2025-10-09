# ⚙️ Node.js Backend Example

**Express.js API server with ZK proof verification**

---

## 🎯 What This Demonstrates

- ✅ REST API for proof submission
- ✅ Server-side proof verification
- ✅ Database integration (SQLite)
- ✅ Rate limiting and input validation
- ✅ Multi-chain verification endpoints
- ✅ JWT authentication integration

**Use case:** Backend service for privacy-preserving KYC/authentication

---

## 🚀 Quick Start

```bash
cd examples/nodejs-backend
npm install
npm start
```

**API available at:** http://localhost:3001

---

## 📂 Project Structure

```
nodejs-backend/
├── src/
│   ├── server.js           # Express app setup
│   ├── routes/
│   │   ├── proof.js        # Proof submission endpoints
│   │   └── verify.js       # Verification endpoints
│   ├── services/
│   │   ├── zkproof.js      # ZK proof verification logic
│   │   ├── ethereum.js     # EVM verification
│   │   └── stellar.js      # Soroban verification
│   ├── db/
│   │   └── database.js     # SQLite database
│   └── middleware/
│       ├── rateLimit.js    # Rate limiting
│       └── validator.js    # Input validation
├── data/
│   ├── kyc_transfer.wasm
│   ├── kyc_transfer_final.zkey
│   └── kyc_transfer_vkey.json
├── package.json
└── README.md
```

---

## 💻 API Endpoints

### 1. Generate Proof

**POST** `/api/proof/generate`

```bash
curl -X POST http://localhost:3001/api/proof/generate \
  -H "Content-Type: application/json" \
  -d '{
    "age": 25,
    "balance": 150,
    "country": 11,
    "minAge": 18,
    "minBalance": 50,
    "allowedCountries": [11, 1, 5]
  }'
```

**Response:**
```json
{
  "success": true,
  "proof": {
    "pi_a": ["123...", "456...", "1"],
    "pi_b": [["...", "..."], ["...", "..."], ["1", "0"]],
    "pi_c": ["789...", "012...", "1"],
    "protocol": "groth16",
    "curve": "bn128"
  },
  "publicSignals": ["1"],
  "kycValid": true
}
```

---

### 2. Verify Proof (Off-Chain)

**POST** `/api/proof/verify`

```bash
curl -X POST http://localhost:3001/api/proof/verify \
  -H "Content-Type: application/json" \
  -d '{
    "proof": { ... },
    "publicSignals": ["1"]
  }'
```

**Response:**
```json
{
  "success": true,
  "verified": true,
  "kycValid": true,
  "timestamp": "2025-01-10T12:00:00.000Z"
}
```

---

### 3. Verify On-Chain (Ethereum)

**POST** `/api/verify/ethereum`

```bash
curl -X POST http://localhost:3001/api/verify/ethereum \
  -H "Content-Type: application/json" \
  -d '{
    "proof": { ... },
    "publicSignals": ["1"]
  }'
```

**Response:**
```json
{
  "success": true,
  "txHash": "0x123...",
  "verified": true,
  "gasUsed": "234567"
}
```

---

### 4. Verify On-Chain (Stellar)

**POST** `/api/verify/stellar`

```bash
curl -X POST http://localhost:3001/api/verify/stellar \
  -H "Content-Type: application/json" \
  -d '{
    "proof": { ... },
    "publicSignals": ["1"]
  }'
```

**Response:**
```json
{
  "success": true,
  "txHash": "abc...",
  "verified": true
}
```

---

### 5. Get Verification Status

**GET** `/api/status/:userId`

```bash
curl http://localhost:3001/api/status/user123
```

**Response:**
```json
{
  "userId": "user123",
  "kycVerified": true,
  "verifiedAt": "2025-01-10T12:00:00.000Z",
  "chains": {
    "ethereum": true,
    "stellar": true
  }
}
```

---

## 💻 Core Implementation

### Server Setup

**File:** `src/server.js`

```javascript
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('./middleware/rateLimit');
const proofRoutes = require('./routes/proof');
const verifyRoutes = require('./routes/verify');
const { initDatabase } = require('./db/database');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(rateLimit);

// Routes
app.use('/api/proof', proofRoutes);
app.use('/api/verify', verifyRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: err.message || 'Internal server error'
  });
});

// Start server
(async () => {
  await initDatabase();
  app.listen(PORT, () => {
    console.log(`🚀 ZKPrivacy API server running on http://localhost:${PORT}`);
  });
})();

module.exports = app;
```

---

### Proof Generation Route

**File:** `src/routes/proof.js`

```javascript
const express = require('express');
const router = express.Router();
const { generateProof, verifyProof } = require('../services/zkproof');
const { validateProofInput } = require('../middleware/validator');

// Generate proof
router.post('/generate', validateProofInput, async (req, res, next) => {
  try {
    const { age, balance, country, minAge, minBalance, allowedCountries } = req.body;

    const input = {
      age,
      balance,
      country,
      minAge,
      minBalance,
      allowedCountries
    };

    const { proof, publicSignals } = await generateProof(input);

    res.json({
      success: true,
      proof,
      publicSignals,
      kycValid: publicSignals[0] === "1"
    });
  } catch (error) {
    next(error);
  }
});

// Verify proof (off-chain)
router.post('/verify', async (req, res, next) => {
  try {
    const { proof, publicSignals } = req.body;

    if (!proof || !publicSignals) {
      return res.status(400).json({
        success: false,
        error: 'Missing proof or publicSignals'
      });
    }

    const verified = await verifyProof(proof, publicSignals);

    res.json({
      success: true,
      verified,
      kycValid: publicSignals[0] === "1",
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
```

---

### ZK Proof Service

**File:** `src/services/zkproof.js`

```javascript
const snarkjs = require('snarkjs');
const fs = require('fs');
const path = require('path');

const WASM_PATH = path.join(__dirname, '../../data/kyc_transfer.wasm');
const ZKEY_PATH = path.join(__dirname, '../../data/kyc_transfer_final.zkey');
const VKEY_PATH = path.join(__dirname, '../../data/kyc_transfer_vkey.json');

// Cache verification key
let vKey = null;

async function loadVerificationKey() {
  if (!vKey) {
    const vKeyData = fs.readFileSync(VKEY_PATH, 'utf8');
    vKey = JSON.parse(vKeyData);
  }
  return vKey;
}

async function generateProof(input) {
  console.log('Generating proof for input:', {
    ...input,
    age: '[REDACTED]',
    balance: '[REDACTED]',
    country: '[REDACTED]'
  });

  const { proof, publicSignals } = await snarkjs.groth16.fullProve(
    input,
    WASM_PATH,
    ZKEY_PATH
  );

  console.log('Proof generated successfully');
  console.log('Public signals:', publicSignals);

  return { proof, publicSignals };
}

async function verifyProof(proof, publicSignals) {
  const vKey = await loadVerificationKey();

  const verified = await snarkjs.groth16.verify(vKey, publicSignals, proof);

  console.log('Verification result:', verified);

  return verified;
}

module.exports = {
  generateProof,
  verifyProof
};
```

---

### Database

**File:** `src/db/database.js`

```javascript
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = path.join(__dirname, '../../zkprivacy.db');

let db;

async function initDatabase() {
  return new Promise((resolve, reject) => {
    db = new sqlite3.Database(DB_PATH, (err) => {
      if (err) {
        console.error('Database error:', err);
        reject(err);
      } else {
        console.log('✅ Database connected');
        createTables().then(resolve).catch(reject);
      }
    });
  });
}

async function createTables() {
  return new Promise((resolve, reject) => {
    db.run(`
      CREATE TABLE IF NOT EXISTS verifications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT NOT NULL,
        proof TEXT NOT NULL,
        public_signals TEXT NOT NULL,
        verified BOOLEAN NOT NULL,
        kyc_valid BOOLEAN NOT NULL,
        chain TEXT,
        tx_hash TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `, (err) => {
      if (err) reject(err);
      else {
        console.log('✅ Tables created');
        resolve();
      }
    });
  });
}

async function saveVerification(data) {
  return new Promise((resolve, reject) => {
    const { userId, proof, publicSignals, verified, kycValid, chain, txHash } = data;

    db.run(`
      INSERT INTO verifications (user_id, proof, public_signals, verified, kyc_valid, chain, tx_hash)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [
      userId,
      JSON.stringify(proof),
      JSON.stringify(publicSignals),
      verified ? 1 : 0,
      kycValid ? 1 : 0,
      chain,
      txHash
    ], function(err) {
      if (err) reject(err);
      else resolve({ id: this.lastID });
    });
  });
}

async function getVerificationStatus(userId) {
  return new Promise((resolve, reject) => {
    db.all(`
      SELECT * FROM verifications
      WHERE user_id = ?
      ORDER BY created_at DESC
      LIMIT 10
    `, [userId], (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

module.exports = {
  initDatabase,
  saveVerification,
  getVerificationStatus
};
```

---

### Input Validation Middleware

**File:** `src/middleware/validator.js`

```javascript
function validateProofInput(req, res, next) {
  const { age, balance, country, minAge, minBalance, allowedCountries } = req.body;

  // Check required fields
  if (age === undefined || balance === undefined || country === undefined) {
    return res.status(400).json({
      success: false,
      error: 'Missing required fields: age, balance, country'
    });
  }

  // Validate types
  if (typeof age !== 'number' || typeof balance !== 'number' || typeof country !== 'number') {
    return res.status(400).json({
      success: false,
      error: 'age, balance, and country must be numbers'
    });
  }

  // Validate ranges
  if (age < 0 || age > 150) {
    return res.status(400).json({
      success: false,
      error: 'age must be between 0 and 150'
    });
  }

  if (balance < 0) {
    return res.status(400).json({
      success: false,
      error: 'balance must be non-negative'
    });
  }

  // Validate arrays
  if (allowedCountries && !Array.isArray(allowedCountries)) {
    return res.status(400).json({
      success: false,
      error: 'allowedCountries must be an array'
    });
  }

  next();
}

module.exports = {
  validateProofInput
};
```

---

### Rate Limiting Middleware

**File:** `src/middleware/rateLimit.js`

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    error: 'Too many requests, please try again later.'
  }
});

module.exports = limiter;
```

---

## 📦 package.json

```json
{
  "name": "zkprivacy-nodejs-backend",
  "version": "1.0.0",
  "main": "src/server.js",
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js",
    "test": "jest"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "helmet": "^7.1.0",
    "express-rate-limit": "^7.1.0",
    "snarkjs": "^0.7.3",
    "sqlite3": "^5.1.6",
    "ethers": "^6.9.0",
    "@stellar/stellar-sdk": "^11.0.0",
    "dotenv": "^16.3.1"
  },
  "devDependencies": {
    "nodemon": "^3.0.2",
    "jest": "^29.7.0",
    "supertest": "^6.3.3"
  }
}
```

---

## 🔧 Environment Variables

Create `.env`:

```bash
PORT=3001
NODE_ENV=development

# Ethereum
ETHEREUM_RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY
VERIFIER_CONTRACT_ADDRESS=0x...

# Stellar
STELLAR_RPC_URL=https://soroban-testnet.stellar.org
STELLAR_CONTRACT_ID=C...
STELLAR_SECRET_KEY=S...

# Database
DATABASE_PATH=./zkprivacy.db
```

---

## 🧪 Testing

**File:** `tests/proof.test.js`

```javascript
const request = require('supertest');
const app = require('../src/server');

describe('Proof API', () => {
  test('POST /api/proof/generate - valid input', async () => {
    const response = await request(app)
      .post('/api/proof/generate')
      .send({
        age: 25,
        balance: 150,
        country: 11,
        minAge: 18,
        minBalance: 50,
        allowedCountries: [11, 1, 5]
      });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.kycValid).toBe(true);
    expect(response.body.proof).toBeDefined();
  });

  test('POST /api/proof/generate - underage', async () => {
    const response = await request(app)
      .post('/api/proof/generate')
      .send({
        age: 16,
        balance: 150,
        country: 11,
        minAge: 18,
        minBalance: 50,
        allowedCountries: [11, 1, 5]
      });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.kycValid).toBe(false);
  });

  test('POST /api/proof/verify - valid proof', async () => {
    // First generate a proof
    const genResponse = await request(app)
      .post('/api/proof/generate')
      .send({
        age: 25,
        balance: 150,
        country: 11,
        minAge: 18,
        minBalance: 50,
        allowedCountries: [11, 1, 5]
      });

    // Then verify it
    const verifyResponse = await request(app)
      .post('/api/proof/verify')
      .send({
        proof: genResponse.body.proof,
        publicSignals: genResponse.body.publicSignals
      });

    expect(verifyResponse.status).toBe(200);
    expect(verifyResponse.body.verified).toBe(true);
  });
});
```

**Run tests:**
```bash
npm test
```

---

## 🚀 Deployment

### Deploy to Heroku

```bash
heroku create zkprivacy-api
git push heroku main
heroku config:set NODE_ENV=production
```

### Deploy to Railway

```bash
railway login
railway init
railway up
```

### Deploy with Docker

**Dockerfile:**
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3001

CMD ["node", "src/server.js"]
```

**Build and run:**
```bash
docker build -t zkprivacy-api .
docker run -p 3001:3001 zkprivacy-api
```

---

## 📚 Learn More

- [Interactive Tutorial](../../docs/getting-started/interactive-tutorial.md)
- [FAQ](../../docs/FAQ.md)
- [React Example](../react-integration/)

---

*Example last updated: 2025-01-10*
*Team X1 - Xcapit Labs*
