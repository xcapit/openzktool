#!/usr/bin/env node

/**
 * submitProof.js
 *
 * Submits a ZK proof to the Soroban verifier contract for on-chain verification.
 * Demonstrates multi-chain verification (can be adapted for EVM).
 *
 * Usage:
 *   node submitProof.js [--network testnet|mainnet] [--proof FILE]
 *
 * Example:
 *   node submitProof.js --network testnet
 *   node submitProof.js --proof output/proof.json --network testnet
 */

const StellarSDK = require('@stellar/stellar-sdk');
const fs = require('fs');
const path = require('path');

// Network configurations
const NETWORKS = {
  testnet: {
    rpcUrl: 'https://soroban-testnet.stellar.org',
    networkPassphrase: StellarSDK.Networks.TESTNET,
    contractId: 'CBPBVJJW5NMV4UVEDKSR6UO4DRBNWRQEMYKRYZI3CW6YK3O7HAZA43OI'
  },
  mainnet: {
    rpcUrl: 'https://soroban-mainnet.stellar.org',
    networkPassphrase: StellarSDK.Networks.PUBLIC,
    contractId: '' // TODO: Deploy to mainnet
  },
  local: {
    rpcUrl: 'http://localhost:8000/soroban/rpc',
    networkPassphrase: 'Standalone Network ; February 2017',
    contractId: process.env.LOCAL_CONTRACT_ID || ''
  }
};

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const params = {
    network: 'testnet',
    proofFile: path.join(__dirname, 'output/proof.json'),
    publicFile: path.join(__dirname, 'output/public.json'),
    secretKey: process.env.STELLAR_SECRET_KEY || ''
  };

  for (let i = 0; i < args.length; i += 2) {
    const flag = args[i];
    const value = args[i + 1];

    switch (flag) {
      case '--network':
        if (!NETWORKS[value]) {
          console.error(`Invalid network: ${value}`);
          console.error(`Available networks: ${Object.keys(NETWORKS).join(', ')}`);
          process.exit(1);
        }
        params.network = value;
        break;
      case '--proof':
        params.proofFile = value;
        break;
      case '--public':
        params.publicFile = value;
        break;
      case '--help':
        console.log('Usage: node submitProof.js [OPTIONS]');
        console.log('');
        console.log('Options:');
        console.log('  --network NAME    Network to use (testnet, mainnet, local)');
        console.log('  --proof FILE      Path to proof.json (default: output/proof.json)');
        console.log('  --public FILE     Path to public.json (default: output/public.json)');
        console.log('  --help            Show this help message');
        console.log('');
        console.log('Environment variables:');
        console.log('  STELLAR_SECRET_KEY    Your Stellar secret key');
        console.log('  LOCAL_CONTRACT_ID     Contract ID for local network');
        process.exit(0);
    }
  }

  return params;
}

// Load proof from file
function loadProof(proofFile, publicFile) {
  if (!fs.existsSync(proofFile)) {
    console.error(`Proof file not found: ${proofFile}`);
    console.error('Generate a proof first: node generateProof.js');
    process.exit(1);
  }

  if (!fs.existsSync(publicFile)) {
    console.error(`Public signals file not found: ${publicFile}`);
    console.error('Generate a proof first: node generateProof.js');
    process.exit(1);
  }

  const proof = JSON.parse(fs.readFileSync(proofFile, 'utf8'));
  const publicSignals = JSON.parse(fs.readFileSync(publicFile, 'utf8'));

  return { proof, publicSignals };
}

// Format proof for Soroban contract
function formatProofForSoroban(proof, publicSignals) {
  // Convert proof components to contract format
  // Groth16 proof structure: (A, B, C)
  const proofA = [
    BigInt(proof.pi_a[0]),
    BigInt(proof.pi_a[1])
  ];

  const proofB = [
    [BigInt(proof.pi_b[0][0]), BigInt(proof.pi_b[0][1])],
    [BigInt(proof.pi_b[1][0]), BigInt(proof.pi_b[1][1])]
  ];

  const proofC = [
    BigInt(proof.pi_c[0]),
    BigInt(proof.pi_c[1])
  ];

  const publicInputs = publicSignals.map(s => BigInt(s));

  return {
    a: proofA,
    b: proofB,
    c: proofC,
    publicInputs
  };
}

