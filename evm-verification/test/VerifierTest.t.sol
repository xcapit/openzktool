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
            uint(124788300171464119017931878744404616142267164143171101534094248688815874121),
            uint(8615115827439619157070119946828236836822194927256972593545015435988264235408)
        ];

        uint[2][2] memory b = [
            [uint(13945587374975961061878542666628413827129339174865441813488371031881511133942),
             uint(4233604809639093223877516289026528515013661484269857834369017478730982164603)],
            [uint(11788801545038861290464792641000379164163913215051933677586973938674691097607),
             uint(11558215010116047019603534016288031103124444101032662131529462700032740735565)]
        ];

        uint[2] memory c = [
            uint(15210762157129207907008032926480996528730240042012574597803524799805137308719),
            uint(17080667907076162537533717374198425649544433419398448787804290458623780032195)
        ];

        uint[1] memory input = [uint(1)];

        bool result = verifier.verifyProof(a, b, c, input);

        console.log("====================================");
        console.log("Proof Verification Result:", result);
        console.log("====================================");

        assertTrue(result, "Proof should be valid");
    }
}
