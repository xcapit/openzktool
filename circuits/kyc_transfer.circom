pragma circom 2.0.0;

// KYC Transfer Circuit
// Verifies age, balance, and country requirements without revealing exact values
//
// Private inputs:
//   - age: User's actual age
//   - balance: User's actual balance
//   - country: User's country ID
//
// Public inputs:
//   - minAge: Minimum required age
//   - maxAge: Maximum allowed age
//   - minBalance: Minimum required balance
//   - allowedCountries: Array of allowed country IDs (fixed size: 10)
//
// Output:
//   - kycValid: 1 if all checks pass, 0 otherwise

include "circomlib/circuits/comparators.circom";

template KYCTransfer() {
    // Private signals (not revealed)
    signal input age;
    signal input balance;
    signal input country;

    // Public signals (constraints visible on-chain)
    signal input minAge;
    signal input maxAge;
    signal input minBalance;
    signal input allowedCountries[10];  // Max 10 countries, unused slots = 0

    // Output signal (public)
    signal output kycValid;

    // Intermediate signals
    signal ageInRange;
    signal balanceSufficient;
    signal countryAllowed;

    // Component for comparisons
    component ageGte = GreaterEqThan(32);
    component ageLte = LessEqThan(32);
    component balanceGte = GreaterEqThan(64);

    // Check 1: Age range (minAge <= age <= maxAge)
    ageGte.in[0] <== age;
    ageGte.in[1] <== minAge;

    ageLte.in[0] <== age;
    ageLte.in[1] <== maxAge;

    ageInRange <== ageGte.out * ageLte.out;

    // Check 2: Balance sufficient (balance >= minBalance)
    balanceGte.in[0] <== balance;
    balanceGte.in[1] <== minBalance;

    balanceSufficient <== balanceGte.out;

    // Check 3: Country is in allowed list
    // This uses a manual OR gate across all allowed countries
    signal countryMatches[10];
    component countryEq[10];

    for (var i = 0; i < 10; i++) {
        countryEq[i] = IsEqual();
        countryEq[i].in[0] <== country;
        countryEq[i].in[1] <== allowedCountries[i];
        countryMatches[i] <== countryEq[i].out;
    }

    // OR gate: at least one country match
    signal countryOr[10];
    countryOr[0] <== countryMatches[0];
    for (var i = 1; i < 10; i++) {
        countryOr[i] <== countryOr[i-1] + countryMatches[i] - (countryOr[i-1] * countryMatches[i]);
    }
    countryAllowed <== countryOr[9];

    // Final AND gate: all checks must pass
    signal partial <== ageInRange * balanceSufficient;
    kycValid <== partial * countryAllowed;
}

component main {public [minAge, maxAge, minBalance, allowedCountries]} = KYCTransfer();
