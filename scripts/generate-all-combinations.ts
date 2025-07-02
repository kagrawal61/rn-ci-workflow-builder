#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { generateWorkflowForCli } from '../src/generator';
import { registerBuiltInPresets } from '../src/presets';
import {
  AndroidOutputType,
  BuildOptions,
  HealthCheckOptions,
  NotificationType,
  Platform,
  StorageSolution,
  Variant,
} from '../src/presets/types';
import { CIPlatform, PackageManager, WorkflowConfig } from '../src/types';

// Register built-in presets
registerBuiltInPresets();

// Parse command line arguments
const args = process.argv.slice(2);
const countOnly = args.includes('--count-only') || args.includes('-c');

// Configuration dimensions for generating combinations
interface CombinationConfig {
  presets: string[];
  platforms: CIPlatform[];
  packageManagers: PackageManager[];
  nodeVersions: number[][];
  buildOptions: {
    platforms: Platform[];
    variants: Variant[];
    storageOptions: StorageSolution[];
    notificationTypes: NotificationType[];
    androidOutputTypes: AndroidOutputType[];
    includeHealthCheckOptions: boolean[];
  };
  healthCheckOptions: {
    combinations: HealthCheckOptions[];
  };
}

// Define all possible combinations
const COMBINATION_CONFIG: CombinationConfig = {
  presets: ['static-analysis', 'build'],
  platforms: ['github', 'bitrise'],
  packageManagers: ['yarn', 'npm'],
  nodeVersions: [[18], [20], [18, 20]],
  buildOptions: {
    platforms: ['ios', 'android', 'both'],
    variants: ['debug', 'release'],
    storageOptions: ['github', 'drive', 'firebase', 's3', 'bitrise'],
    notificationTypes: ['slack', 'pr-comment', 'both', 'none'],
    androidOutputTypes: ['apk', 'aab', 'both'],
    includeHealthCheckOptions: [true, false],
  },
  healthCheckOptions: {
    combinations: [
      // Individual checks
      { typescript: true },
      { eslint: true },
      { prettier: true },
      { unitTests: true },
      // Common combinations
      { typescript: true, eslint: true },
      { typescript: true, eslint: true, prettier: true },
      { typescript: true, eslint: true, prettier: true, unitTests: true },
      { eslint: true, prettier: true },
      { unitTests: true, typescript: true },
      // All enabled
      { typescript: true, eslint: true, prettier: true, unitTests: true },
      // All disabled (empty object represents default behavior)
      {},
    ],
  },
};

// Utility functions
function isValidCombination(config: WorkflowConfig): boolean {
  const { kind, options } = config;

  // Skip invalid combinations
  if (!options) return false;

  // Build-specific validations
  if (kind === 'build' && options.build) {
    const build = options.build;

    // Android output type only applies to Android builds
    if (build.androidOutputType && build.platform === 'ios') {
      return false;
    }

    // Bitrise storage only works with Bitrise platform
    if (build.storage === 'bitrise' && options.platform !== 'bitrise') {
      return false;
    }

    // GitHub storage only works with GitHub platform
    if (build.storage === 'github' && options.platform !== 'github') {
      return false;
    }
  }

  return true;
}

function generateFileName(config: WorkflowConfig, index: number): string {
  const { kind, options } = config;
  const platform = options?.platform || 'github';

  let name = `${kind}-${platform}`;

  if (kind === 'build' && options?.build) {
    const build = options.build;
    name += `-${build.platform}-${build.variant}-${build.storage}-${build.notification}`;

    if (build.androidOutputType && build.platform !== 'ios') {
      name += `-${build.androidOutputType}`;
    }

    if (build.includeHealthCheck) {
      name += '-with-health-check';
    }
  }

  name += `-${options?.packageManager || 'yarn'}`;
  name += `-node${(options?.nodeVersions || [20]).join('-')}`;
  name += `-${index.toString().padStart(4, '0')}`;

  return `${name}.json`;
}

function generateBaseTriggers() {
  return {
    push: {
      branches: ['main', 'develop'],
      ignorePaths: ['docs/**', '**/*.md'],
    },
    pullRequest: {
      branches: ['main', 'develop'],
    },
    workflowDispatch: true,
  };
}

function generateBaseSecrets(build?: BuildOptions): string[] {
  const secrets: string[] = [];

  if (build) {
    // Storage-specific secrets
    switch (build.storage) {
      case 'firebase':
        secrets.push(
          'FIREBASE_SERVICE_ACCOUNT',
          'FIREBASE_APP_ID_IOS',
          'FIREBASE_APP_ID_ANDROID'
        );
        break;
      case 's3':
        secrets.push(
          'AWS_ACCESS_KEY_ID',
          'AWS_SECRET_ACCESS_KEY',
          'AWS_S3_BUCKET',
          'AWS_REGION',
          'S3_BASE_URL'
        );
        break;
      case 'drive':
        secrets.push('GOOGLE_DRIVE_CREDENTIALS', 'GOOGLE_DRIVE_FOLDER_ID');
        break;
    }

    // Notification-specific secrets
    if (build.notification === 'slack' || build.notification === 'both') {
      secrets.push('SLACK_WEBHOOK');
    }
  }

  return secrets;
}

