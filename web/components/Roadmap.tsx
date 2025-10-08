export default function Roadmap() {
  const phases = [
    {
      phase: "Phase 1: Foundation",
      status: "completed",
      quarter: "Q4 2024",
      items: [
        { title: "Core ZK Circuit Library", done: true, desc: "KYC Transfer, Range Proofs, Solvency Checks" },
        { title: "Multi-Chain Verifiers", done: true, desc: "EVM (Solidity) and Soroban (Rust) implementations" },
        { title: "Demo Scripts & Documentation", done: true, desc: "Complete educational materials and examples" },
        { title: "Open Source Release", done: true, desc: "AGPL-3.0 license, GitHub repository" }
      ]
    },
    {
      phase: "Phase 2: SDK Development",
      status: "in-progress",
      quarter: "Q1 2025",
      items: [
        { title: "TypeScript SDK", done: true, desc: "Easy-to-use API for proof generation and verification" },
        { title: "Circuit Template Library", done: false, desc: "Pre-built circuits for common use cases" },
        { title: "Web UI Components", done: false, desc: "React components for proof generation" },
        { title: "Testing Framework", done: false, desc: "Automated testing for circuits and proofs" }
      ]
    },
    {
      phase: "Phase 3: Advanced Features",
      status: "planned",
      quarter: "Q2 2025",
      items: [
        { title: "Recursive Proofs", done: false, desc: "Compose multiple proofs efficiently" },
        { title: "Merkle Tree Integration", done: false, desc: "Privacy-preserving set membership" },
        { title: "Signature Verification Circuits", done: false, desc: "ECDSA/EdDSA in zero-knowledge" },
        { title: "Mobile SDK", done: false, desc: "iOS and Android native support" }
      ]
    },
    {
      phase: "Phase 4: Ecosystem Expansion",
      status: "grant-funded",
      quarter: "Q3 2025",
      items: [
        { title: "Cross-Chain Proof Aggregation", done: false, desc: "Verify multiple chain states in one proof" },
        { title: "Privacy-Preserving Bridges", done: false, desc: "Private asset transfers between chains" },
        { title: "Compliance Oracle Integration", done: false, desc: "Real-time regulatory data feeds" },
        { title: "zkML Integration", done: false, desc: "Private machine learning inference" }
      ]
    },
    {
      phase: "Phase 5: Production & Scale",
      status: "grant-funded",
      quarter: "Q4 2025",
      items: [
        { title: "Production Trusted Setup Ceremony", done: false, desc: "Multi-party computation with 100+ participants" },
        { title: "Formal Security Audit", done: false, desc: "Third-party circuit and smart contract audit" },
        { title: "Performance Optimizations", done: false, desc: "Hardware acceleration, WASM optimization" },
        { title: "Enterprise Support", done: false, desc: "SLA, custom circuit development, integration help" }
      ]
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-zk-green text-black'
      case 'in-progress': return 'bg-stellar-blue text-black'
      case 'planned': return 'bg-gray-600 text-white'
      case 'grant-funded': return 'bg-gradient-to-r from-stellar-purple to-stellar-blue text-white'
      default: return 'bg-gray-700 text-white'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return '✅ Completed'
      case 'in-progress': return '🚧 In Progress'
      case 'planned': return '📅 Planned'
      case 'grant-funded': return '💎 Grant Funded'
      default: return status
    }
  }

  return (
    <section id="roadmap" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Development <span className="text-gradient">Roadmap</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
            Our vision for building the most comprehensive interoperable privacy SDK for blockchain applications
          </p>

          {/* Grant highlight */}
          <div className="inline-block p-6 rounded-xl border-2 border-stellar-purple bg-gradient-to-br from-stellar-dark to-black glow-box">
            <div className="flex items-center gap-4">
              <div className="text-5xl">🎯</div>
              <div className="text-left">
                <h3 className="text-2xl font-bold text-gradient mb-1">Grant Application Submitted</h3>
                <p className="text-gray-400">Phases 4-5 will be funded through the Stellar Community Fund grant</p>
              </div>
            </div>
          </div>
        </div>

        {/* Roadmap timeline */}
        <div className="space-y-8">
          {phases.map((phase, idx) => (
            <div key={idx} className="relative">
              {/* Timeline connector */}
              {idx < phases.length - 1 && (
                <div className="absolute left-6 top-24 bottom-0 w-1 bg-gradient-to-b from-stellar-purple to-stellar-blue opacity-30 hidden md:block" />
              )}

              <div className="relative flex flex-col md:flex-row gap-6">
                {/* Phase indicator */}
                <div className="md:w-48 flex-shrink-0">
                  <div className="sticky top-24">
                    <div className="text-gray-500 text-sm mb-2">{phase.quarter}</div>
                    <h3 className="text-xl font-bold mb-3">{phase.phase}</h3>
                    <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(phase.status)}`}>
                      {getStatusLabel(phase.status)}
                    </span>
                  </div>
                </div>

                {/* Items */}
                <div className="flex-1 space-y-4">
                  {phase.items.map((item, itemIdx) => (
                    <div
                      key={itemIdx}
                      className={`p-6 rounded-xl border-2 ${
                        item.done ? 'border-zk-green bg-zk-green bg-opacity-5' : 'border-gray-700 bg-stellar-dark'
                      } hover:border-stellar-purple transition-all duration-300`}
                    >
                      <div className="flex items-start gap-4">
                        <div className="text-3xl flex-shrink-0">
                          {item.done ? '✅' : phase.status === 'grant-funded' ? '💎' : '⏳'}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-bold mb-2">{item.title}</h4>
                          <p className="text-gray-400">{item.desc}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Grant impact section */}
        <div className="mt-16 p-8 rounded-xl border-2 border-stellar-purple bg-gradient-to-br from-stellar-purple to-stellar-blue bg-opacity-10">
          <h3 className="text-3xl font-bold mb-6 text-center">Grant Impact & Vision</h3>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-xl font-bold mb-4 text-stellar-blue">What the Grant Enables</h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-zk-green text-xl">✓</span>
                  <span className="text-gray-300"><strong>Cross-Chain Privacy:</strong> Prove state across Stellar, Ethereum, and L2s in a single proof</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-zk-green text-xl">✓</span>
                  <span className="text-gray-300"><strong>Advanced Cryptography:</strong> Recursive proofs, zkML, privacy-preserving bridges</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-zk-green text-xl">✓</span>
                  <span className="text-gray-300"><strong>Production Ready:</strong> Security audits, formal verification, trusted setup ceremony</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-zk-green text-xl">✓</span>
                  <span className="text-gray-300"><strong>Enterprise Features:</strong> Custom circuits, integration support, SLA guarantees</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-xl font-bold mb-4 text-stellar-blue">Long-Term Vision</h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-stellar-purple text-xl">🎯</span>
                  <span className="text-gray-300">Become the de-facto privacy SDK for multi-chain applications</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-stellar-purple text-xl">🎯</span>
                  <span className="text-gray-300">Enable privacy-first DeFi protocols across all major chains</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-stellar-purple text-xl">🎯</span>
                  <span className="text-gray-300">Support 100,000+ daily proof verifications by end of 2025</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-stellar-purple text-xl">🎯</span>
                  <span className="text-gray-300">Build the largest open-source ZK circuit library in the ecosystem</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-lg text-gray-300 mb-4">
              <strong>Help us build the future of privacy-preserving blockchain applications</strong>
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://github.com/xcapit/stellar-privacy-poc"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-white text-stellar-dark hover:bg-gray-100 rounded-lg font-semibold transition-all"
              >
                Contribute on GitHub
              </a>
              <a
                href="https://github.com/xcapit/stellar-privacy-poc/discussions"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 border-2 border-white hover:bg-white hover:text-stellar-dark rounded-lg font-semibold transition-all text-white"
              >
                Join the Discussion
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
