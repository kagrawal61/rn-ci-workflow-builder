<div align="center">

<h1>🚀 React Native CI Workflow Builder</h1>

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
![Platforms](https://img.shields.io/badge/platforms-Android%20%26%20iOS-important)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/kagrawal61/rn-ci-workflow-builder/graphs/commit-activity)
[![GitHub Issues](https://img.shields.io/github/issues/kagrawal61/rn-ci-workflow-builder.svg)](https://github.com/kagrawal61/rn-ci-workflow-builder/issues)
[![GitHub Pull Requests](https://img.shields.io/github/issues-pr/kagrawal61/rn-ci-workflow-builder.svg)](https://github.com/kagrawal61/rn-ci-workflow-builder/pulls)
[![Build CI](https://github.com/kagrawal61/rn-ci-workflow-builder/workflows/Build/badge.svg)](https://github.com/kagrawal61/rn-ci-workflow-builder/actions?query=workflow%3ABuild)

**A powerful, flexible tool to generate GitHub Actions and Bitrise workflows for React Native CI/CD pipelines.**

💰 **Save time and reduce complexity** by automating your React Native CI/CD setup

[✨ Features](#features) • [📦 Installation](#installation) • [🔧 Usage](#usage) • [📚 Documentation](#documentation) • [👥 Contributing](CONTRIBUTING.md) • [⚖️ License](#license)

</div>

## ✨ Features

- **Powerful Workflow Generation**: Create optimized GitHub Actions or Bitrise workflows for React Native applications
- **Multiple Preset Templates**: Built-in presets for static analysis, builds, and more
- **Platform Support**: Generate workflows for both Android and iOS builds
- **Flexible Configuration**: Use via CLI, programmatic API, or web interface
- **Strong TypeScript Integration**: Full type definitions for all configuration options
- **Environment Management**: Automatic detection and configuration of .env files
- **Smart Secret Handling**: Contextual secret management with documentation
- **Artifact Storage Options**: Support for GitHub, Firebase, Google Drive, and S3
- **Notification Integration**: Built-in support for Slack and PR comments

## 📦 Installation

### npm

```bash
npm install rn-ci-workflow-builder
```

### yarn

```bash
yarn add rn-ci-workflow-builder
```

## 🔧 Usage

### 🤖 How It Works

The workflow builder takes a preset configuration and generates a ready-to-use GitHub Actions or Bitrise workflow file. It handles all the complexity of creating the correct YAML structure, configuring dependencies, managing secrets, and optimizing the workflow for React Native projects.

### 💻 CLI

The CLI allows you to quickly generate workflow files for your React Native project.

#### 🌟 Basic Usage

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

#### ⚙️ Advanced CLI Options

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

## 📚 Documentation

Comprehensive documentation is available to help you get the most out of the workflow builder:

- [📃 CLI Commands Reference](docs/README.md#cli-commands-reference) - Detailed information about all available commands
- [🔒 Secret Management Guide](./docs/secret-management.md) - Working with secrets for different platforms and services
- [🏗️ Environment Configuration](./docs/env-config.md) - Managing environment variables and .env files

See all available CLI commands:

- `generate [preset]` - Generate workflow YAML based on preset
- `validate` - Validate configuration without generating files  
- `bitrise-validate [file]` - Validate Bitrise YAML using Bitrise CLI
- `secrets [storage] [notification]` - Show required secrets for a configuration
- `list-presets` - List all available workflow presets

#### 🗳️ Platform Support

The CLI supports both **GitHub Actions** (default) and **Bitrise** platforms:

```bash
# Generate for GitHub Actions (default)
rn-ci-workflow-builder generate build

# Generate for Bitrise
rn-ci-workflow-builder generate build --platform bitrise
```

### 💼 Programmatic Usage

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

## 📝 Configuration

### ⚙️ Configuration

The workflow builder supports a wide range of configuration options, including:

- 💡 Workflow triggers (push, pull request, manual dispatch)
- 🔩 Node.js versions and package managers
- 🔑 Environment variables and secrets
- 📍 Build variants and platforms
- 📢 Notification and storage options

For complete configuration details, refer to the [📒 configuration documentation](./docs/configuration.md).

### 📡 Available Presets

- 🎨 **Static Analysis**: Run TypeScript checks, ESLint, Prettier, and unit tests
- 🏗️ **Build**: Generate platform-specific build workflows for Android and/or iOS

For detailed configuration options and examples, see the [🗜️ workflow presets documentation](./docs/workflow-presets.md).

## 💻 Development

### 🔰 Setup

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

### ⚙️ Development Commands

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

## 🔗 Extending

The workflow builder is designed to be extensible. You can create custom workflow presets for specific CI/CD scenarios. For detailed instructions on creating custom presets, see the [🛠️ extensibility guide](./docs/extending.md).

## ✨ Additional Features

### 🔐 Secret Management

The workflow builder includes intelligent secret management that identifies required secrets based on your configuration choices. [🔗 Learn more](./docs/secret-management.md)

### 🌍 Environment Variables

Automatically handle environment-specific configurations with support for popular React Native environment libraries. [🔗 Learn more](./docs/env-config.md)

## 👨‍💻 Web Application

The project also includes a web-based workflow builder interface that provides a visual way to configure and generate workflows without using the command line.

### ✨ Features

- User-friendly interface for configuring workflows
- Real-time YAML preview
- Form validation and contextual help
- Easy export of generated workflows

### 🚀 Running the Web App

```bash
# Navigate to the app directory
cd app

# Install dependencies
yarn install

# Start the development server
yarn dev
```

## 👥 Contributing

Contributions are welcome! Please check our [Contributing Guidelines](CONTRIBUTING.md) for details on how to submit pull requests, report issues, and suggest features.

## ⚖️ License

This project is licensed under the [MIT License](LICENSE).

## 👨‍💻 Maintainers

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/kagrawal61">
        <img src="https://github.com/kagrawal61.png" width="100px;" alt="kagrawal61"/><br />
        <sub><b>kagrawal61</b></sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/NikhilVashistha">
        <img src="https://github.com/NikhilVashistha.png" width="100px;" alt="NikhilVashistha"/><br />
        <sub><b>NikhilVashistha</b></sub>
      </a>
    </td>
  </tr>
</table>
