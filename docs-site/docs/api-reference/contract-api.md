---
sidebar_position: 3
---

# Soroban Contract API

The OpenZKTool Groth16 verifier contract deployed on Stellar Soroban provides on-chain zero-knowledge proof verification.

## Contract Address

**Stellar Testnet:**
```
CBPBVJJW5NMV4UVEDKSR6UO4DRBNWRQEMYKRYZI3CW6YK3O7HAZA43OI
```

[View on Stellar Expert →](https://stellar.expert/explorer/testnet/contract/CBPBVJJW5NMV4UVEDKSR6UO4DRBNWRQEMYKRYZI3CW6YK3O7HAZA43OI)

## Contract Interface

### `verify`

Verifies a Groth16 zero-knowledge proof.

#### Function Signature

```rust
pub fn verify(
    env: Env,
    proof: Vec<u8>,
    public_inputs: Vec<u8>,
    vk: VerificationKey
) -> bool
```

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `env` | `Env` | Soroban environment |
| `proof` | `Vec<u8>` | Serialized Groth16 proof |
| `public_inputs` | `Vec<u8>` | Public input signals |
| `vk` | `VerificationKey` | Verification key structure |

#### Returns

| Type | Description |
|------|-------------|
| `bool` | `true` if proof is valid, `false` otherwise |

#### Example Usage

```rust
use soroban_sdk::{contract, contractimpl, Env, Vec, Bytes};

#[contract]
pub struct MyDApp;

#[contractimpl]
impl MyDApp {
    pub fn check_kyc(env: Env, proof: Vec<u8>) -> bool {
        let verifier_id = BytesN::from_array(
            &env,
            &hex!("CBPBVJJW5NMV4UVEDKSR6UO4DRBNWRQEMYKRYZI3CW6YK3O7HAZA43OI")
        );

        // Invoke the verifier contract
        let result: bool = env.invoke_contract(
            &verifier_id,
            &symbol_short!("verify"),
            (&proof,).into_val(&env)
        );

        result
    }

    pub fn gated_action(env: Env, user: Address, proof: Vec<u8>) {
        // Require valid proof before allowing action
        if !Self::check_kyc(env.clone(), proof) {
            panic!("Invalid KYC proof");
        }

        // Proceed with action...
        log!(&env, "KYC verified for user: {}", user);
    }
}
```

## Proof Format

Proofs must be encoded in the following binary format:

### Groth16 Proof Structure

```rust
struct Proof {
    a: G1Point,      // 64 bytes
    b: G2Point,      // 128 bytes
    c: G1Point,      // 64 bytes
}

struct G1Point {
    x: [u8; 32],    // Field element
    y: [u8; 32],    // Field element
}

struct G2Point {
    x: ([u8; 32], [u8; 32]),  // Fq2 element
    y: ([u8; 32], [u8; 32]),  // Fq2 element
}
```

**Total Proof Size:** 256 bytes (constant)

### Serialization

Proofs are serialized in big-endian format:

```
[A.x (32 bytes)] [A.y (32 bytes)]
[B.x.c0 (32)] [B.x.c1 (32)] [B.y.c0 (32)] [B.y.c1 (32)]
[C.x (32 bytes)] [C.y (32 bytes)]
```

## Public Inputs Format

Public inputs are encoded as field elements:

```rust
struct PublicInputs {
    signals: Vec<[u8; 32]>  // Each signal is 32 bytes
}
```

For the KYC circuit:
```
[kycValid (32 bytes)]
```

## Verification Key Format

The verification key contains cryptographic parameters:

```rust
struct VerificationKey {
    alpha: G1Point,
    beta: G2Point,
    gamma: G2Point,
    delta: G2Point,
    ic: Vec<G1Point>,  // IC points for public inputs
}
```

**Note:** The verification key is embedded in the contract during deployment.

## Gas Costs

Approximate Soroban operation costs:

| Operation | Gas (Operations) | Time |
|-----------|------------------|------|
| Proof deserialization | ~10,000 | ~10ms |
| Pairing computation | ~150,000 | ~150ms |
| Final verification | ~40,000 | ~40ms |
| **Total** | **~200,000** | **~200ms** |

**Cost in XLM:** ~0.0002 XLM per verification (at current rates)

## Error Handling

The contract returns errors for invalid inputs:

### Error Codes

| Code | Description | Resolution |
|------|-------------|------------|
| `InvalidProofFormat` | Proof serialization error | Check proof encoding |
| `InvalidPublicInputs` | Public inputs mismatch | Verify input count/format |
| `PairingCheckFailed` | Cryptographic verification failed | Regenerate proof |
| `OutOfGas` | Insufficient gas provided | Increase gas limit |

### Example Error Handling

```rust
use soroban_sdk::{contractimpl, Env, Vec};

#[contractimpl]
impl MyContract {
    pub fn safe_verify(env: Env, proof: Vec<u8>) -> Result<bool, Error> {
        let verifier = get_verifier_address();

        match env.try_invoke_contract(&verifier, &symbol_short!("verify"), (&proof,)) {
            Ok(result) => Ok(result),
            Err(e) => {
                log!(&env, "Verification failed: {}", e);
                Err(Error::VerificationFailed)
            }
        }
    }
}
```

## Integration Patterns

### Pattern 1: Stateless Verification

Verify proofs without storing any state:

```rust
#[contractimpl]
impl Verifier {
    pub fn verify_once(env: Env, proof: Vec<u8>) -> bool {
        let verifier = get_verifier_id();
        env.invoke_contract(&verifier, &symbol_short!("verify"), (&proof,))
    }
}
```

**Use Case:** One-time access checks

### Pattern 2: Proof Caching

Store verification results to avoid re-verification:

```rust
#[contractimpl]
impl Verifier {
    pub fn verify_and_cache(env: Env, user: Address, proof: Vec<u8>) -> bool {
        // Check cache first
        if let Some(cached) = env.storage().get(&user) {
            return cached;
        }

        // Verify and cache
        let result = Self::verify_once(env.clone(), proof);
        env.storage().set(&user, &result);

        result
    }
}
```

**Use Case:** Repeated access within a session

### Pattern 3: Batch Verification

Verify multiple proofs in a single transaction:

```rust
#[contractimpl]
impl BatchVerifier {
    pub fn verify_batch(env: Env, proofs: Vec<Vec<u8>>) -> Vec<bool> {
        let verifier = get_verifier_id();
        let mut results = Vec::new(&env);

        for proof in proofs.iter() {
            let valid: bool = env.invoke_contract(
                &verifier,
                &symbol_short!("verify"),
                (&proof,)
            );
            results.push_back(valid);
        }

        results
    }
}
```

**Use Case:** Multi-user verification

## Deployment Guide

### Deploy Your Own Verifier

```bash
# Build the contract
cd contracts
cargo build --target wasm32-unknown-unknown --release

# Optimize WASM
wasm-opt --strip-debug -Oz \
  target/wasm32-unknown-unknown/release/verifier.wasm \
  -o verifier-optimized.wasm

# Deploy to Soroban
soroban contract deploy \
  --wasm verifier-optimized.wasm \
  --source YOUR_SECRET_KEY \
  --network testnet
```

### Deploy Output

```
Contract deployed successfully!
Contract ID: YOUR_CONTRACT_ID
Transaction: https://stellar.expert/explorer/testnet/tx/HASH
```

## Testing

### Unit Tests

```rust
#[test]
fn test_valid_proof() {
    let env = Env::default();
    let contract = VerifierClient::new(&env, &contract_id);

    let proof = generate_test_proof();
    let result = contract.verify(&proof);

    assert_eq!(result, true);
}

#[test]
fn test_invalid_proof() {
    let env = Env::default();
    let contract = VerifierClient::new(&env, &contract_id);

    let invalid_proof = vec![0u8; 256];
    let result = contract.verify(&invalid_proof);

    assert_eq!(result, false);
}
```

### Integration Tests

```bash
# Test on testnet
npm run test:integration
```

## Security Considerations

### 1. Proof Replay Attacks

**Problem:** Same proof can be used multiple times.

**Solution:** Add nonce or timestamp to public inputs:

```rust
pub fn verify_with_nonce(env: Env, proof: Vec<u8>, nonce: u64) -> bool {
    // Check nonce hasn't been used
    if env.storage().has(&nonce) {
        return false;
    }

    let valid = verify(env.clone(), proof);

    if valid {
        env.storage().set(&nonce, &true);
    }

    valid
}
```

### 2. Front-Running

**Problem:** Attacker sees proof in mempool and submits it first.

**Solution:** Bind proof to sender address:

```rust
pub fn verify_for_sender(env: Env, proof: Vec<u8>) -> bool {
    let sender = env.invoker();

    // Proof must include sender in public inputs
    let valid = verify_with_sender(env, proof, sender);

    valid
}
```

### 3. DoS via Invalid Proofs

**Problem:** Spamming invalid proofs wastes gas.

**Solution:** Implement rate limiting:

```rust
pub fn verify_with_rate_limit(env: Env, user: Address, proof: Vec<u8>) -> bool {
    let attempts = env.storage().get::<_, u32>(&user).unwrap_or(0);

    if attempts >= MAX_ATTEMPTS {
        panic!("Rate limit exceeded");
    }

    let valid = verify(env.clone(), proof);

    if !valid {
        env.storage().set(&user, &(attempts + 1));
    }

    valid
}
```

## Monitoring & Observability

### Event Logging

```rust
#[contractimpl]
impl Verifier {
    pub fn verify_with_logs(env: Env, proof: Vec<u8>) -> bool {
        log!(&env, "Verification started");

        let start = env.ledger().timestamp();
        let result = verify(env.clone(), proof);
        let duration = env.ledger().timestamp() - start;

        log!(&env, "Verification completed: {} ({}ms)", result, duration);

        env.events().publish(
            (symbol_short!("verify"),),
            (result, duration)
        );

        result
    }
}
```

### Metrics

Track verification metrics:

```rust
struct Metrics {
    total_verifications: u64,
    successful_verifications: u64,
    failed_verifications: u64,
    average_gas_used: u64,
}
```

## Next Steps

- **[CLI Reference →](./cli)** - Command line tools
- **[Deployment Guide →](../stellar-integration/deployment)** - Deploy your own verifier
- **[Advanced Topics →](../advanced/custom-circuits)** - Custom circuit development

---

**Need help?** [GitHub Discussions](https://github.com/xcapit/openzktool/discussions)
