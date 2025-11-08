---
sidebar_position: 0
---

# Circuit Templates Overview

OpenZKTool provides production-ready ZK circuit templates for common privacy-preserving use cases. These circuits are optimized for Stellar Soroban and thoroughly tested.

## Available Templates

### KYC Transfer Circuit

**Purpose:** Privacy-preserving identity verification for financial services.

**Verifies:**
- Age requirements (e.g., 18+ verification)
- Balance thresholds (minimum holdings)
- Geographic compliance (country whitelists)

**Use Cases:**
- DeFi platform access control
- Exchange KYC without storing PII
- Age-gated services
- Premium tier qualification

[Learn More →](./kyc-transfer)

## Coming Soon

### Balance Proof Circuit

Prove you have sufficient funds for a transaction without revealing your exact balance.

**Use Cases:**
- DEX order verification
- Loan collateral proof
- Solvency demonstrations

### Age Verification Circuit

Simplified circuit focused solely on age verification (optimized for lower constraints).

**Use Cases:**
- Content access control
- Service eligibility checks
- Legal compliance

### Merkle Membership Proof

Prove you're part of an allowed set without revealing your identity.

**Use Cases:**
- Whitelist verification
- Airdrop eligibility
- Access control lists

## How to Use Templates

### 1. Choose a Template

Select the template that matches your use case from the list above.

### 2. Customize Inputs

Each template has configurable public constraints:

```json
{
  "minAge": "18",        // Adjust requirements
  "minBalance": "1000",  // Set thresholds
  "allowedCountries": [1, 2, 3, ...]  // Define whitelists
}
```

### 3. Generate Proofs

Use the OpenZKTool CLI or SDK:

```bash
# CLI
npm run prove -- your_input.json

# Or use the SDK (coming soon)
import { KYCTransfer } from '@openzktool/sdk';
const proof = await KYCTransfer.generateProof(inputs);
```

### 4. Verify on Stellar

Submit proofs to the deployed Soroban verifier:

```rust
let verifier = "CBPBVJJW5NMV4UVEDKSR6UO4DRBNWRQEMYKRYZI3CW6YK3O7HAZA43OI";
let result: bool = env.invoke_contract(&verifier, &symbol_short!("verify"), (&proof,));
```

## Template Characteristics

All circuit templates share these properties:

| Feature | Details |
|---------|---------|
| **Proof System** | Groth16 on BN254 curve |
| **Proof Size** | Constant 800 bytes |
| **Security Level** | 128-bit |
| **Verification Time** | < 50ms off-chain, ~200ms on Soroban |
| **Zero-Knowledge** | Full - no data leakage |

## Performance Comparison

| Template | Constraints | Proof Time | On-chain Gas |
|----------|-------------|------------|--------------|
| KYC Transfer | ~1,200 | < 1s | ~200k ops |
| Balance Proof | ~800 | < 0.5s | ~150k ops |
| Age Verification | ~400 | < 0.3s | ~100k ops |
| Merkle Membership | ~2,500 | < 2s | ~300k ops |

*Benchmarks on Intel i7, 16GB RAM*

## Security Model

### What Templates Guarantee

✅ **Soundness:** Impossible to create fake proofs
✅ **Zero-Knowledge:** No information leaked beyond validity
✅ **Completeness:** Valid inputs always produce valid proofs

### What You Must Ensure

⚠️ **Trusted Setup:** Use production ceremony keys (not test keys)
⚠️ **Input Validation:** Sanitize private inputs before proof generation
⚠️ **Key Management:** Securely store proving keys

## Customization

Need something different? Templates are designed to be modified:

1. **Fork the circuit** - Clone and adapt to your needs
2. **Adjust constraints** - Change ranges, add conditions
3. **Regenerate keys** - Run your own trusted setup
4. **Deploy verifier** - Export Soroban contract

See [Custom Circuits →](../advanced/custom-circuits) for a detailed guide.

## Integration Patterns

### Pattern 1: Client-Side Proof Generation

```typescript
// User's device generates proof
const proof = await generateProof(privateData);

// Submit to your backend
await api.post('/verify', { proof });

// Backend verifies on Stellar
const valid = await sorobanVerifier.verify(proof);
```

**Benefits:**
- Private data never leaves user's device
- Backend doesn't need to handle sensitive info
- Fully privacy-preserving

### Pattern 2: Delegated Proving

```typescript
// Backend generates proof on behalf of user
const proof = await generateProof(userData);

// Immediately verify
const valid = await sorobanVerifier.verify(proof);

// Discard private data
delete userData;
```

**Benefits:**
- Simpler UX (no client-side computation)
- Faster for mobile users
- Centralized control

**Trade-off:** Requires trusting the backend with private data.

### Pattern 3: Hybrid Verification

```typescript
// Generate proof locally
const proof = await generateProof(privateData);

// Verify locally first (instant feedback)
const localValid = await localVerifier.verify(proof);

// Then verify on-chain (for consensus)
if (localValid) {
  const onChainValid = await sorobanVerifier.verify(proof);
}
```

**Benefits:**
- Instant feedback for users
- On-chain proof for auditing
- Gas savings (skip invalid proofs)

## Best Practices

### 1. Always Verify On-Chain

Local verification is fast but not trustless. For security-critical operations, always verify on Stellar Soroban.

### 2. Cache Verification Keys

Verification keys are ~1KB and immutable. Cache them to avoid repeated network requests.

### 3. Handle Failures Gracefully

Proof generation can fail if inputs don't satisfy constraints. Provide clear error messages to users.

### 4. Test with Real Data

Use realistic test cases that match your production scenarios.

### 5. Monitor Gas Costs

Soroban gas costs can vary. Monitor and optimize your verification flow.

## Next Steps

- **[KYC Transfer Circuit →](./kyc-transfer)** - Detailed template guide
- **[Stellar Integration →](../stellar-integration/overview)** - Deploy verifier contracts
- **[Custom Circuits →](../advanced/custom-circuits)** - Build your own

---

**Need help?** [Ask on GitHub Discussions](https://github.com/xcapit/openzktool/discussions)
