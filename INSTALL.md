# Installation Guide

Quick guide to install all dependencies needed to run OpenZKTool.

## Prerequisites

You need these tools installed on your system:

### 1. Node.js (v16 or higher)

**macOS:**
```bash
brew install node
```

**Ubuntu/Debian:**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

**Verify:**
```bash
node --version  # should show v16.0.0 or higher
npm --version
```

### 2. Circom (v2.1.9 or higher)

**macOS/Linux:**
```bash
curl --proto '=https' --tlsv1.2 https://sh.rustup.rs -sSf | sh
source $HOME/.cargo/env
git clone https://github.com/iden3/circom.git
cd circom
cargo build --release
cargo install --path circom
```

**Verify:**
```bash
circom --version  # should show 2.1.9 or higher
```

### 3. jq (JSON processor)

**macOS:**
```bash
brew install jq
```

**Ubuntu/Debian:**
```bash
sudo apt-get install jq
```

**Verify:**
```bash
jq --version
```

## Quick Installation

Once you have the prerequisites installed:

```bash
# Clone the repository
git clone https://github.com/xcapit/openzktool.git
cd openzktool

# Install npm dependencies (includes snarkjs)
npm install

# Run circuit setup (one-time, takes 2-3 minutes)
npm run setup

# Verify installation by running tests
npm test
```

## Troubleshooting

### Problem: "circom: command not found"

Make sure `~/.cargo/bin` is in your PATH:
```bash
echo 'export PATH="$HOME/.cargo/bin:$PATH"' >> ~/.bashrc  # or ~/.zshrc
source ~/.bashrc  # or ~/.zshrc
```

### Problem: "snarkjs: command not found"

snarkjs should be installed as a dependency. If you have issues:
```bash
npm install -g snarkjs@0.7.4
```

### Problem: "Setup fails with memory error"

The circuit compilation needs at least 4GB RAM. If you have less:
```bash
# Use a smaller Powers of Tau parameter (will reduce security)
# Edit circuits/scripts/prepare_and_setup.sh
# Change: powersoftau new bn128 12
# To:     powersoftau new bn128 10
```

### Problem: "npm install fails"

Clear npm cache and try again:
```bash
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

## Verify Everything Works

Run the complete demo:
```bash
./DEMO_COMPLETE.sh
```

This should:
1. Check all dependencies
2. Compile the circuit (if needed)
3. Generate a proof
4. Verify the proof

If this runs successfully, your installation is complete!

## Minimal Installation (Testing Only)

If you just want to test proof generation without blockchain deployment:

```bash
npm install
npm run setup
npm run prove
```

This will:
- Compile the circuit
- Generate a proof
- Verify it locally (no blockchain needed)

## Platform-Specific Notes

### macOS (Apple Silicon M1/M2)

Everything should work out of the box. If you see architecture warnings with Rust:
```bash
rustup target add x86_64-apple-darwin
```

### Windows

We recommend using WSL2 (Windows Subsystem for Linux). Then follow the Ubuntu/Debian instructions.

## Getting Help

If you encounter issues:

1. Check [Troubleshooting](./docs/TROUBLESHOOTING.md)
2. Open an issue: https://github.com/xcapit/openzktool/issues
3. Check existing issues for similar problems

## Next Steps

After installation:
- Read [Simple Explanation](./docs/EXPLICACION_SIMPLE.md) to understand how it works
- Try [Quick Start](./README.md#quick-start) examples
- Read [Documentation Hub](./docs/README.md) for more details
