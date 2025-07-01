import {
  WorkflowOptions,
  GitHubStep,
  GitHubJob,
  GitHubWorkflow,
} from '../types';
import { buildTriggers, buildEnv, cacheSteps } from '../helpers';

export function buildHealthCheckPipeline(
  opts: WorkflowOptions
): GitHubWorkflow {
  const {
    triggers,
    env,
    secrets,
    cache = { enabled: true },
    runsOn = 'ubuntu-latest',
    nodeVersions = [20],
    packageManager = 'yarn',
    healthCheck = {
      typescript: true,
      eslint: true,
      prettier: true,
      unitTests: true,
    },
  } = opts;

  const testSteps: GitHubStep[] = [
    { name: 'Checkout', uses: 'actions/checkout@v4' },
    {
      name: 'Setup Node',
      uses: 'actions/setup-node@v4',
      with: {
        'node-version': nodeVersions[0] || 20,
        cache: packageManager === 'yarn' ? 'yarn' : 'npm',
      },
    },
    ...cacheSteps(packageManager, cache),
    packageManager === 'yarn'
      ? { name: 'Install', run: 'yarn install --immutable' }
      : { name: 'Install', run: 'npm ci' },
  ];

  // Add configurable checks
  if (healthCheck.typescript !== false) {
    testSteps.push({
      name: 'TypeScript',
      run:
        packageManager === 'yarn'
          ? 'yarn tsc --noEmit'
          : 'npm run tsc -- --noEmit',
    });
  }

  if (healthCheck.eslint !== false) {
    testSteps.push({
      name: 'ESLint',
      run: packageManager === 'yarn' ? 'yarn lint' : 'npm run lint',
    });
  }

  if (healthCheck.prettier !== false) {
    testSteps.push({
      name: 'Prettier',
      run:
        packageManager === 'yarn'
          ? 'yarn format:check'
          : 'npm run format:check',
    });
  }

  if (healthCheck.unitTests !== false) {
    testSteps.push({
      name: 'Unit tests',
      run: packageManager === 'yarn' ? 'yarn test --ci' : 'npm test -- --ci',
    });
  }

  // Test job configuration
  const testJob: GitHubJob = {
    name: 'Run Tests',
    'runs-on': runsOn,
    steps: testSteps,
  };

  // Jobs collection
  const jobs: Record<string, GitHubJob> = {};

  // Add test job to jobs collection
  jobs.test = testJob;

  return {
    name: opts.name ?? 'Health-check',
    on: buildTriggers(triggers),
    env: buildEnv(env, secrets),
    jobs,
  };
}
