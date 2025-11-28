pragma circom 2.0.0;

// Age Gate Circuit
// Simple age verification - proves user meets minimum age requirement
//
// Use cases:
//   - Access control: 18+ or 21+ content/services
//   - Gaming: Age-restricted games
//   - Alcohol/Tobacco: Regulatory compliance
//   - Financial services: Minimum age requirements
//
// This is a lightweight circuit (~50 constraints) optimized for
// simple age verification without revealing the actual age.
//
// Private inputs:
//   - age: User's actual age (hidden)
//
// Public inputs:
//   - minAge: Minimum required age (e.g., 18, 21)
//
// Output:
//   - ageValid: 1 if age >= minAge, 0 otherwise

include "circomlib/circuits/comparators.circom";

template AgeGate() {
    // Private signal (not revealed)
    signal input age;

    // Public signal (constraint visible on-chain)
    signal input minAge;

    // Output signal (public)
    signal output ageValid;

    // Component for comparison
    // Using 8 bits for age (supports ages 0-255)
    component gte = GreaterEqThan(8);

    // Check: age >= minAge
    gte.in[0] <== age;
    gte.in[1] <== minAge;

    // Output the result
    ageValid <== gte.out;
}

component main {public [minAge]} = AgeGate();
