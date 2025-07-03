import { BuildOptions } from '../presets/types';
import { WorkflowConfig, WorkflowOptions } from '../types';

/**
 * Schema validation for build preset options
 * @param options Build options to validate
 * @returns Validated build options
 */
export function validateBuildSchema(options: BuildOptions): BuildOptions {
  const validatedOptions: BuildOptions = {
    platform: validateEnum(
      options.platform,
      ['ios', 'android', 'both'],
      'platform'
    ) as BuildOptions['platform'],

    variant: validateEnum(
      options.variant,
      ['debug', 'release'],
      'variant'
    ) as BuildOptions['variant'],

    storage: validateEnum(
      options.storage,
      ['github', 'drive', 'firebase', 's3', 'bitrise'],
      'storage'
    ) as BuildOptions['storage'],

    notification: validateEnum(
      options.notification,
      ['slack', 'pr-comment', 'both', 'none'],
      'notification'
    ) as BuildOptions['notification'],

    includeStaticAnalysis:
      options.includeStaticAnalysis !== undefined
        ? !!options.includeStaticAnalysis
        : true,
  };

  return validatedOptions;
}

/**
 * Schema validation for workflow config
 * @param config Workflow config to validate
 * @returns Validated workflow config
 */
export function validateWorkflowSchema(config: WorkflowConfig): WorkflowConfig {
  // Basic required field validation
  if (!config.kind) {
    throw new Error('Workflow kind is required');
  }

  const validatedConfig: WorkflowConfig = {
    kind: config.kind,
    options: config.options
      ? validateWorkflowOptionsSchema(config.options)
      : {},
  };

  // Validate preset-specific options
  if (config.kind === 'build' && config.options) {
    const options = config.options as WorkflowOptions & {
      build?: BuildOptions;
    };
    if (options.build) {
      (
        validatedConfig.options as WorkflowOptions & { build?: BuildOptions }
      ).build = validateBuildSchema(options.build);
    } else {
      throw new Error('Build options are required for build preset');
    }
  }

  return validatedConfig;
}

/**
 * Schema validation for workflow options
 * @param options Workflow options to validate
 * @returns Validated workflow options
 */
function validateWorkflowOptionsSchema(
  options: WorkflowOptions
): WorkflowOptions {
  const validatedOptions: WorkflowOptions = {};

  // Validate platform
  if (options.platform !== undefined) {
    validatedOptions.platform = validateEnum(
      options.platform,
      ['github', 'bitrise'],
      'platform'
    ) as WorkflowOptions['platform'];
  }

  // Validate name
  if (options.name !== undefined) {
    if (typeof options.name !== 'string') {
      throw new Error('Workflow name must be a string');
    }
    validatedOptions.name = options.name;
  }

  // Validate node versions
  if (options.nodeVersions !== undefined) {
    if (!Array.isArray(options.nodeVersions)) {
      throw new Error('Node versions must be an array');
    }
    validatedOptions.nodeVersions = options.nodeVersions.map(version => {
      if (typeof version !== 'string' && typeof version !== 'number') {
        throw new Error('Node version must be a string or number');
      }
      return version;
    });
  }

  // Validate package manager
  if (options.packageManager !== undefined) {
    validatedOptions.packageManager = validateEnum(
      options.packageManager,
      ['npm', 'yarn'],
      'package manager'
    ) as WorkflowOptions['packageManager'];
  }

  // Validate runsOn
  if (options.runsOn !== undefined) {
    if (typeof options.runsOn !== 'string') {
      throw new Error('runsOn must be a string');
    }
    validatedOptions.runsOn = options.runsOn;
  }

  // Validate triggers
  if (options.triggers !== undefined) {
    validatedOptions.triggers = validateTriggers(options.triggers);
  }

  // Validate env
  if (options.env !== undefined) {
    if (typeof options.env !== 'object' || options.env === null) {
      throw new Error('Environment variables must be an object');
    }
    validatedOptions.env = { ...options.env };
  }

  // Validate secrets
  if (options.secrets !== undefined) {
    if (!Array.isArray(options.secrets)) {
      throw new Error('Secrets must be an array');
    }
    validatedOptions.secrets = options.secrets.map(secret => {
      if (typeof secret !== 'string') {
        throw new Error('Secret name must be a string');
      }
      return secret;
    });
  }

  // Validate cache
  if (options.cache !== undefined) {
    if (typeof options.cache !== 'object' || options.cache === null) {
      throw new Error('Cache configuration must be an object');
    }

    validatedOptions.cache = {
      enabled:
        options.cache.enabled !== undefined ? !!options.cache.enabled : true,
    };

    if (options.cache.paths !== undefined) {
      if (!Array.isArray(options.cache.paths)) {
        throw new Error('Cache paths must be an array');
      }
      validatedOptions.cache.paths = options.cache.paths.map(path => {
        if (typeof path !== 'string') {
          throw new Error('Cache path must be a string');
        }
        return path;
      });
    }

    if (options.cache.key !== undefined) {
      if (typeof options.cache.key !== 'string') {
        throw new Error('Cache key must be a string');
      }
      validatedOptions.cache.key = options.cache.key;
    }
  }

  return validatedOptions;
}

