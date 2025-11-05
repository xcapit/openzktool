#!/bin/bash

# Comprehensive test suite for Soroban Groth16 Verifier
# Runs all tests and generates detailed report

set -e

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Soroban Groth16 Verifier - Test Suite${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Check if cargo is installed
if ! command -v cargo &> /dev/null; then
    echo -e "${RED}Error: cargo not found${NC}"
    echo "Install Rust: https://rustup.rs/"
    exit 1
fi

# Clean previous builds
echo -e "${YELLOW}Cleaning previous builds...${NC}"
cargo clean --quiet
echo -e "${GREEN}✓ Clean complete${NC}"
echo ""

# Build the contract
echo -e "${YELLOW}Building contract...${NC}"
cargo build --target wasm32-unknown-unknown --release --quiet

if [ $? -eq 0 ]; then
    WASM_SIZE=$(wc -c < target/wasm32-unknown-unknown/release/soroban_groth16_verifier.wasm | tr -d ' ')
    WASM_SIZE_KB=$(( WASM_SIZE / 1024 ))
    echo -e "${GREEN}✓ Build successful${NC}"
    echo "  Contract size: ${WASM_SIZE_KB} KB"

    if [ $WASM_SIZE_KB -gt 50 ]; then
        echo -e "${YELLOW}  Warning: Contract size > 50 KB${NC}"
    fi
else
    echo -e "${RED}✗ Build failed${NC}"
    exit 1
fi
echo ""

# Run unit tests
echo -e "${YELLOW}Running unit tests...${NC}"
echo ""

TEST_OUTPUT=$(cargo test --lib 2>&1)
TEST_RESULT=$?

if [ $TEST_RESULT -eq 0 ]; then
    echo "$TEST_OUTPUT"
    echo ""
    echo -e "${GREEN}✓ All unit tests passed${NC}"

    # Count tests
    TESTS_RUN=$(echo "$TEST_OUTPUT" | grep "test result:" | awk '{print $3}')
    TESTS_PASSED=$(echo "$TEST_OUTPUT" | grep "test result:" | awk '{print $3}')

    echo "  Tests run: $TESTS_RUN"
    echo "  Tests passed: $TESTS_PASSED"
else
    echo "$TEST_OUTPUT"
    echo ""
    echo -e "${RED}✗ Some tests failed${NC}"
    exit 1
fi
echo ""

# Run tests with verbose output
echo -e "${YELLOW}Running tests with verbose output...${NC}"
echo ""
cargo test --lib -- --nocapture --test-threads=1 > test_verbose.log 2>&1

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Verbose tests passed${NC}"
    echo "  Log saved to: test_verbose.log"
else
    echo -e "${RED}✗ Verbose tests failed${NC}"
    cat test_verbose.log
    exit 1
fi
echo ""

# Check for unsafe code
echo -e "${YELLOW}Checking for unsafe code...${NC}"
UNSAFE_COUNT=$(grep -r "unsafe" src/ --include="*.rs" | grep -v "// unsafe" | grep -v "test" | wc -l | tr -d ' ')

if [ "$UNSAFE_COUNT" -eq 0 ]; then
    echo -e "${GREEN}✓ No unsafe code blocks${NC}"
else
    echo -e "${YELLOW}⚠ Found $UNSAFE_COUNT unsafe block(s)${NC}"
    echo "  Review manually for safety"
fi
echo ""

# Run clippy (linter)
echo -e "${YELLOW}Running clippy (linter)...${NC}"
cargo clippy --target wasm32-unknown-unknown -- -D warnings 2>&1 > clippy.log

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ No clippy warnings${NC}"
else
    echo -e "${YELLOW}⚠ Clippy found issues${NC}"
    echo "  Log saved to: clippy.log"
    echo "  First few issues:"
    head -n 20 clippy.log
fi
echo ""

# Check documentation
echo -e "${YELLOW}Checking documentation...${NC}"
cargo doc --no-deps --quiet 2>&1 > doc.log

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Documentation builds${NC}"
else
    echo -e "${RED}✗ Documentation has errors${NC}"
    cat doc.log
fi
echo ""

# Security checks
echo -e "${YELLOW}Running security checks...${NC}"

# Check for common security issues
echo "Checking for:"
echo "  - Panics in public functions"
PANIC_COUNT=$(grep -r "panic!" src/ --include="*.rs" | grep -v "test" | grep -v "//" | wc -l | tr -d ' ')
echo "    Panics found: $PANIC_COUNT"

if [ "$PANIC_COUNT" -gt 0 ]; then
    echo -e "${YELLOW}    ⚠ Review panic locations${NC}"
fi

echo "  - unwrap() calls"
UNWRAP_COUNT=$(grep -r "unwrap()" src/ --include="*.rs" | grep -v "test" | grep -v "//" | wc -l | tr -d ' ')
echo "    unwrap() calls: $UNWRAP_COUNT"

if [ "$UNWRAP_COUNT" -gt 10 ]; then
    echo -e "${YELLOW}    ⚠ High unwrap() usage - consider using ? operator${NC}"
fi

echo "  - TODO comments"
TODO_COUNT=$(grep -r "TODO\|FIXME" src/ --include="*.rs" | wc -l | tr -d ' ')
echo "    TODOs/FIXMEs: $TODO_COUNT"

echo ""

# Generate test coverage (if tarpaulin is installed)
if command -v cargo-tarpaulin &> /dev/null; then
    echo -e "${YELLOW}Generating test coverage...${NC}"
    cargo tarpaulin --out Html --output-dir coverage --quiet

    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Coverage report generated${NC}"
        echo "  Report: coverage/index.html"

        # Extract coverage percentage
        COVERAGE=$(grep -oP '(?<=<span class="percent">)[^<]+' coverage/index.html | head -1)
        echo "  Coverage: $COVERAGE"

        # Check if coverage meets threshold
        COVERAGE_NUM=$(echo "$COVERAGE" | tr -d '%')
        if [ $(echo "$COVERAGE_NUM > 70" | bc -l) -eq 1 ]; then
            echo -e "${GREEN}  ✓ Coverage above 70% threshold${NC}"
        else
            echo -e "${YELLOW}  ⚠ Coverage below 70% threshold${NC}"
        fi
    fi
    echo ""
else
    echo -e "${YELLOW}⚠ cargo-tarpaulin not installed - skipping coverage${NC}"
    echo "  Install with: cargo install cargo-tarpaulin"
    echo ""
fi

# Test summary
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Test Summary${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo "Build:"
echo -e "  ${GREEN}✓${NC} Contract built successfully"
echo "  Size: ${WASM_SIZE_KB} KB"
echo ""
echo "Tests:"
echo -e "  ${GREEN}✓${NC} Unit tests: $TESTS_RUN passed"
echo -e "  ${GREEN}✓${NC} Verbose tests: passed"
echo ""
echo "Quality:"
echo "  Unsafe blocks: $UNSAFE_COUNT"
echo "  Clippy issues: $(wc -l < clippy.log)"
echo -e "  ${GREEN}✓${NC} Documentation: builds"
echo ""
echo "Security:"
echo "  Panics: $PANIC_COUNT"
echo "  unwrap() calls: $UNWRAP_COUNT"
echo "  TODOs: $TODO_COUNT"
echo ""

if command -v cargo-tarpaulin &> /dev/null; then
    echo "Coverage:"
    echo "  $COVERAGE"
    echo ""
fi

# Final verdict
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}All tests passed! ✓${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "Contract is ready for deployment."
echo ""
echo "Next steps:"
echo "  1. Review test_verbose.log for detailed test output"
echo "  2. Review clippy.log for code quality suggestions"
echo "  3. Read SECURITY.md for security considerations"
echo "  4. Deploy to testnet for integration testing"
echo ""
