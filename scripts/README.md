# Workflow Combination Generator

This script generates all possible combinations of CI/CD workflows based on the available presets and configuration options in the RN CI Workflow Builder.

## Overview

The combination generator creates workflow configurations for:

- **Static Analysis workflows**: All combinations of static analysis options across different platforms
- **Build workflows**: All combinations of platforms, variants, storage solutions, notification types, and static analysis integrations

## Usage

### Run the Generator

```bash
# Using npm script (recommended)
npm run generate:all-combinations

# Or directly with ts-node
npx ts-node scripts/generate-all-combinations.ts
```

### Command Line Options

The script supports several command line options:

```bash
# Generate all combinations (default)
npm run generate:all-combinations

# Count combinations only (without creating files)
npm run generate:all-combinations -- --count-only
# or
npm run generate:all-combinations -- -c

# Show help
npm run generate:all-combinations -- --help
```

#### Count-Only Mode

Use the `--count-only` flag when you want to:
- Quickly see how many combinations would be generated
- Debug combination logic without creating files
- Get statistics about configuration dimensions

Count-only mode provides:
- Total combination count
- Breakdown by preset type (Static Analysis vs Build)  
- Configuration dimensions breakdown
- No file generation or validation

### Output

The script generates:
- Individual JSON configuration files in the `generated-combinations/` directory
- A comprehensive `SUMMARY.md` file with statistics and usage instructions

### Configuration Dimensions

#### Static Analysis Workflows
- **CI Platforms**: GitHub Actions, Bitrise
- **Package Managers**: yarn, npm
- **Node Versions**: [18], [20], [18, 20]
- **Static Analysis Options**: Various combinations of TypeScript, ESLint, Prettier, and unit tests

#### Build Workflows
- **CI Platforms**: GitHub Actions, Bitrise
- **Target Platforms**: iOS, Android, Both
- **Build Variants**: Debug, Release
- **Storage Solutions**: GitHub, Google Drive, Firebase, AWS S3, Bitrise
- **Notification Types**: Slack, PR Comment, Both, None
- **Android Output Types**: APK, AAB, Both (when applicable)
- **Static Analysis Integration**: With or without static analysis
- **Package Managers**: yarn, npm
- **Node Versions**: [18], [20], [18, 20]

## Validation

The script automatically validates each generated combination by:
1. Checking for logical consistency (e.g., Android output types only for Android builds)
2. Verifying platform compatibility (e.g., Bitrise storage only with Bitrise platform)
3. Testing actual workflow generation to ensure validity

## Generated Files

Each generated configuration file follows this naming pattern:
```
{preset}-{platform}-{options}-{index}.json
```

Examples:
- `static-analysis-github-yarn-node20-0001.json`
- `build-github-android-release-s3-slack-yarn-node18-20-0042.json`
- `build-bitrise-both-debug-bitrise-none-with-static-analysis-npm-node20-0156.json`

## Using Generated Configurations

Any generated configuration can be used with the main CLI:

```bash
# Generate workflow from combination
npx rn-ci-workflow-builder generate -c generated-combinations/[filename].json

# Validate combination
npx rn-ci-workflow-builder validate -c generated-combinations/[filename].json

# Generate with custom output
npx rn-ci-workflow-builder generate -c generated-combinations/[filename].json -o my-workflow.yaml
```

## Statistics

The script typically generates several thousand combinations covering:
- All valid platform and storage combinations
- Comprehensive static analysis variations
- Multiple Node.js version configurations
- Different package manager options

Invalid combinations (e.g., iOS builds with Android output types) are automatically filtered out.

## Customization

To modify the combination dimensions, edit the `COMBINATION_CONFIG` object in `generate-all-combinations.ts`:

```typescript
const COMBINATION_CONFIG: CombinationConfig = {
  presets: ['static-analysis', 'build'],
  platforms: ['github', 'bitrise'],
  // ... other options
};
```

## Error Handling

The script includes comprehensive error handling:
- Invalid combinations are automatically skipped
- Generation failures are logged with detailed error messages
- A summary of successful and failed generations is provided
- Failed configurations are listed in the summary for debugging 