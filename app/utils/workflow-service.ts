import { generateWorkflow, WorkflowConfig, getAvailablePresets } from './lib';
import { BuildOptions, HealthCheckOptions, Platform, Variant, AndroidOutputType, StorageSolution, NotificationType } from '../../src/presets/types';
import { PackageManager, CIPlatform } from '../../src/types';

// Helper to create a default static analysis configuration
export const createDefaultHealthCheckConfig = (): WorkflowConfig => {
  return {
    kind: 'static-analysis',
    options: {
      name: 'React Native Static Analysis',
      triggers: {
        push: {
          branches: ['main'],
          ignorePaths: ['docs/**', '*.md'],
        },
        pullRequest: {
          branches: ['main'],
        },
        workflowDispatch: true,
      },
      nodeVersions: [20],
      packageManager: 'yarn',
      runsOn: 'ubuntu-latest',
      cache: { enabled: true },
      healthCheck: {
        typescript: true,
        eslint: true,
        prettier: true,
        unitTests: true,
      },
    },
  };
};

// Helper to create a default build configuration
export const createDefaultBuildConfig = (): WorkflowConfig => {
  return {
    kind: 'build',
    options: {
      name: 'React Native Build Pipeline',
      triggers: {
        push: {
          branches: ['main'],
          ignorePaths: ['docs/**', '*.md'],
        },
        pullRequest: {
          branches: ['main'],
        },
        workflowDispatch: true,
      },
      nodeVersions: [20],
      packageManager: 'yarn',
      runsOn: 'ubuntu-latest',
      cache: { enabled: true },
      build: {
        platform: 'android',
        variant: 'release',
        storage: 'github',
        notification: 'pr-comment',
        includeHealthCheck: true,
        androidOutputType: 'apk',
      },
      healthCheck: {
        typescript: true,
        eslint: true,
        prettier: true,
        unitTests: true,
      },
    },
  };
};

// Generate workflow YAML
export const generateWorkflowYaml = (
  config: WorkflowConfig
): { yaml: string; secretsSummary?: string } => {
  try {
    const result = generateWorkflow(config);
    return result;
  } catch (error) {
    console.error('Error generating workflow:', error);
    throw new Error(
      `Failed to generate workflow: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
};

// Helper to get all preset kinds
export const getPresetKinds = (): string[] => {
  // Return available preset kinds
  return getAvailablePresets();
};

// Create a config from form values
export const createConfigFromFormValues = (formValues: Record<string, unknown>): WorkflowConfig => {
  // Create a properly typed configuration object to avoid type errors
  const config: Required<WorkflowConfig> = {
    kind: (formValues.preset as string) || 'static-analysis',
    options: {
      name: '',
      platform: (formValues.platform as CIPlatform) || 'github',
      triggers: {},
      nodeVersions: [],
      packageManager: 'yarn',
      runsOn: 'ubuntu-latest',
      cache: { enabled: false },
      env: {},
      secrets: [],
      healthCheck: {
        typescript: true,
        eslint: true,
        prettier: true,
        unitTests: true,
      },
    },
  };

  // Map form values to workflow options
  if (formValues.name) config.options.name = formValues.name as string;

  // Initialize triggers if not already initialized
  if (!config.options.triggers) {
    config.options.triggers = {};
  }

  if (formValues.enablePushTrigger) {
    config.options.triggers.push = {
      branches: (formValues.pushBranches as string)
        ?.split(',')
        .map((b: string) => b.trim()) || ['main'],
      ignorePaths:
        (formValues.ignorePaths as string)?.split(',').map((p: string) => p.trim()) || [],
    };
  }

  if (formValues.enablePrTrigger) {
    config.options.triggers.pullRequest = {
      branches: (formValues.prTargetBranches as string)
        ?.split(',')
        .map((b: string) => b.trim()) || ['main'],
    };
  }

  if (formValues.enableManualTrigger) {
    config.options.triggers.workflowDispatch = true;
  }

  if (formValues.enableScheduleTrigger && formValues.cronExpression) {
    config.options.triggers.schedule = [{ cron: formValues.cronExpression as string }];
  }

  // Handle Node.js version (single version)
  if (formValues.nodeVersion) {
    config.options.nodeVersions = [formValues.nodeVersion as number];
  } else {
    config.options.nodeVersions = [20];
  }

  // Package manager
  config.options.packageManager = (formValues.packageManager as PackageManager) || 'yarn';

  // Runner OS - since we only support Android for now, always use ubuntu-latest
  // This will be updated when iOS support is added
  config.options.runsOn = 'ubuntu-latest';

  // Cache configuration is enabled by default
  config.options.cache = {
    enabled: true,
    paths:
      (formValues.cachePaths as string)?.split(',').map((p: string) => p.trim()) ||
      undefined,
    key: (formValues.cacheKey as string) || undefined,
  };

  // Environment variables
  if (formValues.envVars && typeof formValues.envVars === 'object') {
    config.options.env = formValues.envVars as Record<string, string>;
  }

  // Secrets
  if (formValues.secrets && Array.isArray(formValues.secrets)) {
    config.options.secrets = formValues.secrets as string[];
  }

  // Add preset-specific configuration
  if (formValues.preset === 'build') {
    // Build preset configuration
    const buildConfig: BuildOptions = {
      // Override any iOS or both selection to use Android-only for now
      // This will be removed when iOS support is ready
      platform: (formValues.buildPlatform as string) === 'ios' || (formValues.buildPlatform as string) === 'both' 
        ? 'android' 
        : (formValues.buildPlatform as Platform) || 'android',
      variant: (formValues.buildVariant as Variant) || 'release',
      storage: (formValues.buildStorage as StorageSolution) || 'github',
      notification: (formValues.buildNotification as NotificationType) || 'pr-comment',
      includeHealthCheck:
        typeof formValues.includeHealthCheck === 'boolean'
          ? formValues.includeHealthCheck
          : true,
      androidOutputType: (formValues.androidOutputType as AndroidOutputType) || 'apk', // 'apk', 'aab', or 'both'
    };

    // Add the build config to options
    config.options.build = buildConfig;
    
    // Add health check options if include health check is enabled
    if (buildConfig.includeHealthCheck) {
      config.options.healthCheck = {
        typescript: formValues.typescriptCheck === false ? false : true,
        eslint: formValues.eslintCheck === false ? false : true,
        prettier: formValues.prettierCheck === false ? false : true,
        unitTests: formValues.unitTestsCheck === false ? false : true,
      };
    }
  } else if (formValues.preset === 'static-analysis') {
    // Static analysis preset configuration
    const healthCheckConfig: HealthCheckOptions = {
      typescript: formValues.typescriptCheck === false ? false : true,
      eslint: formValues.eslintCheck === false ? false : true,
      prettier: formValues.prettierCheck === false ? false : true,
      unitTests: formValues.unitTestsCheck === false ? false : true,
    };

    // Add the health check config to options
    config.options.healthCheck = healthCheckConfig;
  }

  return config;
};
