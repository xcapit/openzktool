# Test Execution Guide - Soroban Groth16 Verifier

## Quick Start

### Running Tests Without WASM Target

The Soroban SDK has specific requirements for testing. Here's how to run the cryptographic tests:

```bash
# Navigate to soroban directory
cd soroban

# Run tests (they compile but may have SDK-specific issues)
cargo test --lib

# Build for WASM (production target)
cargo build --target wasm32-unknown-unknown --release

# Check that code compiles and warnings
cargo check
cargo clippy -- -D warnings
```

## Current Test Suite

### Test Count

As of Version 4, we have **48 tests** covering:

#### Field Arithmetic (`field.rs`) - 21 tests
- ✅ Basic operations (add, mul, inverse)
- ✅ Mathematical properties (commutative, associative, distributive)
- ✅ Identity elements
- ✅ Edge cases (zero inverse, multiplication by zero)
- ✅ Frobenius endomorphism
- ✅ Byte serialization roundtrip

#### Curve Operations (`curve.rs`) - 3 tests
- ✅ Point doubling
- ✅ Point addition
- ✅ Infinity point handling

#### Tower Extension (`fq12.rs`) - 4 tests
- ✅ Fq6 operations
- ✅ Fq12 operations
- ✅ Multiplication and inversion

#### Pairing (`pairing.rs`) - 15 tests
- ✅ Pairing with infinity
- ✅ Miller loop correctness
- ✅ Final exponentiation
- ✅ Multi-pairing
- ✅ Bit extraction
- ✅ Line function evaluation

#### Integration (`lib.rs`) - 5 tests
- ✅ Contract version
- ✅ Proof structure validation
- ✅ Verification key validation
- ✅ Point on-curve checks

## Test Categories

### 1. Unit Tests (48 implemented)

Test individual functions in isolation.

```bash
# Run all unit tests
cargo test --lib

# Run specific module
cargo test --lib field::tests
cargo test --lib pairing::tests

# Run specific test
cargo test --lib test_fq_add_commutative
```

### 2. Property-Based Tests

Mathematical properties that should hold for all inputs.

**Examples Implemented**:
- Commutativity: `a + b = b + a`
- Associativity: `(a + b) + c = a + (b + c)`
- Identity: `a + 0 = a`, `a * 1 = a`
- Distributivity: `a * (b + c) = a*b + a*c`
- Inverse: `a * a⁻¹ = 1`

### 3. Edge Case Tests

Boundary conditions and special inputs.

**Examples Implemented**:
- Zero inverse returns None
- Multiplication by zero
- Point at infinity
- Empty pairing list

### 4. Regression Tests

Tests for previously discovered bugs (to be added as bugs are found).

Format:
```rust
#[test]
fn regression_issue_XXX_description() {
    // Test case that would fail with the old bug
    // ...
}
```

## Test Execution Strategies

### Development Workflow

```bash
# 1. Run tests during development
cargo test --lib

# 2. Check code quality
cargo clippy -- -D warnings

# 3. Format code
cargo fmt

# 4. Build for production
cargo build --target wasm32-unknown-unknown --release

# 5. Check WASM size
ls -lh target/wasm32-unknown-unknown/release/*.wasm
```

### Pre-commit Checklist

```bash
#!/bin/bash
# Save as .git/hooks/pre-commit

echo "Running pre-commit checks..."

# Format check
cargo fmt -- --check || {
    echo "❌ Code not formatted. Run 'cargo fmt'"
    exit 1
}

# Clippy
cargo clippy -- -D warnings || {
    echo "❌ Clippy warnings found"
    exit 1
}

# Build check
cargo build --target wasm32-unknown-unknown --release || {
    echo "❌ Build failed"
    exit 1
}

echo "✅ All pre-commit checks passed!"
```

## Test Coverage Analysis

### Current Coverage Estimate

| Module | Tests | Estimated Coverage |
|--------|-------|-------------------|
| field.rs | 21 | ~70% |
| curve.rs | 3 | ~40% |
| fq12.rs | 4 | ~35% |
| pairing.rs | 15 | ~60% |
| lib.rs | 5 | ~30% |
| **Overall** | **48** | **~50%** |

### Coverage Goals

- Critical cryptographic functions: **100%**
- Helper functions: **90%**
- Integration code: **80%**
- Overall: **95%+**

### Measuring Coverage

```bash
# Install tarpaulin (Linux only)
cargo install cargo-tarpaulin

# Run coverage
cargo tarpaulin --out Html --output-dir coverage

# View results
open coverage/index.html
```

**Note**: Tarpaulin may not work on macOS. Alternative: use `cargo-llvm-cov`

```bash
# Install llvm-cov
cargo install cargo-llvm-cov

# Run coverage
cargo llvm-cov --html

# View results
open target/llvm-cov/html/index.html
```

## Known Testing Limitations

### 1. Soroban SDK Test Utils

