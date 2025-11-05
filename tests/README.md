# OpenZKTool Test Suite

Complete testing infrastructure for OpenZKTool Zero-Knowledge Proof toolkit.

## Structure

```
tests/
├── unit/                     # Unit tests
│   ├── circuit/
│   │   ├── kyc_transfer.test.ts
│   │   └── constraint_validation.test.ts
│   ├── sdk/
│   │   ├── prover.test.ts
│   │   ├── verifier.test.ts
│   │   └── utils.test.ts
│   └── contracts/
│       ├── evm_verifier.test.sol
│       └── soroban_verifier.test.rs
├── integration/              # Integration tests
│   ├── proof_generation.test.ts
│   ├── evm_verification.test.ts
│   ├── soroban_verification.test.ts
│   └── multi_chain.test.ts
├── e2e/                      # End-to-end tests
│   ├── full_flow_evm.test.ts
│   ├── full_flow_stellar.test.ts
│   └── multi_chain_deployment.test.ts
├── fixtures/                 # Test data
│   ├── circuits/
│   │   ├── test_inputs.json
│   │   └── expected_outputs.json
│   ├── proofs/
│   │   └── sample_proofs.json
│   └── contracts/
│       ├── deployed_addresses.json
│       └── abi/
├── benchmarks/               # Performance tests
│   ├── proof_generation_bench.ts
│   ├── verification_bench.ts
│   └── gas_cost_bench.ts
└── utils/                    # Test utilities
    ├── setup.ts
    ├── helpers.ts
    ├── blockchain_mock.ts
    └── cleanup.ts
```

## Running Tests

### All Tests
```bash
npm test
```

### Unit Tests Only
```bash
npm run test:unit
```

### Integration Tests Only
```bash
npm run test:integration
```

### End-to-End Tests
```bash
npm run test:e2e
```

### Specific Test Suite
```bash
npm test -- unit/circuit/kyc_transfer
npm test -- integration/evm_verification
npm test -- e2e/full_flow_stellar
```

### With Coverage
```bash
npm run test:coverage
```

Coverage target: >80% for unit tests, >70% for integration tests

### Watch Mode
```bash
npm run test:watch
```

## Test Categories

### Unit Tests

Test individual components in isolation:

**Circuit Tests** (`tests/unit/circuit/`)
- Constraint validation
- Input/output correctness
- Edge cases and boundary conditions

**SDK Tests** (`tests/unit/sdk/`)
- Prover module: witness generation, proof creation
- Verifier module: local verification
- Utils module: input validation, format conversion

**Contract Tests** (`tests/unit/contracts/`)
- Solidity verifier function tests
- Rust/Soroban contract logic tests
- Gas cost validation

### Integration Tests

Test component interactions:

**Proof Generation Flow** (`tests/integration/proof_generation.test.ts`)
- Circuit compilation → Witness generation → Proof creation
- End-to-end proof pipeline without blockchain

**EVM Verification** (`tests/integration/evm_verification.test.ts`)
- SDK → EVM contract interaction
- Proof submission and verification
- Gas estimation

**Soroban Verification** (`tests/integration/soroban_verification.test.ts`)
- SDK → Stellar contract interaction
- Transaction building and submission
- Fee estimation

**Multi-Chain** (`tests/integration/multi_chain.test.ts`)
- Same proof verified on multiple chains
- Cross-chain compatibility

### End-to-End Tests

Test complete user flows with blockchain:

**Full Flow EVM** (`tests/e2e/full_flow_evm.test.ts`)
1. Deploy verifier contract (local Anvil)
2. Generate proof
3. Submit verification transaction
4. Validate on-chain result

**Full Flow Stellar** (`tests/e2e/full_flow_stellar.test.ts`)
1. Deploy Soroban contract (local sandbox)
2. Generate proof
3. Invoke verification
4. Check transaction result

**Multi-Chain Deployment** (`tests/e2e/multi_chain_deployment.test.ts`)
- Deploy to multiple networks
- Verify same proof on all chains
- Monitor transaction finality

## Test Configuration

### Environment Variables

```bash
# Test environment: local, ci, testnet
TEST_ENV=local

# Network endpoints
EVM_RPC_URL=http://localhost:8545
STELLAR_RPC_URL=http://localhost:8000

# Contract addresses (for testnet testing)
EVM_VERIFIER_ADDRESS=0x...
STELLAR_CONTRACT_ID=CBPB...

# Test accounts
TEST_PRIVATE_KEY=0x...
TEST_STELLAR_SECRET=S...
```

### Configuration Files

**`tests/config/local.json`**
```json
{
  "evm": {
    "rpc": "http://localhost:8545",
    "chainId": 31337
  },
  "stellar": {
    "rpc": "http://localhost:8000",
    "network": "standalone"
  }
}
```

**`tests/config/ci.json`**
```json
{
  "useMocks": true,
  "timeout": 30000
}
```

