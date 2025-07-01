import { WorkflowConfig, WorkflowOptions } from '../types';
import { BuildOptions } from '../presets/types';
import { getAvailablePresets } from '../generator';
import { validateBuildSecrets } from './secrets';
import { validateBuildSchema, validateWorkflowSchema } from './schema';

/**
 * Main validation function for workflow configs
 * @param config The workflow configuration to validate
 * @returns Valid workflow config or throws an error
 */
export function validateConfig(config: WorkflowConfig): WorkflowConfig {
  // First run base structural validation
  const baseValidatedConfig = validateWorkflowStructure(config);

  // Validate schema
  const schemaValidatedConfig = validateWorkflowSchema(baseValidatedConfig);

  // Validate preset-specific options
  validatePresetOptions(schemaValidatedConfig);

  // Validate required secrets and environment variables
  validateSecretsAndEnv(schemaValidatedConfig);

  return schemaValidatedConfig;
}

/**
 * Validate the basic structure of a workflow config
 * @param config The workflow configuration to validate
 * @returns Valid workflow config or throws an error
 */
function validateWorkflowStructure(config: WorkflowConfig): WorkflowConfig {
  if (!config) {
    throw new Error('Workflow configuration is required');
  }
  
  if (!config.kind) {
    throw new Error('Workflow kind is required');
  }
  
  // Check if the preset exists
  const availablePresets = getAvailablePresets();
  if (!availablePresets.includes(config.kind)) {
    throw new Error(`Invalid workflow kind: ${config.kind}. Available presets: ${availablePresets.join(', ')}`);
  }
  
  // Ensure options is an object
  if (config.options && typeof config.options !== 'object') {
    throw new Error('Workflow options must be an object');
  }
  
  // Check triggers
  if (config.options?.triggers) {
    const { triggers } = config.options;
    
    // Validate branches format if provided
    if (triggers.push?.branches && !Array.isArray(triggers.push.branches)) {
      throw new Error('Push branches must be an array');
    }
    
    if (triggers.pullRequest?.branches && !Array.isArray(triggers.pullRequest.branches)) {
      throw new Error('Pull request branches must be an array');
    }
    
    if (triggers.pullRequestTarget?.branches && !Array.isArray(triggers.pullRequestTarget.branches)) {
      throw new Error('Pull request target branches must be an array');
    }
    
    // Validate schedule format if provided
    if (triggers.schedule) {
      if (!Array.isArray(triggers.schedule)) {
        throw new Error('Schedule must be an array');
      }
      
      if (triggers.schedule.some(s => !s.cron)) {
        throw new Error('All schedule entries must have a cron expression');
      }
    }
  }
  
  return config;
}

/**
 * Validate options specific to each preset
 * @param config The workflow configuration to validate
 */
function validatePresetOptions(config: WorkflowConfig): void {
  switch(config.kind) {
    case 'build':
      validateBuildOptions(config.options as WorkflowOptions & { build?: BuildOptions });
      break;
    case 'static-analysis':
      // Static analysis doesn't need extra validation currently
      break;
    default:
      // If we get here, it means we've added a new preset but haven't added validation for it
      console.warn(`No specific validation for preset type: ${config.kind}`);
  }
}

/**
 * Validate build preset options
 * @param options The build workflow options to validate
 */
function validateBuildOptions(options: WorkflowOptions & { build?: BuildOptions }): void {
  if (!options.build) {
    throw new Error('Build options are required for the build preset');
  }
  
  // Validate using schema
  validateBuildSchema(options.build);
}

/**
 * Validate required secrets and environment variables
 * @param config The workflow configuration to validate
 */
function validateSecretsAndEnv(config: WorkflowConfig): void {
  if (config.kind === 'build' && config.options) {
    const buildOptions = (config.options as WorkflowOptions & { build?: BuildOptions }).build;
    
    if (buildOptions) {
      validateBuildSecrets(config.options, buildOptions);
    }
  }
}

// Export all validation functions
export * from './secrets';
export * from './schema';
export * from './yaml';