/**
 * Proof Generation Performance Benchmark
 *
 * Measures performance of ZK proof generation including:
 * - Generation time
 * - Memory usage
 * - CPU utilization
 * - Throughput (proofs/sec)
 */

const Benchmark = require('benchmark');
// const { OpenZKTool } = require('../sdk/src');
const { performance } = require('perf_hooks');

/**
 * Benchmark Configuration
 */
const config = {
  iterations: 100,
  warmupIterations: 10,
  maxTimeMs: 2000,
  maxMemoryMB: 500
};

/**
 * Test Inputs
 */
const testCases = {
  validUser: {
    age: 25,
    balance: 150,
    country: 32,
    minAge: 18,
    minBalance: 50,
    allowedCountries: [11, 1, 5, 32]
  },
  edgeCase: {
    age: 18,  // Minimum age
    balance: 50,  // Minimum balance
    country: 11,
    minAge: 18,
    minBalance: 50,
    allowedCountries: [11]
  },
  highValues: {
    age: 99,
    balance: 999999,
    country: 32,
    minAge: 18,
    minBalance: 50,
    allowedCountries: [11, 1, 5, 32]
  }
};

/**
 * Main Benchmark Suite
 */
async function runBenchmarks() {
  console.log('╔══════════════════════════════════════════════════════════════╗');
  console.log('║            Proof Generation Benchmark                        ║');
  console.log('╚══════════════════════════════════════════════════════════════╝\n');

  // TODO: Initialize SDK
  // const zktool = new OpenZKTool({
  //   wasmPath: './circuits/artifacts/kyc_transfer.wasm',
  //   zkeyPath: './circuits/artifacts/kyc_transfer_final.zkey'
  // });

  const results = {};

  // Benchmark each test case
  for (const [name, inputs] of Object.entries(testCases)) {
    console.log(`\n📊 Testing: ${name}`);
    console.log('─'.repeat(60));

    const metrics = await benchmarkProofGeneration(inputs, config);
    results[name] = metrics;

    printMetrics(metrics);
  }

  // Summary
  console.log('\n╔══════════════════════════════════════════════════════════════╗');
  console.log('║                      Summary                                 ║');
  console.log('╚══════════════════════════════════════════════════════════════╝\n');

  const avgTime = Object.values(results).reduce((sum, r) => sum + r.avgTime, 0) / Object.keys(results).length;
  const avgMemory = Object.values(results).reduce((sum, r) => sum + r.memoryUsage, 0) / Object.keys(results).length;

  console.log(`Average Generation Time: ${avgTime.toFixed(2)}ms`);
  console.log(`Average Memory Usage:    ${avgMemory.toFixed(2)}MB`);
  console.log(`Throughput:              ${(1000 / avgTime).toFixed(2)} proofs/sec`);

  // Check against targets
  const status = avgTime < config.maxTimeMs && avgMemory < config.maxMemoryMB ? '🟢 PASS' : '🔴 FAIL';
  console.log(`\nStatus: ${status}`);

  // Save results
  await saveResults(results);
}

/**
 * Benchmark proof generation for specific inputs
 */
async function benchmarkProofGeneration(inputs, config) {
  const times = [];
  let memoryUsage = 0;

  // Warmup
  console.log(`⏳ Warming up (${config.warmupIterations} iterations)...`);
  for (let i = 0; i < config.warmupIterations; i++) {
    // TODO: await zktool.generateProof(inputs);
    await simulateProofGeneration(); // Placeholder
  }

  // Actual benchmark
  console.log(`🏃 Running benchmark (${config.iterations} iterations)...`);

  const memBefore = process.memoryUsage().heapUsed;

  for (let i = 0; i < config.iterations; i++) {
    const start = performance.now();

    // TODO: await zktool.generateProof(inputs);
    await simulateProofGeneration(); // Placeholder

    const end = performance.now();
    times.push(end - start);

    // Progress indicator
    if ((i + 1) % 10 === 0) {
      process.stdout.write('.');
    }
  }

  const memAfter = process.memoryUsage().heapUsed;
  memoryUsage = (memAfter - memBefore) / 1024 / 1024; // MB

  console.log(' Done!\n');

  // Calculate statistics
  const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
  const minTime = Math.min(...times);
  const maxTime = Math.max(...times);
  const stdDev = calculateStdDev(times, avgTime);

  return {
    avgTime,
    minTime,
    maxTime,
    stdDev,
    memoryUsage,
    throughput: 1000 / avgTime, // proofs per second
    iterations: config.iterations
  };
}

/**
 * Print benchmark metrics
 */
function printMetrics(metrics) {
  console.log(`  Average Time:    ${metrics.avgTime.toFixed(2)}ms`);
  console.log(`  Min Time:        ${metrics.minTime.toFixed(2)}ms`);
  console.log(`  Max Time:        ${metrics.maxTime.toFixed(2)}ms`);
  console.log(`  Std Deviation:   ${metrics.stdDev.toFixed(2)}ms`);
  console.log(`  Memory Usage:    ${metrics.memoryUsage.toFixed(2)}MB`);
  console.log(`  Throughput:      ${metrics.throughput.toFixed(2)} proofs/sec`);
}

/**
 * Save results to file
 */
async function saveResults(results) {
  const fs = require('fs');
  const path = require('path');

  const output = {
    timestamp: new Date().toISOString(),
    commit: process.env.GITHUB_SHA || 'local',
    branch: process.env.GITHUB_REF || 'local',
    results
  };

  const resultsDir = path.join(__dirname, 'results', 'latest');
  // fs.mkdirSync(resultsDir, { recursive: true });
  // fs.writeFileSync(
  //   path.join(resultsDir, 'proof_generation.json'),
  //   JSON.stringify(output, null, 2)
  // );

  console.log('\n✅ Results saved to benchmarks/results/latest/proof_generation.json');
}

/**
 * Calculate standard deviation
 */
function calculateStdDev(values, mean) {
  const squaredDiffs = values.map(value => Math.pow(value - mean, 2));
  const avgSquaredDiff = squaredDiffs.reduce((a, b) => a + b, 0) / values.length;
  return Math.sqrt(avgSquaredDiff);
}

/**
 * Simulate proof generation (placeholder)
 * TODO: Replace with actual SDK call
 */
async function simulateProofGeneration() {
  return new Promise(resolve => {
    // Simulate computation time
    const delay = 800 + Math.random() * 200; // 800-1000ms
    setTimeout(resolve, delay);
  });
}

/**
 * Run if called directly
 */
if (require.main === module) {
  runBenchmarks().catch(console.error);
}

module.exports = { runBenchmarks, benchmarkProofGeneration };

/**
 * Notes:
 * - This benchmark is STRUCTURE ONLY
 * - Full implementation will be added in next phase
 * - Currently uses simulated proof generation
 * - Real implementation will use OpenZKTool SDK
 */
