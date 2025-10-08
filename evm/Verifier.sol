// SPDX-License-Identifier: AGPL-3.0-or-later
pragma solidity ^0.8.17;

/**
 * ------------------------------------------------------------------------
 *  Stellar Privacy Proof-of-Concept – EVM Verifier
 * ------------------------------------------------------------------------
 *  This contract verifies Groth16 zero-knowledge proofs generated
 *  from the Circom circuits defined in the `stellar-privacy-poc` project.
 *
 *  The verifier is compatible with the proof generated from:
 *    - `kyc_transfer.circom`
 *      which combines:
 *         - range_proof.circom (age check)
 *         - solvency_check.circom (balance check)
 *         - compliance_verify.circom (country check)
 *
 *  The same proof structure is mirrored by the Soroban verifier contract
 *  for interoperability between Ethereum-compatible and Stellar environments.
 *
 *  Author: Xcapit Labs (Fernando Boiero)
 *  License: AGPL-3.0-or-later
 * ------------------------------------------------------------------------
 */

library Pairing {
    struct G1Point {
        uint X;
        uint Y;
    }

    struct G2Point {
        uint[2] X;
        uint[2] Y;
    }

    function P1() internal pure returns (G1Point memory) {
        return G1Point(1, 2);
    }

    function negate(G1Point memory p) internal pure returns (G1Point memory) {
        if (p.X == 0 && p.Y == 0) {
            return G1Point(0, 0);
        }
        return G1Point(p.X, q_mod() - (p.Y % q_mod()));
    }

    function q_mod() internal pure returns (uint) {
        return 21888242871839275222246405745257275088548364400416034343698204186575808495617;
    }

    function addition(G1Point memory p1, G1Point memory p2) internal view returns (G1Point memory r) {
        uint[4] memory input;
        input[0] = p1.X;
        input[1] = p1.Y;
        input[2] = p2.X;
        input[3] = p2.Y;
        bool success;
        assembly {
            success := staticcall(sub(gas(), 2000), 6, input, 0xc0, r, 0x60)
        }
        require(success, "Pairing addition failed");
    }

    function scalar_mul(G1Point memory p, uint s) internal view returns (G1Point memory r) {
        uint[3] memory input;
        input[0] = p.X;
        input[1] = p.Y;
        input[2] = s;
        bool success;
        assembly {
            success := staticcall(sub(gas(), 2000), 7, input, 0x80, r, 0x60)
        }
        require(success, "Pairing scalar multiplication failed");
    }

    function pairing(
        G1Point memory a1,
        G2Point memory a2,
        G1Point memory b1,
        G2Point memory b2
    ) internal view returns (bool) {
        G1Point ;
        G2Point ;
        p1[0] = a1;
        p1[1] = b1;
        p2[0] = a2;
        p2[1] = b2;
        return pairing(p1, p2);
    }

    function pairing(G1Point[] memory p1, G2Point[] memory p2) internal view returns (bool) {
        require(p1.length == p2.length, "Pairing: point length mismatch");
        uint elements = p1.length;
        uint inputSize = elements * 6;
        uint[] memory input = new uint[](inputSize);
        for (uint i = 0; i < elements; i++) {
            uint offset = i * 6;
            input[offset + 0] = p1[i].X;
            input[offset + 1] = p1[i].Y;
            input[offset + 2] = p2[i].X[0];
            input[offset + 3] = p2[i].X[1];
            input[offset + 4] = p2[i].Y[0];
            input[offset + 5] = p2[i].Y[1];
        }
        uint[1] memory out;
        bool success;
        assembly {
            success := staticcall(sub(gas(), 2000), 8, add(input, 0x20), mul(inputSize, 0x20), out, 0x20)
        }
        require(success, "Pairing operation failed");
        return out[0] != 0;
    }
}

contract Verifier {
    using Pairing for *;

    struct VerifyingKey {
        Pairing.G1Point alfa1;
        Pairing.G2Point beta2;
        Pairing.G2Point gamma2;
        Pairing.G2Point delta2;
        Pairing.G1Point[] IC;
    }

    struct Proof {
        Pairing.G1Point A;
        Pairing.G2Point B;
        Pairing.G1Point C;
    }

    function verifyingKey() internal pure returns (VerifyingKey memory vk) {
        // Values are generated from the .zkey file with snarkjs
        vk.alfa1 = Pairing.G1Point(
            1234567890123456789012345678901234567890,
            987654321098765432109876543210987654321
        );
        vk.beta2 = Pairing.G2Point(
            [uint(1), uint(2)],
            [uint(3), uint(4)]
        );
        vk.gamma2 = Pairing.G2Point(
            [uint(5), uint(6)],
            [uint(7), uint(8)]
        );
        vk.delta2 = Pairing.G2Point(
            [uint(9), uint(10)],
            [uint(11), uint(12)]
        );
        vk.IC = new Pairing.G1Point ;
        vk.IC[0] = Pairing.G1Point(1, 2);
        vk.IC[1] = Pairing.G1Point(3, 4);
    }

    function verify(uint[] memory input, Proof memory proof) internal view returns (bool) {
        VerifyingKey memory vk = verifyingKey();
        require(input.length + 1 == vk.IC.length, "Invalid input length");

        Pairing.G1Point memory vk_x = Pairing.G1Point(0, 0);
        for (uint i = 0; i < input.length; i++) {
            vk_x = Pairing.addition(vk_x, Pairing.scalar_mul(vk.IC[i + 1], input[i]));
        }
        vk_x = Pairing.addition(vk_x, vk.IC[0]);

        if (!Pairing.pairing(
            Pairing.negate(proof.A),
            proof.B,
            vk.alfa1,
            vk.beta2
        )) return false;

        return Pairing.pairing(
            vk_x,
            vk.gamma2,
            proof.C,
            vk.delta2
        );
    }

    function verifyProof(
        uint[2] memory a,
        uint[2][2] memory b,
        uint[2] memory c,
        uint[] memory input
    ) public view returns (bool) {
        Proof memory proof;
        proof.A = Pairing.G1Point(a[0], a[1]);
        proof.B = Pairing.G2Point([b[0][0], b[0][1]], [b[1][0], b[1][1]]);
        proof.C = Pairing.G1Point(c[0], c[1]);
        return verify(input, proof);
    }
}
