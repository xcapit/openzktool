pragma circom 2.0.0;

// Balance Proof Circuit
// Proves that a user's balance is within an acceptable range without revealing the exact amount
//
// Use cases:
//   - DeFi: Prove sufficient collateral for loans
//   - Trading: Prove minimum balance for tier access
//   - Compliance: Prove balance meets regulatory minimums
//
// Private inputs:
//   - balance: User's actual balance (hidden)
//
// Public inputs:
//   - minBalance: Minimum acceptable balance
//   - maxBalance: Maximum acceptable balance (for range proofs)
//
// Output:
//   - balanceValid: 1 if minBalance <= balance <= maxBalance, 0 otherwise

include "circomlib/circuits/comparators.circom";

template BalanceProof() {
    // Private signal (not revealed)
    signal input balance;

    // Public signals (constraints visible on-chain)
    signal input minBalance;
    signal input maxBalance;

    // Output signal (public)
    signal output balanceValid;

    // Components for comparisons
    // Using 64 bits for balance (supports up to ~18 quintillion)
    component gteMin = GreaterEqThan(64);
    component lteMax = LessEqThan(64);

    // Check: balance >= minBalance
    gteMin.in[0] <== balance;
    gteMin.in[1] <== minBalance;

    // Check: balance <= maxBalance
    lteMax.in[0] <== balance;
    lteMax.in[1] <== maxBalance;

    // Final AND: both conditions must pass
    balanceValid <== gteMin.out * lteMax.out;
}

component main {public [minBalance, maxBalance]} = BalanceProof();
