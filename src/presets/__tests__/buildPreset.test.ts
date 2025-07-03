import { WorkflowOptions } from '../../types';
import { BuildOptions } from '../types';

// Mock the helper modules
jest.mock('../../helpers/platforms', () => ({
  __esModule: true,
  default: {
    createAndroidBuildSteps: jest.fn(() => [
      { name: 'Mock Android Build Step', run: 'echo "android build"' },
    ]),
    createIOSBuildSteps: jest.fn(() => [
      { name: 'Mock iOS Build Step', run: 'echo "ios build"' },
    ]),
  },
}));

jest.mock('../../helpers/storage', () => ({
  __esModule: true,
  default: {
    createAndroidStorageSteps: jest.fn(() => [
      { name: 'Mock Android Storage Step', run: 'echo "android storage"' },
    ]),
    createIOSStorageSteps: jest.fn(() => [
      { name: 'Mock iOS Storage Step', run: 'echo "ios storage"' },
    ]),
  },
}));

jest.mock('../../helpers/notifications', () => ({
  __esModule: true,
  default: {
    createAndroidNotificationSteps: jest.fn(() => [
      {
        name: 'Mock Android Notification Step',
        run: 'echo "android notification"',
      },
    ]),
    createIOSNotificationSteps: jest.fn(() => [
      { name: 'Mock iOS Notification Step', run: 'echo "ios notification"' },
    ]),
  },
}));

jest.mock('../../helpers/steps', () => ({
  __esModule: true,
  buildStaticAnalysisSteps: jest.fn(() => [
    { name: 'TypeScript', run: 'tsc --noEmit' },
    { name: 'ESLint', run: 'npm run lint' },
    { name: 'Unit tests', run: 'npm test -- --ci' },
  ]),
  default: {
    createSetupSteps: jest.fn(() => [
      { name: 'Checkout', uses: 'actions/checkout@v4' },
      { name: 'Setup Node', uses: 'actions/setup-node@v4' },
      { name: 'Install', run: 'npm ci' },
    ]),
    createSourceDetectionStep: jest.fn(() => ({
      name: 'Determine Build Source',
      id: 'build-source',
      run: 'echo "detecting source"',
    })),
  },
}));

// Import the buildPreset after mocking
import { buildBuildPipeline as buildPreset } from '../buildPreset';

