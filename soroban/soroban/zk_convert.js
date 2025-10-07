// soroban/zk_convert.js
const fs = require("fs");

if (process.argv.length < 3) {
  console.error("Usage: node soroban/zk_convert.js <calldata.json>");
  process.exit(1);
}

const raw = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));

function to32Bytes(hex) {
  if (typeof hex !== "string") throw new Error("expected hex string");
  let h = hex.replace(/^0x/, "").toLowerCase();
  if (h.length > 64) throw new Error(`hex longer than 32 bytes: ${hex}`);
  h = h.padStart(64, "0"); // left-pad (big-endian)
  const out = [];
  for (let i = 0; i < 64; i += 2) out.push(parseInt(h.slice(i, i + 2), 16));
  return out; // length 32
}

function mapVecBytes(vec) {
  // vec: array de hex strings → array de [u8;32]
  if (!Array.isArray(vec)) throw new Error("expected array for Vec<Bytes>");
  return vec.map(to32Bytes);
}

function mapVecVecBytes(mat) {
  // mat: array de arrays de hex strings → [[u8;32], [u8;32]]
  if (!Array.isArray(mat)) throw new Error("expected array for Vec<Vec<Bytes>>");
  return mat.map(row => mapVecBytes(row));
}

// Detectar forma del calldata:
let a, b, c, input;
if (Array.isArray(raw) && raw.length === 4) {
  // Forma: [a, b, c, input]
  [a, b, c, input] = raw;
} else if (Array.isArray(raw) && raw.length === 5) {
  // Forma “aplanada”: [a0, a1, b, c, input]
  a = [raw[0], raw[1]];
  b = raw[2];
  c = raw[3];
  input = raw[4];
} else {
  throw new Error("Unsupported calldata shape: expected 4 or 5 elements");
}

// Construir salida con tamaños correctos (cada Bytes = 32 u8)
const out = {
  a: mapVecBytes(a),         // [[32],[32]]
  b: mapVecVecBytes(b),      // [[[32],[32]], [[32],[32]]]
  c: mapVecBytes(c),         // [[32],[32]]
  input: mapVecBytes(input)  // [[32], [32], ...]
};

console.log(JSON.stringify(out, null, 2));