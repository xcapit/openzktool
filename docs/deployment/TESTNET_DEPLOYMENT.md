# 🌐 Testnet Deployment - OpenZKTool

**Live Stellar Soroban Contract on Testnet**

This document provides details about the OpenZKTool Groth16 verifier contract deployed on Stellar testnet.

---

## 📋 Deployment Summary

**Date:** October 11, 2024
**Network:** Stellar Testnet (Test SDF Network ; September 2015)
**Contract Type:** Groth16 ZK Proof Verifier
**Language:** Rust (no_std)
**Framework:** Soroban SDK v21.7.7

---

## 🔗 Contract Information

### Contract ID
```
CBPBVJJW5NMV4UVEDKSR6UO4DRBNWRQEMYKRYZI3CW6YK3O7HAZA43OI
```

### Explorer Links

**Contract Page:**
https://stellar.expert/explorer/testnet/contract/CBPBVJJW5NMV4UVEDKSR6UO4DRBNWRQEMYKRYZI3CW6YK3O7HAZA43OI

**Deployment Transaction:**
https://stellar.expert/explorer/testnet/tx/39654bd739908d093d6d7e9362ea5cae3298332b3c7e385c49996ba08796cefc

---

## 📦 WASM Details

**WASM Hash:**
```
22d814196149e8f8d3eaa56ff20ba2e1292e7eb66ddfade8c3e00d88c2f135a5
```

**WASM Size:** 2.1 KB (highly optimized)

**Source Code:** [soroban/src/lib.rs](./soroban/src/lib.rs)

---

## 🔧 Contract Functions

### `version() -> u32`
Returns the contract version number.

**Example:**
```bash
stellar contract invoke \
  --id CBPBVJJW5NMV4UVEDKSR6UO4DRBNWRQEMYKRYZI3CW6YK3O7HAZA43OI \
  --source alice \
  --network testnet \
  -- \
  version
```

**Response:** `1`

### `verify_proof(...)`
Verifies a Groth16 zero-knowledge proof.

**Parameters:**
- Proof components (A, B, C points on BN254 curve)
- Public signals

**Returns:** Boolean (proof valid or invalid)

---

## 👤 Deployment Account

**Address:**
```
GAEIO5GF6JAQXG7YK3YI7I3ZIAZAXD3P2FMBSRUFYDME54AT2LVKZO73
```

**Network:** Stellar Testnet
**Funded via:** Stellar Friendbot

---

## 🛠️ How to Interact

### Prerequisites
```bash
# Install Stellar CLI
cargo install --locked stellar-cli --features opt

# Configure testnet
stellar network add testnet \
  --rpc-url https://soroban-testnet.stellar.org \
  --network-passphrase "Test SDF Network ; September 2015"
```

### Call Contract Functions

**Check version:**
```bash
stellar contract invoke \
  --id CBPBVJJW5NMV4UVEDKSR6UO4DRBNWRQEMYKRYZI3CW6YK3O7HAZA43OI \
  --source alice \
  --network testnet \
  -- \
  version
```

**Verify a proof:** (requires proof data)
```bash
stellar contract invoke \
  --id CBPBVJJW5NMV4UVEDKSR6UO4DRBNWRQEMYKRYZI3CW6YK3O7HAZA43OI \
  --source alice \
  --network testnet \
  -- \
  verify_proof \
  --proof <proof_data> \
  --public_signals <signals>
```

---

## 🏗️ Technical Details

### Contract Features
- ✅ Groth16 SNARK verification
- ✅ BN254 elliptic curve operations
- ✅ Public signal validation
- ✅ Version tracking
- ✅ Error handling
- ✅ No_std implementation (minimal footprint)

### Performance
- **Proof Size:** ~800 bytes
- **Verification Time:** <50ms (off-chain simulation)
- **Contract Size:** 2.1 KB WASM

### Security
- Implements standard Groth16 verification algorithm
- BN254 curve (alt_bn128) - battle-tested in production systems
- No external dependencies (no_std)
- Open source under AGPL-3.0

---

## 📊 Transaction History

### Deployment Transaction

**Hash:** `39654bd739908d093d6d7e9362ea5cae3298332b3c7e385c49996ba08796cefc`

**Operations:**
1. Upload WASM code
2. Create contract instance
3. Initialize contract state

**Fee:** Minimal (testnet)

**Status:** ✅ Successful

**Explorer:**
https://stellar.expert/explorer/testnet/tx/39654bd739908d093d6d7e9362ea5cae3298332b3c7e385c49996ba08796cefc

---

## 🔄 Redeployment Instructions

To redeploy or upgrade the contract:

```bash
# Navigate to soroban directory
cd soroban

# Build contract
cargo build --target wasm32-unknown-unknown --release

# Deploy to testnet
stellar contract deploy \
  --wasm target/wasm32-unknown-unknown/release/soroban_groth16_verifier.wasm \
  --source alice \
  --network testnet
```

---

## 🧪 Testing

### Run Local Tests
```bash
cd soroban
cargo test
```

### Test on Testnet
```bash
# Run deployment script
bash verify_on_chain.sh
```

---

## 📚 Related Documentation

- **Main README:** [README.md](./README.md)
- **Analytics:** [ANALYTICS.md](./ANALYTICS.md)
- **Soroban Source:** [soroban/src/lib.rs](./soroban/src/lib.rs)
- **Circuit Documentation:** [circuits/README.md](./circuits/README.md)

---

## 🔗 Useful Links

- **Stellar Testnet Explorer:** https://stellar.expert/explorer/testnet
- **Soroban Docs:** https://soroban.stellar.org/docs
- **Stellar CLI:** https://github.com/stellar/stellar-cli
- **Project Repository:** https://github.com/xcapit/openzktool

---

## 🎯 Next Steps

1. **Phase 1 (MVP):** Deploy to multiple testnets (Ethereum Sepolia, Polygon Amoy)
2. **Phase 2:** Public API for proof verification
3. **Phase 3:** Mainnet deployment after security audit (Q1 2026)

---

## 📞 Support

For questions or issues:
- **GitHub Issues:** https://github.com/xcapit/openzktool/issues
- **Email:** fer@xcapit.com
- **Twitter:** [@xcapit_](https://twitter.com/xcapit_)

---

**Last Updated:** October 11, 2024
**Team:** X1 - Xcapit Labs
**Status:** ✅ Live on Testnet
