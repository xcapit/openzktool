// SPDX-License-Identifier: AGPL-3.0-or-later
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "forge-std/console.sol";
import "../src/Verifier.sol";

contract DeployAndVerify is Script {
    function run() external {
        vm.startBroadcast();

        // Deploy the verifier contract
        Groth16Verifier verifier = new Groth16Verifier();
        console.log("====================================");
        console.log("Groth16Verifier deployed at:", address(verifier));
        console.log("====================================");

        vm.stopBroadcast();
    }
}
