# Web App Platform Selection Demo

The React Native CI Workflow Builder web app now supports selecting between **GitHub Actions** and **Bitrise** platforms!

## 🚀 Platform Selection Feature

### How to Use

1. **Start the web app**:
   ```bash
   cd app
   npm run dev
   ```

2. **Open your browser** to `http://localhost:3000`

3. **Select CI Platform** in the Basic Settings:
   - **GitHub Actions**: Generates `.github/workflows/*.yml` files
   - **Bitrise**: Generates `bitrise.yml` configuration

### What Changes Based on Platform

#### **GitHub Actions** (Default)
- **File Output**: `[workflow-name].yml`
- **Format**: GitHub Actions YAML
- **UI Text**: "Your GitHub Actions workflow is ready"
- **Runner Options**: ubuntu-latest, macos-latest
- **Tooltip**: "The virtual environment to run the workflow"

#### **Bitrise**
- **File Output**: `bitrise.yml` 
- **Format**: Bitrise configuration YAML
- **UI Text**: "Your Bitrise workflow is ready"
- **Runner Options**: Still shows GitHub runner options (could be enhanced)
- **Tooltip**: "Build machine specification for Bitrise"

### Example Workflows Generated

#### GitHub Actions Health Check
```yaml
name: React Native Health Check
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      # ... more steps
```

#### Bitrise Health Check
```yaml
format_version: 11
project_type: react-native
workflows:
  test:
    title: React Native Health Check
    steps:
      - git-clone@8: {}
      - script@1:
          title: Install Dependencies
          inputs:
            content: yarn install --immutable
      # ... more steps
trigger_map:
  - push_branch: main
    workflow: test
```

## 🎯 Testing the Feature

1. **Switch Platforms**: Toggle between GitHub Actions and Bitrise
2. **Generate Workflows**: Click "Preview Workflow" to see the output
3. **Compare Formats**: Notice the different YAML structures
4. **File Names**: See how the download filename changes

## ✨ Benefits

- **Unified Interface**: Single UI for both CI platforms
- **Real-time Preview**: See immediate changes when switching platforms
- **Platform-Specific Output**: Native YAML formats for each platform
- **Smart Defaults**: Appropriate settings for each platform 