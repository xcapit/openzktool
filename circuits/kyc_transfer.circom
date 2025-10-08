pragma circom 2.1.9;
include "range_proof.circom";
include "solvency_check.circom";
include "compliance_verify.circom";

/**
 * KYCTransfer
 * Combines three proofs:
 *  - RangeProof: ensures user age is within valid range
 *  - SolvencyCheck: ensures wallet balance >= minimum required
 *  - ComplianceVerify: ensures country is allowed
 */
template KYCTransfer() {
    // Inputs for each subcircuit
    signal input age;
    signal input minAge;
    signal input maxAge;
    signal input balance;
    signal input minBalance;
    signal input countryId;

    // Components
    component ageProof = RangeProof();
    ageProof.value <== age;
    ageProof.lowerBound <== minAge;
    ageProof.upperBound <== maxAge;

    component solvency = SolvencyCheck(64);
    solvency.balance <== balance;
    solvency.minBalance <== minBalance;

    component compliance = ComplianceVerify(32);
    compliance.countryId <== countryId;

    // Output: valid if all 3 are valid
    
   // Output: valid if all 3 are valid
    signal tmp;
    tmp <== ageProof.valid * solvency.valid;
    signal output kycValid;
    kycValid <== tmp * compliance.isAllowed;

   
}

component main = KYCTransfer();
