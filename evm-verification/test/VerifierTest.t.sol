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
            uint(14062266483436387459671224112968237056017787596674601592875039585451529191713),
            uint(16913767280888901008314119561088276565084496815906792935500219385958261830653)
        ];

        uint[2][2] memory b = [
            [uint(17452076429317414893651437454370578492770121868470175468345100179316709999861),
             uint(15628728052598883530087230493107567003003808097241060665070762356660814702158)],
            [uint(14079315513905426261580118622266586280406841741282705333224860081242949573252),
             uint(14458725381006079247447682404221186325720672663215880075747959376248340771904)]
        ];

        uint[2] memory c = [
            uint(13761785680473680456510874432204606602781231962601362473613607920745977006110),
            uint(564668005390075732779712919519943297696530182900741449699074327330828749646)
        ];

        uint[1] memory input = [uint(1)];

        bool result = verifier.verifyProof(a, b, c, input);

        console.log("====================================");
        console.log("Proof Verification Result:", result);
        console.log("====================================");

        assertTrue(result, "Proof should be valid");
    }
}
