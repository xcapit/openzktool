# 🔐 Stellar Privacy SDK - Proof of Concept

**Zero-Knowledge Privacy Toolkit for Financial Institutions on Stellar/Soroban**

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)
[![Stellar](https://img.shields.io/badge/Stellar-Soroban-brightgreen)](https://soroban.stellar.org)

> Proof of Concept for [Stellar Development Foundation (SDF)](https://stellar.org) grant application

---

## 🎯 What This Proves

This POC demonstrates end-to-end zero-knowledge privacy on Stellar:

1. ✅ **ZK Circuit**: Generate zero-knowledge proofs using Circom
2. ✅ **Soroban Verifier**: Verify proofs on-chain (Stellar testnet)
3. ✅ **JavaScript SDK**: Developer-friendly API
4. ✅ **Working Demo**: Interactive proof generation and verification

**Use Case:** Prove knowledge of a secret value without revealing it - the foundation for private transfers, KYC verification, and compliance checks.

---

## 🏗️ Architecture
┌─────────────────────────────────────────────────────┐
│               Stellar Privacy POC                    │
├─────────────────────────────────────────────────────┤
│                                                      │
│  Browser/Node.js                                    │
│  ┌──────────────────────────────────────┐          │
│  │  1. Generate ZK Proof (off-chain)    │          │
│  │     Input: secret value              │          │
│  │     Output: proof + public hash      │          │
│  └──────────────┬───────────────────────┘          │
│                 │                                    │
│                 ▼                                    │
│  ┌──────────────────────────────────────┐          │
│  │  2. Submit to Soroban (on-chain)     │          │
│  │     Contract verifies proof          │          │
│  │     Public sees: ✅ Valid            │          │
│  │     Secret remains hidden            │          │
│  └──────────────────────────────────────┘          │
│                                                      │
└─────────────────────────────────────────────────────┘

---

## 🚀 Quick Start

### Prerequisites

- **Node.js 18+** and npm
- **Rust 1.70+**: `curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh`
- **Soroban CLI**: `cargo install --locked soroban-cli --version 20.0.0`
- **Circom**: `npm install -g circom@2.1.6`
- **SnarkJS**: `npm install -g snarkjs@0.7.3`

### Installation
```bash
# Clone repository
git clone https://github.com/xcapit/stellar-privacy-poc.git
cd stellar-privacy-poc

# Install dependencies
npm install
