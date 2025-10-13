export default function Footer() {
  return (
    <footer className="py-12 px-4 bg-black border-t border-gray-800">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="col-span-2">
            <h3 className="text-2xl font-bold mb-4 text-gradient">🔐 OpenZKTool</h3>
            <p className="text-gray-400 mb-4 max-w-md">
              Interoperable zero-knowledge privacy toolkit for multi-chain KYC compliance and privacy-preserving applications.
            </p>
            <div className="flex gap-4">
              <a
                href="https://github.com/xcapit/stellar-privacy-poc"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-stellar-purple transition-colors"
                aria-label="GitHub"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
              <a
                href="https://twitter.com/XcapitOfficial"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-stellar-blue transition-colors"
                aria-label="Twitter"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-lg font-bold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li>
                <a href="https://github.com/xcapit/stellar-privacy-poc" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-stellar-purple transition-colors">
                  Documentation
                </a>
              </li>
              <li>
                <a href="https://github.com/xcapit/stellar-privacy-poc#-quick-start" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-stellar-purple transition-colors">
                  Quick Start
                </a>
              </li>
              <li>
                <a href="https://github.com/xcapit/stellar-privacy-poc/tree/main/circuits" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-stellar-purple transition-colors">
                  Circuit Examples
                </a>
              </li>
              <li>
                <a href="https://docs.circom.io/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-stellar-purple transition-colors">
                  Circom Docs
                </a>
              </li>
              <li>
                <a href="https://zkp.science" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-stellar-purple transition-colors">
                  ZK Learning
                </a>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h4 className="text-lg font-bold mb-4">Community</h4>
            <ul className="space-y-2">
              <li>
                <a href="https://github.com/xcapit/stellar-privacy-poc/issues" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-stellar-purple transition-colors">
                  GitHub Issues
                </a>
              </li>
              <li>
                <a href="https://github.com/xcapit/stellar-privacy-poc/discussions" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-stellar-purple transition-colors">
                  Discussions
                </a>
              </li>
              <li>
                <a href="https://xcapit.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-stellar-purple transition-colors">
                  Xcapit Labs
                </a>
              </li>
              <li>
                <a href="https://twitter.com/XcapitOfficial" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-stellar-purple transition-colors">
                  Twitter
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">
            © 2025 <a href="https://xcapit.com" target="_blank" rel="noopener noreferrer" className="hover:text-stellar-purple transition-colors">Xcapit Labs</a> - Team X1
          </p>

          <div className="flex items-center gap-4 text-sm text-gray-400">
            <a
              href="https://github.com/xcapit/stellar-privacy-poc/blob/main/LICENSE"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-stellar-purple transition-colors"
            >
              AGPL-3.0 License
            </a>
            <span>•</span>
            <span>Built with Circom & Soroban</span>
          </div>
        </div>

        {/* Additional info */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            Powered by <span className="text-stellar-purple">Groth16 SNARKs</span> on <span className="text-stellar-blue">BN254 curve</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
