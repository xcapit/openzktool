# Política "Do No Harm by Design"

**OpenZKTool - Stellar Privacy SDK**

Este documento describe cómo OpenZKTool cumple con el principio **"Do No Harm by Design"** (No Causar Daño por Diseño) requerido por Digital Public Goods Alliance (DPGA).

---

## Compromiso Fundamental

**OpenZKTool se compromete a:**

- **Proteger a los usuarios** de daños potenciales
- **Prevenir mal uso** del software
- **Promover uso ético** de tecnología de privacidad
- **Transparencia total** sobre riesgos y limitaciones

---

## 1. Protección de Datos Personales (PII)

### 1.1 Arquitectura Privacy-First

- **Diseño que protege PII:**

```
Usuario → Datos Privados (edad: 25, balance: $150)
            ↓
        [Generación Local de Proof]
            ↓
        Proof (800 bytes, SIN PII)
            ↓
        Blockchain Pública
```

**Garantía:** Los datos personales (PII) **nunca** salen del dispositivo del usuario.

### 1.2 Zero-Knowledge por Defecto

- **No es posible extraer PII del proof:**
- Matemáticamente imposible (propiedad de Zero-Knowledge)
- Security level: 128-bit (2^128 ≈ 10^38 intentos para romper)
- Auditado por comunidad ZK internacional

- **Ejemplo:**
```javascript
// Input privado (NO se publica)
const privateData = { age: 25, balance: 150, country: "Argentina" };

// Proof generado (SE publica en blockchain)
const proof = { pi_a: [...], pi_b: [...], pi_c: [...] };
const publicOutput = [1]; // Solo "kycValid = true"

// - NO es posible: proof → age, balance, country
// - Solo se sabe: usuario pasó las validaciones
```

### 1.3 Minimización de Datos

- **Solo se procesan datos necesarios:**
- Usuario decide qué probar (ej: edad ≥ 18)
- No se recopilan datos adicionales
- No logs, no telemetría, no tracking

- **Política de datos:**
Ver [PRIVACY.md](./PRIVACY.md) para política completa.

---

## 2. Prevención de Mal Uso

### 2.1 Uso Prohibido

- **OpenZKTool NO debe usarse para:**

1. **Lavado de dinero**
   - OpenZKTool NO es un mixer/tumbler
   - Compatible con KYC/AML (selective disclosure para reguladores)
   - Proofs pueden incluir identifiers para compliance

2. **Evasión de sanciones**
   - Compatible con screening de listas (OFAC, etc.)
   - Permite bloqueo de países/direcciones en circuits

3. **Financiamiento del terrorismo**
   - Auditoría transparente on-chain
   - Selective disclosure para law enforcement autorizado

4. **Fraude o suplantación de identidad**
   - Proofs solo verifican datos reales del usuario
   - No permite probar datos falsos

5. **Discriminación o exclusión injusta**
   - No debe usarse para discriminar por raza, género, religión, etc.
   - Circuits deben ser justos y no sesgados

6. **Vigilancia masiva o violación de derechos humanos**
   - Privacidad es un derecho, no herramienta de opresión
   - No debe usarse por regímenes autoritarios para rastrear disidentes

### 2.2 Controles Técnicos para Prevenir Mal Uso

- **Compliance by design:**

```circom
// Ejemplo: Circuit que permite auditoría selectiva
template KYCWithAudit() {
    // Datos privados del usuario
    signal input userId;
    signal input age;
    signal input balance;

    // Auditor público key (opcional)
    signal input auditorPubKey;

    // Hash de userId cifrado con auditorPubKey
    // Solo el auditor autorizado puede descifrar
    signal output encryptedUserId;

    // Validaciones públicas
    signal output kycValid;

    // ... lógica del circuit
}
```

- **Transparency on-chain:**
- Todas las transacciones registradas en blockchain pública
- Auditoría posible con herramientas estándar (Etherscan, StellarExpert)

- **Rate limiting y abuse prevention:**
- Documentación incluye mejores prácticas para evitar spam
- Ejemplo de rate limiting en [Node.js backend example](./examples/nodejs-backend/)

