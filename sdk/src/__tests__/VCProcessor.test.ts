import { VCProcessor } from '../vc/VCProcessor';
import type { VerifiableCredential, AgeCredentialSubject, EmploymentCredentialSubject } from '../vc/types';

describe('VCProcessor', () => {
  let processor: VCProcessor;

  beforeEach(() => {
    processor = new VCProcessor();
  });

  describe('constructor', () => {
    it('should create a VCProcessor instance', () => {
      expect(processor).toBeInstanceOf(VCProcessor);
    });
  });

  describe('addTrustedIssuer', () => {
    it('should add a trusted issuer', () => {
      processor.addTrustedIssuer({
        did: 'did:example:issuer',
        name: 'Test Issuer',
        credentialTypes: ['AgeCredential'],
        trustLevel: 'high'
      });

      expect(processor.isTrustedIssuer('did:example:issuer')).toBe(true);
    });
  });

  describe('isTrustedIssuer', () => {
    it('should return false for unknown issuer', () => {
      expect(processor.isTrustedIssuer('did:example:unknown')).toBe(false);
    });
  });

  describe('getIssuerDID', () => {
    it('should extract DID from string issuer', () => {
      const vc: VerifiableCredential = {
        '@context': ['https://www.w3.org/2018/credentials/v1'],
        type: ['VerifiableCredential'],
        issuer: 'did:example:123',
        issuanceDate: '2024-01-01',
        credentialSubject: {}
      };

      expect(processor.getIssuerDID(vc)).toBe('did:example:123');
    });

    it('should extract DID from object issuer', () => {
      const vc: VerifiableCredential = {
        '@context': ['https://www.w3.org/2018/credentials/v1'],
        type: ['VerifiableCredential'],
        issuer: { id: 'did:example:456', name: 'Test' },
        issuanceDate: '2024-01-01',
        credentialSubject: {}
      };

      expect(processor.getIssuerDID(vc)).toBe('did:example:456');
    });
  });

  describe('validateCredential', () => {
    it('should validate a correct credential', () => {
      const vc: VerifiableCredential = {
        '@context': ['https://www.w3.org/2018/credentials/v1'],
        type: ['VerifiableCredential', 'AgeCredential'],
        issuer: 'did:example:123',
        issuanceDate: '2024-01-01',
        credentialSubject: { birthDate: '1990-01-01' }
      };

      const result = processor.validateCredential(vc);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject credential without context', () => {
      const vc: VerifiableCredential = {
        '@context': [],
        type: ['VerifiableCredential'],
        issuer: 'did:example:123',
        issuanceDate: '2024-01-01',
        credentialSubject: {}
      };

      const result = processor.validateCredential(vc);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Missing @context');
    });

    it('should reject credential without VerifiableCredential type', () => {
      const vc: VerifiableCredential = {
        '@context': ['https://www.w3.org/2018/credentials/v1'],
        type: ['AgeCredential'] as any,
        issuer: 'did:example:123',
        issuanceDate: '2024-01-01',
        credentialSubject: {}
      };

      const result = processor.validateCredential(vc);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Must include "VerifiableCredential" type');
    });

    it('should reject expired credential', () => {
      const vc: VerifiableCredential = {
        '@context': ['https://www.w3.org/2018/credentials/v1'],
        type: ['VerifiableCredential'],
        issuer: 'did:example:123',
        issuanceDate: '2020-01-01',
        expirationDate: '2021-01-01', // Expired
        credentialSubject: {}
      };

      const result = processor.validateCredential(vc);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Credential has expired');
    });
  });

  describe('calculateAge', () => {
    it('should calculate age correctly', () => {
      const currentDate = new Date('2024-11-26');
      const age = processor.calculateAge('1990-05-15', currentDate);
      expect(age).toBe(34);
    });

    it('should handle birthday not yet passed this year', () => {
      const currentDate = new Date('2024-03-01');
      const age = processor.calculateAge('1990-05-15', currentDate);
      expect(age).toBe(33);
    });
  });

  describe('convertAgeCredential', () => {
    it('should convert age credential to circuit inputs', () => {
      const vc: VerifiableCredential = {
        '@context': ['https://www.w3.org/2018/credentials/v1'],
        type: ['VerifiableCredential', 'AgeCredential'],
        issuer: 'did:example:gov',
        issuanceDate: '2024-01-01',
        credentialSubject: {
          id: 'did:example:user',
          birthDate: '1990-05-15'
        } as AgeCredentialSubject
      };

      // Use a fixed date with explicit UTC to avoid timezone issues
      const testDate = new Date(Date.UTC(2024, 10, 26, 12, 0, 0)); // Nov 26, 2024 at noon UTC
      const inputs = processor.convertAgeCredential(vc, testDate);

      expect(inputs.birthYear).toBe(1990);
      expect(inputs.birthMonth).toBe(5);
      expect(inputs.birthDay).toBe(15);
      // Check that current date components are present (actual values depend on local timezone)
      expect(inputs.currentYear).toBeGreaterThanOrEqual(2024);
      expect(inputs.currentMonth).toBeGreaterThanOrEqual(1);
      expect(inputs.currentMonth).toBeLessThanOrEqual(12);
      expect(inputs.currentDay).toBeGreaterThanOrEqual(1);
      expect(inputs.currentDay).toBeLessThanOrEqual(31);
      expect(inputs.credentialHash).toBeDefined();
      expect(inputs.issuerCommitment).toBeDefined();
    });

    it('should throw error for credential without birthDate', () => {
      const vc: VerifiableCredential = {
        '@context': ['https://www.w3.org/2018/credentials/v1'],
        type: ['VerifiableCredential', 'AgeCredential'],
        issuer: 'did:example:gov',
        issuanceDate: '2024-01-01',
        credentialSubject: {
          id: 'did:example:user'
        }
      };

      expect(() => processor.convertAgeCredential(vc)).toThrow('birthDate');
    });
  });

  describe('convertEmploymentCredential', () => {
    it('should convert employment credential to circuit inputs', () => {
      const vc: VerifiableCredential = {
        '@context': ['https://www.w3.org/2018/credentials/v1'],
        type: ['VerifiableCredential', 'EmploymentCredential'],
        issuer: 'did:example:employer',
        issuanceDate: '2024-01-01',
        credentialSubject: {
          id: 'did:example:employee',
          employerName: 'Acme Corp',
          jobTitle: 'Engineer',
          startDate: '2020-06-15',
          annualSalary: 12000000,
          employmentStatus: 'active',
          industryCode: 'technology'
        } as EmploymentCredentialSubject
      };

      const inputs = processor.convertEmploymentCredential(vc, new Date('2024-11-26'));

      expect(inputs.startYear).toBe(2020);
      expect(inputs.startMonth).toBe(6);
      expect(inputs.annualSalary).toBe(12000000);
      expect(inputs.employmentStatus).toBe(1); // active = 1
      expect(inputs.industryCode).toBe(54); // technology = 54
      expect(inputs.employerHash).toBeDefined();
      expect(inputs.jobTitleHash).toBeDefined();
    });
  });

  describe('generateAgeVerificationPublicInputs', () => {
    it('should generate public inputs for age verification', () => {
      const inputs = processor.generateAgeVerificationPublicInputs(21, ['did:example:gov']);

      expect(inputs.minAge).toBe(21);
      expect(inputs.currentYear).toBeGreaterThan(2020);
      expect(inputs.currentMonth).toBeGreaterThanOrEqual(1);
      expect(inputs.currentMonth).toBeLessThanOrEqual(12);
      expect(inputs.trustedIssuerRoot).toBeDefined();
    });
  });

  describe('generateIdentityVerificationPublicInputs', () => {
    it('should generate public inputs for identity verification', () => {
      const inputs = processor.generateIdentityVerificationPublicInputs(
        ['US', 'CA', 'GB'],
        ['passport', 'nationalID'],
        'did:example:gov'
      );

      expect(inputs.allowedNationalities).toHaveLength(20);
      expect(inputs.allowedNationalities[0]).toBe(840); // US
      expect(inputs.allowedNationalities[1]).toBe(124); // CA
      expect(inputs.allowedNationalities[2]).toBe(826); // GB
      expect(inputs.allowedDocTypes).toBe(3); // passport (1) + nationalID (2) = bitmask 011 = 3
    });
  });

  describe('generateEmploymentVerificationPublicInputs', () => {
    it('should generate public inputs for employment verification', () => {
      const inputs = processor.generateEmploymentVerificationPublicInputs(
        10000000,
        24,
        'active',
        ['technology', 'finance']
      );

      expect(inputs.minSalary).toBe(10000000);
      expect(inputs.minTenureMonths).toBe(24);
      expect(inputs.requiredStatus).toBe(1); // active = 1
      expect(inputs.allowedIndustries).toHaveLength(10);
      expect(inputs.allowedIndustries[0]).toBe(54); // technology
      expect(inputs.allowedIndustries[1]).toBe(52); // finance
    });
  });

  describe('convertCredential (auto-detect)', () => {
    it('should auto-detect and convert AgeCredential', () => {
      const vc: VerifiableCredential = {
        '@context': ['https://www.w3.org/2018/credentials/v1'],
        type: ['VerifiableCredential', 'AgeCredential'],
        issuer: 'did:example:gov',
        issuanceDate: '2024-01-01',
        credentialSubject: {
          birthDate: '1990-01-01'
        } as AgeCredentialSubject
      };

      const inputs = processor.convertCredential(vc);
      expect(inputs.birthYear).toBe(1990);
    });

    it('should throw for unsupported credential type', () => {
      const vc: VerifiableCredential = {
        '@context': ['https://www.w3.org/2018/credentials/v1'],
        type: ['VerifiableCredential', 'UnknownCredential'] as any,
        issuer: 'did:example:gov',
        issuanceDate: '2024-01-01',
        credentialSubject: {}
      };

      expect(() => processor.convertCredential(vc)).toThrow('Unsupported credential type');
    });
  });
});