// Main combination generation functions
function generateStaticAnalysisCombinations(): WorkflowConfig[] {
  const combinations: WorkflowConfig[] = [];

  for (const platform of COMBINATION_CONFIG.platforms) {
    for (const packageManager of COMBINATION_CONFIG.packageManagers) {
      for (const nodeVersions of COMBINATION_CONFIG.nodeVersions) {
        for (const healthCheck of COMBINATION_CONFIG.healthCheckOptions
          .combinations) {
          const config: WorkflowConfig = {
            kind: 'static-analysis',
            options: {
              name: `Static Analysis Pipeline - ${platform}`,
              platform,
              packageManager,
              nodeVersions,
              triggers: generateBaseTriggers(),
              healthCheck:
                Object.keys(healthCheck).length > 0 ? healthCheck : undefined,
              secrets: generateBaseSecrets(),
              runsOn: platform === 'github' ? 'ubuntu-latest' : undefined,
              cache: { enabled: true },
              env: { NODE_ENV: 'test' },
            },
          };

          if (isValidCombination(config)) {
            combinations.push(config);
          }
        }
      }
    }
  }

  return combinations;
}

function generateBuildCombinations(): WorkflowConfig[] {
  const combinations: WorkflowConfig[] = [];

  for (const platform of COMBINATION_CONFIG.platforms) {
    for (const packageManager of COMBINATION_CONFIG.packageManagers) {
      for (const nodeVersions of COMBINATION_CONFIG.nodeVersions) {
        for (const buildPlatform of COMBINATION_CONFIG.buildOptions.platforms) {
          for (const variant of COMBINATION_CONFIG.buildOptions.variants) {
            for (const storage of COMBINATION_CONFIG.buildOptions
              .storageOptions) {
              for (const notification of COMBINATION_CONFIG.buildOptions
                .notificationTypes) {
                for (const includeHealthCheck of COMBINATION_CONFIG.buildOptions
                  .includeHealthCheckOptions) {
                  // Generate combinations with and without Android output type
                  const androidOutputTypes =
                    buildPlatform === 'ios'
                      ? [undefined]
                      : [
                          undefined,
                          ...COMBINATION_CONFIG.buildOptions.androidOutputTypes,
                        ];

                  for (const androidOutputType of androidOutputTypes) {
                    // Generate combinations with different health check options when included
                    const healthCheckCombinations = includeHealthCheck
                      ? COMBINATION_CONFIG.healthCheckOptions.combinations
                      : [undefined];

                    for (const healthCheckOptions of healthCheckCombinations) {
                      const buildOptions: BuildOptions = {
                        platform: buildPlatform,
                        variant,
                        storage,
                        notification,
                        includeHealthCheck,
                        ...(androidOutputType && { androidOutputType }),
                        ...(includeHealthCheck &&
                          healthCheckOptions && { healthCheckOptions }),
                      };

                      const config: WorkflowConfig = {
                        kind: 'build',
                        options: {
                          name: `Build Pipeline - ${platform} - ${buildPlatform} ${variant}`,
                          platform,
                          packageManager,
                          nodeVersions,
                          triggers: generateBaseTriggers(),
                          build: buildOptions,
                          secrets: generateBaseSecrets(buildOptions),
                          runsOn:
                            platform === 'github' ? 'ubuntu-latest' : undefined,
                          cache: { enabled: true },
                          env: { NODE_ENV: 'production' },
                        },
                      };

                      if (isValidCombination(config)) {
                        combinations.push(config);
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  return combinations;
}

// Main execution
async function generateAllCombinations(countOnly: boolean = false) {
  if (countOnly) {
    console.log('🔢 Counting workflow combinations...\n');
  } else {
    console.log('🚀 Generating all possible workflow combinations...\n');
  }

  const outputDir = path.join(process.cwd(), 'generated-combinations');

  // Generate combinations
  const staticAnalysisCombinations = generateStaticAnalysisCombinations();
  const buildCombinations = generateBuildCombinations();

  const allCombinations = [...staticAnalysisCombinations, ...buildCombinations];

  console.log(`📊 Generated ${allCombinations.length} total combinations:`);
  console.log(`   - Static Analysis: ${staticAnalysisCombinations.length}`);
  console.log(`   - Build: ${buildCombinations.length}\n`);

  // If count-only mode, skip file generation
  if (countOnly) {
    console.log('ℹ️  Count-only mode: Skipping file generation');
    console.log(`📈 Breakdown by configuration dimensions:`);
    console.log(`   - CI Platforms: ${COMBINATION_CONFIG.platforms.length}`);
    console.log(
      `   - Package Managers: ${COMBINATION_CONFIG.packageManagers.length}`
    );
    console.log(
      `   - Node Version Sets: ${COMBINATION_CONFIG.nodeVersions.length}`
    );
    console.log(
      `   - Build Platforms: ${COMBINATION_CONFIG.buildOptions.platforms.length}`
    );
    console.log(
      `   - Build Variants: ${COMBINATION_CONFIG.buildOptions.variants.length}`
    );
    console.log(
      `   - Storage Options: ${COMBINATION_CONFIG.buildOptions.storageOptions.length}`
    );
    console.log(
      `   - Notification Types: ${COMBINATION_CONFIG.buildOptions.notificationTypes.length}`
    );
    console.log(
      `   - Health Check Combinations: ${COMBINATION_CONFIG.healthCheckOptions.combinations.length}`
    );
    return;
  }

  // Create output directory
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Write configuration files
  const successful: string[] = [];
  const failed: Array<{ file: string; error: string }> = [];

  for (let i = 0; i < allCombinations.length; i++) {
    const config = allCombinations[i];
    const fileName = generateFileName(config, i + 1);
    const filePath = path.join(outputDir, fileName);

    try {
      // Test generation to ensure it's valid
      await generateWorkflowForCli(config);

      // Write configuration file
      fs.writeFileSync(filePath, JSON.stringify(config, null, 2));
      successful.push(fileName);

      if ((i + 1) % 100 === 0) {
        console.log(
          `✅ Generated ${i + 1}/${allCombinations.length} combinations...`
        );
      }
    } catch (error) {
      failed.push({
        file: fileName,
        error: (error as Error).message,
      });
    }
  }

  // Generate summary
  const summaryPath = path.join(outputDir, 'SUMMARY.md');
  const summary = `# Workflow Combinations Summary

Generated on: ${new Date().toISOString()}

## Statistics
- **Total Combinations**: ${allCombinations.length}
- **Successful**: ${successful.length}
- **Failed**: ${failed.length}

## Breakdown by Preset
- **Static Analysis**: ${staticAnalysisCombinations.length}
- **Build**: ${buildCombinations.length}

## Configuration Dimensions
- **Presets**: ${COMBINATION_CONFIG.presets.join(', ')}
- **CI Platforms**: ${COMBINATION_CONFIG.platforms.join(', ')}
- **Package Managers**: ${COMBINATION_CONFIG.packageManagers.join(', ')}
- **Node Versions**: ${COMBINATION_CONFIG.nodeVersions.map(versions => `[${versions.join(', ')}]`).join(', ')}

### Build Options
- **Platforms**: ${COMBINATION_CONFIG.buildOptions.platforms.join(', ')}
- **Variants**: ${COMBINATION_CONFIG.buildOptions.variants.join(', ')}
- **Storage Options**: ${COMBINATION_CONFIG.buildOptions.storageOptions.join(', ')}
- **Notification Types**: ${COMBINATION_CONFIG.buildOptions.notificationTypes.join(', ')}
- **Android Output Types**: ${COMBINATION_CONFIG.buildOptions.androidOutputTypes.join(', ')}

### Health Check Options
- **Total Health Check Combinations**: ${COMBINATION_CONFIG.healthCheckOptions.combinations.length}

## Failed Generations
${failed.length > 0 ? failed.map(f => `- ${f.file}: ${f.error}`).join('\n') : 'None'}

## Usage
Each generated JSON file can be used with the CLI:

\`\`\`bash
# Generate workflow from combination
npx rn-ci-workflow-builder generate -c generated-combinations/[filename].json

# Validate combination
npx rn-ci-workflow-builder validate -c generated-combinations/[filename].json
\`\`\`
`;

  fs.writeFileSync(summaryPath, summary);

  // Final output
  console.log(`\n🎉 Generation complete!`);
  console.log(`📁 Output directory: ${outputDir}`);
  console.log(`✅ Successful combinations: ${successful.length}`);
  console.log(`❌ Failed combinations: ${failed.length}`);
  console.log(`📋 Summary written to: ${summaryPath}`);

  if (failed.length > 0) {
    console.log('\n❌ Failed combinations:');
    failed.forEach(f => console.log(`   - ${f.file}: ${f.error}`));
  }
}

// Run the script
if (require.main === module) {
  // Show usage information if help is requested
  if (args.includes('--help') || args.includes('-h')) {
    console.log(`Usage: ${process.argv[1]} [options]

Options:
  --count-only, -c    Only count combinations without generating files
  --help, -h          Show this help message

Examples:
  # Generate all combinations (default)
  npm run generate:all-combinations

  # Count combinations only
  npm run generate:all-combinations -- --count-only
`);
    process.exit(0);
  }

  generateAllCombinations(countOnly).catch(error => {
    console.error('❌ Script failed:', error);
    process.exit(1);
  });
}

export { COMBINATION_CONFIG, generateAllCombinations };
