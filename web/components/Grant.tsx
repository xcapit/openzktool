export default function Grant() {
  return (
    <section id="grant" className="py-20 px-4 bg-gradient-to-b from-black to-stellar-dark">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-gradient">Grant Proposal</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Building the future of privacy-preserving finance with Stellar Community Fund support
          </p>
        </div>

        {/* Main Grant Card */}
        <div className="mb-12 p-8 rounded-xl border-2 border-stellar-purple bg-gradient-to-br from-stellar-dark to-black glow-box">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="text-7xl">📋</div>
            <div className="flex-1 text-center md:text-left">
              <div className="inline-block px-4 py-2 mb-4 bg-stellar-blue bg-opacity-20 border border-stellar-blue rounded-full">
                <span className="text-stellar-blue font-semibold">Stellar Community Fund #40</span>
              </div>
              <h3 className="text-3xl font-bold mb-2">Build Award Proposal</h3>
              <p className="text-xl text-gray-300 mb-4">
                Infrastructure & Services / Developer Tools
              </p>
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <div className="px-4 py-2 bg-stellar-purple bg-opacity-20 rounded-lg">
                  <span className="text-stellar-purple font-semibold">⏱️ 6 Months</span>
                </div>
                <div className="px-4 py-2 bg-zk-green bg-opacity-20 rounded-lg">
                  <span className="text-zk-green font-semibold">🔐 Privacy SDK</span>
                </div>
                <div className="px-4 py-2 bg-stellar-blue bg-opacity-20 rounded-lg">
                  <span className="text-stellar-blue font-semibold">🏦 TradFi Focus</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tranche Structure */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold mb-6 text-center">Development Timeline</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Tranche 1 */}
            <div className="p-6 rounded-xl border-2 border-stellar-purple bg-stellar-dark hover:border-zk-green transition-all duration-300">
              <div className="text-4xl mb-4">🔨</div>
              <h4 className="text-xl font-bold mb-2 text-stellar-purple">Tranche 1</h4>
              <p className="text-gray-400 text-sm mb-4">Months 1-5</p>
              <h5 className="font-semibold mb-3">MVP Development</h5>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-zk-green">✓</span>
                  <span>Production ZK Circuits</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-zk-green">✓</span>
                  <span>Soroban Smart Contracts</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-zk-green">✓</span>
                  <span>JavaScript/TypeScript SDK</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-zk-green">✓</span>
                  <span>Complete Documentation</span>
                </li>
              </ul>
            </div>

            {/* Tranche 2 */}
            <div className="p-6 rounded-xl border-2 border-stellar-blue bg-stellar-dark hover:border-zk-green transition-all duration-300">
              <div className="text-4xl mb-4">🏦</div>
              <h4 className="text-xl font-bold mb-2 text-stellar-blue">Tranche 2</h4>
              <p className="text-gray-400 text-sm mb-4">Month 6</p>
              <h5 className="font-semibold mb-3">Testnet & Pilots</h5>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-zk-green">✓</span>
                  <span>2 Pilot Partners Integration</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-zk-green">✓</span>
                  <span>Banking Integration Layer</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-zk-green">✓</span>
                  <span>Compliance Dashboard</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-zk-green">✓</span>
                  <span>Security Audit</span>
                </li>
              </ul>
            </div>

            {/* Tranche 3 */}
            <div className="p-6 rounded-xl border-2 border-zk-green bg-stellar-dark hover:border-stellar-purple transition-all duration-300">
              <div className="text-4xl mb-4">🚀</div>
              <h4 className="text-xl font-bold mb-2 text-zk-green">Tranche 3</h4>
              <p className="text-gray-400 text-sm mb-4">Month 6</p>
              <h5 className="font-semibold mb-3">Mainnet Launch</h5>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-zk-green">✓</span>
                  <span>Mainnet Deployment</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-zk-green">✓</span>
                  <span>Production Release</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-zk-green">✓</span>
                  <span>5+ Partner Onboarding</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-zk-green">✓</span>
                  <span>Ongoing Support</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Impact & Goals */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Success Criteria */}
          <div className="p-6 rounded-xl border-2 border-stellar-purple bg-gradient-to-br from-stellar-purple to-stellar-blue bg-opacity-5">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <span className="text-3xl">🎯</span>
              <span>Success Criteria</span>
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="text-zk-green text-xl mt-1">✓</span>
                <div>
                  <p className="font-semibold">Production-Ready SDK</p>
                  <p className="text-sm text-gray-400">Complete ZK circuits, contracts, and documentation</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-zk-green text-xl mt-1">✓</span>
                <div>
                  <p className="font-semibold">Partner Adoption</p>
                  <p className="text-sm text-gray-400">5+ mainnet partners, 2 testnet pilots</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-zk-green text-xl mt-1">✓</span>
                <div>
                  <p className="font-semibold">Security Audited</p>
                  <p className="text-sm text-gray-400">Independent audit of circuits and contracts</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-zk-green text-xl mt-1">✓</span>
                <div>
                  <p className="font-semibold">Compliance Ready</p>
                  <p className="text-sm text-gray-400">Banking integration and audit layer functional</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Impact */}
          <div className="p-6 rounded-xl border-2 border-zk-green bg-gradient-to-br from-zk-green to-stellar-blue bg-opacity-5">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <span className="text-3xl">💎</span>
              <span>Impact on Stellar</span>
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="text-stellar-purple text-xl mt-1">🏦</span>
                <div>
                  <p className="font-semibold">Institutional Adoption</p>
                  <p className="text-sm text-gray-400">Enable TradFi to use Stellar for private transactions</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-stellar-purple text-xl mt-1">📈</span>
                <div>
                  <p className="font-semibold">Network Growth</p>
                  <p className="text-sm text-gray-400">Increase transaction volume and liquidity</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-stellar-purple text-xl mt-1">🔐</span>
                <div>
                  <p className="font-semibold">Compliance Feature</p>
                  <p className="text-sm text-gray-400">Privacy + auditability as competitive advantage</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-stellar-purple text-xl mt-1">🌐</span>
                <div>
                  <p className="font-semibold">Ecosystem Leadership</p>
                  <p className="text-sm text-gray-400">Position Stellar as privacy-first blockchain</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center p-8 rounded-xl border-2 border-stellar-purple bg-gradient-to-r from-stellar-purple to-stellar-blue bg-opacity-10">
          <h3 className="text-2xl font-bold mb-4">Support Our Proposal</h3>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Help us build privacy infrastructure for the future of finance on Stellar. Join the discussion and share your feedback.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://github.com/xcapit/stellar-privacy-poc"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-stellar-purple hover:bg-opacity-80 rounded-lg font-semibold transition-all glow-box text-white"
            >
              View on GitHub
            </a>
            <a
              href="https://github.com/xcapit/stellar-privacy-poc/discussions"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 border-2 border-stellar-purple hover:bg-stellar-purple hover:bg-opacity-20 rounded-lg font-semibold transition-all text-white"
            >
              Join Discussion
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
