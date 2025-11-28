/**
 * Verifiable Credential Processor
 * Converts W3C VCs to ZK circuit inputs and handles VC operations
 */

import type {
  VerifiableCredential,
  AgeCredentialSubject,
  IdentityCredentialSubject,
  EmploymentCredentialSubject,
  VCCircuitInputs,
  VCConversionConfig,
  TrustedIssuer
} from './types';
import {
  COUNTRY_CODES,
  DOCUMENT_TYPES,
  INDUSTRY_CODES,
  EMPLOYMENT_STATUS
} from './types';

/**
 * Default conversion configuration
 */
const DEFAULT_CONFIG: VCConversionConfig = {
  hashAlgorithm: 'poseidon',
  includeMetadata: false
};

/**
 * Simple hash function (placeholder - in production use circomlibjs)
 * This simulates Poseidon hash for circuit compatibility
 */
function simpleHash(...inputs: (string | number)[]): string {
  // In production, use actual Poseidon hash from circomlibjs
  // This is a placeholder that creates a deterministic hash
  const str = inputs.map(i => String(i)).join('|');
  let hash = 0n;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5n) - hash + BigInt(str.charCodeAt(i))) & ((1n << 253n) - 1n);
  }
  return hash.toString();
}

/**
 * VCProcessor class for handling Verifiable Credentials with ZK proofs
 */
export class VCProcessor {
  private config: VCConversionConfig;
  private trustedIssuers: Map<string, TrustedIssuer>;

