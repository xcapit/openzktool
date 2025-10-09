# 🎬 Demo Guide — ZKPrivacy

**Guía completa para demostrar el Stellar Privacy SDK**

---

## 📊 Resumen de Scripts Disponibles

| Script | Duración | Audiencia | Propósito | Modo |
|--------|----------|-----------|-----------|------|
| **demo_privacy_proof.sh** 💡 | 5-7 min | **No técnica/Business** | **Historia narrativa de privacidad** | Interactivo |
| **demo_multichain.sh** ⭐ | 5-7 min | **Técnica/Grant** | **Interoperabilidad EVM + Soroban** | Interactivo |
| **test_full_flow_auto.sh** 🚀 | 3-5 min | **Testing/CI** | **Test completo automatizado** | Auto |
| test_full_flow.sh | 3-5 min | Testing | Test completo con pausas | Interactivo |
| full_demo.sh | 8-10 min | Educativa | Teoría + Práctica + Beneficios | Interactivo |
| prove_and_verify.sh | 30 seg | Desarrollo | Quick proof generation | Auto |
| demo.sh | 5-6 min | Presentaciones | Demo interactivo básico | Interactivo |
| demo_auto.sh | 3-4 min | Video | Auto-play sin pausas | Auto |

### NPM Scripts (Recomendado)

```bash
npm run demo:privacy      # = demo_privacy_proof.sh (NON-TECHNICAL)
npm run demo              # = demo_multichain.sh (TECHNICAL)
npm test                  # = test_full_flow_auto.sh (TESTING)
npm run test:interactive  # = test_full_flow.sh
npm run setup             # Compile circuit & generate keys
npm run prove             # Generate proof & verify locally
npm run demo:evm          # Verify on EVM only
npm run demo:soroban      # Verify on Soroban only
```

---

## 🎯 Recomendaciones por Escenario

### 0. **Presentación para Stakeholders No Técnicos** 💡 NUEVO

**Script:** `demo_privacy_proof.sh` (o `npm run demo:privacy`)

**Por qué:**
- Cuenta una historia fácil de entender
- No requiere conocimientos técnicos
- Explica el problema y la solución
- Muestra el valor de negocio claramente
- Perfecto para C-level, business, inversores

**Cómo ejecutar:**
```bash
# Opción 1: NPM (recomendado)
npm run demo:privacy

# Opción 2: Directo
bash demo_privacy_proof.sh

# Opción 3: Auto mode (sin pausas)
DEMO_AUTO=1 bash demo_privacy_proof.sh
```

**La Historia que Cuenta:**
1. 👤 **El Problema**: Alice necesita acceder a un servicio financiero
2. ❌ **Método Tradicional**: Compartir todos sus datos (ID, balance, etc.)
3. ✅ **La Solución ZK**: Probar que cumple requisitos SIN revelar datos
4. 🔐 **El Proof**: Un archivo de 800 bytes que prueba todo
5. ⛓️ **Verificación Multi-Chain**: Mismo proof en Ethereum Y Stellar
6. ✨ **Resultado**: Privacidad + Compliance

**Qué Demuestra:**
- ✅ Alice prueba que es mayor de 18 (sin revelar que tiene 25)
- ✅ Alice prueba que tiene balance suficiente (sin revelar $150)
- ✅ Alice prueba que es de país permitido (sin revelar Argentina)
- ✅ El proof funciona en DOS blockchains diferentes
- ✅ Todo en ~800 bytes, <1 segundo para generar

**Audiencia Ideal:**
- CEOs, CFOs, CTOs de fintechs
- Inversores sin background técnico
- Reguladores y compliance officers
- Partners bancarios y retail
- Usuarios finales que quieren entender el valor

**Lenguaje Usado:**
- Sin jerga técnica compleja
- Analogías simples (caja cerrada con candado)
- Enfoque en beneficios de negocio
- Casos de uso reales

**Duración:** 5-7 minutos

---

### 1. **Testing Rápido / Validación Completa** 🚀

