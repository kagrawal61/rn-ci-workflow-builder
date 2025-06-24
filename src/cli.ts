#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { Command } from 'commander';
import * as jsYaml from 'js-yaml';

import { generateWorkflow, writeWorkflowFile, getAvailablePresets } from './generator';
import { WorkflowConfig } from './types';

// Register built-in presets
import { registerBuiltInPresets } from './presets';
registerBuiltInPresets();

// Create commander program
const program = new Command();

program
  .name('rn-ci-workflow-builder')
  .description('Generate GitHub Actions workflows for React Native CI/CD pipelines')
  .version('0.1.0');

// Generate command
program
  .command('generate [preset]')
  .description('Generate workflow YAML based on preset')
  .option('-c, --config <path>', 'Path to config file (JSON or YAML)')
  .option('-o, --output <path>', 'Output file path')
  .option('-d, --dir <path>', 'Output directory (default: .github/workflows)')
  .action(async (preset = 'health-check', options) => {
    try {
      // Default config
      let config: WorkflowConfig = { kind: preset };

      // Load config from file if provided
      if (options.config) {
        const configPath = path.resolve(options.config);
        const configContent = fs.readFileSync(configPath, 'utf8');
        
        if (configPath.endsWith('.json')) {
          config = JSON.parse(configContent);
        } else if (configPath.endsWith('.yaml') || configPath.endsWith('.yml')) {
          config = jsYaml.load(configContent) as WorkflowConfig;
        } else {
          throw new Error('Config file must be JSON or YAML');
        }

        // Override preset if specified in command
        if (preset && preset !== 'health-check') {
          config.kind = preset;
        }
      }

      // Generate workflow
      const yamlOutput = generateWorkflow(config);

      // Write to file or output to console
      if (options.output) {
        fs.writeFileSync(options.output, yamlOutput, 'utf8');
        console.log(`Workflow written to ${options.output}`);
      } else if (options.dir) {
        const filePath = writeWorkflowFile(config, options.dir);
        console.log(`Workflow written to ${filePath}`);
      } else {
        const filePath = writeWorkflowFile(config);
        console.log(`Workflow written to ${filePath}`);
      }
    } catch (error) {
      console.error('Error generating workflow:', error);
      process.exit(1);
    }
  });

// List available presets command
program
  .command('list-presets')
  .description('List all available workflow presets')
  .action(() => {
    const presets = getAvailablePresets();
    console.log('Available workflow presets:');
    presets.forEach(preset => console.log(`- ${preset}`));
  });

// Parse arguments and run
program.parse();