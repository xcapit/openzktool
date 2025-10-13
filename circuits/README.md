# Zero-Knowledge Circuits

This directory contains the Circom circuits for generating zero-knowledge proofs.

## Overview

The circuits enable privacy-preserving proofs on Stellar:
- Prove you know a secret without revealing it
- Foundation for private transfers, KYC verification, and compliance
- Uses ZK-SNARKs (Groth16) for cryptographic guarantees

---

## Quick Start

### Prerequisites

Install Circom (circuit compiler)
npm install -g circom@2.1.6

Install SnarkJS (proof generation)
npm install -g snarkjs@0.7.3

Verify installations
circom --version
snarkjs --version

### Setup (First Time)

1. Install dependencies
npm install

2. Compile circuit
chmod +x scripts/*.sh
./scripts/compile.sh

3. Generate keys (~2 minutes, one-time setup)
./scripts/generate_keys.sh

4. Test proof generation
npm test

Expected Output:
Testing Zero-Knowledge Proof Generation
Secret Value: 12345 (PRIVATE - not revealed)
Public Hash: 8934712934871234... (PUBLIC)
Proof generated in 847ms
Proof VALID
Proof saved to proof.json

---

## Circuit: SimpleProof

### Purpose
Prove knowledge of a secret value without revealing it.

### Mathematical Formula
hash(secretValue) = publicHash

Where:
- secretValue (PRIVATE) - Only the prover knows
- publicHash (PUBLIC) - Everyone can see
- hash() - Poseidon hash function (ZK-friendly)

### Inputs

| Input        | Type  | Visibility | Description           |
|--------------|-------|------------|-----------------------|
| secretValue  | Field | Private    | Secret only you know  |
| publicHash   | Field | Public     | Hash
