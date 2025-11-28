pragma circom 2.0.0;

// Credit Score Circuit
// Proves credit score is within acceptable range without revealing the exact score
//
// Use cases:
//   - Lending: Prove creditworthiness for loans
//   - Rental: Prove credit meets landlord requirements
//   - Insurance: Premium tier eligibility
//   - Employment: Background check requirements
//
// Credit score ranges (FICO):
//   - Exceptional: 800-850
//   - Very Good: 740-799
//   - Good: 670-739
//   - Fair: 580-669
//   - Poor: 300-579
//
// Private inputs:
//   - creditScore: User's actual credit score (hidden)
//
// Public inputs:
//   - minScore: Minimum required score
//   - maxScore: Maximum score (usually 850)
//
// Output:
//   - scoreValid: 1 if minScore <= creditScore <= maxScore, 0 otherwise

include "circomlib/circuits/comparators.circom";

template CreditScore() {
    // Private signal (not revealed)
    signal input creditScore;

    // Public signals (thresholds visible on-chain)
    signal input minScore;
    signal input maxScore;

    // Output signal (public)
    signal output scoreValid;

    // Components for comparisons
    // Using 10 bits for score (supports 0-1023, enough for 300-850)
    component gteMin = GreaterEqThan(10);
    component lteMax = LessEqThan(10);

    // Check: creditScore >= minScore
    gteMin.in[0] <== creditScore;
    gteMin.in[1] <== minScore;

    // Check: creditScore <= maxScore
    lteMax.in[0] <== creditScore;
    lteMax.in[1] <== maxScore;

    // AND gate: both conditions must pass
    scoreValid <== gteMin.out * lteMax.out;
}

component main {public [minScore, maxScore]} = CreditScore();
