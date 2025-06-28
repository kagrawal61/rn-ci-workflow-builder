# GitHub Actions Workflow Best Practices

This document outlines best practices and guidelines for creating GitHub Actions workflows in this project.

## General Best Practices

### 1. Design and Planning
- **Ask clarifying questions** before designing any new workflow
- Document the purpose, triggers, and outcomes of each workflow
- Break down complex workflows into logical steps and jobs
- Consider reusability of workflow components for future expansion
- **Keep things simple and easy to understand** for end users

### 2. Performance Optimization
- **Analyze parallel execution opportunities** to minimize workflow duration
- Use GitHub's `jobs.<job_id>.needs` parameter to define dependencies between jobs
- Use matrix strategies for testing against multiple configurations
- Configure appropriate timeout limits for jobs and steps
- Limit what files/paths trigger workflows using `paths` and `paths-ignore`

### 3. Caching and Artifacts
- Implement caching for dependencies to speed up builds
- Use action-specific caching when available (e.g., `actions/setup-node@v4` with `cache: 'npm'`)
- Store and pass data between jobs using artifacts
- Set appropriate retention periods for artifacts

### 4. Security Considerations
- Store sensitive values as secrets, never hardcode them
- Use environment variables for non-sensitive configuration
- Define **secrets and environment variables separately** for better readability
- Use `GITHUB_TOKEN` with minimum required permissions

## Specific Implementation Guidelines


### Code Reusability and DRY Principle
- **Extract common steps into reusable workflows** or composite actions
- Avoid duplicating test, lint, and formatting steps across jobs
- Consider implementing a common "quality checks" job that runs before platform-specific builds
- Use output values from jobs to pass information rather than regenerating it

### Third-Party Actions Evaluation Criteria
- **Evaluate third-party actions** carefully before using them
- Assessment criteria for third-party actions:
  1. **Popularity**: Number of stars on GitHub
  2. **Maintenance**: Recent updates and release frequency
  3. **Issues**: Number of open issues and resolution rate
  4. **Usage**: Adoption by other projects
  5. **Documentation**: Quality of documentation
  6. **Security**: Vulnerability history and maintenance
- Always pin actions to specific versions (prefer SHA commits for maximum security)
- Prefer official actions (like `actions/*`) when available

### Step Organization
- Group related steps logically
- Use step IDs for steps that produce outputs or are referenced in conditions
- Use descriptive names for steps and jobs
- Consider using comments to separate major sections in complex workflows

## Example Workflow Structure

```yaml
name: CI Workflow

on:
  push:
    branches: [main, develop]
    paths-ignore: ['docs/**', '*.md']
  pull_request:
    branches: [main, develop]

# Define environment variables at the top level
env:
  NODE_VERSION: '16'
  CACHE_KEY: ${{ runner.os }}-modules-${{ hashFiles('**/yarn.lock') }}

jobs:
  # Common quality checks that run once
  quality-checks:
    name: Quality Checks
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      # Setup, lint, test steps
      # These don't need to run twice for iOS and Android

  # Platform-specific jobs
  build-android:
    needs: [quality-checks]
    name: Build Android
    runs-on: ubuntu-latest
    steps:
      # Android-specific steps
      # No need to repeat common checks

  build-ios:
    needs: [quality-checks]
    name: Build iOS
    runs-on: macos-latest
    steps:
      # iOS-specific steps
      # No need to repeat common checks
```

## Final Workflow Checklist

Before submitting/committing any workflow:

1. ✅ Is the workflow clear, simple and easy to understand?
2. ✅ Have common steps been extracted to avoid redundancy?
3. ✅ Is parallelization optimized (jobs that can run concurrently do so)?
4. ✅ Are all secrets and variables properly defined and referenced?
5. ✅ Have third-party actions been properly evaluated?
6. ✅ Is caching implemented for dependencies?
7. ✅ Are there appropriate timeout settings?
8. ✅ Is error handling and notification in place?

Always prioritize clarity and simplicity over clever or complex solutions. The best workflow is one that's easy to understand, maintain, and troubleshoot.