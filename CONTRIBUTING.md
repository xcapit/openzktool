# Contributing to OpenZKTool

Thanks for your interest in contributing. This document has guidelines for contributing to the project.

## Code of Conduct

This project follows our [Code of Conduct](./docs/governance/CODE_OF_CONDUCT.md). By participating, you're expected to uphold this code.

## Getting Started

### Prerequisites

You need:

- Node.js >= v18.17.0 (check with `node --version`)
- Rust >= 1.70.0 with `wasm32-unknown-unknown` target
- Circom >= 2.1.9
- Stellar CLI (for Soroban development)
- Foundry (for EVM contracts)
- Git

### Development Setup

1. Fork the repository
   ```bash
   git clone https://github.com/YOUR_USERNAME/stellar-privacy-poc.git
   cd stellar-privacy-poc
   ```

2. Install dependencies
   ```bash
   npm install
   cd web && npm install && cd ..
   ```

3. Set up Rust toolchain
   ```bash
   rustup target add wasm32-unknown-unknown
   cd soroban && cargo build && cd ..
   ```

4. Run tests
   ```bash
   # Soroban tests
   cd soroban && cargo test --lib

   # EVM tests
   cd evm-verification && forge test

   # Circuit tests
   cd circuits/scripts && bash prove_and_verify.sh
   ```

## Contribution Workflow

### 1. Choose an Issue

