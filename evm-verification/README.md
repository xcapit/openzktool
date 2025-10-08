# EVM On-Chain Verification with Foundry

This directory contains Foundry-based contracts and scripts to deploy and verify Groth16 proofs on a local Ethereum testnet.

## Prerequisites

### Install Foundry

```bash
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

Verify installation:
```bash
forge --version
anvil --version
```

## Quick Start

### 1. Generate a Proof (if you haven't already)

```bash
cd ../circuits/scripts
bash prove_and_verify.sh
cd ../../evm-verification
```

### 2. Run On-Chain Verification

```bash
bash verify_on_chain.sh
```

This script will:
1. ✅ Start a local Ethereum node (Anvil)
2. ✅ Deploy the Groth16Verifier contract
3. ✅ Submit your proof to the contract
4. ✅ Verify the proof on-chain
5. ✅ Display the result

## Manual Testing

### Start Anvil (local Ethereum node)

```bash
anvil
```

Leave this running in a separate terminal.

### Deploy the Verifier Contract

```bash
forge script script/DeployAndVerify.s.sol:DeployAndVerify \
  --rpc-url http://localhost:8545 \
  --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 \
  --broadcast
```

### Run Tests

```bash
forge test -vvv
```

## Project Structure

```
evm-verification/
├── foundry.toml              # Foundry configuration
├── src/
│   └── Verifier.sol          # Generated Groth16 verifier contract
├── script/
│   └── DeployAndVerify.s.sol # Deployment script
├── test/
│   └── VerifierTest.t.sol    # On-chain verification test
├── verify_on_chain.sh        # Automated demo script
└── README.md                 # This file
```

## How It Works

1. **Verifier.sol**: Auto-generated Solidity contract that verifies Groth16 proofs
   - Generated from `kyc_transfer_final.zkey`
   - Matches the verification key from the circuit
   - Uses BN254 elliptic curve pairing check

2. **VerifierTest.t.sol**: Foundry test that:
   - Deploys the verifier contract
   - Reads proof from `../circuits/artifacts/proof.json`
   - Calls `verifyProof()` on-chain
   - Asserts the result is `true`

3. **verify_on_chain.sh**: Automation script that:
   - Checks prerequisites (Foundry, proof files)
   - Starts Anvil (local testnet)
   - Deploys contracts
   - Runs verification tests
   - Shows results with nice formatting

## Gas Costs

Typical gas consumption for proof verification:
- **Deployment**: ~1,500,000 gas
- **Verification**: ~250,000-300,000 gas per proof

On a real network (e.g., Polygon):
- Deployment: ~$0.30-1.00 (one-time)
- Verification: ~$0.01-0.05 per proof

## Troubleshooting

### "Foundry not found"

Install Foundry:
```bash
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

### "Proof files not found"

Generate a proof first:
```bash
cd ../circuits/scripts
bash prove_and_verify.sh
```

### "Port 8545 already in use"

Kill existing Anvil instance:
```bash
pkill anvil
```

### Verification fails

Make sure you regenerated `Verifier.sol` after any circuit changes:
```bash
snarkjs zkey export solidityverifier \
  ../circuits/artifacts/kyc_transfer_final.zkey \
  src/Verifier.sol
```

## Next Steps

- Deploy to a real testnet (Sepolia, Mumbai)
- Integrate with frontend (ethers.js/web3.js)
- Add more complex proof scenarios
- Benchmark gas optimization

## Resources

- **Foundry Book**: https://book.getfoundry.sh/
- **Groth16 Paper**: https://eprint.iacr.org/2016/260
- **snarkjs**: https://github.com/iden3/snarkjs
- **Circom**: https://docs.circom.io/

---

**Team X1 - Xcapit Labs**
