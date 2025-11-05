# Configuration Files

> Centralized configuration for OpenZKTool

## 📁 Files

```
config/
├── README.md                    # This file
├── contracts.json               # Contract addresses and network info
└── contracts.schema.json        # JSON schema for validation
```

---

## 📝 contracts.json

Centralized storage for all deployed contract addresses across networks.

### Structure

```json
{
  "contracts": {
    "soroban": {
      "testnet": { ... },
      "mainnet": { ... }
    },
    "evm": {
      "ethereum": {
        "sepolia": { ... },
        "mainnet": { ... }
      },
      "polygon": { ... },
      "arbitrum": { ... },
      "optimism": { ... }
    },
    "local": { ... }
  }
}
```

### Usage

#### TypeScript/JavaScript

```typescript
import contracts from '../config/contracts.json';

// Get Soroban testnet contract
const sorobanTestnet = contracts.contracts.soroban.testnet;
console.log('Contract ID:', sorobanTestnet.contractId);
console.log('RPC URL:', sorobanTestnet.rpcUrl);

// Get Ethereum Sepolia contract
const ethSepolia = contracts.contracts.evm.ethereum.sepolia;
console.log('Contract Address:', ethSepolia.contractAddress);
console.log('Chain ID:', ethSepolia.chainId);
```

#### Rust

```rust
use serde_json::Value;
use std::fs;

fn load_contracts() -> Value {
    let content = fs::read_to_string("config/contracts.json")
        .expect("Failed to read contracts.json");
    serde_json::from_str(&content).expect("Failed to parse JSON")
}

fn main() {
    let contracts = load_contracts();
    let soroban_testnet = &contracts["contracts"]["soroban"]["testnet"];
    println!("Contract ID: {}", soroban_testnet["contractId"]);
}
```

#### Shell Scripts

```bash
#!/bin/bash

# Using jq
SOROBAN_CONTRACT=$(jq -r '.contracts.soroban.testnet.contractId' config/contracts.json)
SOROBAN_RPC=$(jq -r '.contracts.soroban.testnet.rpcUrl' config/contracts.json)

echo "Deploying to: $SOROBAN_CONTRACT"
echo "RPC: $SOROBAN_RPC"
```

---

## 🔄 Updating Contracts

When deploying a new contract:

1. Deploy the contract
2. Update `contracts.json` with:
   - `contractAddress` or `contractId`
   - `deployedAt` timestamp
   - `deployer` name
   - `txHash` transaction hash
   - `version` contract version
   - `status: "active"`

Example:

```json
{
  "contractAddress": "0x1234567890123456789012345678901234567890",
  "network": "sepolia",
  "chainId": 11155111,
  "deployedAt": "2025-01-14T12:00:00Z",
  "deployer": "fboiero",
  "txHash": "0xabc123...",
  "version": 4,
  "status": "active"
}
```

---

## 🔐 Security Notes

- - This file contains **public** contract addresses
- - Safe to commit to git
- ❌ Do NOT include:
  - Private keys
  - Mnemonics
  - API keys
  - Wallet addresses (unless public)

---

## Validation

Validate `contracts.json` against schema:

```bash
# Using ajv-cli
npm install -g ajv-cli
ajv validate -s config/contracts.schema.json -d config/contracts.json
```

---

## 📊 Status Values

| Status | Meaning |
|--------|---------|
| `active` | Contract deployed and operational |
| `not_deployed` | Planned but not yet deployed |
| `deprecated` | Old version, no longer recommended |
| `ephemeral` | Temporary (local development) |

---

## 🌐 Network Information

### Soroban
- **Testnet:** https://soroban-testnet.stellar.org
- **Mainnet:** https://soroban-rpc.stellar.org
- **Explorer:** https://stellar.expert/

### EVM Chains
- **Ethereum Sepolia:** Chain ID 11155111
- **Polygon Amoy:** Chain ID 80002
- **Arbitrum Sepolia:** Chain ID 421614
- **Optimism Sepolia:** Chain ID 11155420

---

## 📚 Related Documentation

- [Soroban Deployment Guide](../docs/deployment/SOROBAN.md)
- [EVM Deployment Guide](../docs/deployment/EVM.md)
- [Testing Guide](../docs/testing/README.md)
