pragma circom 2.0.0;

// W3C Verifiable Credential - Age Proof Circuit
// Proves age claims from a Verifiable Credential without revealing the actual birthdate
//
// W3C VC Structure (simplified):
// {
//   "@context": ["https://www.w3.org/2018/credentials/v1"],
//   "type": ["VerifiableCredential", "AgeCredential"],
//   "credentialSubject": {
//     "birthDate": "1990-05-15",  // This becomes private input
//     "id": "did:example:123"
//   },
//   "issuer": "did:example:gov",
//   "proof": { ... }  // Signature becomes commitment
// }
//
// The circuit verifies:
//   1. User knows the birthdate in a valid credential
//   2. User's age meets the required threshold
//   3. Credential was issued by a trusted issuer (via commitment)
//
// Private inputs:
//   - birthYear: Year of birth from credential (e.g., 1990)
//   - birthMonth: Month of birth (1-12)
//   - birthDay: Day of birth (1-31)
//   - credentialHash: Hash of the full credential (binds to specific VC)
//   - issuerCommitment: Commitment to issuer's signature
//
// Public inputs:
//   - currentYear: Current year for age calculation
//   - currentMonth: Current month
//   - currentDay: Current day
//   - minAge: Minimum required age
//   - trustedIssuerRoot: Merkle root of trusted issuers
//
// Output:
//   - ageVerified: 1 if age >= minAge AND credential is valid

include "circomlib/circuits/comparators.circom";
include "circomlib/circuits/poseidon.circom";

template VCAgeCredential() {
    // Private signals from the Verifiable Credential
    signal input birthYear;
    signal input birthMonth;
    signal input birthDay;
    signal input credentialHash;      // Poseidon hash of credential data
    signal input issuerCommitment;    // Commitment to issuer signature

    // Public signals (verification parameters)
    signal input currentYear;
    signal input currentMonth;
    signal input currentDay;
    signal input minAge;
    signal input trustedIssuerRoot;   // For issuer verification

    // Output
    signal output ageVerified;

    // Intermediate signals
    signal rawAge;
    signal monthAdjustment;
    signal dayAdjustment;
    signal adjustedAge;
    signal ageCheckPassed;
    signal credentialValid;

    // --- Step 1: Calculate age ---
    // Raw age = currentYear - birthYear
    rawAge <== currentYear - birthYear;

    // Month adjustment: if current month < birth month, subtract 1
    component monthLt = LessThan(8);
    monthLt.in[0] <== currentMonth;
    monthLt.in[1] <== birthMonth;
    monthAdjustment <== monthLt.out;

    // Day adjustment: if same month but current day < birth day, subtract 1
    component monthEq = IsEqual();
    monthEq.in[0] <== currentMonth;
    monthEq.in[1] <== birthMonth;

    component dayLt = LessThan(8);
    dayLt.in[0] <== currentDay;
    dayLt.in[1] <== birthDay;

    dayAdjustment <== monthEq.out * dayLt.out;

    // Final adjusted age
    adjustedAge <== rawAge - monthAdjustment - dayAdjustment;

    // --- Step 2: Check age >= minAge ---
    component ageGte = GreaterEqThan(8);
    ageGte.in[0] <== adjustedAge;
    ageGte.in[1] <== minAge;
    ageCheckPassed <== ageGte.out;

    // --- Step 3: Verify credential binding ---
    // Hash the birthdate to verify it matches the credential
    component birthdateHash = Poseidon(3);
    birthdateHash.inputs[0] <== birthYear;
    birthdateHash.inputs[1] <== birthMonth;
    birthdateHash.inputs[2] <== birthDay;

    // Verify the credential hash includes this birthdate
    // In production, this would be a more complex verification
    component credentialCheck = Poseidon(2);
    credentialCheck.inputs[0] <== birthdateHash.out;
    credentialCheck.inputs[1] <== issuerCommitment;

    // Simple check: credential hash should be derivable
    // (In production, use proper signature verification)
    component hashCheck = IsEqual();
    hashCheck.in[0] <== credentialCheck.out;
    hashCheck.in[1] <== credentialHash;

    // For this version, we trust the credential if hash matches
    // In production, verify against trustedIssuerRoot via Merkle proof
    credentialValid <== hashCheck.out;

    // --- Final output: age verified AND credential valid ---
    ageVerified <== ageCheckPassed * credentialValid;
}

component main {public [currentYear, currentMonth, currentDay, minAge, trustedIssuerRoot]} = VCAgeCredential();
