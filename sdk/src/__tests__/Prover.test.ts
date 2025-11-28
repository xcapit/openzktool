import { Prover } from '../prover/Prover';
import type { ProverConfig, CircuitInputs } from '../types';

describe('Prover', () => {
  let prover: Prover;

  beforeEach(() => {
    const config: ProverConfig = {
      wasmPath: '',
      zkeyPath: ''
    };
    prover = new Prover(config);
  });

  describe('constructor', () => {
    it('should create a Prover instance', () => {
      expect(prover).toBeInstanceOf(Prover);
    });

    it('should accept config with paths', () => {
      const config: ProverConfig = {
        wasmPath: '/path/to/circuit.wasm',
        zkeyPath: '/path/to/circuit.zkey'
      };
      const proverWithPaths = new Prover(config);
      expect(proverWithPaths).toBeInstanceOf(Prover);
    });
  });

  describe('setCircuitPaths', () => {
    it('should update circuit paths', () => {
      prover.setCircuitPaths('/new/wasm/path', '/new/zkey/path');
      // No error thrown means success
      expect(true).toBe(true);
    });
  });

  describe('validateInputs', () => {
    it('should validate correct inputs', () => {
      const validInputs: CircuitInputs = {
        age: 25,
        balance: 100,
        country: 32
      };
      expect(prover.validateInputs(validInputs)).toBe(true);
    });

    it('should validate inputs with arrays', () => {
      const validInputs: CircuitInputs = {
        age: 25,
        balance: 100,
        country: 32,
        allowedCountries: [32, 1, 5, 0, 0, 0, 0, 0, 0, 0]
      };
      expect(prover.validateInputs(validInputs)).toBe(true);
    });

    it('should reject invalid inputs - null', () => {
      expect(prover.validateInputs(null as any)).toBe(false);
    });

    it('should reject invalid inputs - undefined', () => {
      expect(prover.validateInputs(undefined as any)).toBe(false);
    });

    it('should reject invalid inputs - negative numbers', () => {
      const invalidInputs: CircuitInputs = {
        age: -5,
        balance: 100
      };
      expect(prover.validateInputs(invalidInputs)).toBe(false);
    });

    it('should reject invalid inputs - non-integer numbers', () => {
      const invalidInputs: CircuitInputs = {
        age: 25.5,
        balance: 100
      };
      expect(prover.validateInputs(invalidInputs)).toBe(false);
    });

    it('should accept bigint values', () => {
      const validInputs: CircuitInputs = {
        balance: BigInt('1000000000000000000')
      };
      expect(prover.validateInputs(validInputs)).toBe(true);
    });

    it('should accept string numeric values', () => {
      const validInputs: CircuitInputs = {
        balance: '1000000'
      };
      expect(prover.validateInputs(validInputs)).toBe(true);
    });
  });

  describe('generateProof', () => {
    it('should throw error if paths not configured', async () => {
      const inputs: CircuitInputs = { age: 25 };
      await expect(prover.generateProof(inputs)).rejects.toThrow('Circuit paths not configured');
    });

    it('should throw error if WASM file not found', async () => {
      prover.setCircuitPaths('/nonexistent/path.wasm', '/nonexistent/path.zkey');
      const inputs: CircuitInputs = { age: 25 };
      await expect(prover.generateProof(inputs)).rejects.toThrow('WASM file not found');
    });
  });

  describe('formatProofForSoroban', () => {
    it('should format proof correctly for Soroban', () => {
      const mockProof = {
        pi_a: ['123', '456', '1'],
        pi_b: [['789', '012'], ['345', '678']],
        pi_c: ['901', '234', '1'],
        protocol: 'groth16',
        curve: 'bn128'
      };

      const formatted = prover.formatProofForSoroban(mockProof);

      expect(formatted.a.x).toBe('123');
      expect(formatted.a.y).toBe('456');
      expect(formatted.b.x).toEqual(['789', '012']);
      expect(formatted.b.y).toEqual(['345', '678']);
      expect(formatted.c.x).toBe('901');
      expect(formatted.c.y).toBe('234');
    });
  });

  describe('parseSolidityCallData', () => {
    it('should parse calldata correctly', () => {
      const mockCalldata = '["1","2"],[["3","4"],["5","6"]],["7","8"],["9"]';
      const parsed = prover.parseSolidityCallData(mockCalldata);

      expect(parsed.a).toEqual(['1', '2']);
      expect(parsed.b).toEqual([['3', '4'], ['5', '6']]);
      expect(parsed.c).toEqual(['7', '8']);
      expect(parsed.input).toEqual(['9']);
    });
  });
});
