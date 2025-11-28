pragma circom 2.0.0;

// Accredited Investor Circuit
// Verifies accredited investor status based on SEC/regulatory requirements
// without revealing actual financial details
//
// SEC Accredited Investor Requirements (simplified):
//   - Net worth > $1,000,000 (excluding primary residence), OR
//   - Annual income > $200,000 (or $300,000 with spouse) for last 2 years
//
// Use cases:
//   - Security token offerings (STOs)
//   - Private equity investments
//   - Hedge fund access
//   - Regulation D compliance
//
// Private inputs:
//   - netWorth: User's net worth in cents (hidden)
//   - annualIncome: User's annual income in cents (hidden)
//
// Public inputs:
//   - minNetWorth: Minimum net worth threshold (e.g., $1M = 100000000 cents)
//   - minIncome: Minimum income threshold (e.g., $200K = 20000000 cents)
//
// Output:
//   - isAccredited: 1 if EITHER condition is met, 0 otherwise

include "circomlib/circuits/comparators.circom";

template AccreditedInvestor() {
    // Private signals (not revealed)
    signal input netWorth;      // in cents
    signal input annualIncome;  // in cents

    // Public signals (thresholds visible on-chain)
    signal input minNetWorth;   // e.g., 100000000 (= $1,000,000)
    signal input minIncome;     // e.g., 20000000 (= $200,000)

    // Output signal (public)
    signal output isAccredited;

    // Intermediate signals
    signal netWorthQualifies;
    signal incomeQualifies;

    // Components for comparisons
    // Using 64 bits for amounts (supports up to ~$184 quadrillion in cents)
    component gteNetWorth = GreaterEqThan(64);
    component gteIncome = GreaterEqThan(64);

    // Check 1: netWorth >= minNetWorth
    gteNetWorth.in[0] <== netWorth;
    gteNetWorth.in[1] <== minNetWorth;
    netWorthQualifies <== gteNetWorth.out;

    // Check 2: annualIncome >= minIncome
    gteIncome.in[0] <== annualIncome;
    gteIncome.in[1] <== minIncome;
    incomeQualifies <== gteIncome.out;

    // OR gate: at least one condition must be met
    // OR(a, b) = a + b - a*b
    isAccredited <== netWorthQualifies + incomeQualifies - (netWorthQualifies * incomeQualifies);
}

component main {public [minNetWorth, minIncome]} = AccreditedInvestor();
