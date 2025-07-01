# React Native CI Workflow Builder

A powerful tool to generate GitHub Actions workflows for React Native CI/CD pipelines.

## Features

- Generate workflow YAML files for React Native applications
- Built-in presets for common CI/CD tasks (static analysis, builds, etc.)
- Configurable via CLI or programmatically 
- TypeScript support with full type definitions
- Customizable workflows for different CI/CD needs
- Automatic detection and use of .env files
- Contextual secret management with inline tooltips
- Automatic generation of required secrets summary

## Installation

### npm

```bash
npm install rn-ci-workflow-builder
```

### yarn

```bash
yarn add rn-ci-workflow-builder
```

## Usage

### How It Works

When you run a command like `yarn generate:health`, this is what happens:

1. The CLI script (`src/cli.ts`) is executed with the `generate static-analysis` command
2. The CLI registers all available workflow presets
3. It creates a workflow configuration object with the specified preset kind
4. This configuration is passed to the `generateWorkflow` function
5. The appropriate builder function for the preset is called (e.g., `buildStaticAnalysisPipeline`)
6. The builder creates a GitHub Actions or Bitrise workflow object with jobs and steps
7. The workflow object is converted to YAML
8. Required secrets are identified based on configuration choices
9. Secret placeholders are replaced with the appropriate secret syntax
10. A summary of required secrets is generated
11. The YAML is written to a file (`.github/workflows` for GitHub Actions, root for Bitrise)

### CLI

The CLI allows you to quickly generate workflow files for your React Native project.

#### Basic Usage

```bash
# Install globally
npm install -g rn-ci-workflow-builder

# Generate workflow with default options (static-analysis)
rn-ci-workflow-builder generate

# Generate specific preset
rn-ci-workflow-builder generate static-analysis

# Generate build workflow
rn-ci-workflow-builder generate build
```

#### Advanced CLI Options

```bash
# List available presets
rn-ci-workflow-builder list-presets

# Load config from file
rn-ci-workflow-builder generate --config path/to/config.json

# Specify output directory
rn-ci-workflow-builder generate --dir .github/custom-workflows

# Specify output file
rn-ci-workflow-builder generate --output my-workflow.yml

# Generate for Bitrise platform
rn-ci-workflow-builder generate build --platform bitrise

# Validate configuration only (without generating files)
rn-ci-workflow-builder generate --config path/to/config.json --validate-only

# Validate configuration file only
rn-ci-workflow-builder validate --config path/to/config.json

# Validate existing Bitrise YAML file
rn-ci-workflow-builder bitrise-validate bitrise.yml

# Show required secrets for a configuration
rn-ci-workflow-builder secrets firebase slack --platform android
```

#### Complete CLI Commands Reference

