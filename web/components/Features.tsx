export default function Features() {
  const features = [
    {
      icon: "🔒",
      title: "Zero-Knowledge Proofs",
      description: "Prove KYC compliance (age, balance, country) without revealing exact personal data using Groth16 SNARKs.",
      color: "border-stellar-purple"
    },
    {
      icon: "🌐",
      title: "Multi-Chain Support",
      description: "Deploy the same proof verification on EVM chains (Ethereum, Polygon, BSC) and Stellar Soroban.",
      color: "border-stellar-blue"
    },
    {
      icon: "⚡",
      title: "Lightning Fast",
      description: "Proof generation in ~2-5 seconds, verification in <50ms off-chain, ~250k gas on-chain.",
      color: "border-zk-green"
    },
    {
      icon: "🛡️",
      title: "Production Ready",
      description: "Battle-tested Groth16 implementation with comprehensive demo scripts and documentation.",
      color: "border-zk-cyan"
    },
    {
      icon: "📦",
      title: "Easy Integration",
      description: "Simple SDK with TypeScript/JavaScript support. Works with existing blockchain infrastructure.",
      color: "border-stellar-purple"
    },
    {
      icon: "🔓",
      title: "Open Source",
      description: "Fully open-source under AGPL-3.0. Built with Circom, snarkjs, and Soroban SDK.",
      color: "border-stellar-blue"
    }
  ]

  return (
    <section id="features" className="py-20 px-4 relative">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Powerful <span className="text-gradient">Privacy Features</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Everything you need to build privacy-preserving applications across multiple blockchains
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className={`p-6 rounded-xl border-2 ${feature.color} bg-gradient-to-br from-stellar-dark to-black hover:scale-105 transition-transform duration-300`}
            >
              <div className="text-5xl mb-4">{feature.icon}</div>
              <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
