# Example 4: Stellar/Soroban Integration

> On-chain proof verification on Stellar network

**Status:** Structure only - Implementation coming in next phase

---

## 📖 What You'll Learn

- Soroban smart contract interaction
- Deploying contracts to Stellar testnet
- Invoking contract functions
- Handling Stellar transactions
- Working with Freighter wallet

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Configure Stellar network
export STELLAR_NETWORK=testnet

# Run the example
npm start
```

---

## 📁 Files

```
4-stellar-integration/
├── README.md
├── package.json
├── deploy-contract.js      # Deploy Soroban contract
├── invoke-verify.js        # Invoke verification
├── check-result.js         # Check verification result
└── stellar-config.json     # Network configuration
```

---

## 💻 Implementation Example

```javascript
const { SorobanRpc, Keypair, Contract } = require('stellar-sdk');
const { OpenZKTool } = require('@openzktool/sdk');

async function verifyOnStellar() {
  // Connect to Stellar network
  const server = new SorobanRpc.Server('https://soroban-testnet.stellar.org');

  // Load contract
  const contractId = 'CBPBVJJW5NMV4UVEDKSR6UO4DRBNWRQEMYKRYZI3CW6YK3O7HAZA43OI';
  const contract = new Contract(contractId);

  // Generate proof
  const zktool = new OpenZKTool({
    wasmPath: './circuits/kyc_transfer.wasm',
    zkeyPath: './circuits/kyc_transfer_final.zkey'
  });

  const { proof, publicSignals } = await zktool.generateProof({
    age: 25,
    balance: 150,
    country: 32
  });

  // Format for Soroban
  const formattedProof = formatProofForSoroban(proof);

  // Invoke contract
  const result = await contract.call(
    'verify_proof',
    formattedProof,
    publicSignals
  );

  console.log('Verification result:', result);
  console.log('Contract version:', await contract.call('version'));
}

verifyOnStellar().catch(console.error);
```

---

## 🌟 Stellar-Specific Features

- - Testnet deployment
- - Contract invocation
- - Transaction signing
- - Freighter wallet integration
- - Network selection (testnet/mainnet)
- - Gas estimation

---

## 🧪 Testing

```bash
# Test on testnet
npm run test:testnet

# Test contract deployment
npm run test:deploy

# Test verification
npm run test:verify
```

---

## 📊 Expected Output

```
Connecting to Stellar testnet...
- Connected to RPC: https://soroban-testnet.stellar.org

Generating proof...
- Proof generated (823 bytes)

Invoking contract CBPBVJJW5NMV...
- Transaction submitted: TX_HASH
⏳ Waiting for confirmation...
- Verification successful!

Contract version: 4
Proof valid: true
Gas used: ~50,000 ops
```

---

## 🔗 Resources

- [Soroban Documentation](https://soroban.stellar.org/)
- [Stellar SDK](https://stellar.github.io/js-stellar-sdk/)
- [Freighter Wallet](https://www.freighter.app/)
- [Contract Source](../../soroban/src/lib.rs)
