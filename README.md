# React Native CI Workflow Builder

A powerful tool to generate GitHub Actions workflows for React Native CI/CD pipelines.

## Features

- Generate workflow YAML files for React Native applications
- Built-in presets for common CI/CD tasks (health checks, builds, etc.)
- Configurable via CLI or programmatically 
- TypeScript support with full type definitions
- Customizable workflows for different CI/CD needs

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

1. The CLI script (`src/cli.ts`) is executed with the `generate health-check` command
2. The CLI registers all available workflow presets
3. It creates a workflow configuration object with the specified preset kind
4. This configuration is passed to the `generateWorkflow` function
5. The appropriate builder function for the preset is called (e.g., `buildHealthCheckPipeline`)
6. The builder creates a GitHub Actions workflow object with jobs and steps
7. The workflow object is converted to YAML
8. The YAML is written to a file in the `.github/workflows` directory

### CLI

The CLI allows you to quickly generate workflow files for your React Native project.

#### Basic Usage

```bash
# Install globally
npm install -g rn-ci-workflow-builder

# Generate workflow with default options (health-check)
rn-ci-workflow-builder generate

# Generate specific preset
rn-ci-workflow-builder generate health-check
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

// Generate YAML string
const yaml = generateWorkflow(config);
console.log(yaml);

// Or write directly to a file
const filePath = writeWorkflowFile(config, '.github/workflows', 'custom-health-check.yml');
console.log(`Workflow written to ${filePath}`);
```

## Configuration

### Workflow Configuration

The main configuration structure:

```typescript
interface WorkflowConfig {
  kind: 'health-check' | string;
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

#### Health Check Workflow

The health-check preset creates a workflow that runs the following checks:

- TypeScript typechecking
- ESLint
- Prettier
- Unit tests

```json
{
  "kind": "health-check",
  "options": {
    "name": "React Native Health Check",
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
# Run in development mode (generates health-check workflow)
npm run dev
# or
yarn dev

# Generate workflow using health-check preset
npm run generate:health
# or
yarn generate:health

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
  registerBuilder('health-check', buildHealthCheckPipeline);
  registerBuilder('my-custom', buildMyCustomWorkflow);
}

export const presetKinds = ['health-check', 'my-custom'] as const;
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

## License

MIT
