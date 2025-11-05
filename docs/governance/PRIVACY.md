# Política de Privacidad y Protección de Datos

**OpenZKTool - Stellar Privacy SDK**

---

## 🔐 Resumen Ejecutivo

OpenZKTool es un **SDK de código abierto** para implementar privacidad mediante Zero-Knowledge Proofs. Como software de infraestructura, **OpenZKTool no recopila, almacena ni procesa datos personales de usuarios finales**.

**Principio fundamental:** Los datos privados nunca salen del dispositivo del usuario. Las pruebas criptográficas (proofs) no contienen información personal identificable (PII).

---

## 1. Ámbito de Aplicación

Esta política de privacidad cubre:

### 1.1 El Software OpenZKTool (SDK)

- **Qué es:** Código abierto (AGPL-3.0) para generar y verificar Zero-Knowledge Proofs
- **Dónde se ejecuta:** Localmente en el dispositivo del usuario o servidor del desarrollador
- **Datos que maneja:** Datos privados del usuario (edad, balance, etc.) + pruebas criptográficas (proofs)

**Importante:** El SDK en sí no transmite datos a servidores de Xcapit ni a terceros.

### 1.2 Este Repositorio de GitHub

- **Qué es:** Código fuente, documentación, ejemplos
- **Datos recopilados:** GitHub puede recopilar metadatos estándar (visitas, clones, stars)
- **Privacidad:** Regida por la [Política de Privacidad de GitHub](https://docs.github.com/en/site-policy/privacy-policies/github-privacy-statement)

### 1.3 Sitio Web openzktool.vercel.app

- **Qué es:** Landing page informativa
- **Datos recopilados:** Analytics básicos (visitas, país, navegador)
- **Privacidad:** Regida por [Vercel Privacy Policy](https://vercel.com/legal/privacy-policy)

---

## 2. Principios de Privacidad by Design

OpenZKTool está diseñado desde el principio para **maximizar la privacidad** del usuario:

### 2.1 Zero-Knowledge Architecture

```
┌─────────────────────────────────────────────────────┐
│  DATOS PRIVADOS (nunca salen del dispositivo)       │
│  - Edad exacta: 25                                  │
│  - Balance exacto: $150                             │
│  - País: Argentina                                  │
└─────────────────────────────────────────────────────┘
                    ↓
         [Generación de Proof Localmente]
                    ↓
┌─────────────────────────────────────────────────────┐
│  PROOF (800 bytes, sin PII)                         │
│  - pi_a: [números criptográficos]                   │
│  - pi_b: [números criptográficos]                   │
│  - pi_c: [números criptográficos]                   │
│  - Public output: kycValid = 1                      │
└─────────────────────────────────────────────────────┘
                    ↓
              [Blockchain Pública]
```

**Garantía criptográfica:** Es matemáticamente imposible extraer edad, balance o país del proof.

### 2.2 Minimización de Datos

- **Solo datos necesarios:** El usuario elige qué probar (ej: edad ≥ 18) y qué no revelar (edad exacta)
- **No hay base de datos central:** No existe servidor central que almacene datos de usuarios
- **Proofs efímeros:** Los proofs pueden ser de un solo uso (implementando nonces)

### 2.3 Control del Usuario

- **Soberanía de datos:** El usuario controla sus datos privados en todo momento
- **Consentimiento explícito:** Generación de proof requiere acción intencional del usuario
- **Portabilidad:** El usuario puede usar el mismo proof en múltiples plataformas

---

## 3. Tipos de Datos y su Tratamiento

### 3.1 Datos Privados (Private Inputs)

**Ejemplos:**
- Edad exacta
- Balance exacto
- País de residencia
- Credit score
- Historial de transacciones

**Dónde se procesan:**
- - Localmente en el navegador del usuario (browser-based)
- - Localmente en el servidor del desarrollador (backend integration)
- - **Nunca en servidores de OpenZKTool/Xcapit**

**Almacenamiento:**
- - Solo en el dispositivo del usuario (localStorage, archivos locales)
- - **Nunca transmitidos a terceros**
- - **Nunca almacenados en blockchain**

**Protecciones:**
- Generación de proof es proceso local (JavaScript/WASM en navegador o Node.js)
- Datos en memoria solo durante generación de proof (~1 segundo)
- No logs, no telemetría, no tracking

### 3.2 Datos Públicos (Public Inputs)

**Ejemplos:**
- Threshold de edad (ej: 18)
- Threshold de balance (ej: $50)
- Lista de países permitidos

**Dónde se procesan:**
- - Incluidos en el proof
- - Visibles en blockchain (parte del smart contract)

**Privacidad:**
- - No revelan datos del usuario, solo los requisitos generales
- - Ejemplo: "minAge: 18" no revela la edad del usuario

### 3.3 Proofs Criptográficos

**Qué son:**
- 800 bytes de datos criptográficos (pi_a, pi_b, pi_c)
- Resultado público (ej: kycValid = 1)

**Dónde se almacenan:**
- - Opcionalmente en blockchain (Ethereum, Stellar, etc.)
- - En logs de transacciones on-chain

**Privacidad:**
- - **No contienen PII** (Personally Identifiable Information)
- - Zero-Knowledge: solo prueban que la statement es verdadera
- - No se puede "reverse engineer" para obtener datos privados

### 3.4 Datos Blockchain (On-Chain)

**Qué se publica on-chain:**
- Proof criptográfico (800 bytes)
- Public output (ej: kycValid = 1)
- Dirección de wallet del usuario (address público)
- Hash de transacción

**Privacidad:**
- ⚠️ **Blockchain es pública e inmutable**
- ⚠️ Direcciones de wallet pueden ser pseudónimas pero no anónimas
- - El proof en sí no contiene PII

**Recomendaciones:**
- Usar wallets separadas para diferentes propósitos
- Considerar mixers/tumblers para mayor anonimato
- Revisar políticas de privacidad de cada blockchain

---

## 4. Compliance con Regulaciones

### 4.1 GDPR (Reglamento General de Protección de Datos - UE)

**Aplicabilidad:** OpenZKTool como SDK no procesa datos de ciudadanos UE directamente. Sin embargo, aplicaciones que integren OpenZKTool deben cumplir GDPR.

**Compliance:**

- **Art. 5 - Principios de tratamiento de datos:**
- **Minimización:** Solo se procesan datos necesarios para generar el proof
- **Limitación de finalidad:** Datos solo se usan para generar proof, no otros fines
- **Exactitud:** Usuario controla exactitud de sus datos
- **Limitación de almacenamiento:** Datos en memoria solo durante generación (~1 segundo)

- **Art. 25 - Protección de datos desde el diseño:**
- Privacy by design: Zero-Knowledge architecture
- Privacidad por defecto: Datos privados nunca se transmiten

- **Art. 32 - Seguridad del tratamiento:**
- Criptografía de última generación (Groth16, BN254)
- Código auditado y open source

⚠️ **Art. 17 - Derecho al olvido:**
- **Limitación:** Datos publicados on-chain (proofs) son inmutables
- **Mitigación:** Proofs no contienen PII, por lo que no hay datos personales que borrar

**Responsabilidades:**
- **Desarrolladores que integran OpenZKTool:** Deben implementar sus propias políticas de privacidad y obtener consentimiento
- **OpenZKTool (el SDK):** Proporciona herramientas privacy-preserving, no procesa datos personales

### 4.2 CCPA (California Consumer Privacy Act)

**Aplicabilidad:** Similar a GDPR, OpenZKTool no procesa datos de consumidores de California.

**Compliance:**
- - No venta de datos personales (no recopilamos datos)
- - Derecho a saber: Todo el código es open source
- - Derecho a eliminar: No almacenamos datos

### 4.3 PIPEDA (Canadá)

**Compliance:**
- - Consentimiento: Usuario genera proof voluntariamente
- - Limitación de uso: Datos solo para generar proof
- - Salvaguardas: Criptografía robusta

### 4.4 LGPD (Lei Geral de Proteção de Dados - Brasil)

**Compliance:**
- - Principios similares a GDPR
- - Minimización de datos
- - Transparencia: Código abierto

---

## 5. Seguridad de Datos

### 5.1 Medidas Técnicas

- **Criptografía:**
- Groth16 ZK-SNARK (128-bit security)
- Curva elíptica BN254 (alt_bn128)
- Poseidon hash function en circuits

- **Código seguro:**
- Revisión de código por comunidad
- Tests automatizados
- Linters y análisis estático

- **Dependencias:**
- snarkjs (auditado por comunidad ZK)
- circomlib (estándar de la industria)
- Actualizaciones regulares

### 5.2 Limitaciones Conocidas (POC)

⚠️ **Este es un Proof of Concept (POC):**
- No auditado por firma de seguridad profesional (previsto Q2 2025)
- No recomendado para producción con fondos reales
- Solo para desarrollo, testing, demos

⚠️ **Ataques potenciales:**
- Side-channel attacks (timing, power analysis) - mitigados parcialmente
- Malware en dispositivo del usuario puede robar datos privados antes de proof generation
- Compromiso de trusted setup (mitigado usando Powers of Tau community ceremony)

### 5.3 Buenas Prácticas para Desarrolladores

Recomendaciones al integrar OpenZKTool:

1. **Nunca enviar datos privados a servidores**
   ```javascript
   // - MAL
   fetch('/api/generate-proof', { body: JSON.stringify({ age: 25, balance: 150 }) });

   // - BIEN
   const proof = await generateProofLocally({ age: 25, balance: 150 });
   fetch('/api/submit-proof', { body: JSON.stringify({ proof }) });
   ```

2. **Usar HTTPS siempre**
3. **Validar inputs antes de generar proof**
4. **Implementar rate limiting**
5. **No loggear datos privados**

---

## 6. Derechos de los Usuarios

Los usuarios que utilizan aplicaciones construidas con OpenZKTool tienen los siguientes derechos:

### 6.1 Derecho a la Información

- **Transparencia total:**
- Código 100% open source (AGPL-3.0)
- Documentación completa de cómo funcionan los proofs
- Auditoría pública de circuits en GitHub

### 6.2 Derecho al Acceso

- **Control total:**
- Usuario controla sus datos privados
- Puede inspeccionar proofs generados
- Puede verificar proofs localmente antes de enviar on-chain

### 6.3 Derecho a la Portabilidad

- **Interoperabilidad:**
- Mismo proof funciona en múltiples blockchains
- No lock-in a plataforma específica
- Formatos estándar (JSON para proofs)

### 6.4 Derecho a la Rectificación

- **Corrección fácil:**
- Usuario genera nuevo proof con datos corregidos
- No depende de terceros para modificar datos

### 6.5 Derecho al Olvido

⚠️ **Limitación blockchain:**
- Proofs on-chain son inmutables
- **Mitigación:** Proofs no contienen PII
- Usuario puede dejar de usar dirección de wallet asociada

---

## 7. Transferencias Internacionales de Datos

### 7.1 Arquitectura Descentralizada

OpenZKTool no transfiere datos personales internacionalmente porque:

- **Procesamiento local:** Generación de proof en dispositivo del usuario
- **Sin servidores centrales:** No hay backend de OpenZKTool que reciba datos
- **Blockchain distribuida:** Datos on-chain (proofs) están en red global descentralizada

### 7.2 Consideraciones Blockchain

⚠️ **Blockchains públicas son globales:**
- Nodos en múltiples países
- Datos on-chain accesibles desde cualquier lugar
- No control sobre ubicación de nodos

**Recomendación:** Solo publicar on-chain datos que no sean PII (i.e., proofs ZK).

---

## 8. Menores de Edad

### 8.1 Uso por Menores

⚠️ **OpenZKTool no está diseñado específicamente para menores**

**Política:**
- No recopilamos edad de usuarios (es un SDK, no un servicio)
- Aplicaciones que integran OpenZKTool deben cumplir con COPPA (US) y regulaciones locales
- Padres/tutores son responsables de supervisar uso de aplicaciones por menores

### 8.2 Protección Especial

Si desarrollas una aplicación para menores usando OpenZKTool:

- **Debes:**
- Obtener consentimiento parental verificable
- Minimizar aún más los datos recopilados
- Implementar controles parentales
- Cumplir COPPA, GDPR-K, y regulaciones locales

---

## 9. Cookies y Tracking

### 9.1 SDK OpenZKTool

- **No usa cookies**
- **No usa tracking**
- **No usa analytics**
- **No usa telemetría**

### 9.2 Sitio Web (openzktool.vercel.app)

⚠️ **Analytics mínimos:**
- Vercel Analytics (visitas, país, referrer)
- Sin cookies de terceros
- Sin identificadores personales

**Puedes optar por no participar:** Usando bloqueadores de analytics (uBlock Origin, Privacy Badger, etc.)

---

## 10. Divulgación a Terceros

### 10.1 OpenZKTool NO comparte datos con:

- Anunciantes
- Data brokers
- Empresas de analytics
- Redes sociales
- Gobiernos (a menos que legalmente obligados)

### 10.2 Divulgaciones Posibles

En circunstancias excepcionales, podríamos divulgar información si:

⚠️ **Orden judicial válida**
⚠️ **Investigación criminal**
⚠️ **Protección de derechos legales**

**Limitación:** Como no recopilamos datos de usuarios, tendríamos muy poca información para compartir.

---

## 11. Retención de Datos

### 11.1 SDK OpenZKTool

- **No retiene datos:**
- Datos privados en memoria solo durante proof generation (~1 segundo)
- Proofs generados almacenados solo si el desarrollador lo implementa
- No logs, no bases de datos

### 11.2 Datos On-Chain

⚠️ **Inmutables:**
- Proofs publicados en blockchain permanecen indefinidamente
- No es posible eliminarlos (naturaleza de blockchain)
- **Mitigación:** Proofs no contienen PII

---

## 12. Cambios a Esta Política

### 12.1 Notificación de Cambios

Esta política puede actualizarse para reflejar:
- Nuevas regulaciones de privacidad
- Cambios en la arquitectura de OpenZKTool
- Feedback de la comunidad

**Notificación:**
- Cambios publicados en este archivo (GitHub)
- Versión y fecha actualizadas
- Cambios mayores anunciados en README

### 12.2 Historial de Versiones

| Versión | Fecha | Cambios |
|---------|-------|---------|
| 1.0 | 2025-01-10 | Versión inicial para DPGA compliance |

---

## 13. Contacto - Oficial de Privacidad

Para consultas sobre privacidad y protección de datos:

📧 **Email:** [Disponible en website](https://openzktool.vercel.app)
💬 **GitHub Issues:** https://github.com/xcapit/stellar-privacy-poc/issues
🌐 **Website:** https://openzktool.vercel.app

**Tiempo de respuesta:** 7 días hábiles

---

## 14. Recursos Adicionales

### 14.1 Documentación Técnica

- [Architecture Overview](./docs/architecture/overview.md) - Cómo funciona OpenZKTool
- [FAQ](./docs/FAQ.md) - Preguntas frecuentes sobre privacidad
- [Security](./SECURITY.md) - Políticas de seguridad

### 14.2 Regulaciones de Privacidad

- [GDPR (EU)](https://gdpr.eu/)
- [CCPA (California)](https://oag.ca.gov/privacy/ccpa)
- [LGPD (Brasil)](https://www.gov.br/cidadania/pt-br/acesso-a-informacao/lgpd)

---

## DPGA Compliance

Esta política de privacidad cumple con los requisitos de **Digital Public Goods Alliance (DPGA):**

- **Indicator 7:** Compliance with applicable privacy laws and best practices
- **Indicator 9:** Do no harm by design - Data protection policies

**Verificación:** https://digitalpublicgoods.net/standard/

---

**Última actualización:** 2025-01-10
**Versión:** 1.0
**Team X1 - Xcapit Labs**
**Licencia:** AGPL-3.0
