import { WorkflowOptions } from '../types';
import { BuildOptions } from '../presets/types';

/**
 * Required secrets by storage type
 */
const REQUIRED_STORAGE_SECRETS: Record<string, string[]> = {
  firebase: ['FIREBASE_SERVICE_ACCOUNT'],
  s3: [
    'AWS_ACCESS_KEY_ID',
    'AWS_SECRET_ACCESS_KEY',
    'AWS_REGION',
    'AWS_S3_BUCKET',
  ],
  drive: ['GOOGLE_SERVICE_ACCOUNT'],
  github: [], // GitHub doesn't need special secrets, it uses the default GitHub token
};

/**
 * Required secrets by platform when using Firebase
 */
const FIREBASE_PLATFORM_SECRETS: Record<string, string[]> = {
  ios: ['FIREBASE_APP_ID_IOS'],
  android: ['FIREBASE_APP_ID_ANDROID'],
  both: ['FIREBASE_APP_ID_IOS', 'FIREBASE_APP_ID_ANDROID'],
};

/**
 * Required secrets by notification type
 */
const NOTIFICATION_SECRETS: Record<string, string[]> = {
  slack: ['SLACK_WEBHOOK'],
  'pr-comment': [],
  both: ['SLACK_WEBHOOK'],
  none: [],
};

/**
 * Validate that required secrets are present based on the build configuration
 * @param options Workflow options
 * @param buildOptions Build options
 */
export function validateBuildSecrets(
  options: WorkflowOptions,
  buildOptions: BuildOptions
): void {
  const configSecrets = options.secrets || [];
  const missingSecrets: string[] = [];

  // Check storage-specific secrets
  if (buildOptions.storage) {
    const requiredStorageSecrets =
      REQUIRED_STORAGE_SECRETS[buildOptions.storage] || [];

    // Add platform-specific Firebase secrets if using Firebase
    if (buildOptions.storage === 'firebase') {
      const platformSecrets =
        FIREBASE_PLATFORM_SECRETS[buildOptions.platform] || [];
      requireSecrets(configSecrets, platformSecrets, missingSecrets);
    }

    requireSecrets(configSecrets, requiredStorageSecrets, missingSecrets);
  }

  // Check notification-specific secrets
  if (buildOptions.notification) {
    const requiredNotificationSecrets =
      NOTIFICATION_SECRETS[buildOptions.notification] || [];
    requireSecrets(configSecrets, requiredNotificationSecrets, missingSecrets);
  }

  // Throw error if any secrets are missing
  if (missingSecrets.length > 0) {
    throw new Error(
      `Missing required secrets for the selected configuration: ${missingSecrets.join(', ')}`
    );
  }
}

/**
 * Check if required secrets are present in the config secrets
 * @param configSecrets Secrets defined in the config
 * @param requiredSecrets Secrets required for the configuration
 * @param missingSecrets Array to collect missing secrets
 */
function requireSecrets(
  configSecrets: string[],
  requiredSecrets: string[],
  missingSecrets: string[]
): void {
  for (const secret of requiredSecrets) {
    if (!configSecrets.includes(secret)) {
      missingSecrets.push(secret);
    }
  }
}