// Submit proof to Soroban
async function submitProof(params) {
  console.log('Submitting proof to Stellar network...');
  console.log('');

  const networkConfig = NETWORKS[params.network];
  console.log(`Network: ${params.network}`);
  console.log(`RPC: ${networkConfig.rpcUrl}`);
  console.log(`Contract: ${networkConfig.contractId}`);
  console.log('');

  // Check secret key
  if (!params.secretKey) {
    console.error('Error: STELLAR_SECRET_KEY environment variable not set');
    console.error('');
    console.error('Set your secret key:');
    console.error('  export STELLAR_SECRET_KEY="S..."');
    console.error('');
    console.error('For testing, generate a key:');
    console.error('  stellar keys generate test --network testnet');
    console.error('  stellar keys fund test --network testnet');
    process.exit(1);
  }

  // Check contract ID
  if (!networkConfig.contractId) {
    console.error(`Error: Contract not deployed to ${params.network}`);
    if (params.network === 'local') {
      console.error('Deploy contract first or set LOCAL_CONTRACT_ID environment variable');
    }
    process.exit(1);
  }

  // Load proof
  console.log('[1/4] Loading proof...');
  const { proof, publicSignals } = loadProof(params.proofFile, params.publicFile);
  console.log(`      Loaded from ${params.proofFile}`);
  console.log(`      Public output: kycValid = ${publicSignals[0]}`);
  console.log('');

  // Format for contract
  console.log('[2/4] Formatting proof for Soroban...');
  const formattedProof = formatProofForSoroban(proof, publicSignals);
  console.log('      Proof formatted');
  console.log('');

  // Setup Stellar connection
  console.log('[3/4] Connecting to Stellar network...');
  const server = new StellarSDK.SorobanRpc.Server(networkConfig.rpcUrl);
  const sourceKeypair = StellarSDK.Keypair.fromSecret(params.secretKey);
  const sourcePublicKey = sourceKeypair.publicKey();

  console.log(`      Source account: ${sourcePublicKey}`);

  try {
    // Get account info
    const account = await server.getAccount(sourcePublicKey);
    console.log(`      Sequence: ${account.sequenceNumber()}`);
    console.log('');

    // Build transaction
    console.log('[4/4] Submitting verification transaction...');

    const contract = new StellarSDK.Contract(networkConfig.contractId);

    // Note: Actual contract invocation would go here
    // For now, this is a placeholder showing the structure
    console.log('      Building transaction...');

    // This would be the actual contract call:
    // const tx = new StellarSDK.TransactionBuilder(account, {
    //   fee: StellarSDK.BASE_FEE,
    //   networkPassphrase: networkConfig.networkPassphrase
    // })
    //   .addOperation(contract.call('verify_proof', ...args))
    //   .setTimeout(30)
    //   .build();
    //
    // tx.sign(sourceKeypair);
    // const result = await server.sendTransaction(tx);

    console.log('');
    console.log('Transaction structure:');
    console.log('  Function: verify_proof');
    console.log('  Args:');
    console.log('    - proof_a:', formattedProof.a.map(x => x.toString()).join(', '));
    console.log('    - proof_b: [[...], [...]]');
    console.log('    - proof_c:', formattedProof.c.map(x => x.toString()).join(', '));
    console.log('    - public_inputs:', formattedProof.publicInputs.map(x => x.toString()).join(', '));
    console.log('');

    // Simulate response
    console.log('Status: SUCCESS (simulated)');
    console.log('');
    console.log('Verification result:');
    console.log(`  Valid: ${publicSignals[0] === '1' ? 'YES' : 'NO'}`);
    console.log(`  On-chain verified: true (simulated)`);
    console.log('');

    console.log('Note: This is a demonstration. Full Soroban integration requires:');
    console.log('  1. Deployed verifier contract');
    console.log('  2. Proper contract ABI/spec');
    console.log('  3. Transaction signing and submission');
    console.log('  4. Result parsing from contract invocation');
    console.log('');
    console.log('See docs/sdk_guide.md for complete integration examples.');

  } catch (error) {
    console.error('');
    console.error('Transaction failed:', error.message);
    console.error('');

    if (error.message.includes('account not found')) {
      console.error('Account does not exist or is not funded.');
      console.error('Fund your account:');
      console.error(`  stellar keys fund ${sourcePublicKey} --network ${params.network}`);
    } else if (error.message.includes('txBAD_SEQ')) {
      console.error('Sequence number mismatch. Retry the transaction.');
    }

    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  const params = parseArgs();
  submitProof(params).catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

module.exports = { submitProof, formatProofForSoroban };
