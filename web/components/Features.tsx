export default function Features() {
  const features = [
    {
      icon: "🔐",
      title: "Privacy-Preserving Verification",
      description: "Prove identity, compliance, and solvency without revealing sensitive data. ZK-SNARKs enable verification without disclosure.",
      color: "border-stellar-purple",
      phase: "✅ PoC"
    },
    {
      icon: "⛓️",
      title: "Multi-Chain Ready",
      description: "Implemented on Ethereum and Stellar Soroban. Ready to deploy on any EVM-compatible network (Polygon, BSC, Arbitrum, Optimism, Base).",
      color: "border-stellar-blue",
      phase: "✅ PoC: ETH + Soroban"
    },
    {
      icon: "⚡",
      title: "Production-Grade Performance",
      description: "~800 byte proofs, 586 constraints, <50ms verification. Optimized for real-world applications and high transaction volumes.",
      color: "border-zk-green",
      phase: "✅ PoC"
    },
    {
      icon: "🛠️",
      title: "Developer-Friendly SDK",
      description: "TypeScript/JavaScript SDK with intuitive APIs. Generate and verify proofs in minutes, not weeks.",
      color: "border-zk-cyan",
      phase: "🚧 MVP"
    },
    {
      icon: "🌐",
      title: "No-Code Playground",
      description: "Visual circuit builder for non-developers. Design, test, and deploy ZK circuits without writing code.",
      color: "border-stellar-purple",
      phase: "🌐 Mainnet"
    },
    {
      icon: "🔓",
      title: "Open Source & Auditable",
      description: "AGPL-3.0 licensed. Built with Circom, snarkjs, and Soroban. Transparent, auditable, community-driven.",
      color: "border-stellar-blue",
      phase: "✅ PoC"
    }
  ]

  return (
    <section id="features" className="py-20 px-4 relative">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Why <span className="text-gradient">OpenZKTool</span>?
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            The first open-source, production-ready privacy and identity layer for Stellar — designed for developers, institutions, and the future of decentralized finance
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className={`p-6 rounded-xl border-2 ${feature.color} bg-gradient-to-br from-stellar-dark to-black hover:scale-105 transition-all duration-300 group`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="text-5xl group-hover:scale-110 transition-transform">{feature.icon}</div>
                <span className="text-xs px-2 py-1 bg-gray-700 rounded-full text-gray-400">{feature.phase}</span>
              </div>
              <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Value Proposition */}
        <div className="mt-16 p-8 rounded-xl border-2 border-zk-green bg-gradient-to-br from-zk-green to-stellar-blue bg-opacity-10">
          <div className="text-center">
            <h3 className="text-3xl font-bold mb-4">The OpenZKTool Difference</h3>
            <div className="grid md:grid-cols-3 gap-8 mt-8">
              <div>
                <div className="text-4xl mb-3">🎯</div>
                <h4 className="font-bold mb-2 text-lg">Built for Stellar</h4>
                <p className="text-gray-400 text-sm">Native Soroban support with EVM compatibility. The only ZK toolkit designed specifically for Stellar's ecosystem.</p>
              </div>
              <div>
                <div className="text-4xl mb-3">🔬</div>
                <h4 className="font-bold mb-2 text-lg">Research-Backed</h4>
                <p className="text-gray-400 text-sm">PhD-level cryptography expertise. Academic partnerships ensure cutting-edge ZK research translates to production code.</p>
              </div>
              <div>
                <div className="text-4xl mb-3">🌍</div>
                <h4 className="font-bold mb-2 text-lg">Digital Public Good</h4>
                <p className="text-gray-400 text-sm">Open source, community-driven, and designed for maximum impact. Privacy infrastructure for everyone, everywhere.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
