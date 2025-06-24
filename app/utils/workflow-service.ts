import * as yaml from 'js-yaml';
import { generateWorkflow, WorkflowConfig, WorkflowOptions } from './lib';

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
      nodeVersions: [18],
      packageManager: 'yarn',
      runsOn: 'ubuntu-latest'
    }
  };
};

// Generate workflow YAML
export const generateWorkflowYaml = (config: WorkflowConfig): string => {
  try {
    return generateWorkflow(config);
  } catch (error) {
    console.error('Error generating workflow:', error);
    throw new Error(`Failed to generate workflow: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Check if a config is valid
export const validateConfig = (config: WorkflowConfig): boolean => {
  try {
    generateWorkflowYaml(config);
    return true;
  } catch (error) {
    return false;
  }
};

// Helper to get all preset kinds
export const getPresetKinds = (): string[] => {
  // Currently, we only have health-check, but this could be expanded
  return ['health-check'];
};

// Create a config from form values
export const createConfigFromFormValues = (formValues: any): WorkflowConfig => {
  // Create a properly typed configuration object to avoid type errors
  const config: Required<WorkflowConfig> = {
    kind: 'health-check',
    options: {
      name: '',
      triggers: {},
      nodeVersions: [],
      packageManager: 'yarn',
      runsOn: 'ubuntu-latest',
      skip: {},
      cache: { enabled: false },
      env: {},
      secrets: []
    }
  };
  
  // Map form values to workflow options
  if (formValues.name) config.options.name = formValues.name;
  
  // Triggers already initialized in options
  
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
  
  // Handle Node.js versions
  if (formValues.nodeVersions && formValues.nodeVersions.length > 0) {
    config.options.nodeVersions = formValues.nodeVersions;
  } else {
    config.options.nodeVersions = [18];
  }
  
  // Package manager
  config.options.packageManager = formValues.packageManager || 'yarn';
  
  // Runner OS
  config.options.runsOn = formValues.runsOn || 'ubuntu-latest';
  
  // Skip conditions
  if (formValues.enableSkipConditions) {
    config.options.skip = {};
    if (formValues.skipCommitMessage) {
      config.options.skip.commitMessageContains = formValues.skipCommitMessage;
    }
    if (formValues.skipPrTitle) {
      config.options.skip.prTitleContains = formValues.skipPrTitle;
    }
    if (formValues.skipPrLabel) {
      config.options.skip.prLabel = formValues.skipPrLabel;
    }
  }
  
  // Cache configuration
  if (formValues.enableCache) {
    config.options.cache = {
      enabled: true,
      paths: formValues.cachePaths?.split(',').map((p: string) => p.trim()) || undefined,
      key: formValues.cacheKey || undefined
    };
  }
  
  // Environment variables
  if (formValues.envVars && Object.keys(formValues.envVars).length > 0) {
    config.options.env = formValues.envVars;
  }
  
  // Secrets
  if (formValues.secrets && formValues.secrets.length > 0) {
    config.options.secrets = formValues.secrets;
  }
  
  return config;
};