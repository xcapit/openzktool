import fs from "fs";

// Leer los archivos del proof y public inputs
const proof = JSON.parse(fs.readFileSync("proof.json"));
const pub = JSON.parse(fs.readFileSync("public.json"));

// Función auxiliar para convertir a hexadecimal con padding de 32 bytes (64 caracteres hex)
const toHex = (n) => {
  const hex = BigInt(n).toString(16);
  return "0x" + hex.padStart(64, "0");
};

// Generar el array de calldata al estilo Solidity
const calldata = [
  toHex(proof.pi_a[0]),
  toHex(proof.pi_a[1]),
  [
    [toHex(proof.pi_b[0][0]), toHex(proof.pi_b[0][1])],
    [toHex(proof.pi_b[1][0]), toHex(proof.pi_b[1][1])]
  ],
  [toHex(proof.pi_c[0]), toHex(proof.pi_c[1])],
  pub.map(toHex)
];

// Guardar el resultado
fs.writeFileSync("calldata.json", JSON.stringify(calldata, null, 2));
console.log("✅ calldata.json generado correctamente");
