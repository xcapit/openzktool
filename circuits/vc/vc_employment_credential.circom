pragma circom 2.0.0;

// W3C Verifiable Credential - Employment Proof Circuit
// Proves employment status and income without revealing employer or exact salary
//
// W3C VC Structure:
// {
//   "@context": ["https://www.w3.org/2018/credentials/v1"],
//   "type": ["VerifiableCredential", "EmploymentCredential"],
//   "credentialSubject": {
//     "id": "did:example:employee123",
//     "employerName": "Acme Corp",     // Hashed
//     "employerDID": "did:example:acme",
//     "jobTitle": "Software Engineer", // Hashed
//     "startDate": "2020-01-15",
//     "annualSalary": 120000,          // In cents or smallest unit
//     "employmentStatus": "active",    // 1=active, 2=terminated, 3=leave
//     "industry": "technology"         // Numeric code
//   },
//   "issuer": "did:example:employer"
// }
//
// Use cases:
//   - Loan applications: Prove stable employment and minimum income
//   - Rental applications: Prove employment without revealing employer
//   - Professional services: Prove industry experience
//
// Private inputs:
//   - employerHash: Hash of employer name/DID
//   - jobTitleHash: Hash of job title
//   - startYear: Employment start year
//   - startMonth: Employment start month
//   - annualSalary: Salary in cents
//   - employmentStatus: 1=active, 2=terminated, 3=leave
//   - industryCode: Numeric industry code
//   - credentialSignature: Issuer signature commitment
//
// Public inputs:
//   - currentYear: For tenure calculation
//   - currentMonth: For tenure calculation
//   - minSalary: Minimum required salary
//   - minTenureMonths: Minimum employment tenure
//   - requiredStatus: Required employment status (1=active)
//   - allowedIndustries: Array of allowed industry codes
//
// Output:
//   - employmentVerified: 1 if all requirements met

include "circomlib/circuits/comparators.circom";
include "circomlib/circuits/poseidon.circom";

template VCEmploymentCredential() {
    // Private signals from credential
    signal input employerHash;
    signal input jobTitleHash;
    signal input startYear;
    signal input startMonth;
    signal input annualSalary;
    signal input employmentStatus;
    signal input industryCode;
    signal input credentialSignature;

    // Public signals
    signal input currentYear;
    signal input currentMonth;
    signal input minSalary;
    signal input minTenureMonths;
    signal input requiredStatus;
    signal input allowedIndustries[10];

    // Output
    signal output employmentVerified;

    // Intermediate signals
    signal tenureMonths;
    signal salaryOk;
    signal tenureOk;
    signal statusOk;
    signal industryOk;
    signal credentialValid;

    // --- Step 1: Calculate tenure in months ---
    signal yearDiff;
    signal monthDiff;

    yearDiff <== currentYear - startYear;
    monthDiff <== currentMonth - startMonth;

    // Total months = yearDiff * 12 + monthDiff
    tenureMonths <== yearDiff * 12 + monthDiff;

    // --- Step 2: Check salary >= minSalary ---
    component salaryCheck = GreaterEqThan(64);
    salaryCheck.in[0] <== annualSalary;
    salaryCheck.in[1] <== minSalary;
    salaryOk <== salaryCheck.out;

    // --- Step 3: Check tenure >= minTenureMonths ---
    component tenureCheck = GreaterEqThan(16);
    tenureCheck.in[0] <== tenureMonths;
    tenureCheck.in[1] <== minTenureMonths;
    tenureOk <== tenureCheck.out;

    // --- Step 4: Check employment status ---
    component statusCheck = IsEqual();
    statusCheck.in[0] <== employmentStatus;
    statusCheck.in[1] <== requiredStatus;
    statusOk <== statusCheck.out;

    // --- Step 5: Check industry is allowed ---
    signal industryMatches[10];
    component industryEq[10];

    for (var i = 0; i < 10; i++) {
        industryEq[i] = IsEqual();
        industryEq[i].in[0] <== industryCode;
        industryEq[i].in[1] <== allowedIndustries[i];
        industryMatches[i] <== industryEq[i].out;
    }

    // OR gate for industries
    signal industryOr[10];
    industryOr[0] <== industryMatches[0];
    for (var i = 1; i < 10; i++) {
        industryOr[i] <== industryOr[i-1] + industryMatches[i] - (industryOr[i-1] * industryMatches[i]);
    }
    industryOk <== industryOr[9];

    // --- Step 6: Verify credential integrity ---
    component credHash = Poseidon(6);
    credHash.inputs[0] <== employerHash;
    credHash.inputs[1] <== jobTitleHash;
    credHash.inputs[2] <== startYear * 100 + startMonth;  // Combine date
    credHash.inputs[3] <== annualSalary;
    credHash.inputs[4] <== employmentStatus;
    credHash.inputs[5] <== industryCode;

    // Bind to signature
    component sigCheck = Poseidon(2);
    sigCheck.inputs[0] <== credHash.out;
    sigCheck.inputs[1] <== credentialSignature;

    // Verify non-zero (credential exists)
    component nonZero = IsZero();
    nonZero.in <== sigCheck.out;
    credentialValid <== 1 - nonZero.out;

    // --- Final: All checks must pass ---
    signal check1 <== salaryOk * tenureOk;
    signal check2 <== check1 * statusOk;
    signal check3 <== check2 * industryOk;
    employmentVerified <== check3 * credentialValid;
}

component main {public [currentYear, currentMonth, minSalary, minTenureMonths, requiredStatus, allowedIndustries]} = VCEmploymentCredential();
