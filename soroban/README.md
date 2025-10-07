# 🧠 Soroban Groth16 Verifier

Este módulo implementa un **verificador Groth16** compilado como contrato inteligente Soroban sin dependencias de `std`, optimizado para ejecutarse en entornos `no_std` (WASM32).  
Forma parte del proyecto `stellar-privacy-poc`, orientado a integrar pruebas de conocimiento cero (ZKP) dentro del ecosistema Stellar / Soroban.

---

## ⚙️ Requerimientos

### 1. Herramientas base
Instalá las dependencias necesarias:

```bash
brew install rustup
brew install wabt
brew install binaryen
```

### 2. Toolchain Rust
Asegurate de tener el toolchain correcto:

```bash
rustup toolchain install 1.77.2 --component rust-std --target wasm32-unknown-unknown
rustup default 1.77.2
rustup target add wasm32-unknown-unknown
```

Verificá que esté activo:
```bash
rustc --version
# Debe mostrar rustc 1.77.2
```

---

## 🏗️ Compilación

Limpiá y compilá el proyecto:

```bash
cargo +1.77.2 clean
cargo +1.77.2 build --target wasm32-unknown-unknown --release
```

Esto generará:
```
target/wasm32-unknown-unknown/release/soroban_groth16_verifier.wasm
```

---

## 🔍 Verificación del WASM

Usá el script de verificación incluido:

```bash
./verify_wasm.sh
```

El resultado esperado:
```
✅ Tamaño del binario: ~570 KB
🔍 Sin reference-types activas
📦 Sin símbolos de std
✅ Verificación completada correctamente
```

Si querés inspeccionar manualmente:
```bash
wasm-objdump -x target/wasm32-unknown-unknown/release/soroban_groth16_verifier.wasm | grep import
wasm-dis target/wasm32-unknown-unknown/release/soroban_groth16_verifier.wasm | head -n 30
```

---

## 🚀 Despliegue en Futurenet

Primero configurá tu cuenta:
```bash
soroban config identity generate alice
soroban config network add futurenet   --rpc-url https://rpc-futurenet.stellar.org:443   --network-passphrase "Test SDF Future Network ; October 2022"
```

Luego desplegá el contrato:
```bash
soroban contract deploy   --wasm target/wasm32-unknown-unknown/release/soroban_groth16_verifier.wasm   --source alice   --network futurenet
```

El comando devolverá un **Contract ID** que podrás usar para ejecutar o invocar funciones del contrato.

---

## 🧪 Invocación de ejemplo

Para invocar una función expuesta (por ejemplo, `verify_proof`):

```bash
soroban contract invoke   --id <CONTRACT_ID>   --source alice   --network futurenet   --   verify_proof   --proof <HEX_PROOF>   --inputs <JSON_INPUTS>
```

*(Los parámetros variarán según la implementación del verificador Groth16)*

---

## 🧩 Notas Técnicas

- Compilación `no_std` → evita dependencias de `std` y `serde_json`.
- Dependencias congeladas en versiones compatibles con Rust 1.77.
- Sin `reference-types`, `mutable-globals` ni `nontrapping-fptoint` en el binario final.
- Validado con `wasm-objdump` y `binaryen`.

---

## 🧱 Estructura

```
soroban/
 ├── Cargo.toml
 ├── src/
 │   └── lib.rs
 ├── target/wasm32-unknown-unknown/release/
 │   └── soroban_groth16_verifier.wasm
 ├── verify_wasm.sh
 └── README.md
```

---

## 🧾 Licencia

Distribuido bajo **AGPL-3.0-or-later**.  
© Xcapit Labs / UTN Blockchain Lab.

---
