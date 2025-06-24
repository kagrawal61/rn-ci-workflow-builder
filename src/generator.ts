import fs from 'fs';
import path from 'path';
import * as yaml from 'js-yaml';

import { WorkflowConfig, WorkflowOptions } from './types';
import { injectSecrets, validateWorkflowConfig } from './helpers';

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
export function generateWorkflow(cfg: WorkflowConfig): string {
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
  let yamlStr = yaml.dump(obj, { lineWidth: 120 });
  yamlStr = injectSecrets(yamlStr);
  return yamlStr;
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
): string {
  const yamlStr = generateWorkflow(cfg);
  const outputFileName = fileName ?? `${cfg.kind}.yaml`;
  const filePath = path.join(destDir, outputFileName);
  
  fs.mkdirSync(destDir, { recursive: true });
  fs.writeFileSync(filePath, yamlStr, 'utf8');
  return filePath;
}
