# W3C Verifiable Credentials + Zero-Knowledge Proofs

This guide explains how to use OpenZKTool to create privacy-preserving proofs from W3C Verifiable Credentials.

## Overview

Verifiable Credentials (VCs) are a W3C standard for digital credentials that can be cryptographically verified. OpenZKTool extends VCs with Zero-Knowledge Proofs, enabling users to prove specific claims about their credentials without revealing the underlying data.

### Example Use Case

A user has an age credential from the DMV. They want to prove they're 21+ to purchase alcohol, but don't want to reveal their exact birthdate. With OpenZKTool:

1. The user's VC contains their birthdate (private)
2. They generate a ZK proof that shows "age >= 21"
3. The verifier confirms the proof without seeing the birthdate

## Architecture

```
┌─────────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  W3C Verifiable     │     │   VCProcessor    │     │   ZK Circuit    │
│    Credential       │ ──> │  (SDK module)    │ ──> │  (Circom)       │
│                     │     │                  │     │                 │
│  birthDate: 1995-01 │     │  Extract fields  │     │  Prove age >= 21│
│  issuer: did:gov    │     │  Hash sensitive  │     │  Without reveal │
└─────────────────────┘     └──────────────────┘     └─────────────────┘
                                                              │
                                                              ▼
                                                     ┌─────────────────┐
                                                     │   Proof Output  │
                                                     │                 │
                                                     │  isOver21: true │
                                                     │  issuerValid: ✓ │
                                                     └─────────────────┘
```

## Supported Credential Types

### AgeCredential

Verify age-based claims without revealing the exact birthdate.

**Private Data:**
- `birthDate` - The user's date of birth

**Provable Claims:**
- User is at least N years old
- Credential is from a trusted issuer
- Credential has not expired

**Circuit:** `circuits/vc/vc_age_credential.circom`

### IdentityCredential

Verify identity attributes without revealing personal information.

**Private Data:**
- `givenName`, `familyName` - User's name
- `documentNumber` - Passport/ID number

**Provable Claims:**
- Nationality is in an allowed list
- Document type is valid (passport, national ID, etc.)
- Credential is from a trusted issuer

**Circuit:** `circuits/vc/vc_identity_credential.circom`

### EmploymentCredential

Verify employment status without revealing salary or employer.

**Private Data:**
- `employerName` - Company name
- `jobTitle` - Position held
- `annualSalary` - Exact compensation
- `startDate` - Employment start date

**Provable Claims:**
- Salary is above a minimum threshold
- Employment tenure is at least N months
- Currently employed (active status)
- Industry is in an allowed list

**Circuit:** `circuits/vc/vc_employment_credential.circom`

## SDK Usage

### Installation

```bash
npm install @openzktool/sdk
```

### Basic Example: Age Verification

```typescript
import {
  VCProcessor,
  OpenZKTool,
  VerifiableCredential,
  AgeCredentialSubject
} from '@openzktool/sdk';

// 1. Create or receive a Verifiable Credential
const ageCredential: VerifiableCredential = {
  '@context': ['https://www.w3.org/2018/credentials/v1'],
  type: ['VerifiableCredential', 'AgeCredential'],
  issuer: {
    id: 'did:web:dmv.gov',
    name: 'Department of Motor Vehicles'
  },
  issuanceDate: '2024-01-15T00:00:00Z',
  expirationDate: '2029-01-15T00:00:00Z',
  credentialSubject: {
    id: 'did:key:z6MkUser123',
    birthDate: '1995-03-20'
  } as AgeCredentialSubject
};

// 2. Initialize the VC Processor
const vcProcessor = new VCProcessor();

// 3. Register trusted issuers
vcProcessor.addTrustedIssuer({
  did: 'did:web:dmv.gov',
  name: 'Department of Motor Vehicles',
  credentialTypes: ['AgeCredential', 'IdentityCredential'],
  trustLevel: 'high'
});

// 4. Validate the credential
const validation = vcProcessor.validateCredential(ageCredential);
if (!validation.valid) {
  throw new Error(`Invalid credential: ${validation.errors.join(', ')}`);
}

// 5. Check issuer trust
const issuerDid = vcProcessor.getIssuerDID(ageCredential);
if (!vcProcessor.isTrustedIssuer(issuerDid)) {
  throw new Error('Credential issuer is not trusted');
}

// 6. Convert credential to circuit inputs
const circuitInputs = vcProcessor.convertAgeCredential(ageCredential);
console.log('Circuit inputs:', circuitInputs);
// Output: { birthYear: 1995, birthMonth: 3, birthDay: 20, ... }

// 7. Generate public verification parameters
const publicInputs = vcProcessor.generateAgeVerificationPublicInputs(
  21, // Minimum age to prove
  ['did:web:dmv.gov'] // Accepted issuers
);

// 8. Combine for circuit
const fullInputs = {
  ...circuitInputs,
  minAge: publicInputs.minAge,
  trustedIssuerRoot: publicInputs.trustedIssuerRoot
};

// 9. Generate the ZK proof
const zktool = new OpenZKTool({
  wasmPath: './circuits/vc/vc_age_credential_js/vc_age_credential.wasm',
  zkeyPath: './circuits/vc/vc_age_credential_final.zkey',
  vkeyPath: './circuits/vc/verification_key.json'
});

const { proof, publicSignals } = await zktool.generateProof(fullInputs);

// 10. Verify locally
const isValid = await zktool.verifyLocal(proof, publicSignals);
console.log('Proof valid:', isValid);

// 11. Verify on Stellar/Soroban
const result = await zktool.verifyOnChain(proof, publicSignals, {
  chain: 'stellar',
  network: 'testnet',
  contractId: 'CBPBVJJW5NMV4UVEDKSR6UO4DRBNWRQEMYKRYZI3CW6YK3O7HAZA43OI'
});
```

