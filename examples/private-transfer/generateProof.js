#!/usr/bin/env node

/**
 * generateProof.js
 *
 * Generates a ZK-SNARK proof for private KYC verification.
 * This script demonstrates proof generation without revealing private data.
 *
 * Usage:
 *   node generateProof.js [--age AGE] [--balance BALANCE] [--country COUNTRY_ID]
 *
 * Example:
 *   node generateProof.js --age 25 --balance 150 --country 11
 */

const snarkjs = require('snarkjs');
const fs = require('fs');
const path = require('path');

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const params = {
    age: 25,
    balance: 150,
    countryId: 11,
    minAge: 18,
    maxAge: 99,
    minBalance: 50,
    allowedCountries: [11, 1, 5, 0, 0, 0, 0, 0, 0, 0]
  };

  for (let i = 0; i < args.length; i += 2) {
    const flag = args[i];
    const value = args[i + 1];

    switch (flag) {
      case '--age':
        params.age = parseInt(value);
        break;
      case '--balance':
        params.balance = parseInt(value);
        break;
      case '--country':
        params.countryId = parseInt(value);
        break;
      case '--min-age':
        params.minAge = parseInt(value);
        break;
      case '--min-balance':
        params.minBalance = parseInt(value);
        break;
      case '--help':
        console.log('Usage: node generateProof.js [OPTIONS]');
        console.log('');
        console.log('Options:');
        console.log('  --age AGE              User age (default: 25)');
        console.log('  --balance BALANCE      User balance (default: 150)');
        console.log('  --country COUNTRY_ID   Country ID (default: 11)');
        console.log('  --min-age AGE          Minimum age requirement (default: 18)');
        console.log('  --min-balance BAL      Minimum balance requirement (default: 50)');
        console.log('  --help                 Show this help message');
        process.exit(0);
    }
  }

  return params;
}

// Validate inputs
function validateInputs(params) {
  const errors = [];

  if (params.age < 0 || params.age > 150) {
    errors.push(`Invalid age: ${params.age} (must be 0-150)`);
  }

  if (params.balance < 0) {
    errors.push(`Invalid balance: ${params.balance} (must be >= 0)`);
  }

  if (params.countryId < 1 || params.countryId > 249) {
    errors.push(`Invalid country ID: ${params.countryId} (must be 1-249)`);
  }

  if (errors.length > 0) {
    console.error('Input validation failed:');
    errors.forEach(err => console.error(`  - ${err}`));
    process.exit(1);
  }
}

// Main proof generation function
async function generateProof(inputs) {
  console.log('Starting proof generation...');
  console.log('');
  console.log('Private inputs (will NOT be revealed):');
  console.log(`  Age: ${inputs.age}`);
  console.log(`  Balance: ${inputs.balance}`);
  console.log(`  Country: ${inputs.countryId}`);
  console.log('');
  console.log('Public constraints:');
  console.log(`  Min age: ${inputs.minAge}`);
  console.log(`  Max age: ${inputs.maxAge}`);
  console.log(`  Min balance: ${inputs.minBalance}`);
  console.log(`  Allowed countries: [${inputs.allowedCountries.join(', ')}]`);
  console.log('');

  // Check if circuit artifacts exist
  const circuitDir = path.join(__dirname, '../../circuits/build');
  const wasmPath = path.join(circuitDir, 'kyc_transfer_js/kyc_transfer.wasm');
  const zkeyPath = path.join(circuitDir, 'kyc_transfer_final.zkey');

  if (!fs.existsSync(wasmPath)) {
    console.error(`Error: Circuit WASM not found at ${wasmPath}`);
    console.error('Run circuit setup first: cd circuits && bash scripts/prepare_and_setup.sh');
    process.exit(1);
  }

  if (!fs.existsSync(zkeyPath)) {
    console.error(`Error: Proving key not found at ${zkeyPath}`);
    console.error('Run trusted setup first: cd circuits && bash scripts/prepare_and_setup.sh');
    process.exit(1);
  }

  // Prepare circuit inputs
  const circuitInputs = {
    age: inputs.age,
    balance: inputs.balance,
    country: inputs.countryId,
    minAge: inputs.minAge,
    maxAge: inputs.maxAge,
    minBalance: inputs.minBalance,
    allowedCountries: inputs.allowedCountries
  };

  try {
    // Generate witness
    console.log('[1/3] Generating witness...');
    const startWitness = Date.now();
    const { proof, publicSignals } = await snarkjs.groth16.fullProve(
      circuitInputs,
      wasmPath,
      zkeyPath
    );
    const witnessTime = Date.now() - startWitness;
    console.log(`      Done in ${witnessTime}ms`);

    // Check if KYC is valid
    const kycValid = publicSignals[0] === '1';
    console.log('');
    console.log('[2/3] Proof generated successfully');
    console.log(`      KYC Valid: ${kycValid ? 'YES' : 'NO'}`);
    console.log('');

    if (!kycValid) {
      console.log('Note: Proof shows constraints were NOT satisfied.');
      console.log('This is expected if inputs do not meet requirements.');
      console.log('');
    }

    // Save proof to file
    const outputDir = path.join(__dirname, 'output');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const proofPath = path.join(outputDir, 'proof.json');
    const publicPath = path.join(outputDir, 'public.json');

    fs.writeFileSync(proofPath, JSON.stringify(proof, null, 2));
    fs.writeFileSync(publicPath, JSON.stringify(publicSignals, null, 2));

    console.log('[3/3] Proof saved to files');
    console.log(`      Proof: ${proofPath}`);
    console.log(`      Public signals: ${publicPath}`);
    console.log('');

    // Calculate proof size
    const proofSize = Buffer.byteLength(JSON.stringify(proof));
    console.log('Proof statistics:');
    console.log(`  Size: ${proofSize} bytes`);
    console.log(`  Generation time: ${witnessTime}ms`);
    console.log(`  Public output: kycValid = ${publicSignals[0]}`);
    console.log('');

    console.log('Next step: Verify on-chain');
    console.log('  node submitProof.js');
    console.log('');

    return { proof, publicSignals };
  } catch (error) {
    console.error('');
    console.error('Proof generation failed:', error.message);
    console.error('');

    if (error.message.includes('witness')) {
      console.error('This usually means:');
      console.error('  - Circuit constraints are not satisfied');
      console.error('  - Input values are invalid or out of range');
      console.error('  - Circuit logic has an error');
    }

    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  const params = parseArgs();
  validateInputs(params);
  generateProof(params)
    .then(() => {
      process.exit(0);
    })
    .catch(error => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}

module.exports = { generateProof };
