pragma circom 2.1.9;
include "node_modules/circomlib/circuits/bitify.circom";

/**
 * SolvencyCheck
 * Verifies that balance >= minBalance using binary decomposition.
 */
template SolvencyCheck(bits) {
    signal input balance;
    signal input minBalance;

    signal diff;
    diff <== balance - minBalance;

    // Ensure diff is non-negative
    component bitsCheck = Num2Bits(bits);
    bitsCheck.in <== diff;

    signal output valid;
    valid <== 1;
}

