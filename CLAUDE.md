# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Install dependencies
yarn install
# or
npm install

# Build the project
yarn build
# or
npm run build

# Development mode (runs health-check preset by default)
yarn dev
# or
npm run dev

# Generate workflow using health-check preset
yarn generate:health
# or
npm run generate:health

# Generate workflow with custom preset (when implemented)
yarn generate [preset-name]
# or
npm run generate [preset-name]
```

## Code Architecture

This project is a workflow generator for React Native CI/CD pipelines. It generates GitHub Actions workflow YAML files based on preset configurations.

### Core Components

1. **Generator System**:
   - `src/generator.ts`: Entry point for both CLI and programmatic usage. Contains functions to generate workflow YAML from configurations and write files.
   - Uses `js-yaml` for YAML serialization.

2. **Workflow Presets**:
   - Located in `src/presets/`.
   - Currently includes `healthCheck.ts` which builds GitHub Actions workflow for running TypeScript checks, linting, formatting, and tests.
   - Each preset is a function that takes `WorkflowOptions` and returns a workflow object structure.

3. **Helper Functions**:
   - `src/helpers.ts`: Contains utility functions for:
     - Building GitHub Actions triggers
     - Creating environment variables
     - Handling secrets
     - Configuring caching steps
     - Building conditional execution logic

4. **Type System**:
   - `src/types.ts`: TypeScript interfaces and types for workflow configurations.
   - Main types include:
     - `WorkflowConfig`: Top-level configuration with workflow kind and options
     - `WorkflowOptions`: Configuration options like name, triggers, environment, etc.
     - `TriggerOptions`, `CacheConfig`, `SkipConfig`: Specialized configuration types

### Workflow Generation Process

1. User provides a workflow configuration (via JSON or programmatically)
2. The generator selects the appropriate preset builder function
3. The builder creates a workflow object with jobs, steps, and configurations
4. The object is serialized to YAML
5. Placeholders for secrets are replaced with GitHub Actions secret syntax
6. The resulting YAML is either output to console or written to a file

### Extension Points

To add new workflow types:
1. Create a new preset file in `src/presets/`
2. Add the preset builder function to the `builders` map in `generator.ts`
3. Define any new types needed in `types.ts`
4. Create sample configuration files in `samples/`