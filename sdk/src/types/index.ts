/**
 * Type definitions for OpenZKTool SDK
 */

/**
 * Configuration for OpenZKTool SDK
 */
export interface OpenZKToolConfig {
  /** Path to WASM file */
  wasmPath?: string;
  /** Path to zkey file */
  zkeyPath?: string;
  /** Path to verification key */
  vkeyPath?: string;
  /** Network to use (mainnet/testnet) */
  network?: 'mainnet' | 'testnet';
  /** Circuit path */
  circuitPath?: string;
}

/**
 * Inputs for proof generation
 */
export interface ProofInputs {
  /** User's age */
  age: number;
  /** User's balance */
  balance: number;
  /** User's country code */
  country: number;
  /** Minimum required age */
  minAge?: number;
  /** Minimum required balance */
  minBalance?: number;
  /** Allowed country codes */
  allowedCountries?: number[];
}

/**
 * Groth16 proof structure
 */
export interface Proof {
  /** pi_a component */
  pi_a: string[];
  /** pi_b component */
  pi_b: string[][];
  /** pi_c component */
  pi_c: string[];
  /** Protocol (groth16) */
  protocol: string;
  /** Curve (bn128) */
  curve: string;
}

/**
 * Public signals from proof generation
 */
export interface PublicSignals {
  /** KYC validation result (1 = valid, 0 = invalid) */
  kycValid: number;
}

/**
 * Options for on-chain verification
 */
export interface ChainOptions {
  /** Blockchain to verify on */
  chain: 'ethereum' | 'stellar' | 'polygon' | 'arbitrum' | 'optimism';
  /** Contract address (EVM chains) */
  contractAddress?: string;
  /** Contract ID (Soroban) */
  contractId?: string;
  /** Network */
  network?: 'mainnet' | 'testnet';
  /** RPC URL (optional) */
  rpcUrl?: string;
}

/**
 * Prover configuration
 */
export interface ProverConfig {
  /** Path to circuit WASM */
  wasmPath?: string;
  /** Path to proving key */
  zkeyPath?: string;
}

/**
 * Verifier configuration
 */
export interface VerifierConfig {
  /** Path to verification key */
  vkeyPath?: string;
  /** Blockchain to verify on */
  chain?: string;
  /** Contract address/ID */
  contractAddress?: string;
  contractId?: string;
  /** Provider (for EVM) */
  provider?: any;
  /** Network */
  network?: string;
}

/**
 * Circuit inputs (internal)
 */
export interface CircuitInputs {
  [key: string]: number | number[];
}

/**
 * Verification result
 */
export interface VerificationResult {
  /** Is proof valid */
  valid: boolean;
  /** Transaction hash (if on-chain) */
  txHash?: string;
  /** Gas used (if on-chain) */
  gasUsed?: number;
}