See the [full CLI documentation](docs/README.md#cli-commands-reference) for detailed information about all available commands:

- `generate [preset]` - Generate workflow YAML based on preset
- `validate` - Validate configuration without generating files  
- `bitrise-validate [file]` - Validate Bitrise YAML using Bitrise CLI
- `secrets [storage] [notification]` - Show required secrets for a configuration
- `list-presets` - List all available workflow presets

#### Platform Support

The CLI supports both **GitHub Actions** (default) and **Bitrise** platforms:

```bash
# Generate for GitHub Actions (default)
rn-ci-workflow-builder generate build

# Generate for Bitrise
rn-ci-workflow-builder generate build --platform bitrise
```

### Programmatic Usage

You can also use the workflow generator programmatically in your own scripts:

```typescript
import { generateWorkflow, writeWorkflowFile } from 'rn-ci-workflow-builder';

// Generate a health-check workflow
const config = {
  kind: 'health-check',
  options: {
    name: 'Custom Health Check',
    triggers: {
      push: {
        branches: ['main', 'dev'],
        ignorePaths: ['docs/**']
      },
      pullRequest: {
        branches: ['main']
      },
      workflowDispatch: true
    },
    nodeVersions: [18, 20],
    packageManager: 'yarn'
  }
};

// Generate YAML string with secrets summary
const { yaml, secretsSummary } = generateWorkflow(config);
console.log(yaml);

// Display secrets summary if available
if (secretsSummary) {
  console.log('Required secrets:')
  console.log(secretsSummary);
}

// Or write directly to a file
const { filePath, secretsSummary: summary } = writeWorkflowFile(
  config, 
  '.github/workflows', 
  'custom-health-check.yml'
);
console.log(`Workflow written to ${filePath}`);
```

## Configuration

### Workflow Configuration

The main configuration structure:

```typescript
interface WorkflowConfig {
  kind: 'static-analysis' | string;
  options?: WorkflowOptions;
}
```

### Options

Available workflow options:

```typescript
interface WorkflowOptions {
  name?: string;                               // Workflow name
  triggers?: TriggerOptions;                   // GitHub trigger events
  env?: Record<string, string>;                // Environment variables
  secrets?: string[];                          // Secrets to reference
  cache?: CacheConfig;                         // Caching configuration
  skip?: SkipConfig;                           // Skip condition rules
  runsOn?: string;                             // GitHub runner
  nodeVersions?: (string | number)[];          // Node.js versions to test
  packageManager?: 'yarn' | 'npm';             // Package manager
  concurrency?: ConcurrencyConfig;             // Concurrency settings
}
```

### Available Presets

#### Static Analysis Workflow

The static-analysis preset creates a workflow that runs the following checks:

- TypeScript typechecking
- ESLint
- Prettier
- Unit tests

```json
{
  "kind": "static-analysis",
  "options": {
    "name": "React Native Static Analysis",
    "nodeVersions": [18],
    "packageManager": "yarn",
    "triggers": {
      "push": {
        "branches": ["main"]
      },
      "pullRequest": {
        "branches": ["main"]
      },
      "workflowDispatch": true
    }
  }
}
```

#### Build Workflow

The build preset creates a workflow for building React Native apps for Android and/or iOS platforms:

- Android build with Gradle
- iOS build with CocoaPods/Xcode
- Platform-specific artifact storage
- Multiple artifact storage options (GitHub, Firebase, Google Drive, S3)
- Notification options (Slack, PR comments)
- Android build options (APK or AAB output formats using Gradle tasks)

**Android Output Types**

For Android builds, you can specify the output type (`androidOutputType`) as:
- `apk`: Generates an installable APK file (default)
- `aab`: Generates an Android App Bundle for Play Store submission
- `both`: Generates both APK and AAB formats simultaneously

This uses the React Native CLI's `--tasks` flag to specify the appropriate Gradle task:
- For APK: `assembleDebug` or `assembleRelease` depending on the `variant`
- For AAB: `bundleDebug` or `bundleRelease` depending on the `variant`
- For Both: Runs both tasks sequentially and uploads artifacts for both formats

**Android Build Examples:**

```json
// Example with APK output
{
  "kind": "build",
  "options": {
    "name": "React Native Android Build",
    "nodeVersions": [20],
    "packageManager": "yarn",
    "triggers": {
      "push": {
        "branches": ["main", "develop"]
      },
      "pullRequest": {
        "branches": ["main"]
      },
      "workflowDispatch": true
    },
    "build": {
      "platform": "android",
      "variant": "debug",
      "storage": "github",
      "notification": "pr-comment",
      "includeHealthCheck": true,
      "androidOutputType": "apk"
    }
  }
}

// Example with both APK and AAB outputs
{
  "kind": "build",
  "options": {
    "name": "React Native Android Build (APK + AAB)",
    "nodeVersions": [20],
    "packageManager": "yarn",
    "triggers": {
      "push": {
        "branches": ["main", "develop"]
      },
      "pullRequest": {
        "branches": ["main"]
      },
      "workflowDispatch": true
    },
    "build": {
      "platform": "android",
      "variant": "release",
      "storage": "github",
      "notification": "pr-comment",
      "includeHealthCheck": true,
      "androidOutputType": "both"
    }
  }
}
```

**iOS Build Example:**

```json
{
  "kind": "build",
  "options": {
    "name": "React Native iOS Build",
    "nodeVersions": [20],
    "packageManager": "yarn",
    "runsOn": "macos-latest",
    "triggers": {
      "pullRequest": {
        "branches": ["main"]
      },
      "workflowDispatch": true
    },
    "build": {
      "platform": "ios",
      "variant": "debug",
      "storage": "firebase",
      "notification": "both",
      "includeHealthCheck": true,
    }
  }
}
```

## Development

### Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/rn-ci-workflow-builder.git
cd rn-ci-workflow-builder

# Install dependencies
npm install
# or
yarn install

# Build the project
npm run build
# or
yarn build
```

### Development Commands

```bash
# Run in development mode (generates static-analysis workflow)
npm run dev
# or
yarn dev

# Generate workflow using static-analysis preset
npm run generate:health
# or
yarn generate:health

# Generate workflow using build preset
npm run generate:build
# or
yarn generate:build

# Generate Android build workflow
npm run generate:build:android
# or
yarn generate:build:android

# Generate iOS build workflow
npm run generate:build:ios
# or
yarn generate:build:ios

# Generate multi-platform build workflow
npm run generate:build:both
# or
yarn generate:build:both

# List available presets
npm run list-presets
# or
yarn list-presets

# Type checking
npm run tsc -- --noEmit
# or
yarn tsc --noEmit

# Linting
npm run lint
# or
yarn lint

# Format code
npm run format
# or
yarn format

# Run tests
npm test
# or
yarn test
```

## Extending with New Workflow Types

You can add new workflow presets by following these steps:

1. Create a new file in the `src/presets` directory (e.g., `myCustomWorkflow.ts`)

2. Define your builder function:

```typescript
import { WorkflowOptions } from '../types';
import { buildTriggers, buildEnv, buildSkipCondition } from '../helpers';

export function buildMyCustomWorkflow(opts: WorkflowOptions): Record<string, any> {
  // Define your custom workflow here
  const steps = [
    { name: 'Checkout', uses: 'actions/checkout@v4' },
    // Add your custom steps here
  ];

  return {
    name: opts.name ?? 'My Custom Workflow',
    on: buildTriggers(opts.triggers),
    env: buildEnv(opts.env, opts.secrets),
    jobs: {
      custom_job: {
        'runs-on': opts.runsOn ?? 'ubuntu-latest',
        steps
      }
    }
  };
}
```

3. Register your preset in `src/presets/index.ts`:

```typescript
import { buildMyCustomWorkflow } from './myCustomWorkflow';

export function registerBuiltInPresets(): void {
  registerBuilder('static-analysis', buildStaticAnalysisPipeline);
  registerBuilder('my-custom', buildMyCustomWorkflow);
}

export const presetKinds = ['static-analysis', 'my-custom'] as const;
```

4. Use your new preset:

```bash
yarn generate my-custom
```

Or programmatically:

```typescript
const config = { kind: 'my-custom', options: { /* ... */ } };
const yaml = generateWorkflow(config);
```

## Secret Management

The workflow generator includes a contextual secret management system that identifies required secrets based on your configuration choices.

- Auto-generates a list of required secrets based on storage and notification options
- Shows tooltips explaining which options require which secrets
- Replaces secret placeholders with GitHub Actions secret syntax
- Groups secrets by context (storage, platform, notification)

Learn more in the [Secret Management documentation](./docs/secret-management.md)

## Environment Configuration

The workflow builder supports environment-based configuration for React Native apps using `.env` files.

- Supports popular libraries like `react-native-config` and `react-native-dotenv`
- Automatically copies the correct environment file during build
- Configurable environment names (development, staging, production)
- Custom environment file paths

Learn more in the [Environment Configuration documentation](./docs/env-config.md)

## License

MIT
