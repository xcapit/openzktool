export default function Grant() {
  return (
    <section id="grant" className="py-20 px-4 bg-gradient-to-b from-black to-stellar-dark">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-gradient">SCF #40 Grant Proposal</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-4">
            Building the future of privacy-preserving finance with Stellar Community Fund support
          </p>
          <p className="text-lg text-gray-500 italic">
            Zero-Knowledge Proof Toolkit for TradFi — Privacy + Compliance for Institutional Adoption
          </p>
        </div>

        {/* Vision Statement */}
        <div className="mb-12 p-8 rounded-xl border-2 border-stellar-blue bg-gradient-to-br from-stellar-blue to-stellar-purple bg-opacity-5">
          <h3 className="text-2xl font-bold mb-4 text-center">The Vision</h3>
          <p className="text-lg text-gray-300 text-center max-w-4xl mx-auto leading-relaxed">
            Enable retail partners and financial institutions to process <span className="text-stellar-purple font-semibold">private transactions</span> on Stellar using <span className="text-zk-green font-semibold">ZK-SNARKs</span>, while satisfying regulation and audit demands. Bridge the gap between privacy and compliance to unlock institutional adoption and cross-border settlement use cases.
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

        {/* The Problem & Solution */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* The Problem */}
          <div className="p-8 rounded-xl border-2 border-red-500 bg-gradient-to-br from-red-900 to-stellar-dark bg-opacity-20">
            <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
              <span className="text-3xl">⚠️</span>
              <span>The Problem</span>
            </h3>
            <p className="text-gray-300 mb-4 leading-relaxed">
              Ecosystem partners, retail, and financial institutions face a <span className="text-red-400 font-semibold">critical barrier</span> to adopting public blockchains:
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-red-400 text-xl mt-1">×</span>
                <div>
                  <p className="font-semibold">Lack of Transaction Privacy</p>
                  <p className="text-sm text-gray-400">Every balance, counterparty, and amount is publicly visible</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-400 text-xl mt-1">×</span>
                <div>
                  <p className="font-semibold">Business Data Exposure</p>
                  <p className="text-sm text-gray-400">Sensitive commercial information leaked on-chain</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-400 text-xl mt-1">×</span>
                <div>
                  <p className="font-semibold">Regulatory Barriers</p>
                  <p className="text-sm text-gray-400">Privacy protocols must meet compliance standards</p>
                </div>
              </li>
            </ul>
          </div>

          {/* The Solution */}
          <div className="p-8 rounded-xl border-2 border-zk-green bg-gradient-to-br from-zk-green to-stellar-blue bg-opacity-10">
            <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
              <span className="text-3xl">✅</span>
              <span>The Solution</span>
            </h3>
            <p className="text-gray-300 mb-4 leading-relaxed">
              The <span className="text-zk-green font-semibold">Stellar Privacy SDK</span> uses Zero-Knowledge Proofs (ZK-SNARKs) to enable:
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-zk-green text-xl mt-1">✓</span>
                <div>
                  <p className="font-semibold">Private Transactions</p>
                  <p className="text-sm text-gray-400">Hidden amounts, balances, and counterparties on-chain</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-zk-green text-xl mt-1">✓</span>
                <div>
                  <p className="font-semibold">Regulatory Transparency</p>
                  <p className="text-sm text-gray-400">Full disclosure to authorized auditors</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-zk-green text-xl mt-1">✓</span>
                <div>
                  <p className="font-semibold">Developer-Ready SDK</p>
                  <p className="text-sm text-gray-400">Integration in hours, not months</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Products & Services */}
        <div className="mb-12 p-8 rounded-xl border-2 border-stellar-purple bg-gradient-to-br from-stellar-dark to-black">
          <h3 className="text-3xl font-bold mb-6 text-center">Products & Services</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 rounded-lg bg-gradient-to-br from-stellar-purple to-transparent bg-opacity-10 border border-stellar-purple">
              <div className="flex items-start gap-4">
                <div className="text-3xl">🔧</div>
                <div>
                  <h4 className="font-bold mb-2">ZK Circuits (Circom)</h4>
                  <p className="text-sm text-gray-400">Prebuilt, audited circuits for private transfers, balance proofs, and counterparty masking</p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-lg bg-gradient-to-br from-stellar-blue to-transparent bg-opacity-10 border border-stellar-blue">
              <div className="flex items-start gap-4">
                <div className="text-3xl">⛓️</div>
                <div>
                  <h4 className="font-bold mb-2">Soroban Verification Contracts</h4>
                  <p className="text-sm text-gray-400">Smart contracts on Soroban to verify ZK proofs on-chain (Rust)</p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-lg bg-gradient-to-br from-zk-green to-transparent bg-opacity-10 border border-zk-green">
              <div className="flex items-start gap-4">
                <div className="text-3xl">📚</div>
                <div>
                  <h4 className="font-bold mb-2">JavaScript/TypeScript SDK</h4>
                  <p className="text-sm text-gray-400">Easy-to-use SDK for front-end/back-end devs to generate proofs and integrate</p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-lg bg-gradient-to-br from-stellar-purple to-transparent bg-opacity-10 border border-stellar-purple">
              <div className="flex items-start gap-4">
                <div className="text-3xl">🏦</div>
                <div>
                  <h4 className="font-bold mb-2">Banking Integration Layer</h4>
                  <p className="text-sm text-gray-400">Adapters for institutions (KYC/AML/audit disclosures)</p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-lg bg-gradient-to-br from-stellar-blue to-transparent bg-opacity-10 border border-stellar-blue">
              <div className="flex items-start gap-4">
                <div className="text-3xl">📊</div>
                <div>
                  <h4 className="font-bold mb-2">Compliance Dashboard</h4>
                  <p className="text-sm text-gray-400">Dashboard for institutions and auditors (audit trails, verification status)</p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-lg bg-gradient-to-br from-zk-green to-transparent bg-opacity-10 border border-zk-green">
              <div className="flex items-start gap-4">
                <div className="text-3xl">🔒</div>
                <div>
                  <h4 className="font-bold mb-2">Security Audit & Documentation</h4>
                  <p className="text-sm text-gray-400">Independent audit of circuits & contracts; complete documentation</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* POC Status */}
        <div className="mb-12 p-8 rounded-xl border-2 border-zk-green bg-gradient-to-br from-zk-green to-stellar-blue bg-opacity-10">
          <h3 className="text-3xl font-bold mb-6 text-center flex items-center justify-center gap-3">
            <span className="text-4xl">✅</span>
            <span>Proof of Concept — Complete</span>
          </h3>

          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h4 className="font-bold mb-3 text-zk-green">What's Implemented</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-zk-green">✓</span>
                  <span>ZK circuit (Circom) generating valid proofs</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-zk-green">✓</span>
                  <span>Soroban contract verifying proofs</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-zk-green">✓</span>
                  <span>SDK connecting components</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-zk-green">✓</span>
                  <span>Web demo showing flow</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-zk-green">✓</span>
                  <span>Complete documentation</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-3 text-stellar-blue">Performance</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-stellar-blue">⚡</span>
                  <span>Proof generation: &lt;1 second</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-stellar-blue">⚡</span>
                  <span>Circuit constraints: ~100 (very efficient)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-stellar-blue">⚡</span>
                  <span>Contract deployed on testnet</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-stellar-blue">⚡</span>
                  <span>End-to-end flow works</span>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-3 text-stellar-purple">What This Proves</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-stellar-purple">✓</span>
                  <span>Technical approach viable</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-stellar-purple">✓</span>
                  <span>Performance acceptable</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-stellar-purple">✓</span>
                  <span>Integration possible</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-stellar-purple">✓</span>
                  <span>Ready to scale to production</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="text-center">
            <a
              href="https://github.com/xcapit/stellar-privacy-poc"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-zk-green text-black rounded-lg hover:bg-opacity-80 transition-all font-semibold"
            >
              <span>View POC on GitHub</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
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

        {/* Go-to-Market Plan */}
        <div className="mb-12 p-8 rounded-xl border-2 border-stellar-blue bg-gradient-to-br from-stellar-dark to-black">
          <h3 className="text-3xl font-bold mb-6 text-center">Go-to-Market Strategy</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 rounded-lg bg-gradient-to-br from-stellar-purple to-transparent bg-opacity-10 border border-stellar-purple">
              <div className="text-4xl mb-4">🎯</div>
              <h4 className="font-bold mb-2">1. Pilot Partners</h4>
              <p className="text-sm text-gray-400">Onboard 2 prospect partners (payment providers) already willing to run on testnet</p>
            </div>

            <div className="p-6 rounded-lg bg-gradient-to-br from-stellar-blue to-transparent bg-opacity-10 border border-stellar-blue">
              <div className="text-4xl mb-4">🚀</div>
              <h4 className="font-bold mb-2">2. Open Developer Beta</h4>
              <p className="text-sm text-gray-400">Release SDK + contracts publicly with complete documentation</p>
            </div>

            <div className="p-6 rounded-lg bg-gradient-to-br from-zk-green to-transparent bg-opacity-10 border border-zk-green">
              <div className="text-4xl mb-4">🏛️</div>
              <h4 className="font-bold mb-2">3. Regulator Engagement</h4>
              <p className="text-sm text-gray-400">Partner with compliance companies to meet legal/regulatory requirements</p>
            </div>

            <div className="p-6 rounded-lg bg-gradient-to-br from-stellar-purple to-transparent bg-opacity-10 border border-stellar-purple">
              <div className="text-4xl mb-4">📚</div>
              <h4 className="font-bold mb-2">4. Technical Marketing</h4>
              <p className="text-sm text-gray-400">Produce tutorials, reference apps, audit reports, case studies</p>
            </div>

            <div className="p-6 rounded-lg bg-gradient-to-br from-stellar-blue to-transparent bg-opacity-10 border border-stellar-blue">
              <div className="text-4xl mb-4">🌟</div>
              <h4 className="font-bold mb-2">5. Mainnet Launch</h4>
              <p className="text-sm text-gray-400">Deploy contracts, support partners going live, monitor and iterate</p>
            </div>

            <div className="p-6 rounded-lg bg-gradient-to-br from-zk-green to-transparent bg-opacity-10 border border-zk-green">
              <div className="text-4xl mb-4">📈</div>
              <h4 className="font-bold mb-2">Adoption Target</h4>
              <p className="text-sm text-gray-400 font-semibold">5+ partners on mainnet within first 3 months</p>
            </div>
          </div>
        </div>

        {/* Traction Evidence */}
        <div className="mb-12 p-8 rounded-xl border-2 border-zk-green bg-gradient-to-br from-zk-green to-stellar-blue bg-opacity-10">
          <h3 className="text-3xl font-bold mb-6 text-center">Traction & Credibility</h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-bold mb-4 text-lg flex items-center gap-2">
                <span className="text-zk-green text-2xl">✅</span>
                <span>Proven Track Record</span>
              </h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-zk-green text-xl mt-1">🏆</span>
                  <div>
                    <p className="font-semibold">Previous SCF Grant</p>
                    <p className="text-sm text-gray-400">Xcapit delivered Offline Wallet via earlier SCF funding, successfully deployed on Stellar</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-stellar-blue text-xl mt-1">⛓️</span>
                  <div>
                    <p className="font-semibold">Stellar/Soroban Experience</p>
                    <p className="text-sm text-gray-400">6+ months building on Stellar/Soroban; 6 years on Ethereum</p>
                  </div>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4 text-lg flex items-center gap-2">
                <span className="text-stellar-purple text-2xl">🎓</span>
                <span>Academic & Industry Backing</span>
              </h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-stellar-purple text-xl mt-1">🔬</span>
                  <div>
                    <p className="font-semibold">Academic Partnerships</p>
                    <p className="text-sm text-gray-400">UTN (Universidad Tecnológica Nacional) including cryptography expertise; team includes PhD</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-zk-green text-xl mt-1">💼</span>
                  <div>
                    <p className="font-semibold">Industry Credibility</p>
                    <p className="text-sm text-gray-400">Demonstrated fintech capability, regulatory awareness, open source, LATAM institutional relations</p>
                  </div>
                </li>
              </ul>
            </div>
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
