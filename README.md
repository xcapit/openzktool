# Stellar Privacy Proof-of-Concept

This project demonstrates cross-verification of **zero-knowledge credentials** on both **EVM** and **Soroban** smart contracts.  
It provides circuits, proof generation scripts, and on-chain verifier templates for multi-chain privacy validation.

---

## 🧠 Concept

We implement two credential types validated across blockchains:

1. **Age Credential** → proves a user is older than a certain age.
2. **Solvency Credential** → proves an account’s balance exceeds a minimum threshold.

Each credential is built as a Circom circuit, proved using Groth16, and then verified by both Solidity (EVM) and Rust (Soroban) smart contracts.

---

## ⚙️ Project Structure

```
circuits/              # All Circom circuits and scripts
├── range_proof.circom         # Age range proof
├── solvency_check.circom      # Wallet solvency check
├── compliance_verify.circom   # Country compliance
├── kyc_transfer.circom        # Combined multi-proof
├── scripts/
│   ├── build_all.sh           # Compile all circuits
│   ├── prove_all.sh           # Generate & verify proofs
│   └── export_verifiers.sh    # Export Solidity + Soroban verifiers
evm/
└── soroban/
```

---

## 🚀 Build the Circuits

```bash
cd circuits/scripts
bash build_all.sh
```

Artifacts are generated in `circuits/artifacts/`.

---

## 🧩 Generate and Verify Proofs

```bash
bash circuits/scripts/prove_all.sh
```

This will:
- Generate an input JSON (`artifacts/input.json`)
- Build a witness
- Create and verify a Groth16 proof for `kyc_transfer`

---

## 🔗 Export Verifiers

```bash
bash circuits/scripts/export_verifiers.sh
```

Outputs:
- `evm/Verifier.sol` → Solidity verifier (EVM)
- `soroban/verifier_contract.rs` → Soroban verifier (Rust, no_std)

---

## 🧱 Next Steps

- Integrate the Solidity verifier into a contract on Ethereum or Polygon.
- Deploy the Soroban verifier to the Stellar testnet.
- Connect both via an off-chain aggregator or cross-chain oracle (future work).

---

## 🪪 License

AGPL-3.0-or-later © Xcapit Labs  
Contributors: Xcapit R&D Team
