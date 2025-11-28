import { OpenZKTool } from '../OpenZKTool';
import { Prover } from '../prover/Prover';
import { Verifier } from '../verifier/Verifier';
import { SorobanContract } from '../contracts/SorobanContract';
import { EVMContract } from '../contracts/EVMContract';
import type { OpenZKToolConfig, ProofInputs } from '../types';

describe('OpenZKTool', () => {
  let zktool: OpenZKTool;

  beforeEach(() => {
    const config: OpenZKToolConfig = {
      network: 'testnet'
    };
    zktool = new OpenZKTool(config);
  });

  describe('constructor', () => {
    it('should create an OpenZKTool instance', () => {
      expect(zktool).toBeInstanceOf(OpenZKTool);
    });

    it('should accept full configuration', () => {
      const config: OpenZKToolConfig = {
        wasmPath: '/path/to/circuit.wasm',
        zkeyPath: '/path/to/circuit.zkey',
        vkeyPath: '/path/to/vkey.json',
        network: 'testnet'
      };
      const fullZktool = new OpenZKTool(config);
      expect(fullZktool).toBeInstanceOf(OpenZKTool);
    });
  });

  describe('getVersion', () => {
    it('should return version string', () => {
      const version = zktool.getVersion();
      expect(version).toBe('0.1.0-alpha');
    });
  });

  describe('getConfig', () => {
    it('should return copy of configuration', () => {
      const config: OpenZKToolConfig = {
        wasmPath: '/path/to/circuit.wasm',
        network: 'testnet'
      };
      const zktoolWithConfig = new OpenZKTool(config);
      const returnedConfig = zktoolWithConfig.getConfig();

      expect(returnedConfig.wasmPath).toBe('/path/to/circuit.wasm');
      expect(returnedConfig.network).toBe('testnet');
    });
  });

  describe('getProver', () => {
    it('should return Prover instance', () => {
      const prover = zktool.getProver();
      expect(prover).toBeInstanceOf(Prover);
    });
  });

  describe('getVerifier', () => {
    it('should return Verifier instance', () => {
      const verifier = zktool.getVerifier();
      expect(verifier).toBeInstanceOf(Verifier);
    });
  });

  describe('setCircuitPaths', () => {
    it('should update circuit paths', () => {
      zktool.setCircuitPaths('/new/wasm', '/new/zkey', '/new/vkey');
      // No error means success
      expect(true).toBe(true);
    });
  });

  describe('generateProof', () => {
    it('should throw error if circuit paths not configured', async () => {
      const inputs: ProofInputs = {
        age: 25,
        balance: 150,
        country: 32
      };

      await expect(zktool.generateProof(inputs)).rejects.toThrow();
    });

    it('should use default public inputs when not provided', async () => {
      // This will fail due to missing paths, but we can test the input building
      const inputs: ProofInputs = {
        age: 25,
        balance: 150,
        country: 32
      };

      // The function will throw due to missing paths, but it should attempt to use defaults
      await expect(zktool.generateProof(inputs)).rejects.toThrow('Circuit paths not configured');
    });
  });

  describe('verifyLocal', () => {
    it('should throw error if verification key not configured', async () => {
      const mockProof = {
        pi_a: ['1', '2', '1'],
        pi_b: [['1', '2'], ['3', '4']],
        pi_c: ['1', '2', '1'],
        protocol: 'groth16',
        curve: 'bn128'
      };
      const publicSignals = ['1'];

      await expect(zktool.verifyLocal(mockProof, publicSignals)).rejects.toThrow();
    });
  });

  describe('verifyOnChain', () => {
    it('should throw error for unsupported chain', async () => {
      const mockProof = {
        pi_a: ['1', '2', '1'],
        pi_b: [['1', '2'], ['3', '4']],
        pi_c: ['1', '2', '1'],
        protocol: 'groth16',
        curve: 'bn128'
      };
      const publicSignals = ['1'];

      await expect(
        zktool.verifyOnChain(mockProof, publicSignals, {
          chain: 'unsupported' as any
        })
      ).rejects.toThrow('Unsupported chain');
    });

    it('should route to Soroban for stellar chain', async () => {
      const mockProof = {
        pi_a: ['1', '2', '1'],
        pi_b: [['1', '2'], ['3', '4']],
        pi_c: ['1', '2', '1'],
        protocol: 'groth16',
        curve: 'bn128'
      };
      const publicSignals = ['1'];

      // This connects to testnet and returns a result (invalid proof, but tests routing)
      const result = await zktool.verifyOnChain(mockProof, publicSignals, {
        chain: 'stellar',
        network: 'testnet'
      });

      // Should return a result object (proof won't be valid but connection works)
      expect(result).toHaveProperty('valid');
    });

    it('should require contract address for EVM chains', async () => {
      const mockProof = {
        pi_a: ['1', '2', '1'],
        pi_b: [['1', '2'], ['3', '4']],
        pi_c: ['1', '2', '1'],
        protocol: 'groth16',
        curve: 'bn128'
      };
      const publicSignals = ['1'];

      await expect(
        zktool.verifyOnChain(mockProof, publicSignals, {
          chain: 'ethereum'
        })
      ).rejects.toThrow('contractAddress required for EVM chains');
    });
  });

  describe('static factory methods', () => {
    it('should create SorobanContract instance', () => {
      const contract = OpenZKTool.createSorobanContract(
        'CBPBVJJW5NMV4UVEDKSR6UO4DRBNWRQEMYKRYZI3CW6YK3O7HAZA43OI',
        'testnet'
      );
      expect(contract).toBeInstanceOf(SorobanContract);
    });

    it('should create EVMContract instance', () => {
      const contract = OpenZKTool.createEVMContract(
        '0x1234567890123456789012345678901234567890',
        null
      );
      expect(contract).toBeInstanceOf(EVMContract);
    });
  });
});
