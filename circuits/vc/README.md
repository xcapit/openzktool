# W3C Verifiable Credentials Circuits

Zero-knowledge circuits for privacy-preserving verification of W3C Verifiable Credentials.

## Circuits

### vc_age_credential.circom

Proves age-related claims from an age credential without revealing the birthdate.

**Use Case:** Age verification (21+ for alcohol, 18+ for voting, etc.)

**Private Inputs:**
- `birthYear`, `birthMonth`, `birthDay` - Date of birth
- `credentialHash` - Hash of credential data
- `issuerCommitment` - Issuer signature commitment

**Public Inputs:**
- `currentYear`, `currentMonth`, `currentDay` - Current date
- `minAge` - Minimum age to prove
- `trustedIssuerRoot` - Merkle root of trusted issuers

**Output:**
- `isValid` - 1 if age >= minAge and issuer is trusted

### vc_identity_credential.circom

Proves identity attributes without revealing personal information.

**Use Case:** KYC compliance, nationality verification

**Private Inputs:**
- `nameHash` - Hash of full name
- `nationality` - ISO 3166-1 country code
- `documentType` - Type of ID document
- `documentHash` - Hash of document number
- `issuerSignature` - Issuer's signature

**Public Inputs:**
- `allowedNationalities[20]` - Array of valid country codes
- `allowedDocTypes` - Bitmask of valid document types
- `credentialSchemaHash` - Expected schema hash
- `issuerDID` - Expected issuer DID hash

**Output:**
- `isValid` - 1 if nationality and document type are valid

### vc_employment_credential.circom

Proves employment status without revealing salary or employer.

**Use Case:** Loan applications, rental verification

**Private Inputs:**
- `employerHash` - Hash of employer name
- `jobTitleHash` - Hash of job title
- `startYear`, `startMonth` - Employment start date
- `annualSalary` - Salary in cents
- `employmentStatus` - Status code (1=active, 2=terminated, 3=leave)
- `industryCode` - NAICS industry code

**Public Inputs:**
- `currentYear`, `currentMonth` - Current date
- `minSalary` - Minimum salary to prove
- `minTenureMonths` - Minimum tenure to prove
- `requiredStatus` - Required employment status
- `allowedIndustries[10]` - Array of valid industry codes

**Output:**
- `isValid` - 1 if all conditions are met

## Compiling Circuits

```bash
# Compile age credential circuit
circom vc_age_credential.circom --r1cs --wasm --sym -o build/

# Generate trusted setup (development only)
snarkjs groth16 setup build/vc_age_credential.r1cs pot12_final.ptau vc_age_credential_0000.zkey

# Export verification key
snarkjs zkey export verificationkey vc_age_credential_final.zkey verification_key.json
```

## Example Inputs

See the `inputs/` directory for example circuit inputs:

- `vc_age_input.json` - Age verification example
- `vc_identity_input.json` - Identity verification example  
- `vc_employment_input.json` - Employment verification example

## Integration with SDK

```typescript
import { VCProcessor } from '@openzktool/sdk';

const vcProcessor = new VCProcessor();
const inputs = vcProcessor.convertAgeCredential(credential);
// Use inputs with snarkjs to generate proof
```

## Security Notes

1. All private inputs are hashed using Poseidon before comparison
2. Issuer signatures should be verified off-chain before proof generation
3. These circuits are for demonstration - audit before production use
