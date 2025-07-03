import { WorkflowOptions, GitHubJob } from '../types';
import { buildTriggers, buildEnv } from '../helpers';
import { BuildOptions } from './types';
import commonSteps from '../helpers/steps';
import platformHelpers from '../helpers/platforms';
import storageHelpers from '../helpers/storage';
import notificationHelpers from '../helpers/notifications';
// Import iOS implementation utilities for future use
// import { createIOSBuildJob, setupIOSJobDependencies } from './iosImplementation';

/**
 * Build workflow preset for PR/branch builds
 * 
 * Creates GitHub Actions workflow configurations for React Native app builds
 * with support for Android and quality checks.
 * 
 * @param opts Workflow generator options including platform, variant and notification settings
 * @returns Complete GitHub workflow configuration
 */
export function buildBuildPipeline(
  opts: WorkflowOptions & { build?: BuildOptions }
) {
  const {
    triggers,
    env,
    secrets,
    cache = { enabled: true },
    runsOn = 'ubuntu-latest',
    nodeVersions = [20],
    packageManager = 'yarn',
    build = {
      platform: 'android',
      variant: 'release',
      storage: 'github',
      notification: 'pr-comment',
      includeStaticAnalysis: true,
    },
  } = opts;

  // Jobs collection
  const jobs: Record<string, GitHubJob> = {};

  // Create common setup steps using helper
  const setupSteps = commonSteps.createSetupSteps(packageManager, cache);

  // Common build parameters for both iOS and Android
  const buildParams = `--variant ${build.variant}`;

  // Android build steps
  if (build.platform === 'android' || build.platform === 'both') {
    // Create base Android build steps
    let androidBuildSteps = platformHelpers.createAndroidBuildSteps(
      setupSteps,
      packageManager,
      buildParams,
      build
    );

    // Add storage-specific steps
    const storageSteps = storageHelpers.createAndroidStorageSteps(build);
    androidBuildSteps = [...androidBuildSteps, ...storageSteps];

    // Add notification steps
    const notificationSteps =
      notificationHelpers.createAndroidNotificationSteps(build);
    androidBuildSteps = [...androidBuildSteps, ...notificationSteps];

    // Add the Android build job
    jobs['build-android'] = {
      name: 'Build Android',
      'runs-on': runsOn,
      steps: androidBuildSteps,
    };
  }

  // iOS build support is coming soon
  // The implementation has been moved to iosImplementation.ts
  // When iOS support is ready, uncomment the import at the top of this file
  // and add the following code:
  //
  // if (build.platform === 'ios' || build.platform === 'both') {
  //   const iosJobs = createIOSBuildJob(opts, setupSteps, buildParams);
  //   jobs = { ...jobs, ...iosJobs };
  // }

  // Determine if static analysis should be included
  const includeStaticAnalysis = build.includeStaticAnalysis !== undefined 
    ? build.includeStaticAnalysis 
    : build.includeHealthCheck;
  
  // Add quality check job if static analysis is included
  if (includeStaticAnalysis) {
    // Create a separate job for static analysis checks to avoid duplication
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
        {
          name: 'TypeScript',
          run:
            packageManager === 'yarn'
              ? 'yarn tsc --noEmit'
              : 'npm run tsc -- --noEmit',
        },
        {
          name: 'ESLint',
          run: packageManager === 'yarn' ? 'yarn lint' : 'npm run lint',
        },
        {
          name: 'Prettier',
          run:
            packageManager === 'yarn'
              ? 'yarn format:check'
              : 'npm run format:check',
        },
        {
          name: 'Unit tests',
          run:
            packageManager === 'yarn' ? 'yarn test --ci' : 'npm test -- --ci',
        },
      ],
    };
  }

  // Set up dependencies between jobs
  if (includeStaticAnalysis) {
    // Build jobs depend on quality check
    // iOS job dependencies will be handled by setupIOSJobDependencies when iOS support is ready
    if (build.platform === 'android' || build.platform === 'both' || build.platform === 'ios') {
      jobs['build-android'].needs = ['quality-check'];
    }
  }

  /**
   * Add explicit GitHub workflow permissions when PR comments are enabled
   * 
   * GitHub Actions uses a least-privilege approach for workflow token permissions.
   * When commenting on PRs, the workflow requires specific permissions:
   * - contents:read - For accessing repository contents
   * - pull-requests:write - For adding/updating comments on PRs
   * - issues:write - For interacting with issues (some PR operations require this)
   */
  const permissions = build.notification === 'pr-comment' || build.notification === 'both'
    ? {
        contents: 'read',
        'pull-requests': 'write',
        issues: 'write',
      } as const
    : undefined;

  return {
    name:
      opts.name ??
      `React Native ${build.platform === 'both' ? 'App' : build.platform} Build`,
    on: buildTriggers(triggers),
    env: buildEnv(env, secrets),
    permissions,
    jobs,
  };
}
