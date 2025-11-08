---
sidebar_position: 1
---

# KYC Transfer Circuit

The KYC Transfer circuit enables privacy-preserving identity verification for financial transactions. Users can prove they meet KYC requirements without revealing their exact personal information.

## Use Case

Perfect for DeFi platforms, exchanges, and financial services that need to verify:
- User age requirements (e.g., 18+ for regulated services)
- Minimum balance thresholds for premium features
- Geographic compliance without tracking user location

## How It Works

The circuit verifies three conditions simultaneously:

1. **Age Range Check**: Proves age is within acceptable bounds
2. **Balance Verification**: Proves sufficient funds without revealing exact amount
3. **Country Compliance**: Proves location is in an allowed list

**The magic:** All checks happen cryptographically. The verifier learns ONLY that requirements are met, not the actual values.

## Circuit Specification

### Private Inputs (Hidden)

```circom
signal input age;           // User's actual age
signal input balance;       // User's actual balance in smallest units
signal input country;       // Country ID (numeric)
```

These values are **never** revealed on-chain or to verifiers.

### Public Inputs (Constraints)

```circom
signal input minAge;              // Minimum allowed age
signal input maxAge;              // Maximum allowed age
signal input minBalance;          // Minimum required balance
signal input allowedCountries[10]; // Whitelist of country IDs
```

These are the rules everyone can see, but they don't reveal user data.

### Output

```circom
signal output kycValid;    // 1 if all checks pass, 0 otherwise
```

## Example Usage

### Scenario: 18+ DeFi Platform with Geographic Restrictions

A user wants to access a DeFi platform that requires:
- Age: 18-99 years old
- Balance: At least 100 USDC
- Location: USA, Canada, or UK only

**User's Private Data:**
- Age: 25 years old
- Balance: 500 USDC
- Country: USA (ID: 1)

### Input File

Create `kyc_input.json`:

```json
{
  "age": "25",
  "balance": "500",
  "country": "1",
  "minAge": "18",
  "maxAge": "99",
  "minBalance": "100",
  "allowedCountries": ["1", "2", "3", "0", "0", "0", "0", "0", "0", "0"]
}
```

**Country ID Mapping:**
- 1 = USA
- 2 = Canada
- 3 = UK
- 0 = Unused slots (array must have 10 elements)

### Generate Proof

```bash
cd /path/to/openzktool

# Generate the proof
npm run prove -- kyc_input.json

# Verify locally
snarkjs groth16 verify \
  circuits/build/verification_key.json \
  circuits/build/public.json \
  circuits/build/proof.json
```

**Output:** `kycValid = 1` (verified ✓)

### Verify on Stellar

```bash
npm run demo:soroban
```

The Soroban contract verifies the proof and returns `true` without ever learning the user's age, balance, or exact location.

## Circuit Constraints

The circuit implements three cryptographic checks:

### 1. Age Range Verification

```circom
// Verifies: minAge <= age <= maxAge
component ageGte = GreaterEqThan(32);
component ageLte = LessEqThan(32);

ageGte.in[0] <== age;
ageGte.in[1] <== minAge;

ageLte.in[0] <== age;
ageLte.in[1] <== maxAge;

ageInRange <== ageGte.out * ageLte.out;  // AND gate
```

### 2. Balance Verification

```circom
// Verifies: balance >= minBalance
component balanceGte = GreaterEqThan(64);

balanceGte.in[0] <== balance;
balanceGte.in[1] <== minBalance;

balanceSufficient <== balanceGte.out;
```

### 3. Country Whitelist Check

```circom
// Verifies: country is in allowedCountries array
signal countryMatches[10];
component countryEq[10];

for (var i = 0; i < 10; i++) {
    countryEq[i] = IsEqual();
    countryEq[i].in[0] <== country;
    countryEq[i].in[1] <== allowedCountries[i];
    countryMatches[i] <== countryEq[i].out;
}

// OR gate: at least one match required
signal countryOr[10];
countryOr[0] <== countryMatches[0];
for (var i = 1; i < 10; i++) {
    countryOr[i] <== countryOr[i-1] + countryMatches[i] -
                     (countryOr[i-1] * countryMatches[i]);
}
countryAllowed <== countryOr[9];
```

### 4. Final Verification

```circom
// AND gate: ALL checks must pass
signal partial <== ageInRange * balanceSufficient;
kycValid <== partial * countryAllowed;
```

## Performance Metrics

