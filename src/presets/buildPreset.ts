import { WorkflowOptions, GitHubJob } from '../types';
import { buildTriggers, buildEnv } from '../helpers';
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
    runsOn = 'ubuntu-latest',
    nodeVersions = [20],
    packageManager = 'yarn',
    build = {
      platform: 'android',
      variant: 'release',
      storage: 'github',
      notification: 'pr-comment',
      includeHealthCheck: true, // Will be renamed to includeStaticAnalysis in the future
    },
  } = opts;

  // Jobs collection
  const jobs: Record<string, GitHubJob> = {};

  // Create common setup steps using helper
  const setupSteps = commonSteps.createSetupSteps(packageManager, cache);
  
  // Get PR source detection step
  const determineBuildSourceStep = commonSteps.createSourceDetectionStep();

  // Common build parameters for both iOS and Android
  const buildParams = `--variant ${build.variant}`;

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

  // Set up dependencies between jobs
  if (build.includeHealthCheck) {
    // Build jobs depend on quality check
    if (build.platform === 'ios' || build.platform === 'both') {
      jobs['build-ios'].needs = ['quality-check'];
    }
    if (build.platform === 'android' || build.platform === 'both') {
      jobs['build-android'].needs = ['quality-check'];
    }
  }

  return {
    name: opts.name ?? `React Native ${build.platform === 'both' ? 'App' : build.platform} Build`,
    on: buildTriggers(triggers),
    env: buildEnv(env, secrets),
    jobs,
  };
}