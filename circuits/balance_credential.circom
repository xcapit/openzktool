pragma circom 2.0.0;

template GreaterThan(bits, THRESHOLD) {
    signal input secret;
    signal private inv_r;
    signal private r_bits[bits];
    signal r;
    r <== secret - THRESHOLD;
    inv_check <== r * inv_r;
    inv_check === 1;
    var i;
    signal acc = 0;
    for (i = 0; i < bits; i++) {
        r_bits[i] * (r_bits[i] - 1) === 0;
        acc += r_bits[i] * (1 << i);
    }
    acc === r;
    signal output valid;
    valid <== 1;
}

component main = GreaterThan(64, 1);
