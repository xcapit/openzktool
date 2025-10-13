export default function Architecture() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            How It <span className="text-gradient">Works</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Simple integration, powerful privacy guarantees
          </p>
        </div>

        {/* Architecture flow */}
        <div className="grid md:grid-cols-4 gap-8 mb-16">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-stellar-purple to-stellar-blue flex items-center justify-center text-3xl glow-box">
              📝
            </div>
            <h3 className="text-xl font-bold mb-2">1. Define Circuit</h3>
            <p className="text-gray-400">Write your privacy logic in Circom (age, balance, compliance checks)</p>
          </div>

          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-stellar-blue to-zk-cyan flex items-center justify-center text-3xl glow-box">
              🔧
            </div>
            <h3 className="text-xl font-bold mb-2">2. Compile & Setup</h3>
            <p className="text-gray-400">Compile to R1CS, run trusted setup, generate proving/verification keys</p>
          </div>

          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-zk-cyan to-zk-green flex items-center justify-center text-3xl glow-box-green">
              🔐
            </div>
            <h3 className="text-xl font-bold mb-2">3. Generate Proof</h3>
            <p className="text-gray-400">Create ZK proof with private inputs (SDK handles witness calculation)</p>
          </div>

          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-zk-green to-stellar-purple flex items-center justify-center text-3xl glow-box">
              ✅
            </div>
            <h3 className="text-xl font-bold mb-2">4. Verify On-Chain</h3>
            <p className="text-gray-400">Submit proof to smart contract on any supported chain</p>
          </div>
        </div>

        {/* Code example */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="p-6 rounded-xl border border-gray-700 bg-stellar-dark">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Circuit Definition</h3>
              <span className="text-sm text-gray-400">Circom</span>
            </div>
            <pre className="text-sm text-gray-300 overflow-x-auto">
              <code>{`template KYCTransfer() {
  signal input age;
  signal input balance;
  signal input countryId;

  signal output kycValid;

  // Age check: 18-99
  component ageProof = RangeProof();
  ageProof.value <== age;
  ageProof.min <== 18;
  ageProof.max <== 99;

  // Balance check: >= $50
  component solvency = SolvencyCheck();
  solvency.balance <== balance;
  solvency.threshold <== 50;

  // Country allowlist
  component compliance = ComplianceVerify();
  compliance.countryId <== countryId;

  kycValid <== ageProof.valid *
              solvency.valid *
              compliance.isAllowed;
}`}</code>
            </pre>
          </div>

          <div className="p-6 rounded-xl border border-gray-700 bg-stellar-dark">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Proof Generation</h3>
              <span className="text-sm text-gray-400">TypeScript</span>
            </div>
            <pre className="text-sm text-gray-300 overflow-x-auto">
              <code>{`import { generateProof } from '@xcapit/privacy-sdk'

// Private data (never revealed)
const privateInputs = {
  age: 25,
  balance: 150,
  countryId: 32
}

// Public parameters
const publicInputs = {
  minAge: 18,
  maxAge: 99,
  minBalance: 50
}

// Generate proof (~2-5 seconds)
const { proof, publicSignals } =
  await generateProof(
    privateInputs,
    publicInputs
  )

// Verify on-chain (any chain)
const isValid = await verifier
  .verifyProof(proof, publicSignals)

// Result: kycValid = 1 ✅
// Hidden: exact age, balance, country`}</code>
            </pre>
          </div>
        </div>

        {/* Benefits */}
        <div className="mt-16 grid md:grid-cols-3 gap-6">
          <div className="text-center p-6 rounded-xl border border-stellar-purple bg-gradient-to-br from-stellar-dark to-black">
            <div className="text-4xl mb-3">🔒</div>
            <h4 className="text-xl font-bold mb-2">Privacy Preserved</h4>
            <p className="text-gray-400">Exact values never leave your device</p>
          </div>

          <div className="text-center p-6 rounded-xl border border-stellar-blue bg-gradient-to-br from-stellar-dark to-black">
            <div className="text-4xl mb-3">⚡</div>
            <h4 className="text-xl font-bold mb-2">Fast Verification</h4>
            <p className="text-gray-400">Constant time, no matter input size</p>
          </div>

          <div className="text-center p-6 rounded-xl border border-zk-green bg-gradient-to-br from-stellar-dark to-black">
            <div className="text-4xl mb-3">🌐</div>
            <h4 className="text-xl font-bold mb-2">Chain Agnostic</h4>
            <p className="text-gray-400">Same proof works everywhere</p>
          </div>
        </div>
      </div>
    </section>
  )
}