**Script:** `test_full_flow_auto.sh` (o `npm test`)

**Por qué:**
- Valida TODO el flujo en 3-5 minutos
- Sin pausas, completamente automatizado
- Perfecto para CI/CD o verificación rápida
- Incluye setup, proof, EVM y Soroban
- Ideal antes de presentaciones para asegurar que todo funciona

**Cómo ejecutar:**
```bash
# Opción 1: NPM (recomendado)
npm test

# Opción 2: Directo
bash test_full_flow_auto.sh

# Opción 3: Con pausas (para seguir el proceso)
npm run test:interactive
```

**Qué verifica:**
1. ✅ Setup inicial (si no existe)
2. ✅ Compilación de circuito
3. ✅ Generación de proof
4. ✅ Verificación local (snarkjs)
5. ✅ Verificación en EVM (Ethereum/Anvil)
6. ✅ Verificación en Soroban (Stellar)

**Cuándo usar:**
- Antes de cualquier demo o presentación
- Después de cambios en el código
- Para validar instalación en nuevo entorno
- En CI/CD pipeline
- Cuando necesitas verificar rápidamente que todo funciona

---

### 2. **Presentación para Inversores Técnicos** ⭐ RECOMENDADO
**Script:** `demo_multichain.sh`

**Por qué:**
- Demuestra la propuesta de valor clave: interoperabilidad
- Muestra verificación REAL en EVM y Soroban
- Visualiza el mismo proof funcionando en 2 blockchains
- Duración perfecta (5-7 min)
- Impacto visual alto

**Cómo ejecutar:**
```bash
# Modo interactivo (pausas manuales)
bash demo_multichain.sh

# Modo auto (para video)
DEMO_AUTO=1 bash demo_multichain.sh
```

**Qué muestra:**
1. ✅ Generación de proof (Circom + Groth16)
2. ✅ Verificación en Ethereum (Foundry/Anvil)
3. ✅ Verificación en Stellar/Soroban
4. ✅ Mismo proof, diferentes blockchains

**Requisitos previos:**
```bash
# Una sola vez - setup inicial
cd circuits/scripts
bash prepare_and_setup.sh
```

---

### 3. **Workshop / Capacitación Técnica**
**Script:** `full_demo.sh`

