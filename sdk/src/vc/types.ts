/**
 * W3C Verifiable Credentials Types for OpenZKTool
 * Based on W3C VC Data Model 1.1: https://www.w3.org/TR/vc-data-model/
 */

/**
 * Standard W3C VC contexts
 */
export const VC_CONTEXTS = {
  CREDENTIALS_V1: 'https://www.w3.org/2018/credentials/v1',
  CREDENTIALS_V2: 'https://www.w3.org/ns/credentials/v2',
  OPENZKTOOL: 'https://openzktool.dev/contexts/v1'
} as const;

/**
 * Supported credential types for ZK proofs
 */
export type VCType =
  | 'VerifiableCredential'
  | 'AgeCredential'
  | 'IdentityCredential'
  | 'EmploymentCredential'
  | 'EducationCredential'
  | 'FinancialCredential'
  | 'MembershipCredential';

/**
 * Base Verifiable Credential structure
 */
export interface VerifiableCredential {
  '@context': string[];
  id?: string;
  type: VCType[];
  issuer: string | { id: string; name?: string };
  issuanceDate: string;
  expirationDate?: string;
  credentialSubject: CredentialSubject;
  proof?: VCProof;
}

/**
 * Base credential subject
 */
export interface CredentialSubject {
  id?: string;
  [key: string]: any;
}

/**
 * VC Proof structure
 */
export interface VCProof {
  type: string;
  created: string;
  verificationMethod: string;
  proofPurpose: string;
  proofValue?: string;
  jws?: string;
}

/**
 * Age Credential Subject
 */
export interface AgeCredentialSubject extends CredentialSubject {
  birthDate: string;  // ISO 8601 date
}

/**
 * Identity Credential Subject
 */
export interface IdentityCredentialSubject extends CredentialSubject {
  givenName?: string;
  familyName?: string;
  nationality: string;  // ISO 3166-1 alpha-2
  documentType: 'passport' | 'nationalID' | 'driverLicense' | 'other';
  documentNumber?: string;
}

/**
 * Employment Credential Subject
 */
export interface EmploymentCredentialSubject extends CredentialSubject {
  employerName?: string;
  employerDID?: string;
  jobTitle?: string;
  startDate: string;
  endDate?: string;
  annualSalary?: number;
  currency?: string;
  employmentStatus: 'active' | 'terminated' | 'leave';
  industryCode?: string;
}

/**
 * Education Credential Subject
 */
export interface EducationCredentialSubject extends CredentialSubject {
  institutionName?: string;
  institutionDID?: string;
  degree?: string;
  fieldOfStudy?: string;
  graduationDate?: string;
  gpa?: number;
}

/**
 * Financial Credential Subject
 */
export interface FinancialCredentialSubject extends CredentialSubject {
  accountType?: string;
  balance?: number;
  currency?: string;
  creditScore?: number;
  netWorth?: number;
  annualIncome?: number;
}

/**
 * Membership Credential Subject
 */
export interface MembershipCredentialSubject extends CredentialSubject {
  organizationName?: string;
  organizationDID?: string;
  membershipType?: string;
  memberSince?: string;
  membershipStatus: 'active' | 'expired' | 'suspended';
  tier?: string;
}

/**
 * ZK Circuit inputs derived from a VC
 */
export interface VCCircuitInputs {
  // Common fields
  credentialHash: string;
  issuerCommitment: string;
  subjectDID?: string;

  // Specific to credential type
  [key: string]: string | number | number[] | undefined;
}

/**
 * Configuration for VC to circuit input conversion
 */
export interface VCConversionConfig {
  hashAlgorithm: 'poseidon' | 'sha256' | 'keccak256';
  fieldModulus?: string;
  includeMetadata?: boolean;
}

/**
 * Result of VC verification with ZK proof
 */
export interface VCZKVerificationResult {
  credentialValid: boolean;
  claimsVerified: boolean;
  proof: {
    pi_a: string[];
    pi_b: string[][];
    pi_c: string[];
  };
  publicSignals: string[];
  verificationTime?: number;
}

/**
 * Supported issuers for VC verification
 */
export interface TrustedIssuer {
  did: string;
  name?: string;
  publicKey?: string;
  credentialTypes: VCType[];
  trustLevel: 'high' | 'medium' | 'low';
}

/**
 * Country codes mapping (ISO 3166-1 numeric)
 */
export const COUNTRY_CODES: { [key: string]: number } = {
  'US': 840,
  'CA': 124,
  'GB': 826,
  'DE': 276,
  'FR': 250,
  'IT': 380,
  'JP': 392,
  'AU': 36,
  'NZ': 554,
  'CH': 756,
  'NL': 528,
  'BE': 56,
  'AT': 40,
  'PT': 620,
  'ES': 724,
  'NO': 578,
  'SE': 752,
  'DK': 208,
  'IE': 372,
  'LU': 442,
  'AR': 32,
  'BR': 76,
  'MX': 484,
  'SG': 702,
  'HK': 344,
  'KR': 410
};

/**
 * Document type codes
 */
export const DOCUMENT_TYPES: { [key: string]: number } = {
  'passport': 1,
  'nationalID': 2,
  'driverLicense': 3,
  'residencePermit': 4,
  'workPermit': 5,
  'other': 6
};

/**
 * Industry codes (simplified NAICS)
 */
export const INDUSTRY_CODES: { [key: string]: number } = {
  'agriculture': 11,
  'mining': 21,
  'utilities': 22,
  'construction': 23,
  'manufacturing': 31,
  'wholesale': 42,
  'retail': 44,
  'transportation': 48,
  'information': 51,
  'finance': 52,
  'realEstate': 53,
  'professional': 54,
  'management': 55,
  'administrative': 56,
  'education': 61,
  'healthcare': 62,
  'arts': 71,
  'accommodation': 72,
  'other': 81,
  'publicAdmin': 92,
  'technology': 54  // Often grouped with professional
};

/**
 * Employment status codes
 */
export const EMPLOYMENT_STATUS: { [key: string]: number } = {
  'active': 1,
  'terminated': 2,
  'leave': 3,
  'retired': 4,
  'contractor': 5
};
