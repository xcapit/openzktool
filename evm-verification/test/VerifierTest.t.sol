// SPDX-License-Identifier: AGPL-3.0-or-later
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
            uint(18363237972579162414234372085527346141351087281067255413348002541670653633967),
            uint(20752506956467657689502459626020899831080861866984418640531877117405554673878)
        ];

        uint[2][2] memory b = [
            [uint(7319547606979561835851007749944320754430165998855339323633749497128761532422),
             uint(8363911889260820514215690080727019134072803849565885455778879612965332856103)],
            [uint(9970301616005682100189811231662217740585349747652449954080784488899121628429),
             uint(7109417597859419251321681480644151753672561284936981973869338098514388999946)]
        ];

        uint[2] memory c = [
            uint(8620719412174387858899439042925250638268106168230110789685247489176553174251),
            uint(18630615197910327573294058331820521207587698984200315181458560235508349781897)
        ];

        uint[1] memory input = [uint(1)];

        bool result = verifier.verifyProof(a, b, c, input);

        console.log("====================================");
        console.log("Proof Verification Result:", result);
        console.log("====================================");

        assertTrue(result, "Proof should be valid");
    }
}