describe('Build Preset', () => {
  const mockOptions: WorkflowOptions & { build: BuildOptions } = {
    platform: 'github',
    build: {
      platform: 'android',
      variant: 'debug',
      storage: 'github',
      notification: 'none',
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Android builds', () => {
    it('should generate GitHub Actions workflow for Android debug build', () => {
      const result = buildPreset(mockOptions);

      expect(result).toHaveProperty('name');
      expect(result).toHaveProperty('on');
      expect(result).toHaveProperty('jobs');

      // Check that it's a GitHub Actions workflow structure
      expect(result.jobs).toHaveProperty('build-android');
      expect(result.jobs['build-android']).toHaveProperty('runs-on');
      expect(result.jobs['build-android']).toHaveProperty('steps');
    });

    it('should include Android-specific steps', () => {
      const result = buildPreset(mockOptions);

      const steps = result.jobs['build-android'].steps;
      const androidBuildStep = steps.find(
        (step: any) => step.name === 'Mock Android Build Step'
      );

      expect(androidBuildStep).toBeDefined();
    });

    it('should include storage steps for Android', () => {
      const result = buildPreset(mockOptions);

      const steps = result.jobs['build-android'].steps;
      const storageStep = steps.find(
        (step: any) => step.name === 'Mock Android Storage Step'
      );

      expect(storageStep).toBeDefined();
    });

    it('should include notification steps for Android when configured', () => {
      const optionsWithNotifications = {
        ...mockOptions,
        build: {
          ...mockOptions.build,
          notification: 'slack' as const,
        },
      };

      const result = buildPreset(optionsWithNotifications);

      const steps = result.jobs['build-android'].steps;
      const notificationStep = steps.find(
        (step: any) => step.name === 'Mock Android Notification Step'
      );

      expect(notificationStep).toBeDefined();
    });

    it('should handle Android release builds', () => {
      const releaseOptions = {
        ...mockOptions,
        build: {
          ...mockOptions.build,
          variant: 'release' as const,
        },
      };

      const result = buildPreset(releaseOptions);

      expect(result).toHaveProperty('jobs');
      expect(result.jobs['build-android'].steps).toBeDefined();
    });

    it('should handle different Android storage options', () => {
      const firebaseOptions = {
        ...mockOptions,
        build: {
          ...mockOptions.build,
          storage: 'firebase' as const,
        },
      };

      const result = buildPreset(firebaseOptions);

      expect(result).toHaveProperty('jobs');
      expect(result.jobs['build-android'].steps).toBeDefined();
    });
  });

  describe('iOS builds', () => {
    it('should generate workflow for iOS debug build', () => {
      const iosOptions = {
        ...mockOptions,
        build: {
          ...mockOptions.build,
          platform: 'ios' as const,
        },
      };

      const result = buildPreset(iosOptions);

      expect(result).toHaveProperty('jobs');
      expect(result.jobs['build-ios']).toHaveProperty(
        'runs-on',
        'macos-latest'
      );
    });

    it('should include iOS-specific steps', () => {
      const iosOptions = {
        ...mockOptions,
        build: {
          ...mockOptions.build,
          platform: 'ios' as const,
        },
      };

      const result = buildPreset(iosOptions);

      const steps = result.jobs['build-ios'].steps;
      const iosBuildStep = steps.find(
        (step: any) => step.name === 'Mock iOS Build Step'
      );

      expect(iosBuildStep).toBeDefined();
    });

    it('should include iOS storage steps', () => {
      const iosOptions = {
        ...mockOptions,
        build: {
          ...mockOptions.build,
          platform: 'ios' as const,
        },
      };

      const result = buildPreset(iosOptions);

      const steps = result.jobs['build-ios'].steps;
      const storageStep = steps.find(
        (step: any) => step.name === 'Mock iOS Storage Step'
      );

      expect(storageStep).toBeDefined();
    });

    it('should use macOS runner for iOS builds', () => {
      const iosOptions = {
        ...mockOptions,
        build: {
          ...mockOptions.build,
          platform: 'ios' as const,
        },
      };

      const result = buildPreset(iosOptions);

      expect(result.jobs['build-ios']['runs-on']).toBe('macos-latest');
    });
  });

  describe('Both platforms', () => {
    it('should generate workflow for both platforms', () => {
      const bothOptions = {
        ...mockOptions,
        build: {
          ...mockOptions.build,
          platform: 'both' as const,
        },
      };

      const result = buildPreset(bothOptions);

      expect(result).toHaveProperty('jobs');
      expect(result.jobs).toHaveProperty('build-android');
      expect(result.jobs).toHaveProperty('build-ios');
    });

    it('should configure Android job correctly when building both', () => {
      const bothOptions = {
        ...mockOptions,
        build: {
          ...mockOptions.build,
          platform: 'both' as const,
        },
      };

      const result = buildPreset(bothOptions);

      expect(result.jobs['build-android']['runs-on']).toBe('ubuntu-latest');
      expect(result.jobs['build-android'].steps).toBeDefined();
    });

    it('should configure iOS job correctly when building both', () => {
      const bothOptions = {
        ...mockOptions,
        build: {
          ...mockOptions.build,
          platform: 'both' as const,
        },
      };

      const result = buildPreset(bothOptions);

      expect(result.jobs['build-ios']['runs-on']).toBe('macos-latest');
      expect(result.jobs['build-ios'].steps).toBeDefined();
    });
  });

  describe('workflow configuration', () => {
    it('should set correct workflow name', () => {
      const result = buildPreset(mockOptions);

      expect(result.name).toContain('Build');
    });

    it('should include proper triggers', () => {
      const result = buildPreset(mockOptions);

      expect(result.on).toHaveProperty('push');
      expect(result.on).toHaveProperty('pull_request');
    });

    it('should include custom name when provided', () => {
      const namedOptions = {
        ...mockOptions,
        name: 'Custom Build Workflow',
      };

      const result = buildPreset(namedOptions);

      expect(result.name).toBe('Custom Build Workflow');
    });

    it('should handle custom triggers when provided', () => {
      const customTriggerOptions = {
        ...mockOptions,
        triggers: {
          push: { branches: ['main', 'develop'] },
          schedule: [{ cron: '0 0 * * 0' }],
        },
      };

      const result = buildPreset(customTriggerOptions);

      expect((result.on.push as any).branches).toEqual(['main', 'develop']);
      expect(result.on.schedule).toEqual([{ cron: '0 0 * * 0' }]);
    });

    it('should include environment variables when provided', () => {
      const envOptions = {
        ...mockOptions,
        env: {
          NODE_ENV: 'production',
          API_URL: 'https://api.example.com',
        },
      };

      const result = buildPreset(envOptions);

      expect(result.env).toEqual({
        NODE_ENV: 'production',
        API_URL: 'https://api.example.com',
      });
    });
  });

  describe('default handling', () => {
    it('should handle missing build options with defaults', () => {
      const optionsWithoutBuild = {
        platform: 'github',
      } as any;

      // Should not throw, should use defaults
      const result = buildPreset(optionsWithoutBuild);

      expect(result).toHaveProperty('jobs');
      expect(result).toHaveProperty('name');
    });

    it('should handle unusual platform values gracefully', () => {
      const invalidPlatformOptions = {
        ...mockOptions,
        build: {
          ...mockOptions.build,
          platform: 'invalid' as any,
        },
      };

      // Should not throw, function handles gracefully
      const result = buildPreset(invalidPlatformOptions);

      expect(result).toHaveProperty('jobs');
      expect(result).toHaveProperty('name');
    });
  });

  describe('step composition', () => {
    it('should include mocked Android build steps', () => {
      const result = buildPreset(mockOptions);

      const steps = result.jobs['build-android'].steps;
      const androidBuildStep = steps.find(
        (step: any) => step.name === 'Mock Android Build Step'
      );

      expect(androidBuildStep).toBeDefined();
      expect(steps.length).toBeGreaterThan(0);
    });

    it('should include mocked storage steps', () => {
      const result = buildPreset(mockOptions);

      const steps = result.jobs['build-android'].steps;
      const storageStep = steps.find(
        (step: any) => step.name === 'Mock Android Storage Step'
      );

      expect(storageStep).toBeDefined();
    });

    it('should have the expected number of steps', () => {
      const result = buildPreset(mockOptions);

      const steps = result.jobs['build-android'].steps;

      // The mocked platform helper should return at least the build step
      // plus any storage steps for the 'none' notification scenario
      expect(steps.length).toBeGreaterThan(0);
      expect(Array.isArray(steps)).toBe(true);
    });
  });
});
