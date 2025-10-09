export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
      {/* Animated background grid */}
      <div className="absolute inset-0 bg-gradient-to-b from-stellar-dark to-black opacity-50">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(rgba(123, 97, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(123, 97, 255, 0.1) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto text-center">
        {/* Main headline */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="px-4 py-2 border border-stellar-purple rounded-full glow-box">
              <span className="text-stellar-purple font-semibold">🔐 ZKPrivacy</span>
            </div>
            <div className="px-4 py-2 bg-stellar-blue bg-opacity-20 border border-stellar-blue rounded-full">
              <span className="text-stellar-blue font-semibold">📋 SCF #40 Proposal</span>
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Stellar Privacy SDK
            <br />
            <span className="text-gradient">for TradFi Compliance</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Production-ready SDK for privacy-preserving transactions on Stellar using ZK-SNARKs.
            <br />
            <span className="text-stellar-purple">Enable institutions to transact privately while maintaining regulatory compliance.</span>
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <a
            href="https://github.com/xcapit/stellar-privacy-poc"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 bg-stellar-purple hover:bg-opacity-80 rounded-lg font-semibold transition-all glow-box text-white"
          >
            View on GitHub
          </a>
          <a
            href="#features"
            className="px-8 py-4 border border-stellar-purple hover:bg-stellar-purple hover:bg-opacity-20 rounded-lg font-semibold transition-all text-white"
          >
            Explore Features
          </a>
        </div>

        {/* Key metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-zk-green mb-2">~800 bytes</div>
            <div className="text-gray-400">Proof Size</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-stellar-blue mb-2">586</div>
            <div className="text-gray-400">Constraints</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-zk-green mb-2">&lt;50ms</div>
            <div className="text-gray-400">Verification</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-stellar-blue mb-2">Multi-Chain</div>
            <div className="text-gray-400">EVM + Soroban</div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <svg className="w-6 h-6 text-stellar-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  )
}