/**
 * Validate trigger configuration
 * @param triggers Trigger options to validate
 * @returns Validated trigger options
 */
function validateTriggers(
  triggers: WorkflowOptions['triggers']
): NonNullable<WorkflowOptions['triggers']> {
  if (!triggers) {
    throw new Error('Triggers configuration is required');
  }

  const validatedTriggers: NonNullable<WorkflowOptions['triggers']> = {};

  // Validate push triggers
  if (triggers.push !== undefined) {
    validatedTriggers.push = {};

    if (triggers.push.branches !== undefined) {
      if (!Array.isArray(triggers.push.branches)) {
        throw new Error('Push branches must be an array');
      }
      validatedTriggers.push.branches = triggers.push.branches.map(branch => {
        if (typeof branch !== 'string') {
          throw new Error('Branch name must be a string');
        }
        return branch;
      });
    }

    if (triggers.push.ignorePaths !== undefined) {
      if (!Array.isArray(triggers.push.ignorePaths)) {
        throw new Error('Ignore paths must be an array');
      }
      validatedTriggers.push.ignorePaths = triggers.push.ignorePaths.map(
        path => {
          if (typeof path !== 'string') {
            throw new Error('Ignore path must be a string');
          }
          return path;
        }
      );
    }
  }

  // Validate pullRequest triggers
  if (triggers.pullRequest !== undefined) {
    validatedTriggers.pullRequest = {};

    if (triggers.pullRequest.branches !== undefined) {
      if (!Array.isArray(triggers.pullRequest.branches)) {
        throw new Error('Pull request branches must be an array');
      }
      validatedTriggers.pullRequest.branches =
        triggers.pullRequest.branches.map(branch => {
          if (typeof branch !== 'string') {
            throw new Error('Branch name must be a string');
          }
          return branch;
        });
    }
  }

  // Validate pullRequestTarget triggers
  if (triggers.pullRequestTarget !== undefined) {
    validatedTriggers.pullRequestTarget = {};

    if (triggers.pullRequestTarget.branches !== undefined) {
      if (!Array.isArray(triggers.pullRequestTarget.branches)) {
        throw new Error('Pull request target branches must be an array');
      }
      validatedTriggers.pullRequestTarget.branches =
        triggers.pullRequestTarget.branches.map(branch => {
          if (typeof branch !== 'string') {
            throw new Error('Branch name must be a string');
          }
          return branch;
        });
    }
  }

  // Validate workflowDispatch
  if (triggers.workflowDispatch !== undefined) {
    validatedTriggers.workflowDispatch = !!triggers.workflowDispatch;
  }

  // Validate schedule
  if (triggers.schedule !== undefined) {
    if (!Array.isArray(triggers.schedule)) {
      throw new Error('Schedule must be an array');
    }

    validatedTriggers.schedule = triggers.schedule.map(scheduleItem => {
      if (typeof scheduleItem !== 'object' || scheduleItem === null) {
        throw new Error('Schedule item must be an object');
      }

      if (!scheduleItem.cron || typeof scheduleItem.cron !== 'string') {
        throw new Error(
          'Schedule item must have a cron expression as a string'
        );
      }

      return { cron: scheduleItem.cron };
    });
  }

  return validatedTriggers;
}

/**
 * Helper function to validate enum values
 * @param value Value to check
 * @param allowedValues List of allowed values
 * @param fieldName Field name for error messages
 * @returns The validated value
 */
function validateEnum<T>(
  value: T,
  allowedValues: readonly string[],
  fieldName: string
): T {
  if (value === undefined || value === null) {
    throw new Error(`${fieldName} is required`);
  }

  if (typeof value !== 'string') {
    throw new Error(`${fieldName} must be a string`);
  }

  if (!allowedValues.includes(value)) {
    throw new Error(
      `Invalid ${fieldName}: ${value}. Must be one of: ${allowedValues.join(', ')}`
    );
  }

  return value;
}

/**
 * Validates and normalizes workflow configuration data
 * This handles edge cases and provides sensible defaults
 */
export function validateWorkflowConfig(config: WorkflowConfig): WorkflowConfig {
  // Clone to avoid mutations
  const validatedConfig = { ...config };

  // Validate build configuration if present
  if (validatedConfig.options?.build) {
    // Normalize boolean values for build options
    const build = validatedConfig.options.build;

    // Handle includeStaticAnalysis boolean conversion
    if (build.includeStaticAnalysis !== undefined) {
      build.includeStaticAnalysis = !!build.includeStaticAnalysis;
    } else {
      build.includeStaticAnalysis = true; // Default to true
    }

    // Validate androidOutputType
    if (
      build.androidOutputType &&
      !['apk', 'aab', 'both'].includes(build.androidOutputType)
    ) {
      build.androidOutputType = 'apk'; // Default fallback
    }
  }

  return validatedConfig;
}
