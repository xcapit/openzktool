pragma circom 2.1.9;
include "comparators.circom";

/**
 * RangeProof
 * Ensures that: lowerBound <= value <= upperBound
 */
template RangeProof() {
    // Public inputs
    signal input value;
    signal input lowerBound;
    signal input upperBound;

    // Internal signals
    signal diffLower;  // value - lowerBound
    signal diffUpper;  // upperBound - value

    // Compute differences
    diffLower <== value - lowerBound;
    diffUpper <== upperBound - value;

    // Both diffs must be non-negative
    component isNegLower = LessThan(252);
    isNegLower.in[0] <== diffLower;
    isNegLower.in[1] <== 0;

    component isNegUpper = LessThan(252);
    isNegUpper.in[0] <== diffUpper;
    isNegUpper.in[1] <== 0;

    // Valid if both are NOT negative
    signal output valid;
    valid <== (1 - isNegLower.out) * (1 - isNegUpper.out);
}

