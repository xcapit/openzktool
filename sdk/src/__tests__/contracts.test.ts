import { EVMContract } from '../contracts/EVMContract';
import { SorobanContract } from '../contracts/SorobanContract';
import type { Proof } from '../types';

describe('EVMContract', () => {
  let evmContract: EVMContract;
  const mockAddress = '0x1234567890123456789012345678901234567890';

  beforeEach(() => {
    evmContract = new EVMContract(mockAddress, null);
  });

  describe('constructor', () => {
    it('should create an EVMContract instance', () => {
      expect(evmContract).toBeInstanceOf(EVMContract);
    });

    it('should store contract address', () => {
      expect(evmContract.getContractAddress()).toBe(mockAddress);
    });
  });

  describe('getABI', () => {
    it('should return Groth16 verifier ABI', () => {
      const abi = evmContract.getABI();
      expect(Array.isArray(abi)).toBe(true);
      expect(abi.length).toBeGreaterThan(0);
      expect(abi[0].name).toBe('verifyProof');
    });
  });

  describe('formatProofForEVM', () => {
    it('should format proof correctly for EVM', () => {
      const mockProof: Proof = {
        pi_a: ['123', '456', '1'],
        pi_b: [['789', '012'], ['345', '678']],
        pi_c: ['901', '234', '1'],
        protocol: 'groth16',
        curve: 'bn128'
      };

      const formatted = evmContract.formatProofForEVM(mockProof);

      expect(formatted.a).toEqual(['123', '456']);
      // Note: b is reversed for EVM contracts
      expect(formatted.b).toEqual([['012', '789'], ['678', '345']]);
      expect(formatted.c).toEqual(['901', '234']);
    });
  });

  describe('getCalldata', () => {
    it('should return calldata object with correct structure', () => {
      const mockProof: Proof = {
        pi_a: ['123', '456', '1'],
        pi_b: [['789', '012'], ['345', '678']],
        pi_c: ['901', '234', '1'],
        protocol: 'groth16',
        curve: 'bn128'
      };
      const publicSignals = ['1'];

      const calldata = evmContract.getCalldata(mockProof, publicSignals);

      expect(calldata.to).toBe(mockAddress);
      expect(calldata.functionSignature).toBe('verifyProof(uint256[2],uint256[2][2],uint256[2],uint256[])');
      expect(calldata.data).toBeDefined();
    });
  });

  describe('getSupportedNetworks', () => {
    it('should return supported networks', () => {
      const networks = EVMContract.getSupportedNetworks();

      expect(networks.ethereum).toBeDefined();
      expect(networks.ethereum.chainId).toBe(1);
      expect(networks.polygon).toBeDefined();
      expect(networks.polygon.chainId).toBe(137);
    });
  });

  describe('connect', () => {
    it('should return new contract instance with provider', () => {
      const mockProvider = { getCode: jest.fn() };
      const connected = evmContract.connect(mockProvider);

      expect(connected).toBeInstanceOf(EVMContract);
      expect(connected.getContractAddress()).toBe(mockAddress);
    });
  });
});

describe('SorobanContract', () => {
  let sorobanContract: SorobanContract;
  const mockContractId = 'CBPBVJJW5NMV4UVEDKSR6UO4DRBNWRQEMYKRYZI3CW6YK3O7HAZA43OI';

  beforeEach(() => {
    sorobanContract = new SorobanContract(mockContractId, 'testnet');
  });

  describe('constructor', () => {
    it('should create a SorobanContract instance', () => {
      expect(sorobanContract).toBeInstanceOf(SorobanContract);
    });

    it('should store contract ID', () => {
      expect(sorobanContract.getContractId()).toBe(mockContractId);
    });

    it('should store network', () => {
      expect(sorobanContract.getNetwork()).toBe('testnet');
    });

    it('should use default contract if none provided', () => {
      const defaultContract = new SorobanContract();
      expect(defaultContract.getContractId()).toBe(mockContractId); // Default is same
    });
  });

  describe('getRpcUrl', () => {
    it('should return testnet RPC URL', () => {
      const url = sorobanContract.getRpcUrl();
      expect(url).toContain('soroban-testnet.stellar.org');
    });

    it('should return mainnet RPC URL for mainnet', () => {
      const mainnetContract = new SorobanContract(mockContractId, 'mainnet');
      const url = mainnetContract.getRpcUrl();
      expect(url).toContain('soroban.stellar.org');
    });
  });

  describe('formatProofForSoroban', () => {
    it('should format proof correctly for Soroban', () => {
      const mockProof: Proof = {
        pi_a: ['123', '456', '1'],
        pi_b: [['789', '012'], ['345', '678']],
        pi_c: ['901', '234', '1'],
        protocol: 'groth16',
        curve: 'bn128'
      };

      const formatted = sorobanContract.formatProofForSoroban(mockProof);

      expect(formatted.a.x).toBe('123');
      expect(formatted.a.y).toBe('456');
      expect(formatted.b.x).toEqual(['789', '012']);
      expect(formatted.b.y).toEqual(['345', '678']);
      expect(formatted.c.x).toBe('901');
      expect(formatted.c.y).toBe('234');
    });
  });

  describe('proofToHex', () => {
    it('should convert proof to hex strings', () => {
      const sorobanProof = {
        a: { x: '123', y: '456' },
        b: { x: ['789', '012'] as [string, string], y: ['345', '678'] as [string, string] },
        c: { x: '901', y: '234' }
      };

      const hex = sorobanContract.proofToHex(sorobanProof);

      expect(hex.a_x).toMatch(/^0x[0-9a-f]{64}$/);
      expect(hex.a_y).toMatch(/^0x[0-9a-f]{64}$/);
      expect(hex.b_x0).toMatch(/^0x[0-9a-f]{64}$/);
      expect(hex.c_x).toMatch(/^0x[0-9a-f]{64}$/);
    });
  });

  describe('buildCliCommand', () => {
    it('should generate valid CLI command', () => {
      const mockProof: Proof = {
        pi_a: ['123', '456', '1'],
        pi_b: [['789', '012'], ['345', '678']],
        pi_c: ['901', '234', '1'],
        protocol: 'groth16',
        curve: 'bn128'
      };
      const publicSignals = ['1'];

      const command = sorobanContract.buildCliCommand(mockProof, publicSignals);

      expect(command).toContain('stellar contract invoke');
      expect(command).toContain(`--id ${mockContractId}`);
      expect(command).toContain('--network testnet');
      expect(command).toContain('-- verify');
      expect(command).toContain('--a-x');
    });
  });
});
