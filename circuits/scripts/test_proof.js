const snarkjs = require("snarkjs");
const buildPoseidon = require("circomlibjs").buildPoseidon;
const fs = require("fs");
const path = require("path");

async function testProofGeneration() {
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("🧪 Testing Zero-Knowledge Proof Generation");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("");

    try {
        // Initialize Poseidon hasher
        console.log("⚙️  Initializing Poseidon hash function...");
        const poseidon = await buildPoseidon();
        const F = poseidon.F;
        
        // Test case: Basic proof
        console.log("");
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        console.log("Test: Generating Proof");
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        console.log("");
        
        const secretValue = 12345n;
        const publicHash = F.toString(poseidon([secretValue]));
        
        console.log(`🔐 Secret Value: ${secretValue} (PRIVATE - not revealed)`);
        console.log(`📊 Public Hash: ${publicHash.slice(0,40)}... (PUBLIC)`);
        console.log("");
        console.log("💡 Key Point: The proof will show the hash is correct");
        console.log("   WITHOUT revealing the secret value!");
        console.log("");
        
        // Prepare inputs
        const input = {
            secretValue: secretValue.toString(),
            publicHash: publicHash
        };
        
        // Generate proof
        console.log("⏳ Generating zero-knowledge proof...");
        const startTime = Date.now();
        
        const { proof, publicSignals } = await snarkjs.groth16.fullProve(
            input,
            path.join(__dirname, "../simple_proof_js/simple_proof.wasm"),
            path.join(__dirname, "../simple_proof_final.zkey")
        );
        
        const genTime = Date.now() - startTime;
        console.log(`✅ Proof generated in ${genTime}ms`);
        console.log("");
        
        // Verify proof
        console.log("🔍 Verifying proof...");
        const vKey = JSON.parse(
            fs.readFileSync(path.join(__dirname, "../verification_key.json"))
        );
        
        const startVerifyTime = Date.now();
        const isValid = await snarkjs.groth16.verify(vKey, publicSignals, proof);
        const verifyTime = Date.now() - startVerifyTime;
        
        if (isValid) {
            console.log(`✅ Proof VALID (verified in ${verifyTime}ms)`);
        } else {
            console.log("❌ Proof INVALID");
            throw new Error("Proof verification failed");
        }
        
        // Save proof to file
        const proofData = {
            proof,
            publicSignals,
            metadata: {
                generated: new Date().toISOString(),
                generationTime: `${genTime}ms`,
                verificationTime: `${verifyTime}ms`,
                secretValue: "HIDDEN (use proof to verify without revealing)",
                publicHash: publicHash
            }
        };
        
        fs.writeFileSync(
            path.join(__dirname, "..", "proof.json"),
            JSON.stringify(proofData, null, 2)
        );
        
        console.log("");
        console.log("💾 Proof saved to proof.json");
        console.log("");
        
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        console.log("✅ Test Complete!");
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        console.log("");
        console.log("📊 Summary:");
        console.log(`   • Secret: ${secretValue} (never revealed)`);
        console.log(`   • Hash: ${publicHash.slice(0,30)}...`);
        console.log(`   • Proof: VALID ✅`);
        console.log(`   • Generation: ${genTime}ms`);
        console.log(`   • Verification: ${verifyTime}ms`);
        console.log("");
        console.log("🎓 What This Means:");
        console.log("   We proved we know the secret value WITHOUT revealing it!");
        console.log("   This is the foundation for private transactions on Stellar.");
        console.log("");
        
    } catch (error) {
        console.error("");
        console.error("❌ Error during testing:");
        console.error(error.message);
        process.exit(1);
    }
}

// Run test
testProofGeneration();
