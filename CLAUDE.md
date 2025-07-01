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

# Development mode (runs static-analysis preset by default)
yarn dev
# or
npm run dev

# Generate workflow using static-analysis preset
yarn generate:health
# or
npm run generate:health

# Generate workflow with custom preset (when implemented)
yarn generate [preset-name]
# or
npm run generate [preset-name]
```

## Code Architecture

This project is a workflow generator for React Native CI/CD pipelines. It generates GitHub Actions and Bitrise workflow YAML files based on preset configurations.

### Core Components

1. **Generator System**:
   - `src/generator.ts`: Entry point for both CLI and programmatic usage. Contains functions to generate workflow YAML from configurations and write files.
   - Uses `js-yaml` for YAML serialization.

2. **Workflow Presets**:
   - Located in `src/presets/`.
   - Available presets: `static-analysis`, `build`
   - Each preset supports both GitHub Actions and Bitrise platforms
   - Platform-specific implementations: `staticAnalysis.ts`, `buildPreset.ts` (GitHub Actions), `bitriseStaticAnalysis.ts`, `bitriseBuildPreset.ts` (Bitrise)
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
     - `TriggerOptions`, `CacheConfig`: Specialized configuration types

### Workflow Generation Process

1. User provides a workflow configuration (via JSON or programmatically)
2. The generator selects the appropriate preset builder function
3. The builder creates a workflow object with jobs, steps, and configurations
4. The object is serialized to YAML
5. Placeholders for secrets are replaced with the appropriate secret syntax (GitHub Actions or Bitrise)
6. The resulting YAML is validated (including Bitrise CLI validation for Bitrise workflows)
7. The resulting YAML is either output to console or written to a file (.github/workflows for GitHub Actions, root for Bitrise)

### Extension Points

To add new workflow types:
1. Create a new preset file in `src/presets/`
2. Add the preset builder function to the `builders` map in `generator.ts`
3. Define any new types needed in `types.ts`
4. Create sample configuration files in `samples/`

## GitHub Actions Workflow Best Practices

When generating or modifying GitHub Actions workflow files, adhere to these guidelines:

### Workflow Design Principles

1. **Always ask clarifying questions** before creating a new workflow to ensure requirements are understood
2. **Keep things simple and easy to understand** for end users - aim for clarity over complexity
3. **Extract common steps** into reusable components to avoid redundancy (e.g., unit tests, linting)
4. **Analyze which steps can run in parallel** to optimize workflow execution time
5. **Define secrets and environment variables separately** for better readability
6. **Carefully evaluate third-party actions** before using them (consider popularity, maintenance, issues)

### Implementation Guidelines

- **Common Steps**: Extract test/lint steps to run once instead of duplicating in platform-specific jobs
- **Parallelization**: Use GitHub's `needs` parameter to define dependencies between jobs
- **Secrets/Envs**: Define environment variables at the top level of the workflow
- **Third-party Actions**: Evaluate actions based on popularity, maintenance history and community adoption

See complete details in [docs/workflows/best-practices.md](/docs/workflows/best-practices.md)