  constructor(config?: Partial<VCConversionConfig>) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.trustedIssuers = new Map();
  }

  /**
   * Add a trusted issuer
   */
  addTrustedIssuer(issuer: TrustedIssuer): void {
    this.trustedIssuers.set(issuer.did, issuer);
  }

  /**
   * Check if an issuer is trusted
   */
  isTrustedIssuer(issuerDid: string): boolean {
    return this.trustedIssuers.has(issuerDid);
  }

  /**
   * Get issuer DID from credential
   */
  getIssuerDID(vc: VerifiableCredential): string {
    if (typeof vc.issuer === 'string') {
      return vc.issuer;
    }
    return vc.issuer.id;
  }

  /**
   * Parse date string (YYYY-MM-DD) to year, month, day
   * Uses direct string parsing to avoid timezone issues
   */
  private parseDateString(dateStr: string): { year: number; month: number; day: number } {
    // Handle ISO format dates (YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss)
    const datePart = dateStr.split('T')[0];
    const parts = datePart.split('-');

    return {
      year: parseInt(parts[0], 10),
      month: parseInt(parts[1], 10),
      day: parseInt(parts[2], 10)
    };
  }

  /**
   * Convert Age Credential to circuit inputs
   */
  convertAgeCredential(
    vc: VerifiableCredential,
    currentDate: Date = new Date()
  ): VCCircuitInputs {
    const subject = vc.credentialSubject as AgeCredentialSubject;

    if (!subject.birthDate) {
      throw new Error('Age credential must have birthDate');
    }

    const issuerDid = this.getIssuerDID(vc);

    // Parse birth date using string parsing to avoid timezone issues
    const { year: birthYear, month: birthMonth, day: birthDay } = this.parseDateString(subject.birthDate);

    // Create credential hash
    const credentialHash = simpleHash(
      birthYear,
      birthMonth,
      birthDay,
      issuerDid
    );

    // Create issuer commitment (simulated signature)
    const issuerCommitment = simpleHash(issuerDid, vc.issuanceDate);

    return {
      // Private inputs
      birthYear,
      birthMonth,
      birthDay,
      credentialHash,
      issuerCommitment,

      // These would be public inputs set by the verifier
      currentYear: currentDate.getFullYear(),
      currentMonth: currentDate.getMonth() + 1,
      currentDay: currentDate.getDate()
    };
  }

  /**
   * Convert Identity Credential to circuit inputs
   */
  convertIdentityCredential(vc: VerifiableCredential): VCCircuitInputs {
    const subject = vc.credentialSubject as IdentityCredentialSubject;
    const issuerDid = this.getIssuerDID(vc);

    // Hash name for privacy
    const nameHash = simpleHash(
      subject.givenName || '',
      subject.familyName || ''
    );

    // Convert nationality to numeric code
    const nationality = COUNTRY_CODES[subject.nationality] || 0;

    // Convert document type to code
    const documentType = DOCUMENT_TYPES[subject.documentType] || 6;

    // Hash document number
    const documentHash = simpleHash(subject.documentNumber || '');

    // Create issuer signature commitment
    const issuerSignature = simpleHash(issuerDid, vc.issuanceDate, nameHash);

    // Hash subject DID
    const subjectDID = simpleHash(subject.id || '');

    return {
      nameHash,
      nationality,
      documentType,
      documentHash,
      issuerSignature,
      subjectDID,
      credentialHash: simpleHash(nameHash, nationality, documentType, documentHash),
      issuerCommitment: issuerSignature
    };
  }

  /**
   * Convert Employment Credential to circuit inputs
   */
  convertEmploymentCredential(
    vc: VerifiableCredential,
    currentDate: Date = new Date()
  ): VCCircuitInputs {
    const subject = vc.credentialSubject as EmploymentCredentialSubject;
    const issuerDid = this.getIssuerDID(vc);

    // Hash employer info
    const employerHash = simpleHash(
      subject.employerName || '',
      subject.employerDID || ''
    );

    // Hash job title
    const jobTitleHash = simpleHash(subject.jobTitle || '');

    // Parse start date using string parsing to avoid timezone issues
    const { year: startYear, month: startMonth } = this.parseDateString(subject.startDate);

    // Get salary (default 0 if not provided)
    const annualSalary = subject.annualSalary || 0;

    // Get employment status code
    const employmentStatus = EMPLOYMENT_STATUS[subject.employmentStatus] || 1;

    // Get industry code
    const industryCode = subject.industryCode
      ? (INDUSTRY_CODES[subject.industryCode] || parseInt(subject.industryCode) || 0)
      : 0;

    // Create credential signature
    const credentialSignature = simpleHash(
      employerHash,
      startYear,
      startMonth,
      annualSalary,
      issuerDid
    );

    return {
      employerHash,
      jobTitleHash,
      startYear,
      startMonth,
      annualSalary,
      employmentStatus,
      industryCode,
      credentialSignature,
      currentYear: currentDate.getFullYear(),
      currentMonth: currentDate.getMonth() + 1,
      credentialHash: simpleHash(employerHash, jobTitleHash, annualSalary),
      issuerCommitment: credentialSignature
    };
  }

  /**
   * Auto-detect credential type and convert to circuit inputs
   */
  convertCredential(
    vc: VerifiableCredential,
    currentDate: Date = new Date()
  ): VCCircuitInputs {
    const types = vc.type;

    if (types.includes('AgeCredential')) {
      return this.convertAgeCredential(vc, currentDate);
    }

    if (types.includes('IdentityCredential')) {
      return this.convertIdentityCredential(vc);
    }

    if (types.includes('EmploymentCredential')) {
      return this.convertEmploymentCredential(vc, currentDate);
    }

    throw new Error(`Unsupported credential type: ${types.join(', ')}`);
  }

  /**
   * Validate credential structure
   */
  validateCredential(vc: VerifiableCredential): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Check required fields
    if (!vc['@context'] || vc['@context'].length === 0) {
      errors.push('Missing @context');
    }

    if (!vc.type || vc.type.length === 0) {
      errors.push('Missing type');
    }

    if (!vc.type.includes('VerifiableCredential')) {
      errors.push('Must include "VerifiableCredential" type');
    }

    if (!vc.issuer) {
      errors.push('Missing issuer');
    }

    if (!vc.issuanceDate) {
      errors.push('Missing issuanceDate');
    }

    if (!vc.credentialSubject) {
      errors.push('Missing credentialSubject');
    }

    // Check expiration
    if (vc.expirationDate) {
      const expDate = new Date(vc.expirationDate);
      if (expDate < new Date()) {
        errors.push('Credential has expired');
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Calculate age from birthdate
   */
  calculateAge(birthDate: string, currentDate: Date = new Date()): number {
    const birth = new Date(birthDate);
    let age = currentDate.getFullYear() - birth.getFullYear();
    const monthDiff = currentDate.getMonth() - birth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && currentDate.getDate() < birth.getDate())) {
      age--;
    }

    return age;
  }

  /**
   * Create a selective disclosure request
   * Specifies which claims to prove without revealing
   */
  createSelectiveDisclosureRequest(
    requiredClaims: string[],
    predicates?: { [claim: string]: { operator: 'gt' | 'lt' | 'eq' | 'gte' | 'lte'; value: any } }
  ): {
    requiredClaims: string[];
    predicates: typeof predicates;
    timestamp: string;
  } {
    return {
      requiredClaims,
      predicates,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Generate circuit public inputs for age verification
   */
  generateAgeVerificationPublicInputs(
    minAge: number,
    trustedIssuers: string[] = []
  ): {
    currentYear: number;
    currentMonth: number;
    currentDay: number;
    minAge: number;
    trustedIssuerRoot: string;
  } {
    const now = new Date();

    // Create Merkle root of trusted issuers (simplified)
    const trustedIssuerRoot = trustedIssuers.length > 0
      ? simpleHash(...trustedIssuers)
      : '0';

    return {
      currentYear: now.getFullYear(),
      currentMonth: now.getMonth() + 1,
      currentDay: now.getDate(),
      minAge,
      trustedIssuerRoot
    };
  }

  /**
   * Generate circuit public inputs for identity verification
   */
  generateIdentityVerificationPublicInputs(
    allowedNationalities: string[],
    allowedDocTypes: string[],
    issuerDID: string
  ): {
    allowedNationalities: number[];
    allowedDocTypes: number;
    credentialSchemaHash: string;
    issuerDID: string;
  } {
    // Convert nationality codes
    const natCodes = allowedNationalities.map(n => COUNTRY_CODES[n] || 0);
    // Pad to 20 entries
    while (natCodes.length < 20) natCodes.push(0);

    // Create bitmask for document types
    let docTypeBitmask = 0;
    for (const dt of allowedDocTypes) {
      const code = DOCUMENT_TYPES[dt];
      if (code) {
        docTypeBitmask |= (1 << (code - 1));
      }
    }

    return {
      allowedNationalities: natCodes.slice(0, 20),
      allowedDocTypes: docTypeBitmask,
      credentialSchemaHash: simpleHash('IdentityCredential', 'v1'),
      issuerDID: simpleHash(issuerDID)
    };
  }

  /**
   * Generate circuit public inputs for employment verification
   */
  generateEmploymentVerificationPublicInputs(
    minSalary: number,
    minTenureMonths: number,
    requiredStatus: 'active' | 'terminated' | 'leave' = 'active',
    allowedIndustries: string[] = []
  ): {
    currentYear: number;
    currentMonth: number;
    minSalary: number;
    minTenureMonths: number;
    requiredStatus: number;
    allowedIndustries: number[];
  } {
    const now = new Date();

    // Convert industry codes
    const industryCodes = allowedIndustries.map(i => INDUSTRY_CODES[i] || 0);
    // Pad to 10 entries
    while (industryCodes.length < 10) industryCodes.push(0);

    return {
      currentYear: now.getFullYear(),
      currentMonth: now.getMonth() + 1,
      minSalary,
      minTenureMonths,
      requiredStatus: EMPLOYMENT_STATUS[requiredStatus],
      allowedIndustries: industryCodes.slice(0, 10)
    };
  }
}

export default VCProcessor;