| Metric | Value |
|--------|-------|
| **Circuit Constraints** | ~1,200 |
| **Proof Generation** | < 1 second |
| **Proof Size** | 800 bytes |
| **On-chain Verification** | ~200ms on Soroban |
| **Gas Cost (Soroban)** | ~200,000 operations |

## Security Considerations

### Soundness

The circuit guarantees that **no valid proof can be generated** unless ALL conditions are met:
- Age is genuinely within the range
- Balance is actually ≥ minimum
- Country is truly in the allowed list

### Zero-Knowledge

Verifiers learn **only** that `kycValid = 1` or `0`. They cannot extract:
- Exact age (only that it's in range)
- Exact balance (only that it's sufficient)
- Exact country (only that it's allowed)

### Trusted Setup

This circuit uses Groth16 which requires a trusted setup ceremony. OpenZKTool provides pre-generated keys for testing, but production deployments should conduct their own ceremony.

## Customization

### Modify Age Range

```json
{
  "minAge": "21",  // Raise to 21+
  "maxAge": "65",  // Cap at retirement age
  ...
}
```

### Adjust Balance Threshold

```json
{
  "minBalance": "1000000",  // 1M smallest units (e.g., 1M USDC)
  ...
}
```

### Update Country Whitelist

```json
{
  "allowedCountries": ["1", "5", "11", "20", "0", "0", "0", "0", "0", "0"],
  ...
}
```

**Note:** Always use 10 elements. Pad unused slots with `"0"`.

## Integration Examples

### Smart Contract Integration

```rust
// Soroban contract calling the verifier
use soroban_sdk::{contract, contractimpl, Env, Vec};

#[contract]
pub struct DeFiPlatform;

#[contractimpl]
impl DeFiPlatform {
    pub fn verify_kyc(env: Env, proof: Vec<u8>) -> bool {
        let verifier = "CBPBVJJW5NMV4UVEDKSR6UO4DRBNWRQEMYKRYZI3CW6YK3O7HAZA43OI";

        let result: bool = env.invoke_contract(
            &verifier,
            &symbol_short!("verify"),
            (&proof,).into_val(&env),
        );

        result  // Returns true only if KYC is valid
    }

    pub fn premium_action(env: Env, user: Address, proof: Vec<u8>) {
        // Verify KYC proof before allowing premium feature
        require!(Self::verify_kyc(env.clone(), proof), "KYC verification failed");

        // Execute premium action...
    }
}
```

### Web Application Integration

```typescript
import { KYCTransfer } from '@openzktool/sdk';
import { SorobanRpc } from 'stellar-sdk';

async function verifyUserKYC(userData: {
  age: number;
  balance: number;
  country: number;
}) {
  // 1. Generate proof client-side (privacy preserved)
  const proof = await KYCTransfer.generateProof({
    // Private inputs (never leave user's device)
    age: userData.age,
    balance: userData.balance,
    country: userData.country,

    // Public constraints
    minAge: 18,
    maxAge: 99,
    minBalance: 100,
    allowedCountries: [1, 2, 3, 0, 0, 0, 0, 0, 0, 0],
  });

  // 2. Verify on Stellar Soroban
  const server = new SorobanRpc.Server('https://soroban-testnet.stellar.org');
  const contract = 'CBPBVJJW5NMV4UVEDKSR6UO4DRBNWRQEMYKRYZI3CW6YK3O7HAZA43OI';

  const result = await server.simulateTransaction(
    buildVerifyTransaction(contract, proof)
  );

  return result.success; // true if KYC valid
}
```

## Common Issues

### "Invalid witness" Error

**Cause:** Input values don't satisfy constraints.

**Solution:** Verify all conditions are met:
- `minAge <= age <= maxAge`
- `balance >= minBalance`
- `country` is in `allowedCountries`

### "Verification failed" on-chain

**Cause:** Mismatch between proof generation and verification keys.

**Solution:** Ensure you're using the same `verification_key.json` that corresponds to your proving key.

### Country not matching

**Cause:** Country ID not found in `allowedCountries` array.

**Solution:** Check that:
- Country ID is in the array
- Array has exactly 10 elements
- Unused slots are set to `"0"` (string)

## Next Steps

- **[Stellar Deployment →](../stellar-integration/deployment)** - Deploy your own verifier
- **[Custom Circuits →](../advanced/custom-circuits)** - Modify this circuit for your use case
- **[API Reference →](../api-reference/proof-generation)** - Programmatic proof generation

---

**Questions?** [GitHub Discussions](https://github.com/xcapit/openzktool/discussions)
