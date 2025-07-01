import { WorkflowOptions, BitriseConfig } from '../types';

export function buildBitriseStaticAnalysisPipeline(
  opts: WorkflowOptions
): BitriseConfig {
  const {
    triggers,
    env,
    packageManager = 'yarn',
    healthCheck = {
      typescript: true,
      eslint: true,
      prettier: true,
      unitTests: true,
    },
  } = opts;

  // Build app-level environment variables
  const appEnvs: Array<Record<string, string>> = [];
  if (env) {
    Object.entries(env).forEach(([key, value]) => {
      appEnvs.push({ [key]: value });
    });
  }

  // Build test steps
  const testSteps = [
    {
      'git-clone@8': {},
    },
    {
      'script@1': {
        title: 'Install Dependencies',
        inputs: [
          {
            content:
              packageManager === 'yarn' ? 'yarn install --immutable' : 'npm ci',
          },
        ],
      },
    },
  ];

  // Add configurable checks
  if (healthCheck.typescript !== false) {
    testSteps.push({
      'script@1': {
        title: 'TypeScript Check',
        inputs: [
          {
            content:
              packageManager === 'yarn'
                ? 'yarn tsc --noEmit'
                : 'npm run tsc -- --noEmit',
          },
        ],
      },
    });
  }

  if (healthCheck.eslint !== false) {
    testSteps.push({
      'script@1': {
        title: 'ESLint',
        inputs: [
          { content: packageManager === 'yarn' ? 'yarn lint' : 'npm run lint' },
        ],
      },
    });
  }

  if (healthCheck.prettier !== false) {
    testSteps.push({
      'script@1': {
        title: 'Prettier Check',
        inputs: [
          {
            content:
              packageManager === 'yarn'
                ? 'yarn format:check'
                : 'npm run format:check',
          },
        ],
      },
    });
  }

  if (healthCheck.unitTests !== false) {
    testSteps.push({
      'script@1': {
        title: 'Unit Tests',
        inputs: [
          {
            content:
              packageManager === 'yarn' ? 'yarn test --ci' : 'npm test -- --ci',
          },
        ],
      },
    });
  }

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
    format_version: 11,
    default_step_lib_source:
      'https://github.com/bitrise-io/bitrise-steplib.git',
    project_type: 'react-native',
    app: {
      envs: appEnvs.length > 0 ? appEnvs : undefined,
    },
    workflows: {
      'rn-static-analysis': {
        title: opts.name || 'React Native Static Analysis',
        description:
          'Run health checks including TypeScript, ESLint, Prettier, and unit tests',
        steps: testSteps,
      },
    },
    trigger_map: triggerMap,
  };
}