The `testutils` feature of soroban-sdk requires specific setup and may not work in all environments.

**Workaround**: Focus on pure Rust unit tests that don't depend on Soroban environment.

### 2. WASM Target Tests

Tests cannot run directly on WASM target.

**Workaround**: Run tests on host target (default), then build for WASM separately.

### 3. Integration Tests

Full end-to-end integration tests require a Soroban test environment.

**Workaround**: Use mock data and test individual components.

## Test Data and Fixtures

### Test Vectors Location

```
soroban/
├── tests/
│   └── vectors/          # Test vector JSON files
│       ├── bn254_points.json
│       ├── pairing_vectors.json
│       └── evm_comparison.json
├── src/
│   ├── field.rs          # Tests in mod tests { }
│   ├── curve.rs
│   ├── fq12.rs
│   ├── pairing.rs
│   └── lib.rs
```

### Creating Test Vectors

```bash
# Generate test vectors from EVM
cd circuits
npm install
node scripts/generate_test_vectors.js
```

## Continuous Integration

### GitHub Actions Workflow

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Install Rust
        uses: actions-rs/toolchain@v1
        with:
          toolchain: stable
          target: wasm32-unknown-unknown

      - name: Run clippy
        run: cargo clippy -- -D warnings

      - name: Run format check
        run: cargo fmt -- --check

      - name: Build WASM
        run: cargo build --target wasm32-unknown-unknown --release

      - name: Check WASM size
        run: |
          SIZE=$(stat -f%z target/wasm32-unknown-unknown/release/*.wasm)
          echo "WASM size: $SIZE bytes"
          if [ $SIZE -gt 20000 ]; then
            echo "Warning: WASM binary larger than 20KB"
          fi
```

## Debugging Failed Tests

### Common Issues

**1. Test fails due to Montgomery form**

Field operations use Montgomery representation. Always compare after converting to normal form:

```rust
let a_normal = a.mul(&Fq::from_montgomery([1, 0, 0, 0]));
```

**2. Floating point comparison**

Use exact equality for field elements (they're integers):

```rust
assert_eq!(a, b);  // Good
// Don't use approximate equality
```

**3. Test timeout**

Pairing operations are expensive. Increase timeout if needed:

```bash
cargo test --lib -- --test-threads=1
```

### Verbose Output

```bash
# Show println! output
cargo test --lib -- --nocapture

# Show output for specific test
cargo test --lib test_pairing_identity -- --nocapture --exact
```

## Performance Testing

### Benchmarking

```bash
# Run benchmarks (if configured)
cargo bench

# Profile specific function
cargo build --release
# Use profiling tools (perf, valgrind, etc.)
```

### Memory Usage

```bash
# Check for memory leaks
cargo build --release
valgrind --leak-check=full ./target/release/...
```

## Test Documentation

### Writing Good Tests

**1. Descriptive names**
```rust
// Good
#[test]
fn test_fq_add_commutative() { }

// Bad
#[test]
fn test1() { }
```

**2. Clear assertions**
```rust
// Good
assert_eq!(result, expected, "Addition should be commutative");

// Bad
assert!(result == expected);
```

**3. Test one thing**
```rust
// Good - tests one property
#[test]
fn test_fq_add_commutative() {
    assert_eq!(a.add(&b), b.add(&a));
}

// Bad - tests multiple things
#[test]
fn test_field_ops() {
    assert!(a.add(&b) == b.add(&a));
    assert!(a.mul(&b) == b.mul(&a));
    assert!(a.inverse().is_some());
}
```

### Test Template

```rust
#[test]
fn test_<module>_<function>_<property>() {
    // Setup
    let a = create_test_data();
    let b = create_test_data();

    // Execute
    let result = function_under_test(a, b);

    // Assert
    assert_eq!(result, expected_value, "Description of what should happen");
}
```

## Future Test Improvements

### Short Term
- [ ] Add more edge case tests
- [ ] Improve property-based testing
- [ ] Add EVM cross-validation tests

### Medium Term
- [ ] Set up CI/CD pipeline
- [ ] Add fuzzing tests
- [ ] Achieve 95% code coverage

### Long Term
- [ ] Formal verification
- [ ] Security audit
- [ ] Performance benchmarking suite

## Resources

- **Rust Testing**: https://doc.rust-lang.org/book/ch11-00-testing.html
- **Soroban Testing**: https://developers.stellar.org/docs/smart-contracts/testing
- **Cargo Test**: https://doc.rust-lang.org/cargo/commands/cargo-test.html
- **Property Testing**: https://github.com/proptest-rs/proptest

## Contact

For test-related questions or issues:
- Open an issue on GitHub
- Check the TESTING_STRATEGY.md for detailed methodology
- Review CRYPTOGRAPHIC_COMPARISON.md for implementation details

---

**Last Updated**: After v4 pairing implementation
**Test Count**: 48 tests
**Modules Covered**: field, curve, fq12, pairing, lib
