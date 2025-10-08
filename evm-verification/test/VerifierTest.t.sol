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
            uint(15778468200636208391477443493894901523818111981168646115882553902921896401787),
            uint(17440038957028672681311147643066061606937148776633187003734488699904358742294)
        ];

        uint[2][2] memory b = [
            [uint(20539353799871673890901824648748931681429821252882790395818186679512160447929),
             uint(13161374647819247704852037425856284322871755861666019821052495295645437605940)],
            [uint(15627649149402551808467953624978039397450519498596318941224254067595118840608),
             uint(619065071963412364677502895073235221763485487692031208448181190491729591771)]
        ];

        uint[2] memory c = [
            uint(11467858905813714305620439555729963765233363141849903711120870576985397475145),
            uint(17781863985857419648084135189826977624359090338353340509635809912285388192868)
        ];

        uint[1] memory input = [uint(1)];

        bool result = verifier.verifyProof(a, b, c, input);

        console.log("====================================");
        console.log("Proof Verification Result:", result);
        console.log("====================================");

        assertTrue(result, "Proof should be valid");
    }
}
