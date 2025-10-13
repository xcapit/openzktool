export default function Interoperability() {
  const chains = [
    {
      name: "Soroban (Stellar)",
      logo: "⭐",
      features: ["Native multi-asset", "Low fees", "Fast finality (~5s)", "Rust verifier"],
      status: "live",
      color: "from-stellar-purple to-stellar-blue"
    },
    {
      name: "Ethereum",
      logo: "◆",
      features: ["Solidity verifier", "~250k gas cost", "Battle-tested", "Full EVM support"],
      status: "live",
      color: "from-stellar-blue to-zk-cyan"
    },
    {
      name: "Polygon",
      logo: "🟣",
      features: ["Low gas fees", "EVM compatible", "High throughput", "Same verifier as ETH"],
      status: "live",
      color: "from-purple-500 to-purple-700"
    },
    {
      name: "BSC",
      logo: "🟡",
      features: ["Fast blocks", "EVM compatible", "Low latency", "Wide adoption"],
      status: "live",
      color: "from-yellow-500 to-yellow-700"
    },
    {
      name: "Arbitrum",
      logo: "🔵",
      features: ["L2 scaling", "Lower fees", "ETH security", "EVM compatible"],
      status: "coming-soon",
      color: "from-blue-500 to-blue-700"
    },
    {
      name: "Optimism",
      logo: "🔴",
      features: ["L2 optimistic", "Low costs", "ETH security", "EVM compatible"],
      status: "coming-soon",
      color: "from-red-500 to-red-700"
    }
  ]

  return (
    <section id="interoperability" className="py-20 px-4 bg-gradient-to-b from-black to-stellar-dark">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            True <span className="text-gradient">Interoperability</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            One SDK, multiple chains. Generate proofs once, verify anywhere.
            Seamless integration across EVM and non-EVM ecosystems.
          </p>
        </div>

        {/* Interoperability diagram */}
        <div className="mb-16 text-center">
          <div className="inline-block p-8 border-2 border-stellar-purple rounded-2xl glow-box bg-stellar-dark">
            <div className="text-6xl mb-4">🔐</div>
            <div className="text-xl font-bold mb-2 text-gradient">Single ZK Proof</div>
            <div className="text-gray-400">Generated once with Groth16</div>
          </div>

          <div className="my-8">
            <svg className="w-full h-16" viewBox="0 0 400 60">
              <line x1="200" y1="10" x2="50" y2="50" stroke="#7B61FF" strokeWidth="2" strokeDasharray="5,5" />
              <line x1="200" y1="10" x2="150" y2="50" stroke="#00D1FF" strokeWidth="2" strokeDasharray="5,5" />
              <line x1="200" y1="10" x2="250" y2="50" stroke="#00FF94" strokeWidth="2" strokeDasharray="5,5" />
              <line x1="200" y1="10" x2="350" y2="50" stroke="#7B61FF" strokeWidth="2" strokeDasharray="5,5" />
            </svg>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="p-4 border border-stellar-purple rounded-lg bg-black">
              <div className="text-3xl mb-2">⭐</div>
              <div className="font-bold">Soroban</div>
            </div>
            <div className="p-4 border border-stellar-blue rounded-lg bg-black">
              <div className="text-3xl mb-2">◆</div>
              <div className="font-bold">Ethereum</div>
            </div>
            <div className="p-4 border border-zk-green rounded-lg bg-black">
              <div className="text-3xl mb-2">🟣</div>
              <div className="font-bold">Polygon</div>
            </div>
            <div className="p-4 border border-stellar-purple rounded-lg bg-black">
              <div className="text-3xl mb-2">🔵</div>
              <div className="font-bold">L2s</div>
            </div>
          </div>
        </div>

        {/* Supported chains grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {chains.map((chain, idx) => (
            <div
              key={idx}
              className="p-6 rounded-xl border-2 border-gray-700 bg-gradient-to-br from-stellar-dark to-black hover:border-stellar-purple transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="text-4xl">{chain.logo}</div>
                  <h3 className="text-xl font-bold">{chain.name}</h3>
                </div>
                {chain.status === "live" ? (
                  <span className="px-3 py-1 bg-zk-green bg-opacity-20 text-zk-green text-sm rounded-full border border-zk-green">
                    Live
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-gray-700 text-gray-400 text-sm rounded-full border border-gray-600">
                    Soon
                  </span>
                )}
              </div>

              <ul className="space-y-2">
                {chain.features.map((feature, fIdx) => (
                  <li key={fIdx} className="flex items-center gap-2 text-gray-400">
                    <span className="text-stellar-purple">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
