export default function Roadmap() {
  const phases = [
    {
      phase: "Phase 0: Proof of Concept",
      status: "completed",
      timeline: "✅ Completed",
      goal: "Validate the feasibility of privacy-preserving verification using Zero-Knowledge Proofs across Stellar (Soroban) and EVM-compatible environments.",
      items: [
        { title: "Core ZK Circuit Library", done: true, desc: "range_proof, solvency_check, compliance_verify, kyc_transfer" },
        { title: "Multi-Chain Verifiers", done: true, desc: "EVM (Solidity) and Soroban (Rust no_std)" },
        { title: "Demo Scripts & Documentation", done: true, desc: "Complete educational materials and examples" },
        { title: "Web Landing Page", done: true, desc: "openzktool.vercel.app" }
      ]
    },
    {
      phase: "Phase 1: MVP",
      status: "upcoming",
      timeline: "🚧 Upcoming",
      goal: "Build the minimum viable product to make ZKP privacy verification accessible for developers through a clean SDK and modular architecture.",
      items: [
        { title: "ZKP Core SDK (TypeScript/JS)", done: false, desc: "Interfaces for proof generation, verification, circuit management" },
        { title: "Unified API Layer", done: false, desc: "REST/GraphQL endpoints for external systems" },
        { title: "Integration Examples", done: false, desc: "Stellar and EVM (Polygon Amoy/Sepolia)" },
        { title: "WASM/Browser Support", done: false, desc: "Client-side proof generation" }
      ]
    },
    {
      phase: "Phase 2: Testnet",
      status: "planned",
      timeline: "🧭 Planned",
      goal: "Deploy the MVP to Stellar and EVM testnets, enabling interoperability and real network testing.",
      items: [
        { title: "Contract Deployment", done: false, desc: "Deploy on Stellar Soroban testnet and EVM testnets" },
        { title: "Hosted SDK/API Service", done: false, desc: "Public API endpoint for testnet" },
        { title: "Documentation Portal", done: false, desc: "Technical docs and developer guides" },
        { title: "Sample dApps", done: false, desc: "Reference implementations" }
      ]
    },
    {
      phase: "Phase 3: Mainnet",
      status: "future",
      timeline: "🌐 Future",
      goal: "Launch production-ready privacy and identity infrastructure on Stellar and EVM mainnets, supported by a no-code interface.",
      items: [
        { title: "Playground UI", done: false, desc: "Visual interface to create ZKP circuits (no-code)" },
        { title: "Open-Source SDK Release", done: false, desc: "@openzktool/sdk on npm" },
        { title: "Mainnet Deployment", done: false, desc: "Production contracts on Stellar and EVM mainnets" },
        { title: "Security Audit", done: false, desc: "Independent third-party audit" }
      ]
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-zk-green text-black'
      case 'upcoming': return 'bg-stellar-blue text-black'
      case 'planned': return 'bg-stellar-purple text-white'
      case 'future': return 'bg-gray-600 text-white'
      default: return 'bg-gray-700 text-white'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return '✅'
      case 'upcoming': return '🚧'
      case 'planned': return '🧭'
      case 'future': return '🌐'
      default: return '📅'
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
            Our phased approach to building comprehensive privacy and identity infrastructure for Stellar
          </p>

          {/* Roadmap Timeline */}
          <div className="inline-block p-6 rounded-xl border-2 border-stellar-blue bg-gradient-to-br from-stellar-dark to-black glow-box">
            <div className="flex items-center gap-4">
              <div className="text-5xl">🚀</div>
              <div className="text-left">
                <h3 className="text-2xl font-bold text-gradient mb-1">PoC → MVP → Testnet → Mainnet</h3>
                <p className="text-gray-400">Privacy & Identity Layer on Stellar</p>
              </div>
            </div>
          </div>
        </div>

        {/* Roadmap Phases */}
        <div className="space-y-8">
          {phases.map((phase, idx) => (
            <div key={idx} className="relative">
              {/* Timeline connector */}
              {idx < phases.length - 1 && (
                <div className="absolute left-6 top-24 bottom-0 w-1 bg-gradient-to-b from-stellar-purple to-stellar-blue opacity-30 hidden md:block" />
              )}

              <div className="relative flex flex-col md:flex-row gap-6">
                {/* Phase indicator */}
                <div className="md:w-56 flex-shrink-0">
                  <div className="sticky top-24">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-3xl">{getStatusIcon(phase.status)}</span>
                      <span className="text-gray-500 text-sm">{phase.timeline}</span>
                    </div>
                    <h3 className="text-xl font-bold mb-3">{phase.phase}</h3>
                    <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(phase.status)}`}>
                      {phase.timeline}
                    </span>
                  </div>
                </div>

                {/* Phase content */}
                <div className="flex-1">
                  {/* Goal */}
                  <div className="mb-6 p-4 rounded-lg bg-stellar-dark border border-gray-700">
                    <p className="text-sm text-gray-400 mb-1 font-semibold">Goal:</p>
                    <p className="text-gray-300">{phase.goal}</p>
                  </div>

                  {/* Items */}
                  <div className="space-y-4">
                    {phase.items.map((item, itemIdx) => (
                      <div
                        key={itemIdx}
                        className={`p-6 rounded-xl border-2 ${
                          item.done ? 'border-zk-green bg-zk-green bg-opacity-5' : 'border-gray-700 bg-stellar-dark'
                        } hover:border-stellar-purple transition-all duration-300`}
                      >
                        <div className="flex items-start gap-4">
                          <div className="text-3xl flex-shrink-0">
                            {item.done ? '✅' : phase.status === 'upcoming' ? '🚧' : phase.status === 'planned' ? '🧭' : '🌐'}
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
            </div>
          ))}
        </div>

        {/* Summary Table */}
        <div className="mt-16 p-8 rounded-xl border-2 border-stellar-purple bg-gradient-to-br from-stellar-purple to-stellar-blue bg-opacity-10">
          <h3 className="text-3xl font-bold mb-6 text-center">Roadmap Summary</h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-600">
                  <th className="py-3 px-4 font-bold">Phase</th>
                  <th className="py-3 px-4 font-bold">Network Scope</th>
                  <th className="py-3 px-4 font-bold">Focus</th>
                  <th className="py-3 px-4 font-bold">Verification</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-700">
                  <td className="py-3 px-4"><span className="text-zk-green font-semibold">0 – PoC</span></td>
                  <td className="py-3 px-4 text-gray-400">Local / Dev</td>
                  <td className="py-3 px-4 text-gray-400">Circuits & CLI</td>
                  <td className="py-3 px-4 text-gray-400">✅ Reproducible repo</td>
                </tr>
                <tr className="border-b border-gray-700">
                  <td className="py-3 px-4"><span className="text-stellar-blue font-semibold">1 – MVP</span></td>
                  <td className="py-3 px-4 text-gray-400">Dev / Local</td>
                  <td className="py-3 px-4 text-gray-400">SDK + API design</td>
                  <td className="py-3 px-4 text-gray-400">Unit testing</td>
                </tr>
                <tr className="border-b border-gray-700">
                  <td className="py-3 px-4"><span className="text-stellar-purple font-semibold">2 – Testnet</span></td>
                  <td className="py-3 px-4 text-gray-400">Stellar + EVM Testnets</td>
                  <td className="py-3 px-4 text-gray-400">Interoperability</td>
                  <td className="py-3 px-4 text-gray-400">Cross-chain validation</td>
                </tr>
                <tr>
                  <td className="py-3 px-4"><span className="text-gray-400 font-semibold">3 – Mainnet</span></td>
                  <td className="py-3 px-4 text-gray-400">Stellar + EVM Mainnets</td>
                  <td className="py-3 px-4 text-gray-400">Production & UI</td>
                  <td className="py-3 px-4 text-gray-400">Public verification</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-8 text-center">
            <p className="text-lg text-gray-300 mb-4">
              <strong>Join us in building privacy infrastructure for the future of finance</strong>
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://github.com/xcapit/openzktool"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-white text-stellar-dark hover:bg-gray-100 rounded-lg font-semibold transition-all"
              >
                Contribute on GitHub
              </a>
              <a
                href="https://github.com/xcapit/openzktool/blob/main/ROADMAP.md"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 border-2 border-white hover:bg-white hover:text-stellar-dark rounded-lg font-semibold transition-all text-white"
              >
                View Full Roadmap
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
