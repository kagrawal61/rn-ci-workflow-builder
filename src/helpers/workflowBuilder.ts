import { WorkflowConfig } from '../types';
import { writeWorkflowFile, generateWorkflow } from '../generator';
import fs from 'fs';

/**
 * Helper function to save workflow configuration to a file
 * Can be used to save user selections from the WorkflowBuilderComponent
 * 
 * @param config The workflow configuration object
 * @param filePath The path to save the configuration JSON file
 * @returns The saved file path
 */
export function saveWorkflowConfig(config: WorkflowConfig, filePath: string): string {
  const configJson = JSON.stringify(config, null, 2);
  fs.writeFileSync(filePath, configJson, 'utf8');
  return filePath;
}

/**
 * Helper function to load workflow configuration from a file
 * Can be used to load saved configurations into the WorkflowBuilderComponent
 * 
 * @param filePath The path to the configuration JSON file
 * @returns The loaded workflow configuration
 */
export function loadWorkflowConfig(filePath: string): WorkflowConfig {
  const configJson = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(configJson) as WorkflowConfig;
}

/**
 * Helper function to generate and save a workflow file from a configuration
 * 
 * @param config The workflow configuration
 * @param outputDir The directory to save the workflow YAML (default: .github/workflows)
 * @returns Object containing the file path and secrets summary
 */
export function generateAndSaveWorkflow(
  config: WorkflowConfig,
  outputDir: string = '.github/workflows'
): { filePath: string; secretsSummary?: string } {
  return writeWorkflowFile(config, outputDir);
}

/**
 * Helper function to preview workflow YAML without saving
 * 
 * @param config The workflow configuration
 * @returns Object containing the YAML string and secrets summary
 */
export function previewWorkflow(
  config: WorkflowConfig
): { yaml: string; secretsSummary?: string } {
  return generateWorkflow(config);
}