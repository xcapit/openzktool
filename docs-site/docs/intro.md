---
sidebar_position: 1
slug: /
---

# Welcome to OpenZKTool

**Privacy infrastructure for Stellar Soroban using Zero-Knowledge Proofs**

OpenZKTool is a complete ZK-SNARK toolkit built specifically for Stellar's Soroban smart contract platform. Add privacy-preserving features to your dApps while maintaining regulatory compliance.

## Why OpenZKTool?

### Built for Stellar
- **Production-ready verifier contracts** in Rust (20KB WASM)
- **Optimized for Soroban** WASM runtime
- **Already deployed** on Stellar testnet
- **Lower costs** than EVM alternatives

### Privacy + Compliance
- Prove facts without revealing data
- Age verification without exact age
- Balance proofs without amounts
- Country compliance without location

### Developer-Friendly
- Pre-built circuit templates
- TypeScript SDK (coming soon)
- Comprehensive documentation
- Active community support

## Quick Example

```typescript
import { KYCTransfer } from '@openzktool/sdk';

// Generate a zero-knowledge proof
const proof = await KYCTransfer.generateProof({
  age: 25,           // Private
  balance: 1000,     // Private
  country: 'US',     // Private
  minAge: 18,        // Public
  minBalance: 500,   // Public
});

// Verify on Stellar Soroban
await sorobanContract.verify(proof);
// Returns: true (user meets requirements)
// WITHOUT revealing actual age, balance, or country!
```

## Live on Stellar Testnet

Our Groth16 verifier contract is already deployed:

**Contract ID:** `CBPBVJJW5NMV4UVEDKSR6UO4DRBNWRQEMYKRYZI3CW6YK3O7HAZA43OI`

[View on Stellar Expert →](https://stellar.expert/explorer/testnet/contract/CBPBVJJW5NMV4UVEDKSR6UO4DRBNWRQEMYKRYZI3CW6YK3O7HAZA43OI)

## What's Inside

### 📚 [Getting Started](./getting-started/installation)
Install OpenZKTool and run your first proof in minutes

### ⭐ [Stellar Integration](./stellar-integration/overview)
Learn how to integrate with Soroban smart contracts

### 🔧 [Circuit Templates](./circuit-templates/kyc-transfer)
Pre-built circuits for common use cases

### 🚀 [Advanced](./advanced/custom-circuits)
Build custom circuits and optimize performance

## Key Features

| Feature | Description |
|---------|-------------|
| **Groth16 Proofs** | Industry-standard ZK-SNARK system on BN254 curve |
| **Soroban Verifier** | Full Rust implementation with pairing operations |
| **Circuit Templates** | KYC, age verification, balance proofs, compliance |
| **Fast Verification** | Under 50ms off-chain, ~200k gas on-chain |
| **Compact Proofs** | 800 bytes per proof |
| **Production Ready** | 49+ tests, deployed to testnet |

## Use Cases

- **KYC/AML Compliance** - Verify identity without storing PII
- **Age Verification** - Prove age > 18 without exact birthdate
- **Solvency Proofs** - Prove sufficient balance without amount
- **Geographic Compliance** - Verify location without revealing address
- **Accredited Investors** - Prove net worth requirements
- **Private DEX** - Trade without revealing balances

## Community & Support

- **GitHub:** [xcapit/openzktool](https://github.com/xcapit/openzktool)
- **Discussions:** [GitHub Discussions](https://github.com/xcapit/openzktool/discussions)
- **Twitter:** [@xcapit_](https://twitter.com/xcapit_)

## Next Steps

Ready to get started?

1. [Install OpenZKTool](./getting-started/installation) →
2. [Run Quick Start](./getting-started/quick-start) →
3. [Deploy to Stellar](./stellar-integration/deployment) →

---

**Built with ❤️ for the Stellar ecosystem by Xcapit Labs**
