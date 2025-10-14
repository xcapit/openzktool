# Security Policy

## 🔒 Supported Versions

| Version | Supported | Status |
|---------|-----------|--------|
| 0.2.0-poc | ✅ Yes | Current (PoC) |
| < 0.2.0 | ❌ No | Deprecated |

**Note:** This is a Proof of Concept. Not recommended for production use without professional security audit.

---

## 🐛 Reporting a Vulnerability

**DO NOT** open public issues for security vulnerabilities.

### How to Report

1. **Email:** fboiero@frvm.utn.edu.ar
2. **Subject:** `[SECURITY] OpenZKTool Vulnerability Report`
3. **Include:**
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

### Response Timeline

- **Initial Response:** Within 48 hours
- **Status Update:** Within 7 days
- **Fix Timeline:** Depends on severity
  - Critical: 7-14 days
  - High: 14-30 days
  - Medium: 30-60 days
  - Low: Next release

---

## 🛡️ Security Measures

### Cryptographic Security

#### Groth16 SNARKs
- **Algorithm:** Groth16 proof system
- **Curve:** BN254 (alt_bn128)
- **Security Level:** ~128-bit security
- **Assumption:** Computational Discrete Logarithm hardness

#### Trusted Setup
- **Status:** ⚠️ Using Powers of Tau ceremony
- **Participants:** Single-party (PoC only)
- **Production:** Multi-party ceremony required (100+ participants)
- **Risk:** Current setup is for testing only

**⚠️ WARNING:** The current trusted setup is NOT secure for production. A multi-party ceremony is required before mainnet deployment.

### Smart Contract Security

#### Soroban Contract (Stellar)
- **Language:** Rust (no_std)
- **Version:** 4 (Complete BN254 pairing)
- **Testing:** 49 unit tests
- **Audit Status:** ❌ Not audited
- **Network:** Testnet only

#### EVM Contract (Ethereum)
- **Language:** Solidity 0.8+
- **Framework:** Foundry
- **Testing:** Forge tests
- **Audit Status:** ❌ Not audited
- **Network:** Local/testnet only

---

## ⚠️ Known Limitations (PoC)

### Critical Limitations

1. **Trusted Setup**
   - Single-party ceremony (NOT production-safe)
   - Toxic waste not destroyed
   - Multi-party ceremony required

2. **No Security Audit**
   - Contracts not audited by third party
   - Cryptographic implementation not formally verified
   - Use at your own risk

3. **Test Networks Only**
   - Deployed on testnets only
   - Not recommended for mainnet
   - No real assets should be used

4. **Limited Testing**
   - ~50% code coverage
   - No fuzzing tests
   - No formal verification

### Implementation Notes

1. **Field Arithmetic**
   - Montgomery form used
   - Overflow checks in place
   - No constant-time guarantees (timing attacks possible)

2. **Pairing Implementation**
   - Miller loop implemented
   - Final exponentiation optimized
   - Not reviewed by cryptography experts

3. **Input Validation**
   - Basic validation only
   - No advanced sanitization
   - Malicious inputs not extensively tested

---

## 🎯 Security Roadmap

### Phase 1: Pre-Audit (Q1 2025)
- [ ] Increase test coverage to 95%
- [ ] Add fuzzing tests
- [ ] Implement constant-time operations where needed
- [ ] Multi-party trusted setup ceremony
- [ ] Third-party code review

### Phase 2: Audit (Q2 2025)
- [ ] Professional security audit by UTN FRVM Blockchain Lab
  - Francisco Anuar Ardúh (Principal Researcher)
  - Joel Edgar Dellamaggiore Kuns (Blockchain Specialist)
- [ ] Formal verification of critical functions
- [ ] Penetration testing
- [ ] Gas optimization audit

### Phase 3: Mainnet Ready (Q3 2025)
- [ ] Address all audit findings
- [ ] Public bug bounty program
- [ ] Continuous security monitoring
- [ ] Incident response plan

---

## 🏆 Responsible Disclosure

### Disclosure Policy

1. **Private Reporting:** 90 days before public disclosure
2. **Coordinated Disclosure:** Work with team on fix
3. **Public Disclosure:** After fix deployed
4. **CVE Assignment:** For critical vulnerabilities

### Acknowledgments

We will publicly acknowledge security researchers who:
- Report valid vulnerabilities
- Follow responsible disclosure
- Allow time for fixes

**Hall of Fame:** (Empty - be the first!)

---

## 🔍 Security Best Practices for Users

### For Developers

1. **Never use production keys** with PoC contracts
2. **Test on testnets only**
3. **Review all code** before integrating
4. **Use official repositories** only
5. **Keep dependencies updated**

### For Smart Contract Deployers

1. **Conduct own security review**
2. **Use multi-party trusted setup**
3. **Deploy to testnet first**
4. **Monitor for unusual activity**
5. **Have incident response plan**

### For End Users

1. **Only interact with audited contracts**
2. **Verify contract addresses**
3. **Start with small amounts**
4. **Understand risks**
5. **Keep wallets secure**

---

## 📚 Security Resources

### Documentation
- [Groth16 Paper](https://eprint.iacr.org/2016/260.pdf)
- [BN254 Curve Specification](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-196.md)
- [Soroban Security](https://developers.stellar.org/docs/smart-contracts/security)
- [Smart Contract Security Best Practices](https://consensys.github.io/smart-contract-best-practices/)

### Tools
- [Slither](https://github.com/crytic/slither) - Solidity static analyzer
- [Mythril](https://github.com/ConsenSys/mythril) - Security analysis tool
- [cargo-audit](https://github.com/rustsec/rustsec) - Rust dependency auditor
- [Foundry](https://book.getfoundry.sh/) - Ethereum testing framework

---

## 🚨 Security Incidents

### Incident Response

In case of security incident:
1. **Assess severity** (Critical/High/Medium/Low)
2. **Contain the issue** (pause contracts if needed)
3. **Notify affected parties**
4. **Develop and test fix**
5. **Deploy fix and verify**
6. **Post-mortem analysis**
7. **Public disclosure** (after fix)

### Past Incidents

None reported (project is new).

---

## 📞 Contact

- **Security Email:** fboiero@frvm.utn.edu.ar
- **GitHub Security Advisories:** [Create Advisory](https://github.com/xcapit/stellar-privacy-poc/security/advisories/new)
- **PGP Key:** (To be added)

---

## 📝 Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2025-01-14 | Initial security policy |

---

**⚠️ DISCLAIMER:** This is a Proof of Concept project. Use in production at your own risk. No warranties provided. See [LICENSE](./LICENSE) for full terms.

---

**Last Updated:** 2025-01-14
**Next Review:** 2025-02-14
