# Good First Issues - Examples

> **For Maintainers:** Use these examples as templates when creating good first issues for new contributors.

> **For Contributors:** These examples show what a well-structured first contribution looks like.

---

## Example 1: Documentation Improvement

**Title:** [Good First Issue] Add code comments to SDK Prover class

**Component:** SDK/API
**Skills Required:** TypeScript, Documentation
**Difficulty:** Very Easy (< 1 hour)

**Task Description:**
The `Prover` class in `sdk/src/prover/Prover.ts` needs JSDoc comments explaining each method's purpose, parameters, and return values.

**Acceptance Criteria:**
- [ ] Add JSDoc comments to all public methods in `Prover.ts`
- [ ] Include `@param` tags for all parameters
- [ ] Include `@returns` tag for return values
- [ ] Include `@example` with a code snippet
- [ ] Follow TypeScript documentation standards

**Files to Modify:**
- `sdk/src/prover/Prover.ts`

**Implementation Guidance:**
1. Fork the repository
2. Navigate to `sdk/src/prover/Prover.ts`
3. Add JSDoc comments above each method following this format:
```typescript
/**
 * Generates a zero-knowledge proof for the given inputs
 *
 * @param inputs - The circuit inputs containing age, balance, country
 * @returns Promise containing the generated proof and public signals
 * @throws Error if proof generation fails
 *
 * @example
 * ```typescript
 * const prover = new Prover(config);
 * const { proof, publicSignals } = await prover.generateProof({
 *   age: 25,
 *   balance: 150,
 *   country: 32
 * });
 * ```
 */
async generateProof(inputs: CircuitInputs): Promise<{ proof: Proof; publicSignals: PublicSignals }> {
  // ...
}
```
4. Run `npm run lint` to verify formatting
5. Submit a PR with title: "docs: add JSDoc comments to Prover class"

