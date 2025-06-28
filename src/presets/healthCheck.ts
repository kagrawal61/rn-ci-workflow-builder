import { WorkflowOptions } from '../types';
import { buildTriggers, buildEnv, cacheSteps } from '../helpers';

export function buildHealthCheckPipeline(opts: WorkflowOptions): Record<string, any> {
  const {
    triggers,
    env,
    secrets,
    cache = { enabled: true },
    runsOn = 'ubuntu-latest',
    nodeVersions = [20],
    packageManager = 'yarn',
  } = opts;

  const testSteps: any[] = [
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
    { name: 'TypeScript', run: packageManager === 'yarn' ? 'yarn tsc --noEmit' : 'npm run tsc -- --noEmit' },
    { name: 'ESLint', run: packageManager === 'yarn' ? 'yarn lint' : 'npm run lint' },
    { name: 'Prettier', run: packageManager === 'yarn' ? 'yarn format:check' : 'npm run format:check' },
    { name: 'Unit tests', run: packageManager === 'yarn' ? 'yarn test --ci' : 'npm test -- --ci' },
  ];
  
  // Test job configuration
  const testJob: Record<string, any> = {
    name: 'Run Tests',
    'runs-on': runsOn,
    steps: testSteps,
  };

  // Jobs collection
  const jobs: Record<string, any> = {};

  // Add test job to jobs collection
  jobs.test = testJob;

  return {
    name: opts.name ?? 'Health-check',
    on: buildTriggers(triggers),
    env: buildEnv(env, secrets),
    jobs,
  };
}