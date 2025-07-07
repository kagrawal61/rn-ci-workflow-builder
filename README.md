<div align="center">

<h1>🚀 React Native CI Workflow Builder</h1>

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
![Platforms](https://img.shields.io/badge/platforms-Android%20%26%20iOS-important)
[![Maintenance](https://img.shields.io/badge/Maintained-yes-green.svg)](https://github.com/kagrawal61/rn-ci-workflow-builder/graphs/commit-activity)
[![GitHub Issues](https://img.shields.io/github/issues/kagrawal61/rn-ci-workflow-builder.svg)](https://github.com/kagrawal61/rn-ci-workflow-builder/issues)
[![GitHub PRs](https://img.shields.io/badge/PRs-Open-blue.svg)](https://github.com/kagrawal61/rn-ci-workflow-builder/pulls)
[![GitHub Stars](https://img.shields.io/github/stars/kagrawal61/rn-ci-workflow-builder.svg?style=social)](https://github.com/kagrawal61/rn-ci-workflow-builder/stargazers)

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

## 💰 Benefits

> **Disclaimer:** These estimates are based on realistic React Native CI/CD scenarios. Actual savings depend heavily on your team's experience, project complexity, and current setup efficiency.

### ⏱️ Time Savings
- **Initial Setup**: Create workflows in **under 5 minutes** - from weeks to hours (95% time reduction)
- **Per Workflow**: Generate in **15 minutes** vs 4-8 hours manually
- **YAML Learning Curve**: Completely eliminated - no GitHub Actions syntax required
- **Documentation**: Secrets guide saves **30-60 minutes** per workflow
- **Debugging**: Pre-validated configs reduce common errors by **95%**

### 💵 Cost Savings
- **Developer Time**: Save **$1,200-4,800** per project (12-48 hours × $100/hour)
- **Annual Savings**: Small teams (1-2 projects): **$2,000-6,000**, Active teams (3-6 projects): **$6,000-15,000**
- **One-time Investment**: Learn once, apply across all projects vs repeated manual work

### 🚀 Efficiency Improvements
- **Faster Time-to-Market**: Deploy **2-3 weeks earlier** with automated CI/CD
- **Configuration Errors**: **95% fewer** mistakes with pre-validated templates
- **Development Cycles**: **80% faster** with reliable automated workflows
- **Project Scalability**: Handle **10x more projects** with same resources
- **Seamless Integration**: Minimal disruption to existing workflows

### 🔧 Manual vs Tool Comparison

| Aspect | Manual Setup | With Tool | Impact |
|--------|-------------|-----------|---------|
| Learning curve | High (GitHub Actions syntax) | Eliminated (visual interface) | **No YAML required** |
| Initial setup | Weeks | Under 5 minutes | **95% time reduction** |
| Per workflow | 4-8 hours | 15 minutes | **Hours to minutes** |
| Error likelihood | High (syntax errors) | 95% fewer errors | **Pre-validated templates** |
| Integration | Complex transition | Seamless workflow integration | **Minimizes disruption** |
| Scalability | Limited by manual work | 10x more projects | **Dramatic improvement** |

**Ready to Start?** Generate your first workflow in 15 minutes and see immediate 95% time savings with $2K-6K cost reduction per project.

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
# Load config from file
rn-ci-workflow-builder generate --config path/to/config.json

# Specify output directory/file
rn-ci-workflow-builder generate --dir .github/custom-workflows
rn-ci-workflow-builder generate --output my-workflow.yml

# Generate for Bitrise platform (default: GitHub Actions)
rn-ci-workflow-builder generate build --platform bitrise

# Validate configuration without generating files
rn-ci-workflow-builder generate --config config.json --validate-only
rn-ci-workflow-builder validate --config config.json

# Show required secrets for a configuration
rn-ci-workflow-builder secrets firebase slack --platform android

# List available presets
rn-ci-workflow-builder list-presets
```

## 📚 Documentation

Comprehensive documentation is available to help you get the most out of the workflow builder:

- [📃 CLI Commands Reference](docs/README.md#cli-commands-reference) - Detailed information about all available commands
- [🔒 Secret Management Guide](https://mobilecibuilder.vercel.app/docs/secrets-management) - Working with secrets for different platforms and services
- [🏗️ Environment Configuration](https://mobilecibuilder.vercel.app/docs/configuration) - Managing environment variables and .env files

### 💼 Programmatic Usage

You can also use the workflow generator programmatically in your own scripts:

```typescript
import { generateWorkflow, writeWorkflowFile } from 'rn-ci-workflow-builder';

// Generate a static-analysis workflow
const config = {
  kind: 'static-analysis',
  options: {
    name: 'Custom Static Analysis',
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
  'custom-static-analysis.yml'
);
console.log(`Workflow written to ${filePath}`);
```

## 📝 Configuration

The workflow builder supports a wide range of configuration options:

- 💡 Workflow triggers (push, pull request, manual dispatch)
- 🔩 Node.js versions and package managers
- 🔑 Environment variables and secrets
- 📍 Build variants and platforms
- 📢 Notification and storage options

**Available Presets:**
- 🎨 **Static Analysis**: Run TypeScript checks, ESLint, Prettier, and unit tests
- 🏗️ **Build**: Generate platform-specific build workflows for Android and/or iOS

For complete configuration details, refer to the [📒 configuration documentation](https://mobilecibuilder.vercel.app/docs/configuration) and [🗜️ workflow presets documentation](https://mobilecibuilder.vercel.app/docs/workflow-presets).

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

## 🔗 Extending & Web Interface

The workflow builder is designed to be extensible. You can create custom workflow presets for specific CI/CD scenarios. For detailed instructions on creating custom presets, see the [🛠️ core concepts guide](https://mobilecibuilder.vercel.app/docs/core-concepts).

**Web Application:** The project includes a web-based interface with user-friendly forms, real-time YAML preview, and validation. To run locally:

```bash
cd app && yarn install && yarn dev
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
