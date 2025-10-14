# Performance Benchmarks

> Automated performance tracking and optimization metrics for OpenZKTool

## 📁 Structure

```
benchmarks/
├── README.md
├── proof_generation.js         # Proof generation performance
├── verification_evm.js          # EVM gas costs and timing
├── verification_soroban.rs      # Soroban compute units
├── circuit_compilation.js       # Circuit compilation time
├── memory_usage.js              # Memory profiling
├── results/                     # Benchmark results
│   ├── baseline/
│   ├── latest/
│   └── history.json
└── config/
    └── benchmark.config.js
```

## 🚀 Running Benchmarks

### All Benchmarks
```bash
npm run benchmark
```

### Specific Benchmarks
```bash
npm run benchmark:proof         # Proof generation only
npm run benchmark:evm           # EVM verification only
npm run benchmark:soroban       # Soroban verification only
npm run benchmark:circuits      # Circuit compilation only
npm run benchmark:memory        # Memory usage only
```

### With Results Comparison
```bash
npm run benchmark:compare       # Compare with baseline
npm run benchmark:history       # Show historical trends
```

## 📊 Benchmark Metrics

### Proof Generation
- **Time:** Generation time in milliseconds
- **Memory:** Peak memory usage in MB
- **CPU:** CPU utilization percentage
- **Throughput:** Proofs per second

### EVM Verification
- **Gas Cost:** Gas used per verification
- **Transaction Time:** Time from submission to confirmation
- **Cost (USD):** Estimated cost at current gas price

### Soroban Verification
- **Compute Units:** CPU instructions used
- **Memory Bytes:** Memory allocated
- **Transaction Time:** Time from submission to confirmation
- **Cost (XLM):** Estimated cost in XLM

### Circuit Compilation
- **Compilation Time:** Time to compile circuit
- **R1CS Constraints:** Number of constraints generated
- **WASM Size:** Size of generated WASM file
- **ZKey Size:** Size of proving key

## 🎯 Performance Goals

| Metric | Current | Target | Status |
|--------|---------|--------|--------|
| Proof Generation | <1s | <500ms | 🟡 |
| EVM Gas Cost | ~250k | <200k | 🟡 |
| Soroban Compute | ~50k | <40k | 🟢 |
| Circuit Constraints | 586 | <10k | 🟢 |
| WASM Size | 20KB | <30KB | 🟢 |
| Verification Time | ~50ms | <100ms | 🟢 |

## 📈 Benchmark Output Example

```
╔══════════════════════════════════════════════════════════════╗
║                  OpenZKTool Benchmarks                       ║
╚══════════════════════════════════════════════════════════════╝

⚡ Proof Generation
  ├─ Average Time:      847ms
  ├─ Memory Usage:      142MB
  ├─ Throughput:        1.18 proofs/sec
  └─ Status:            🟢 PASS

⛓️  EVM Verification
  ├─ Gas Cost:          245,673 gas
  ├─ Transaction Time:  2.1s
  ├─ Cost (USD):        $0.12 @ 50 gwei
  └─ Status:            🟢 PASS

🌟 Soroban Verification
  ├─ Compute Units:     48,231
  ├─ Memory Bytes:      12,456
  ├─ Transaction Time:  1.3s
  ├─ Cost (XLM):        0.0001 XLM
  └─ Status:            🟢 PASS

📦 Circuit Compilation
  ├─ Compilation Time:  3.2s
  ├─ R1CS Constraints:  586
  ├─ WASM Size:         19.8KB
  └─ Status:            🟢 PASS

Summary:
  Total Time: 7.5s
  All Checks: ✅ PASSED
```

## 🔄 Continuous Benchmarking

Benchmarks run automatically on:
- Every commit to main (GitHub Actions)
- Pull requests (comment with results)
- Nightly builds (historical tracking)

Results are stored in `benchmarks/results/` and tracked over time.

## 📝 Writing Custom Benchmarks

Example benchmark file:

```javascript
const Benchmark = require('benchmark');
const { OpenZKTool } = require('../sdk/src');

const suite = new Benchmark.Suite('Proof Generation');

const zktool = new OpenZKTool({
  wasmPath: './circuits/artifacts/kyc_transfer.wasm',
  zkeyPath: './circuits/artifacts/kyc_transfer_final.zkey'
});

suite
  .add('GenerateProof#age25', async () => {
    await zktool.generateProof({
      age: 25,
      balance: 150,
      country: 32
    });
  })
  .on('cycle', (event) => {
    console.log(String(event.target));
  })
  .on('complete', function() {
    console.log('Fastest is ' + this.filter('fastest').map('name'));
  })
  .run({ async: true });
```

## 🔧 Configuration

Benchmark configuration in `config/benchmark.config.js`:

```javascript
module.exports = {
  iterations: 100,           // Number of iterations per test
  warmup: 10,               // Warmup iterations
  timeout: 30000,           // Max time per benchmark (ms)
  compareBaseline: true,    // Compare with baseline
  saveResults: true,        // Save results to file
  outputFormat: 'json',     // json | csv | html
  targets: {
    proofGeneration: {
      maxTime: 2000,        // Max acceptable time (ms)
      maxMemory: 500        // Max acceptable memory (MB)
    },
    evmGas: {
      maxGas: 300000        // Max acceptable gas
    },
    sorobanCompute: {
      maxCompute: 100000    // Max acceptable compute units
    }
  }
};
```

## 📊 Results Storage

Results are stored in JSON format:

```json
{
  "timestamp": "2025-01-14T12:00:00Z",
  "commit": "abc123",
  "branch": "main",
  "benchmarks": {
    "proofGeneration": {
      "avgTime": 847,
      "minTime": 782,
      "maxTime": 1024,
      "memoryUsage": 142
    },
    "evmVerification": {
      "gasUsed": 245673,
      "transactionTime": 2100
    }
  }
}
```

## 🎓 Understanding Results

### Good Performance
- 🟢 GREEN: Meeting or exceeding targets
- Performance is acceptable for production

### Needs Attention
- 🟡 YELLOW: Close to targets, watch for regression
- Consider optimization if trend worsens

### Poor Performance
- 🔴 RED: Exceeding targets, optimization needed
- Block merge until performance improves

## 🔗 Related Documentation

- [Performance Optimization Guide](../docs/architecture/PERFORMANCE.md)
- [Testing Strategy](../docs/testing/TESTING_STRATEGY.md)
- [CI/CD Workflows](../.github/workflows/)

---

**Status:** 🚧 Structure created - Benchmarks implementation in progress
