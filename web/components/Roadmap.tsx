export default function Roadmap() {
  const phases = [
    {
      phase: "POC: Proof of Concept",
      status: "completed",
      quarter: "Pre-Grant",
      items: [
        { title: "Core ZK Circuit Library", done: true, desc: "KYC Transfer, Range Proofs, Solvency Checks" },
        { title: "Multi-Chain Verifiers", done: true, desc: "EVM (Solidity) and Soroban (Rust) testnet" },
        { title: "Demo Scripts & Documentation", done: true, desc: "Complete educational materials and examples" },
        { title: "Open Source Release", done: true, desc: "AGPL-3.0 license, GitHub repository, Web demo" }
      ]
    },
    {
      phase: "Tranche 1: MVP Development",
      status: "grant-funded",
      quarter: "Months 1-5",
      items: [
        { title: "Production ZK Circuits", done: false, desc: "Private transactions, balance proofs, counterparty masking" },
        { title: "Soroban Smart Contracts", done: false, desc: "Production verification contracts with gas optimization" },
        { title: "JavaScript/TypeScript SDK", done: false, desc: "Easy-to-use SDK with WASM/browser support" },
        { title: "Complete Documentation", done: false, desc: "API reference, integration guides, tutorials" }
      ]
    },
    {
      phase: "Tranche 2: Testnet & Pilots",
      status: "grant-funded",
      quarter: "Month 6",
      items: [
        { title: "Pilot Partner Integration", done: false, desc: "Onboard 2 pilot partners on testnet" },
        { title: "Banking Integration Layer", done: false, desc: "KYC/AML compliance interface and audit disclosures" },
        { title: "Compliance Dashboard", done: false, desc: "Audit trails, proof verification, monitoring" },
        { title: "Security Audit", done: false, desc: "Independent audit of circuits and contracts" }
      ]
    },
    {
      phase: "Tranche 3: Mainnet Launch",
      status: "grant-funded",
      quarter: "Month 6",
      items: [
        { title: "Mainnet Deployment", done: false, desc: "Deploy verification contracts on Soroban mainnet" },
        { title: "Production Release", done: false, desc: "Final audit reports, documentation, demo videos" },
        { title: "Ecosystem Growth", done: false, desc: "Onboard 5+ partners on mainnet (first 3 months)" },
        { title: "Ongoing Support", done: false, desc: "Developer community, maintenance, updates" }
      ]
    },
    {
      phase: "Future: Advanced Features",
      status: "planned",
      quarter: "Post-Grant",
      items: [
        { title: "Mobile SDK Integration", done: false, desc: "iOS and Android native support" },
        { title: "Advanced Circuit Library", done: false, desc: "Merkle proofs, signatures, recursive proofs" },
        { title: "Cross-Chain Aggregation", done: false, desc: "Verify multiple chain states in one proof" },
        { title: "zkEVM Integration", done: false, desc: "Full smart contract privacy on EVM chains" }
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
          <div className="inline-block p-6 rounded-xl border-2 border-stellar-blue bg-gradient-to-br from-stellar-dark to-black glow-box">
            <div className="flex items-center gap-4">
              <div className="text-5xl">📋</div>
              <div className="text-left">
                <h3 className="text-2xl font-bold text-gradient mb-1">SCF #40 Build Award Proposal</h3>
                <p className="text-gray-400">6-month development roadmap proposed to Stellar Community Fund</p>
                <p className="text-sm text-stellar-purple mt-2">Infrastructure & Services / Developer Tools</p>
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
          <h3 className="text-3xl font-bold mb-6 text-center">Project Impact & Success Criteria</h3>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-xl font-bold mb-4 text-stellar-blue">Deliverables</h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-zk-green text-xl">✓</span>
                  <span className="text-gray-300"><strong>Production ZK Circuits:</strong> Private transactions, balance proofs, counterparty masking</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-zk-green text-xl">✓</span>
                  <span className="text-gray-300"><strong>Soroban Contracts:</strong> Mainnet-ready verification contracts with gas optimization</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-zk-green text-xl">✓</span>
                  <span className="text-gray-300"><strong>JS/TS SDK:</strong> Complete developer toolkit with documentation</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-zk-green text-xl">✓</span>
                  <span className="text-gray-300"><strong>Banking Integration:</strong> KYC/AML compliance layer and audit interface</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-zk-green text-xl">✓</span>
                  <span className="text-gray-300"><strong>Security Audit:</strong> Independent audit of circuits and contracts</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-xl font-bold mb-4 text-stellar-blue">Success Metrics</h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-stellar-purple text-xl">🎯</span>
                  <span className="text-gray-300"><strong>5+ ecosystem partners</strong> onboarded on mainnet within 3 months</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-stellar-purple text-xl">🎯</span>
                  <span className="text-gray-300"><strong>2 pilot partners</strong> testing on testnet before mainnet launch</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-stellar-purple text-xl">🎯</span>
                  <span className="text-gray-300">Enable <strong>TradFi institutional adoption</strong> of Stellar</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-stellar-purple text-xl">🎯</span>
                  <span className="text-gray-300">Support <strong>cross-border B2B payments</strong> with privacy</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-stellar-purple text-xl">🎯</span>
                  <span className="text-gray-300">Build largest <strong>open-source ZK circuit library</strong></span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-600">
            <h4 className="text-2xl font-bold mb-4 text-center text-gradient">Why This Matters for Stellar</h4>
            <div className="grid md:grid-cols-3 gap-6 mt-6">
              <div className="text-center">
                <div className="text-4xl mb-3">🏦</div>
                <h5 className="font-bold mb-2">Institutional Adoption</h5>
                <p className="text-gray-400 text-sm">Enable financial institutions to use Stellar for private transactions</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-3">📈</div>
                <h5 className="font-bold mb-2">Network Growth</h5>
                <p className="text-gray-400 text-sm">Increase transaction volume and bring liquidity to the ecosystem</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-3">🔐</div>
                <h5 className="font-bold mb-2">Compliance Feature</h5>
                <p className="text-gray-400 text-sm">Turn regulatory compliance into a competitive advantage</p>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-lg text-gray-300 mb-4">
              <strong>Join us in building privacy infrastructure for the future of finance</strong>
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
