import { generateWorkflow, WorkflowConfig, WorkflowOptions } from './lib';
import { BuildOptions } from '../../src/presets/types';

// Helper to create a default health check configuration
export const createDefaultHealthCheckConfig = (): WorkflowConfig => {
  return {
    kind: 'health-check',
    options: {
      name: 'React Native Health Check',
      triggers: {
        push: {
          branches: ['main'],
          ignorePaths: ['docs/**', '*.md']
        },
        pullRequest: {
          branches: ['main']
        },
        workflowDispatch: true
      },
      nodeVersions: [20],
      packageManager: 'yarn',
      runsOn: 'ubuntu-latest',
      cache: { enabled: true }
    }
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
          ignorePaths: ['docs/**', '*.md']
        },
        pullRequest: {
          branches: ['main']
        },
        workflowDispatch: true
      },
      nodeVersions: [20],
      packageManager: 'yarn',
      runsOn: 'ubuntu-latest',
      cache: { enabled: true },
      build: {
        platform: 'both',
        variant: 'release',
        storage: 'github',
        notification: 'pr-comment',
        includeHealthCheck: true,
        androidOutputType: 'apk'
      }
    }
  };
};

// Generate workflow YAML
export const generateWorkflowYaml = (config: WorkflowConfig): { yaml: string, secretsSummary?: string } => {
  try {
    const result = generateWorkflow(config);
    return result;
  } catch (error) {
    console.error('Error generating workflow:', error);
    throw new Error(`Failed to generate workflow: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};


// Helper to get all preset kinds
export const getPresetKinds = (): string[] => {
  // Return available preset kinds
  return ['health-check', 'build'];
};

// Create a config from form values
export const createConfigFromFormValues = (formValues: any): WorkflowConfig => {
  // Create a properly typed configuration object to avoid type errors
  const config: Required<WorkflowConfig> = {
    kind: formValues.preset || 'health-check',
    options: {
      name: '',
      triggers: {},
      nodeVersions: [],
      packageManager: 'yarn',
      runsOn: 'ubuntu-latest',
      cache: { enabled: false },
      env: {},
      secrets: []
    }
  };
  
  // Map form values to workflow options
  if (formValues.name) config.options.name = formValues.name;
  
  // Initialize triggers if not already initialized
  if (!config.options.triggers) {
    config.options.triggers = {};
  }
  
  if (formValues.enablePushTrigger) {
    config.options.triggers.push = {
      branches: formValues.pushBranches?.split(',').map((b: string) => b.trim()) || ['main'],
      ignorePaths: formValues.ignorePaths?.split(',').map((p: string) => p.trim()) || []
    };
  }
  
  if (formValues.enablePrTrigger) {
    config.options.triggers.pullRequest = {
      branches: formValues.prTargetBranches?.split(',').map((b: string) => b.trim()) || ['main']
    };
  }
  
  if (formValues.enableManualTrigger) {
    config.options.triggers.workflowDispatch = true;
  }
  
  if (formValues.enableScheduleTrigger && formValues.cronExpression) {
    config.options.triggers.schedule = [{ cron: formValues.cronExpression }];
  }
  
  // Handle Node.js version (single version)
  if (formValues.nodeVersion) {
    config.options.nodeVersions = [formValues.nodeVersion];
  } else {
    config.options.nodeVersions = [20];
  }
  
  // Package manager
  config.options.packageManager = formValues.packageManager || 'yarn';
  
  // Runner OS
  config.options.runsOn = formValues.runsOn || 'ubuntu-latest';
  
  
  // Cache configuration is enabled by default
  config.options.cache = {
    enabled: true,
    paths: formValues.cachePaths?.split(',').map((p: string) => p.trim()) || undefined,
    key: formValues.cacheKey || undefined
  };
  
  // Environment variables
  if (formValues.envVars && Object.keys(formValues.envVars).length > 0) {
    config.options.env = formValues.envVars;
  }
  
  // Secrets
  if (formValues.secrets && formValues.secrets.length > 0) {
    config.options.secrets = formValues.secrets;
  }
  
  // Add build configuration if this is a build preset
  if (formValues.preset === 'build') {
    const buildConfig: BuildOptions = {
      platform: formValues.buildPlatform || 'both',
      variant: formValues.buildVariant || 'release',
      storage: formValues.buildStorage || 'github',
      notification: formValues.buildNotification || 'pr-comment',
      includeHealthCheck: formValues.includeHealthCheck !== undefined ? formValues.includeHealthCheck : true,
      androidOutputType: formValues.androidOutputType || 'apk' // 'apk', 'aab', or 'both'
    };
    
    // Add the build config to options
    config.options.build = buildConfig;
  }
  
  return config;
};