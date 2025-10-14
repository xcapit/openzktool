# Changelog

All notable changes to OpenZKTool will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned
- SDK/Library for TypeScript
- Integration examples
- CI/CD pipeline
- Multi-party trusted setup ceremony

---

## [0.2.0] - 2025-01-14

### Added
- **Complete BN254 pairing implementation (v4)** for Soroban
  - Full tower extension: Fq → Fq2 → Fq6 → Fq12
  - Optimal ate pairing with Miller loop
  - Final exponentiation (easy + hard parts)
- **Comprehensive testing strategy** with 49 unit tests
  - 21 tests for field arithmetic
  - 15 tests for pairing operations
  - 4 tests for Fq12 tower
  - 3 tests for curve operations
  - Property-based testing approach
- **Professional documentation structure**
  - Complete docs/README.md index (30+ files)
  - Learning paths for 3 audiences
  - Architecture documentation with diagrams
  - Testing guides and execution documentation
- **Cryptographic comparison document** (EVM vs Soroban)
  - Implementation details comparison
  - Performance analysis
  - Security considerations
- SECURITY.md - Security policy and vulnerability reporting
- IMPROVEMENT_PLAN.md - Comprehensive improvement roadmap
- CHANGELOG.md - This file

### Changed
- **Repository reorganization** for better clarity
  - Moved 20 markdown files to docs/
  - Organized 7 scripts into scripts/
  - Clean root directory
- **Updated Soroban contract to v4**
  - Pairing check now fully functional
  - WASM binary size: 20KB (optimized)
- **Updated web components** with v4 information
  - Features.tsx highlights complete pairing
  - Interoperability.tsx shows updated specs
- **README.md improvements**
  - Updated Soroban section with v4 details
  - Added links to new documentation
  - Improved technical details section

### Fixed
- Soroban verification script now expects version 4
- Web build dependency (reusify) installed
- Updated all documentation cross-references
- Fixed package.json script paths after reorganization

### Documentation
- Created comprehensive docs/README.md index
- Added CRYPTOGRAPHIC_COMPARISON.md
- Added TESTING_STRATEGY.md
- Added TEST_EXECUTION_GUIDE.md
- Updated README.md with v4 details
- Reorganized all documentation files

---

## [0.1.0] - 2025-01-10

### Added
- **Initial Proof of Concept (PoC) implementation**
- Circom circuits for KYC verification
  - range_proof.circom - Age range validation
  - solvency_check.circom - Balance verification
  - compliance_verify.circom - Country allowlist
  - kyc_transfer.circom - Main combined circuit
- **EVM verifier contract** (Solidity)
  - Groth16 verification logic
  - Deployed and tested on local Anvil
- **Soroban verifier contract v1-v3** (Rust)
  - BN254 field arithmetic (Fq, Fq2)
  - G1/G2 curve operations
  - Basic verification structure
  - Deployed on Stellar testnet
- **Web landing page** (Next.js + TypeScript)
  - Hero section
  - Features showcase
  - Multi-chain interoperability
  - Team and roadmap sections
  - Deployed to Vercel
- **Demo scripts**
  - demo_multichain.sh - Full multi-chain demo
  - demo_privacy_proof.sh - Privacy-focused narrative
  - demo_video.sh - Video recording demo
  - test_full_flow.sh - Complete test suite
- **Initial documentation**
  - README.md with project overview
  - QUICKSTART.md for quick setup
  - DEMO.md for step-by-step guide
  - VIDEO_DEMO.md for recording tips
  - ROADMAP.md with 4-phase plan

### Technical Details
- Circuit constraints: 586
- Proof size: ~800 bytes
- Verification time: <50ms off-chain
- Gas cost (EVM): ~250k gas
- Curve: BN254 (alt_bn128)
- Proof system: Groth16

---

## [0.0.1] - 2024-12-01

### Added
- Initial project setup
- Repository structure
- License (AGPL-3.0-or-later)
- Basic README

---

## Version History Summary

| Version | Date | Key Features | Status |
|---------|------|--------------|--------|
| 0.2.0 | 2025-01-14 | Complete pairing v4, Testing, Docs | ✅ Released |
| 0.1.0 | 2025-01-10 | Initial PoC, EVM + Soroban | ✅ Released |
| 0.0.1 | 2024-12-01 | Project setup | ✅ Released |

---

## Breaking Changes

None yet - project is in PoC phase.

---

## Migration Guides

### From v0.1.0 to v0.2.0

**Soroban Contract:**
- Contract version changed from 3 to 4
- Pairing implementation is now complete
- Update verification scripts to expect version 4

**Scripts:**
- Scripts moved from root to `scripts/` directory
- Update script paths in your automations:
  - `demo_multichain.sh` → `scripts/demo/demo_multichain.sh`
  - `test_full_flow.sh` → `scripts/testing/test_full_flow.sh`
  - etc.

**Documentation:**
- Documentation moved from root to `docs/` directory
- Update any documentation links:
  - `QUICKSTART.md` → `docs/guides/QUICKSTART.md`
  - `TESTING_STRATEGY.md` → `docs/testing/TESTING_STRATEGY.md`
  - etc.

---

## Deprecations

None yet.

---

## Security Notices

- **v0.2.0 and earlier:** PoC only, not for production
- **Trusted Setup:** Single-party ceremony (not secure)
- **No Audit:** Contracts not professionally audited
- **Testnet Only:** Do not use with real assets

See [SECURITY.md](./SECURITY.md) for full security policy.

---

## Credits

### Team X1 - Xcapit Labs

- **Fernando Boiero** - Project Lead, Architecture
- **Maximiliano César Nivoli** - Soroban Development
- **Francisco Anuar Ardúh** - Cryptography, Circuits
- **Joel Edgar Dellamaggiore Kuns** - ZKP Implementation
- **Franco Schillage** - DevOps, Infrastructure
- **Natalia Gatti, Carolina Medina** - QA, Testing

---

## Links

- **Repository:** https://github.com/xcapit/stellar-privacy-poc
- **Website:** https://openzktool.vercel.app
- **Documentation:** [docs/README.md](./docs/README.md)
- **Issues:** https://github.com/xcapit/stellar-privacy-poc/issues

---

**Note:** This changelog will be updated with each release. For unreleased changes, see the [Unreleased] section at the top.
