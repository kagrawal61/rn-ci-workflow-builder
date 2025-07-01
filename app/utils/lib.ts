/**
 * This file re-exports and initializes the workflow generator library
 * in a browser-friendly way (no fs/path dependencies)
 */
import * as yaml from 'js-yaml';

import { WorkflowConfig, WorkflowOptions } from '../../src/types';
import { injectSecrets, validateWorkflowConfig } from '../../src/helpers';
import { buildHealthCheckPipeline } from '../../src/presets/healthCheck';
import { buildBuildPipeline } from '../../src/presets/buildPreset';
import { buildBitriseHealthCheckPipeline } from '../../src/presets/bitriseHealthCheck';
import { buildBitriseBuildPipeline } from '../../src/presets/bitriseBuildPreset';

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
      // Import from the src directory directly
      // Note: This works in browser because we're using Next.js which bundles everything together
      const {
        generateSecretsSummary,
      } = require('../../src/helpers/secretsManager');
      if (validatedConfig.options && validatedConfig.options.build) {
        secretsSummary = generateSecretsSummary(validatedConfig.options.build);
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
registerBuilder('health-check', (opts: WorkflowOptions) => {
  // Default to GitHub Actions if no platform specified
  if (!opts.platform || opts.platform === 'github') {
    return buildHealthCheckPipeline(opts);
  } else if (opts.platform === 'bitrise') {
    return buildBitriseHealthCheckPipeline(opts);
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
