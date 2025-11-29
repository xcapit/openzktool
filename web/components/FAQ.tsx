'use client'

import { useState } from 'react'

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const faqs = [
    {
      question: "What is OpenZKTool?",
      answer: "OpenZKTool is an open-source toolkit for building privacy-preserving applications using zero-knowledge proofs. It enables developers to generate and verify proofs on multiple blockchains (Stellar Soroban and Ethereum/EVM) without requiring deep cryptography expertise. Think of it as the easiest way to add privacy features to your dApp."
    },
    {
      question: "How does it work?",
      answer: "OpenZKTool uses zk-SNARKs (specifically Groth16) to generate cryptographic proofs. You write a circuit in Circom that defines what you want to prove (e.g., age > 18), feed it private inputs (your actual age), and get a tiny proof (~800 bytes) that can be verified on-chain or off-chain. The verifier learns NOTHING about your actual data - only that the statement is true."
    },
    {
      question: "Which blockchains are supported?",
      answer: "Currently: Stellar Soroban (v4 with full BN254 pairing) and all EVM-compatible chains (Ethereum, Polygon, Arbitrum, Optimism, BSC, Base, etc.). The same proof works across all supported chains - generate once, verify anywhere. We're planning to add more chains in future releases."
    },
    {
      question: "Do I need to be a cryptography expert?",
      answer: "No! That's the whole point. While understanding the basics helps, OpenZKTool abstracts the complexity. Our SDK provides simple APIs, pre-built circuits for common use cases (KYC, age verification, solvency proofs), and comprehensive documentation. If you can write JavaScript/TypeScript, you can build with ZK proofs."
    },
    {
      question: "What are the performance characteristics?",
      answer: "OpenZKTool is production-ready: ~800 byte proofs, 586 constraints in our reference circuit, <1 second proof generation, <50ms off-chain verification, ~245k gas on EVM chains, and ~48k compute units on Soroban. These numbers make it viable for real-world applications with high transaction volumes."
    },
    {
      question: "Is it ready for production?",
      answer: "The PoC (Proof of Concept) phase is complete with working implementations on both Ethereum and Soroban. We're currently in the MVP phase, building the SDK and developer tools. For production use, we recommend thorough testing and security audits. The core cryptography (Groth16, Circom) is battle-tested, but your specific circuits should be audited."
    },
    {
      question: "What are typical use cases?",
      answer: "Privacy-preserving KYC/AML compliance, anonymous voting with eligibility proofs, credential verification without sharing records, solvency proofs without revealing balances, cross-border compliance without data transfer, selective identity disclosure, and any scenario where you need to prove something without revealing the underlying data."
    },
    {
      question: "How much does it cost?",
      answer: "OpenZKTool is 100% free and open source under AGPL-3.0. There are no licensing fees, no SaaS subscriptions, and no hidden costs. You only pay for blockchain transaction fees when verifying proofs on-chain. Off-chain verification is completely free. As a Digital Public Good, it's built for maximum accessibility and impact."
    },
    {
      question: "Can I contribute?",
      answer: "Absolutely! OpenZKTool is community-driven. We welcome contributions of all kinds: code improvements, documentation, bug reports, feature requests, tutorials, and more. Check our CONTRIBUTING.md guide and look for 'good first issue' labels on GitHub. Whether you're a cryptography expert or just learning, there's a place for you."
    },
    {
      question: "What's the roadmap?",
      answer: "Phase 1 (PoC) ✅ Complete: Working circuits, EVM + Soroban verification. Phase 2 (MVP) 🚧 In Progress: TypeScript SDK, examples, integration tests. Phase 3 (Testnet): Full testnet deployment, performance optimization, security audits. Phase 4 (Mainnet): Production release, no-code tools, visual circuit builder. See our full roadmap for details and timelines."
    },
    {
      question: "How is privacy guaranteed?",
      answer: "Zero-knowledge proofs are mathematically sound - they reveal NOTHING about your private inputs except that they satisfy the circuit constraints. The cryptography (Groth16 on BN254 curve) is well-studied and widely used in production systems like Zcash and Tornado Cash. As long as your circuit is correctly designed, privacy is guaranteed by mathematics, not trust."
    },
    {
      question: "What about trusted setup?",
      answer: "Groth16 requires a one-time trusted setup ceremony. For the PoC, we use a simple setup for demonstration. For production, we'll conduct a multi-party computation (MPC) ceremony where multiple participants contribute randomness - as long as ONE participant is honest and destroys their secret, the setup is secure. Alternatively, we may support PLONK or other universal setups in the future."
    }
  ]

  return (
    <section id="faq" className="py-20 px-4 relative">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 fade-in-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Frequently Asked <span className="text-gradient">Questions</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Everything you need to know about OpenZKTool and zero-knowledge proofs
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx
            return (
              <div
                key={idx}
                className={`glass rounded-xl border-2 transition-all duration-300 ${
                  isOpen ? 'border-stellar-purple' : 'border-gray-700 hover:border-gray-600'
                }`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left gap-4 group"
                >
                  <div className="flex items-start gap-4 flex-1">
                    <span className={`text-2xl transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`}>
                      ▶
                    </span>
                    <h3 className="text-lg md:text-xl font-bold group-hover:text-stellar-purple transition-colors">
                      {faq.question}
                    </h3>
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pl-16">
                    <div className="text-gray-400 leading-relaxed border-l-2 border-stellar-purple pl-4">
                      {faq.answer}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center glass-strong rounded-xl p-8 border-2 border-stellar-blue">
          <h3 className="text-2xl font-bold mb-4">Still have questions?</h3>
          <p className="text-gray-400 mb-6">
            Join our community on GitHub Discussions or reach out directly
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://github.com/xcapit/openzktool/discussions"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-stellar-purple hover:bg-opacity-80 rounded-lg font-semibold transition-all glow-box ripple"
            >
              💬 Join Discussions
            </a>
            <a
              href="mailto:fboiero@frvm.utn.edu.ar"
              className="px-6 py-3 glass border border-stellar-blue hover:bg-stellar-blue hover:bg-opacity-20 rounded-lg font-semibold transition-all ripple"
            >
              📧 Email Us
            </a>
            <a
              href="https://github.com/xcapit/openzktool/blob/main/README.md"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 glass border border-zk-green hover:bg-zk-green hover:bg-opacity-20 rounded-lg font-semibold transition-all ripple"
            >
              📖 Read Docs
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
