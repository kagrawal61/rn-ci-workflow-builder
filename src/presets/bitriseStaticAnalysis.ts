import { BitriseConfig, BitriseStep, WorkflowOptions } from '../types';

export function buildBitriseStaticAnalysisPipeline(
  opts: WorkflowOptions
): BitriseConfig {
  const {
    triggers,
    env,
    packageManager = 'yarn',
    staticAnalysis = {
      typescript: true,
      eslint: true,
      prettier: true,
      unitTests: true,
    },
  } = opts;

  // Default environment variables
  const defaultEnvs: Array<Record<string, string>> = [
    { CI: 'true' },
    { NODE_OPTIONS: '--max_old_space_size=4096' },
    { YARN_ENABLE_IMMUTABLE_INSTALLS: '1' },
  ];

  // Build app-level environment variables
  const appEnvs: Array<Record<string, string>> = [...defaultEnvs];
  if (env) {
    Object.entries(env).forEach(([key, value]) => {
      appEnvs.push({ [key]: value });
    });
  }

  // Modern cache configuration steps
  const lockFileName =
    packageManager === 'yarn' ? 'yarn.lock' : 'package-lock.json';
  const cacheTitle = packageManager === 'yarn' ? 'yarn cache' : 'npm cache';

  const restoreCacheStep: BitriseStep = {
    'restore-cache@2': {
      title: `Restore ${cacheTitle}`,
      inputs: [
        {
          key: `{{ .OS }}-{{ .Arch }}-${packageManager}-cache-{{ checksum "${lockFileName}" }}`,
        },
      ],
    },
  };

  const saveCacheStep: BitriseStep = {
    'save-cache@1': {
      title: `Save ${cacheTitle}`,
      inputs: [
        {
          key: `{{ .OS }}-{{ .Arch }}-${packageManager}-cache-{{ checksum "${lockFileName}" }}`,
        },
        {
          paths: 'node_modules',
        },
      ],
    },
  };

  // Node setup steps
  const setupSteps: BitriseStep[] = [
    {
      'git-clone@8': {
        title: 'Git Clone',
      },
    },
    {
      'nvm@1': {
        title: 'Setup Node.js 18',
        inputs: [
          {
            node_version: '18',
          },
        ],
      },
    },
    restoreCacheStep,
  ];

  // Dependency installation step
  const installStep: BitriseStep =
    packageManager === 'yarn'
      ? {
          'yarn@0': {
            inputs: [
              {
                args: '--immutable',
              },
            ],
          },
        }
      : {
          'script@1': {
            title: 'Install Dependencies',
            inputs: [
              {
                content: `#!/usr/bin/env bash
set -euo pipefail

npm ci`,
              },
            ],
          },
        };

  // Quality check steps
  const qualitySteps: BitriseStep[] = [];

  if (staticAnalysis.typescript !== false) {
    qualitySteps.push({
      'script@1': {
        title: 'TypeScript Check',
        inputs: [
          {
            content: `#!/usr/bin/env bash
set -euo pipefail

${packageManager === 'yarn' ? 'yarn tsc --noEmit' : 'npm run tsc -- --noEmit'}`,
          },
        ],
      },
    });
  }

  if (staticAnalysis.eslint !== false) {
    qualitySteps.push({
      'script@1': {
        title: 'ESLint Check',
        inputs: [
          {
            content: `#!/usr/bin/env bash
set -euo pipefail

${packageManager === 'yarn' ? 'yarn lint' : 'npm run lint'}`,
          },
        ],
      },
    });
  }

  if (staticAnalysis.prettier !== false) {
    qualitySteps.push({
      'script@1': {
        title: 'Prettier Check',
        inputs: [
          {
            content: `#!/usr/bin/env bash
set -euo pipefail

${packageManager === 'yarn' ? 'yarn format:check' : 'npm run format:check'}`,
          },
        ],
      },
    });
  }

  // Test steps
  const testSteps: BitriseStep[] = [];

  if (staticAnalysis.unitTests !== false) {
    testSteps.push({
      'script@1': {
        title: 'Unit Tests',
        inputs: [
          {
            content: `#!/usr/bin/env bash
set -euo pipefail

${packageManager === 'yarn' ? 'yarn test --ci' : 'npm test -- --ci'}`,
          },
        ],
      },
    });
  }

  // Combine all steps
  const workflowSteps = [
    ...setupSteps,
    installStep,
    ...qualitySteps,
    ...testSteps,
    saveCacheStep,
  ];

  // Platform configuration
  const workflow_meta = {
    stack: 'linux-docker-android-22.04',
    machine_type_id: 'elite',
  };

  // Build trigger map
  const triggerMap = [];

  if (triggers?.push?.branches) {
    triggers.push.branches.forEach(branch => {
      triggerMap.push({
        push_branch: branch,
        workflow: 'rn-static-analysis',
      });
    });
  } else {
    // Default push trigger for main branch
    triggerMap.push({
      push_branch: 'main',
      workflow: 'rn-static-analysis',
    });
  }

  if (triggers?.pullRequest?.branches) {
    triggers.pullRequest.branches.forEach(branch => {
      triggerMap.push({
        pull_request_target_branch: branch,
        workflow: 'rn-static-analysis',
      });
    });
  } else {
    // Default PR trigger for main branch
    triggerMap.push({
      pull_request_target_branch: 'main',
      workflow: 'rn-static-analysis',
    });
  }

  return {
    format_version: 13,
    default_step_lib_source:
      'https://github.com/bitrise-io/bitrise-steplib.git',
    project_type: 'react-native',
    meta: { 'bitrise.io': workflow_meta },
    app: {
      envs: appEnvs.length > 0 ? appEnvs : undefined,
    },
    workflows: {
      'rn-static-analysis': {
        title: opts.name || 'React Native Static Analysis',
        description:
          'Run static analysis including TypeScript, ESLint, Prettier, and unit tests',
        steps: workflowSteps,
      },
    },
    trigger_map: triggerMap,
  };
}
