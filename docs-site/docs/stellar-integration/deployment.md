---
sidebar_position: 2
---

# Deploying Your Own Verifier

Step-by-step guide to deploying a custom Groth16 verifier contract on Stellar Soroban.

## Prerequisites

Before deploying, ensure you have:

- **Stellar CLI (`soroban`)** - [Installation guide](https://soroban.stellar.org/docs/getting-started/setup)
- **Rust toolchain** - `rustc 1.75+` with `wasm32-unknown-unknown` target
- **Circuit artifacts** - `.zkey` file from your trusted setup
- **Stellar account** - Funded with XLM (testnet or mainnet)

### Install Soroban CLI

```bash
# macOS/Linux
cargo install --locked soroban-cli

# Verify installation
soroban --version
```

### Configure Stellar Network

```bash
# Add testnet network
soroban network add \
  --global testnet \
  --rpc-url https://soroban-testnet.stellar.org:443 \
  --network-passphrase "Test SDF Network ; September 2015"

# Create identity
soroban keys generate alice --network testnet

# Fund account (testnet only)
soroban keys fund alice --network testnet
```

## Step 1: Export Verifier from Circuit

Generate Soroban-compatible verifier from your circuit's zkey file:

```bash
# Export Soroban verifier
snarkjs zkey export soroban \
  circuits/build/my_circuit_final.zkey \
  contracts/src/verifier.rs
```

This generates a Rust file with:
- Embedded verification key
- G1/G2 curve operations
- Pairing computation
- Complete Groth16 verification logic

### What Gets Generated

```rust
// contracts/src/verifier.rs (auto-generated)
pub mod groth16 {
    // BN254 curve parameters
    const CURVE_ORDER: &str = "...";

    // Embedded verification key
    pub struct VerificationKey {
        pub alpha_g1: G1Affine,
        pub beta_g2: G2Affine,
        // ... more fields
    }

    // Verification function
    pub fn verify(
        proof: &Proof,
        public_inputs: &[Fr]
    ) -> bool {
        // Pairing check implementation
    }
}
```

## Step 2: Create Contract Wrapper

Create `contracts/src/lib.rs` to wrap the verifier:

```rust
#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, Env, Vec, Bytes};

mod verifier;
use verifier::groth16;

#[contract]
pub struct Groth16Verifier;

#[contractimpl]
impl Groth16Verifier {
    /// Verify a Groth16 proof
    pub fn verify(env: Env, proof: Bytes, public_inputs: Bytes) -> bool {
        // Deserialize proof
        let proof_data = Self::parse_proof(&proof);

        // Deserialize public inputs
        let pub_inputs = Self::parse_public_inputs(&public_inputs);

        // Verify using generated code
        groth16::verify(&proof_data, &pub_inputs)
    }

    fn parse_proof(proof: &Bytes) -> groth16::Proof {
        // Parse proof bytes into Proof struct
        // Format: [A.x || A.y || B.x || B.y || C.x || C.y]
        // Each coordinate is 32 bytes (field element)
        todo!("Implement proof parsing")
    }

    fn parse_public_inputs(inputs: &Bytes) -> Vec<groth16::Fr> {
        // Parse public inputs
        // Each input is 32 bytes (field element)
        todo!("Implement input parsing")
    }
}
```

### Add Cargo Configuration

`contracts/Cargo.toml`:

```toml
[package]
name = "groth16-verifier"
version = "0.1.0"
edition = "2021"

[lib]
crate-type = ["cdylib"]

[dependencies]
soroban-sdk = "20.0.0"

[dev-dependencies]
soroban-sdk = { version = "20.0.0", features = ["testutils"] }

[profile.release]
opt-level = "z"
overflow-checks = true
debug = false
strip = "symbols"
lto = true
panic = "abort"
codegen-units = 1
```

## Step 3: Build the Contract

```bash
cd contracts

# Build for WASM
cargo build --target wasm32-unknown-unknown --release

# Optimize WASM (reduces size by ~50%)
wasm-opt --strip-debug -Oz \
  target/wasm32-unknown-unknown/release/groth16_verifier.wasm \
  -o verifier-optimized.wasm

# Check size
ls -lh verifier-optimized.wasm
# Expected: ~20-30 KB
```

### Troubleshooting Build Issues

**Error: `wasm-opt` not found**
```bash
# Install binaryen
# macOS
brew install binaryen

# Linux
sudo apt-get install binaryen
```

**Error: Large WASM size (>100 KB)**
- Ensure `opt-level = "z"` in Cargo.toml
- Run `wasm-opt` with `-Oz` flag
- Check for debug symbols: `wasm-strip verifier.wasm`

## Step 4: Deploy to Stellar

### Deploy to Testnet

```bash
# Deploy contract
soroban contract deploy \
  --wasm verifier-optimized.wasm \
  --source alice \
  --network testnet

# Output:
# CDB6XVJW5NMV4UVEDKSR6UO4DRBNWRQEMYKRYZI3CW6YK3O7HAZA43OI
```

Save this contract ID - you'll need it for verification!

### Deploy to Mainnet

```bash
# IMPORTANT: Test thoroughly on testnet first!

# Deploy to mainnet
soroban contract deploy \
  --wasm verifier-optimized.wasm \
  --source alice \
  --network mainnet \
  --fee 1000000
```

**Cost:** ~1-2 XLM for deployment fees

## Step 5: Test the Deployment

### Generate Test Proof

```bash
# Create test input
cat > test_input.json << EOF
{
  "age": "25",
  "balance": "1000",
  "country": "1",
  "minAge": "18",
  "maxAge": "99",
  "minBalance": "100",
  "allowedCountries": ["1", "2", "3", "0", "0", "0", "0", "0", "0", "0"]
}
EOF

# Generate proof
snarkjs groth16 fullprove \
  test_input.json \
  circuits/build/circuit.wasm \
  circuits/build/circuit_final.zkey \
  proof.json \
  public.json
```

### Invoke Contract

```bash
# Prepare proof bytes (hex-encoded)
PROOF_HEX=$(cat proof.json | jq -r '.proof' | xxd -p | tr -d '\n')

# Prepare public inputs (hex-encoded)
PUBLIC_HEX=$(cat public.json | jq -r '.[]' | xxd -p | tr -d '\n')

# Invoke contract
soroban contract invoke \
  --id YOUR_CONTRACT_ID \
  --source alice \
  --network testnet \
  -- \
  verify \
  --proof "$PROOF_HEX" \
  --public_inputs "$PUBLIC_HEX"

# Expected output:
# true
```

## Step 6: Monitor & Optimize

### Check Contract Info

```bash
# Get contract details
soroban contract info \
  --id YOUR_CONTRACT_ID \
  --network testnet

# Check WASM size
soroban contract fetch \
  --id YOUR_CONTRACT_ID \
  --network testnet \
  --out-file downloaded.wasm

ls -lh downloaded.wasm
```

### Gas Profiling

```bash
# Simulate transaction to see gas usage
soroban contract invoke \
  --id YOUR_CONTRACT_ID \
  --source alice \
  --network testnet \
  -- \
  verify \
  --proof "$PROOF_HEX" \
  --public_inputs "$PUBLIC_HEX" \
  | jq '.result.cost'
```

### Optimization Tips

**Reduce Gas Costs:**
1. **Minimize public inputs** - Fewer inputs = less computation
2. **Batch verifications** - Verify multiple proofs in one transaction
3. **Cache verification keys** - Don't recompute constants

**Reduce WASM Size:**
1. **Remove debug symbols** - `wasm-strip`
2. **Use `opt-level = "z"`** - Maximum size optimization
3. **Enable LTO** - Link-time optimization in Cargo.toml

## Production Checklist

Before deploying to mainnet:

- [ ] **Security audit** - Review verifier code
- [ ] **Trusted setup ceremony** - Don't use test keys
- [ ] **Testnet validation** - 100+ successful verifications
- [ ] **Gas profiling** - Ensure costs are acceptable
- [ ] **WASM size check** - Should be <50 KB
- [ ] **Error handling** - Test with invalid proofs
- [ ] **Documentation** - Document your contract API
- [ ] **Backup keys** - Store zkey and vkey securely

## Common Issues

### Issue: "Invalid proof format"

**Cause:** Proof serialization doesn't match contract expectations

**Fix:** Ensure proof is serialized correctly:
```rust
// Proof format: [A.x || A.y || B.x.c0 || B.x.c1 || B.y.c0 || B.y.c1 || C.x || C.y]
// Each element: 32 bytes big-endian
```

### Issue: "Transaction failed: Budget exceeded"

**Cause:** Verification uses too much gas

**Fix:**
- Reduce circuit complexity
- Optimize WASM build
- Increase gas limit in transaction

### Issue: "WASM too large (>200 KB)"

**Cause:** Debug symbols or unoptimized build

**Fix:**
```bash
# Rebuild with optimizations
cargo clean
cargo build --target wasm32-unknown-unknown --release
wasm-opt -Oz verifier.wasm -o optimized.wasm
wasm-strip optimized.wasm
```

## Next Steps

- **[Contract API →](./contract-api)** - Integrate verifier in your dApp
- **[Security Best Practices →](../advanced/security)** - Secure your deployment
- **[Monitoring →](../advanced/monitoring)** - Track verification metrics

## Resources

- [Soroban Documentation](https://soroban.stellar.org/docs)
- [Stellar Expert](https://stellar.expert/) - Block explorer
- [Groth16 Paper](https://eprint.iacr.org/2016/260.pdf) - Technical details

---

**Need help?** [GitHub Discussions](https://github.com/xcapit/openzktool/discussions)
