import { buildEnv, buildTriggers, cacheSteps } from '../helpers';
import notificationHelpers from '../helpers/notifications';
import {
  GitHubJob,
  GitHubStep,
  GitHubWorkflow,
  WorkflowOptions,
} from '../types';

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
      notification: 'pr-comment',
    },
  } = opts;

  // Add required secrets for notifications
  const requiredSecrets = [...(secrets || [])];
  if (
    healthCheck.notification === 'slack' ||
    healthCheck.notification === 'both'
  ) {
    if (!requiredSecrets.includes('SLACK_WEBHOOK_URL')) {
      requiredSecrets.push('SLACK_WEBHOOK_URL');
    }
  }
  if (
    healthCheck.notification === 'pr-comment' ||
    healthCheck.notification === 'both'
  ) {
    if (!requiredSecrets.includes('GITHUB_TOKEN')) {
      requiredSecrets.push('GITHUB_TOKEN');
    }
  }

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

  // Add notification steps if configured
  if (healthCheck.notification && healthCheck.notification !== 'none') {
    const notificationSteps =
      notificationHelpers.createStaticAnalysisNotificationSteps(
        healthCheck.notification
      );
    testSteps.push(...notificationSteps);
  }

  // Static analysis job configuration
  const testJob: GitHubJob = {
    name: 'Run Static Analysis',
    'runs-on': runsOn,
    steps: testSteps,
  };

  // Jobs collection
  const jobs: Record<string, GitHubJob> = {};

  // Add static analysis job to jobs collection
  jobs.static_analysis = testJob;

  return {
    name: opts.name ?? 'Health Check',
    on: buildTriggers(triggers),
    env: buildEnv(env, requiredSecrets),
    jobs,
  };
}
