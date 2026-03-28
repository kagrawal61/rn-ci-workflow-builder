import { validateBuildSecrets } from '../secrets';
import { BuildOptions } from '../../presets/types';
import { WorkflowOptions } from '../../types';

describe('validateBuildSecrets', () => {
  const baseOptions: WorkflowOptions = { platform: 'github' };
  const baseBuild: BuildOptions = {
    platform: 'android',
    variant: 'debug',
    storage: 'github',
    notification: 'none',
  };

  // ─── github storage ────────────────────────────────────────────────────────

  describe('github storage', () => {
    it('passes with no secrets (github needs none)', () => {
      expect(() => validateBuildSecrets(baseOptions, baseBuild)).not.toThrow();
    });

    it('passes when extra secrets are present', () => {
      expect(() =>
        validateBuildSecrets({ ...baseOptions, secrets: ['EXTRA_SECRET'] }, baseBuild)
      ).not.toThrow();
    });

    it('passes when secrets array is empty', () => {
      expect(() =>
        validateBuildSecrets({ ...baseOptions, secrets: [] }, baseBuild)
      ).not.toThrow();
    });
  });

  // ─── firebase storage ──────────────────────────────────────────────────────

  describe('firebase storage', () => {
    const firebaseBuild: BuildOptions = { ...baseBuild, storage: 'firebase' };

    it('throws when FIREBASE_SERVICE_ACCOUNT is missing', () => {
      expect(() => validateBuildSecrets(baseOptions, firebaseBuild)).toThrow(
        'FIREBASE_SERVICE_ACCOUNT'
      );
    });

    it('throws when FIREBASE_APP_ID_ANDROID is missing for android platform', () => {
      expect(() =>
        validateBuildSecrets(
          { ...baseOptions, secrets: ['FIREBASE_SERVICE_ACCOUNT'] },
          firebaseBuild
        )
      ).toThrow('FIREBASE_APP_ID_ANDROID');
    });

    it('passes when all android firebase secrets are present', () => {
      expect(() =>
        validateBuildSecrets(
          {
            ...baseOptions,
            secrets: ['FIREBASE_SERVICE_ACCOUNT', 'FIREBASE_APP_ID_ANDROID'],
          },
          firebaseBuild
        )
      ).not.toThrow();
    });

    it('throws when FIREBASE_APP_ID_IOS is missing for ios platform', () => {
      expect(() =>
        validateBuildSecrets(
          { ...baseOptions, secrets: ['FIREBASE_SERVICE_ACCOUNT'] },
          { ...firebaseBuild, platform: 'ios' }
        )
      ).toThrow('FIREBASE_APP_ID_IOS');
    });

    it('passes when all ios firebase secrets are present', () => {
      expect(() =>
        validateBuildSecrets(
          {
            ...baseOptions,
            secrets: ['FIREBASE_SERVICE_ACCOUNT', 'FIREBASE_APP_ID_IOS'],
          },
          { ...firebaseBuild, platform: 'ios' }
        )
      ).not.toThrow();
    });

    it('throws when platform is both and ios secret is missing', () => {
      expect(() =>
        validateBuildSecrets(
          {
            ...baseOptions,
            secrets: ['FIREBASE_SERVICE_ACCOUNT', 'FIREBASE_APP_ID_ANDROID'],
          },
          { ...firebaseBuild, platform: 'both' }
        )
      ).toThrow('FIREBASE_APP_ID_IOS');
    });

    it('passes when all both-platform firebase secrets are present', () => {
      expect(() =>
        validateBuildSecrets(
          {
            ...baseOptions,
            secrets: [
              'FIREBASE_SERVICE_ACCOUNT',
              'FIREBASE_APP_ID_ANDROID',
              'FIREBASE_APP_ID_IOS',
            ],
          },
          { ...firebaseBuild, platform: 'both' }
        )
      ).not.toThrow();
    });
  });

  // ─── s3 storage ────────────────────────────────────────────────────────────

  describe('s3 storage', () => {
    const s3Build: BuildOptions = { ...baseBuild, storage: 's3' };

    it('throws when no s3 secrets are provided', () => {
      expect(() => validateBuildSecrets(baseOptions, s3Build)).toThrow();
    });

    it('throws specifically for AWS_ACCESS_KEY_ID', () => {
      expect(() => validateBuildSecrets(baseOptions, s3Build)).toThrow(
        'AWS_ACCESS_KEY_ID'
      );
    });

    it('throws for AWS_SECRET_ACCESS_KEY when key id is present', () => {
      expect(() =>
        validateBuildSecrets(
          { ...baseOptions, secrets: ['AWS_ACCESS_KEY_ID'] },
          s3Build
        )
      ).toThrow('AWS_SECRET_ACCESS_KEY');
    });

    it('passes when all required s3 secrets are present', () => {
      expect(() =>
        validateBuildSecrets(
          {
            ...baseOptions,
            secrets: [
              'AWS_ACCESS_KEY_ID',
              'AWS_SECRET_ACCESS_KEY',
              'AWS_REGION',
              'AWS_S3_BUCKET',
            ],
          },
          s3Build
        )
      ).not.toThrow();
    });
  });

  // ─── drive storage ─────────────────────────────────────────────────────────

  describe('drive storage', () => {
    const driveBuild: BuildOptions = { ...baseBuild, storage: 'drive' };

    it('throws when drive secret is missing', () => {
      expect(() => validateBuildSecrets(baseOptions, driveBuild)).toThrow();
    });

    it('passes when the drive secret is present', () => {
      // Documents current required secret name — see roadmap bug B for correct name fix
      expect(() =>
        validateBuildSecrets(
          { ...baseOptions, secrets: ['GOOGLE_SERVICE_ACCOUNT'] },
          driveBuild
        )
      ).not.toThrow();
    });
  });

  // ─── notification secrets ──────────────────────────────────────────────────

  describe('slack notification', () => {
    it('throws when SLACK_WEBHOOK is missing', () => {
      expect(() =>
        validateBuildSecrets(baseOptions, { ...baseBuild, notification: 'slack' })
      ).toThrow('SLACK_WEBHOOK');
    });

    it('passes when SLACK_WEBHOOK is present', () => {
      expect(() =>
        validateBuildSecrets(
          { ...baseOptions, secrets: ['SLACK_WEBHOOK'] },
          { ...baseBuild, notification: 'slack' }
        )
      ).not.toThrow();
    });

    it('requires SLACK_WEBHOOK for both notification type', () => {
      expect(() =>
        validateBuildSecrets(baseOptions, { ...baseBuild, notification: 'both' })
      ).toThrow('SLACK_WEBHOOK');
    });

    it('passes for pr-comment notification with no secrets', () => {
      expect(() =>
        validateBuildSecrets(baseOptions, { ...baseBuild, notification: 'pr-comment' })
      ).not.toThrow();
    });

    it('passes for none notification with no secrets', () => {
      expect(() =>
        validateBuildSecrets(baseOptions, { ...baseBuild, notification: 'none' })
      ).not.toThrow();
    });
  });

  // ─── no storage / undefined ────────────────────────────────────────────────

  describe('undefined storage', () => {
    it('passes when storage is not set', () => {
      const noBuild: BuildOptions = {
        platform: 'android',
        variant: 'debug',
        notification: 'none',
      };
      expect(() => validateBuildSecrets(baseOptions, noBuild)).not.toThrow();
    });
  });
});
