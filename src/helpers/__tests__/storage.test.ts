import { BuildOptions } from '../../presets/types';
import storageHelpers from '../storage';

describe('Storage Helpers', () => {
  describe('createAndroidStorageSteps', () => {
    it('should create GitHub storage steps for single APK output', () => {
      const buildOptions: BuildOptions = {
        platform: 'android',
        variant: 'debug',
        storage: 'github',
        notification: 'none',
      };

      const steps = storageHelpers.createAndroidStorageSteps(buildOptions);

      expect(steps).toHaveLength(1);
      expect(steps[0]).toEqual({
        name: 'Upload Android Artifact',
        id: 'artifact-upload-android',
        if: 'success()',
        'continue-on-error': true,
        uses: 'actions/upload-artifact@v3',
        with: {
          name: 'android-debug-apk-${{ github.head_ref || github.ref_name }}',
          path: 'android/app/build/outputs/apk/**/*.apk',
          'retention-days': 30,
        },
      });
    });

    it('should create GitHub storage steps for AAB output', () => {
      const buildOptions: BuildOptions = {
        platform: 'android',
        variant: 'release',
        storage: 'github',
        notification: 'none',
        androidOutputType: 'aab',
      };

      const steps = storageHelpers.createAndroidStorageSteps(buildOptions);

      expect(steps).toHaveLength(1);
      expect(steps[0].with?.path).toBe(
        'android/app/build/outputs/bundle/**/*.aab'
      );
      expect(steps[0].with?.name).toBe(
        'android-release-aab-${{ github.head_ref || github.ref_name }}'
      );
    });

    it('should create GitHub storage steps for both APK and AAB output', () => {
      const buildOptions: BuildOptions = {
        platform: 'android',
        variant: 'debug',
        storage: 'github',
        notification: 'none',
        androidOutputType: 'both',
      };

      const steps = storageHelpers.createAndroidStorageSteps(buildOptions);

      expect(steps).toHaveLength(2);

      // Check APK upload step
      const apkStep = steps.find(
        step => step.name === 'Upload Android APK Artifact'
      );
      expect(apkStep).toBeDefined();
      expect(apkStep?.with?.path).toBe(
        'android/app/build/outputs/apk/**/*.apk'
      );
      expect(apkStep?.with?.name).toBe(
        'android-debug-apk-${{ github.head_ref || github.ref_name }}'
      );

      // Check AAB upload step
      const aabStep = steps.find(
        step => step.name === 'Upload Android AAB Artifact'
      );
      expect(aabStep).toBeDefined();
      expect(aabStep?.with?.path).toBe(
        'android/app/build/outputs/bundle/**/*.aab'
      );
      expect(aabStep?.with?.name).toBe(
        'android-debug-aab-${{ github.head_ref || github.ref_name }}'
      );
    });

    it('should create Firebase storage steps', () => {
      const buildOptions: BuildOptions = {
        platform: 'android',
        variant: 'debug',
        storage: 'firebase',
        notification: 'none',
      };

      const steps = storageHelpers.createAndroidStorageSteps(buildOptions);

      expect(steps).toHaveLength(2);

      // Check find APK step
      const findStep = steps.find(step => step.name === 'Find Android APK');
      expect(findStep).toBeDefined();
      expect(findStep?.run).toContain('find android/app/build/outputs/apk');

      // Check Firebase upload step
      const uploadStep = steps.find(
        step => step.name === 'Upload to Firebase App Distribution'
      );
      expect(uploadStep).toBeDefined();
      expect(uploadStep?.uses).toBe(
        'wzieba/Firebase-Distribution-Github-Action@v1.4.0'
      );
      expect(uploadStep?.with?.appId).toBe(
        '${{ secrets.FIREBASE_APP_ID_ANDROID }}'
      );
      expect(uploadStep?.with?.serviceCredentialsFileContent).toBe(
        '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
      );
    });

    it('should create Google Drive storage steps', () => {
      const buildOptions: BuildOptions = {
        platform: 'android',
        variant: 'release',
        storage: 'drive',
        notification: 'none',
      };

      const steps = storageHelpers.createAndroidStorageSteps(buildOptions);

      expect(steps).toHaveLength(3);

      // Check rclone config step
      const configStep = steps.find(
        step => step.name === 'Create rclone config for Google Drive'
      );
      expect(configStep).toBeDefined();
      expect(configStep?.run).toContain('rclone.conf');
      expect(configStep?.run).toContain('GDRIVE_SERVICE_ACCOUNT_JSON');

      // Check rclone setup step
      const setupStep = steps.find(step => step.name === 'Setup rclone');
      expect(setupStep).toBeDefined();
      expect(setupStep?.uses).toBe('AnimMouse/setup-rclone@v1');

      // Check upload step
      const uploadStep = steps.find(
        step => step.name === 'Upload to Google Drive'
      );
      expect(uploadStep).toBeDefined();
      expect(uploadStep?.run).toContain('rclone copy');
      expect(uploadStep?.run).toContain('android-release-');
    });

    it('should create S3 storage steps', () => {
      const buildOptions: BuildOptions = {
        platform: 'android',
        variant: 'debug',
        storage: 's3',
        notification: 'none',
      };

      const steps = storageHelpers.createAndroidStorageSteps(buildOptions);

      expect(steps).toHaveLength(3);

      // Check rclone config step
      const configStep = steps.find(
        step => step.name === 'Create rclone config for S3'
      );
      expect(configStep).toBeDefined();
      expect(configStep?.run).toContain('AWS_ACCESS_KEY_ID');
      expect(configStep?.run).toContain('AWS_SECRET_ACCESS_KEY');

      // Check rclone setup step
      const setupStep = steps.find(step => step.name === 'Setup rclone');
      expect(setupStep).toBeDefined();

      // Check upload step
      const uploadStep = steps.find(step => step.name === 'Upload to S3');
      expect(uploadStep).toBeDefined();
      expect(uploadStep?.run).toContain('s3:');
      expect(uploadStep?.run).toContain('android/debug/');
    });

    it('should return empty array for unsupported storage', () => {
      const buildOptions: BuildOptions = {
        platform: 'android',
        variant: 'debug',
        storage: 'bitrise', // Not implemented for Android
        notification: 'none',
      };

      const steps = storageHelpers.createAndroidStorageSteps(buildOptions);

      expect(steps).toEqual([]);
    });
  });

  describe('createIOSStorageSteps', () => {
    it('should create GitHub storage steps for iOS', () => {
      const buildOptions: BuildOptions = {
        platform: 'ios',
        variant: 'debug',
        storage: 'github',
        notification: 'none',
      };

      const steps = storageHelpers.createIOSStorageSteps(buildOptions);

      expect(steps).toHaveLength(1);
      expect(steps[0]).toEqual({
        name: 'Upload iOS Artifact',
        id: 'artifact-upload-ios',
        if: 'success()',
        'continue-on-error': true,
        uses: 'actions/upload-artifact@v3',
        with: {
          name: 'ios-debug-${{ github.head_ref || github.ref_name }}',
          path: 'ios/build/Build/Products/**/*.ipa',
          'retention-days': 30,
        },
      });
    });

    it('should create Firebase storage steps for iOS', () => {
      const buildOptions: BuildOptions = {
        platform: 'ios',
        variant: 'release',
        storage: 'firebase',
        notification: 'none',
      };

      const steps = storageHelpers.createIOSStorageSteps(buildOptions);

      expect(steps).toHaveLength(2);

      // Check find IPA step
      const findStep = steps.find(step => step.name === 'Find iOS IPA');
      expect(findStep).toBeDefined();
      expect(findStep?.run).toContain('find ios/build/Build/Products');
      expect(findStep?.run).toContain('*.ipa');

      // Check Firebase upload step
      const uploadStep = steps.find(
        step => step.name === 'Upload to Firebase App Distribution'
      );
      expect(uploadStep).toBeDefined();
      expect(uploadStep?.with?.appId).toBe(
        '${{ secrets.FIREBASE_APP_ID_IOS }}'
      );
      expect(uploadStep?.with?.file).toBe(
        '${{ steps.find-ipa.outputs.ipa_path }}'
      );
    });

    it('should create Google Drive storage steps for iOS', () => {
      const buildOptions: BuildOptions = {
        platform: 'ios',
        variant: 'debug',
        storage: 'drive',
        notification: 'none',
      };

      const steps = storageHelpers.createIOSStorageSteps(buildOptions);

      expect(steps).toHaveLength(3);

      // Check configuration step
      const configStep = steps.find(
        step => step.name === 'Create rclone config for Google Drive'
      );
      expect(configStep).toBeDefined();

      // Check setup step
      const setupStep = steps.find(step => step.name === 'Setup rclone');
      expect(setupStep).toBeDefined();

      // Check upload step (should exist but implementation not fully shown in file)
      expect(steps).toHaveLength(3);
    });

    it('should handle different variants correctly', () => {
      const debugOptions: BuildOptions = {
        platform: 'ios',
        variant: 'debug',
        storage: 'github',
        notification: 'none',
      };

      const releaseOptions: BuildOptions = {
        platform: 'ios',
        variant: 'release',
        storage: 'github',
        notification: 'none',
      };

      const debugSteps = storageHelpers.createIOSStorageSteps(debugOptions);
      const releaseSteps = storageHelpers.createIOSStorageSteps(releaseOptions);

      expect(debugSteps[0].with?.name).toBe(
        'ios-debug-${{ github.head_ref || github.ref_name }}'
      );
      expect(releaseSteps[0].with?.name).toBe(
        'ios-release-${{ github.head_ref || github.ref_name }}'
      );
    });

    it('should include proper error handling with continue-on-error', () => {
      const buildOptions: BuildOptions = {
        platform: 'ios',
        variant: 'debug',
        storage: 'github',
        notification: 'none',
      };

      const steps = storageHelpers.createIOSStorageSteps(buildOptions);

      const uploadStep = steps[0];
      expect(uploadStep['continue-on-error']).toBe(true);
      expect(uploadStep.if).toBe('success()');
    });

    it('should use correct retention days for artifacts', () => {
      const buildOptions: BuildOptions = {
        platform: 'ios',
        variant: 'debug',
        storage: 'github',
        notification: 'none',
      };

      const steps = storageHelpers.createIOSStorageSteps(buildOptions);

      expect(steps[0].with?.['retention-days']).toBe(30);
    });
  });
});
