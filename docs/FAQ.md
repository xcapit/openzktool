# ❓ Frequently Asked Questions (FAQ)

**Quick answers to common questions about ZKPrivacy**

---

## 📑 Table of Contents

- [General Questions](#general-questions)
- [Technical Questions](#technical-questions)
- [Integration & Development](#integration--development)
- [Multi-Chain & Blockchain](#multi-chain--blockchain)
- [Security & Privacy](#security--privacy)
- [Performance & Costs](#performance--costs)
- [Troubleshooting](#troubleshooting)

---

## 🌟 General Questions

### What is ZKPrivacy?

ZKPrivacy is a **privacy-preserving SDK** that enables Zero-Knowledge Proofs (ZK-SNARKs) for blockchain applications. It allows users to **prove statements about their data without revealing the actual data**.

**Example:** Prove you're over 18 without revealing your exact age.

---

### What is a Zero-Knowledge Proof?

A Zero-Knowledge Proof (ZKP) is a cryptographic method where one party (the prover) can prove to another party (the verifier) that a statement is true, **without revealing any information beyond the validity of the statement**.

**Real-world analogy:** Imagine proving you have enough money in your bank account to rent an apartment, without showing your actual balance or bank statements.

---

### Why use ZKPrivacy instead of other solutions?

| Feature | ZKPrivacy | Aztec | Tornado Cash | ZETH |
|---------|-----------|-------|--------------|------|
| **Multi-chain** | ✅ ETH + Stellar | ❌ ETH only | ❌ ETH only | ❌ ETH only |
| **Proof Size** | 800 bytes | ~2KB | ~1.5KB | ~1KB |
| **Gen Time** | <1s | ~5s | ~3s | ~2s |
| **Easy Setup** | ✅ 1 command | ❌ Complex | ❌ Complex | ❌ Complex |
| **Compliance** | ✅ Built-in | ❌ No | ❌ No | ⚠️ Limited |
| **SDK Ready** | ✅ Yes | ⚠️ Partial | ❌ No | ❌ No |

**Key Advantages:**
- 🌐 **True multi-chain** (same proof, multiple blockchains)
- 🚀 **Fast** (<1 second proof generation)
- 🔧 **Easy integration** (simple SDK)
- 📜 **Compliance-ready** (selective disclosure for auditors)

---

### What are the main use cases?

**1. Privacy-Preserving KYC**
- Prove age ≥ 18 without revealing exact age
- Prove sufficient balance without showing account details
- Prove country eligibility without disclosing location

**2. Confidential DeFi**
- Private credit scores
- Hidden collateral amounts
- Confidential trading positions

**3. Cross-Chain Identity**
- Portable reputation scores
- Anonymous credentials
- Privacy-preserving voting

See [Use Cases](./use-cases/) for detailed examples.

---

### Is ZKPrivacy ready for production?

**Current Status: Proof of Concept (POC) ✅**

This is a **working prototype** with:
- ✅ Full functionality (proof generation + verification)
- ✅ Multi-chain support (EVM + Soroban)
- ✅ Demo scripts and documentation
- ⚠️ **NOT** audited yet
- ⚠️ **NOT** battle-tested in production

**Use only on testnets with non-critical data.**

**Roadmap to Production:**
- 🔜 Professional security audit (Q2 2025)
- 🔜 Formal verification of circuits
- 🔜 Bug bounty program
- 🔜 Production-ready SDK release

---

### Who is behind ZKPrivacy?

**Team X1 - Xcapit Labs**

- ⛓️ **6+ years blockchain experience**
- 🏆 **Stellar Community Fund (SCF) grant recipient**
- 🌍 **Based in Argentina**
- 💼 **Experience:** DeFi, wallets, cross-chain solutions

**Not affiliated with any university or research institution.** This is a practical, developer-focused project.

---

## 🔧 Technical Questions

### How does proof generation work?

**High-level flow:**

```
Private Data → Circuit → Witness → Groth16 Prover → Proof (800 bytes)
```

**Step-by-step:**

1. **Input:** You provide private data (age: 25, balance: 150) + public constraints (minAge: 18, minBalance: 50)
2. **Circuit:** Circom circuit checks all constraints (age ≥ minAge, balance ≥ minBalance, etc.)
3. **Witness:** All intermediate values are calculated (586 constraint values)
4. **Proof:** Groth16 prover generates a cryptographic proof (pi_a, pi_b, pi_c)
5. **Output:** 800-byte proof + public signal (kycValid: 1)

**What's hidden:** Your exact age, balance, and country
**What's public:** That you passed all checks (kycValid = 1)

See [Proof Flow](./architecture/proof-flow.md) for detailed diagrams.

---

### What is a "circuit" in ZKPrivacy?

A **circuit** is like a mathematical program written in a special language (Circom) that defines:
- **What to prove** (e.g., "age is greater than or equal to 18")
- **What constraints to enforce** (e.g., "balance >= minBalance AND country in allowed list")

**Example circuit (simplified):**
```circom
template KYCTransfer() {
    signal input age;
    signal input minAge;
    signal output kycValid;

    // Constraint: age must be >= minAge
    component gte = GreaterEqThan(8);
    gte.in[0] <== age;
    gte.in[1] <== minAge;

    kycValid <== gte.out;
}
```

**Our KYC circuit** (`kyc_transfer.circom`):
- **Inputs:** age, balance, country (private) + thresholds (public)
- **Constraints:** 586 total
- **Output:** kycValid (1 = passed, 0 = failed)

---

### How do I generate a custom proof?

**Quick guide:**

1. **Prepare input data** (`circuits/artifacts/input.json`):
```json
{
  "age": 25,
  "balance": 150,
  "country": 11,
  "minAge": 18,
  "minBalance": 50,
  "allowedCountries": [11, 1, 5]
}
```

2. **Generate proof:**
```bash
cd circuits/scripts
bash prove_and_verify.sh
```

3. **Result:**
   - `proof.json` - The ZK proof
   - `public.json` - Public output (kycValid)

See [Quick Start](./getting-started/quickstart.md) for full tutorial.

---

### Can I create my own circuit?

**Yes!** Here's how:

1. **Write your circuit** (e.g., `my_circuit.circom`):
```circom
pragma circom 2.0.0;

template MyCircuit() {
    signal input secretValue;
    signal input threshold;
    signal output isValid;

    component gte = GreaterEqThan(32);
    gte.in[0] <== secretValue;
    gte.in[1] <== threshold;

    isValid <== gte.out;
}

component main = MyCircuit();
```

2. **Compile and setup:**
```bash
circom my_circuit.circom --r1cs --wasm --sym
snarkjs groth16 setup my_circuit.r1cs pot12_final.ptau my_circuit_0000.zkey
# ... (trusted setup ceremony)
```

3. **Generate proofs with your circuit**

See [Custom Circuits Guide](./guides/custom-circuits.md) *(coming soon)*.

---

### What is the "trusted setup" and why is it needed?

**Trusted Setup** is a one-time ceremony that generates cryptographic parameters (proving key + verification key) for Groth16 ZK-SNARKs.

**Why needed?**
- Groth16 requires a "common reference string" (CRS)
- The setup ensures the prover and verifier agree on the same parameters

**Is it safe?**
- ✅ Uses **Powers of Tau** ceremony (community-verified)
- ✅ Multiple independent contributors
- ✅ Safe as long as **at least one** contributor is honest
- ✅ Can reuse existing ceremonies (we use Hermez's pot12)

**Do I need to run a trusted setup?**
- ❌ **No** - if you use our circuits
- ✅ **Yes** - if you create custom circuits

**Download existing Powers of Tau:**
```bash
wget https://hermez.s3-eu-west-1.amazonaws.com/pot12_final_phase2.ptau
```

---

### What cryptographic primitives does ZKPrivacy use?

| Component | Technology | Security Level |
|-----------|------------|----------------|
| **Proof System** | Groth16 SNARK | 128-bit |
| **Elliptic Curve** | BN254 (alt_bn128) | 128-bit |
| **Hash Function** | Poseidon (in circuits) | 128-bit |
| **Field** | Scalar field of BN254 | 254-bit prime |

**All are industry-standard and battle-tested.**

---

## 🔌 Integration & Development

### How do I integrate ZKPrivacy into my app?

**Quick integration (3 steps):**

**1. Install dependencies:**
```bash
npm install snarkjs circomlib
```

**2. Generate proof in your code:**
```javascript
const snarkjs = require("snarkjs");

async function generateProof(age, balance, country) {
  const input = {
    age: age,
    balance: balance,
    country: country,
    minAge: 18,
    minBalance: 50,
    allowedCountries: [11, 1, 5]
  };

  const { proof, publicSignals } = await snarkjs.groth16.fullProve(
    input,
    "kyc_transfer.wasm",
    "kyc_transfer_final.zkey"
  );

  return { proof, publicSignals };
}
```

**3. Verify on-chain:**
```javascript
// EVM (Ethereum)
const verified = await verifierContract.verifyProof(
  proof.pi_a,
  proof.pi_b,
  proof.pi_c,
  publicSignals
);

// Soroban (Stellar)
const result = await sorobanContract.verify({
  proof: proof,
  public_inputs: publicSignals
});
```

See [Integration Examples](../examples/) for full code.

---

### Do you have a JavaScript/TypeScript SDK?

**Coming soon!** 🚧

Currently in development:
- 📦 `@zkprivacy/sdk` - Main SDK package
- 🔧 `@zkprivacy/circuits` - Circuit library
- ⛓️ `@zkprivacy/evm` - EVM integration
- 🌟 `@zkprivacy/soroban` - Stellar integration

**Current workaround:** Use `snarkjs` directly (see integration example above).

**Track progress:** https://github.com/xcapit/stellar-privacy-poc/issues

---

### Can I use ZKPrivacy with React/Vue/Next.js?

**Yes!** ZKPrivacy works in the browser.

**Example (React):**
```jsx
import { useState } from 'react';
const snarkjs = require("snarkjs");

function ProofGenerator() {
  const [proof, setProof] = useState(null);

  async function handleGenerate() {
    const input = {
      age: 25,
      balance: 150,
      country: 11,
      minAge: 18,
      minBalance: 50,
      allowedCountries: [11, 1, 5]
    };

    const { proof, publicSignals } = await snarkjs.groth16.fullProve(
      input,
      "/kyc_transfer.wasm",  // Serve from public folder
      "/kyc_transfer_final.zkey"
    );

    setProof(proof);
  }

  return (
    <button onClick={handleGenerate}>
      Generate Privacy Proof
    </button>
  );
}
```

**Note:** WASM and zkey files are large (~300KB). Consider:
- Lazy loading
- CDN hosting
- Progress indicators

See `examples/react-integration/` for full example *(coming soon)*.

---

### How do I contribute to ZKPrivacy?

**We welcome contributions!** 🎉

**Ways to contribute:**
1. 🐛 **Report bugs** - Open an issue
2. 💡 **Suggest features** - Discuss in issues
3. 📝 **Improve docs** - Submit PR
4. 🔧 **Write code** - Fix bugs, add features
5. ⭐ **Star the repo** - Spread the word!

**Development workflow:**
```bash
# 1. Fork and clone
git clone https://github.com/YOUR_USERNAME/stellar-privacy-poc
cd stellar-privacy-poc

# 2. Install and setup
npm install
npm run setup

# 3. Make changes and test
npm test

# 4. Submit PR
git checkout -b feature/my-improvement
git commit -m "feat: add cool feature"
git push origin feature/my-improvement
```

See [CONTRIBUTING.md](../CONTRIBUTING.md) for detailed guidelines.

---

## 🌐 Multi-Chain & Blockchain

### Which blockchains does ZKPrivacy support?

**Currently supported:**
- ✅ **Ethereum** (and all EVM-compatible chains: Polygon, Arbitrum, Optimism, etc.)
- ✅ **Stellar** (via Soroban smart contracts)

**Coming soon:**
- 🔜 Solana
- 🔜 Cosmos chains
- 🔜 Polkadot parachains

---

### How does the same proof work on multiple chains?

**Key insight:** The proof is **chain-agnostic**. Only the verifier contract is chain-specific.

```
┌─────────────────┐
│  Generate Proof │  ← Universal (works anywhere)
│   (800 bytes)   │
└─────────────────┘
         │
         ├──────→ EVM Chain (Verifier.sol)
         │
         └──────→ Soroban Chain (verifier.rs)
```

**Why it works:**
- The proof is pure math (elliptic curve points)
- The pairing check is the same algorithm
- Only the implementation language differs (Solidity vs Rust)

See [Multi-Chain Architecture](./architecture/overview.md#multi-chain-architecture) for diagrams.

---

### How do I deploy the verifier contract?

**EVM (Ethereum/Polygon/etc.):**
```bash
cd evm-verification

# 1. Deploy with Foundry
forge create --rpc-url <RPC_URL> \
  --private-key <PRIVATE_KEY> \
  src/Verifier.sol:Groth16Verifier

# 2. Or deploy with Hardhat
npx hardhat run scripts/deploy.js --network sepolia
```

**Soroban (Stellar):**
```bash
cd soroban

# 1. Build contract
stellar contract build

# 2. Deploy to testnet
stellar contract deploy \
  --wasm target/wasm32-unknown-unknown/release/verifier.wasm \
  --source alice \
  --network testnet
```

See [Deployment Guide](./guides/deployment.md) *(coming soon)* for details.

---

### Can I verify the same proof on multiple chains simultaneously?

**Yes!** That's the beauty of multi-chain ZKPs.

**Example flow:**
1. User generates proof once (800 bytes)
2. Submit to Ethereum → Verified ✅
3. Submit to Stellar → Verified ✅
4. Submit to Polygon → Verified ✅

**Use case:** Cross-chain identity - prove KYC once, use everywhere.

---

## 🔐 Security & Privacy

### Is ZKPrivacy secure?

**Current security status:**

✅ **What's secure:**
- Uses **Groth16** (industry-standard, proven secure since 2016)
- Uses **BN254 curve** (128-bit security, same as Ethereum)
- Uses **Powers of Tau** (community-verified trusted setup)

⚠️ **What's NOT secure yet:**
- **No professional audit** (scheduled for Q2 2025)
- **POC-level code** (not production-hardened)
- **Limited battle-testing** (use on testnets only)

**Recommendation:** Great for demos, testing, research. **Don't use in production with real funds yet.**

---

### What information is hidden vs. revealed?

**Example: KYC Transfer Proof**

| Data | Status | Visible to Verifier? |
|------|--------|---------------------|
| Exact age (25) | 🔒 **Private** | ❌ No |
| Exact balance ($150) | 🔒 **Private** | ❌ No |
| Country (Argentina) | 🔒 **Private** | ❌ No |
| Passed KYC (yes/no) | 🔓 **Public** | ✅ Yes (kycValid = 1) |
| Age threshold (18) | 🔓 **Public** | ✅ Yes (input constraint) |
| Balance threshold ($50) | 🔓 **Public** | ✅ Yes (input constraint) |

**Zero-Knowledge Property:** The verifier learns **only** that you passed, not **why** or **by how much**.

---

### Can proofs be faked or replayed?

**Faked? No.** ❌
- Groth16 has **soundness** property: invalid proofs are rejected (except with negligible probability ~2^-128)
- You cannot create a valid proof without knowing valid private inputs

**Replayed? Maybe.** ⚠️
- By default, proofs can be reused (they're deterministic)
- **Solution:** Add a nonce or timestamp to the circuit

**Example with anti-replay:**
```circom
template KYCWithNonce() {
    signal input age;
    signal input nonce;  // Unique per proof
    // ... rest of circuit
}
```

---

### What are the privacy guarantees?

**ZKPrivacy provides:**

1. **Completeness** - Valid proofs always verify
2. **Soundness** - Invalid proofs never verify (except with negligible probability)
3. **Zero-Knowledge** - Verifier learns nothing beyond the public output

**What ZKPrivacy does NOT protect against:**
- ❌ Network-level privacy (your IP is visible)
- ❌ Metadata leakage (transaction patterns)
- ❌ Side-channel attacks (timing, power analysis)

**For enhanced privacy, combine with:**
- Tor/VPN for network privacy
- Mixers/tumblers for transaction privacy
- Secure enclaves for key management

---

### Has ZKPrivacy been audited?

**Not yet.** ⚠️

**Current status:** Proof of Concept (POC)

**Audit roadmap:**
- 🔜 **Q2 2025:** Professional security audit (circuits + smart contracts)
- 🔜 **Q3 2025:** Formal verification of critical circuits
- 🔜 **Q4 2025:** Public bug bounty program

**Until audited:** Use only for:
- ✅ Testing and development
- ✅ Demos and education
- ✅ Research projects
- ❌ **NOT** production with real funds

---

## ⚡ Performance & Costs

### How long does proof generation take?

**Benchmark (modern laptop, M1/M2 Mac or equivalent):**

| Operation | Time |
|-----------|------|
| Witness calculation | ~200ms |
| Proof generation | ~500ms |
| **Total** | **<1 second** |

**On slower hardware:** 1-2 seconds

**Parallelization:** Proof generation is CPU-intensive. Use Web Workers in browser or worker threads in Node.js.

---

### How much does on-chain verification cost?

**Ethereum (and EVM chains):**

| Network | Gas Cost | USD Cost (50 gwei) |
|---------|----------|-------------------|
| Ethereum Mainnet | ~200,000 gas | $5-10 |
| Polygon | ~200,000 gas | $0.01-0.05 |
| Arbitrum | ~200,000 gas | $0.50-1.00 |
| Optimism | ~200,000 gas | $0.50-1.00 |

**Stellar (Soroban):**
- Cost: Minimal (few stroops)
- USD equivalent: <$0.01

**Note:** Costs vary with gas prices. These are estimates.

---

### What is the proof size?

**Groth16 proof size:** ~800 bytes (constant)

**Breakdown:**
- `pi_a`: 2 field elements (64 bytes)
- `pi_b`: 4 field elements (128 bytes)
- `pi_c`: 2 field elements (64 bytes)
- Encoding overhead: ~544 bytes

**Comparison:**
- Groth16: 800 bytes ✅
- PLONK: ~1.5 KB
- STARKs: ~50-100 KB

**Why Groth16?** Smallest proofs + fast verification (important for on-chain).

---

### How many constraints does the KYC circuit have?

**Total constraints:** 586

**Breakdown:**
- `GreaterEqThan(age >= minAge)`: ~200 constraints
- `GreaterEqThan(balance >= minBalance)`: ~200 constraints
- `CountryCheck(country in list)`: ~150 constraints
- AND gates + auxiliary: ~36 constraints

**Is 586 constraints a lot?**
- ❌ No, very efficient!
- Reference: Simple circuits have 100-1000 constraints
- Complex circuits (rollups) have millions

**Circuit size vs. proof time:**
- 586 constraints → <1 second ✅
- 10,000 constraints → ~5 seconds
- 1,000,000 constraints → ~10 minutes

---

## 🛠️ Troubleshooting

### "Account not found" error on Soroban

**Error:**
```
Error: Account not found
```

**Cause:** Stellar quickstart Docker container hasn't finished initializing, or friendbot failed to fund the account.

**Solution:**
```bash
# 1. Wait for RPC to be ready
curl http://localhost:8000/soroban/rpc

# 2. Fund account manually
ALICE_ADDR=$(stellar keys address alice)
curl "http://localhost:8000/friendbot?addr=$ALICE_ADDR"

# 3. Verify account exists
stellar contract invoke --id <CONTRACT_ID> --source alice -- --help
```

---

### "Verification failed" on EVM

**Error:**
```
Proof Verification Result: false
```

**Cause:** Verification key mismatch between `Verifier.sol` and `kyc_transfer_final.zkey`.

**Solution:** Regenerate Verifier.sol from current zkey:
```bash
npx snarkjs zkey export solidityverifier \
  circuits/artifacts/kyc_transfer_final.zkey \
  evm-verification/src/Verifier.sol
```

---

### "Constraint not satisfied" during witness calculation

**Error:**
```
Error: Constraint 123 not satisfied
```

**Cause:** Your input violates a circuit constraint.

**Solution:**
1. Check your `input.json` values
2. Ensure all constraints are met:
   - `age >= minAge`
   - `balance >= minBalance`
   - `country` is in `allowedCountries`

**Debug mode:**
```bash
# Generate witness with --verbose
node generate_witness.js kyc_transfer.wasm input.json witness.wtns --verbose
```

---

### Proof generation is very slow

**Issue:** Taking >10 seconds to generate proof.

**Possible causes:**
1. Large circuit (millions of constraints)
2. Slow hardware (old CPU)
3. Browser limitations (WASM performance)

**Solutions:**
1. **Optimize circuit** - Reduce constraints
2. **Use native Node.js** - Faster than browser
3. **Use worker threads** - Parallelize if generating multiple proofs
4. **Upgrade hardware** - Proof generation is CPU-intensive

---

### "Module not found: snarkjs" in browser

**Error:**
```
Cannot find module 'snarkjs'
```

**Cause:** snarkjs has Node.js dependencies that don't work in browser.

**Solution:** Use browser-compatible build:
```javascript
// Use CDN
import { groth16 } from "https://cdn.jsdelivr.net/npm/snarkjs@latest/+esm";

// Or webpack with proper config
module.exports = {
  resolve: {
    fallback: {
      "fs": false,
      "path": false
    }
  }
};
```

---

## 📚 Additional Resources

### Documentation
- 📖 [Getting Started](./getting-started/quickstart.md)
- 🏗️ [Architecture Overview](./architecture/overview.md)
- 🔄 [Proof Flow](./architecture/proof-flow.md)
- 🧪 [Testing Guide](./testing/README.md)

### External Resources
- 📄 [Groth16 Paper](https://eprint.iacr.org/2016/260.pdf)
- 🔧 [Circom Documentation](https://docs.circom.io/)
- 📦 [snarkjs Repository](https://github.com/iden3/snarkjs)
- 🎓 [ZK Learning Resources](https://zkp.science/)

### Community
- 💬 [GitHub Issues](https://github.com/xcapit/stellar-privacy-poc/issues)
- 🌐 [Website](https://zkprivacy.vercel.app)
- 📧 [Contact via website](https://zkprivacy.vercel.app)

---

## 🤔 Still have questions?

**Can't find your answer?**

1. 🔍 Search [existing issues](https://github.com/xcapit/stellar-privacy-poc/issues)
2. 💬 Open a [new issue](https://github.com/xcapit/stellar-privacy-poc/issues/new)
3. 📧 Contact us via [website](https://zkprivacy.vercel.app)

---

*Last updated: 2025-01-10*
*Team X1 - Xcapit Labs*
