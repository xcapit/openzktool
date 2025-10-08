# 🚀 Quick Start - KYC Transfer Demo

## ⚡ Ejecutar Demo (1 comando)

```bash
bash circuits/scripts/demo.sh
```

Este script automatizado ejecuta todo el flujo de prueba zero-knowledge:

✅ Compila el circuito
✅ Ejecuta el Trusted Setup (si es necesario)
✅ Crea un input de ejemplo
✅ Genera el witness
✅ Crea la prueba ZK
✅ Verifica la prueba
✅ Exporta el verifier Solidity

---

## 📊 ¿Qué demuestra?

Un usuario con:
- **Edad**: 25 años (privado)
- **Balance**: $150 (privado)
- **País**: Argentina - ID 32 (privado)

Puede **probar** que cumple con los requisitos KYC:
- ✓ Edad entre 18-99
- ✓ Balance ≥ $50
- ✓ País permitido (ID 32)

**SIN revelar** sus datos exactos. Solo muestra: `kycValid = 1`

---

## 📝 Para más detalles

Ver: [DEMO.md](./DEMO.md) - Guía completa paso a paso para el video

---

## 🎬 Resultado de la Demo

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎉 SUCCESS! Proof verified!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📌 Summary:
   ✓ User is 25 years old (NOT revealed)
   ✓ User has balance of $150 (NOT revealed)
   ✓ User is from Argentina - ID 32 (NOT revealed)
   ✓ Public output: kycValid = 1 (VERIFIED)

🔐 The verifier confirmed the proof WITHOUT seeing:
   • The actual age
   • The actual balance
   • The actual country ID

✨ This is the power of Zero-Knowledge Proofs!
```

---

## 🛠️ Prerequisitos

```bash
node --version  # >= v16
circom --version  # >= 2.1.9
npm install  # Instala snarkjs y circomlib
```

---

## 📁 Archivos Generados

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
