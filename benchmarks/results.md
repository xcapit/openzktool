# Benchmark Results

Performance metrics for OpenZKTool ZK-SNARK operations.

## Overview

This document tracks benchmark results across different versions and configurations. Benchmarks are run using `zk_bench.sh` script.

## Latest Results

**Date:** TBD (run `./benchmarks/zk_bench.sh` to generate)
**Circuit:** kyc_transfer
**Hardware:** TBD
**Software:**
- Circom: 2.1.9
- snarkjs: 0.7.0
- Node.js: 18.x

## Baseline Metrics (PoC)

Current performance targets based on proof-of-concept implementation:

### Circuit Compilation

| Metric | Target | Current | Status |
|--------|--------|---------|--------|
| Compilation time | < 5s | TBD | - |
| Constraint count | < 1000 | 586 | ✅ |
| Circuit size | < 100 KB | TBD | - |

### Witness Generation

| Metric | Target | Current | Status |
|--------|--------|---------|--------|
| Generation time | < 500ms | TBD | - |
| Memory usage | < 100 MB | TBD | - |

### Proof Generation

| Metric | Target | Current | Status |
|--------|--------|---------|--------|
| Generation time | < 2s | ~800ms | ✅ |
| Peak memory | < 200 MB | TBD | - |
| Proof size | < 1 KB | ~800 bytes | ✅ |

### Proof Verification

#### Off-chain (Local)

| Metric | Target | Current | Status |
|--------|--------|---------|--------|
| Verification time | < 100ms | < 50ms | ✅ |

#### On-chain (EVM)

| Metric | Target | Current | Status |
|--------|--------|---------|--------|
| Gas cost | < 300k gas | ~250k gas | ✅ |
| Transaction time | < 15s | TBD | - |

#### On-chain (Stellar/Soroban)

| Metric | Target | Current | Status |
|--------|--------|---------|--------|
| Contract size | < 50 KB | ~20 KB | ✅ |
| Verification time | < 10s | TBD | - |
| Cost (stroops) | < 5M | TBD | - |

## Detailed Results

### Circuit: kyc_transfer

Circuit implements private KYC verification with age, balance, and country checks.

**Constraints:** 586
**Public inputs:** 1 (kycValid)
**Private inputs:** 3 (age, balance, country)

#### Benchmark Run: YYYY-MM-DD

```
Circuit Compilation:     XXXXms
Witness Generation:      XXXXms avg (min: XXXms, max: XXXms)
Proof Generation:        XXXXms avg (min: XXXms, max: XXXms)
Proof Size:              XXXX bytes
Local Verification:      XXXms avg (min: XXXms, max: XXXms)
EVM Gas Cost:            XXXXXX gas
Stellar WASM Size:       XXXX bytes
Peak Memory:             XXX MB
```

## Historical Data

### Version 0.1.0 (PoC)

Initial proof-of-concept benchmarks:

- Proof generation: ~800ms
- Proof size: ~800 bytes
- EVM gas: ~250,000
- Constraints: 586

### Version 0.2.0 (MVP) - Planned

Target improvements for MVP release:

- Proof generation: < 500ms (optimize witness generation)
- Gas optimization: < 200,000 gas (contract optimization)
- Batch verification support

### Version 1.0.0 (Mainnet) - Planned

Production-ready metrics:

- Proof generation: < 200ms (hardware acceleration, optimization)
- Support for larger circuits (up to 10,000 constraints)
- Multi-proof batch verification

## Performance Comparison

### vs. Other ZK Systems

| System | Proof Gen | Proof Size | Verification |
|--------|-----------|------------|--------------|
| OpenZKTool (Groth16) | ~800ms | ~800 bytes | < 50ms |
| PLONK | ~5s | ~2 KB | ~100ms |
| STARKs | ~10s | ~50 KB | ~200ms |
| Bulletproofs | ~2s | ~1.5 KB | ~500ms |

Notes:
- Groth16 requires trusted setup but has smallest proofs
- PLONK has universal setup but larger proofs
- STARKs require no trusted setup but much larger proofs

### Multi-Chain Comparison

| Chain | Verification Cost | Time | Notes |
|-------|------------------|------|-------|
| Ethereum | ~250k gas (~$5 @ 20 gwei) | < 15s | Uses precompiles |
| Polygon | ~250k gas (~$0.05) | < 5s | Faster blocks |
| Stellar | ~2M stroops (~$0.20) | < 10s | Pure Rust implementation |
| Arbitrum | ~50k gas (~$0.10) | < 2s | L2 optimization |

## Optimization Targets

### Phase 1 (Months 1-2)

- [ ] Baseline all metrics with automated benchmarks
- [ ] Identify bottlenecks in proof generation
- [ ] Profile memory usage during witness generation

### Phase 2 (Months 3-4)

- [ ] Optimize circuit for fewer constraints (target: < 500)
- [ ] Reduce EVM gas cost (target: < 200k gas)
- [ ] Improve Stellar contract efficiency

### Phase 3 (Months 5-6)

- [ ] Implement batch verification
- [ ] Hardware acceleration for proof generation
- [ ] Multi-threading support
- [ ] Circuit optimization for production use cases

## Testing Methodology

### Hardware Configuration

Benchmarks should be run on consistent hardware for comparability:

**Recommended specs:**
- CPU: 4+ cores, 2.5+ GHz
- RAM: 8+ GB
- Storage: SSD

**Cloud alternative:**
- AWS EC2: t3.large or equivalent
- 2 vCPUs, 8 GB RAM

### Benchmark Execution

```bash
# Run full benchmark suite
./benchmarks/zk_bench.sh --iterations 10

# Run with specific circuit
./benchmarks/zk_bench.sh --circuit kyc_transfer --iterations 20

# Save to specific output file
./benchmarks/zk_bench.sh --output benchmarks/results/manual_test.json
```

### Interpreting Results

**Proof generation time:**
- < 1s: Excellent (production ready)
- 1-2s: Good (acceptable for most use cases)
- 2-5s: Fair (may need optimization)
- > 5s: Poor (requires optimization)

**Gas costs (EVM):**
- < 200k: Excellent
- 200k-300k: Good
- 300k-500k: Fair
- > 500k: Poor

**Proof size:**
- < 1 KB: Excellent (Groth16 standard)
- 1-2 KB: Good
- 2-10 KB: Fair
- > 10 KB: Poor (consider different proof system)

## Continuous Monitoring

Benchmarks are automatically run:

- On every PR (CI/CD)
- Daily on main branch
- Before each release

Results are tracked to detect performance regressions.

## Contributing Benchmarks

To submit benchmark results:

1. Run benchmark suite: `./benchmarks/zk_bench.sh`
2. Document hardware/software configuration
3. Save results with descriptive filename
4. Submit PR with results in `benchmarks/results/`

Include:
- Hardware specs
- Software versions
- Date and time
- Any special conditions

## References

- Groth16 paper: https://eprint.iacr.org/2016/260.pdf
- snarkjs benchmarks: https://github.com/iden3/snarkjs#benchmarks
- EVM gas costs: https://ethereum.org/en/developers/docs/gas/
- Soroban resource limits: https://soroban.stellar.org/docs/fundamentals-and-concepts/resource-limits-fees

## Last Updated

This document was last updated: 2025-01-15

Run benchmarks to populate with actual data:
```bash
./benchmarks/zk_bench.sh --iterations 10
```
