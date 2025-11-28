'use client'

import { useState } from 'react'
import CopyButton from './CopyButton'

export default function VerifiableCredentials() {
  const [activeTab, setActiveTab] = useState<'age' | 'identity' | 'employment'>('age')

  const credentialTypes = {
    age: {
      title: 'Age Verification',
      icon: '🎂',
      description: 'Prove you meet age requirements without revealing your birthdate',
      useCase: 'Alcohol purchases, age-restricted content, voting eligibility',
      privateData: ['Birthdate', 'Full name', 'Document details'],
      publicProof: ['Age >= 21', 'Valid credential', 'Trusted issuer'],
      code: `import { VCProcessor } from '@openzktool/sdk';

// Government-issued age credential (W3C VC format)
const ageCredential = {
  '@context': ['https://www.w3.org/2018/credentials/v1'],
  type: ['VerifiableCredential', 'AgeCredential'],
  issuer: { id: 'did:web:dmv.gov', name: 'DMV' },
  credentialSubject: {
    birthDate: '1995-03-20'  // PRIVATE - never revealed
  }
};

// Convert to ZK circuit inputs
const vcProcessor = new VCProcessor();
const inputs = vcProcessor.convertAgeCredential(ageCredential);

// Generate proof: "I am 21+" without revealing birthdate
const { proof } = await zktool.generateProof(inputs);`
    },
    identity: {
      title: 'Identity Verification',
      icon: '🪪',
      description: 'Prove nationality or document validity without exposing PII',
      useCase: 'KYC compliance, border control, financial services',
      privateData: ['Full name', 'Document number', 'Address'],
      publicProof: ['Nationality in allowed list', 'Valid document type', 'Not expired'],
      code: `import { VCProcessor } from '@openzktool/sdk';

// Passport credential
const identityCredential = {
  '@context': ['https://www.w3.org/2018/credentials/v1'],
  type: ['VerifiableCredential', 'IdentityCredential'],
  issuer: 'did:web:passport.gov',
  credentialSubject: {
    givenName: 'John',        // PRIVATE
    familyName: 'Doe',        // PRIVATE
    nationality: 'US',        // Verified but not revealed
    documentNumber: 'ABC123'  // PRIVATE
  }
};

// Prove: "I am a US/EU citizen" without revealing identity
const inputs = vcProcessor.convertIdentityCredential(identityCredential);
const publicInputs = vcProcessor.generateIdentityVerificationPublicInputs(
  ['US', 'CA', 'GB', 'DE', 'FR'],  // Allowed nationalities
  ['passport', 'nationalID']       // Allowed document types
);`
    },
    employment: {
      title: 'Employment Verification',
      icon: '💼',
      description: 'Prove income or employment without revealing salary details',
      useCase: 'Loan applications, rental verification, background checks',
      privateData: ['Employer name', 'Exact salary', 'Job title', 'Start date'],
      publicProof: ['Salary >= $100K', 'Tenure >= 2 years', 'Currently employed'],
      code: `import { VCProcessor } from '@openzktool/sdk';

// Employment credential from employer
const employmentCredential = {
  '@context': ['https://www.w3.org/2018/credentials/v1'],
  type: ['VerifiableCredential', 'EmploymentCredential'],
  issuer: 'did:web:acme-corp.com',
  credentialSubject: {
    employerName: 'Acme Corp',     // PRIVATE
    jobTitle: 'Senior Engineer',   // PRIVATE
    annualSalary: 15000000,        // PRIVATE ($150K in cents)
    startDate: '2020-06-15',       // PRIVATE
    employmentStatus: 'active'
  }
};

// Prove: "I earn >$100K and work 2+ years" without details
const inputs = vcProcessor.convertEmploymentCredential(employmentCredential);
const publicInputs = vcProcessor.generateEmploymentVerificationPublicInputs(
  10000000,  // Min $100K salary
  24,        // Min 24 months tenure
  'active'   // Must be employed
);`
    }
  }

  const active = credentialTypes[activeTab]

  return (
    <section id="verifiable-credentials" className="py-20 px-4 relative">
      {/* Background effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-stellar-purple/5 to-transparent"></div>

      <div className="max-w-6xl mx-auto relative">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 glass border border-stellar-purple rounded-full mb-6">
            <span className="text-stellar-purple font-semibold">NEW</span>
            <span className="text-gray-300">W3C Verifiable Credentials</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Privacy-Preserving <span className="text-gradient">Credentials</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Prove claims from W3C Verifiable Credentials without revealing sensitive data.
            Your birthdate, salary, and identity stay private — only the proof is shared.
          </p>
        </div>

        {/* Credential Type Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {Object.entries(credentialTypes).map(([key, cred]) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as 'age' | 'identity' | 'employment')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                activeTab === key
                  ? 'bg-stellar-purple text-white glow-box'
                  : 'glass border border-gray-600 hover:border-stellar-purple text-gray-300'
              }`}
            >
              <span className="mr-2">{cred.icon}</span>
              {cred.title}
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left: Info */}
          <div className="space-y-6">
            <div className="glass p-6 rounded-xl border border-stellar-purple">
              <h3 className="text-2xl font-bold mb-3 flex items-center gap-2">
                <span>{active.icon}</span>
                {active.title}
              </h3>
              <p className="text-gray-300 mb-4">{active.description}</p>
              <p className="text-sm text-gray-400">
                <span className="text-stellar-blue font-semibold">Use cases:</span> {active.useCase}
              </p>
            </div>

            {/* Privacy Comparison */}
            <div className="grid grid-cols-2 gap-4">
              <div className="glass p-4 rounded-xl border border-red-500/50">
                <h4 className="font-bold text-red-400 mb-3 flex items-center gap-2">
                  <span>🔒</span> Private Data
                </h4>
                <ul className="space-y-2">
                  {active.privateData.map((item, i) => (
                    <li key={i} className="text-gray-400 text-sm flex items-center gap-2">
                      <span className="text-red-400">✕</span> {item}
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-red-400/70 mt-3">Never revealed to verifier</p>
              </div>

              <div className="glass p-4 rounded-xl border border-zk-green/50">
                <h4 className="font-bold text-zk-green mb-3 flex items-center gap-2">
                  <span>✓</span> ZK Proof Shows
                </h4>
                <ul className="space-y-2">
                  {active.publicProof.map((item, i) => (
                    <li key={i} className="text-gray-400 text-sm flex items-center gap-2">
                      <span className="text-zk-green">✓</span> {item}
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-zk-green/70 mt-3">Cryptographically verified</p>
              </div>
            </div>

            {/* Stats */}
            <div className="flex gap-4">
              <div className="glass p-4 rounded-xl flex-1 text-center">
                <div className="text-2xl font-bold text-stellar-blue">3</div>
                <div className="text-xs text-gray-400">Credential Types</div>
              </div>
              <div className="glass p-4 rounded-xl flex-1 text-center">
                <div className="text-2xl font-bold text-zk-green">74</div>
                <div className="text-xs text-gray-400">SDK Tests Passing</div>
              </div>
              <div className="glass p-4 rounded-xl flex-1 text-center">
                <div className="text-2xl font-bold text-stellar-purple">W3C</div>
                <div className="text-xs text-gray-400">Standard Compliant</div>
              </div>
            </div>
          </div>

          {/* Right: Code Example */}
          <div className="glass rounded-xl border border-gray-700 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 bg-gray-900/50 border-b border-gray-700">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="ml-3 text-sm text-gray-400">example.ts</span>
              </div>
              <CopyButton text={active.code} />
            </div>
            <pre className="p-4 overflow-x-auto text-sm max-h-96">
              <code className="text-gray-300 whitespace-pre">{active.code}</code>
            </pre>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <div className="inline-flex flex-wrap gap-4 justify-center">
            <a
              href="https://github.com/xcapit/openzktool/tree/main/sdk/src/vc"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-stellar-purple hover:bg-opacity-80 rounded-lg font-semibold transition-all text-white"
            >
              View SDK Source
            </a>
            <a
              href="https://github.com/xcapit/openzktool/tree/main/examples/vc-integration"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 glass border border-stellar-purple hover:bg-stellar-purple/20 rounded-lg font-semibold transition-all text-white"
            >
              See Examples
            </a>
            <a
              href="https://github.com/xcapit/openzktool/blob/main/docs/guides/VERIFIABLE_CREDENTIALS.md"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 glass border border-zk-green hover:bg-zk-green/20 rounded-lg font-semibold transition-all text-white"
            >
              Full Documentation
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