### Employment Verification Example

```typescript
import {
  VCProcessor,
  VerifiableCredential,
  EmploymentCredentialSubject
} from '@openzktool/sdk';

const employmentCredential: VerifiableCredential = {
  '@context': ['https://www.w3.org/2018/credentials/v1'],
  type: ['VerifiableCredential', 'EmploymentCredential'],
  issuer: 'did:web:acme-corp.com',
  issuanceDate: '2024-01-01T00:00:00Z',
  credentialSubject: {
    id: 'did:key:z6MkEmployee456',
    employerName: 'Acme Corporation',
    employerDID: 'did:web:acme-corp.com',
    jobTitle: 'Senior Engineer',
    startDate: '2020-06-15',
    annualSalary: 15000000, // $150,000 in cents
    employmentStatus: 'active',
    industryCode: 'technology'
  } as EmploymentCredentialSubject
};

const vcProcessor = new VCProcessor();

// Convert to circuit inputs
const inputs = vcProcessor.convertEmploymentCredential(employmentCredential);

// Generate verification parameters
// Prove: salary >= $100K, tenure >= 24 months, active, tech industry
const publicParams = vcProcessor.generateEmploymentVerificationPublicInputs(
  10000000,  // $100,000 minimum salary
  24,        // 24 months minimum tenure
  'active',  // Must be actively employed
  ['technology', 'finance'] // Allowed industries
);

// The proof will verify:
// - Salary is at least $100,000
// - Employed for at least 2 years
// - Currently active
// - Works in tech or finance
//
// WITHOUT revealing:
// - Exact salary ($150,000)
// - Employer name (Acme Corp)
// - Job title (Senior Engineer)
// - Exact start date
```

## Circuit Inputs Reference

### Age Credential Circuit Inputs

| Input | Type | Privacy | Description |
|-------|------|---------|-------------|
| `birthYear` | number | Private | Year of birth |
| `birthMonth` | number | Private | Month of birth (1-12) |
| `birthDay` | number | Private | Day of birth (1-31) |
| `credentialHash` | string | Private | Hash of credential data |
| `issuerCommitment` | string | Private | Issuer signature commitment |
| `currentYear` | number | Public | Current year for age calculation |
| `currentMonth` | number | Public | Current month |
| `currentDay` | number | Public | Current day |
| `minAge` | number | Public | Minimum age to prove |
| `trustedIssuerRoot` | string | Public | Merkle root of trusted issuers |

### Identity Credential Circuit Inputs

| Input | Type | Privacy | Description |
|-------|------|---------|-------------|
| `nameHash` | string | Private | Hash of full name |
| `nationality` | number | Private | ISO 3166-1 numeric country code |
| `documentType` | number | Private | Document type code |
| `documentHash` | string | Private | Hash of document number |
| `issuerSignature` | string | Private | Issuer signature |
| `subjectDID` | string | Private | Subject's DID hash |
| `allowedNationalities` | number[] | Public | Array of allowed country codes |
| `allowedDocTypes` | number | Public | Bitmask of allowed document types |

### Employment Credential Circuit Inputs

| Input | Type | Privacy | Description |
|-------|------|---------|-------------|
| `employerHash` | string | Private | Hash of employer name/DID |
| `jobTitleHash` | string | Private | Hash of job title |
| `startYear` | number | Private | Employment start year |
| `startMonth` | number | Private | Employment start month |
| `annualSalary` | number | Private | Annual salary in cents |
| `employmentStatus` | number | Private | Status code (1=active, 2=terminated, 3=leave) |
| `industryCode` | number | Private | NAICS industry code |
| `minSalary` | number | Public | Minimum salary to prove |
| `minTenureMonths` | number | Public | Minimum tenure to prove |
| `requiredStatus` | number | Public | Required employment status |
| `allowedIndustries` | number[] | Public | Array of allowed industry codes |

## Country and Industry Codes

### Country Codes (ISO 3166-1 numeric)

| Code | Country |
|------|---------|
| 840 | United States |
| 124 | Canada |
| 826 | United Kingdom |
| 276 | Germany |
| 250 | France |
| 392 | Japan |
| 36 | Australia |
| 32 | Argentina |

### Industry Codes (NAICS)

| Code | Industry |
|------|----------|
| 54 | Technology (Professional, Scientific, Technical) |
| 52 | Finance and Insurance |
| 62 | Healthcare |
| 61 | Education |
| 51 | Information |
| 31 | Manufacturing |
| 44 | Retail Trade |

### Document Types

| Code | Type |
|------|------|
| 1 | Passport |
| 2 | National ID |
| 3 | Driver's License |
| 4 | Residence Permit |
| 5 | Work Visa |
| 6 | Other |

## Security Considerations

1. **Trusted Issuers**: Always verify credentials come from trusted issuers. The SDK maintains a list of trusted issuer DIDs.

2. **Credential Expiration**: The SDK automatically rejects expired credentials.

3. **Hash Functions**: Sensitive data is hashed using Poseidon (ZK-friendly). Never store unhashed private data.

4. **Issuer Signatures**: In production, verify the credential's cryptographic signature before processing.

5. **Circuit Auditing**: All circuits should be audited before production use.

## API Reference

See the [SDK README](../sdk/README.md) for complete API documentation.

## Examples

- [Age Verification Example](../examples/vc-integration/index.ts)
- [Employment Verification](../examples/vc-integration/index.ts#L139)

## Circuits

- [vc_age_credential.circom](../circuits/vc/vc_age_credential.circom)
- [vc_identity_credential.circom](../circuits/vc/vc_identity_credential.circom)
- [vc_employment_credential.circom](../circuits/vc/vc_employment_credential.circom)