**`tests/config/testnet.json`**
```json
{
  "evm": {
    "rpc": "https://rpc.ankr.com/eth_sepolia",
    "chainId": 11155111
  },
  "stellar": {
    "rpc": "https://soroban-testnet.stellar.org",
    "network": "testnet"
  }
}
```

## Prerequisites

### Local Testing

```bash
# Install dependencies
npm install

# Setup circuit artifacts
cd circuits && bash scripts/prepare_and_setup.sh

# Start local EVM blockchain
anvil

# Start Stellar sandbox
docker run -d -p 8000:8000 stellar/quickstart:testing --standalone
```

### CI/CD Testing

All prerequisites are handled by GitHub Actions workflows. See `.github/workflows/test.yml`.

## Coverage Goals

- Unit Tests: 80%+ coverage
- Integration Tests: 70%+ coverage
- Critical Paths: 100% coverage

Current coverage: Run `npm run test:coverage` to see latest report.

## Writing Tests

### Unit Test Template

```typescript
import { ZKProver } from '../../sdk/src/prover';

describe('ZKProver', () => {
  let prover: ZKProver;

  beforeAll(async () => {
    prover = new ZKProver({
      wasmPath: './fixtures/circuits/kyc_transfer.wasm',
      zkeyPath: './fixtures/circuits/kyc_transfer_final.zkey'
    });
    await prover.initialize();
  });

  afterAll(async () => {
    await prover.cleanup();
  });

  describe('prove', () => {
    it('should generate valid proof for valid inputs', async () => {
      const inputs = {
        age: 25,
        balance: 150,
        countryId: 11,
        minAge: 18,
        maxAge: 99,
        minBalance: 50,
        allowedCountries: [11, 1, 5]
      };

      const { proof, publicSignals } = await prover.prove(inputs);

      expect(proof).toBeDefined();
      expect(proof.protocol).toBe('groth16');
      expect(publicSignals[0]).toBe('1'); // kycValid = 1
    });

    it('should generate invalid proof for underage user', async () => {
      const inputs = {
        age: 15,
        balance: 150,
        countryId: 11,
        minAge: 18,
        maxAge: 99,
        minBalance: 50,
        allowedCountries: [11, 1, 5]
      };

      const { publicSignals } = await prover.prove(inputs);
      expect(publicSignals[0]).toBe('0'); // kycValid = 0
    });

    it('should throw error for invalid input types', async () => {
      const invalidInputs = {
        age: 'twenty-five', // Invalid type
        balance: 150,
        countryId: 11
      };

      await expect(prover.prove(invalidInputs)).rejects.toThrow();
    });
  });
});
```

### Integration Test Template

```typescript
import { ZKProver, EVMVerifier } from '../../sdk/src';
import { ethers } from 'ethers';
import { deployVerifierContract } from '../utils/helpers';

describe('EVM Verification Integration', () => {
  let prover: ZKProver;
  let verifier: EVMVerifier;
  let provider: ethers.providers.Provider;
  let signer: ethers.Wallet;

  beforeAll(async () => {
    // Setup provider
    provider = new ethers.providers.JsonRpcProvider('http://localhost:8545');
    signer = new ethers.Wallet('0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80', provider);

    // Deploy contract
    const contractAddress = await deployVerifierContract(signer);

    // Initialize prover and verifier
    prover = new ZKProver({
      wasmPath: './fixtures/circuits/kyc_transfer.wasm',
      zkeyPath: './fixtures/circuits/kyc_transfer_final.zkey'
    });
    await prover.initialize();

    verifier = new EVMVerifier({
      contractAddress,
      provider,
      signer
    });
  });

  afterAll(async () => {
    await prover.cleanup();
  });

  it('should verify proof on EVM', async () => {
    const inputs = {
      age: 25,
      balance: 150,
      countryId: 11,
      minAge: 18,
      maxAge: 99,
      minBalance: 50,
      allowedCountries: [11, 1, 5]
    };

    const { proof, publicSignals } = await prover.prove(inputs);
    const tx = await verifier.verify(proof, publicSignals);
    const receipt = await tx.wait();

    expect(receipt.status).toBe(1);
  });
});
```

### End-to-End Test Template

