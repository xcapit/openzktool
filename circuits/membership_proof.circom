pragma circom 2.0.0;

// Membership Proof Circuit
// Proves that a user's ID is part of an allowed membership set
// without revealing which specific ID they have
//
// Use cases:
//   - DAO voting: Prove membership without revealing identity
//   - Access control: Prove you're in an allowed group
//   - Whitelists: Prove inclusion in a whitelist
//   - NFT gating: Prove ownership of allowed token IDs
//
// This uses a simple equality check against a list
// For larger sets, consider using Merkle tree proofs
//
// Private inputs:
//   - userId: User's identifier (hidden)
//
// Public inputs:
//   - allowedMembers: Array of 50 allowed member IDs (0 = unused)
//
// Output:
//   - isMember: 1 if userId is in allowedMembers, 0 otherwise

include "circomlib/circuits/comparators.circom";

template MembershipProof() {
    // Private signal (not revealed)
    signal input userId;

    // Public signals (membership list visible on-chain)
    signal input allowedMembers[50];

    // Output signal (public)
    signal output isMember;

    // Check if userId matches any member in the list
    signal memberMatches[50];
    component memberEq[50];

    for (var i = 0; i < 50; i++) {
        memberEq[i] = IsEqual();
        memberEq[i].in[0] <== userId;
        memberEq[i].in[1] <== allowedMembers[i];
        memberMatches[i] <== memberEq[i].out;
    }

    // OR gate across all members
    signal memberOr[50];
    memberOr[0] <== memberMatches[0];
    for (var i = 1; i < 50; i++) {
        memberOr[i] <== memberOr[i-1] + memberMatches[i] - (memberOr[i-1] * memberMatches[i]);
    }

    isMember <== memberOr[49];
}

component main {public [allowedMembers]} = MembershipProof();
