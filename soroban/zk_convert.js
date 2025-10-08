import fs from "fs";

if (process.argv.length < 3) {
  console.error("❌ Uso: node zk_convert.js <calldata.json>");
  process.exit(1);
}

const calldataPath = process.argv[2];

let calldata;
try {
  calldata = JSON.parse(fs.readFileSync(calldataPath, "utf8"));
} catch (err) {
  console.error("❌ Error al leer el archivo:", err.message);
  process.exit(1);
}

// 🔧 Convierte recursivamente valores a string hexadecimal 0x...
function flattenToHex(value) {
  if (Array.isArray(value)) {
    return "0x" + value.flat(Infinity)
      .map(v => v.replace(/^0x/, "").padStart(2, "0"))
      .join("");
  }
  if (typeof value === "string" && value.startsWith("0x")) return value;
  return value;
}

// 📦 Si calldata viene como array [a,b,c,input]
const [a, b, c, input] = calldata;

// 🔁 Compactar cada grupo en una única cadena hex
const args = {
  a: flattenToHex(a),
  b: flattenToHex(b),
  c: flattenToHex(c),
  input: flattenToHex(input)
};

fs.writeFileSync("args.json", JSON.stringify(args, null, 2));
console.log("✅ args.json generado correctamente en formato compacto (Soroban-ready)");
