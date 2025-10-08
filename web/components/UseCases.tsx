export default function UseCases() {
  const useCases = [
    {
      icon: "🏦",
      title: "Privacy-Preserving KYC",
      description: "Prove identity compliance without revealing personal details. Perfect for DeFi, exchanges, and regulated platforms.",
      example: "Age verification: Prove you're 18+ without revealing exact birthdate",
      color: "border-stellar-purple"
    },
    {
      icon: "💰",
      title: "Confidential DeFi",
      description: "Execute financial operations while keeping balances and positions private. Enable compliant privacy in lending, trading, and yield farming.",
      example: "Solvency proof: Access credit without revealing total net worth",
      color: "border-stellar-blue"
    },
    {
      icon: "🌍",
      title: "Geographic Compliance",
      description: "Prove residency or jurisdiction without exposing exact location. Enables geo-restricted services while maintaining privacy.",
      example: "Country verification: Access region-locked features without revealing citizenship",
      color: "border-zk-green"
    },
    {
      icon: "🎫",
      title: "Private Credentials",
      description: "Verify qualifications, memberships, or certifications without revealing the credential itself.",
      example: "Accredited investor status without showing portfolio details",
      color: "border-zk-cyan"
    },
    {
      icon: "🔄",
      title: "Cross-Chain Privacy",
      description: "Maintain privacy across multiple blockchain ecosystems. Prove state on one chain without revealing it on another.",
      example: "Bridge assets between Stellar and Ethereum while keeping amounts private",
      color: "border-stellar-purple"
    },
    {
      icon: "🏛️",
      title: "Regulatory Reporting",
      description: "Comply with regulations while minimizing data exposure. Selective disclosure for audits and compliance.",
      example: "Tax compliance: Prove income threshold without revealing exact earnings",
      color: "border-stellar-blue"
    }
  ]

  return (
    <section id="use-cases" className="py-20 px-4 bg-gradient-to-b from-stellar-dark to-black">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Real-World <span className="text-gradient">Applications</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Build the next generation of privacy-preserving applications across DeFi, identity, compliance, and more
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {useCases.map((useCase, idx) => (
            <div
              key={idx}
              className={`p-8 rounded-xl border-2 ${useCase.color} bg-gradient-to-br from-stellar-dark to-black hover:scale-105 transition-all duration-300`}
            >
              <div className="text-6xl mb-4">{useCase.icon}</div>
              <h3 className="text-2xl font-bold mb-3">{useCase.title}</h3>
              <p className="text-gray-300 mb-4">{useCase.description}</p>
              <div className="mt-4 p-4 rounded-lg bg-black bg-opacity-50 border-l-4 border-stellar-purple">
                <p className="text-sm text-gray-400">
                  <span className="font-semibold text-stellar-purple">Example:</span> {useCase.example}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Call to action */}
        <div className="mt-16 text-center p-8 rounded-xl border-2 border-stellar-purple bg-gradient-to-br from-stellar-dark to-black glow-box">
          <h3 className="text-3xl font-bold mb-4">Ready to Build?</h3>
          <p className="text-xl text-gray-400 mb-6 max-w-2xl mx-auto">
            Start integrating privacy into your application today with our comprehensive SDK and documentation
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://github.com/xcapit/stellar-privacy-poc"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-stellar-purple hover:bg-opacity-80 rounded-lg font-semibold transition-all text-white"
            >
              Get Started
            </a>
            <a
              href="#roadmap"
              className="px-8 py-4 border border-stellar-purple hover:bg-stellar-purple hover:bg-opacity-20 rounded-lg font-semibold transition-all text-white"
            >
              View Roadmap
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
