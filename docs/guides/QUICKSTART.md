# Quick Start - KYC Transfer Demo

## Run Demo (1 command)

```bash
bash circuits/scripts/demo.sh
```

This automated script runs the complete zero-knowledge proof flow:

- Compiles the circuit
- Runs Trusted Setup (if needed)
- Creates example input
- Generates witness
- Creates ZK proof
- Verifies proof
- Exports Solidity verifier

## What it demonstrates

A user with:
- Age: 25 years (private)
- Balance: $150 (private)
- Country: Argentina - ID 32 (private)

Can prove they meet KYC requirements:
- Age between 18-99
- Balance ≥ $50
- Country allowed (ID 32)

WITHOUT revealing their exact data. Only shows: `kycValid = 1`

## For more details

See: [DEMO.md](./DEMO.md) - Complete step-by-step guide

## Demo Result

```
SUCCESS! Proof verified!

Summary:
   - User is 25 years old (NOT revealed)
   - User has balance of $150 (NOT revealed)
   - User is from Argentina - ID 32 (NOT revealed)
   - Public output: kycValid = 1 (VERIFIED)

The verifier confirmed the proof WITHOUT seeing:
   • The actual age
   • The actual balance
   • The actual country ID

This is the power of Zero-Knowledge Proofs.
```

## Prerequisites

```bash
node --version  # >= v16
circom --version  # >= 2.1.9
npm install  # Installs snarkjs and circomlib
```

## Generated Files

Después de ejecutar la demo:

```
artifacts/
├── kyc_transfer.r1cs           # Sistema de restricciones
├── kyc_transfer.wasm           # Calculador de witness
├── kyc_transfer_final.zkey     # Clave de prueba
├── kyc_transfer_vkey.json      # Clave de verificación
├── input.json                  # Input de ejemplo
├── witness.wtns                # Testigo calculado
├── proof.json                  # Prueba ZK (806 bytes)
└── public.json                 # Output público ["1"]

evm/
└── Verifier.sol                # Smart contract Solidity
```

---

## 🎥 Para grabar el video

Simplemente ejecuta:

```bash
bash circuits/scripts/demo.sh
```

Y muestra el output en pantalla. La demo es completamente autoexplicativa.

**Tiempo estimado**: 30 segundos - 1 minuto

---

## 🔗 Links

- [DEMO.md](./DEMO.md) - Documentación completa
- [README.md](./README.md) - Documentación del proyecto
- [Repositorio](https://github.com/xcapit/stellar-privacy-poc)
