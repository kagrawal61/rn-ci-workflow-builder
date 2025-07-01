import fs from 'fs';
import {
  clearBuilders,
  generateWorkflow,
  generateWorkflowForCli,
  getAvailablePresets,
  registerBuilder,
  writeWorkflowFile,
} from '../generator';
import { WorkflowConfig } from '../types';

// Mock fs module
jest.mock('fs');
const mockFs = fs as jest.Mocked<typeof fs>;

// Mock validation modules
jest.mock('../validation', () => ({
  validateConfig: jest.fn(config => config),
}));

jest.mock('../validation/yaml', () => ({
  validateGeneratedYaml: jest.fn((yaml, useAsync = false) => {
    return useAsync ? Promise.resolve(yaml) : yaml;
  }),
}));

jest.mock('../helpers', () => ({
  injectSecrets: jest.fn(yaml => yaml),
}));

jest.mock('../helpers/secretsManager', () => ({
  generateSecretsSummary: jest.fn(() => 'Mock secrets summary'),
}));

describe('Generator', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    clearBuilders(); // Clear all registered builders before each test
  });

  describe('registerBuilder', () => {
    it('should register a new builder', () => {
      const mockBuilder = jest.fn().mockReturnValue({ name: 'test-workflow' });

      registerBuilder('test-preset', mockBuilder);

      const presets = getAvailablePresets();
      expect(presets).toContain('test-preset');
    });

    it('should override existing builder with same name', () => {
      const mockBuilder1 = jest.fn().mockReturnValue({ name: 'workflow-1' });
      const mockBuilder2 = jest.fn().mockReturnValue({ name: 'workflow-2' });

      registerBuilder('test-preset', mockBuilder1);
      registerBuilder('test-preset', mockBuilder2);

      const presets = getAvailablePresets();
      expect(presets.filter(p => p === 'test-preset')).toHaveLength(1);
    });
  });

  describe('getAvailablePresets', () => {
    it('should return empty array when no builders registered', () => {
      const presets = getAvailablePresets();
      expect(presets).toEqual([]);
    });

    it('should return all registered builder names', () => {
      registerBuilder('preset1', jest.fn());
      registerBuilder('preset2', jest.fn());

      const presets = getAvailablePresets();
      expect(presets).toContain('preset1');
      expect(presets).toContain('preset2');
      expect(presets).toHaveLength(2);
    });
  });

  describe('generateWorkflow', () => {
    const mockConfig: WorkflowConfig = {
      kind: 'test-preset',
      options: {
        platform: 'github',
        name: 'test-workflow',
      },
    };

    it('should generate workflow YAML for valid config', () => {
      const mockBuilder = jest.fn().mockReturnValue({
        name: 'test-workflow',
        on: { push: { branches: ['main'] } },
        jobs: {
          test: {
            'runs-on': 'ubuntu-latest',
            steps: [{ name: 'Checkout', uses: 'actions/checkout@v4' }],
          },
        },
      });

      registerBuilder('test-preset', mockBuilder);

      const result = generateWorkflow(mockConfig);

      expect(result).toHaveProperty('yaml');
      expect(typeof result.yaml).toBe('string');
      expect(mockBuilder).toHaveBeenCalledWith(mockConfig.options);
    });

    it('should throw error for unsupported preset', () => {
      // Clear builders to ensure 'test-preset' is not registered
      clearBuilders();
      expect(() => generateWorkflow(mockConfig)).toThrow(
        'Unsupported pipeline kind: test-preset'
      );
    });

    it('should generate secrets summary for build preset', () => {
      const buildConfig: WorkflowConfig = {
        kind: 'build',
        options: {
          build: {
            platform: 'android',
            variant: 'debug',
            storage: 'github',
            notification: 'none',
          },
        },
      };

      const mockBuilder = jest.fn().mockReturnValue({
        name: 'build-workflow',
        jobs: {},
      });

      registerBuilder('build', mockBuilder);

      const result = generateWorkflow(buildConfig);

      expect(result).toHaveProperty('secretsSummary');
      expect(result.secretsSummary).toBe('Mock secrets summary');
    });

    it('should handle empty options', () => {
      const configWithoutOptions: WorkflowConfig = {
        kind: 'test-preset',
      };

      const mockBuilder = jest.fn().mockReturnValue({ name: 'test' });
      registerBuilder('test-preset', mockBuilder);

      const result = generateWorkflow(configWithoutOptions);

      expect(result).toHaveProperty('yaml');
      expect(mockBuilder).toHaveBeenCalledWith({});
    });
  });

  describe('generateWorkflowForCli', () => {
    const mockConfig: WorkflowConfig = {
      kind: 'test-preset',
      options: { platform: 'github' },
    };

    it('should generate workflow YAML with CLI enhancements', async () => {
      const mockBuilder = jest.fn().mockReturnValue({
        name: 'test-workflow',
        jobs: {},
      });

      registerBuilder('test-preset', mockBuilder);

      const result = await generateWorkflowForCli(mockConfig);

      expect(result).toHaveProperty('yaml');
      expect(typeof result.yaml).toBe('string');
    });

    it('should handle async validation', async () => {
      const mockBuilder = jest.fn().mockReturnValue({ name: 'test' });
      registerBuilder('test-preset', mockBuilder);

      const result = await generateWorkflowForCli(mockConfig);

      expect(result).toHaveProperty('yaml');
    });

    it('should throw error for unsupported preset', async () => {
      // Clear builders to ensure 'test-preset' is not registered
      clearBuilders();
      await expect(generateWorkflowForCli(mockConfig)).rejects.toThrow(
        'Unsupported pipeline kind: test-preset'
      );
    });
  });

  describe('writeWorkflowFile', () => {
    const mockConfig: WorkflowConfig = {
      kind: 'test-preset',
      options: { platform: 'github' },
    };

    beforeEach(() => {
      mockFs.existsSync.mockReturnValue(true);
      mockFs.mkdirSync.mockImplementation(() => '');
      mockFs.writeFileSync.mockImplementation(() => {});
    });

    it('should write workflow file to default location', () => {
      const mockBuilder = jest.fn().mockReturnValue({ name: 'test' });
      registerBuilder('test-preset', mockBuilder);

      const result = writeWorkflowFile(mockConfig);

      expect(result).toHaveProperty('filePath');
      expect(mockFs.writeFileSync).toHaveBeenCalled();
    });

    it('should write workflow file to custom directory', () => {
      const mockBuilder = jest.fn().mockReturnValue({ name: 'test' });
      registerBuilder('test-preset', mockBuilder);

      const result = writeWorkflowFile(mockConfig, './custom-dir');

      expect(result).toHaveProperty('filePath');
      expect(result.filePath).toContain('custom-dir');
    });

    it('should write workflow file with custom filename', () => {
      const mockBuilder = jest.fn().mockReturnValue({ name: 'test' });
      registerBuilder('test-preset', mockBuilder);

      const result = writeWorkflowFile(
        mockConfig,
        undefined,
        'custom-workflow.yml'
      );

      expect(result).toHaveProperty('filePath');
      expect(result.filePath).toContain('custom-workflow.yml');
    });

    it('should create directories if they do not exist', () => {
      mockFs.existsSync.mockReturnValue(false);

      const mockBuilder = jest.fn().mockReturnValue({ name: 'test' });
      registerBuilder('test-preset', mockBuilder);

      writeWorkflowFile(mockConfig, './new-dir');

      expect(mockFs.mkdirSync).toHaveBeenCalledWith(
        expect.stringContaining('new-dir'),
        { recursive: true }
      );
    });
  });
});
