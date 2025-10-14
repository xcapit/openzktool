# 🎬 Demo: Circuito KYC Transfer - Prueba Zero-Knowledge

Este documento describe paso a paso cómo ejecutar una demostración completa del circuito **KYCTransfer** implementado en Circom y snarkjs.

---

## 📋 Prerequisitos

Antes de comenzar, asegúrate de tener instalado:

```bash
# Node.js y npm
node --version  # >= v16

# Circom compiler
circom --version  # >= 2.1.9

# snarkjs (instalado como dependencia)
npm install
```

---

## 🎯 Objetivo de la Demo

El circuito **KYCTransfer** combina tres validaciones ZK:

1. **RangeProof**: Verifica que la edad esté en un rango válido (18-99)
2. **SolvencyCheck**: Verifica que el balance sea mayor o igual al mínimo requerido
3. **ComplianceVerify**: Verifica que el país esté permitido (countryId válido)

**Lo que probaremos**: Un usuario con `age=25`, `balance=150`, `countryId=32` cumple con los requisitos KYC sin revelar sus datos exactos.

---

## 🚀 Paso 1: Compilar el Circuito

```bash
cd circuits
circom kyc_transfer.circom --r1cs --wasm --sym -o artifacts/ -l node_modules
```

**¿Qué hace esto?**
- Compila el código Circom a un sistema de restricciones R1CS
- Genera el archivo WASM para calcular el testigo (witness)
- Crea la tabla de símbolos para debugging

**Archivos generados:**
- `artifacts/kyc_transfer.r1cs` → Sistema de restricciones
- `artifacts/kyc_transfer.wasm` → Calculador de testigo
- `artifacts/kyc_transfer.sym` → Símbolos del circuito

**Verificar la compilación:**
```bash
snarkjs r1cs info artifacts/kyc_transfer.r1cs
```

---

## 🔑 Paso 2: Generar Powers of Tau (Trusted Setup - Fase 1)

El Trusted Setup de Groth16 requiere dos fases. La primera es independiente del circuito.

### 2.1 Crear ceremonia inicial

```bash
cd artifacts
snarkjs powersoftau new bn128 12 pot12_0000.ptau -v
```

**¿Qué significa "12"?**
- Es el parámetro que define el tamaño máximo del circuito: 2^12 = 4096 restricciones
- Nuestro circuito tiene ~300 restricciones, así que 12 es suficiente

### 2.2 Contribuir entropía

```bash
snarkjs powersoftau contribute pot12_0000.ptau pot12_final.ptau --name="Demo contribution" -v
```

**Importante para video:**
- Te pedirá ingresar entropía aleatoria (escribe algo random)
- Esto añade seguridad criptográfica al setup

---

## 🧩 Paso 3: Preparar Fase 2 y Setup Groth16

### 3.1 Preparar Phase 2

```bash
snarkjs powersoftau prepare phase2 pot12_final.ptau pot12_final_phase2.ptau -v
```

### 3.2 Ejecutar Groth16 Setup

```bash
snarkjs groth16 setup kyc_transfer.r1cs pot12_final_phase2.ptau kyc_transfer_0000.zkey
```

**¿Qué hace?**
- Genera la clave de prueba inicial específica para **kyc_transfer.circom**

### 3.3 Contribuir a la zkey

```bash
snarkjs zkey contribute kyc_transfer_0000.zkey kyc_transfer_final.zkey --name="Final contribution" -v
```

**Tip para video:**
- Nuevamente pedirá entropía aleatoria
- Explica que esto hace imposible falsificar pruebas sin conocer el secreto

### 3.4 Exportar Verification Key

```bash
snarkjs zkey export verificationkey kyc_transfer_final.zkey kyc_transfer_vkey.json
```

**Archivo generado:**
- `kyc_transfer_vkey.json` → Clave pública para verificar pruebas

---

## ✅ Atajo: Usar el Script Automatizado

Si prefieres no ejecutar los pasos 2-3 manualmente:

```bash
cd circuits/scripts
bash prepare_and_setup.sh
```

**Este script hace todo el setup automáticamente.**

---

## 🧮 Paso 4: Crear Input y Generar Testigo (Witness)

### 4.1 Crear archivo de entrada

Crea `artifacts/input.json`:

```json
{
  "age": 25,
  "minAge": 18,
  "maxAge": 99,
  "balance": 150,
  "minBalance": 50,
  "countryId": 32
}
```

**Explica en el video:**
- `age=25` → El usuario tiene 25 años (privado)
- `balance=150` → El usuario tiene $150 (privado)
- `countryId=32` → El usuario es de Argentina (privado)
- `minAge=18`, `maxAge=99`, `minBalance=50` → Parámetros públicos del sistema KYC

### 4.2 Generar el Witness

```bash
node artifacts/kyc_transfer_js/generate_witness.js \
  artifacts/kyc_transfer.wasm \
  artifacts/input.json \
  artifacts/witness.wtns
```

