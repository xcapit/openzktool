import { Verifier } from '../verifier/Verifier';
import type { VerifierConfig, Proof } from '../types';

describe('Verifier', () => {
  let verifier: Verifier;

  beforeEach(() => {
    const config: VerifierConfig = {
      vkeyPath: ''
    };
    verifier = new Verifier(config);
  });

  describe('constructor', () => {
    it('should create a Verifier instance', () => {
      expect(verifier).toBeInstanceOf(Verifier);
    });

    it('should accept config with chain options', () => {
      const config: VerifierConfig = {
        vkeyPath: '/path/to/vkey.json',
        chain: 'stellar',
        contractId: 'CBPBVJJW5NMV4UVEDKSR6UO4DRBNWRQEMYKRYZI3CW6YK3O7HAZA43OI',
        network: 'testnet'
      };
      const verifierWithChain = new Verifier(config);
      expect(verifierWithChain).toBeInstanceOf(Verifier);
    });
  });

  describe('setVerificationKeyPath', () => {
    it('should update verification key path', () => {
      verifier.setVerificationKeyPath('/new/vkey/path.json');
      // No error means success
      expect(true).toBe(true);
    });
  });

  describe('setVerificationKey', () => {
    it('should set verification key directly', () => {
      const mockVkey = {
        protocol: 'groth16',
        curve: 'bn128',
        nPublic: 1,
        vk_alpha_1: ['1', '2', '1'],
        vk_beta_2: [['1', '2'], ['3', '4']],
        vk_gamma_2: [['1', '2'], ['3', '4']],
        vk_delta_2: [['1', '2'], ['3', '4']],
        IC: [['1', '2', '1'], ['3', '4', '1']]
      };
      verifier.setVerificationKey(mockVkey);
      // No error means success
      expect(true).toBe(true);
    });
  });

  describe('verifyLocal', () => {
    it('should throw error if vkey not configured', async () => {
      const mockProof: Proof = {
        pi_a: ['1', '2', '1'],
        pi_b: [['1', '2'], ['3', '4']],
        pi_c: ['1', '2', '1'],
        protocol: 'groth16',
        curve: 'bn128'
      };
      const publicSignals = ['1'];

      await expect(verifier.verifyLocal(mockProof, publicSignals))
        .rejects.toThrow('Verification key path not configured');
    });
  });

  describe('verifyOnChain', () => {
    it('should throw error for unsupported chain', async () => {
      const config: VerifierConfig = {
        chain: 'unsupported' as any
      };
      const verifierWithBadChain = new Verifier(config);

      const mockProof: Proof = {
        pi_a: ['1', '2', '1'],
        pi_b: [['1', '2'], ['3', '4']],
        pi_c: ['1', '2', '1'],
        protocol: 'groth16',
        curve: 'bn128'
      };
      const publicSignals = ['1'];

      await expect(verifierWithBadChain.verifyOnChain(mockProof, publicSignals))
        .rejects.toThrow('Unsupported chain');
    });

    it('should throw error for EVM without contract address', async () => {
      const config: VerifierConfig = {
        chain: 'ethereum'
      };
      const verifierEVM = new Verifier(config);

      const mockProof: Proof = {
        pi_a: ['1', '2', '1'],
        pi_b: [['1', '2'], ['3', '4']],
        pi_c: ['1', '2', '1'],
        protocol: 'groth16',
        curve: 'bn128'
      };
      const publicSignals = ['1'];

      await expect(verifierEVM.verifyOnChain(mockProof, publicSignals))
        .rejects.toThrow('EVM contract address not configured');
    });

    it('should throw error for Soroban without contract ID', async () => {
      const config: VerifierConfig = {
        chain: 'stellar'
      };
      const verifierSoroban = new Verifier(config);

      const mockProof: Proof = {
        pi_a: ['1', '2', '1'],
        pi_b: [['1', '2'], ['3', '4']],
        pi_c: ['1', '2', '1'],
        protocol: 'groth16',
        curve: 'bn128'
      };
      const publicSignals = ['1'];

      await expect(verifierSoroban.verifyOnChain(mockProof, publicSignals))
        .rejects.toThrow('Soroban contract ID not configured');
    });
  });

  describe('verify', () => {
    it('should call verifyLocal when onChain is false', async () => {
      // This will fail due to missing vkey, but tests the flow
      const mockProof: Proof = {
        pi_a: ['1', '2', '1'],
        pi_b: [['1', '2'], ['3', '4']],
        pi_c: ['1', '2', '1'],
        protocol: 'groth16',
        curve: 'bn128'
      };
      const publicSignals = ['1'];

      await expect(verifier.verify(mockProof, publicSignals, false))
        .rejects.toThrow();
    });
  });
});
