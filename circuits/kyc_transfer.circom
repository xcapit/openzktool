pragma circom 2.1.9;

include "./range_proof.circom";
include "./solvency_check.circom";
include "./compliance_verify.circom";

/**
 * KYCTransfer
 * Combina tres pruebas:
 *  - RangeProof: verifica que la edad esté en un rango válido
 *  - SolvencyCheck: verifica que el balance sea >= mínimo
 *  - ComplianceVerify: verifica que el país esté permitido
 */
template KYCTransfer() {
    // Entradas para cada subcircuito
    signal input age;
    signal input minAge;
    signal input maxAge;
    signal input balance;
    signal input minBalance;
    signal input countryId;

    // Componentes
    component ageProof = RangeProof();
    ageProof.value <== age;
    ageProof.lowerBound <== minAge;
    ageProof.upperBound <== maxAge;

    component solvency = SolvencyCheck(64);
    solvency.balance <== balance;
    solvency.minBalance <== minBalance;

    component compliance = ComplianceVerify(32);
    compliance.countryId <== countryId;

    // Salida: válida si las tres condiciones se cumplen
    signal tmp;
    tmp <== ageProof.valid * solvency.valid;
    signal output kycValid;
    kycValid <== tmp * compliance.isAllowed;
}

component main = KYCTransfer();
