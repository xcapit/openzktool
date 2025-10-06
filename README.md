# Stellar Privacy PoC

This repository is a **proof of concept (PoC)** for integrating **Zero-Knowledge Proofs (ZKPs)** into the Stellar ecosystem via Soroban smart contracts.  
The core aim is to build a bridge between privacy in Stellar and interoperability with zkEVM / external provers.
=======
**Zero-Knowledge Privacy Toolkit for Financial Institutions on Stellar/Soroban**

[![License](https://www.gnu.org/graphics/lgplv3-88x31.png)](LICENSE)
[![Stellar](https://img.shields.io/badge/Stellar-Soroban-brightgreen)](https://soroban.stellar.org)

---

## 🧭 Goals & Vision

- Demonstrate generation and verification of ZK proofs using **Groth16 over BN254**.  
- Deploy a verifier on **Soroban** (Stellar’s smart contract platform).  
- Deploy a compatible verifier on **EVM / zkEVM** networks.  
- Define an interoperable proof format (`ProofEnvelope`) to facilitate cross-chain validation.  
- Lay the foundation for privacy-preserving finance tools that can span Stellar and Layer‑1/Layer‑2 ecosystems.

---

## 📂 Repository Structure

```
stellar-privacy-poc/
│
├── circuits/                # ZK circuit definitions, proofs, keys
│   ├── range_circuit.circom
│   ├── powersOfTau.ptau
│   ├── range_setup.zkey
│   ├── verification_key.json
│   ├── proof.json
│   └── public.json
│
├── soroban/                 # Soroban smart contracts (Rust / WASM)
│   ├── Cargo.toml
│   └── src/
│       ├── lib.rs
│       └── verifier.rs
│
├── evm/                     # Solidity verifier for zkEVM / EVM
│   ├── contracts/Verifier.sol
│   └── hardhat.config.js
│
├── scripts/                 # Automation scripts (proof generation & verification)
│   ├── generate-proof.sh
│   ├── verify-on-soroban.sh
│   └── verify-on-evm.sh
│
├── docs/
│   └── ProofEnvelope.md     # spec for interoperable proof format
│
└── README.md                # this file
```

---

## 🧩 Installing Circom on macOS (M1 / M2 ARM64)

> Circom is the circuit compiler used in this PoC to build zk proofs. On Apple Silicon (ARM64), compiling from source ensures compatibility.

### 1️⃣ Install dependencies

```bash
brew install rustup cmake pkg-config libtool autoconf automake nasm
rustup-init
source $HOME/.cargo/env
```

Ensure you have a sufficiently recent Rust:

```bash
rustup update stable
rustup default stable
rustc --version
```

> Requirement: Rust ≥ 1.70

---

### 2️⃣ Clone & build Circom

```bash
cd /tmp
git clone https://github.com/iden3/circom.git
cd circom
cargo build --release
```

If you run into assembly / NASM / architecture errors, install Rosetta and rebuild:

```bash
softwareupdate --install-rosetta --agree-to-license
cargo clean
cargo build --release
```

---

### 3️⃣ Install the binary

```bash
sudo cp target/release/circom /usr/local/bin/
circom --version
```

You should see something like:

```
circom compiler 2.x.x
```

---

### 4️⃣ Quick test

Validate the installation with a minimal circuit:

```bash
echo "template Test() { signal input a; signal output b; b <== a*a; } component main = Test();" > test.circom
circom test.circom --r1cs --wasm
```

If it outputs `test.r1cs` and `test.wasm`, the installation succeeded ✅.

---

### 💡 Alternative (no build)

You may skip source build and install via NPM:

```bash
npm install -g circom
```

This version runs under Rosetta on M1/M2, which is slower but more convenient.

---

## ⚙️ Quickstart: End‑to‑end flow

1. **Install Circom** per the instructions above.  
2. **Generate circuit & proof** inside `circuits/`:

   ```bash
   cd circuits
   circom range_circuit.circom --r1cs --wasm --sym
   snarkjs powersoftau new bn128 12 pot12_0000.ptau
   snarkjs powersoftau contribute pot12_0000.ptau pot12_final.ptau
   snarkjs groth16 setup range_circuit.r1cs pot12_final.ptau range_setup.zkey
   snarkjs zkey export verificationkey range_setup.zkey verification_key.json
   snarkjs groth16 prove range_setup.zkey input.json proof.json public.json
   ```

3. **Compile & deploy Soroban contract**:

   ```bash
   cd soroban
   cargo build --target wasm32-unknown-unknown --release
   # deploy via soroban CLI
   ```

4. **Verify the proof**:

   ```bash
   ./scripts/verify-on-soroban.sh
   ./scripts/verify-on-evm.sh
   ```

---

## 🔐 License

This project is licensed under **AGPL v3**. See the [LICENSE](LICENSE) file for the complete text.

---

© 2025 Xcapit — Blockchain & Privacy Innovation

