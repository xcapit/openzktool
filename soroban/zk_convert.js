import fs from "fs";

if (process.argv.length < 3) {
  console.error("❌ Usage: node zk_convert.js <proof.json> [vkey.json]");
  process.exit(1);
}

const proofPath = process.argv[2];
const vkeyPath = process.argv[3] || "../circuits/artifacts/kyc_transfer_vkey.json";

let proof, vkey;
try {
  proof = JSON.parse(fs.readFileSync(proofPath, "utf8"));
  vkey = JSON.parse(fs.readFileSync(vkeyPath, "utf8"));
} catch (err) {
  console.error("❌ Error reading files:", err.message);
  process.exit(1);
}

// 🔧 Converts a G1 point (2 coordinates) to Soroban format
function convertG1Point(coords) {
  // coords = [x, y] where each is a BigInt string
  return {
    x: "0x" + BigInt(coords[0]).toString(16).padStart(64, "0"),
    y: "0x" + BigInt(coords[1]).toString(16).padStart(64, "0")
  };
}

// 🔧 Converts a G2 point (2 coordinates of 2 elements each) to Soroban format
function convertG2Point(coords) {
  // coords = [[x1, x2], [y1, y2]]
  // In Fq2: c0 + c1*u, so x = [x1, x2] represents x1 + x2*u
  return {
    x: [
      "0x" + BigInt(coords[0][0]).toString(16).padStart(64, "0"),
      "0x" + BigInt(coords[0][1]).toString(16).padStart(64, "0")
    ],
    y: [
      "0x" + BigInt(coords[1][0]).toString(16).padStart(64, "0"),
      "0x" + BigInt(coords[1][1]).toString(16).padStart(64, "0")
    ]
  };
}

// 📦 Construir ProofData
const proofData = {
  pi_a: convertG1Point(proof.pi_a),
  pi_b: convertG2Point(proof.pi_b),
  pi_c: convertG1Point(proof.pi_c)
};

// 📦 Construir VerifyingKey
const verifyingKey = {
  alpha: convertG1Point(vkey.vk_alpha_1),
  beta: convertG2Point(vkey.vk_beta_2),
  gamma: convertG2Point(vkey.vk_gamma_2),
  delta: convertG2Point(vkey.vk_delta_2),
  ic: vkey.IC.map(ic => convertG1Point(ic))
};

// 📦 Public inputs
const publicInputs = proof.publicSignals
  ? proof.publicSignals.map(s => "0x" + BigInt(s).toString(16).padStart(64, "0"))
  : [];

// 🔁 Output en formato esperado por verify_proof
const args = {
  proof: proofData,
  vk: verifyingKey,
  public_inputs: publicInputs
};

fs.writeFileSync("args.json", JSON.stringify(args, null, 2));
console.log("✅ args.json generated in Soroban v3 format (ProofData + VerifyingKey + public_inputs)");
console.log(`   - Proof points: pi_a, pi_b, pi_c`);
console.log(`   - VK points: alpha, beta, gamma, delta, ic (${verifyingKey.ic.length} elements)`);
console.log(`   - Public inputs: ${publicInputs.length} elements`);
