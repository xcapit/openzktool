'use client'

import { useState } from 'react'

export default function CircuitTemplates() {
  const [filter, setFilter] = useState<'all' | 'kyc' | 'defi' | 'vc'>('all')

  const circuits = [
    {
      name: 'kyc_transfer',
      category: 'kyc',
      icon: '🛂',
      description: 'Complete KYC verification with age, balance, and country checks',
      constraints: 586,
      status: 'production',
      inputs: ['age', 'balance', 'country'],
      outputs: ['kycValid']
    },
    {
      name: 'age_gate',
      category: 'kyc',
      icon: '🎂',
      description: 'Simple age verification (18+, 21+, etc.)',
      constraints: 120,
      status: 'production',
      inputs: ['birthYear', 'minAge'],
      outputs: ['isOfAge']
    },
    {
      name: 'balance_proof',
      category: 'defi',
      icon: '💰',
      description: 'Prove balance is within a range without revealing exact amount',
      constraints: 245,
      status: 'production',
      inputs: ['balance', 'minBalance', 'maxBalance'],
      outputs: ['inRange']
    },
    {
      name: 'accredited_investor',
      category: 'defi',
      icon: '📈',
      description: 'SEC accredited investor verification ($200K+ income or $1M+ assets)',
      constraints: 380,
      status: 'production',
      inputs: ['income', 'netWorth'],
      outputs: ['isAccredited']
    },
    {
      name: 'credit_score',
      category: 'defi',
      icon: '📊',
      description: 'Prove credit score meets threshold without revealing exact score',
      constraints: 290,
      status: 'production',
      inputs: ['creditScore', 'minScore'],
      outputs: ['meetsThreshold']
    },
    {
      name: 'membership_proof',
      category: 'kyc',
      icon: '🎫',
      description: 'Prove membership in a group using Merkle tree inclusion',
      constraints: 450,
      status: 'production',
      inputs: ['memberHash', 'merkleProof'],
      outputs: ['isMember']
    },
    {
      name: 'transaction_limit',
      category: 'defi',
      icon: '🔄',
      description: 'AML-compliant transaction limit verification',
      constraints: 320,
      status: 'production',
      inputs: ['amount', 'dailyLimit', 'monthlyLimit'],
      outputs: ['withinLimits']
    },
    {
      name: 'geographic_compliance',
      category: 'kyc',
      icon: '🌍',
      description: 'Verify user location meets regulatory requirements',
      constraints: 210,
      status: 'production',
      inputs: ['countryCode', 'allowedCountries'],
      outputs: ['isAllowed']
    },
    {
      name: 'vc_age_credential',
      category: 'vc',
      icon: '🎂',
      description: 'Age verification from W3C Verifiable Credential',
      constraints: 540,
      status: 'production',
      inputs: ['birthYear', 'birthMonth', 'birthDay', 'credentialHash'],
      outputs: ['ageVerified']
    },
    {
      name: 'vc_identity_credential',
      category: 'vc',
      icon: '🪪',
      description: 'Identity verification from W3C VC without revealing PII',
      constraints: 671,
      status: 'production',
      inputs: ['nameHash', 'nationality', 'documentType'],
      outputs: ['identityVerified']
    },
    {
      name: 'vc_employment_credential',
      category: 'vc',
      icon: '💼',
      description: 'Employment/salary verification from W3C VC',
      constraints: 719,
      status: 'production',
      inputs: ['employerHash', 'salary', 'startDate'],
      outputs: ['employmentVerified']
    }
  ]

  const filteredCircuits = filter === 'all'
    ? circuits
    : circuits.filter(c => c.category === filter)

  const categories = [
    { id: 'all', label: 'All Templates', count: circuits.length },
    { id: 'kyc', label: 'KYC/Identity', count: circuits.filter(c => c.category === 'kyc').length },
    { id: 'defi', label: 'DeFi/Finance', count: circuits.filter(c => c.category === 'defi').length },
    { id: 'vc', label: 'Verifiable Credentials', count: circuits.filter(c => c.category === 'vc').length }
  ]

  return (
    <section id="circuits" className="py-20 px-4 relative">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Circuit <span className="text-gradient">Templates</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Pre-built, production-ready ZK circuits for common use cases.
            Deploy in minutes, not months.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setFilter(cat.id as typeof filter)}
              className={`px-5 py-2 rounded-full font-medium transition-all ${
                filter === cat.id
                  ? 'bg-stellar-purple text-white'
                  : 'glass border border-gray-600 hover:border-stellar-purple text-gray-300'
              }`}
            >
              {cat.label}
              <span className="ml-2 text-xs opacity-70">({cat.count})</span>
            </button>
          ))}
        </div>

        {/* Circuit Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCircuits.map((circuit, idx) => (
            <div
              key={circuit.name}
              className="glass p-5 rounded-xl border border-gray-700 hover:border-stellar-purple transition-all group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="text-3xl">{circuit.icon}</div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  circuit.status === 'production'
                    ? 'bg-zk-green/20 text-zk-green'
                    : 'bg-yellow-500/20 text-yellow-500'
                }`}>
                  {circuit.status === 'production' ? '✓ Ready' : 'Beta'}
                </span>
              </div>

              <h3 className="text-lg font-bold mb-2 font-mono text-stellar-purple group-hover:text-white transition-colors">
                {circuit.name}
              </h3>
              <p className="text-gray-400 text-sm mb-4">{circuit.description}</p>

              <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                <span>{circuit.constraints} constraints</span>
                <span className="text-stellar-blue">{circuit.category}</span>
              </div>

              <div className="border-t border-gray-700 pt-3 mt-3">
                <div className="flex flex-wrap gap-1">
                  {circuit.inputs.slice(0, 3).map(input => (
                    <span key={input} className="text-xs px-2 py-1 bg-gray-800 rounded text-gray-400">
                      {input}
                    </span>
                  ))}
                  {circuit.inputs.length > 3 && (
                    <span className="text-xs px-2 py-1 text-gray-500">+{circuit.inputs.length - 3}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary Stats */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="glass p-4 rounded-xl text-center">
            <div className="text-3xl font-bold text-stellar-purple">{circuits.length}</div>
            <div className="text-sm text-gray-400">Circuit Templates</div>
          </div>
          <div className="glass p-4 rounded-xl text-center">
            <div className="text-3xl font-bold text-zk-green">100%</div>
            <div className="text-sm text-gray-400">Production Ready</div>
          </div>
          <div className="glass p-4 rounded-xl text-center">
            <div className="text-3xl font-bold text-stellar-blue">Groth16</div>
            <div className="text-sm text-gray-400">Proof System</div>
          </div>
          <div className="glass p-4 rounded-xl text-center">
            <div className="text-3xl font-bold text-zk-cyan">BN254</div>
            <div className="text-sm text-gray-400">Elliptic Curve</div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <a
            href="https://github.com/xcapit/openzktool/tree/main/circuits"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-stellar-purple hover:bg-opacity-80 rounded-lg font-semibold transition-all text-white"
          >
            <span>Browse All Circuits on GitHub</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
}
