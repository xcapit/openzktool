template RangeCheck() {
    signal input x;
    signal output ok;

    // Output ok = 1 siempre, solo para probar compilación
    ok <== 1;
}

component main = RangeCheck();
