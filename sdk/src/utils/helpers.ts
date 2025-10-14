/**
 * Utility helper functions
 */

/**
 * Convert proof to hex string
 */
export function proofToHex(proof: any): string {
  // TODO: Implementation
  throw new Error('Not implemented yet - structure only');
}

/**
 * Validate Ethereum address
 */
export function isValidEthAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Validate Stellar contract ID
 */
export function isValidContractId(contractId: string): boolean {
  return /^[A-Z0-9]{56}$/.test(contractId);
}

/**
 * Format BigInt for JSON
 */
export function bigIntReplacer(key: string, value: any): any {
  if (typeof value === 'bigint') {
    return value.toString();
  }
  return value;
}

/**
 * Parse JSON with BigInt support
 */
export function bigIntReviver(key: string, value: any): any {
  if (typeof value === 'string' && /^\d+$/.test(value)) {
    return BigInt(value);
  }
  return value;
}
