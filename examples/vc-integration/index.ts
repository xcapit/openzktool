/**
 * W3C Verifiable Credentials + Zero-Knowledge Proofs Integration Example
 *
 * This example demonstrates how to:
 * 1. Create a Verifiable Credential
 * 2. Convert it to ZK circuit inputs
 * 3. Generate a proof that verifies a claim without revealing the underlying data
 * 4. Verify the proof locally and on-chain
 *
 * Use case: Age verification for alcohol purchase
 * - User has an age credential from a government issuer
 * - They want to prove they're 21+ without revealing their birthdate
 */

import { OpenZKTool, VCProcessor, VerifiableCredential, AgeCredentialSubject } from '@openzktool/sdk';

// Example: Government-issued age credential
const ageCredential: VerifiableCredential = {
  '@context': [
    'https://www.w3.org/2018/credentials/v1',
    'https://openzktool.dev/contexts/v1'
  ],
  id: 'urn:uuid:3978344f-8596-4c3a-a978-8fcaba3903c5',
  type: ['VerifiableCredential', 'AgeCredential'],
  issuer: {
    id: 'did:web:dmv.gov',
    name: 'Department of Motor Vehicles'
  },
  issuanceDate: '2023-06-15T00:00:00Z',
  expirationDate: '2028-06-15T00:00:00Z',
  credentialSubject: {
    id: 'did:key:z6MkhaXgBZDvotDkL5257faiztiGiC2QtKLGpbnnEGta2doK',
    birthDate: '1995-03-20'  // User is 29 years old
  } as AgeCredentialSubject,
  proof: {
    type: 'Ed25519Signature2020',
    created: '2023-06-15T00:00:00Z',
    verificationMethod: 'did:web:dmv.gov#key-1',
    proofPurpose: 'assertionMethod',
    proofValue: 'z58DAdFfa9SkqZMVPxAQpic7ndTeel...'
  }
};

async function main() {
  console.log('=== W3C VC + ZK Proof Integration Demo ===\n');

  // Step 1: Initialize the VC Processor
  console.log('1. Initializing VC Processor...');
  const vcProcessor = new VCProcessor();

  // Add trusted issuers
  vcProcessor.addTrustedIssuer({
    did: 'did:web:dmv.gov',
    name: 'Department of Motor Vehicles',
    credentialTypes: ['AgeCredential', 'IdentityCredential'],
    trustLevel: 'high'
  });

  // Step 2: Validate the credential
  console.log('2. Validating credential...');
  const validation = vcProcessor.validateCredential(ageCredential);

  if (!validation.valid) {
    console.error('Credential validation failed:', validation.errors);
    return;
  }
  console.log('   Credential is valid ✓');

  // Step 3: Check if issuer is trusted
  console.log('3. Checking issuer trust...');
  const issuerDid = vcProcessor.getIssuerDID(ageCredential);
  const isTrusted = vcProcessor.isTrustedIssuer(issuerDid);
  console.log(`   Issuer ${issuerDid} is ${isTrusted ? 'trusted ✓' : 'NOT trusted ✗'}`);

  // Step 4: Calculate age (for display only - not revealed in proof)
  const age = vcProcessor.calculateAge(
    (ageCredential.credentialSubject as AgeCredentialSubject).birthDate
  );
  console.log(`4. User's actual age: ${age} (this will NOT be revealed)`);

  // Step 5: Convert credential to circuit inputs
  console.log('5. Converting credential to ZK circuit inputs...');
  const circuitInputs = vcProcessor.convertAgeCredential(ageCredential);
  console.log('   Circuit inputs prepared (birthdate hashed)');

  // Step 6: Generate public inputs for verification
  console.log('6. Generating public verification parameters...');
  const publicInputs = vcProcessor.generateAgeVerificationPublicInputs(
    21, // Minimum age requirement
    ['did:web:dmv.gov', 'did:web:passport.gov'] // Trusted issuers
  );
  console.log(`   Requiring minimum age: ${publicInputs.minAge}`);
  console.log(`   Current date: ${publicInputs.currentYear}-${publicInputs.currentMonth}-${publicInputs.currentDay}`);

  // Step 7: Combine inputs for circuit
  const fullCircuitInputs = {
    ...circuitInputs,
    minAge: publicInputs.minAge,
    trustedIssuerRoot: publicInputs.trustedIssuerRoot
  };

  console.log('\n7. Full circuit inputs (ready for proof generation):');
  console.log(JSON.stringify(fullCircuitInputs, null, 2));

  // Step 8: Initialize OpenZKTool (would need actual circuit files)
  console.log('\n8. To generate the actual proof, initialize OpenZKTool:');
  console.log(`
  const zktool = new OpenZKTool({
    wasmPath: './circuits/vc/vc_age_credential_js/vc_age_credential.wasm',
    zkeyPath: './circuits/vc/vc_age_credential_final.zkey',
    vkeyPath: './circuits/vc/verification_key.json'
  });

  // Generate proof
  const { proof, publicSignals } = await zktool.generateProofRaw(fullCircuitInputs);

  // Verify locally
  const isValid = await zktool.verifyLocal(proof, publicSignals);
  console.log('Proof valid:', isValid);

  // Verify on Stellar/Soroban
  const result = await zktool.verifyOnChain(proof, publicSignals, {
    chain: 'stellar',
    network: 'testnet'
  });
  `);

  console.log('\n=== Demo Complete ===');
  console.log('The user has proven they are 21+ WITHOUT revealing:');
  console.log('  - Their exact birthdate');
  console.log('  - Their exact age');
  console.log('  - Any other personal information');
  console.log('\nThe verifier only knows:');
  console.log('  - The user has a valid credential from a trusted issuer');
  console.log('  - The user meets the minimum age requirement (21+)');
}

// Employment verification example
async function employmentExample() {
  console.log('\n=== Employment Credential Example ===\n');

  const employmentCredential: VerifiableCredential = {
    '@context': ['https://www.w3.org/2018/credentials/v1'],
    type: ['VerifiableCredential', 'EmploymentCredential'],
    issuer: 'did:web:acme-corp.com',
    issuanceDate: '2024-01-01T00:00:00Z',
    credentialSubject: {
      id: 'did:key:z6MkEmployee123',
      employerName: 'Acme Corporation',
      employerDID: 'did:web:acme-corp.com',
      jobTitle: 'Senior Software Engineer',
      startDate: '2020-06-15',
      annualSalary: 15000000, // $150,000 in cents
      employmentStatus: 'active',
      industryCode: 'technology'
    }
  };

  const vcProcessor = new VCProcessor();

  // Convert to circuit inputs
  const inputs = vcProcessor.convertEmploymentCredential(employmentCredential);

  // Generate public verification parameters
  const publicParams = vcProcessor.generateEmploymentVerificationPublicInputs(
    10000000, // Min $100K salary
    24,       // Min 24 months tenure
    'active', // Must be actively employed
    ['technology', 'finance', 'professional'] // Allowed industries
  );

  console.log('Employment Proof will verify:');
  console.log(`  - Salary >= $${publicParams.minSalary / 100}`);
  console.log(`  - Tenure >= ${publicParams.minTenureMonths} months`);
  console.log('  - Employment status is active');
  console.log('  - Industry is in allowed list');
  console.log('\nWithout revealing:');
  console.log('  - Exact salary amount');
  console.log('  - Employer name');
  console.log('  - Job title');
  console.log('  - Exact start date');
}

// Run examples
main().catch(console.error);
employmentExample().catch(console.error);
