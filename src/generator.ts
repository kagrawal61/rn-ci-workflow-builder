import fs from 'fs';
import * as yaml from 'js-yaml';
import path from 'path';

import { addStepSpacing, injectSecrets } from './helpers';
import { generateSecretsSummary } from './helpers/secretsManager';
import { BuildOptions, StaticAnalysisOptions } from './presets/types';
import {
  BitriseConfig,
  GitHubWorkflow,
  WorkflowConfig,
  WorkflowOptions,
} from './types';
import { validateConfig } from './validation';
import { validateGeneratedYaml } from './validation/yaml';

// Map of pipeline builders - supports both GitHub Actions and Bitrise configurations
const builders: Record<
  string,
  (
    opts: WorkflowOptions
  ) => Record<string, unknown> | GitHubWorkflow | BitriseConfig
> = {};

/**
 * Add spacing after each step in the workflow YAML for better readability
 * @param yamlStr The YAML string to format
 * @returns Formatted YAML string with spacing after steps
 */
/**
 * Register a new workflow builder
 * @param kind The workflow kind/preset name
 * @param builder The builder function
 */
export function registerBuilder(
  kind: string,
  builder: (
    opts: WorkflowOptions
  ) => Record<string, unknown> | GitHubWorkflow | BitriseConfig
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
 * Clear all registered builders (for testing purposes)
 */
export function clearBuilders(): void {
  Object.keys(builders).forEach(key => {
    delete builders[key];
  });
}

/**
 * Generate a secrets summary for a static-analysis config.
 * Returns a summary only when Slack notifications are configured
 * (notification === 'slack' or 'both'), since those require SLACK_WEBHOOK_URL.
 * Returns undefined when no secrets are needed.
 */
function generateStaticAnalysisSecretsSummary(
  staticAnalysis: StaticAnalysisOptions | undefined
): string | undefined {
  const notification = staticAnalysis?.notification;
  if (notification !== 'slack' && notification !== 'both') {
    return undefined;
  }
  // Build a synthetic BuildOptions so we can reuse generateSecretsSummary.
  // Only the notification field is relevant — storage and platform secrets
  // do not apply to the static-analysis preset.
  const syntheticBuildOptions: BuildOptions = { notification };
  return generateSecretsSummary(syntheticBuildOptions);
}

/**
 * Shared core: validate config, run builder, post-process YAML, compute secrets summary.
 * Returns the raw (unvalidated) YAML string and secrets summary so callers can apply
 * their own validation strategy (sync for web, async for CLI).
 */
function buildWorkflowCore(cfg: WorkflowConfig): {
  yamlStr: string;
  secretsSummary: string | undefined;
} {
  const validatedConfig = validateConfig(cfg);

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
    noRefs: true,
  });
  yamlStr = injectSecrets(yamlStr);
  yamlStr = addStepSpacing(yamlStr);

  let secretsSummary: string | undefined;
  if (validatedConfig.kind === 'build' && validatedConfig.options) {
    secretsSummary = generateSecretsSummary(
      (validatedConfig.options as WorkflowOptions & { build?: BuildOptions })
        .build || ({} as BuildOptions)
    );
  } else if (validatedConfig.kind === 'static-analysis') {
    // Note: the validator currently strips `staticAnalysis` from options (bug H).
    // Read from the original cfg to ensure notification settings are visible.
    secretsSummary = generateStaticAnalysisSecretsSummary(
      cfg.options?.staticAnalysis
    );
  }

  return { yamlStr, secretsSummary };
}

/**
 * Generate a workflow YAML from config
 * @param cfg The workflow configuration
 * @returns Workflow YAML as string
 */
export function generateWorkflow(cfg: WorkflowConfig): {
  yaml: string;
  secretsSummary?: string;
} {
  const { yamlStr, secretsSummary } = buildWorkflowCore(cfg);
  const validatedYaml = validateGeneratedYaml(yamlStr, false) as string;
  return { yaml: validatedYaml, secretsSummary };
}

/**
 * Generate a workflow YAML from config with CLI-specific enhancements (async)
 * This version automatically validates Bitrise YAML using Bitrise CLI when applicable
 * @param cfg The workflow configuration
 * @returns Promise resolving to workflow YAML and optional secrets summary
 */
export async function generateWorkflowForCli(
  cfg: WorkflowConfig
): Promise<{ yaml: string; secretsSummary?: string }> {
  const { yamlStr, secretsSummary } = buildWorkflowCore(cfg);

  // Validate the generated YAML with CLI-specific enhancements
  // This will automatically run Bitrise CLI validation for Bitrise configs
  // and yamllint validation for other platforms (like GitHub Actions)
  let validatedYaml = yamlStr;
  try {
    const validationResult = validateGeneratedYaml(yamlStr, true, true);
    validatedYaml =
      typeof validationResult === 'string'
        ? validationResult
        : await validationResult;
  } catch (e) {
    console.warn('Skipping YAML validation:', e);
  }

  return { yaml: validatedYaml, secretsSummary };
}

/**
 * Write the workflow YAML to a file
 * @param cfg The workflow configuration
 * @param destDir Destination directory (default: .github/workflows)
 * @param fileName Custom file name (default: {kind}.yaml)
 * @returns Path to the written file
 */
export function writeWorkflowFile(
  cfg: WorkflowConfig,
  destDir?: string,
  fileName?: string
): { filePath: string; secretsSummary?: string } {
  const { yaml, secretsSummary } = generateWorkflow(cfg);

  // Determine output directory and filename based on platform
  const platform = cfg.options?.platform || 'github';
  let outputDir = destDir;
  let outputFileName = fileName;

  if (!outputDir) {
    if (platform === 'bitrise' || platform === 'gitlab') {
      outputDir = '.';
    } else {
      outputDir = '.github/workflows';
    }
  }

  if (!outputFileName) {
    if (platform === 'bitrise') {
      outputFileName = 'bitrise.yml';
    } else if (platform === 'gitlab') {
      outputFileName = '.gitlab-ci.yml';
    } else {
      outputFileName = `${cfg.kind}.yaml`;
    }
  }

  const filePath = path.join(outputDir, outputFileName);

  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(filePath, yaml, 'utf8');
  return { filePath, secretsSummary };
}