### 2.3 Advertencias Claras en Documentación

⚠️ **Avisos en README:**
- "Este es un Proof of Concept - No usar en producción con fondos reales"
- "Solo para desarrollo, testing y demos"
- "Cumplir con leyes y regulaciones locales"

⚠️ **Avisos en código:**
```javascript
// ADVERTENCIA: Este código es un POC
// NO audited for production use
// Use at your own risk
```

---

## 3. Moderación de Contenido y Seguridad

### 3.1 Código de Conducta

- **Comunidad segura y respetuosa:**
- [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md) establece reglas claras
- Cero tolerancia a acoso, discriminación, hate speech
- Proceso de reporte y resolución de conflictos

### 3.2 Revisión de Contribuciones

- **Pull requests revisados:**
- Code review obligatorio antes de merge
- Testing automatizado (CI/CD)
- Análisis de seguridad (linters, static analysis)

- **Reporte de vulnerabilidades:**
- [SECURITY.md](./SECURITY.md) describe cómo reportar issues de seguridad
- Respuesta en < 48 horas
- Disclosure responsable

### 3.3 Prevención de Contenido Dañino

- **No se permite:**
- Circuits diseñados para discriminación
- Ejemplos de mal uso en documentación
- Promoción de actividades ilegales

- **Se fomenta:**
- Uso ético y legal
- Compliance con regulaciones
- Beneficio social (SDGs)

---

## 4. Protección de Datos de Niños

### 4.1 Restricciones de Edad

⚠️ **OpenZKTool SDK no está diseñado específicamente para menores**

- **Política:**
- No recopilamos edad de usuarios (es un SDK, no un servicio)
- Aplicaciones que integran OpenZKTool son responsables de compliance COPPA
- Documentación incluye advertencias sobre uso por menores

- **Recomendaciones para desarrolladores:**

Si construyes aplicación para menores:

1. **Obtener consentimiento parental verificable**
2. **Minimizar datos recopilados**
3. **Implementar controles parentales**
4. **Cumplir COPPA (US), GDPR-K (EU), y regulaciones locales**

