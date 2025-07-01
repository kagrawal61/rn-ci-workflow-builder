import { BuildOptions } from '../../presets/types';
import { WorkflowConfig } from '../../types';
import { validateBuildSchema, validateWorkflowSchema } from '../schema';

describe('Schema Validation', () => {
  describe('validateBuildSchema', () => {
    it('should validate valid build options', () => {
      const options: BuildOptions = {
        platform: 'android',
        variant: 'debug',
        storage: 'github',
        notification: 'none',
        includeHealthCheck: true,
      };

      const result = validateBuildSchema(options);

      expect(result).toEqual(options);
    });

    it('should throw error for invalid platform', () => {
      const options = {
        platform: 'invalid-platform',
        variant: 'debug',
        storage: 'github',
        notification: 'none',
      } as any;

      expect(() => validateBuildSchema(options)).toThrow();
    });

    it('should throw error for invalid variant', () => {
      const options = {
        platform: 'android',
        variant: 'invalid-variant',
        storage: 'github',
        notification: 'none',
      } as any;

      expect(() => validateBuildSchema(options)).toThrow();
    });

    it('should throw error for invalid storage', () => {
      const options = {
        platform: 'android',
        variant: 'debug',
        storage: 'invalid-storage',
        notification: 'none',
      } as any;

      expect(() => validateBuildSchema(options)).toThrow();
    });

    it('should throw error for invalid notification', () => {
      const options = {
        platform: 'android',
        variant: 'debug',
        storage: 'github',
        notification: 'invalid-notification',
      } as any;

      expect(() => validateBuildSchema(options)).toThrow();
    });

    it('should default includeHealthCheck to true when undefined', () => {
      const options = {
        platform: 'android',
        variant: 'debug',
        storage: 'github',
        notification: 'none',
      } as BuildOptions;

      const result = validateBuildSchema(options);

      expect(result.includeHealthCheck).toBe(true);
    });

    it('should handle boolean conversion for includeHealthCheck', () => {
      const options = {
        platform: 'android',
        variant: 'debug',
        storage: 'github',
        notification: 'none',
        includeHealthCheck: 0, // Falsy value
      } as any;

      const result = validateBuildSchema(options);

      expect(result.includeHealthCheck).toBe(false);
    });

    it('should validate all platform options', () => {
      const platforms: Array<BuildOptions['platform']> = [
        'ios',
        'android',
        'both',
      ];

      platforms.forEach(platform => {
        const options: BuildOptions = {
          platform,
          variant: 'debug',
          storage: 'github',
          notification: 'none',
        };

        expect(() => validateBuildSchema(options)).not.toThrow();
      });
    });

    it('should validate all variant options', () => {
      const variants: Array<BuildOptions['variant']> = ['debug', 'release'];

      variants.forEach(variant => {
        const options: BuildOptions = {
          platform: 'android',
          variant,
          storage: 'github',
          notification: 'none',
        };

        expect(() => validateBuildSchema(options)).not.toThrow();
      });
    });

    it('should validate all storage options', () => {
      const storageOptions: Array<BuildOptions['storage']> = [
        'github',
        'drive',
        'firebase',
        's3',
        'bitrise',
      ];

      storageOptions.forEach(storage => {
        const options: BuildOptions = {
          platform: 'android',
          variant: 'debug',
          storage,
          notification: 'none',
        };

        expect(() => validateBuildSchema(options)).not.toThrow();
      });
    });

    it('should validate all notification options', () => {
      const notifications: Array<BuildOptions['notification']> = [
        'slack',
        'pr-comment',
        'both',
        'none',
      ];

      notifications.forEach(notification => {
        const options: BuildOptions = {
          platform: 'android',
          variant: 'debug',
          storage: 'github',
          notification,
        };

        expect(() => validateBuildSchema(options)).not.toThrow();
      });
    });
  });

  describe('validateWorkflowSchema', () => {
    it('should validate valid workflow config', () => {
      const config: WorkflowConfig = {
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

      const result = validateWorkflowSchema(config);

      expect(result.kind).toBe('build');
      expect(result.options).toBeDefined();
    });

    it('should throw error when kind is missing', () => {
      const config = {
        options: {},
      } as any;

      expect(() => validateWorkflowSchema(config)).toThrow(
        'Workflow kind is required'
      );
    });

    it('should validate build preset with build options', () => {
      const config: WorkflowConfig = {
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

      const result = validateWorkflowSchema(config);

      expect(result.options?.build).toBeDefined();
      expect(result.options?.build?.platform).toBe('android');
    });

    it('should throw error for build preset without build options', () => {
      const config: WorkflowConfig = {
        kind: 'build',
        options: {
          platform: 'github',
        },
      };

      expect(() => validateWorkflowSchema(config)).toThrow(
        'Build options are required for build preset'
      );
    });

    it('should handle config without options', () => {
      const config: WorkflowConfig = {
        kind: 'health-check',
      };

      const result = validateWorkflowSchema(config);

      expect(result.kind).toBe('health-check');
      expect(result.options).toEqual({});
    });

    it('should validate non-build presets', () => {
      const config: WorkflowConfig = {
        kind: 'static-analysis',
        options: {
          platform: 'github',
          name: 'Static Analysis',
        },
      };

      const result = validateWorkflowSchema(config);

      expect(result.kind).toBe('static-analysis');
      expect(result.options).toBeDefined();
    });

    it('should validate platform option', () => {
      const config: WorkflowConfig = {
        kind: 'health-check',
        options: {
          platform: 'bitrise',
        },
      };

      const result = validateWorkflowSchema(config);

      expect(result.options?.platform).toBe('bitrise');
    });

    it('should validate name option', () => {
      const config: WorkflowConfig = {
        kind: 'health-check',
        options: {
          name: 'Custom Health Check',
        },
      };

      const result = validateWorkflowSchema(config);

      expect(result.options?.name).toBe('Custom Health Check');
    });

    it('should validate nodeVersions option', () => {
      const config: WorkflowConfig = {
        kind: 'health-check',
        options: {
          nodeVersions: ['18', '20'],
        },
      };

      const result = validateWorkflowSchema(config);

      expect(result.options?.nodeVersions).toEqual(['18', '20']);
    });

    it('should validate packageManager option', () => {
      const config: WorkflowConfig = {
        kind: 'health-check',
        options: {
          packageManager: 'yarn',
        },
      };

      const result = validateWorkflowSchema(config);

      expect(result.options?.packageManager).toBe('yarn');
    });

    it('should throw error for invalid platform', () => {
      const config: WorkflowConfig = {
        kind: 'health-check',
        options: {
          platform: 'invalid-platform' as any,
        },
      };

      expect(() => validateWorkflowSchema(config)).toThrow();
    });

    it('should throw error for invalid package manager', () => {
      const config: WorkflowConfig = {
        kind: 'health-check',
        options: {
          packageManager: 'invalid-pm' as any,
        },
      };

      expect(() => validateWorkflowSchema(config)).toThrow();
    });
  });
});
