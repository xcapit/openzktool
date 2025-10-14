'use client'

import { useState } from 'react'

export default function Demo() {
  const [selectedDemo, setSelectedDemo] = useState<'basic' | 'interactive' | 'automatic'>('basic')

  const demos = {
    basic: {
      title: "🎬 Quick Demo",
      description: "5-minute interactive demonstration",
      command: "./DEMO_COMPLETE.sh",
      features: [
        "Alice's KYC story",
        "Proof generation walkthrough",
        "Local verification (<50ms)",
        "Multi-chain overview"
      ]
    },
    interactive: {
      title: "🎯 Interactive Mode",
      description: "Step-by-step with explanations",
      command: "./DEMO_COMPLETE.sh",
      features: [
        "Pause at each step",
        "Detailed explanations",
        "Technical deep-dive",
        "Perfect for learning"
      ]
    },
    automatic: {
      title: "⚡ Automatic Mode",
      description: "Perfect for presentations",
      command: "DEMO_AUTO=1 ./DEMO_COMPLETE.sh",
      features: [
        "No interaction required",
        "Continuous playback",
        "Professional demos",
        "Time-efficient"
      ]
    }
  }

  const demoSteps = [
    {
      step: 1,
      icon: "⚙️",
      title: "Circuit Setup",
      description: "Compile circuit with 586 constraints",
      time: "~30s"
    },
    {
      step: 2,
      icon: "🔐",
      title: "Proof Generation",
      description: "Alice proves KYC compliance",
      time: "<1s"
    },
    {
      step: 3,
      icon: "✅",
      title: "Local Verification",
      description: "Off-chain proof validation",
      time: "<50ms"
    },
    {
      step: 4,
      icon: "⛓️",
      title: "Multi-Chain",
      description: "EVM + Soroban overview",
      time: "~1min"
    }
  ]

  return (
    <section id="demo" className="py-20 px-4 relative">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 fade-in-up">
          <div className="inline-block mb-4">
            <span className="px-4 py-2 bg-stellar-purple bg-opacity-20 border border-stellar-purple rounded-full text-stellar-purple font-semibold shimmer">
              🎬 NEW: Complete Demo
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            See <span className="text-gradient">OpenZKTool</span> in Action
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Watch a 5-minute demonstration of zero-knowledge proofs in production.
            From proof generation to multi-chain verification.
          </p>
        </div>

        {/* Demo Mode Selector */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {(Object.keys(demos) as Array<keyof typeof demos>).map((key) => {
            const demo = demos[key]
            const isSelected = selectedDemo === key
            return (
              <button
                key={key}
                onClick={() => setSelectedDemo(key)}
                className={`p-6 rounded-xl border-2 transition-all duration-300 text-left hover-lift ${
                  isSelected
                    ? 'border-stellar-purple glass-strong scale-105'
                    : 'border-gray-700 glass hover:border-stellar-purple'
                }`}
              >
                <h3 className="text-2xl font-bold mb-2">{demo.title}</h3>
                <p className="text-gray-400 mb-4">{demo.description}</p>
                <div className="space-y-2">
                  {demo.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm text-gray-500">
                      <span className="text-zk-green">✓</span>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </button>
            )
          })}
        </div>

        {/* Selected Demo Details */}
        <div className="glass-strong rounded-2xl p-8 border-2 border-stellar-purple mb-12 shimmer">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
            <div>
              <h3 className="text-3xl font-bold mb-2">{demos[selectedDemo].title}</h3>
              <p className="text-gray-400">{demos[selectedDemo].description}</p>
            </div>
            <div className="flex gap-4">
              <a
                href="https://github.com/xcapit/openzktool/blob/main/DEMO_README.md"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 glass border border-stellar-blue hover:bg-stellar-blue hover:bg-opacity-20 rounded-lg font-semibold transition-all ripple"
              >
                📖 Quick Start
              </a>
              <a
                href="https://github.com/xcapit/openzktool/blob/main/DEMO_GUIDE_COMPLETE.md"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-stellar-purple hover:bg-opacity-80 rounded-lg font-semibold transition-all glow-box ripple"
              >
                📚 Full Guide
              </a>
            </div>
          </div>

          {/* Command */}
          <div className="bg-black bg-opacity-50 rounded-lg p-4 border border-gray-700 mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-500 uppercase font-mono">Terminal</span>
              <button
                onClick={() => navigator.clipboard.writeText(demos[selectedDemo].command)}
                className="text-xs text-stellar-purple hover:text-stellar-blue transition-colors"
              >
                📋 Copy
              </button>
            </div>
            <code className="text-zk-green font-mono text-lg">{demos[selectedDemo].command}</code>
          </div>

          {/* Demo Flow */}
          <div className="grid md:grid-cols-4 gap-4">
            {demoSteps.map((step, idx) => (
              <div key={idx} className="relative">
                <div className="glass rounded-lg p-4 text-center hover-lift transition-all h-full">
                  <div className="text-4xl mb-3 float-animation">{step.icon}</div>
                  <div className="text-sm text-gray-500 mb-1">Step {step.step}</div>
                  <h4 className="font-bold mb-2">{step.title}</h4>
                  <p className="text-xs text-gray-400 mb-2">{step.description}</p>
                  <span className="text-xs text-zk-green font-mono">{step.time}</span>
                </div>
                {idx < demoSteps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                    <svg className="w-6 h-6 text-stellar-purple" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Alice's Story Preview */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="glass rounded-xl p-8 border border-stellar-blue hover-lift">
            <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
              <span className="text-4xl">👤</span>
              Alice's Challenge
            </h3>
            <div className="space-y-4 text-gray-400">
              <div>
                <div className="font-semibold text-white mb-1">Requirements:</div>
                <ul className="space-y-1 ml-4">
                  <li>✓ Age ≥ 18</li>
                  <li>✓ Balance ≥ $50</li>
                  <li>✓ Allowed country</li>
                </ul>
              </div>
              <div>
                <div className="font-semibold text-white mb-1">Private Data:</div>
                <ul className="space-y-1 ml-4">
                  <li>🔒 Age: 25 (secret)</li>
                  <li>🔒 Balance: $150 (secret)</li>
                  <li>🔒 Country: Argentina (secret)</li>
                </ul>
              </div>
              <div className="pt-4 border-t border-gray-700">
                <p className="text-sm">
                  <span className="text-red-400">Traditional KYC:</span> Reveals all data<br/>
                  <span className="text-zk-green">ZK Proof:</span> Proves compliance without revealing anything!
                </p>
              </div>
            </div>
          </div>

          <div className="glass rounded-xl p-8 border border-zk-green hover-lift">
            <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
              <span className="text-4xl">🎉</span>
              The Result
            </h3>
            <div className="space-y-4">
              <div className="bg-black bg-opacity-50 rounded-lg p-4 border border-gray-700">
                <div className="text-xs text-gray-500 mb-2">Public Output</div>
                <code className="text-zk-green font-mono">kycValid: 1</code>
              </div>
              <div className="space-y-3 text-gray-400">
                <div className="flex items-start gap-3">
                  <span className="text-zk-green text-xl">✓</span>
                  <div>
                    <div className="font-semibold text-white">Privacy Preserved</div>
                    <div className="text-sm">No age, balance, or country revealed</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-zk-green text-xl">✓</span>
                  <div>
                    <div className="font-semibold text-white">Compliance Proven</div>
                    <div className="text-sm">All requirements mathematically verified</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-zk-green text-xl">✓</span>
                  <div>
                    <div className="font-semibold text-white">Multi-Chain Ready</div>
                    <div className="text-sm">Verify on Ethereum, Soroban, or locally</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Prerequisites */}
        <div className="mt-12 glass-strong rounded-xl p-6 border border-gray-700">
          <h4 className="font-bold mb-4 flex items-center gap-2">
            <span className="text-2xl">📋</span>
            Prerequisites
          </h4>
          <div className="grid md:grid-cols-3 gap-6 text-sm">
            <div>
              <div className="font-semibold text-stellar-purple mb-2">Node.js</div>
              <code className="text-xs text-gray-500">v16+ required</code>
              <div className="mt-2 text-gray-400">
                <a href="https://nodejs.org" target="_blank" rel="noopener noreferrer" className="hover:text-stellar-blue transition-colors">
                  Download →
                </a>
              </div>
            </div>
            <div>
              <div className="font-semibold text-stellar-purple mb-2">Circom</div>
              <code className="text-xs text-gray-500">v2.1.9+ required</code>
              <div className="mt-2 text-gray-400">
                <a href="https://docs.circom.io" target="_blank" rel="noopener noreferrer" className="hover:text-stellar-blue transition-colors">
                  Install Guide →
                </a>
              </div>
            </div>
            <div>
              <div className="font-semibold text-stellar-purple mb-2">jq</div>
              <code className="text-xs text-gray-500">For JSON parsing</code>
              <div className="mt-2 text-gray-400">
                <code className="text-xs">brew install jq</code>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
