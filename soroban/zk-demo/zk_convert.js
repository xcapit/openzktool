#!/usr/bin/env node
// CommonJS para evitar warnings de ESM
const fs = require("fs");

// Lee calldata como array [a0, a1, b(2x2), c(2), input(N)]
const raw = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));

// Normaliza a "0x" en minúsculas
const toHex = (x) => "0x" + x.replace(/^0x/i, "").toLowerCase();

// Estructura exacta que espera el contrato
function toStruct(raw) {
  if (!Array.isArray(raw) || raw.length < 4) {
    throw new Error("calldata.json inválido: espero [a0, a1, b(2x2), c(2), input(N?)]");
  }
  const a = [toHex(raw[0]), toHex(raw[1])];

  const bArr = raw[2];
  if (!Array.isArray(bArr) || bArr.length !== 2 || !Array.isArray(bArr[0]) || !Array.isArray(bArr[1])) {
    throw new Error("Campo b inválido: espero [[b00,b01],[b10,b11]]");
  }
  const b = [
    [toHex(bArr[0][0]), toHex(bArr[0][1])],
    [toHex(bArr[1][0]), toHex(bArr[1][1])]
  ];

  const cArr = raw[3];
  if (!Array.isArray(cArr) || cArr.length !== 2) {
    throw new Error("Campo c inválido: espero [c0, c1]");
  }
  const c = [toHex(cArr[0]), toHex(cArr[1])];

  const input = Array.isArray(raw[4]) ? raw[4].map(toHex) : [];

  return { a, b, c, input };
}

// HEX → arreglo de bytes (números) para variante numérica
function hexToBytes(hex) {
  hex = hex.replace(/^0x/i, "");
  const out = [];
  for (let i = 0; i < hex.length; i += 2) out.push(parseInt(hex.slice(i, i + 2), 16));
  return out;
}
function structToNumeric(s) {
  return {
    a: s.a.map(hexToBytes),
    b: s.b.map(row => row.map(hexToBytes)),
    c: s.c.map(hexToBytes),
    input: s.input.map(hexToBytes),
  };
}

const structured = toStruct(raw);

// Por defecto, generamos HEX (el CLI lo interpreta como Bytes)
fs.writeFileSync("args.json", JSON.stringify(structured, null, 2));
fs.writeFileSync("args_hex.json", JSON.stringify(structured, null, 2));

// Alternativa numérica por si tu CLI prefiere arrays de u8
const numeric = structToNumeric(structured);
fs.writeFileSync("args_numeric.json", JSON.stringify(numeric, null, 2));

console.log("✅ Generado: args.json (HEX), args_hex.json (HEX), args_numeric.json (numérico).");