**Por qué:**
- Explica la teoría ZK (Ali Baba's Cave)
- Muestra todo el flujo (compilación → setup → proof → verify)
- Casos de uso reales (zkRollups, identity, etc.)
- Ideal para enseñar

**Cómo ejecutar:**
```bash
cd circuits/scripts
bash full_demo.sh
```

**Qué muestra:**
1. 📚 Teoría ZK (qué son, cómo funcionan)
2. 🛠️ Práctica (compilar, generar keys, crear proof)
3. 💎 Beneficios (6 casos de uso reales)
4. ⛓️ Deployment (exportar verifiers)

---

### 4. **Video para Redes Sociales / YouTube**
**Script:** `demo_auto.sh`

**Por qué:**
- Se ejecuta automáticamente sin pausas
- Duración corta (3-4 min)
- Perfecto para grabación

**Cómo ejecutar:**
```bash
cd circuits/scripts
bash demo_auto.sh
```

**Tips para grabar:**
```bash
# Graba la terminal con asciinema o similar
asciinema rec zkprivacy-demo.cast
bash demo_auto.sh
# Ctrl+D para terminar

# O usa OBS/ScreenFlow para capturar
```

---

### 5. **Testing Rápido / Desarrollo**
**Script:** `prove_and_verify.sh`

**Por qué:**
- Super rápido (30 segundos)
- Sin teoría, directo al grano
- Para verificar que todo funciona

**Cómo ejecutar:**
```bash
cd circuits/scripts
bash prove_and_verify.sh
```

---

## 🎤 Estructura Recomendada para Presentación

### Opción A: Presentación Completa (15-20 min)

**1. Introducción (3 min)**
- Problema: Falta de privacidad en blockchains públicas
- Impacto: Instituciones no pueden usar blockchain
- Solución: ZK-SNARKs con compliance

**2. Demo Multi-Chain (7 min)** ⭐
```bash
bash demo_multichain.sh
```
- Mostrar proof generation
- Verificar en EVM (Ethereum local)
- Verificar en Soroban (Stellar local)
- Destacar: MISMO proof, diferentes chains

**3. Arquitectura (3 min)**
- Mostrar diagrama (desde web: zkprivacy.vercel.app)
- Explicar componentes:
  - Circom circuits
  - Soroban contracts
  - JS/TS SDK
  - Banking layer
  - Compliance dashboard

**4. Roadmap & Grant (5 min)**
- 3 tranches
- Partners: 2 en testnet, 5+ en mainnet
- Casos de uso TradFi

**5. Q&A (5 min)**

---

### Opción B: Pitch Rápido (5 min)

**1. Elevator Pitch (1 min)**
"Stellar Privacy SDK permite a instituciones financieras usar blockchain para transacciones privadas, manteniendo compliance regulatorio. Usamos Zero-Knowledge Proofs para probar cosas sin revelar datos."

**2. Quick Demo (3 min)** ⭐
```bash
# Solo la parte visual, sin pausas
DEMO_AUTO=1 bash demo_multichain.sh
```
- Mientras corre, narrar:
  - "Generamos un proof de KYC"
  - "Lo verificamos en Ethereum"
  - "Lo verificamos en Stellar"
  - "Mismo proof, diferentes blockchains = interoperabilidad"

**3. Call to Action (1 min)**
- 6 meses, 3 tranches
- 5+ partners objetivo
- Link: zkprivacy.vercel.app

---

## 🛠️ Mejoras Sugeridas a los Scripts

### Demo Multi-Chain (demo_multichain.sh)

**✅ Fortalezas actuales:**
- Excelente visualización ASCII
- Flujo claro en 3 pasos
- Colores bien usados
- Pausas configurables

**💡 Mejoras sugeridas:**

1. **Agregar tiempo estimado al inicio**
```bash
echo ""
echo -e "${CYAN}⏱️  Estimated time: 5-7 minutes${NC}"
echo ""
```

2. **Mostrar preview de los datos antes de generar proof**
```bash
echo -e "${YELLOW}📋 Input Data Preview:${NC}"
cat circuits/artifacts/input.json | jq '.'
```

3. **Agregar links al final**
```bash
echo ""
echo -e "${CYAN}🔗 Learn More:${NC}"
echo "  • Website: https://zkprivacy.vercel.app"
echo "  • GitHub: https://github.com/xcapit/stellar-privacy-poc"
echo "  • Open Source Privacy Toolkit"
```

4. **Opción para skip setup si ya está hecho**
```bash
if [ -f "circuits/artifacts/kyc_transfer_final.zkey" ]; then
    echo -e "${GREEN}✅ Setup already complete, skipping...${NC}"
else
    echo "Running initial setup..."
    # run setup
fi
```

---

## 📝 Script de Narración

### Para Demo Multi-Chain (5 min)

**[INICIO]**
"Hola, voy a mostrarles cómo el Stellar Privacy SDK permite privacidad con compliance en múltiples blockchains."

**[Paso 1 - Proof Generation]**
"Primero, generamos un proof de KYC. Tenemos datos privados: edad 25, balance $150, país Argentina. Queremos probar que cumplimos requisitos (edad >18, balance >$50) SIN revelar los datos exactos."

**[Mostrar proof.json]**
"Este proof tiene solo 800 bytes. No contiene ningún dato privado, pero prueba matemáticamente que cumplimos las condiciones."

**[Paso 2 - EVM Verification]**
"Ahora verificamos este proof en Ethereum. Desplegamos un smart contract Solidity que valida el proof usando pairing checks en la curva BN254."

**[Esperar resultado EVM]**
"✅ Verificado en Ethereum. El contrato confirma que el proof es válido."

**[Paso 3 - Soroban Verification]**
"Ahora, el MISMO proof lo verificamos en Stellar. Usamos un contrato Rust en Soroban que hace la misma validación."

**[Esperar resultado Soroban]**
"✅ Verificado en Soroban también."

**[CONCLUSIÓN]**
"Esto demuestra verdadera interoperabilidad: UN proof funciona en múltiples blockchains. Esto es clave para instituciones que operan en múltiples redes."

"Nuestro SDK incluye circuits, contratos, SDK JavaScript, capa de banking para KYC/AML, y dashboard de compliance."

"Estamos desarrollando esto con objetivo de onboarding de múltiples partners."

---

## 🎥 Tips para Grabación de Video

### Setup Técnico

**Terminal:**
```bash
# Usa una terminal con buen contraste
# Recomendado: iTerm2 con tema Dracula o similar

# Font size grande para video
# Mínimo: 16pt, Ideal: 18-20pt

# Ancho de terminal
# 100-120 caracteres de ancho
```

**Grabación:**
```bash
# Opción 1: asciinema (for terminal only)
asciinema rec zkprivacy-demo.cast --title "ZKPrivacy Multi-Chain Demo"
bash demo_multichain.sh
# Ctrl+D to stop

# Opción 2: OBS Studio (screen + audio)
# - Captura pantalla completa o ventana
# - Graba audio de micrófono para narración
# - Export en 1080p MP4

# Opción 3: QuickTime (Mac)
# - File > New Screen Recording
# - Selecciona área o pantalla completa
```

**Edición:**
```bash
# Cortar pausas largas
# Acelerar partes de compilación (opcional)
# Agregar subtítulos con puntos clave
# Overlay con logo ZKPrivacy
```

---

## 🐛 Troubleshooting

### Error: "Setup not found"
```bash
# Solución: Run setup first
cd circuits/scripts
bash prepare_and_setup.sh
```

### Error: "Foundry not found"
```bash
# Solución: Install Foundry
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

### Error: "Stellar CLI not found"
```bash
# Solución: Install Stellar CLI
cargo install --locked stellar-cli --features opt
```

### Error: "Anvil port already in use"
```bash
# Solución: Kill existing Anvil
pkill anvil
# Or use different port in script
```

### Demo corre muy rápido
```bash
# Solución: Modo manual
DEMO_AUTO=0 bash demo_multichain.sh

# O editar PAUSE_TIME en el script
# Cambiar PAUSE_TIME=3 a PAUSE_TIME=5
```

---

## 📊 Métricas para Reportar

Al final de tu demo, menciona estas métricas:

**Performance:**
- ⚡ Proof generation: <1 second
- 📊 Circuit constraints: ~100 (very efficient)
- 📦 Proof size: ~800 bytes
- ✅ Verification: <50ms off-chain, ~200k gas on-chain

**Alcance:**
- 🎯 Target: 5+ partners mainnet (3 months)
- 🧪 Pilots: 2 partners on testnet
- ⏱️ Timeline: 6 months
- 👥 Team: 6 members (6+ years blockchain)

**Traction:**
- ✅ POC Complete (circuits + contracts + SDK + demo)
- ✅ 6+ years blockchain development experience
- ✅ Academic backing (UTN partnership)
- ✅ Multi-chain ready (EVM + Soroban)

---

## 🎯 Conclusión

**Para la mayoría de casos: USA `demo_multichain.sh`**

Es el mejor balance entre:
- ✅ Impacto visual
- ✅ Duración adecuada
- ✅ Demuestra valor único (interoperabilidad)
- ✅ Técnicamente completo
- ✅ Fácil de narrar

**Comando recomendado:**
```bash
# Para presentación en vivo
bash demo_multichain.sh

# Para grabar video
DEMO_AUTO=1 bash demo_multichain.sh
```

**Siguiente paso:** Practicar la narración 2-3 veces antes de la demo real.

---

*Creado por Team X1 - Xcapit Labs*
*Proyecto: Stellar Privacy SDK (ZKPrivacy)*
