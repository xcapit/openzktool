pragma circom 2.0.0;

template GreaterThan(bits, THRESHOLD) {
    // private input (secret)
    signal input secret;

    // witness inverse of r (only exists if r != 0)
    signal private inv_r;

    // bits for r decomposition
    signal private r_bits[bits];

    // computed r = secret - THRESHOLD
    signal r;

    r <== secret - THRESHOLD;

    // ensure r * inv_r == 1 (so r != 0)
    inv_check <== r * inv_r;
    inv_check === 1;

    // reconstruct r with bits
    var i;
    signal acc = 0;
    for (i = 0; i < bits; i++) {
        // bit boolean
        r_bits[i] * (r_bits[i] - 1) === 0;
        acc += r_bits[i] * (1 << i);
    }
    acc === r;

    // Public output: a single public value confirming validity (1)
    signal output valid;
    valid <== 1;
}

component main = GreaterThan(32, 10);