**¿Qué hace?**
- Calcula todas las señales intermedias del circuito usando los inputs
- Genera `witness.wtns` que contiene los valores de TODAS las señales

---

## 🔏 Paso 5: Generar la Prueba Zero-Knowledge

```bash
snarkjs groth16 prove \
  artifacts/kyc_transfer_final.zkey \
  artifacts/witness.wtns \
  artifacts/proof.json \
  artifacts/public.json
```

**Archivos generados:**
- `proof.json` → La prueba ZK (3 puntos de curva elíptica)
- `public.json` → Las señales públicas (outputs del circuito)

**Muestra en el video:**
```bash
cat artifacts/proof.json
cat artifacts/public.json
```

**Explica:**
- La prueba NO revela `age`, `balance` ni `countryId`
- Solo revela `kycValid` (1 o 0)

---

## ✅ Paso 6: Verificar la Prueba

```bash
snarkjs groth16 verify \
  artifacts/kyc_transfer_vkey.json \
  artifacts/public.json \
  artifacts/proof.json
```

**Resultado esperado:**
```
[INFO]  snarkJS: OK!
```

**Explica en el video:**
- El verificador solo necesita la clave pública (`vkey.json`)
- NO necesita acceso a los inputs privados
- La verificación es instantánea (~millisegundos)

---

## 🎬 Atajo: Script End-to-End

Para ejecutar los pasos 4-6 automáticamente:

```bash
cd circuits/scripts
bash prove_and_verify.sh
```

**Bonus**: Este script también exporta el verifier Solidity a `evm/Verifier.sol`

---

## 🎥 Guión Sugerido para el Video

### Introducción (1 min)
"Hoy vamos a demostrar un circuito de KYC con zero-knowledge proofs. Vamos a probar que un usuario cumple con requisitos de edad, solvencia y compliance, sin revelar sus datos personales."

### Compilación (1 min)
Muestra `kyc_transfer.circom` brevemente, luego:
```bash
circom kyc_transfer.circom --r1cs --wasm --sym -o artifacts/
snarkjs r1cs info artifacts/kyc_transfer.r1cs
```

### Trusted Setup (2-3 min)
Ejecuta `prepare_and_setup.sh` y explica:
- "Esto genera los parámetros criptográficos"
- "En producción, esto se hace en una ceremonia multi-party"

### Generación de Prueba (2 min)
Muestra `input.json`, explica los valores:
```bash
cat artifacts/input.json
```
Luego ejecuta:
```bash
bash prove_and_verify.sh
```

### Verificación (1 min)
Muestra el resultado `OK!` y explica:
- "El verificador confirma la prueba sin ver los datos privados"
- "Esto se puede hacer on-chain en Ethereum o Soroban"

### Conclusión (1 min)
"Con esto demostramos cómo un usuario puede probar compliance sin revelar información sensible. El siguiente paso es deployar el verifier a un smart contract."

---

## 📊 Archivos Importantes a Mostrar

| Archivo | Descripción | Mostrar en video |
|---------|-------------|------------------|
| `kyc_transfer.circom` | Código del circuito | ✅ Brevemente |
| `input.json` | Datos de prueba | ✅ Explicar valores |
| `proof.json` | Prueba ZK generada | ✅ Mostrar tamaño |
| `public.json` | Output público (kycValid) | ✅ Mostrar valor |
| `kyc_transfer_vkey.json` | Clave de verificación | ⚠️ Opcional |

---

## 🔗 Comandos Resumidos (Copy-Paste)

### Opción 1: Demo Automatizado (Recomendado)

```bash
cd circuits/scripts
bash demo.sh
```

### Opción 2: Paso a Paso Manual

```bash
# 1. Compilar
cd circuits
circom kyc_transfer.circom --r1cs --wasm --sym -o artifacts/ -l node_modules

# 2. Setup (automático)
cd scripts
bash prepare_and_setup.sh

# 3. Probar y verificar (automático)
bash prove_and_verify.sh

# 4. Ver resultado
cat ../artifacts/public.json
```

---

## 🎯 Resultado Esperado

Si todos los pasos fueron exitosos, deberías ver:

```bash
✅ Witness generated: artifacts/witness.wtns
✅ Proof generated: artifacts/proof.json
✅ Public inputs: artifacts/public.json
🧠 Verifying proof...
[INFO]  snarkJS: OK!
✅ Proof verified successfully!
```

Y `public.json` contendrá:
```json
["1"]
```

Donde `1` significa que el usuario **pasó todas las validaciones KYC** sin revelar sus datos.

---

## 📚 Referencias

- [Circom Documentation](https://docs.circom.io/)
- [snarkjs Guide](https://github.com/iden3/snarkjs)
- [Groth16 Paper](https://eprint.iacr.org/2016/260.pdf)

---

**¡Listo para grabar! 🎬**
