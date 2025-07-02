import { BuildOptions } from '../presets/types';
import {
  NOTIFICATION_SECRET_DOCS,
  STORAGE_SECRET_DOCS,
  getRequiredSecretsDocumentation,
} from '../validation/docs';

/**
 * Secret definition with metadata
 */
export interface SecretDefinition {
  name: string;
  description: string;
  required: boolean;
  displayGroup: 'storage' | 'notification' | 'platform' | 'general';
}

/**
 * Get all required secrets for a build configuration with context information
 * @param buildOptions Build configuration options
 * @returns Array of secret definitions with metadata
 */
export function getContextualSecrets(
  buildOptions: BuildOptions
): SecretDefinition[] {
  const secrets: SecretDefinition[] = [];

  // Get documentation for the selected configuration
  const docs = getRequiredSecretsDocumentation(buildOptions);

  // Add storage secrets with context
  if (buildOptions.storage && buildOptions.storage !== 'github') {
    const storageSecrets = docs.storage.requiredSecrets;

    for (const secret of storageSecrets) {
      // Skip platform-specific secrets that don't apply
      if (
        (buildOptions.platform === 'ios' &&
          secret.name === 'FIREBASE_APP_ID_ANDROID') ||
        (buildOptions.platform === 'android' &&
          secret.name === 'FIREBASE_APP_ID_IOS')
      ) {
        continue;
      }

      secrets.push({
        name: secret.name,
        description: secret.description,
        required: true,
        displayGroup: secret.name.includes('FIREBASE_APP_ID')
          ? 'platform'
          : 'storage',
      });
    }
  }

  // Add notification secrets with context
  if (buildOptions.notification && buildOptions.notification !== 'none') {
    const notificationSecrets = docs.notification.requiredSecrets;

    for (const secret of notificationSecrets) {
      secrets.push({
        name: secret.name,
        description: secret.description,
        required: true,
        displayGroup: 'notification',
      });
    }
  }

  return secrets;
}

/**
 * Generate placeholder values for secrets in YAML
 * @param buildOptions Build configuration options
 * @returns Object mapping secret names to placeholder values
 */
export function generateSecretPlaceholders(
  buildOptions: BuildOptions
): Record<string, string> {
  const secrets = getContextualSecrets(buildOptions);
  const placeholders: Record<string, string> = {};

  for (const secret of secrets) {
    placeholders[secret.name] = `__SECRET_${secret.name}__`;
  }

  return placeholders;
}

/**
 * Generate a summary of all required secrets based on the configuration
 * @param buildOptions Build configuration options
 * @returns Formatted string summary of required secrets
 */
export function generateSecretsSummary(buildOptions: BuildOptions): string {
  const secrets = getContextualSecrets(buildOptions);

  if (secrets.length === 0) {
    return 'No secrets required for this configuration.';
  }

  let summary = '## Required Secrets\n\n';

  // Group by display group
  const groups: Record<string, SecretDefinition[]> = {
    storage: [],
    notification: [],
    platform: [],
    general: [],
  };

  for (const secret of secrets) {
    groups[secret.displayGroup].push(secret);
  }

  // Generate summary by group
  if (groups.storage.length > 0) {
    summary += `### Storage (${STORAGE_SECRET_DOCS[buildOptions.storage].name})\n\n`;
    for (const secret of groups.storage) {
      summary += `- \`${secret.name}\`: ${secret.description}\n`;
    }

    // Add optional secrets if available
    const optionalSecrets =
      STORAGE_SECRET_DOCS[buildOptions.storage].optionalSecrets;
    if (optionalSecrets && optionalSecrets.length > 0) {
      summary += '\n#### Optional Storage Secrets\n\n';
      for (const secret of optionalSecrets) {
        summary += `- \`${secret.name}\`: ${secret.description}\n`;
      }
    }

    summary += '\n';
  }

  if (groups.platform.length > 0) {
    summary += `### Platform (${buildOptions.platform})\n\n`;
    for (const secret of groups.platform) {
      summary += `- \`${secret.name}\`: ${secret.description}\n`;
    }
    summary += '\n';
  }

  if (groups.notification.length > 0) {
    summary += `Notifications (${NOTIFICATION_SECRET_DOCS[buildOptions.notification].name})\n\n`;
    for (const secret of groups.notification) {
      summary += `- \`${secret.name}\`: ${secret.description}\n`;
    }
    summary += '\n';
  }

  if (groups.general.length > 0) {
    summary += `### General\n\n`;
    for (const secret of groups.general) {
      summary += `- \`${secret.name}\`: ${secret.description}\n`;
    }
  }

  summary +=
    '\n\nAdd these secrets to your GitHub repository settings and include them in your workflow configuration.';

  return summary;
}

/**
 * Creates a mapping structure between options and their required secrets
 * @returns Map of option types and values to required secrets
 */
export function getSecretRequirementMap() {
  return {
    storage: {
      firebase: ['FIREBASE_SERVICE_ACCOUNT'],
      s3: ['AWS_ACCESS_KEY_ID', 'AWS_SECRET_ACCESS_KEY'],
      drive: ['GDRIVE_SERVICE_ACCOUNT_JSON', 'GDRIVE_REFRESH_TOKEN'],
      github: [],
    },
    notification: {
      slack: ['SLACK_WEBHOOK'],
      'pr-comment': [],
      both: ['SLACK_WEBHOOK'],
      none: [],
    },
    platform: {
      ios: {
        firebase: ['FIREBASE_APP_ID_IOS'],
      },
      android: {
        firebase: ['FIREBASE_APP_ID_ANDROID'],
      },
      both: {
        firebase: ['FIREBASE_APP_ID_IOS', 'FIREBASE_APP_ID_ANDROID'],
      },
    },
  };
}

/**
 * Get tooltips for configuration options that explain related secrets
 * @returns Mapping of configuration options to tooltip text
 */
export function getSecretTooltips() {
  return {
    storage: {
      firebase:
        'Requires FIREBASE_SERVICE_ACCOUNT and platform-specific FIREBASE_APP_ID',
      s3: 'Requires AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY',
      drive: 'Requires GDRIVE_SERVICE_ACCOUNT_JSON or GDRIVE_REFRESH_TOKEN',
      github: 'No additional secrets required',
    },
    notification: {
      slack: 'Requires SLACK_WEBHOOK for the official Slack GitHub Action',
      'pr-comment': 'No additional secrets required',
      both: 'Requires SLACK_WEBHOOK for the official Slack GitHub Action',
      none: 'No notifications will be sent',
    },
  };
}
