import { BuildOptions } from '../../presets/types';
import platformHelpers from '../platforms';

describe('Platform Helpers', () => {
  describe('createAndroidBuildSteps', () => {
    const mockSetupSteps = [
      { name: 'Checkout', uses: 'actions/checkout@v4' },
      { name: 'Setup Node', uses: 'actions/setup-node@v4' },
    ];

    const mockDetermineBuildSourceStep = {
      name: 'Determine Build Source',
      run: 'echo "Determining build source"',
    };

    it('should create Android build steps for debug APK', () => {
      const buildOptions: BuildOptions = {
        platform: 'android',
        variant: 'debug',
        storage: 'github',
        notification: 'none',
      };

      const steps = platformHelpers.createAndroidBuildSteps(
        mockSetupSteps,
        mockDetermineBuildSourceStep,
        'npm',
        '',
        buildOptions
      );

      expect(steps).toHaveLength(7); // setup + determine + verify + setup-java + make-executable + build
      expect(steps[0]).toEqual(mockSetupSteps[0]);
      expect(steps[1]).toEqual(mockSetupSteps[1]);
      expect(steps[2]).toEqual(mockDetermineBuildSourceStep);

      // Check for Android-specific steps
      const verifyStep = steps.find(
        step => step.name === 'Verify Android Environment'
      );
      expect(verifyStep).toBeDefined();
      expect(verifyStep?.run).toContain('Android directory');

      const javaStep = steps.find(step => step.name === 'Setup Java');
      expect(javaStep).toBeDefined();
      expect(javaStep?.uses).toBe('actions/setup-java@v3');
      expect(javaStep?.with?.['java-version']).toBe('17');

      const buildStep = steps.find(step => step.name === 'Run Android Build');
      expect(buildStep).toBeDefined();
      expect(buildStep?.run).toContain('assembleDebug');
    });

    it('should create Android build steps for release APK', () => {
      const buildOptions: BuildOptions = {
        platform: 'android',
        variant: 'release',
        storage: 'github',
        notification: 'none',
      };

      const steps = platformHelpers.createAndroidBuildSteps(
        mockSetupSteps,
        mockDetermineBuildSourceStep,
        'npm',
        '',
        buildOptions
      );

      const buildStep = steps.find(step => step.name === 'Run Android Build');
      expect(buildStep?.run).toContain('assembleRelease');
    });

    it('should handle both APK and AAB output formats', () => {
      const buildOptions: BuildOptions = {
        platform: 'android',
        variant: 'debug',
        storage: 'github',
        notification: 'none',
        androidOutputType: 'both',
      };

      const steps = platformHelpers.createAndroidBuildSteps(
        mockSetupSteps,
        mockDetermineBuildSourceStep,
        'npm',
        '',
        buildOptions
      );

      const buildStep = steps.find(step => step.name === 'Run Android Build');
      expect(buildStep?.run).toContain('assembleDebug');
      expect(buildStep?.run).toContain('bundleDebug');
    });

    it('should handle AAB output format', () => {
      const buildOptions: BuildOptions = {
        platform: 'android',
        variant: 'release',
        storage: 'github',
        notification: 'none',
        androidOutputType: 'aab',
      };

      const steps = platformHelpers.createAndroidBuildSteps(
        mockSetupSteps,
        mockDetermineBuildSourceStep,
        'npm',
        '',
        buildOptions
      );

      const buildStep = steps.find(step => step.name === 'Run Android Build');
      expect(buildStep?.run).toContain('bundleRelease');
    });

    it('should include Gradle wrapper permissions step', () => {
      const buildOptions: BuildOptions = {
        platform: 'android',
        variant: 'debug',
        storage: 'github',
        notification: 'none',
      };

      const steps = platformHelpers.createAndroidBuildSteps(
        mockSetupSteps,
        mockDetermineBuildSourceStep,
        'npm',
        '',
        buildOptions
      );

      const permissionsStep = steps.find(
        step => step.name === 'Make Gradlew Executable'
      );
      expect(permissionsStep).toBeDefined();
      expect(permissionsStep?.run).toContain('chmod +x android/gradlew');
    });

    it('should include Java setup with correct configuration', () => {
      const buildOptions: BuildOptions = {
        platform: 'android',
        variant: 'debug',
        storage: 'github',
        notification: 'none',
      };

      const steps = platformHelpers.createAndroidBuildSteps(
        mockSetupSteps,
        mockDetermineBuildSourceStep,
        'npm',
        '',
        buildOptions
      );

      const javaStep = steps.find(step => step.name === 'Setup Java');
      expect(javaStep?.with).toEqual({
        distribution: 'temurin',
        'java-version': '17',
        cache: 'gradle',
      });
    });
  });

  describe('createIOSBuildSteps', () => {
    const mockSetupSteps = [
      { name: 'Checkout', uses: 'actions/checkout@v4' },
      { name: 'Setup Node', uses: 'actions/setup-node@v4' },
    ];

    const mockDetermineBuildSourceStep = {
      name: 'Determine Build Source',
      run: 'echo "Determining build source"',
    };

    it('should create iOS build steps for debug build', () => {
      const buildOptions: BuildOptions = {
        platform: 'ios',
        variant: 'debug',
        storage: 'github',
        notification: 'none',
      };

      const steps = platformHelpers.createIOSBuildSteps(
        mockSetupSteps,
        mockDetermineBuildSourceStep,
        'npm',
        '',
        buildOptions
      );

      expect(steps).toHaveLength(7); // setup + determine + verify + ruby + pod-install + build
      expect(steps[0]).toEqual(mockSetupSteps[0]);
      expect(steps[1]).toEqual(mockSetupSteps[1]);
      expect(steps[2]).toEqual(mockDetermineBuildSourceStep);

      // Check for iOS-specific steps
      const verifyStep = steps.find(
        step => step.name === 'Verify iOS Environment'
      );
      expect(verifyStep).toBeDefined();
      expect(verifyStep?.run).toContain('iOS directory');
      expect(verifyStep?.run).toContain('Podfile');

      const rubyStep = steps.find(step => step.name === 'Setup Ruby/CocoaPods');
      expect(rubyStep).toBeDefined();
      expect(rubyStep?.uses).toBe('ruby/setup-ruby@v1');

      const podStep = steps.find(step => step.name === 'Install CocoaPods');
      expect(podStep).toBeDefined();
      expect(podStep?.run).toContain('pod install');

      const buildStep = steps.find(step => step.name === 'Run iOS Build');
      expect(buildStep).toBeDefined();
      expect(buildStep?.run).toContain('build-ios');
    });

    it('should create iOS build steps for release build', () => {
      const buildOptions: BuildOptions = {
        platform: 'ios',
        variant: 'release',
        storage: 'github',
        notification: 'none',
      };

      const steps = platformHelpers.createIOSBuildSteps(
        mockSetupSteps,
        mockDetermineBuildSourceStep,
        'npm',
        '',
        buildOptions
      );

      const buildStep = steps.find(step => step.name === 'Run iOS Build');
      expect(buildStep?.run).toContain('release');
    });

    it('should include Ruby/CocoaPods setup with correct configuration', () => {
      const buildOptions: BuildOptions = {
        platform: 'ios',
        variant: 'debug',
        storage: 'github',
        notification: 'none',
      };

      const steps = platformHelpers.createIOSBuildSteps(
        mockSetupSteps,
        mockDetermineBuildSourceStep,
        'npm',
        '',
        buildOptions
      );

      const rubyStep = steps.find(step => step.name === 'Setup Ruby/CocoaPods');
      expect(rubyStep?.with).toEqual({
        'ruby-version': '3.0',
        'bundler-cache': 'true',
        'working-directory': 'ios',
      });
    });

    it('should include CocoaPods installation step', () => {
      const buildOptions: BuildOptions = {
        platform: 'ios',
        variant: 'debug',
        storage: 'github',
        notification: 'none',
      };

      const steps = platformHelpers.createIOSBuildSteps(
        mockSetupSteps,
        mockDetermineBuildSourceStep,
        'npm',
        '',
        buildOptions
      );

      const podStep = steps.find(step => step.name === 'Install CocoaPods');
      expect(podStep?.id).toBe('pod-install');
      expect(podStep?.run).toContain('cd ios');
      expect(podStep?.run).toContain('pod install');
    });

    it('should handle environment file checking', () => {
      const buildOptions: BuildOptions = {
        platform: 'ios',
        variant: 'debug',
        storage: 'github',
        notification: 'none',
      };

      const steps = platformHelpers.createIOSBuildSteps(
        mockSetupSteps,
        mockDetermineBuildSourceStep,
        'npm',
        '',
        buildOptions
      );

      const buildStep = steps.find(step => step.name === 'Run iOS Build');
      expect(buildStep?.run).toContain('.env');
    });

    it('should include artifact verification', () => {
      const buildOptions: BuildOptions = {
        platform: 'ios',
        variant: 'debug',
        storage: 'github',
        notification: 'none',
      };

      const steps = platformHelpers.createIOSBuildSteps(
        mockSetupSteps,
        mockDetermineBuildSourceStep,
        'npm',
        '',
        buildOptions
      );

      const buildStep = steps.find(step => step.name === 'Run iOS Build');
      expect(buildStep?.run).toContain('*.ipa');
    });
  });
});
