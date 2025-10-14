# Example 1: Basic Proof Generation

> Simple CLI tool for generating and verifying zero-knowledge proofs

⚠️ **Status:** Structure only - Implementation coming in next phase

---

## 📖 What You'll Learn

- How to generate a ZK proof using OpenZKTool SDK
- How to verify a proof locally
- Understanding proof structure
- Working with circuit inputs

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run the example
npm start

# Run with custom inputs
npm start -- --age 30 --balance 200 --country 1
```

---

## 📁 Files

```
1-basic-proof/
├── README.md           # This file
├── package.json        # Dependencies
├── generate.js         # Proof generation script
├── verify.js           # Proof verification script
└── inputs.json         # Sample inputs
```

---

## 💻 Code Example

### generate.js

```javascript
const { OpenZKTool } = require('@openzktool/sdk');

async function main() {
  // Initialize SDK
  const zktool = new OpenZKTool({
    wasmPath: '../../circuits/artifacts/kyc_transfer.wasm',
    zkeyPath: '../../circuits/artifacts/kyc_transfer_final.zkey'
  });

  // Define inputs
  const inputs = {
    age: 25,
    balance: 150,
    country: 32,
    minAge: 18,
    minBalance: 50,
    allowedCountries: [11, 1, 5, 32]
  };

  // Generate proof
  console.log('Generating proof...');
  const { proof, publicSignals } = await zktool.generateProof(inputs);

  console.log('✅ Proof generated!');
  console.log('Public Signals:', publicSignals);
  console.log('Proof size:', JSON.stringify(proof).length, 'bytes');

  // Save proof
  fs.writeFileSync('proof.json', JSON.stringify(proof, null, 2));
  fs.writeFileSync('public.json', JSON.stringify(publicSignals, null, 2));
}

main().catch(console.error);
```

### verify.js

```javascript
const { OpenZKTool } = require('@openzktool/sdk');
const proof = require('./proof.json');
const publicSignals = require('./public.json');

async function main() {
  const zktool = new OpenZKTool({
    vkeyPath: '../../circuits/artifacts/verification_key.json'
  });

  console.log('Verifying proof...');
  const isValid = await zktool.verifyLocal(proof, publicSignals);

  if (isValid) {
    console.log('✅ Proof is VALID');
    console.log('KYC Status:', publicSignals.kycValid === 1 ? 'PASSED' : 'FAILED');
  } else {
    console.log('❌ Proof is INVALID');
  }
}

main().catch(console.error);
```

---

## 🎯 Expected Output

```
Generating proof...
✅ Proof generated!
Public Signals: { kycValid: 1 }
Proof size: 823 bytes

Verifying proof...
✅ Proof is VALID
KYC Status: PASSED
```

---

## 🧪 Testing

```bash
npm test
```

---

## 📚 Next Steps

- Try [Example 2: React App](../2-react-app/) for browser integration
- Explore [Example 3: Node.js Backend](../3-nodejs-backend/) for API integration

---

## 🔗 Resources

- [SDK Documentation](../../sdk/README.md)
- [Circuit Documentation](../../circuits/README.md)
- [FAQ](../../docs/FAQ.md)
