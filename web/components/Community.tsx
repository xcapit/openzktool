export default function Community() {
  return (
    <section id="community" className="py-20 px-4 bg-gradient-to-b from-stellar-dark to-black">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Build <span className="text-gradient">Together</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-4">
            OpenZKTool is a <span className="text-zk-green font-semibold">Digital Public Good</span> — open source privacy infrastructure for everyone
          </p>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Join developers, institutions, and privacy advocates building multi-chain privacy infrastructure for Web3
          </p>
        </div>

        {/* Main Links Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {/* GitHub */}
          <a
            href="https://github.com/xcapit/openzktool"
            target="_blank"
            rel="noopener noreferrer"
            className="group p-8 rounded-xl border-2 border-gray-700 bg-stellar-dark hover:border-stellar-purple transition-all duration-300 hover:scale-105"
          >
            <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">💻</div>
            <h3 className="text-2xl font-bold mb-3 group-hover:text-stellar-purple transition-colors">GitHub</h3>
            <p className="text-gray-400 mb-4">
              Explore the code, report issues, and contribute to the open-source project
            </p>
            <div className="flex items-center gap-2 text-stellar-purple">
              <span>View Repository</span>
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </a>

          {/* Discussions */}
          <a
            href="https://github.com/xcapit/openzktool/discussions"
            target="_blank"
            rel="noopener noreferrer"
            className="group p-8 rounded-xl border-2 border-gray-700 bg-stellar-dark hover:border-stellar-blue transition-all duration-300 hover:scale-105"
          >
            <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">💬</div>
            <h3 className="text-2xl font-bold mb-3 group-hover:text-stellar-blue transition-colors">Discussions</h3>
            <p className="text-gray-400 mb-4">
              Ask questions, share ideas, and engage with the community
            </p>
            <div className="flex items-center gap-2 text-stellar-blue">
              <span>Join Discussion</span>
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </a>

          {/* Twitter */}
          <a
            href="https://twitter.com/xcapit_"
            target="_blank"
            rel="noopener noreferrer"
            className="group p-8 rounded-xl border-2 border-gray-700 bg-stellar-dark hover:border-zk-green transition-all duration-300 hover:scale-105"
          >
            <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">🐦</div>
            <h3 className="text-2xl font-bold mb-3 group-hover:text-zk-green transition-colors">Twitter</h3>
            <p className="text-gray-400 mb-4">
              Follow for updates, announcements, and ecosystem news
            </p>
            <div className="flex items-center gap-2 text-zk-green">
              <span>Follow @xcapit_</span>
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </a>

          {/* LinkedIn */}
          <a
            href="https://linkedin.com/company/xcapit"
            target="_blank"
            rel="noopener noreferrer"
            className="group p-8 rounded-xl border-2 border-gray-700 bg-stellar-dark hover:border-stellar-purple transition-all duration-300 hover:scale-105"
          >
            <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">💼</div>
            <h3 className="text-2xl font-bold mb-3 group-hover:text-stellar-purple transition-colors">LinkedIn</h3>
            <p className="text-gray-400 mb-4">
              Connect professionally and follow Xcapit Labs
            </p>
            <div className="flex items-center gap-2 text-stellar-purple">
              <span>Connect on LinkedIn</span>
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </a>

          {/* Xcapit Website */}
          <a
            href="https://xcapit.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group p-8 rounded-xl border-2 border-gray-700 bg-stellar-dark hover:border-stellar-blue transition-all duration-300 hover:scale-105"
          >
            <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">🌐</div>
            <h3 className="text-2xl font-bold mb-3 group-hover:text-stellar-blue transition-colors">Xcapit Labs</h3>
            <p className="text-gray-400 mb-4">
              Learn more about the team behind OpenZKTool
            </p>
            <div className="flex items-center gap-2 text-stellar-blue">
              <span>Visit Xcapit.com</span>
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </a>

          {/* Email Contact */}
          <a
            href="mailto:fer@xcapit.com"
            className="group p-8 rounded-xl border-2 border-gray-700 bg-stellar-dark hover:border-zk-green transition-all duration-300 hover:scale-105"
          >
            <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">📧</div>
            <h3 className="text-2xl font-bold mb-3 group-hover:text-zk-green transition-colors">Email</h3>
            <p className="text-gray-400 mb-4">
              Reach out for partnerships, questions, or collaboration
            </p>
            <div className="flex items-center gap-2 text-zk-green">
              <span>fer@xcapit.com</span>
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </a>
        </div>

        {/* Contribute Section */}
        <div className="p-8 rounded-xl border-2 border-stellar-purple bg-gradient-to-br from-stellar-purple to-stellar-blue bg-opacity-10 mb-12">
          <h3 className="text-3xl font-bold mb-6 text-center">Ways to Contribute</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6">
              <div className="text-4xl mb-4">🔧</div>
              <h4 className="font-bold mb-2">Code Contributions</h4>
              <p className="text-sm text-gray-400">
                Submit PRs, fix bugs, add features, improve documentation
              </p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl mb-4">🐛</div>
              <h4 className="font-bold mb-2">Report Issues</h4>
              <p className="text-sm text-gray-400">
                Found a bug or have a feature request? Let us know on GitHub
              </p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl mb-4">📣</div>
              <h4 className="font-bold mb-2">Spread the Word</h4>
              <p className="text-sm text-gray-400">
                Share the project, write about it, and help grow the community
              </p>
            </div>
          </div>
        </div>

        {/* Open Source */}
        <div className="text-center p-8 rounded-xl border-2 border-zk-green bg-gradient-to-br from-zk-green to-stellar-blue bg-opacity-10">
          <div className="text-5xl mb-4">⚖️</div>
          <h3 className="text-2xl font-bold mb-3">Open Source & Free</h3>
          <p className="text-gray-400 mb-4 max-w-2xl mx-auto">
            OpenZKTool is licensed under <span className="text-zk-green font-semibold">AGPL-3.0</span>, ensuring the ecosystem remains open and accessible to everyone.
          </p>
          <a
            href="https://github.com/xcapit/openzktool/blob/main/LICENSE"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 border-2 border-zk-green rounded-lg hover:bg-zk-green hover:bg-opacity-20 transition-all text-zk-green font-semibold"
          >
            <span>View License</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
}
