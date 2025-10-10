export default function UseCases() {
  const useCases = [
    {
      icon: "🏦",
      title: "Financial Privacy with Compliance",
      description: "Enable institutions to verify user eligibility without collecting or storing sensitive personal data. Privacy-preserving KYC/AML that actually works.",
      example: "Prove: Age ≥ 18, Balance ≥ $1000, Country: Allowed — without revealing exact values",
      color: "border-stellar-purple",
      impact: "1.7B unbanked people"
    },
    {
      icon: "💼",
      title: "Cross-Border B2B Payments",
      description: "Businesses can prove solvency and compliance for international transactions while keeping commercial relationships and financial details confidential.",
      example: "Prove credit-worthiness for $50K trade without revealing total assets or cash flow",
      color: "border-stellar-blue",
      impact: "$150T B2B payments market"
    },
    {
      icon: "🌍",
      title: "Decentralized Identity",
      description: "Self-sovereign identity that works across chains. Prove credentials, memberships, and qualifications without centralized databases.",
      example: "Prove accredited investor status without sharing portfolio or tax documents",
      color: "border-zk-green",
      impact: "2B people without legal ID"
    },
    {
      icon: "🔐",
      title: "Private DeFi & Trading",
      description: "Execute trades, provide liquidity, and access lending markets without exposing positions, balances, or trading strategies to the public.",
      example: "Access DeFi lending with private collateral amounts and borrowing history",
      color: "border-zk-cyan",
      impact: "$100B+ DeFi TVL"
    },
    {
      icon: "🏛️",
      title: "Regulatory Reporting",
      description: "Prove compliance with regulations (tax thresholds, sanctions, AML) while minimizing unnecessary data disclosure to third parties.",
      example: "Prove tax bracket compliance without revealing exact income to service providers",
      color: "border-stellar-purple",
      impact: "Every regulated institution"
    },
    {
      icon: "⛓️",
      title: "Multi-Chain Interoperability",
      description: "Prove state or ownership on one chain while executing actions on another. Bridge assets and data privately across Stellar, Ethereum, and L2s.",
      example: "Prove Stellar asset ownership to unlock Ethereum features without bridge exposure",
      color: "border-stellar-blue",
      impact: "$20B+ cross-chain volume"
    }
  ]

  return (
    <section id="use-cases" className="py-20 px-4 bg-gradient-to-b from-stellar-dark to-black">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Built for <span className="text-gradient">Real-World Impact</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Privacy infrastructure solving actual problems for financial institutions, developers, and 3.7 billion underserved users worldwide
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {useCases.map((useCase, idx) => (
            <div
              key={idx}
              className={`p-8 rounded-xl border-2 ${useCase.color} bg-gradient-to-br from-stellar-dark to-black hover:scale-105 transition-all duration-300 group`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="text-6xl group-hover:scale-110 transition-transform">{useCase.icon}</div>
                <span className="text-xs px-3 py-1 bg-zk-green bg-opacity-20 border border-zk-green rounded-full text-zk-green font-semibold">
                  {useCase.impact}
                </span>
              </div>
              <h3 className="text-2xl font-bold mb-3">{useCase.title}</h3>
              <p className="text-gray-300 mb-4 leading-relaxed">{useCase.description}</p>
              <div className="mt-4 p-4 rounded-lg bg-black bg-opacity-50 border-l-4 border-stellar-purple">
                <p className="text-sm text-gray-400">
                  <span className="font-semibold text-stellar-purple">Use Case:</span> {useCase.example}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Market Opportunity */}
        <div className="mt-16 p-8 rounded-xl border-2 border-zk-green bg-gradient-to-br from-zk-green to-stellar-blue bg-opacity-10">
          <div className="text-center">
            <h3 className="text-3xl font-bold mb-6">Why Privacy Matters Now</h3>
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <div className="text-4xl mb-3">📈</div>
                <div className="text-3xl font-bold text-zk-green mb-2">$500B+</div>
                <p className="text-gray-400">Addressable market for privacy tech in finance (2024-2030)</p>
              </div>
              <div>
                <div className="text-4xl mb-3">🏦</div>
                <div className="text-3xl font-bold text-stellar-blue mb-2">73%</div>
                <p className="text-gray-400">Of financial institutions cite privacy as #1 barrier to blockchain adoption</p>
              </div>
              <div>
                <div className="text-4xl mb-3">⚡</div>
                <div className="text-3xl font-bold text-stellar-purple mb-2">2025</div>
                <p className="text-gray-400">Expected mass adoption of ZK privacy tech in TradFi and DeFi</p>
              </div>
            </div>
          </div>
        </div>

        {/* Call to action */}
        <div className="mt-16 text-center p-8 rounded-xl border-2 border-stellar-purple bg-gradient-to-br from-stellar-dark to-black glow-box">
          <h3 className="text-3xl font-bold mb-4">Build the Future of Private Finance</h3>
          <p className="text-xl text-gray-400 mb-6 max-w-2xl mx-auto">
            Join developers and institutions building privacy-first applications on Stellar
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://github.com/xcapit/openzktool"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-stellar-purple hover:bg-opacity-80 rounded-lg font-semibold transition-all text-white"
            >
              🚀 Get Started
            </a>
            <a
              href="https://github.com/xcapit/openzktool/blob/main/ROADMAP.md"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 border border-zk-green hover:bg-zk-green hover:bg-opacity-20 rounded-lg font-semibold transition-all text-white"
            >
              📋 View Roadmap
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
