# 🎬 Complete Demo - Quick Start

> **5-minute demonstration of OpenZKTool's capabilities**

---

## ⚡ TL;DR - Run It Now!

```bash
./DEMO_COMPLETE.sh
```

That's it! The demo will guide you through everything.

---

## 🎯 What You'll See

1. **Zero-Knowledge Proof Generation** (Alice proves KYC compliance)
2. **Local Verification** (<50ms, off-chain)
3. **Multi-Chain Overview** (EVM + Soroban)
4. **Real-World Use Case** (Privacy + Compliance)

**Duration:** 5-7 minutes
**Interaction:** Press ENTER to continue (or run with `DEMO_AUTO=1` for automatic)

---

## 🚀 Run Modes

### Interactive Mode (Recommended)
```bash
./DEMO_COMPLETE.sh
```
Pauses at each step, lets you read and understand.

### Automatic Mode
```bash
DEMO_AUTO=1 ./DEMO_COMPLETE.sh
```
Perfect for presentations, no interaction needed.

### Skip Setup
```bash
DEMO_SKIP_SETUP=1 ./DEMO_COMPLETE.sh
```
If you've already run setup once.

---

## 📋 Prerequisites

```bash
# Check if you have everything
node --version    # Need v16+
circom --version  # Need v2.1.9+
jq --version      # For JSON parsing
```

**Missing something?** See [DEMO_GUIDE_COMPLETE.md](./DEMO_GUIDE_COMPLETE.md#troubleshooting) for installation instructions.

---

## 📖 The Story

**Alice** wants to access a financial service.

**Requirements:**
- Age ≥ 18
- Balance ≥ $50
- Allowed country

**Alice's Private Data:**
- Age: 25 (🔒 private)
- Balance: $150 (🔒 private)
- Country: Argentina (🔒 private)

**The Magic:** Alice proves she meets ALL requirements WITHOUT revealing ANY specific data!

---

## 🎓 Learning Outcomes

After the demo, you'll understand:

- ✅ How zero-knowledge proofs work
- ✅ How to generate and verify proofs
- ✅ Multi-chain verification (EVM + Soroban)
- ✅ Real-world privacy applications
- ✅ Performance characteristics

---

## 📊 What Happens Behind the Scenes

```
Step 1: Setup
├─ Compile circuit (586 constraints)
├─ Download Powers of Tau
└─ Generate proving/verification keys

Step 2: Generate Proof
├─ Create witness from Alice's data
├─ Generate ZK proof (800 bytes)
└─ Extract public signal (kycValid: 1)

Step 3: Verify Locally
├─ Verify proof with vkey
└─ Confirmation: <50ms ✅

Step 4: Multi-Chain
├─ EVM: ~245k gas
└─ Soroban: ~48k compute units
```

---

## 🎥 Demo Output Preview

```
╔════════════════════════════════════════════════════════════════════╗
║                                                                    ║
║     ╔═╗╔═╗╔═╗╔╗╔╔═╗╦╔═╦ ╦╔╦╗╔═╗╔═╗╦                              ║
║     ║ ║╠═╝║╣ ║║║╔═╝╠╩╗║ ║ ║ ║ ║║ ║║                              ║
║     ╚═╝╩  ╚═╝╝╚╝╚═╝╩ ╩╚═╝ ╩ ╚═╝╚═╝╩═╝                            ║
║                                                                    ║
║        COMPLETE ZERO-KNOWLEDGE PROOF DEMONSTRATION                ║
║           Multi-Chain Privacy • Regulatory Compliance             ║
║                                                                    ║
╚════════════════════════════════════════════════════════════════════╝

This demonstration will show you:

  🔐 1. Zero-Knowledge Proof Generation
  ✅ 2. Local Proof Verification
  ⛓️  3. On-Chain Verification (EVM + Soroban)
  🌐 4. Multi-Chain Interoperability

Estimated time: 5-7 minutes

Press ENTER to continue...
```

---

## 📚 Full Documentation

**Want to dive deeper?**

- 📖 **[Complete Demo Guide](./DEMO_GUIDE_COMPLETE.md)** - Detailed walkthrough
- 🧪 **[Interactive Tutorial](./docs/getting-started/interactive-tutorial.md)** - Hands-on learning
- 💻 **[Examples](./examples/README.md)** - Integration examples
- 📝 **[Documentation](./docs/README.md)** - Complete docs

---

## 🐛 Troubleshooting

### Demo won't start
```bash
# Check dependencies
node --version
circom --version
jq --version

# Install if missing (see DEMO_GUIDE_COMPLETE.md)
```

### "Setup failed"
```bash
# Clean and retry
cd circuits
rm -rf artifacts/*
bash scripts/prepare_and_setup.sh
```

### "Verification failed"
```bash
# Rebuild from scratch
cd circuits
bash scripts/prepare_and_setup.sh
```

**More help:** [DEMO_GUIDE_COMPLETE.md#troubleshooting](./DEMO_GUIDE_COMPLETE.md#troubleshooting)

---

## 🎯 After the Demo

**Ready to build?**

1. **Try Examples**
   ```bash
   cd examples/1-basic-proof
   npm start
   ```

2. **Use the SDK**
   ```bash
   cd sdk
   npm install
   ```

3. **Build Custom Circuit**
   ```bash
   cd examples/5-custom-circuit
   # Follow the guide
   ```

---

## 🌟 Use Cases

OpenZKTool enables:

- 🏦 Private KYC/AML compliance
- 🗳️ Anonymous voting with eligibility proof
- 🎓 Credential verification without sharing records
- 💰 Solvency proofs without revealing balances
- 🌍 Cross-border compliance without data transfer
- 🔐 Selective identity disclosure

---

## 💡 Key Takeaways

After watching the demo:

- ✅ **ZK Proofs = Privacy + Verification**
  Prove statements without revealing data

- ✅ **800 Bytes = Complete Proof**
  Tiny proof size, cryptographically secure

- ✅ **Multi-Chain = Flexibility**
  Same proof works on multiple blockchains

- ✅ **Production Ready**
  <1s generation, <50ms verification

---

## 📞 Support

- 🐛 Issues: [GitHub Issues](https://github.com/xcapit/openzktool/issues)
- 💬 Questions: [GitHub Discussions](https://github.com/xcapit/openzktool/discussions)
- 📧 Email: fboiero@frvm.utn.edu.ar

---

## 📄 License

AGPL-3.0-or-later - See [LICENSE](./LICENSE)

---

**Ready?** Run the demo now:

```bash
./DEMO_COMPLETE.sh
```

**⭐ Enjoyed the demo? Star the repo!**

🌐 https://openzktool.vercel.app
📦 https://github.com/xcapit/openzktool
