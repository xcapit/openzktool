pragma circom 2.1.9;
include "node_modules/circomlib/circuits/comparators.circom";

/**
 * ComplianceVerify
 * Ensures that the user’s country ID equals ALLOWED_COUNTRY_ID
 */
template ComplianceVerify(ALLOWED_COUNTRY_ID) {
    signal input countryId; // numeric country code (e.g., 32 = Argentina)
    
    component eqCheck = IsEqual();
    eqCheck.in[0] <== countryId;
    eqCheck.in[1] <== ALLOWED_COUNTRY_ID;

    signal output isAllowed;
    isAllowed <== eqCheck.out;
}

