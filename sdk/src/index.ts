/**
 * @openzktool/sdk
 *
 * TypeScript SDK for OpenZKTool - Zero-Knowledge Proof toolkit for multi-chain privacy
 *
 * @packageDocumentation
 */

export { OpenZKTool } from './OpenZKTool';
export { Prover } from './prover/Prover';
export { Verifier } from './verifier/Verifier';
export { EVMContract } from './contracts/EVMContract';
export { SorobanContract } from './contracts/SorobanContract';

// Export types
export * from './types';

// Package version
export const VERSION = '0.1.0-alpha';
