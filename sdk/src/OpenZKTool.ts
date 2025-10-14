/**
 * Main OpenZKTool SDK class
 *
 * Provides high-level API for proof generation and verification
 * across multiple blockchain platforms.
 *
 * @example
 * ```typescript
 * const zktool = new OpenZKTool({
 *   network: 'testnet',
 *   circuitPath: './circuits/kyc_transfer.circom'
 * });
 *
 * const proof = await zktool.generateProof({
 *   age: 25,
 *   balance: 150,
 *   country: 32
 * });
 * ```
 */

import { Prover } from './prover/Prover';
import { Verifier } from './verifier/Verifier';
import type {
  OpenZKToolConfig,
  ProofInputs,
  Proof,
  PublicSignals,
  ChainOptions,
} from './types';

export class OpenZKTool {
  private prover: Prover;
  private verifier: Verifier;
  private config: OpenZKToolConfig;

  constructor(config: OpenZKToolConfig) {
    this.config = config;

    // Initialize prover
    this.prover = new Prover({
      wasmPath: config.wasmPath,
      zkeyPath: config.zkeyPath,
    });

    // Initialize verifier
    this.verifier = new Verifier({
      vkeyPath: config.vkeyPath,
    });
  }

  /**
   * Generate a zero-knowledge proof
   *
   * @param inputs - Private circuit inputs
   * @returns Proof and public signals
   *
   * @example
   * ```typescript
   * const { proof, publicSignals } = await zktool.generateProof({
   *   age: 25,
   *   balance: 150,
   *   country: 32
   * });
   * ```
   */
  async generateProof(inputs: ProofInputs): Promise<{ proof: Proof; publicSignals: PublicSignals }> {
    // TODO: Implementation will be added in next phase
    throw new Error('Not implemented yet - structure only');
  }

  /**
   * Verify a proof locally (off-chain)
   *
   * @param proof - The proof to verify
   * @param publicSignals - Public signals from proof generation
   * @returns True if proof is valid
   */
  async verifyLocal(proof: Proof, publicSignals: PublicSignals): Promise<boolean> {
    // TODO: Implementation will be added in next phase
    throw new Error('Not implemented yet - structure only');
  }

  /**
   * Verify a proof on-chain
   *
   * @param proof - The proof to verify
   * @param options - Chain-specific options
   * @returns True if proof is valid on-chain
   *
   * @example
   * ```typescript
   * const valid = await zktool.verifyOnChain(proof, {
   *   chain: 'stellar',
   *   contractId: 'CBPBVJJW...',
   *   network: 'testnet'
   * });
   * ```
   */
  async verifyOnChain(proof: Proof, options: ChainOptions): Promise<boolean> {
    // TODO: Implementation will be added in next phase
    throw new Error('Not implemented yet - structure only');
  }

  /**
   * Get SDK version
   */
  getVersion(): string {
    return '0.1.0-alpha';
  }
}
