import { WorkflowOptions, GitHubJob } from '../types';
import { buildTriggers, buildEnv, buildSkipCondition } from '../helpers';
import { BuildOptions } from './types';
import commonSteps from '../helpers/steps';
import platformHelpers from '../helpers/platforms';
import storageHelpers from '../helpers/storage';
import notificationHelpers from '../helpers/notifications';

// Types moved to src/presets/types.ts

/**
 * Build workflow preset for PR/branch builds
 */
export function buildBuildPipeline(opts: WorkflowOptions & { build?: BuildOptions }) {
  const {
    triggers,
    env,
    secrets,
    cache = { enabled: true },
    skip = { commitMessageContains: '[skip ci]' },
    runsOn = 'ubuntu-latest',
    nodeVersions = [20],
    packageManager = 'yarn',
    build = {
      platform: 'android',
      flavor: 'develop',
      variant: 'debug',
      storage: 'github',
      notification: 'pr-comment',
      includeHealthCheck: true,
    },
  } = opts;

  // Jobs collection
  const jobs: Record<string, GitHubJob> = {};

  // Create common setup steps using helper
  const setupSteps = commonSteps.createSetupSteps(packageManager, cache, build);
  
  // Get PR source detection step
  const determineBuildSourceStep = commonSteps.createSourceDetectionStep();

  // Common build parameters for both iOS and Android
  const buildParams = `--flavor ${build.flavor} --variant ${build.variant}`;

  // Android build steps
  if (build.platform === 'android' || build.platform === 'both') {
    // Create base Android build steps
    let androidBuildSteps = platformHelpers.createAndroidBuildSteps(
      setupSteps,
      determineBuildSourceStep,
      packageManager,
      buildParams,
      build
    );

    // Add storage-specific steps
    const storageSteps = storageHelpers.createAndroidStorageSteps(build);
    androidBuildSteps = [...androidBuildSteps, ...storageSteps];
    
    // Add notification steps
    const notificationSteps = notificationHelpers.createAndroidNotificationSteps(build);
    androidBuildSteps = [...androidBuildSteps, ...notificationSteps];

    // Add the Android build job
    jobs['build-android'] = {
      name: 'Build Android',
      'runs-on': runsOn,
      steps: androidBuildSteps,
    };
  }

  // iOS build steps
  if (build.platform === 'ios' || build.platform === 'both') {
    // Create base iOS build steps
    let iosBuildSteps = platformHelpers.createIOSBuildSteps(
      setupSteps,
      determineBuildSourceStep,
      packageManager,
      buildParams,
      build
    );
    
    // Add storage-specific steps
    const storageSteps = storageHelpers.createIOSStorageSteps(build);
    iosBuildSteps = [...iosBuildSteps, ...storageSteps];
    
    // Add notification steps
    const notificationSteps = notificationHelpers.createIOSNotificationSteps(build);
    iosBuildSteps = [...iosBuildSteps, ...notificationSteps];

    // Add the iOS build job
    jobs['build-ios'] = {
      name: 'Build iOS',
      'runs-on': 'macos-latest', // iOS builds require macOS
      steps: iosBuildSteps,
    };
  }

  // Add quality check job if health checks are included 
  if (build.includeHealthCheck) {
    // Create a separate job for health checks to avoid duplication
    jobs['quality-check'] = {
      name: 'Quality Checks',
      'runs-on': runsOn,
      steps: [
        { name: 'Checkout', uses: 'actions/checkout@v4' },
        {
          name: 'Setup Node',
          uses: 'actions/setup-node@v4',
          with: {
            'node-version': nodeVersions[0] || 20,
            cache: packageManager === 'yarn' ? 'yarn' : 'npm',
          },
        },
        packageManager === 'yarn'
          ? { name: 'Install', run: 'yarn install --immutable' }
          : { name: 'Install', run: 'npm ci' },
        { name: 'TypeScript', run: packageManager === 'yarn' ? 'yarn tsc --noEmit' : 'npm run tsc -- --noEmit' },
        { name: 'ESLint', run: packageManager === 'yarn' ? 'yarn lint' : 'npm run lint' },
        { name: 'Prettier', run: packageManager === 'yarn' ? 'yarn format:check' : 'npm run format:check' },
        { name: 'Unit tests', run: packageManager === 'yarn' ? 'yarn test --ci' : 'npm test -- --ci' },
      ]
    };
  }

  // Conditionally add skip check job if skip configuration is provided
  if (skip && (skip.commitMessageContains || skip.prTitleContains || skip.prLabel)) {
    // Create a dedicated skip check job with clear outputs
    const checkSkipJob: GitHubJob = {
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
    
    // Set up dependencies between jobs
    if (build.includeHealthCheck) {
      // Quality check depends on skip check
      jobs['quality-check'].needs = ['check-skip'];
      jobs['quality-check'].if = '${{ needs.check-skip.outputs.should-run == \'true\' }}';
      
      // Build jobs depend on quality check
      if (build.platform === 'ios' || build.platform === 'both') {
        jobs['build-ios'].needs = ['quality-check'];
      }
      if (build.platform === 'android' || build.platform === 'both') {
        jobs['build-android'].needs = ['quality-check'];
      }
    } else {
      // Without quality check, build jobs depend directly on skip check
      if (build.platform === 'ios' || build.platform === 'both') {
        jobs['build-ios'].needs = ['check-skip'];
        jobs['build-ios'].if = '${{ needs.check-skip.outputs.should-run == \'true\' }}';
      }
      if (build.platform === 'android' || build.platform === 'both') {
        jobs['build-android'].needs = ['check-skip'];
        jobs['build-android'].if = '${{ needs.check-skip.outputs.should-run == \'true\' }}';
      }
    }
  } else {
    // Without skip check, set up job dependencies based on health check setting
    if (build.includeHealthCheck) {
      // Build jobs depend on quality check
      if (build.platform === 'ios' || build.platform === 'both') {
        jobs['build-ios'].needs = ['quality-check'];
      }
      if (build.platform === 'android' || build.platform === 'both') {
        jobs['build-android'].needs = ['quality-check'];
      }
      
      // Apply skip condition directly to quality check job if needed
      const skipCondition = buildSkipCondition(skip);
      if (skipCondition) {
        jobs['quality-check'].if = skipCondition;
      }
    } else {
      // Apply skip condition directly to build jobs if needed
      const skipCondition = buildSkipCondition(skip);
      if (skipCondition) {
        if (build.platform === 'ios' || build.platform === 'both') {
          jobs['build-ios'].if = skipCondition;
        }
        if (build.platform === 'android' || build.platform === 'both') {
          jobs['build-android'].if = skipCondition;
        }
      }
    }
  }

  return {
    name: opts.name ?? `React Native ${build.platform === 'both' ? 'App' : build.platform} Build`,
    on: buildTriggers(triggers),
    env: buildEnv(env, secrets),
    jobs,
  };
}