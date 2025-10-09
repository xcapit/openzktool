# 📚 Stellar Privacy SDK - Documentation

**Complete technical documentation for the ZKPrivacy toolkit**

---

## 📖 Documentation Structure

### Getting Started
- [Installation Guide](./getting-started/installation.md) - Setup dependencies and environment
- [Quick Start](./getting-started/quickstart.md) - Run your first demo in 5 minutes
- [Architecture Overview](./getting-started/architecture.md) - Understanding the system design

### Testing & Demos
- [**Testing Guide**](./testing/README.md) ⭐ **Start here for running tests**
- [Demo Scripts Guide](./testing/demo-scripts.md) - All available demo scripts
- [Multi-Chain Testing](./testing/multi-chain.md) - Testing across EVM and Soroban
- [CI/CD Integration](./testing/ci-cd.md) - Automated testing setup

### Proof Generation
- [Circuit Design](./circuits/README.md) - Circom circuits explained
- [Generating Proofs](./circuits/proof-generation.md) - Step-by-step proof creation
- [Verification Keys](./circuits/verification-keys.md) - Managing cryptographic keys

### Blockchain Integration
- [EVM Deployment](./blockchain/evm.md) - Ethereum/EVM chains
- [Soroban Deployment](./blockchain/soroban.md) - Stellar/Soroban integration
- [Multi-Chain Architecture](./blockchain/multi-chain.md) - How it works across chains

### SDK Reference
- API Documentation *(coming soon)*
- JavaScript/TypeScript SDK *(coming soon)*
- Rust SDK *(coming soon)*

### Use Cases
- [Privacy-Preserving KYC](./use-cases/kyc.md)
- [Confidential DeFi](./use-cases/defi.md)
- [Cross-Chain Identity](./use-cases/identity.md)

### Security & Compliance
- [Security Model](./security/model.md)
- [Audit Reports](./security/audits.md) *(coming soon)*
- [Compliance Framework](./security/compliance.md)

---

## 🚀 Quick Links

**First time here?** → Start with [Quick Start Guide](./getting-started/quickstart.md)

**Want to run tests?** → See [Testing Guide](./testing/README.md)

**Building an integration?** → Check [Blockchain Integration](./blockchain/README.md)

**Understanding ZK proofs?** → Read [Architecture Overview](./getting-started/architecture.md)

---

## 🔍 What is Stellar Privacy SDK?

The Stellar Privacy SDK (ZKPrivacy) enables **privacy-preserving transactions** on Stellar and other blockchains using **Zero-Knowledge Proofs (ZK-SNARKs)**.

### Core Capabilities

- ✅ **Prove without revealing**: Age ≥ 18 without showing exact age
- ✅ **Multi-chain**: Same proof works on Ethereum AND Stellar
- ✅ **Compliance-ready**: Selective disclosure for auditors
- ✅ **Production-ready**: 800-byte proofs, <50ms verification

### Key Components

1. **ZK Circuits** (Circom) - Define what to prove
2. **EVM Verifier** (Solidity) - Verify on Ethereum-compatible chains
3. **Soroban Verifier** (Rust/WASM) - Verify on Stellar
4. **SDK** (JS/TS) - Developer-friendly API
5. **Banking Layer** - KYC/AML integration *(roadmap)*
6. **Compliance Dashboard** - Audit interface *(roadmap)*

---

## 📊 Documentation Status

| Section | Status | Priority |
|---------|--------|----------|
| Testing Guide | ✅ Complete | High |
| Quick Start | ✅ Complete | High |
| Demo Scripts | ✅ Complete | High |
| Multi-Chain Testing | ✅ Complete | High |
| Architecture Overview | 🚧 In Progress | High |
| Circuit Design | 🚧 In Progress | Medium |
| EVM Deployment | 🚧 In Progress | Medium |
| Soroban Deployment | 🚧 In Progress | Medium |
| API Reference | 📋 Planned | Medium |
| Security Model | 📋 Planned | High |
| Use Cases | 📋 Planned | Low |

**Legend**: ✅ Complete | 🚧 In Progress | 📋 Planned

---

## 🤝 Contributing to Docs

Found an error or want to improve documentation?

1. Fork the repository
2. Edit markdown files in `docs/`
3. Submit a pull request
4. Tag with `documentation` label

See [CONTRIBUTING.md](../CONTRIBUTING.md) for guidelines.

---

## 📞 Support

- 🌐 Website: https://zkprivacy.vercel.app
- 💬 GitHub Issues: https://github.com/xcapit/stellar-privacy-poc/issues
- 📧 Email: Contact via website
- 📚 Additional Resources: See [README.md](../README.md)

---

*Documentation version: 0.1.0-poc*
*Last updated: 2025-01-10*
*Team X1 - Xcapit Labs*
