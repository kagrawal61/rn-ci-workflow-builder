/**
 * This file re-exports and initializes the workflow generator library
 * in a browser-friendly way (no fs/path dependencies)
 */
import * as yaml from 'js-yaml';

import { injectSecrets, validateWorkflowConfig } from '../../src/helpers';
import { generateSecretsSummary } from '../../src/helpers/secretsManager';
import { buildBitriseBuildPipeline } from '../../src/presets/bitriseBuildPreset';
import { buildBitriseStaticAnalysisPipeline } from '../../src/presets/bitriseStaticAnalysis';
import { buildBuildPipeline } from '../../src/presets/buildPreset';
import { buildStaticAnalysisPipeline } from '../../src/presets/staticAnalysis';
import { WorkflowConfig, WorkflowOptions } from '../../src/types';

// Map of pipeline builders (copied from generator.ts but without Node.js dependencies)
// Support both GitHub Actions and Bitrise configurations
const builders: Record<
  string,
  (
    opts: WorkflowOptions
  ) => Record<string, any> | import('../../src/types').BitriseConfig
> = {};

/**
 * Register a new workflow builder
 * @param kind The workflow kind/preset name
 * @param builder The builder function
 */
export function registerBuilder(
  kind: string,
  builder: (
    opts: WorkflowOptions
  ) => Record<string, any> | import('../../src/types').BitriseConfig
): void {
  builders[kind] = builder;
}

/**
 * Get available workflow presets
 * @returns Array of available workflow preset names
 */
export function getAvailablePresets(): string[] {
  return Object.keys(builders);
}

/**
 * Generate a workflow YAML from config
 * @param cfg The workflow configuration
 * @returns Workflow YAML and secrets summary
 */
export function generateWorkflow(cfg: WorkflowConfig): {
  yaml: string;
  secretsSummary?: string;
} {
  // Validate the config before proceeding
  const validatedConfig = validateWorkflowConfig(cfg);

  const options: WorkflowOptions = validatedConfig.options ?? {};
  const builder = builders[validatedConfig.kind];

  if (!builder) {
    throw new Error(
      `Unsupported pipeline kind: ${validatedConfig.kind}. ` +
        `Available presets: ${getAvailablePresets().join(', ')}`
    );
  }

  const obj = builder(options);
  let yamlStr = yaml.dump(obj, {
    lineWidth: 120,
    noRefs: true, // Prevent the creation of anchors and references
  });
  yamlStr = injectSecrets(yamlStr);

  // Generate secrets summary for build preset
  let secretsSummary: string | undefined;
  if (
    validatedConfig.kind === 'build' &&
    validatedConfig.options &&
    validatedConfig.options.build
  ) {
    try {
      // Use the imported generateSecretsSummary function
      if (validatedConfig.options && validatedConfig.options.build) {
        // Make sure to include framework from options
        const buildOptions = {
          ...validatedConfig.options.build,
          framework: validatedConfig.options.framework
        };
        secretsSummary = generateSecretsSummary(buildOptions);
      }
    } catch (err) {
      console.error('Error generating secrets summary:', err);
    }
  }

  return {
    yaml: yamlStr,
    secretsSummary,
  };
}

// Register the built-in presets with platform selection logic
registerBuilder('static-analysis', (opts: WorkflowOptions) => {
  // Default to GitHub Actions if no platform specified
  if (!opts.platform || opts.platform === 'github') {
    return buildStaticAnalysisPipeline(opts);
  } else if (opts.platform === 'bitrise') {
    return buildBitriseStaticAnalysisPipeline(opts);
  }
  throw new Error(`Unsupported platform: ${opts.platform}`);
});

registerBuilder('build', (opts: WorkflowOptions) => {
  // Default to GitHub Actions if no platform specified
  if (!opts.platform || opts.platform === 'github') {
    return buildBuildPipeline(opts);
  } else if (opts.platform === 'bitrise') {
    return buildBitriseBuildPipeline(opts);
  }
  throw new Error(`Unsupported platform: ${opts.platform}`);
});

// Export the types
export type { WorkflowConfig, WorkflowOptions };
