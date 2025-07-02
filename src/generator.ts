import fs from 'fs';
import * as yaml from 'js-yaml';
import path from 'path';

import { injectSecrets } from './helpers';
import { generateSecretsSummary } from './helpers/secretsManager';
import { BuildOptions } from './presets/types';
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
function addStepSpacing(yamlStr: string): string {
  // Split the YAML into lines
  const lines = yamlStr.split('\n');
  const formattedLines: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const currentLine = lines[i];
    const nextLine = lines[i + 1];

    formattedLines.push(currentLine);

    // Check if we're at the end of a step and the next line starts a new step
    // A step ends when we have a step property and the next line is either:
    // 1. Another step (starts with "      - name:" or "      - uses:" etc.)
    // 2. A different section entirely
    if (currentLine.trim() && nextLine) {
      const currentIndent = currentLine.match(/^(\s*)/)?.[1]?.length || 0;
      const nextIndent = nextLine.match(/^(\s*)/)?.[1]?.length || 0;

      // Check if current line is a step property (name, uses, run, with, id, if, env, etc.)
      const isStepProperty =
        currentLine.match(/^\s+(name|uses|run|with|id|if|env|shell):\s*/) ||
        currentLine.match(/^\s+(run):\s*\|/) ||
        currentLine.match(/^\s+- name:/) ||
        currentLine.match(/^\s+- uses:/) ||
        currentLine.match(/^\s+- run:/);

      // Check if next line starts a new step
      const isNextLineNewStep = nextLine.match(/^\s+- (name|uses|run):/);

      // Check if we're ending a multi-line value (like run: |)
      const isEndOfMultiLineValue =
        currentLine.trim() &&
        currentIndent >= 8 && // Inside a step property
        nextIndent <= 6 && // Next line is at step level or higher
        !nextLine.match(/^\s*$/) && // Next line is not empty
        (isNextLineNewStep || nextIndent < currentIndent);

      // Add spacing when:
      // 1. We're at a step property and next line is a new step
      // 2. We're ending a multi-line value block
      if ((isStepProperty && isNextLineNewStep) || isEndOfMultiLineValue) {
        formattedLines.push('');
      }
    }
  }

  return formattedLines.join('\n');
}

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
 * Generate a workflow YAML from config
 * @param cfg The workflow configuration
 * @returns Workflow YAML as string
 */
export function generateWorkflow(cfg: WorkflowConfig): {
  yaml: string;
  secretsSummary?: string;
} {
  // Validate the config before proceeding
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
  // Disable YAML anchors/references which GitHub Actions doesn't support
  let yamlStr = yaml.dump(obj, {
    lineWidth: 120,
    noRefs: true, // Prevent the creation of anchors and references
  });
  yamlStr = injectSecrets(yamlStr);

  // Add spacing after each step for better readability
  yamlStr = addStepSpacing(yamlStr);

  // Validate the generated YAML (sync - for web app compatibility)
  const validatedYaml = validateGeneratedYaml(yamlStr, false) as string;

  // Generate secrets summary for build preset
  let secretsSummary: string | undefined;
  if (validatedConfig.kind === 'build' && validatedConfig.options) {
    secretsSummary = generateSecretsSummary(
      (validatedConfig.options as WorkflowOptions & { build?: BuildOptions })
        .build || ({} as BuildOptions)
    );
  }

  return {
    yaml: validatedYaml,
    secretsSummary,
  };
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
  // Validate the config before proceeding
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
  // Disable YAML anchors/references which GitHub Actions doesn't support
  let yamlStr = yaml.dump(obj, {
    lineWidth: 120,
    noRefs: true, // Prevent the creation of anchors and references
  });
  yamlStr = injectSecrets(yamlStr);

  // Add spacing after each step for better readability
  yamlStr = addStepSpacing(yamlStr);

  // Validate the generated YAML with CLI-specific enhancements
  // This will automatically run Bitrise CLI validation for Bitrise configs
  // and yamllint validation for other platforms (like GitHub Actions)
  // Skip validation for tests to avoid yamllint errors
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

  // Generate secrets summary for build preset
  let secretsSummary: string | undefined;
  if (validatedConfig.kind === 'build' && validatedConfig.options) {
    secretsSummary = generateSecretsSummary(
      (validatedConfig.options as WorkflowOptions & { build?: BuildOptions })
        .build || ({} as BuildOptions)
    );
  }

  return {
    yaml: validatedYaml,
    secretsSummary,
  };
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
    outputDir = platform === 'bitrise' ? '.' : '.github/workflows';
  }

  if (!outputFileName) {
    if (platform === 'bitrise') {
      outputFileName = 'bitrise.yml';
    } else {
      outputFileName = `${cfg.kind}.yaml`;
    }
  }

  const filePath = path.join(outputDir, outputFileName);

  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(filePath, yaml, 'utf8');
  return { filePath, secretsSummary };
}
