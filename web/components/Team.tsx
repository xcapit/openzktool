export default function Team() {
  const team = [
    {
      name: "Fernando Boiero",
      role: "Project Lead & Cryptography Advisor",
      emoji: "🦉",
      animalName: "Wise Owl",
      color: "bg-stellar-purple",
      responsibilities: "Architecture, circuit design, security strategy",
      linkedin: "https://www.linkedin.com/in/fboiero/"
    },
    {
      name: "Maximiliano César Nivoli",
      role: "Soroban Contract Lead",
      emoji: "🦀",
      animalName: "Rust Crab",
      color: "bg-stellar-blue",
      responsibilities: "Rust contracts, verification logic, gas optimization"
    },
    {
      name: "Francisco Anuar Ardúh",
      role: "ZK Circuit / Cryptographer",
      emoji: "🦊",
      animalName: "Clever Fox",
      color: "bg-zk-green",
      responsibilities: "Circom circuits, optimization, formal verification"
    },
    {
      name: "Joel Edgar Dellamaggiore Kuns",
      role: "ZKP Proof Specialist",
      emoji: "🐺",
      animalName: "Wolf Pack Leader",
      color: "bg-yellow-500",
      responsibilities: "Proof generation, WASM/browser support"
    },
    {
      name: "Franco Schillage",
      role: "DevOps & Infrastructure Lead",
      emoji: "🐉",
      animalName: "Infrastructure Dragon",
      color: "bg-red-500",
      responsibilities: "CI/CD, deployment, monitoring, infrastructure"
    },
    {
      name: "Natalia Gatti & Carolina Medina",
      role: "QA Specialists",
      emoji: "🐝",
      animalName: "Quality Bees",
      color: "bg-pink-500",
      responsibilities: "Testing, security, documentation quality"
    }
  ]

  return (
    <section id="team" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Meet <span className="text-gradient">Team X1</span> 🦾
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
            Expert hacker team from Xcapit Labs building the future of privacy-preserving blockchain technology.
            <br />
            <span className="text-sm text-gray-500 italic">Each member represented by their spirit animal 🐾</span>
          </p>

          {/* Team Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-12">
            <div className="p-4 rounded-xl border-2 border-stellar-purple bg-stellar-dark">
              <div className="text-3xl font-bold text-stellar-purple mb-1">6</div>
              <div className="text-sm text-gray-400">Team Members</div>
            </div>
            <div className="p-4 rounded-xl border-2 border-zk-green bg-stellar-dark">
              <div className="text-3xl font-bold text-zk-green mb-1">6+</div>
              <div className="text-sm text-gray-400">Years Blockchain</div>
            </div>
            <div className="p-4 rounded-xl border-2 border-stellar-blue bg-stellar-dark">
              <div className="text-3xl font-bold text-stellar-blue mb-1">PhD</div>
              <div className="text-sm text-gray-400">Cryptography</div>
            </div>
            <div className="p-4 rounded-xl border-2 border-stellar-purple bg-stellar-dark">
              <div className="text-3xl font-bold text-stellar-purple mb-1">🇦🇷</div>
              <div className="text-sm text-gray-400">Argentina</div>
            </div>
          </div>
        </div>

        {/* Team Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {team.map((member, idx) => (
            <div
              key={idx}
              className="p-6 rounded-xl border-2 border-gray-700 bg-stellar-dark hover:border-stellar-purple transition-all duration-300 group"
            >
              <div className="mb-4 flex flex-col items-center">
                <div className={`w-24 h-24 rounded-full flex items-center justify-center border-4 border-gray-700 group-hover:border-zk-green transition-all shadow-lg ${member.color} bg-opacity-20`}>
                  <span className="text-5xl group-hover:scale-110 transition-transform">{member.emoji}</span>
                </div>
                <div className="mt-2 text-xs text-gray-500 group-hover:text-zk-green transition-colors italic">
                  {member.animalName}
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2 text-center">{member.name}</h3>
              <p className="text-stellar-purple font-semibold text-sm mb-3 text-center">{member.role}</p>
              <p className="text-gray-400 text-sm mb-4 text-center">{member.responsibilities}</p>
              {member.linkedin && (
                <div className="flex justify-center">
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-stellar-blue hover:text-stellar-purple transition-colors text-sm"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                    LinkedIn
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Team Strengths */}
        <div className="p-8 rounded-xl border-2 border-stellar-purple bg-gradient-to-br from-stellar-purple to-stellar-blue bg-opacity-10">
          <h3 className="text-2xl font-bold mb-6 text-center">Team Strengths</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-3">🎓</div>
              <h4 className="font-semibold mb-2">Academic Expertise</h4>
              <p className="text-sm text-gray-400">PhD-level cryptography, partnership with UTN</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">🌟</div>
              <h4 className="font-semibold mb-2">Stellar Experience</h4>
              <p className="text-sm text-gray-400">6+ months on Soroban, previous SCF grant</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">🔗</div>
              <h4 className="font-semibold mb-2">Blockchain Veterans</h4>
              <p className="text-sm text-gray-400">6+ years building on Ethereum & Layer 2s</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">🌎</div>
              <h4 className="font-semibold mb-2">Global Focus</h4>
              <p className="text-sm text-gray-400">LATAM expertise, remote-friendly, worldwide reach</p>
            </div>
          </div>

          {/* Previous Success */}
          <div className="mt-8 pt-8 border-t border-gray-600">
            <div className="text-center">
              <h4 className="text-xl font-bold mb-4 text-gradient">Proven Track Record</h4>
              <div className="flex flex-wrap gap-4 justify-center">
                <div className="px-6 py-3 bg-zk-green bg-opacity-20 border border-zk-green rounded-lg">
                  <span className="text-zk-green font-semibold">✅ Previous SCF Grant Recipient</span>
                </div>
                <div className="px-6 py-3 bg-stellar-blue bg-opacity-20 border border-stellar-blue rounded-lg">
                  <span className="text-stellar-blue font-semibold">🚀 Offline Wallet Delivered</span>
                </div>
                <div className="px-6 py-3 bg-stellar-purple bg-opacity-20 border border-stellar-purple rounded-lg">
                  <span className="text-stellar-purple font-semibold">🔬 Academic Partnerships</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
