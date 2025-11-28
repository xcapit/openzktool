pragma circom 2.0.0;

// Geographic Compliance Circuit
// Verifies user's location is within allowed regions without revealing exact location
//
// Use cases:
//   - Securities compliance: Only allow investors from certain jurisdictions
//   - Sanctions compliance: Block users from sanctioned regions
//   - Gaming/Gambling: Regional licensing requirements
//   - Data residency: GDPR and regional data laws
//
// This circuit uses country codes (ISO 3166-1 numeric)
// Extended version supports region/state codes for more granular control
//
// Private inputs:
//   - countryCode: User's country (ISO numeric code, hidden)
//   - regionCode: User's region/state code (hidden, 0 if not applicable)
//
// Public inputs:
//   - allowedCountries: Array of 20 allowed country codes (0 = unused slot)
//   - blockedCountries: Array of 10 blocked country codes (for sanctions)
//
// Output:
//   - locationValid: 1 if country is allowed AND not blocked, 0 otherwise

include "circomlib/circuits/comparators.circom";

template GeographicCompliance() {
    // Private signals (not revealed)
    signal input countryCode;
    signal input regionCode;  // Optional: for state/province level compliance

    // Public signals
    signal input allowedCountries[20];   // Whitelist (0 = unused slot)
    signal input blockedCountries[10];   // Blacklist/Sanctions (0 = unused slot)

    // Output signal (public)
    signal output locationValid;

    // Intermediate signals
    signal isInAllowedList;
    signal isNotBlocked;

    // --- Check 1: Country is in allowed list ---
    signal countryAllowedMatches[20];
    component countryAllowedEq[20];

    for (var i = 0; i < 20; i++) {
        countryAllowedEq[i] = IsEqual();
        countryAllowedEq[i].in[0] <== countryCode;
        countryAllowedEq[i].in[1] <== allowedCountries[i];
        countryAllowedMatches[i] <== countryAllowedEq[i].out;
    }

    // OR gate for allowed list
    signal allowedOr[20];
    allowedOr[0] <== countryAllowedMatches[0];
    for (var i = 1; i < 20; i++) {
        allowedOr[i] <== allowedOr[i-1] + countryAllowedMatches[i] - (allowedOr[i-1] * countryAllowedMatches[i]);
    }
    isInAllowedList <== allowedOr[19];

    // --- Check 2: Country is NOT in blocked list ---
    signal countryBlockedMatches[10];
    component countryBlockedEq[10];

    for (var i = 0; i < 10; i++) {
        countryBlockedEq[i] = IsEqual();
        countryBlockedEq[i].in[0] <== countryCode;
        countryBlockedEq[i].in[1] <== blockedCountries[i];
        countryBlockedMatches[i] <== countryBlockedEq[i].out;
    }

    // OR gate for blocked list
    signal blockedOr[10];
    blockedOr[0] <== countryBlockedMatches[0];
    for (var i = 1; i < 10; i++) {
        blockedOr[i] <== blockedOr[i-1] + countryBlockedMatches[i] - (blockedOr[i-1] * countryBlockedMatches[i]);
    }

    // NOT blocked = 1 - isBlocked
    isNotBlocked <== 1 - blockedOr[9];

    // --- Final: Must be in allowed list AND not blocked ---
    locationValid <== isInAllowedList * isNotBlocked;
}

component main {public [allowedCountries, blockedCountries]} = GeographicCompliance();
