/**
 * W3C Verifiable Credentials Module for OpenZKTool
 *
 * Provides tools for working with W3C VCs and generating ZK proofs
 * that selectively disclose credential claims.
 *
 * @example
 * ```typescript
 * import { VCProcessor, VerifiableCredential } from '@openzktool/sdk/vc';
 *
 * const processor = new VCProcessor();
 *
 * const ageCredential: VerifiableCredential = {
 *   '@context': ['https://www.w3.org/2018/credentials/v1'],
 *   type: ['VerifiableCredential', 'AgeCredential'],
 *   issuer: 'did:example:gov',
 *   issuanceDate: '2024-01-01T00:00:00Z',
 *   credentialSubject: {
 *     id: 'did:example:user123',
 *     birthDate: '1990-05-15'
 *   }
 * };
 *
 * // Convert to circuit inputs
 * const circuitInputs = processor.convertAgeCredential(ageCredential);
 *
 * // Generate ZK proof that proves age >= 21 without revealing birthdate
 * const { proof, publicSignals } = await zktool.generateProofRaw(circuitInputs);
 * ```
 */

export { VCProcessor } from './VCProcessor';
export * from './types';
