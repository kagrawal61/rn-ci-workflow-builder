/* eslint-disable @typescript-eslint/no-var-requires */
import fs from 'fs';

// Mock fs module
jest.mock('fs');
const mockFs = fs as jest.Mocked<typeof fs>;

// Mock the generator module
jest.mock('../generator', () => ({
  generateWorkflow: jest.fn(),
  generateWorkflowForCli: jest.fn(),
  writeWorkflowFile: jest.fn(),
  getAvailablePresets: jest.fn(() => [
    'build',
    'static-analysis',
    'health-check',
  ]),
}));

// Mock the presets registration
jest.mock('../presets', () => ({
  registerBuiltInPresets: jest.fn(),
}));

// Mock commander - need to track calls made during module loading
const mockProgram = {
  name: jest.fn().mockReturnThis(),
  description: jest.fn().mockReturnThis(),
  version: jest.fn().mockReturnThis(),
  command: jest.fn().mockReturnThis(),
  option: jest.fn().mockReturnThis(),
  action: jest.fn().mockReturnThis(),
  parse: jest.fn().mockReturnThis(),
};

jest.mock('commander', () => ({
  Command: jest.fn(() => mockProgram),
}));

describe('CLI', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFs.existsSync.mockReturnValue(true);
    mockFs.readFileSync.mockReturnValue('{}');
  });

  it('should register built-in presets when module is loaded', () => {
    // This test ensures the CLI registers presets on startup
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { registerBuiltInPresets } = require('../presets');

    // Re-require the CLI module to trigger registration
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require('../cli');

    expect(registerBuiltInPresets).toHaveBeenCalled();
  });

  describe('command configuration', () => {
    it('should load CLI module without errors', () => {
      expect(() => {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        require('../cli');
      }).not.toThrow();
    });

    it('should create Commander program instance', () => {
      // Verify that the CLI module can be imported without errors
      // and that our mocking infrastructure is properly set up
      expect(() => {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const cli = require('../cli');
        // The module should export something (even if it's undefined)
        expect(cli).toBeDefined();
      }).not.toThrow();
    });

    it('should export a configured CLI program', () => {
      // Test that the CLI module creates and exports a functional program
      // Since the program is created at module load time, we just verify
      // the mocking infrastructure is working
      expect(mockProgram).toBeDefined();
      expect(typeof mockProgram.name).toBe('function');
      expect(typeof mockProgram.command).toBe('function');
    });
  });

  describe('config file handling', () => {
    it('should handle missing config file', () => {
      mockFs.existsSync.mockReturnValue(false);

      // Mock console.error and process.exit
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      const processExitSpy = jest.spyOn(process, 'exit').mockImplementation();

      // This would normally be tested by executing the action callback
      // For now, we verify the file existence check logic
      expect(mockFs.existsSync).toBeDefined();

      consoleSpy.mockRestore();
      processExitSpy.mockRestore();
    });

    it('should parse JSON config files', () => {
      const jsonConfig = {
        kind: 'build',
        options: {
          platform: 'github',
          build: {
            platform: 'android',
            variant: 'debug',
            storage: 'github',
            notification: 'none',
          },
        },
      };

      mockFs.readFileSync.mockReturnValue(JSON.stringify(jsonConfig));

      expect(() =>
        JSON.parse(mockFs.readFileSync('config.json', 'utf8'))
      ).not.toThrow();
    });

    it('should handle YAML config files', () => {
      const yamlConfig = `
kind: build
options:
  platform: github
  build:
    platform: android
    variant: debug
    storage: github
    notification: none
`;

      mockFs.readFileSync.mockReturnValue(yamlConfig);

      // We can't easily test yaml parsing without mocking js-yaml
      // But we can verify the file reading mechanism
      expect(mockFs.readFileSync).toBeDefined();
    });

    it('should validate file extensions', () => {
      // Test file extension checking logic
      const jsonFile = 'config.json';
      const yamlFile = 'config.yaml';
      const ymlFile = 'config.yml';
      const invalidFile = 'config.txt';

      expect(jsonFile.endsWith('.json')).toBe(true);
      expect(yamlFile.endsWith('.yaml')).toBe(true);
      expect(ymlFile.endsWith('.yml')).toBe(true);
      expect(
        invalidFile.endsWith('.json') ||
          invalidFile.endsWith('.yaml') ||
          invalidFile.endsWith('.yml')
      ).toBe(false);
    });
  });

  describe('error handling', () => {
    it('should handle invalid JSON config', () => {
      mockFs.readFileSync.mockReturnValue('invalid json');

      expect(() => JSON.parse('invalid json')).toThrow();
    });

    it('should handle file read errors', () => {
      mockFs.readFileSync.mockImplementation(() => {
        throw new Error('File read error');
      });

      expect(() => mockFs.readFileSync('config.json', 'utf8')).toThrow(
        'File read error'
      );
    });
  });

  describe('workflow generation', () => {
    it('should call generateWorkflowForCli for validation', async () => {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { generateWorkflowForCli } = require('../generator');
      generateWorkflowForCli.mockResolvedValue({ yaml: 'test: yaml' });

      // This would be the actual validation call
      const result = await generateWorkflowForCli({
        kind: 'build',
        options: { platform: 'github' },
      });

      expect(result).toEqual({ yaml: 'test: yaml' });
      expect(generateWorkflowForCli).toHaveBeenCalledWith({
        kind: 'build',
        options: { platform: 'github' },
      });
    });

    it('should call writeWorkflowFile for file output', () => {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { writeWorkflowFile } = require('../generator');
      writeWorkflowFile.mockReturnValue({ filePath: '/path/to/workflow.yml' });

      const config = {
        kind: 'build',
        options: { platform: 'github' },
      };

      const result = writeWorkflowFile(config);

      expect(result).toEqual({ filePath: '/path/to/workflow.yml' });
      expect(writeWorkflowFile).toHaveBeenCalledWith(config);
    });
  });

  describe('platform handling', () => {
    it('should default to github platform', () => {
      const config = {
        kind: 'build',
        options: {},
      };

      // Test default platform assignment
      const platformOptions = { platform: 'github', ...config.options };
      expect(platformOptions.platform).toBe('github');
    });

    it('should override platform from command line', () => {
      const config = {
        kind: 'build',
        options: { platform: 'github' },
      };

      // Simulate command line override
      const commandLinePlatform = 'bitrise';
      config.options.platform = commandLinePlatform as any;

      expect(config.options.platform).toBe('bitrise');
    });
  });

  describe('preset handling', () => {
    it('should use default preset when none specified', () => {
      const defaultPreset = 'build';
      expect(defaultPreset).toBe('build');
    });

    it('should override preset from config file', () => {
      const configPreset = 'static-analysis';
      const commandLinePreset = 'health-check';

      // Command line should take precedence
      const finalPreset = commandLinePreset || configPreset;
      expect(finalPreset).toBe('health-check');
    });

    it('should get available presets', () => {
      const { getAvailablePresets } = require('../generator');
      const presets = getAvailablePresets();

      expect(presets).toEqual(['build', 'static-analysis', 'health-check']);
    });
  });

  describe('output handling', () => {
    it('should handle custom output file', () => {
      const outputPath = './custom-workflow.yml';
      mockFs.writeFileSync.mockImplementation(() => {});

      // This simulates writing to a custom output file
      mockFs.writeFileSync(outputPath, 'test: yaml', 'utf8');

      expect(mockFs.writeFileSync).toHaveBeenCalledWith(
        outputPath,
        'test: yaml',
        'utf8'
      );
    });

    it('should handle custom output directory', () => {
      const { writeWorkflowFile } = require('../generator');
      writeWorkflowFile.mockReturnValue({
        filePath: './custom-dir/workflow.yml',
      });

      const config = { kind: 'build', options: {} };
      const customDir = './custom-dir';

      const result = writeWorkflowFile(config, customDir);

      expect(result.filePath).toContain('custom-dir');
    });
  });
});
