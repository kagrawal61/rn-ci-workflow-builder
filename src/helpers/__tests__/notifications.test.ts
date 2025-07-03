import { BuildOptions } from '../../presets/types';
import notificationHelpers from '../notifications';

describe('Notification Helpers', () => {
  describe('createAndroidNotificationSteps', () => {
    it('should create no steps when notification is none', () => {
      const buildOptions: BuildOptions = {
        platform: 'android',
        variant: 'debug',
        storage: 'github',
        notification: 'none',
      };

      const steps =
        notificationHelpers.createAndroidNotificationSteps(buildOptions);

      expect(steps).toHaveLength(0);
    });

    it('should create Slack notification step when notification is slack', () => {
      const buildOptions: BuildOptions = {
        platform: 'android',
        variant: 'debug',
        storage: 'github',
        notification: 'slack',
      };

      const steps =
        notificationHelpers.createAndroidNotificationSteps(buildOptions);

      expect(steps).toHaveLength(1);

      const slackStep = steps[0];
      expect(slackStep.name).toBe('Send Slack Notification');
      expect(slackStep.if).toBe('always()');
      expect(slackStep.uses).toBe('slackapi/slack-github-action@v2.1.0');
      expect(slackStep.with?.payload).toContain('Android Build Result');
      expect(slackStep.with?.['webhook-type']).toBe('incoming-webhook');
    });

    it('should create PR comment steps when notification is pr-comment', () => {
      const buildOptions: BuildOptions = {
        platform: 'android',
        variant: 'release',
        storage: 'github',
        notification: 'pr-comment',
      };

      const steps =
        notificationHelpers.createAndroidNotificationSteps(buildOptions);

      expect(steps).toHaveLength(3); // PR status detection + CLI setup + PR comment

      // Check PR status detection step
      const statusStep = steps.find(
        step => step.name === 'Determine PR Status'
      );
      expect(statusStep).toBeDefined();
      expect(statusStep?.id).toBe('build-source');

      // Check GitHub CLI setup step
      const cliStep = steps.find(step => step.name === 'Setup GitHub CLI');
      expect(cliStep).toBeDefined();
      expect(cliStep?.if).toBe("steps.build-source.outputs.is_pr == 'true'");
      expect(cliStep?.run).toContain('gh --version');

      // Check PR comment step
      const commentStep = steps.find(
        step => step.name === 'Add PR Comment via GitHub CLI'
      );
      expect(commentStep).toBeDefined();
      expect(commentStep?.if).toBe(
        "steps.build-source.outputs.is_pr == 'true'"
      );
      expect(commentStep?.run).toContain('Android release build completed');
      expect(commentStep?.env?.GH_TOKEN).toBe('${{ secrets.GITHUB_TOKEN }}');
    });

    it('should create both Slack and PR comment steps when notification is both', () => {
      const buildOptions: BuildOptions = {
        platform: 'android',
        variant: 'debug',
        storage: 'firebase',
        notification: 'both',
      };

      const steps =
        notificationHelpers.createAndroidNotificationSteps(buildOptions);

      expect(steps).toHaveLength(4); // Slack + PR status detection + CLI setup + PR comment

      // Check Slack step
      const slackStep = steps.find(
        step => step.name === 'Send Slack Notification'
      );
      expect(slackStep).toBeDefined();
      expect(slackStep?.uses).toBe('slackapi/slack-github-action@v2.1.0');

      // Check GitHub CLI step
      const cliStep = steps.find(step => step.name === 'Setup GitHub CLI');
      expect(cliStep).toBeDefined();

      // Check PR comment step
      const commentStep = steps.find(
        step => step.name === 'Add PR Comment via GitHub CLI'
      );
      expect(commentStep).toBeDefined();
    });

    it('should handle different storage types in PR comments', () => {
      const firebaseOptions: BuildOptions = {
        platform: 'android',
        variant: 'debug',
        storage: 'firebase',
        notification: 'pr-comment',
      };

      const s3Options: BuildOptions = {
        platform: 'android',
        variant: 'debug',
        storage: 's3',
        notification: 'pr-comment',
      };

      const firebaseSteps =
        notificationHelpers.createAndroidNotificationSteps(firebaseOptions);
      const s3Steps =
        notificationHelpers.createAndroidNotificationSteps(s3Options);

      const firebaseComment = firebaseSteps.find(
        step => step.name === 'Add PR Comment via GitHub CLI'
      );
      const s3Comment = s3Steps.find(
        step => step.name === 'Add PR Comment via GitHub CLI'
      );

      expect(firebaseComment?.run).toContain('Firebase App Distribution');
      expect(s3Comment?.run).toContain('${{ secrets.S3_BASE_URL }}');
    });

    it('should verify GitHub CLI is pre-installed', () => {
      const buildOptions: BuildOptions = {
        platform: 'android',
        variant: 'debug',
        storage: 'github',
        notification: 'pr-comment',
      };

      const steps =
        notificationHelpers.createAndroidNotificationSteps(buildOptions);

      const cliStep = steps.find(step => step.name === 'Setup GitHub CLI');
      expect(cliStep?.run).toContain('GitHub CLI is pre-installed');
      expect(cliStep?.run).toContain('gh --version');
    });
  });

  describe('createIOSNotificationSteps', () => {
    it('should create no steps when notification is none', () => {
      const buildOptions: BuildOptions = {
        platform: 'ios',
        variant: 'debug',
        storage: 'github',
        notification: 'none',
      };

      const steps =
        notificationHelpers.createIOSNotificationSteps(buildOptions);

      expect(steps).toHaveLength(0);
    });

    it('should create Slack notification step for iOS', () => {
      const buildOptions: BuildOptions = {
        platform: 'ios',
        variant: 'release',
        storage: 'github',
        notification: 'slack',
      };

      const steps =
        notificationHelpers.createIOSNotificationSteps(buildOptions);

      expect(steps).toHaveLength(1);

      const slackStep = steps[0];
      expect(slackStep.name).toBe('Send Slack Notification');
      expect(slackStep.uses).toBe('slackapi/slack-github-action@v2.1.0');
      expect(slackStep.with?.payload).toContain('iOS Build Result');
    });

    it('should create PR comment steps for iOS', () => {
      const buildOptions: BuildOptions = {
        platform: 'ios',
        variant: 'debug',
        storage: 'firebase',
        notification: 'pr-comment',
      };

      const steps =
        notificationHelpers.createIOSNotificationSteps(buildOptions);

      expect(steps).toHaveLength(3); // PR status detection + CLI setup + PR comment

      const commentStep = steps.find(
        step => step.name === 'Add PR Comment via GitHub CLI'
      );
      expect(commentStep?.run).toContain('iOS debug build completed');
      expect(commentStep?.run).toContain('Firebase App Distribution');
    });

    it('should create both notification types for iOS', () => {
      const buildOptions: BuildOptions = {
        platform: 'ios',
        variant: 'release',
        storage: 'drive',
        notification: 'both',
      };

      const steps =
        notificationHelpers.createIOSNotificationSteps(buildOptions);

      expect(steps).toHaveLength(4); // Slack + PR status detection + CLI setup + PR comment

      const slackStep = steps.find(
        step => step.name === 'Send Slack Notification'
      );
      expect(slackStep).toBeDefined();

      const commentStep = steps.find(
        step => step.name === 'Add PR Comment via GitHub CLI'
      );
      expect(commentStep?.run).toContain('Google Drive');
    });

    it('should handle GitHub storage location correctly', () => {
      const buildOptions: BuildOptions = {
        platform: 'ios',
        variant: 'debug',
        storage: 'github',
        notification: 'pr-comment',
      };

      const steps =
        notificationHelpers.createIOSNotificationSteps(buildOptions);

      const commentStep = steps.find(
        step => step.name === 'Add PR Comment via GitHub CLI'
      );
      expect(commentStep?.run).toContain('Available in GitHub Artifacts');
    });

    it('should configure Slack notification correctly for iOS', () => {
      const buildOptions: BuildOptions = {
        platform: 'ios',
        variant: 'release',
        storage: 'firebase',
        notification: 'slack',
      };

      const steps =
        notificationHelpers.createIOSNotificationSteps(buildOptions);

      const slackStep = steps[0];
      expect(slackStep.uses).toBe('slackapi/slack-github-action@v2.1.0');
      expect(slackStep.with?.payload).toContain('iOS Build Result');
      expect(slackStep.with?.['webhook-type']).toBe('incoming-webhook');
    });

    it('should handle PR comment updates correctly', () => {
      const buildOptions: BuildOptions = {
        platform: 'ios',
        variant: 'debug',
        storage: 'github',
        notification: 'pr-comment',
      };

      const steps =
        notificationHelpers.createIOSNotificationSteps(buildOptions);

      const commentStep = steps.find(
        step => step.name === 'Add PR Comment via GitHub CLI'
      );
      expect(commentStep?.run).toContain('iOS debug build');
      expect(commentStep?.run).toContain('EXISTING_COMMENT_ID');
    });
  });

  describe('notification step configuration', () => {
    it('should use correct conditional execution for PR comments', () => {
      const buildOptions: BuildOptions = {
        platform: 'android',
        variant: 'debug',
        storage: 'github',
        notification: 'pr-comment',
      };

      const steps =
        notificationHelpers.createAndroidNotificationSteps(buildOptions);

      const cliStep = steps.find(step => step.name === 'Setup GitHub CLI');
      const commentStep = steps.find(
        step => step.name === 'Add PR Comment via GitHub CLI'
      );

      expect(cliStep?.if).toBe("steps.build-source.outputs.is_pr == 'true'");
      expect(commentStep?.if).toBe(
        "steps.build-source.outputs.is_pr == 'true'"
      );
    });

    it('should use always() condition for Slack notifications', () => {
      const buildOptions: BuildOptions = {
        platform: 'android',
        variant: 'debug',
        storage: 'github',
        notification: 'slack',
      };

      const steps =
        notificationHelpers.createAndroidNotificationSteps(buildOptions);

      const slackStep = steps[0];
      expect(slackStep.if).toBe('always()');
    });

    it('should include proper configuration for all notification types', () => {
      const buildOptions: BuildOptions = {
        platform: 'android',
        variant: 'debug',
        storage: 'github',
        notification: 'both',
      };

      const steps =
        notificationHelpers.createAndroidNotificationSteps(buildOptions);

      const slackStep = steps.find(
        step => step.name === 'Send Slack Notification'
      );
      const commentStep = steps.find(
        step => step.name === 'Add PR Comment via GitHub CLI'
      );

      expect(slackStep?.uses).toBe('slackapi/slack-github-action@v2.1.0');
      expect(slackStep?.with?.webhook).toBe('${{ secrets.SLACK_WEBHOOK_URL }}');
      expect(commentStep?.env?.GH_TOKEN).toBe('${{ secrets.GITHUB_TOKEN }}');
    });
  });
});