**Helpful Resources:**
- [TypeScript JSDoc Documentation](https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html)
- [Good JSDoc examples](https://jsdoc.app/tags-example.html)
- [CONTRIBUTING.md](../CONTRIBUTING.md)

---

## Example 2: Add Missing Test

**Title:** [Good First Issue] Add test for invalid proof input

**Component:** Tests
**Skills Required:** JavaScript/TypeScript, Testing
**Difficulty:** Easy (1-2 hours)

**Task Description:**
The SDK needs a test to verify that the `generateProof` function properly handles invalid inputs (e.g., negative age, null values).

**Acceptance Criteria:**
- [ ] Create a new test file or add to existing tests
- [ ] Test at least 3 invalid input scenarios:
  - Negative age
  - Missing required field
  - Invalid data type
- [ ] Each test should verify the correct error is thrown
- [ ] All tests pass (`npm test`)
- [ ] Test coverage increases

**Files to Modify:**
- `sdk/test/prover.test.ts` (or create if doesn't exist)

**Implementation Guidance:**
1. Fork and clone the repository
2. Navigate to `sdk/test/`
3. Create or edit `prover.test.ts`:
```typescript
describe('Prover - Invalid Inputs', () => {
  it('should throw error for negative age', async () => {
    const prover = new Prover(config);

    await expect(prover.generateProof({
      age: -5,
      balance: 150,
      country: 32
    })).rejects.toThrow('Age must be positive');
  });

  it('should throw error for missing required field', async () => {
    // Your implementation
  });

  it('should throw error for invalid data type', async () => {
    // Your implementation
  });
});
```
4. Run `npm test` to verify tests pass
5. Run `npm run test:coverage` to check coverage
6. Submit PR with title: "test: add invalid input tests for Prover"

**Helpful Resources:**
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Jest Expect API](https://jestjs.io/docs/expect)
- [Testing Guide](../../docs/testing/README.md)

---

## Example 3: Improve README Example

**Title:** [Good First Issue] Add error handling example to basic-proof README

**Component:** Examples
**Skills Required:** Markdown, JavaScript
**Difficulty:** Very Easy (< 1 hour)

**Task Description:**
The basic proof example in `examples/1-basic-proof/README.md` doesn't show how to handle errors. Add a section demonstrating proper error handling.

**Acceptance Criteria:**
- [ ] Add "Error Handling" section to README
- [ ] Include code example with try/catch
- [ ] Show at least 2 common error scenarios
- [ ] Use clear, beginner-friendly language
- [ ] Markdown renders correctly

**Files to Modify:**
- `examples/1-basic-proof/README.md`

**Implementation Guidance:**
1. Fork the repository
2. Open `examples/1-basic-proof/README.md`
3. After the basic usage section, add:

```markdown
## 🚨 Error Handling

Always wrap proof generation in try/catch to handle errors gracefully:

\`\`\`javascript
const { OpenZKTool } = require('@openzktool/sdk');

async function generateProofSafely() {
  try {
    const zktool = new OpenZKTool({
      wasmPath: './circuits/kyc_transfer.wasm',
      zkeyPath: './circuits/kyc_transfer_final.zkey'
    });

    const { proof, publicSignals } = await zktool.generateProof({
      age: 25,
      balance: 150,
      country: 32
    });

    console.log('✅ Proof generated successfully');
    return { proof, publicSignals };

  } catch (error) {
    if (error.message.includes('Circuit file not found')) {
      console.error('❌ Circuit files missing. Run: npm run setup');
    } else if (error.message.includes('Invalid input')) {
      console.error('❌ Invalid input values. Check your data.');
    } else {
      console.error('❌ Proof generation failed:', error.message);
    }
    throw error;
  }
}
\`\`\`

### Common Errors

**Error:** "Circuit file not found"
**Solution:** Run `npm run setup` to generate circuit files

**Error:** "Invalid input: age must be positive"
**Solution:** Check that all input values are valid (age > 0, balance >= 0)
```

4. Preview the markdown to ensure formatting is correct
5. Submit PR with title: "docs: add error handling to basic-proof example"

**Helpful Resources:**
- [Markdown Guide](https://www.markdownguide.org/basic-syntax/)
- [GitHub Flavored Markdown](https://github.github.com/gfm/)

---

## Example 4: Fix Typos

**Title:** [Good First Issue] Fix typos in documentation

**Component:** Documentation
**Skills Required:** English, Attention to detail
**Difficulty:** Very Easy (< 30 minutes)

**Task Description:**
We've identified several typos in our documentation that need correction. This is a great first contribution!

**Known Typos:**
- `docs/getting-started/quickstart.md` line 45: "recieve" → "receive"
- `sdk/README.md` line 89: "seperate" → "separate"
- `CONTRIBUTING.md` line 123: "occured" → "occurred"

**Acceptance Criteria:**
- [ ] All identified typos are fixed
- [ ] No new typos introduced
- [ ] Markdown still renders correctly
- [ ] Changes are minimal (only typo fixes)

**Implementation Guidance:**
1. Fork the repository
2. Fix each typo in the listed files
3. Use a spell checker to find any additional typos in those files
4. Commit with message: "docs: fix typos in documentation"
5. Submit PR

**Note:** This is a great way to familiarize yourself with the codebase!

---

## Example 5: Add Example Use Case

**Title:** [Good First Issue] Add credit score verification example to custom circuit docs

**Component:** Examples
**Skills Required:** Markdown, Understanding of ZK concepts
**Difficulty:** Medium (2-4 hours)

**Task Description:**
The custom circuit documentation mentions credit score verification as a use case but doesn't provide a concrete example. Add a detailed example showing how someone would implement this.

**Acceptance Criteria:**
- [ ] Add "Credit Score Proof" section to `examples/5-custom-circuit/README.md`
- [ ] Include circuit pseudo-code or structure
- [ ] Explain the privacy benefits
- [ ] Show example inputs/outputs
- [ ] Link to relevant resources

**Files to Modify:**
- `examples/5-custom-circuit/README.md`

**Implementation Guidance:**
1. Research how credit score proofs work (resources below)
2. Add a new section after "Age Verification Circuit":

```markdown
### Credit Score Verification Circuit

\`\`\`circom
pragma circom 2.1.9;

/**
 * Credit Score Proof
 *
 * Proves that credit score >= minScore without revealing exact score
 * Useful for: Loan applications, rental applications, credit cards
 */
template CreditScoreProof() {
    signal input creditScore;      // Private (e.g., 750)
    signal input minScore;          // Public (e.g., 650)
    signal output isQualified;      // Public (1 = qualified)

    // Implementation here
    // (Structure only - full implementation in next phase)
}

component main = CreditScoreProof();
\`\`\`

**Use Case:**
- **Problem:** Banks require proof of creditworthiness but don't need exact score
- **Solution:** Prove score >= 650 without revealing it's actually 750
- **Privacy Benefit:** User maintains financial privacy while proving eligibility

**Example:**
\`\`\`json
{
  "creditScore": 750,    // Private
  "minScore": 650        // Public
}
\`\`\`

**Output:**
\`\`\`json
{
  "isQualified": 1       // 1 = qualified, 0 = not qualified
}
\`\`\`
```

3. Submit PR with title: "docs: add credit score example to custom circuits"

**Helpful Resources:**
- [Range Proofs Explained](https://zkp.science/)
- [Circom Documentation](https://docs.circom.io/)
- Existing examples in the same file

---

## How to Find Good First Issues

**For Contributors:**
1. Visit: https://github.com/xcapit/openzktool/labels/good%20first%20issue
2. Look for issues labeled `good first issue` and `help wanted`
3. Read the issue description carefully
4. Comment on the issue to claim it
5. Follow the implementation guidance
6. Ask questions if you're stuck!

**For Maintainers:**
When creating good first issues:
- ✅ Keep scope small and focused
- ✅ Provide clear, step-by-step guidance
- ✅ Link to relevant resources
- ✅ Define success criteria explicitly
- ✅ Be available to answer questions
- ✅ Tag with appropriate skill labels

---

**Questions?** Join our [Discussions](https://github.com/xcapit/openzktool/discussions) or comment on the issue!