Ver [PRIVACY.md - Sección 8](./PRIVACY.md#8-menores-de-edad)

---

## 5. Seguridad de Usuarios

### 5.1 Protección Contra Ataques

- **Criptografía robusta:**
- Groth16 (128-bit security)
- BN254 curve (estándar de la industria)
- Poseidon hash (ZK-friendly)

- **Best practices:**
- Código auditado por comunidad
- Testing extensivo
- Documentación de riesgos conocidos

⚠️ **Limitaciones conocidas (POC):**
- No auditado profesionalmente (previsto Q2 2025)
- No recomendado para producción
- Side-channel attacks posibles (timing, power analysis)

Ver [SECURITY.md](./SECURITY.md) para detalles completos.

### 5.2 Educación de Usuarios

- **Documentación clara:**
- [FAQ](./docs/FAQ.md) responde preguntas de seguridad
- [Interactive Tutorial](./docs/getting-started/interactive-tutorial.md) enseña uso seguro
- [Examples](./examples/) muestran mejores prácticas

- **Advertencias visibles:**
```
⚠️ ADVERTENCIA: Este es un Proof of Concept
⚠️ NO usar en producción con fondos reales
⚠️ Solo para desarrollo, testing y demos
```

---

## 6. Privacidad y Consentimiento

### 6.1 Consentimiento Informado

- **Usuario controla sus datos:**
- Generación de proof es acción intencional y voluntaria
- Usuario puede inspeccionar proof antes de enviar on-chain
- Usuario puede verificar proof localmente

- **Transparencia total:**
- Código 100% open source (AGPL-3.0)
- Documentación completa de qué se prueba y qué se oculta
- No "sorpresas" o recopilación de datos oculta

### 6.2 Derechos del Usuario

- **Protegidos por diseño:**
- Derecho a la privacidad (datos nunca salen del dispositivo)
- Derecho al acceso (código open source, auditabilidad)
- Derecho a la portabilidad (proofs funcionan en múltiples chains)
- Derecho a la rectificación (generar nuevo proof con datos corregidos)

Ver [PRIVACY.md - Sección 6](./PRIVACY.md#6-derechos-de-los-usuarios)

---

## 7. Compliance Legal y Regulatorio

### 7.1 Cumplimiento de Leyes

- **OpenZKTool compatible con:**
- **GDPR** (EU) - Privacy by design, minimización de datos
- **CCPA** (California) - No venta de datos, transparencia
- **LGPD** (Brasil) - Principios similares a GDPR
- **KYC/AML** - Selective disclosure para reguladores

Ver [PRIVACY.md - Sección 4](./PRIVACY.md#4-compliance-con-regulaciones)

### 7.2 Framework de Compliance

- **Documentación de compliance:**

| Regulación | Documento | Status |
|------------|-----------|--------|
| GDPR | [PRIVACY.md](./PRIVACY.md) | - Compliant |
| DPGA Standard | Este archivo + otros | - Compliant |
| Open Source | [LICENSE](./LICENSE) | - AGPL-3.0 |
| Code of Conduct | [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md) | - Implementado |

### 7.3 Responsabilidad de Desarrolladores

⚠️ **Importante:**

**OpenZKTool (el SDK) proporciona herramientas. Los desarrolladores que integran OpenZKTool son responsables de:**

1. Cumplir con leyes locales
2. Obtener consentimientos necesarios
3. Implementar controles de compliance
4. No usar para actividades ilegales

**Disclaimer:**
```
OpenZKTool SDK es una herramienta de código abierto.
Team X1 - Xcapit Labs NO es responsable del uso que terceros hagan del software.
Los desarrolladores deben cumplir con leyes y regulaciones aplicables.
```

---

## 8. Impacto Social Positivo

### 8.1 Alineación con SDGs

- **OpenZKTool contribuye a:**
- **SDG 9:** Innovación e infraestructura
- **SDG 10:** Reducción de desigualdades
- **SDG 16:** Paz, justicia e instituciones sólidas
- **SDG 8:** Crecimiento económico

Ver [SDG_MAPPING.md](./SDG_MAPPING.md) para detalles completos.

### 8.2 Beneficios Sociales

- **Impacto positivo:**
- **Inclusión financiera** para 1.7 mil millones de no bancarizados
- **Privacidad como derecho** accesible para todos
- **Reducción de discriminación** basada en datos personales
- **Empoderamiento de individuos** con control sobre sus datos

- **Casos de uso benéficos:**
- Remesas privadas para trabajadores migrantes
- Microcrédito sin discriminación
- KYC portátil (hacer una vez, usar en múltiples plataformas)
- Protección de disidentes y activistas

---

## 9. Transparencia y Accountability

### 9.1 Open Source Total

- **100% transparente:**
- Todo el código es AGPL-3.0: https://github.com/xcapit/stellar-privacy-poc
- Commits públicos, historial completo
- Issues y pull requests públicos
- Roadmap público

### 9.2 Comunicación Abierta

- **Canales de comunicación:**
- GitHub Discussions: Preguntas y feedback de comunidad
- GitHub Issues: Bugs y feature requests
- Email: [Disponible en website](https://openzktool.vercel.app)

- **Respuesta a incidentes:**
- Security issues: < 48 horas
- General issues: < 7 días
- Pull requests: < 14 días

### 9.3 Accountability

- **Responsables del proyecto:**
- **Team X1 - Xcapit Labs**
- ⛓️ 6+ años experiencia blockchain
- 🏆 Multiple years of blockchain development experience
- 🌍 Basado en Argentina

- **Contacto:**
- Website: https://openzktool.vercel.app
- GitHub: https://github.com/xcapit/stellar-privacy-poc

---

## 10. Monitoreo y Mejora Continua

### 10.1 Revisiones Periódicas

- **Esta política será revisada:**
- Cada 6 meses
- Cuando cambien regulaciones
- Cuando se descubran nuevos riesgos
- Cuando la comunidad lo solicite

### 10.2 Incorporación de Feedback

- **Feedback de comunidad:**
- Issues de seguridad priorizados
- Sugerencias de mejora consideradas
- Contribuciones de comunidad bienvenidas

- **Auditorías externas:**
- 🔜 Auditoría profesional prevista Q2 2025
- 🔜 Bug bounty program Q4 2025
- 🔜 Formal verification de circuits

---

## 11. Educación y Concientización

### 11.1 Recursos Educativos

- **Documentación completa:**
- [Interactive Tutorial](./docs/getting-started/interactive-tutorial.md) - Aprende haciendo
- [FAQ](./docs/FAQ.md) - Preguntas frecuentes
- [Architecture](./docs/architecture/) - Entendiendo cómo funciona
- [Examples](./examples/) - Código de ejemplo con mejores prácticas

### 11.2 Promoción de Uso Ético

- **Guías de uso ético:**
- Documentación enfatiza compliance legal
- Ejemplos muestran casos de uso benéficos
- Advertencias sobre mal uso

### 11.3 Colaboración con Comunidad

- **Participación activa:**
- Responder preguntas en GitHub
- Participar en comunidad ZK (Discord, forums)
- Presentaciones en conferencias blockchain
- Workshops y tutoriales

---

## 12. Mitigación de Riesgos Específicos

### 12.1 Riesgo: Uso para Lavado de Dinero

**Mitigación:**
- - Compatible con KYC/AML mediante selective disclosure
- - Circuits pueden incluir encrypted user IDs para reguladores
- - Blockchain pública permite rastreo de transacciones
- - Documentación enfatiza compliance con regulaciones financieras

### 12.2 Riesgo: Discriminación Algorítmica

**Mitigación:**
- - Circuits open source y auditables
- - Documentación de cómo funcionan los checks
- - Comunidad puede reportar circuits sesgados
- - Ejemplos muestran uso justo e inclusivo

### 12.3 Riesgo: Fallo de Privacidad (Data Leak)

**Mitigación:**
- - Arquitectura Zero-Knowledge garantiza privacidad
- - Código auditado por comunidad
- - Testing extensivo
- - Documentación de limitaciones conocidas

### 12.4 Riesgo: Uso por Menores sin Supervisión

**Mitigación:**
- - Advertencias en documentación
- - Responsabilidad de desarrolladores que integran
- - Recomendaciones de controles parentales

---

## DPGA Compliance Checklist

Este documento cumple con **DPGA Indicator 9: Do No Harm**

**Requisitos cumplidos:**

- **Data Privacy & Security**
- [x] Políticas de protección de datos → [PRIVACY.md](./PRIVACY.md)
- [x] Seguridad de datos personales → Arquitectura Zero-Knowledge
- [x] Compliance con regulaciones → GDPR, CCPA, LGPD

- **Inappropriate & Illegal Content**
- [x] Código de conducta → [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md)
- [x] Proceso de reporte → GitHub Issues + Security
- [x] Moderación de contribuciones → Code review

- **Protection from Harassment**
- [x] Políticas anti-acoso → CODE_OF_CONDUCT
- [x] Procedimientos de enforcement → Código de conducta

**Verificación:** https://digitalpublicgoods.net/standard/

---

## 📞 Reporte de Problemas

Si descubres un uso dañino de OpenZKTool o vulnerabilidades de seguridad:

🔒 **Security issues:** Ver [SECURITY.md](./SECURITY.md)
🐛 **General issues:** https://github.com/xcapit/stellar-privacy-poc/issues
📧 **Email:** [Disponible en website](https://openzktool.vercel.app)

**Responderemos en < 48 horas**

---

## 📝 Historial de Versiones

| Versión | Fecha | Cambios |
|---------|-------|---------|
| 1.0 | 2025-01-10 | Versión inicial para DPGA compliance |

---

**Última actualización:** 2025-01-10
**Versión:** 1.0
**Team X1 - Xcapit Labs**
**Licencia:** AGPL-3.0

---

## 📚 Referencias

- Digital Public Goods Alliance: https://digitalpublicgoods.net
- DPGA Standard: https://digitalpublicgoods.net/standard/
- UN SDGs: https://sdgs.un.org/goals
- GDPR: https://gdpr.eu/
- Groth16 Security: https://eprint.iacr.org/2016/260.pdf