```typescript
import { ZKProver, StellarVerifier } from '../../sdk/src';
import * as StellarSDK from '@stellar/stellar-sdk';
import { deploySorobanContract } from '../utils/stellar_helpers';

describe('Full Flow: Stellar', () => {
  let prover: ZKProver;
  let verifier: StellarVerifier;
  let server: StellarSDK.SorobanRpc.Server;
  let keypair: StellarSDK.Keypair;
  let contractId: string;

  beforeAll(async () => {
    // Setup Stellar
    server = new StellarSDK.SorobanRpc.Server('http://localhost:8000');
    keypair = StellarSDK.Keypair.random();

    // Fund account
    await fetch(`http://localhost:8000/friendbot?addr=${keypair.publicKey()}`);

    // Deploy contract
    contractId = await deploySorobanContract(server, keypair);

    // Initialize prover and verifier
    prover = new ZKProver({
      wasmPath: './fixtures/circuits/kyc_transfer.wasm',
      zkeyPath: './fixtures/circuits/kyc_transfer_final.zkey'
    });
    await prover.initialize();

    verifier = new StellarVerifier({
      contractId,
      network: 'standalone',
      server
    });
  });

  it('should complete full flow from proof generation to on-chain verification', async () => {
    // Generate proof
    const { proof, publicSignals } = await prover.prove({
      age: 25,
      balance: 150,
      countryId: 11,
      minAge: 18,
      maxAge: 99,
      minBalance: 50,
      allowedCountries: [11, 1, 5]
    });

    // Verify on-chain
    const result = await verifier.verify(proof, publicSignals, keypair);

    expect(result.success).toBe(true);
    expect(result.transactionHash).toBeDefined();
  });
});
```

## Test Utilities

### Helper Functions (`tests/utils/helpers.ts`)

```typescript
export async function deployVerifierContract(signer: ethers.Wallet): Promise<string> {
  const Verifier = await ethers.getContractFactory('Groth16Verifier', signer);
  const verifier = await Verifier.deploy();
  await verifier.deployed();
  return verifier.address;
}

export function generateRandomInputs() {
  return {
    age: Math.floor(Math.random() * 100),
    balance: Math.floor(Math.random() * 10000),
    countryId: Math.floor(Math.random() * 249) + 1,
    minAge: 18,
    maxAge: 99,
    minBalance: 50,
    allowedCountries: [11, 1, 5]
  };
}

export async function waitForTransactionConfirmation(
  txHash: string,
  provider: ethers.providers.Provider
): Promise<ethers.providers.TransactionReceipt> {
  return provider.waitForTransaction(txHash, 1);
}
```

### Blockchain Mocks (`tests/utils/blockchain_mock.ts`)

For CI environments without real blockchain:

```typescript
export class MockEVMProvider {
  async call(transaction: any): Promise<string> {
    // Mock verification always returns true
    return ethers.utils.defaultAbiCoder.encode(['bool'], [true]);
  }
}

export class MockStellarServer {
  async getTransaction(hash: string): Promise<any> {
    return {
      status: 'SUCCESS',
      resultValue: true
    };
  }
}
```

## Debugging Tests

### Verbose Output

```bash
npm test -- --verbose
```

### Run Single Test

```bash
npm test -- --testNamePattern="should verify proof on EVM"
```

### Debug Mode

```bash
node --inspect-brk node_modules/.bin/jest tests/integration/evm_verification.test.ts --runInBand
```

Then attach your debugger (VS Code, Chrome DevTools).

### Test Logs

Logs are written to `tests/logs/test.log`:

```bash
tail -f tests/logs/test.log
```

## CI/CD Integration

### GitHub Actions

Tests run automatically on:
- Pull requests
- Pushes to main branch
- Scheduled daily runs

Workflow file: `.github/workflows/test.yml`

```yaml
name: Tests

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm install
      - run: npm run test:ci
      - uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json
```

### Test Environments

- **Local**: Full blockchain nodes (Anvil, Stellar sandbox)
- **CI**: Mocked blockchain responses for speed
- **Testnet**: Real testnet deployments (scheduled runs only)

## Performance Testing

### Benchmarks

Run performance benchmarks:

```bash
npm run test:bench
```

Located in `tests/benchmarks/`:
- Proof generation time
- Verification time (on-chain and local)
- Gas costs
- Memory usage

Example output:
```
Proof Generation: 847ms
EVM Verification: 251,432 gas
Stellar Verification: 1,234,567 stroops
Memory: 125 MB
```

## Best Practices

1. **Isolation**: Tests should be independent and not rely on execution order
2. **Cleanup**: Always clean up resources in `afterAll` or `afterEach`
3. **Fixtures**: Use test fixtures for consistent test data
4. **Mocking**: Mock external dependencies in unit tests
5. **Assertions**: Use specific assertions (`toBe`, `toEqual`) not just `toBeTruthy`
6. **Async**: Always await async operations
7. **Timeouts**: Set appropriate timeouts for blockchain tests

```typescript
jest.setTimeout(30000); // 30 seconds for blockchain tests
```

## Troubleshooting

### Common Issues

**"Cannot find module"**
- Check that dependencies are installed: `npm install`
- Verify import paths are correct

**"Connection refused" (blockchain)**
- Ensure local blockchain is running
- Check RPC URLs in config

**"Timeout exceeded"**
- Increase Jest timeout: `jest.setTimeout(60000)`
- Check that blockchain is responding

**"Insufficient gas"**
- Fund test accounts properly
- Check gas estimates

## Related Documentation

- [Testing Strategy](../docs/testing/TESTING_STRATEGY.md)
- [CI/CD Workflows](../.github/workflows/)
- [SDK Guide](../docs/sdk_guide.md)
- [Contributing Guide](../CONTRIBUTING.md)

## Roadmap

See [ROADMAP.md](../ROADMAP.md) Phase 1, Milestone 1.4 for testing infrastructure goals.

Target completion: Week 5-6 of grant timeline.
