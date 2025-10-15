'use client'

import { useState } from 'react'
import CopyButton from './CopyButton'

export default function Architecture() {
  const [activeStep, setActiveStep] = useState<number | null>(null)

  const steps = [
    {
      icon: "📝",
      title: "Define Circuit",
      description: "Write your privacy logic in Circom",
      details: "Create circuits for age verification, balance proofs, or custom compliance checks. Circom provides a simple syntax for complex ZK logic.",
      code: "template KYC() { ... }"
    },
    {
      icon: "🔧",
      title: "Compile & Setup",
      description: "Compile to R1CS and generate keys",
      details: "Automated compilation to R1CS constraints. Run trusted setup ceremony or use universal reference string. Generate proving and verification keys.",
      code: "circom compile kyc.circom"
    },
    {
      icon: "🔐",
      title: "Generate Proof",
      description: "Create ZK proof with private inputs",
      details: "SDK handles witness calculation automatically. Proof generation takes <1 second. Works in browser with WASM or Node.js backend.",
      code: "const proof = await zk.prove(inputs)"
    },
    {
      icon: "✅",
      title: "Verify On-Chain",
      description: "Submit proof to smart contract",
      details: "Same proof works on Stellar and Ethereum. Gas-optimized verifier contracts. Instant verification in <50ms off-chain.",
      code: "await contract.verify(proof)"
    }
  ]

  return (
    <section className="py-20 px-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-stellar-purple opacity-5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-stellar-blue opacity-5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16 fade-in-up">
          <div className="inline-block mb-4">
            <span className="px-4 py-2 bg-zk-green bg-opacity-20 border border-zk-green rounded-full text-zk-green font-semibold shimmer">
              ⚡ Zero-Knowledge in 4 Steps
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            How It <span className="text-gradient">Works</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            From circuit to verification in minutes. Simple integration, powerful privacy guarantees.
          </p>
        </div>

        {/* Architecture flow */}
        <div className="grid md:grid-cols-4 gap-6 mb-16">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className={`text-center cursor-pointer transition-all duration-300 ${
                activeStep === idx ? 'scale-105' : ''
              }`}
              onMouseEnter={() => setActiveStep(idx)}
              onMouseLeave={() => setActiveStep(null)}
            >
              <div className={`w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br ${
                idx === 0 ? 'from-stellar-purple to-stellar-blue' :
                idx === 1 ? 'from-stellar-blue to-zk-cyan' :
                idx === 2 ? 'from-zk-cyan to-zk-green' :
                'from-zk-green to-stellar-purple'
              } flex items-center justify-center text-3xl ${
                idx === 2 ? 'glow-box-green' : 'glow-box'
              } hover-lift`}>
                <span className="float-animation">{step.icon}</span>
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">
                {idx + 1}. {step.title}
              </h3>
              <p className="text-gray-400 text-sm mb-2">{step.description}</p>
              {activeStep === idx && (
                <div className="mt-2 p-3 glass rounded-lg fade-in-up">
                  <p className="text-xs text-gray-300 mb-2">{step.details}</p>
                  <code className="text-xs text-zk-green bg-black bg-opacity-50 px-2 py-1 rounded">
                    {step.code}
                  </code>
                </div>
              )}
              {idx < 3 && (
                <div className="hidden md:flex justify-center mt-8">
                  <svg className="w-8 h-8 text-stellar-purple opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Code example */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="p-6 rounded-xl border border-gray-700 bg-stellar-dark hover:border-stellar-purple transition-all">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold">Circuit Definition</h3>
                <span className="text-xs text-gray-500">Circom</span>
              </div>
              <CopyButton text={`template KYCTransfer() {
  signal input age;
  signal input balance;
  signal input countryId;

  signal output kycValid;

  // Age check: 18-99
  component ageProof = RangeProof();
  ageProof.value <== age;
  ageProof.min <== 18;
  ageProof.max <== 99;

  // Balance check: >= $50
  component solvency = SolvencyCheck();
  solvency.balance <== balance;
  solvency.threshold <== 50;

  // Country allowlist
  component compliance = ComplianceVerify();
  compliance.countryId <== countryId;

  kycValid <== ageProof.valid *
              solvency.valid *
              compliance.isAllowed;
}`} />
            </div>
            <pre className="text-sm text-gray-300 overflow-x-auto">
              <code>{`template KYCTransfer() {
  signal input age;
  signal input balance;
  signal input countryId;

  signal output kycValid;

  // Age check: 18-99
  component ageProof = RangeProof();
  ageProof.value <== age;
  ageProof.min <== 18;
  ageProof.max <== 99;

  // Balance check: >= $50
  component solvency = SolvencyCheck();
  solvency.balance <== balance;
  solvency.threshold <== 50;

  // Country allowlist
  component compliance = ComplianceVerify();
  compliance.countryId <== countryId;

  kycValid <== ageProof.valid *
              solvency.valid *
              compliance.isAllowed;
}`}</code>
            </pre>
          </div>

          <div className="p-6 rounded-xl border border-gray-700 bg-stellar-dark hover:border-zk-green transition-all">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold">Proof Generation</h3>
                <span className="text-xs text-gray-500">TypeScript SDK</span>
              </div>
              <CopyButton text={`import { OpenZKTool } from '@openzktool/sdk'

// Initialize SDK
const zk = new OpenZKTool({
  circuit: 'kyc_transfer',
  network: 'testnet'
})

// Private data (never revealed!)
const inputs = {
  age: 25,          // 🔒 Secret
  balance: 150,     // 🔒 Secret
  countryId: 11     // 🔒 Secret
}

// Generate proof in <1 second
const { proof, publicSignals } =
  await zk.generateProof(inputs)

// Verify locally (instant)
const valid = await zk.verifyLocal(proof)

// Verify on Stellar/Ethereum
const tx = await zk.verifyOnChain(
  proof,
  'stellar' // or 'ethereum'
)

// Result: kycValid = 1 ✅
// Hidden: age, balance, country`} />
            </div>
            <pre className="text-sm text-gray-300 overflow-x-auto">
              <code>{`import { OpenZKTool } from '@openzktool/sdk'

// Initialize SDK
const zk = new OpenZKTool({
  circuit: 'kyc_transfer',
  network: 'testnet'
})

// Private data (never revealed!)
const inputs = {
  age: 25,          // 🔒 Secret
  balance: 150,     // 🔒 Secret
  countryId: 11     // 🔒 Secret
}

// Generate proof in <1 second
const { proof, publicSignals } =
  await zk.generateProof(inputs)

// Verify locally (instant)
const valid = await zk.verifyLocal(proof)

// Verify on Stellar/Ethereum
const tx = await zk.verifyOnChain(
  proof,
  'stellar' // or 'ethereum'
)

// Result: kycValid = 1 ✅
// Hidden: age, balance, country`}</code>
            </pre>
          </div>
        </div>

        {/* Benefits */}
        <div className="mt-16 grid md:grid-cols-3 gap-6">
          <div className="text-center p-6 rounded-xl border border-stellar-purple bg-gradient-to-br from-stellar-dark to-black">
            <div className="text-4xl mb-3">🔒</div>
            <h4 className="text-xl font-bold mb-2">Privacy Preserved</h4>
            <p className="text-gray-400">Exact values never leave your device</p>
          </div>

          <div className="text-center p-6 rounded-xl border border-stellar-blue bg-gradient-to-br from-stellar-dark to-black">
            <div className="text-4xl mb-3">⚡</div>
            <h4 className="text-xl font-bold mb-2">Fast Verification</h4>
            <p className="text-gray-400">Constant time, no matter input size</p>
          </div>

          <div className="text-center p-6 rounded-xl border border-zk-green bg-gradient-to-br from-stellar-dark to-black">
            <div className="text-4xl mb-3">🌐</div>
            <h4 className="text-xl font-bold mb-2">Chain Agnostic</h4>
            <p className="text-gray-400">Same proof works everywhere</p>
          </div>
        </div>
      </div>
    </section>
  )
}
