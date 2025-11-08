---
sidebar_position: 1
---

# Installation

Get OpenZKTool up and running in minutes.

## Prerequisites

Before you start, make sure you have:

- **Node.js v16+** - [Download here](https://nodejs.org/)
- **Rust 1.75+** - Required for Circom compilation
- **Circom v2.1.9+** - ZK circuit compiler

### Install Rust

```bash
curl --proto '=https' --tlsv1.2 https://sh.rustup.rs -sSf | sh
source $HOME/.cargo/env
```

### Install Circom

```bash
git clone https://github.com/iden3/circom.git
cd circom
cargo build --release
cargo install --path circom

# Verify installation
circom --version
```

### Install jq (JSON processor)

```bash
# macOS
brew install jq

# Linux
sudo apt-get install jq
```

## Clone the Repository

```bash
git clone https://github.com/xcapit/openzktool.git
cd openzktool
```

## Install Dependencies

```bash
npm install
```

This installs:
- `snarkjs` - Proof generation library
- `circomlib` - Circuit component library
- Other development dependencies

## Compile Circuits & Generate Keys

This is a one-time setup that takes 2-3 minutes:

```bash
npm run setup
```

This command:
1. Compiles the `kyc_transfer` circuit
2. Generates proving and verification keys
3. Exports Soroban verifier contract

**Output:**
```
✓ Circuit compiled successfully
✓ Trusted setup complete
✓ Verification key generated
✓ Soroban contract ready
```

## Verify Installation

Run the test suite to make sure everything works:

```bash
npm test
```

You should see:
```
[1/4] Compiling circuit...        ✓
[2/4] Generating proof...         ✓
[3/4] Verifying proof locally...  ✓
[4/4] Verifying on Stellar...     ✓

All tests passed!
```

## Project Structure

After installation, your directory should look like this:

```
openzktool/
├── circuits/
│   ├── kyc_transfer.circom     # Main circuit
│   ├── build/                  # Compiled artifacts
│   │   ├── kyc_transfer.wasm
│   │   ├── kyc_transfer_final.zkey
│   │   └── verification_key.json
│   └── scripts/                # Build scripts
├── contracts/                  # Soroban contracts
│   └── src/lib.rs             # Verifier contract
├── examples/                   # Example integrations
└── docs/                       # Documentation

```

## Troubleshooting

### Circom not found

If you get "circom: command not found":

```bash
# Make sure cargo bin is in your PATH
export PATH="$HOME/.cargo/bin:$PATH"

# Or add to your shell profile
echo 'export PATH="$HOME/.cargo/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
```

### npm install fails

If `npm install` fails with dependency errors:

```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### Circuit compilation timeout

If circuit compilation takes too long or times out:

```bash
# Increase Node.js memory limit
NODE_OPTIONS="--max-old-space-size=4096" npm run setup
```

## Next Steps

Now that OpenZKTool is installed:

- **[Quick Start →](./quick-start)** - Generate your first proof
- **[Stellar Integration →](../stellar-integration/overview)** - Deploy to Soroban
- **[Circuit Templates →](../circuit-templates/kyc-transfer)** - Explore pre-built circuits

## System Requirements

**Minimum:**
- CPU: 2 cores
- RAM: 4 GB
- Disk: 2 GB free space

**Recommended:**
- CPU: 4+ cores
- RAM: 8 GB
- Disk: 5 GB free space (for circuit compilation)

## Docker Installation (Alternative)

Prefer Docker? We provide a containerized environment:

```bash
# Coming soon
docker pull xcapit/openzktool:latest
docker run -it xcapit/openzktool
```

---

**Having issues?** [Open an issue on GitHub](https://github.com/xcapit/openzktool/issues)