- Browse [open issues](https://github.com/xcapit/stellar-privacy-poc/issues)
- Look for issues labeled `good first issue` or `help wanted`
- Comment on the issue to let others know you're working on it

### 2. Create a Branch

Use descriptive branch names:

```bash
git checkout -b feature/add-stellar-integration
git checkout -b fix/proof-generation-bug
git checkout -b docs/update-testing-guide
git checkout -b refactor/optimize-pairing
```

**Branch naming conventions:**
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Test additions/improvements
- `chore/` - Maintenance tasks

### 3. Make Changes

Follow our coding standards (see below).

### 4. Commit Your Changes

We use [Conventional Commits](https://www.conventionalcommits.org/):

```bash
git commit -m "feat: add Stellar integration for proof verification"
git commit -m "fix: resolve pairing computation overflow"
git commit -m "docs: update API documentation"
git commit -m "test: add integration tests for EVM"
```

**Commit message format:**
```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Types:**
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation
- `style` - Formatting, missing semicolons, etc.
- `refactor` - Code restructuring
- `test` - Adding tests
- `chore` - Maintenance

### 5. Push and Create Pull Request

```bash
git push origin feature/your-feature-name
```

Then open a Pull Request on GitHub with:
- Clear description of changes
- Reference to related issues
- Screenshots (if UI changes)
- Test results

## Coding Standards

### TypeScript/JavaScript

```typescript
// Use TypeScript for all new code
// Follow ESLint rules
// Add JSDoc comments for public APIs

/**
 * Generate a zero-knowledge proof
 *
 * @param inputs - Circuit inputs
 * @returns Proof and public signals
 */
async function generateProof(inputs: ProofInputs): Promise<Proof> {
  // Implementation
}
```

Style guide:
- Use `const` over `let` when possible
- Prefer `async/await` over promises
- Use meaningful variable names
- Add types for all function parameters and return values
- Maximum line length: 100 characters

### Rust

```rust
// Follow Rust naming conventions
// Use `cargo fmt` before committing
// Add documentation comments

/// Generate a zero-knowledge proof
///
/// # Arguments
/// * `inputs` - Circuit inputs
///
/// # Returns
/// * Proof structure
pub fn generate_proof(inputs: &ProofInputs) -> Result<Proof, Error> {
    // Implementation
}
```

Style guide:
- Run `cargo fmt` before committing
- Run `cargo clippy -- -D warnings`
- Add tests for all public functions
- Use `Result<T, E>` for error handling
- Document all public APIs

### Solidity

```solidity
// Use Solidity 0.8+
// Follow Solidity style guide
// Add NatSpec comments

/**
 * @notice Verify a Groth16 proof
 * @param proof The proof to verify
 * @param publicSignals Public inputs
 * @return bool True if proof is valid
 */
function verifyProof(
    uint256[2] calldata proof,
    uint256[1] calldata publicSignals
) public view returns (bool) {
    // Implementation
}
```

Style guide:
- Use `forge fmt` before committing
- Follow [Solidity Style Guide](https://docs.soliditylang.org/en/latest/style-guide.html)
- Add comprehensive tests with Foundry
- Check gas optimization

### Circom

```circom
// Add comments explaining circuit logic
// Use meaningful signal names
// Document constraints

/*
 * KYC Transfer Circuit
 *
 * Verifies:
 * - Age is within range
 * - Balance meets minimum
 * - Country is allowed
 */
template KYCTransfer() {
    signal input age;
    signal input balance;
    // ...
}
```

## Testing Requirements

### Unit Tests

All new code must include unit tests:

**Rust (Soroban):**
```rust
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_proof_verification() {
        // Test implementation
    }
}
```

**TypeScript:**
```typescript
describe('Prover', () => {
  it('should generate valid proof', async () => {
    // Test implementation
  });
});
```

**Solidity:**
```solidity
contract VerifierTest is Test {
    function testVerifyProof() public {
        // Test implementation
    }
}
```

### Integration Tests

For features touching multiple components, add integration tests.

### Test Coverage

- Aim for >80% code coverage
- Critical paths must have 100% coverage
- Run coverage reports:
  ```bash
  # Rust
  cargo tarpaulin --out Html

  # TypeScript
  npm run test:coverage

  # Solidity
  forge coverage
  ```

## Documentation

### Code Documentation

- Add JSDoc/RustDoc/NatSpec comments for all public APIs
- Include examples in documentation
- Update README.md if adding new features

### User Documentation

Update relevant docs in `docs/`:
- `docs/guides/` - User guides
- `docs/architecture/` - Technical documentation
- `docs/testing/` - Testing guides

### CHANGELOG

Update `CHANGELOG.md` with your changes:

```markdown
## [Unreleased]

### Added
- New feature X (#123)

### Fixed
- Bug in Y component (#124)
```

## Code Review Process

1. Self-Review
   - Review your own code before submitting
   - Run all tests locally
   - Check formatting and linting
   - Update documentation

2. Automated Checks
   - CI/CD will run tests automatically
   - All checks must pass before merge
   - Fix any failing tests or linting issues

3. Peer Review
   - At least 1 approval required
   - Address reviewer comments
   - Push updates to the same PR branch

4. Merge
   - Squash and merge (default)
   - Delete branch after merge

## Project Structure

```
stellar-privacy-poc/
├── circuits/          # Circom circuits
├── contracts/         # Legacy contracts
├── evm-verification/  # EVM verifier
├── soroban/          # Soroban verifier
├── sdk/              # TypeScript SDK (structure only)
├── examples/         # Integration examples
├── web/              # Landing page
├── docs/             # Documentation
├── scripts/          # Build/demo scripts
└── .github/          # CI/CD workflows
```

## Reporting Bugs

Use the [Bug Report](https://github.com/xcapit/stellar-privacy-poc/issues/new?template=bug_report.md) template.

Include:
- Description of the bug
- Steps to reproduce
- Expected vs actual behavior
- Environment details (OS, Node version, etc.)
- Screenshots if applicable

## Suggesting Features

Use the [Feature Request](https://github.com/xcapit/stellar-privacy-poc/issues/new?template=feature_request.md) template.

Include:
- Clear description of the feature
- Use case / motivation
- Proposed implementation (if any)
- Alternatives considered

## Security Issues

DO NOT open public issues for security vulnerabilities.

See [SECURITY.md](./SECURITY.md) for reporting process.

## Release Process

1. Update version in `package.json`, `Cargo.toml`, etc.
2. Update `CHANGELOG.md`
3. Create release branch: `release/v0.2.0`
4. Run full test suite
5. Create GitHub release with tag
6. Deploy to npm (SDK), Vercel (web), etc.

## Recognition

Contributors will be:
- Listed in `CHANGELOG.md`
- Credited in release notes
- Added to `README.md` if significant contribution

## Getting Help

- GitHub Discussions: [Ask questions](https://github.com/xcapit/stellar-privacy-poc/discussions)
- Discord: (Coming soon)
- Email: fboiero@frvm.utn.edu.ar

## Resources

### Learning Resources
- [Circom Documentation](https://docs.circom.io/)
- [Groth16 Paper](https://eprint.iacr.org/2016/260.pdf)
- [Soroban Docs](https://soroban.stellar.org/)
- [Foundry Book](https://book.getfoundry.sh/)

### Project Documentation
- [Architecture Overview](./docs/architecture/overview.md)
- [Testing Strategy](./docs/testing/TESTING_STRATEGY.md)
- [FAQ](./docs/FAQ.md)

## Checklist Before Submitting PR

- [ ] Code follows project style guidelines
- [ ] All tests pass locally
- [ ] Added/updated tests for changes
- [ ] Documentation updated
- [ ] CHANGELOG.md updated
- [ ] Commit messages follow convention
- [ ] No merge conflicts
- [ ] Self-reviewed the code

---

Thanks for contributing to OpenZKTool!

Every contribution helps make privacy accessible to everyone.
