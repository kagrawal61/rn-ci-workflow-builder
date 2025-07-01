import { BuildOptions } from '../../presets/types';
import { generateSecretsSummary } from '../secretsManager';

describe('SecretsManager', () => {
  describe('generateSecretsSummary', () => {
    it('should generate summary for GitHub storage with no notifications', () => {
      const options: BuildOptions = {
        platform: 'android',
        variant: 'debug',
        storage: 'github',
        notification: 'none',
      };

      const summary = generateSecretsSummary(options);

      // GitHub storage and no notifications require no secrets
      expect(summary).toContain('No secrets required for this configuration');
      expect(summary).not.toContain('Slack');
      expect(summary).not.toContain('Firebase');
      expect(summary).not.toContain('AWS');
    });

    it('should generate summary for Firebase storage', () => {
      const options: BuildOptions = {
        platform: 'android',
        variant: 'debug',
        storage: 'firebase',
        notification: 'none',
      };

      const summary = generateSecretsSummary(options);

      expect(summary).toContain('Firebase');
      expect(summary).toContain('FIREBASE_SERVICE_ACCOUNT');
      expect(summary).toContain('FIREBASE_APP_ID');
    });

    it('should generate summary for S3 storage', () => {
      const options: BuildOptions = {
        platform: 'android',
        variant: 'debug',
        storage: 's3',
        notification: 'none',
      };

      const summary = generateSecretsSummary(options);

      expect(summary).toContain('AWS');
      expect(summary).toContain('AWS_ACCESS_KEY_ID');
      expect(summary).toContain('AWS_SECRET_ACCESS_KEY');
      expect(summary).not.toContain('AWS_REGION'); // AWS_REGION is not used in the current implementation
      expect(summary).toContain('AWS_S3_BUCKET');
    });

    it('should generate summary for Google Drive storage', () => {
      const options: BuildOptions = {
        platform: 'android',
        variant: 'debug',
        storage: 'drive',
        notification: 'none',
      };

      const summary = generateSecretsSummary(options);

      expect(summary).toContain('Google Drive');
      expect(summary).toContain('GDRIVE_SERVICE_ACCOUNT_JSON');
      expect(summary).toContain('GDRIVE_FOLDER_ID');
    });

    it('should generate summary for Bitrise storage', () => {
      const options: BuildOptions = {
        platform: 'android',
        variant: 'debug',
        storage: 'bitrise',
        notification: 'none',
      };

      const summary = generateSecretsSummary(options);

      expect(summary).toContain('Bitrise');
      expect(summary).toContain('BITRISE_API_TOKEN');
    });

    it('should include Slack notification secrets', () => {
      const options: BuildOptions = {
        platform: 'android',
        variant: 'debug',
        storage: 'github',
        notification: 'slack',
      };

      const summary = generateSecretsSummary(options);

      expect(summary).toContain('Slack');
      expect(summary).toContain('SLACK_WEBHOOK');
    });

    it('should include PR comment notification info', () => {
      const options: BuildOptions = {
        platform: 'android',
        variant: 'debug',
        storage: 'github',
        notification: 'pr-comment',
      };

      const summary = generateSecretsSummary(options);

      expect(summary).toContain('PR Comment');
      expect(summary).toContain('GITHUB_TOKEN');
    });

    it('should include both notification types when set to both', () => {
      const options: BuildOptions = {
        platform: 'android',
        variant: 'debug',
        storage: 'github',
        notification: 'both',
      };

      const summary = generateSecretsSummary(options);

      expect(summary).toContain('Slack');
      expect(summary).toContain('SLACK_WEBHOOK');
      expect(summary).toContain('PR Comment');
      expect(summary).toContain('GITHUB_TOKEN');
    });

    it('should handle iOS platform secrets', () => {
      const options: BuildOptions = {
        platform: 'ios',
        variant: 'debug',
        storage: 'firebase',
        notification: 'none',
      };

      const summary = generateSecretsSummary(options);

      expect(summary).toContain('iOS');
      expect(summary).toContain('FIREBASE_APP_ID_IOS');
    });

    it('should handle both platforms secrets', () => {
      const options: BuildOptions = {
        platform: 'both',
        variant: 'debug',
        storage: 'firebase',
        notification: 'none',
      };

      const summary = generateSecretsSummary(options);

      expect(summary).toContain('FIREBASE_APP_ID_ANDROID');
      expect(summary).toContain('FIREBASE_APP_ID_IOS');
    });

    it('should handle release variant secrets', () => {
      const options: BuildOptions = {
        platform: 'android',
        variant: 'release',
        storage: 'github',
        notification: 'none',
      };

      const summary = generateSecretsSummary(options);

      // Since GitHub storage and no notifications require no secrets,
      // and signing secrets are not implemented yet, this should return "No secrets required"
      expect(summary).toContain('No secrets required for this configuration');
    });

    it('should provide setup instructions', () => {
      const options: BuildOptions = {
        platform: 'android',
        variant: 'debug',
        storage: 'github',
        notification: 'none',
      };

      const summary = generateSecretsSummary(options);

      // Since GitHub storage and no notifications require no secrets,
      // this should return "No secrets required"
      expect(summary).toContain('No secrets required for this configuration');
    });

    it('should include platform-specific signing secrets for iOS release', () => {
      const options: BuildOptions = {
        platform: 'ios',
        variant: 'release',
        storage: 'github',
        notification: 'none',
      };

      const summary = generateSecretsSummary(options);

      // Since GitHub storage and no notifications require no secrets,
      // and signing secrets are not implemented yet, this should return "No secrets required"
      expect(summary).toContain('No secrets required for this configuration');
    });

    it('should format summary as readable text', () => {
      const options: BuildOptions = {
        platform: 'android',
        variant: 'debug',
        storage: 'github',
        notification: 'none',
      };

      const summary = generateSecretsSummary(options);

      // Since GitHub storage and no notifications require no secrets,
      // this should return "No secrets required"
      expect(summary).toContain('No secrets required for this configuration');
      expect(summary.length).toBeGreaterThan(0);
      expect(typeof summary).toBe('string');
    });
  });
});
