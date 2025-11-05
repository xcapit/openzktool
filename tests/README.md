# Integration Tests

> Complete integration and end-to-end testing for OpenZKTool

## 📁 Structure

```
tests/
├── integration/              # Integration tests
│   ├── evm_verification.test.ts
│   ├── soroban_verification.test.ts
│   └── multi_chain.test.ts
├── e2e/                      # End-to-end tests
│   ├── proof_generation.test.ts
│   ├── evm_deploy_verify.test.ts
│   └── soroban_deploy_verify.test.ts
├── fixtures/                 # Test data
│   ├── circuits/
│   ├── proofs/
│   └── contracts/
└── utils/                    # Test utilities
    ├── setup.ts
    ├── helpers.ts
    └── cleanup.ts
```

## 🚀 Running Tests

### All Tests
```bash
npm test
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
npm test -- evm_verification
npm test -- soroban_verification
npm test -- multi_chain
```

### With Coverage
```bash
npm run test:coverage
```

## 🧪 Test Categories

### Integration Tests
Test component interactions without external dependencies:
- Circuit compilation → Proof generation
- SDK → Contract interaction
- Multi-chain verification flow

### End-to-End Tests
Test complete user flows with real/mocked blockchain:
- Deploy contract → Generate proof → Verify on-chain
- Full multi-chain deployment
- Real network interactions (testnet)

## ⚙️ Test Configuration

Tests use different configurations based on environment:

```typescript
// Local development
process.env.TEST_ENV = 'local'
// Uses local Anvil/Stellar sandbox

// CI/CD pipeline
process.env.TEST_ENV = 'ci'
// Uses mocked blockchain responses

// Testnet
process.env.TEST_ENV = 'testnet'
// Uses real testnet deployments
```

## Prerequisites

### Local Testing
```bash
# Install dependencies
npm install

# Setup circuit artifacts
cd circuits && bash scripts/prepare_and_setup.sh

# Start local blockchain (for EVM tests)
anvil

# Start Stellar sandbox (for Soroban tests)
docker run -d -p 8000:8000 stellar/quickstart:testing --standalone
```

### CI/CD Testing
All prerequisites are handled by GitHub Actions workflows.

## Coverage Goals

- **Unit Tests:** 80%+ coverage
- **Integration Tests:** 70%+ coverage
- **Critical Paths:** 100% coverage

## 📝 Writing Tests

### Integration Test Template

```typescript
import { OpenZKTool } from '../sdk/src';
import { deployContract } from './utils/helpers';

describe('EVM Verification Integration', () => {
  let zktool: OpenZKTool;
  let contractAddress: string;

  beforeAll(async () => {
    // Setup
    zktool = new OpenZKTool(config);
    contractAddress = await deployContract();
  });

  afterAll(async () => {
    // Cleanup
  });

  it('should verify proof on EVM', async () => {
    // Test implementation
  });
});
```

## 🐛 Debugging Tests

### Verbose Output
```bash
npm test -- --verbose
```

### Debug Specific Test
```bash
node --inspect-brk node_modules/.bin/jest integration/evm_verification.test.ts
```

### Check Test Logs
```bash
tail -f tests/logs/test.log
```

## 🔗 Related Documentation

- [Testing Strategy](../docs/testing/TESTING_STRATEGY.md)
- [CI/CD Workflows](../.github/workflows/)
- [Contributing Guide](../CONTRIBUTING.md)

---

**Status:** 🚧 Structure created - Tests implementation in progress
