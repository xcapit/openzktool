---
sidebar_position: 1
---

# Stellar Integration Overview

OpenZKTool is built specifically for Stellar's Soroban smart contract platform.

## Why Stellar?

- **Lower fees:** 10-100x cheaper than Ethereum
- **Fast finality:** ~5 seconds
- **WASM runtime:** Efficient smart contracts
- **Native multi-asset:** Built-in token support
- **Production-grade crypto:** First-class primitives

## Soroban Verifier Contract

Our Groth16 verifier is written in pure Rust and optimized for Soroban's WASM runtime.

### Features

- **Complete BN254 implementation** - Field arithmetic, curve operations, pairings
- **Compact:** 20KB WASM binary
- **Well-tested:** 49+ unit tests
- **Production-ready:** Deployed to testnet

### Contract Address

**Testnet:** `CBPBVJJW5NMV4UVEDKSR6UO4DRBNWRQEMYKRYZI3CW6YK3O7HAZA43OI`

[View on Stellar Expert →](https://stellar.expert/explorer/testnet/contract/CBPBVJJW5NMV4UVEDKSR6UO4DRBNWRQEMYKRYZI3CW6YK3O7HAZA43OI)

## Quick Integration

```rust
// Example Soroban contract using OpenZKTool
use soroban_sdk::{contract, contractimpl, Env, Vec};

#[contract]
pub struct MyContract;

#[contractimpl]
impl MyContract {
    pub fn verify_user(env: Env, proof: Vec<u8>) -> bool {
        // Call OpenZKTool verifier contract
        let verifier_id = "CBPBVJJW5NMV4UVEDKSR6UO4DRBNWRQEMYKRYZI3CW6YK3O7HAZA43OI";

        // Verify proof
        let result: bool = env.invoke_contract(
            &verifier_id,
            &symbol_short!("verify"),
            (&proof,).into_val(&env),
        );

        result
    }
}
```

## Architecture

The verifier implements the complete Groth16 verification equation:

```
e(A, B) = e(α, β) · e(C, γ) · e(public_inputs, δ)
```

Using optimal ate pairing on the BN254 curve.

## Next Steps

- **[Deployment →](./deployment)** - Deploy your own verifier
- **[Contract API →](./contract-api)** - Full API reference

---

**More documentation coming soon!**
