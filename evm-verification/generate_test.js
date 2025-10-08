#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Read proof and public inputs
const proofPath = path.join(__dirname, '../circuits/artifacts/proof.json');
const publicPath = path.join(__dirname, '../circuits/artifacts/public.json');

const proof = JSON.parse(fs.readFileSync(proofPath, 'utf8'));
const publicSignals = JSON.parse(fs.readFileSync(publicPath, 'utf8'));

// Extract proof components
const pA = proof.pi_a.slice(0, 2);
const pB = [proof.pi_b[0].slice(0, 2).reverse(), proof.pi_b[1].slice(0, 2).reverse()];
const pC = proof.pi_c.slice(0, 2);

// Generate Solidity test file
const testContent = `// SPDX-License-Identifier: AGPL-3.0-or-later
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "forge-std/console.sol";
import "../src/Verifier.sol";

contract VerifierTest is Test {
    Groth16Verifier public verifier;

    function setUp() public {
        verifier = new Groth16Verifier();
        console.log("Verifier deployed at:", address(verifier));
    }

    function testVerifyValidProof() public view {
        // Proof generated from circuits/artifacts/proof.json

        uint[2] memory a = [
            uint(${pA[0]}),
            uint(${pA[1]})
        ];

        uint[2][2] memory b = [
            [uint(${pB[0][0]}),
             uint(${pB[0][1]})],
            [uint(${pB[1][0]}),
             uint(${pB[1][1]})]
        ];

        uint[2] memory c = [
            uint(${pC[0]}),
            uint(${pC[1]})
        ];

        uint[${publicSignals.length}] memory input = [${publicSignals.map(s => `uint(${s})`).join(', ')}];

        bool result = verifier.verifyProof(a, b, c, input);

        console.log("====================================");
        console.log("Proof Verification Result:", result);
        console.log("====================================");

        assertTrue(result, "Proof should be valid");
    }
}
`;

// Write the test file
const testPath = path.join(__dirname, 'test/VerifierTest.t.sol');
fs.writeFileSync(testPath, testContent);

console.log('✅ Generated test file with actual proof data');
console.log(`   Proof: ${pA[0].substring(0, 20)}...`);
console.log(`   Public inputs: [${publicSignals.join(', ')}]`);
