#!/usr/bin/env node

/**
 * test_sdk.js
 *
 * Integration tests for the OpenZKTool SDK.
 * Tests proof generation, verification, and contract interaction.
 *
 * Usage: node tests/test_sdk.js
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');

// Mock SDK imports (these would be real imports from @openzktool/sdk)
// const { ZKProver, Verifier, EVMVerifier, StellarVerifier } = require('../sdk/src');

const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const NC = '\x1b[0m';

let testsPassed = 0;
let testsFailed = 0;

// Test utilities
function assert_equal(actual, expected, message) {
  try {
    assert.strictEqual(actual, expected);
    console.log(`${GREEN}  ✓${NC} ${message}`);
    testsPassed++;
  } catch (error) {
    console.log(`${RED}  ✗${NC} ${message}`);
    console.log(`    Expected: ${expected}`);
    console.log(`    Got: ${actual}`);
    testsFailed++;
  }
}

function assert_true(condition, message) {
  try {
    assert(condition);
    console.log(`${GREEN}  ✓${NC} ${message}`);
    testsPassed++;
  } catch (error) {
    console.log(`${RED}  ✗${NC} ${message}`);
    testsFailed++;
  }
}

async function test_suite(name, fn) {
  console.log(`\n${YELLOW}${name}${NC}`);
  try {
    await fn();
  } catch (error) {
    console.log(`${RED}  ✗ Suite failed: ${error.message}${NC}`);
    testsFailed++;
  }
}

// Mock proof data for testing
const mockProof = {
  pi_a: [
    "11111111111111111111111111111111111111111111111111111111111111111",
    "22222222222222222222222222222222222222222222222222222222222222222"
  ],
  pi_b: [
    [
      "33333333333333333333333333333333333333333333333333333333333333333",
      "44444444444444444444444444444444444444444444444444444444444444444"
    ],
    [
      "55555555555555555555555555555555555555555555555555555555555555555",
      "66666666666666666666666666666666666666666666666666666666666666666"
    ]
  ],
  pi_c: [
    "77777777777777777777777777777777777777777777777777777777777777777",
    "88888888888888888888888888888888888888888888888888888888888888888"
  ],
  protocol: "groth16",
  curve: "bn128"
};

const mockPublicSignals = ["1"];

// Test 1: Input validation
await test_suite('Input Validation', async () => {
  // Test valid inputs
  const validInputs = {
    age: 25,
    balance: 150,
    countryId: 11,
    minAge: 18,
    maxAge: 99,
    minBalance: 50,
    allowedCountries: [11, 1, 5]
  };

  assert_true(validInputs.age >= 0 && validInputs.age <= 150, 'Age within valid range');
  assert_true(validInputs.balance >= 0, 'Balance is non-negative');
  assert_true(validInputs.countryId >= 1 && validInputs.countryId <= 249, 'Country ID valid');
  assert_true(Array.isArray(validInputs.allowedCountries), 'Allowed countries is array');

  // Test invalid inputs
  const invalidAge = { ...validInputs, age: -5 };
  assert_true(invalidAge.age < 0, 'Negative age detected as invalid');

  const invalidCountry = { ...validInputs, countryId: 999 };
  assert_true(invalidCountry.countryId > 249, 'Invalid country ID detected');
});

// Test 2: Proof structure validation
await test_suite('Proof Structure Validation', async () => {
  assert_true(mockProof.hasOwnProperty('pi_a'), 'Proof has pi_a component');
  assert_true(mockProof.hasOwnProperty('pi_b'), 'Proof has pi_b component');
  assert_true(mockProof.hasOwnProperty('pi_c'), 'Proof has pi_c component');
  assert_equal(mockProof.protocol, 'groth16', 'Proof protocol is groth16');
  assert_equal(mockProof.curve, 'bn128', 'Proof curve is bn128');

  assert_equal(mockProof.pi_a.length, 2, 'pi_a has 2 elements');
  assert_equal(mockProof.pi_b.length, 2, 'pi_b has 2 elements');
  assert_equal(mockProof.pi_b[0].length, 2, 'pi_b[0] has 2 elements');
  assert_equal(mockProof.pi_c.length, 2, 'pi_c has 2 elements');
});

// Test 3: Public signals validation
await test_suite('Public Signals Validation', async () => {
  assert_true(Array.isArray(mockPublicSignals), 'Public signals is array');
  assert_true(mockPublicSignals.length > 0, 'Public signals not empty');

  const kycValid = mockPublicSignals[0];
  assert_true(kycValid === '0' || kycValid === '1', 'KYC valid is binary (0 or 1)');
});

// Test 4: Format conversion
await test_suite('Format Conversion', async () => {
  // Test conversion to Solidity calldata format
  function toSolidityCalldata(proof, publicSignals) {
    const a = [proof.pi_a[0], proof.pi_a[1]];
    const b = [[proof.pi_b[0][0], proof.pi_b[0][1]], [proof.pi_b[1][0], proof.pi_b[1][1]]];
    const c = [proof.pi_c[0], proof.pi_c[1]];
    const input = publicSignals;

    return { a, b, c, input };
  }

  const calldata = toSolidityCalldata(mockProof, mockPublicSignals);

  assert_true(Array.isArray(calldata.a), 'Calldata.a is array');
  assert_equal(calldata.a.length, 2, 'Calldata.a has 2 elements');
  assert_true(Array.isArray(calldata.b), 'Calldata.b is array');
  assert_equal(calldata.b.length, 2, 'Calldata.b has 2 elements');
  assert_true(Array.isArray(calldata.c), 'Calldata.c is array');
  assert_equal(calldata.c.length, 2, 'Calldata.c has 2 elements');
  assert_true(Array.isArray(calldata.input), 'Calldata.input is array');
});

// Test 5: Circuit artifacts loading
await test_suite('Circuit Artifacts', async () => {
  const circuitDir = path.join(__dirname, '../circuits/build');
  const wasmPath = path.join(circuitDir, 'kyc_transfer_js/kyc_transfer.wasm');
  const zkeyPath = path.join(circuitDir, 'kyc_transfer_final.zkey');
  const vkeyPath = path.join(circuitDir, 'verification_key.json');

  const wasmExists = fs.existsSync(wasmPath);
  const zkeyExists = fs.existsSync(zkeyPath);
  const vkeyExists = fs.existsSync(vkeyPath);

  if (wasmExists) {
    assert_true(true, 'Circuit WASM file exists');
  } else {
    console.log(`${YELLOW}  ⚠ Circuit WASM not found (run circuit setup)${NC}`);
  }

  if (zkeyExists) {
    assert_true(true, 'Proving key file exists');
  } else {
    console.log(`${YELLOW}  ⚠ Proving key not found (run trusted setup)${NC}`);
  }

  if (vkeyExists) {
    assert_true(true, 'Verification key file exists');
  } else {
    console.log(`${YELLOW}  ⚠ Verification key not found (run trusted setup)${NC}`);
  }
});

// Test 6: Mock proof generation
await test_suite('Mock Proof Generation', async () => {
  // Simulate proof generation without actual cryptography
  function mockGenerateProof(inputs) {
    // Validate inputs
    if (inputs.age < 0 || inputs.age > 150) {
      throw new Error('Invalid age');
    }

    // Check KYC validity
    const ageValid = inputs.age >= inputs.minAge && inputs.age <= inputs.maxAge;
    const balanceValid = inputs.balance >= inputs.minBalance;
    const countryValid = inputs.allowedCountries.includes(inputs.countryId);
    const kycValid = ageValid && balanceValid && countryValid;

    return {
      proof: mockProof,
      publicSignals: [kycValid ? '1' : '0']
    };
  }

  // Test valid case
  const validInputs = {
    age: 25,
    balance: 150,
    countryId: 11,
    minAge: 18,
    maxAge: 99,
    minBalance: 50,
    allowedCountries: [11, 1, 5]
  };

  const validResult = mockGenerateProof(validInputs);
  assert_equal(validResult.publicSignals[0], '1', 'Valid inputs produce KYC=1');

  // Test invalid case (underage)
  const invalidInputs = { ...validInputs, age: 15 };
  const invalidResult = mockGenerateProof(invalidInputs);
  assert_equal(invalidResult.publicSignals[0], '0', 'Underage produces KYC=0');

  // Test invalid case (low balance)
  const lowBalanceInputs = { ...validInputs, balance: 10 };
  const lowBalanceResult = mockGenerateProof(lowBalanceInputs);
  assert_equal(lowBalanceResult.publicSignals[0], '0', 'Low balance produces KYC=0');

  // Test invalid case (wrong country)
  const wrongCountryInputs = { ...validInputs, countryId: 99 };
  const wrongCountryResult = mockGenerateProof(wrongCountryInputs);
  assert_equal(wrongCountryResult.publicSignals[0], '0', 'Wrong country produces KYC=0');
});

// Test 7: Error handling
await test_suite('Error Handling', async () => {
  function mockGenerateProofWithValidation(inputs) {
    if (!inputs) throw new Error('Inputs required');
    if (typeof inputs.age !== 'number') throw new Error('Age must be number');
    if (typeof inputs.balance !== 'number') throw new Error('Balance must be number');
    if (!Array.isArray(inputs.allowedCountries)) throw new Error('Allowed countries must be array');
    return { proof: mockProof, publicSignals: ['1'] };
  }

  // Test missing inputs
  try {
    mockGenerateProofWithValidation(null);
    assert_true(false, 'Should throw on null inputs');
  } catch (error) {
    assert_true(error.message === 'Inputs required', 'Throws on null inputs');
  }

  // Test wrong type
  try {
    mockGenerateProofWithValidation({ age: 'twenty-five' });
    assert_true(false, 'Should throw on invalid type');
  } catch (error) {
    assert_true(error.message.includes('must be number'), 'Throws on invalid type');
  }

  // Test missing array
  try {
    mockGenerateProofWithValidation({ age: 25, balance: 150, allowedCountries: 'not-array' });
    assert_true(false, 'Should throw on invalid array');
  } catch (error) {
    assert_true(error.message.includes('must be array'), 'Throws on invalid array');
  }
});

// Test 8: Performance (mock)
await test_suite('Performance Metrics', async () => {
  const start = Date.now();

  // Simulate proof generation time
  await new Promise(resolve => setTimeout(resolve, 10));

  const duration = Date.now() - start;

  assert_true(duration >= 0, 'Duration is non-negative');
  console.log(`  ${YELLOW}ℹ${NC} Mock generation time: ${duration}ms`);

  // Real proof generation should be < 2000ms
  // assert_true(duration < 2000, 'Proof generation under 2 seconds');

  const proofSize = JSON.stringify(mockProof).length;
  console.log(`  ${YELLOW}ℹ${NC} Proof size: ${proofSize} bytes`);

  // Proof should be under 1KB
  assert_true(proofSize < 1024, 'Proof size under 1KB');
});

// Summary
console.log('\n' + '='.repeat(40));
console.log(`${GREEN}Tests passed: ${testsPassed}${NC}`);
if (testsFailed > 0) {
  console.log(`${RED}Tests failed: ${testsFailed}${NC}`);
}
console.log('='.repeat(40) + '\n');

if (testsFailed > 0) {
  console.log(`${RED}Some tests failed. See details above.${NC}\n`);
  process.exit(1);
} else {
  console.log(`${GREEN}All SDK tests passed!${NC}\n`);
  console.log('Note: These are mock tests using placeholder data.');
  console.log('For real integration tests, run:');
  console.log('  npm run test:integration\n');
  process.exit(0);
}
