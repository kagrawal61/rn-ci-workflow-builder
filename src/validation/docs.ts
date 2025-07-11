import { BuildOptions } from '../presets/types';

/**
 * Storage options that require specific secrets
 */
interface StorageSecretDocs {
  name: string;
  description: string;
  requiredSecrets: Array<{
    name: string;
    description: string;
  }>;
  optionalSecrets?: Array<{
    name: string;
    description: string;
  }>;
}

/**
 * Documentation for storage types and their required secrets
 */
export const STORAGE_SECRET_DOCS: Record<string, StorageSecretDocs> = {
  firebase: {
    name: 'Firebase App Distribution',
    description: 'Distributes builds via Firebase App Distribution',
    requiredSecrets: [
      {
        name: 'FIREBASE_SERVICE_ACCOUNT',
        description: 'The Firebase service account JSON (base64-encoded)',
      },
      {
        name: 'FIREBASE_APP_ID_IOS',
        description: 'The Firebase App ID for iOS builds',
      },
      {
        name: 'FIREBASE_APP_ID_ANDROID',
        description: 'The Firebase App ID for Android builds',
      },
    ],
  },
  s3: {
    name: 'Amazon S3',
    description: 'Uploads artifacts to Amazon S3 bucket',
    requiredSecrets: [
      {
        name: 'AWS_ACCESS_KEY_ID',
        description: 'AWS access key ID with S3 permissions',
      },
      {
        name: 'AWS_SECRET_ACCESS_KEY',
        description: 'AWS secret access key',
      },
    ],
    optionalSecrets: [
      {
        name: 'AWS_S3_BUCKET',
        description:
          'Name of the S3 bucket for artifacts (defaults to "rn-artifacts" if not provided)',
      },
    ],
  },
  drive: {
    name: 'Google Drive',
    description: 'Uploads artifacts to Google Drive via rclone',
    requiredSecrets: [
      {
        name: 'GDRIVE_SERVICE_ACCOUNT_JSON',
        description:
          'Google service account JSON file content (recommended for CI)',
      },
      {
        name: 'GDRIVE_REFRESH_TOKEN',
        description:
          'OAuth refresh token for authentication (alternative to service account)',
      },
    ],
    optionalSecrets: [
      {
        name: 'GDRIVE_CLIENT_ID',
        description: 'OAuth client ID (only needed with refresh token)',
      },
      {
        name: 'GDRIVE_CLIENT_SECRET',
        description: 'OAuth client secret (only needed with refresh token)',
      },
      {
        name: 'GDRIVE_FOLDER_ID',
        description:
          'ID of the Google Drive folder (defaults to "react-native-builds")',
      },
    ],
  },
  github: {
    name: 'GitHub Artifacts',
    description: 'Stores artifacts using GitHub Actions artifacts storage',
    requiredSecrets: [],
  },
  bitrise: {
    name: 'Bitrise',
    description: 'Stores artifacts using Bitrise platform',
    requiredSecrets: [
      {
        name: 'BITRISE_API_TOKEN',
        description: 'Bitrise API token for uploading artifacts',
      },
    ],
  },
};

/**
 * Documentation for notification types and their required secrets
 */
export const NOTIFICATION_SECRET_DOCS: Record<
  string,
  {
    name: string;
    description: string;
    requiredSecrets: Array<{
      name: string;
      description: string;
    }>;
  }
> = {
  slack: {
    name: 'Slack',
    description:
      'Sends notifications to Slack using the official Slack GitHub Action',
    requiredSecrets: [
      {
        name: 'SLACK_WEBHOOK',
        description:
          'Slack webhook URL for sending notifications via the official Slack GitHub Action',
      },
    ],
  },
  'pr-comment': {
    name: 'PR Comment',
    description: 'Posts comments on pull requests',
    requiredSecrets: [
      {
        name: 'GITHUB_TOKEN',
        description: 'GitHub token for posting PR comments',
      },
    ],
  },
  both: {
    name: 'Slack & PR Comment',
    description:
      'Sends notifications to Slack and posts comments on pull requests',
    requiredSecrets: [
      {
        name: 'SLACK_WEBHOOK',
        description:
          'Slack webhook URL for sending notifications via the official Slack GitHub Action',
      },
      {
        name: 'GITHUB_TOKEN',
        description: 'GitHub token for posting PR comments',
      },
    ],
  },
  none: {
    name: 'None',
    description: 'No notifications',
    requiredSecrets: [],
  },
};

/**
 * Get documentation for required secrets based on configuration
 * @param buildOptions Build preset options
 * @returns Documentation object for required secrets
 */
export function getRequiredSecretsDocumentation(buildOptions: BuildOptions): {
  storage: StorageSecretDocs;
  notification: {
    name: string;
    description: string;
    requiredSecrets: Array<{
      name: string;
      description: string;
    }>;
  };
} {
  const storage = STORAGE_SECRET_DOCS[buildOptions.storage || 'github'] || {
    name: 'Unknown',
    description: 'Unknown storage type',
    requiredSecrets: [],
  };

  const notification = NOTIFICATION_SECRET_DOCS[
    buildOptions.notification || 'none'
  ] || {
    name: 'Unknown',
    description: 'Unknown notification type',
    requiredSecrets: [],
  };

  return {
    storage,
    notification,
  };
}

/**
 * Generate documentation string for required secrets based on configuration
 * @param buildOptions Build preset options
 * @returns Documentation string with required secrets information
 */
export function generateRequiredSecretsHelp(
  buildOptions: BuildOptions
): string {
  const docs = getRequiredSecretsDocumentation(buildOptions);
  let result = 'Required secrets for your configuration:\n\n';

  // Storage secrets
  result += `Storage (${docs.storage.name}):\n`;
  if (docs.storage.requiredSecrets.length === 0) {
    result += '  No additional secrets required\n';
  } else {
    docs.storage.requiredSecrets.forEach(secret => {
      if (
        (buildOptions.platform === 'ios' &&
          secret.name === 'FIREBASE_APP_ID_ANDROID') ||
        (buildOptions.platform === 'android' &&
          secret.name === 'FIREBASE_APP_ID_IOS')
      ) {
        // Skip secrets not relevant to the current platform
        return;
      }
      result += `  - ${secret.name}: ${secret.description}\n`;
    });
  }

  // Notification secrets
  result += `\nNotification (${docs.notification.name}):\n`;
  if (docs.notification.requiredSecrets.length === 0) {
    result += '  No additional secrets required\n';
  } else {
    docs.notification.requiredSecrets.forEach(secret => {
      result += `  - ${secret.name}: ${secret.description}\n`;
    });
  }

  return result;
}
