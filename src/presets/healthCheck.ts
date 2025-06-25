import { WorkflowOptions } from '../types';
import { buildTriggers, buildEnv, buildSkipCondition, cacheSteps } from '../helpers';

export function buildHealthCheckPipeline(opts: WorkflowOptions): Record<string, any> {
  const {
    triggers,
    env,
    secrets,
    cache = { enabled: true },
    skip = { commitMessageContains: '[skip ci]' },
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

  // Conditionally add skip check job if skip configuration is provided
  if (skip && (skip.commitMessageContains || skip.prTitleContains || skip.prLabel)) {
    // Create a dedicated skip check job with clear outputs
    const checkSkipJob: Record<string, any> = {
      name: 'Check Skip Conditions',
      'runs-on': runsOn,
      // Define an output that other jobs can use
      outputs: {
        'should-run': '${{ steps.skip-check.outputs.should-run }}'
      },
      steps: [
        {
          name: 'Skip CI check',
          id: 'skip-check',
          // Using string concatenation to avoid template literal parsing issues with ${{ }} 
          run: '# Check for skip markers in commit messages\n' +
               'SHOULD_RUN="true"\n' +
               'SKIP_REASON=""\n' +
               'SKIP_MARKER="' + (skip.commitMessageContains || '[skip ci]') + '"\n\n' +
               '# Check commit message when available (push events)\n' +
               'if [[ "$' + '{{ github.event.head_commit.message || \'\' }}" == *"$SKIP_MARKER"* ]]; then\n' +
               '  SHOULD_RUN="false"\n' +
               '  SKIP_REASON="Skipping due to \'$SKIP_MARKER\' in commit message"\n' +
               'fi\n\n' +
               '# Check PR title when available (PR events)\n' +
               'if [[ "$' + '{{ github.event_name }}" == "pull_request" && "$SHOULD_RUN" == "true" ]]; then\n' +
               '  if [[ "$' + '{{ github.event.pull_request.title || \'\' }}" == *"' + (skip.prTitleContains || '') + '"* ]]; then\n' +
               '    SHOULD_RUN="false"\n' +
               '    SKIP_REASON="Skipping due to PR title containing skip marker"\n' +
               '  fi\n' +
               'fi\n\n' +
               '# Output the result\n' +
               'echo "should-run=$SHOULD_RUN" >> $GITHUB_OUTPUT\n' +
               'echo "$SKIP_REASON"\n\n' +
               'if [ "$SHOULD_RUN" == "true" ]; then\n' +
               '  echo "⏩ Workflow will proceed normally"\n' +
               'else\n' +
               '  echo "⏭️ Workflow will be skipped: $SKIP_REASON"\n' +
               'fi'
        }
      ]
    };

    // Add the check-skip job
    jobs['check-skip'] = checkSkipJob;
    
    // Make test job depend on check-skip job and use its output
    testJob.needs = ['check-skip'];
    testJob.if = '${{ needs.check-skip.outputs.should-run == \'true\' }}';
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