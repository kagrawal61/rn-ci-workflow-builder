import { WorkflowOptions, BitriseConfig } from '../types';

export function buildBitriseHealthCheckPipeline(opts: WorkflowOptions): BitriseConfig {
  const {
    triggers,
    env,
    packageManager = 'yarn',
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
      'git-clone@8': {}
    },
    {
      'script@1': {
        title: 'Install Dependencies',
        inputs: {
          content: packageManager === 'yarn' 
            ? 'yarn install --immutable' 
            : 'npm ci'
        }
      }
    },
    {
      'script@1': {
        title: 'TypeScript Check',
        inputs: {
          content: packageManager === 'yarn' 
            ? 'yarn tsc --noEmit' 
            : 'npm run tsc -- --noEmit'
        }
      }
    },
    {
      'script@1': {
        title: 'ESLint',
        inputs: {
          content: packageManager === 'yarn' 
            ? 'yarn lint' 
            : 'npm run lint'
        }
      }
    },
    {
      'script@1': {
        title: 'Prettier Check',
        inputs: {
          content: packageManager === 'yarn' 
            ? 'yarn format:check' 
            : 'npm run format:check'
        }
      }
    },
    {
      'script@1': {
        title: 'Unit Tests',
        inputs: {
          content: packageManager === 'yarn' 
            ? 'yarn test --ci' 
            : 'npm test -- --ci'
        }
      }
    }
  ];

  // Build trigger map
  const triggerMap = [];
  
  if (triggers?.push?.branches) {
    triggers.push.branches.forEach(branch => {
      triggerMap.push({
        push_branch: branch,
        workflow: 'test'
      });
    });
  } else {
    // Default push trigger for main branch
    triggerMap.push({
      push_branch: 'main',
      workflow: 'test'
    });
  }

  if (triggers?.pullRequest?.branches) {
    triggers.pullRequest.branches.forEach(branch => {
      triggerMap.push({
        pull_request_target_branch: branch,
        workflow: 'test'
      });
    });
  } else {
    // Default PR trigger for main branch
    triggerMap.push({
      pull_request_target_branch: 'main',
      workflow: 'test'
    });
  }

  return {
    format_version: 11,
    default_step_lib_source: 'https://github.com/bitrise-io/bitrise-steplib.git',
    project_type: 'react-native',
    app: {
      envs: appEnvs.length > 0 ? appEnvs : undefined
    },
    workflows: {
      test: {
        title: opts.name || 'React Native Health Check',
        description: 'Run health checks including TypeScript, ESLint, Prettier, and unit tests',
        steps: testSteps
      }
    },
    trigger_map: triggerMap
  };
} 