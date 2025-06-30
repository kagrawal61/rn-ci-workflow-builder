#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { Command } from 'commander';
import * as jsYaml from 'js-yaml';

import { generateWorkflow, generateWorkflowForCli, writeWorkflowFile, getAvailablePresets } from './generator';
import { WorkflowConfig } from './types';
import { generateSecretsSummary } from './helpers/secretsManager';
import { BuildOptions } from './presets/types';

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
  .option('-d, --dir <path>', 'Output directory (default: .github/workflows for GitHub, . for Bitrise)')
  .option('-p, --platform <platform>', 'CI platform (github or bitrise)', 'github')
  .option('-v, --validate-only', 'Only validate the configuration without generating files')
  .action(async (preset = 'health-check', options) => {
    try {
      // Default config
      let config: WorkflowConfig = { 
        kind: preset,
        options: {
          platform: options.platform as 'github' | 'bitrise'
        }
      };

      // Load config from file if provided
      if (options.config) {
        const configPath = path.resolve(options.config);
        if (!fs.existsSync(configPath)) {
          console.error(`Error: Config file not found: ${configPath}`);
          process.exit(1);
        }

        try {
          const configContent = fs.readFileSync(configPath, 'utf8');
          
          if (configPath.endsWith('.json')) {
            config = JSON.parse(configContent);
          } else if (configPath.endsWith('.yaml') || configPath.endsWith('.yml')) {
            config = jsYaml.load(configContent) as WorkflowConfig;
          } else {
            throw new Error('Config file must be JSON or YAML');
          }
        } catch (error) {
          console.error(`Error parsing config file: ${(error as Error).message}`);
          process.exit(1);
        }

        // Override preset if specified in command
        if (preset && preset !== 'health-check') {
          config.kind = preset;
        }
        
        // Override platform if specified in command
        if (options.platform) {
          config.options = config.options || {};
          config.options.platform = options.platform as 'github' | 'bitrise';
        }
      }

      // Validate-only mode
      if (options.validateOnly) {
        try {
          await generateWorkflowForCli(config);
          console.log('✅ Validation successful! Configuration is valid.');
          return;
        } catch (error) {
          console.error(`❌ Validation failed: ${(error as Error).message}`);
          
          // Show helpful documentation for specific error types
          if ((error as Error).message.includes('required secret')) {
            const buildOptions = (config.options as any)?.build as BuildOptions;
            if (buildOptions) {
              console.error('\n' + generateSecretsSummary(buildOptions));
            }
          }
          
          process.exit(1);
        }
      }

      // Generate workflow
      try {
        const { yaml } = await generateWorkflowForCli(config);

        // Write to file or output to console
        let filePath: string;
        if (options.output) {
          fs.writeFileSync(options.output, yaml, 'utf8');
          filePath = options.output;
          console.log(`✅ Workflow written to ${options.output}`);
        } else if (options.dir) {
          const result = writeWorkflowFile(config, options.dir);
          filePath = result.filePath;
          console.log(`✅ Workflow written to ${filePath}`);
        } else {
          const result = writeWorkflowFile(config);
          filePath = result.filePath;
          console.log(`✅ Workflow written to ${filePath}`);
        }
      } catch (error) {
        console.error(`❌ Error generating workflow: ${(error as Error).message}`);
        
        // Print additional guidance for known error types
        if ((error as Error).message.includes('required secret')) {
          const buildOptions = (config.options as any)?.build as BuildOptions;
          if (buildOptions) {
            console.error('\n' + generateSecretsSummary(buildOptions));
          } else {
            console.error('\nHint: Make sure to include all required secrets for your configuration:');
            console.error('  - For Firebase storage: FIREBASE_SERVICE_ACCOUNT and FIREBASE_APP_ID_* secrets');
            console.error('  - For S3 storage: AWS_* secrets');
            console.error('  - For Slack notifications: SLACK_WEBHOOK secret');
          }
        } else if ((error as Error).message.includes('undefined value')) {
          console.error('\nHint: Check your configuration for undefined values or missing required fields');
        }
        
        process.exit(1);
      }
    } catch (error) {
      console.error(`❌ Error: ${(error as Error).message}`);
      process.exit(1);
    }
  });

// Validate command
program
  .command('validate')
  .description('Validate configuration without generating files')
  .option('-c, --config <path>', 'Path to config file (JSON or YAML)')
  .action(async (options) => {
    try {
      if (!options.config) {
        console.error('Error: Config file path is required');
        process.exit(1);
      }

      const configPath = path.resolve(options.config);
      if (!fs.existsSync(configPath)) {
        console.error(`Error: Config file not found: ${configPath}`);
        process.exit(1);
      }

      let config: WorkflowConfig;
      try {
        const configContent = fs.readFileSync(configPath, 'utf8');
        
        if (configPath.endsWith('.json')) {
          config = JSON.parse(configContent);
        } else if (configPath.endsWith('.yaml') || configPath.endsWith('.yml')) {
          config = jsYaml.load(configContent) as WorkflowConfig;
        } else {
          throw new Error('Config file must be JSON or YAML');
        }
      } catch (error) {
        console.error(`Error parsing config file: ${(error as Error).message}`);
        process.exit(1);
      }

      try {
        generateWorkflow(config);
        console.log('✅ Validation successful! Configuration is valid.');
      } catch (error) {
        console.error(`❌ Validation failed: ${(error as Error).message}`);
        
        // Show helpful documentation for specific error types
        if ((error as Error).message.includes('required secret')) {
          const buildOptions = (config.options as any)?.build as BuildOptions;
          if (buildOptions) {
            console.error('\n' + generateSecretsSummary(buildOptions));
          }
        }
        
        process.exit(1);
      }
    } catch (error) {
      console.error(`❌ Error: ${(error as Error).message}`);
      process.exit(1);
    }
  });

// Bitrise validate command
program
  .command('bitrise-validate [file]')
  .description('Validate a Bitrise YAML file using Bitrise CLI (automatically installs CLI if needed)')
  .action(async (file = 'bitrise.yml') => {
    try {
      const { validateWithBitriseCli } = await import('./validation/yaml');
      
      if (!fs.existsSync(file)) {
        console.error(`❌ Error: File not found: ${file}`);
        process.exit(1);
      }
      
      await validateWithBitriseCli(file, true); // Always auto-install by default
      console.log(`✅ ${file} is valid according to Bitrise CLI`);
    } catch (error) {
      console.error(`❌ ${(error as Error).message}`);
      process.exit(1);
    }
  });

// Help command for required secrets
program
  .command('secrets [storage] [notification]')
  .description('Show required secrets for a configuration')
  .option('-p, --platform <platform>', 'Platform (ios, android, both)')
  .action((storage = 'github', notification = 'none', options) => {
    const platform = options.platform || 'both';
    
    const buildOptions: BuildOptions = {
      platform: platform as any,
      variant: 'release',
      storage: storage as any,
      notification: notification as any,
      includeHealthCheck: true,
    };
    
    console.log(generateSecretsSummary(buildOptions));
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