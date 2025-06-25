import fs from 'fs';
import path from 'path';
import * as yaml from 'js-yaml';

import { WorkflowConfig, WorkflowOptions } from './types';
import { injectSecrets } from './helpers';
import { validateConfig } from './validation';
import { validateGeneratedYaml } from './validation/yaml';
import { generateSecretsSummary } from './helpers/secretsManager';

// Map of pipeline builders
const builders: Record<string, (opts: WorkflowOptions) => Record<string, any>> = {};

/**
 * Register a new workflow builder
 * @param kind The workflow kind/preset name
 * @param builder The builder function
 */
export function registerBuilder(
  kind: string,
  builder: (opts: WorkflowOptions) => Record<string, any>
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
 * @returns Workflow YAML as string
 */
export function generateWorkflow(cfg: WorkflowConfig): { yaml: string, secretsSummary?: string } {
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
    noRefs: true  // Prevent the creation of anchors and references
  });
  yamlStr = injectSecrets(yamlStr);
  
  // Validate the generated YAML
  const validatedYaml = validateGeneratedYaml(yamlStr);
  
  // Generate secrets summary for build preset
  let secretsSummary: string | undefined;
  if (validatedConfig.kind === 'build' && validatedConfig.options) {
    secretsSummary = generateSecretsSummary(validatedConfig.options as any);
  }
  
  return {
    yaml: validatedYaml,
    secretsSummary
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
  destDir = '.github/workflows',
  fileName?: string
): { filePath: string, secretsSummary?: string } {
  const { yaml, secretsSummary } = generateWorkflow(cfg);
  const outputFileName = fileName ?? `${cfg.kind}.yaml`;
  const filePath = path.join(destDir, outputFileName);
  
  fs.mkdirSync(destDir, { recursive: true });
  fs.writeFileSync(filePath, yaml, 'utf8');
  return { filePath, secretsSummary };
}