import { WorkflowOptions } from '../types';
import { buildTriggers, buildEnv, buildSkipCondition, cacheSteps } from '../helpers';

export function buildHealthCheckPipeline(opts: WorkflowOptions): Record<string, any> {
  const {
    triggers,
    env,
    secrets,
    cache,
    skip,
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
        'node-version': '${{ matrix.node }}',
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
    strategy: nodeVersions.length > 1 ? { matrix: { node: nodeVersions } } : undefined,
    steps: testSteps,
  };

  // Jobs collection
  const jobs: Record<string, any> = {};

  // Conditionally add skip check job if skip configuration is provided
  if (skip && (skip.commitMessageContains || skip.prTitleContains || skip.prLabel)) {
    // Define skip condition message
    const skipMessage = skip.commitMessageContains || '[skip ci]';
    
    // Create check-skip job
    const checkSkipJob: Record<string, any> = {
      name: 'Check Skip Conditions',
      'runs-on': runsOn,
      steps: [
        { name: 'Skip CI check', run: `echo "Checking if workflow should be skipped..."` },
      ]
    };
    
    // Apply skip condition if specified
    const skipCondition = buildSkipCondition(skip);
    if (skipCondition) {
      checkSkipJob.if = skipCondition;
    } else if (skip.commitMessageContains) {
      // Fallback for simple commit message check
      checkSkipJob.if = `!contains(github.event.head_commit.message, '${skipMessage}')`;
    }

    // Add the check-skip job
    jobs['check-skip'] = checkSkipJob;
    
    // Make test job depend on check-skip job
    testJob.needs = ['check-skip'];
  } else {
    // Apply skip condition directly to test job if needed
    const skipCondition = buildSkipCondition(skip);
    if (skipCondition) {
      testJob.if = skipCondition;
    }
  }

  // Add test job to jobs collection
  jobs.test = testJob;

  return {
    name: opts.name ?? 'Health-check',
    on: buildTriggers(triggers),
    env: buildEnv(env, secrets),
    jobs,
  };
}