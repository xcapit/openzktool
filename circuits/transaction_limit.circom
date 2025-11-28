pragma circom 2.0.0;

// Transaction Limit Circuit
// Proves a transaction amount is within allowed limits without revealing the exact amount
//
// Use cases:
//   - AML compliance: Prove transaction below reporting threshold ($10K)
//   - Daily limits: Prove within daily transaction limit
//   - Tiered services: Prove eligibility for tier-based limits
//   - Regulatory: Prove compliance with transaction caps
//
// Private inputs:
//   - amount: Transaction amount (hidden)
//   - dailyTotal: User's total transactions today (hidden)
//
// Public inputs:
//   - minAmount: Minimum transaction amount (e.g., 1 cent)
//   - maxAmount: Maximum single transaction (e.g., $10,000)
//   - dailyLimit: Maximum daily total (e.g., $50,000)
//
// Output:
//   - transactionValid: 1 if amount within limits AND dailyTotal + amount <= dailyLimit

include "circomlib/circuits/comparators.circom";

template TransactionLimit() {
    // Private signals (not revealed)
    signal input amount;
    signal input dailyTotal;

    // Public signals (limits visible on-chain)
    signal input minAmount;
    signal input maxAmount;
    signal input dailyLimit;

    // Output signal (public)
    signal output transactionValid;

    // Intermediate signals
    signal amountValid;
    signal withinDailyLimit;
    signal newDailyTotal;

    // Components for comparisons (64 bits for amounts in cents)
    component gteMin = GreaterEqThan(64);
    component lteMax = LessEqThan(64);
    component lteDaily = LessEqThan(64);

    // Check 1: amount >= minAmount
    gteMin.in[0] <== amount;
    gteMin.in[1] <== minAmount;

    // Check 2: amount <= maxAmount
    lteMax.in[0] <== amount;
    lteMax.in[1] <== maxAmount;

    // Amount is valid if both checks pass
    amountValid <== gteMin.out * lteMax.out;

    // Check 3: dailyTotal + amount <= dailyLimit
    newDailyTotal <== dailyTotal + amount;
    lteDaily.in[0] <== newDailyTotal;
    lteDaily.in[1] <== dailyLimit;
    withinDailyLimit <== lteDaily.out;

    // Final: amount valid AND within daily limit
    transactionValid <== amountValid * withinDailyLimit;
}

component main {public [minAmount, maxAmount, dailyLimit]} = TransactionLimit();
