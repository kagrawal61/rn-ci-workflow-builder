import { buildEnv, buildTriggers, cacheSteps } from '../helpers';
import notificationHelpers from '../helpers/notifications';
import platformHelpers from '../helpers/platforms';
import { buildStaticAnalysisSteps } from '../helpers/steps';
import storageHelpers from '../helpers/storage';
import {
  GitHubJob,
  GitHubStep,
  GitHubWorkflow,
  WorkflowOptions,
} from '../types';

// Types moved to src/presets/types.ts

/**
 * Build workflow preset for PR/branch builds
 */
export function buildBuildPipeline(opts: WorkflowOptions): GitHubWorkflow {
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
      androidOutputType: 'apk',
    },
  } = opts;

  // Add required secrets for build storage
  const requiredSecrets = [...(secrets || [])];

  // Add required secrets for notifications
  if (build.notification === 'slack' || build.notification === 'both') {
    if (!requiredSecrets.includes('SLACK_WEBHOOK_URL')) {
      requiredSecrets.push('SLACK_WEBHOOK_URL');
    }
  }
  if (build.notification === 'pr-comment' || build.notification === 'both') {
    if (!requiredSecrets.includes('GITHUB_TOKEN')) {
      requiredSecrets.push('GITHUB_TOKEN');
    }
  }

  // Add required secrets for storage
  if (build.storage === 'drive' || build.storage === 's3') {
    if (!requiredSecrets.includes('RCLONE_CONFIG')) {
      requiredSecrets.push('RCLONE_CONFIG');
    }
  }

  if (build.storage === 'firebase') {
    if (!requiredSecrets.includes('FIREBASE_APP_ID')) {
      requiredSecrets.push('FIREBASE_APP_ID');
    }
    if (!requiredSecrets.includes('FIREBASE_TOKEN')) {
      requiredSecrets.push('FIREBASE_TOKEN');
    }
  }

  // Jobs collection
  const jobs: Record<string, GitHubJob> = {};

  // Add static analysis job if static analysis is included
  if (build.includeStaticAnalysis) {
    // Create a separate job for static analysis to avoid duplication
    const staticAnalysisSteps = buildStaticAnalysisSteps(
      packageManager,
      nodeVersions[0] || 20,
      cache,
      opts.staticAnalysis
    );

    const staticAnalysisJob: GitHubJob = {
      name: 'Run Static Analysis',
      'runs-on': runsOn,
      steps: staticAnalysisSteps,
    };

    jobs.static_analysis = staticAnalysisJob;
  }

  // Create common setup steps
  const setupSteps: GitHubStep[] = [
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

  // Helper function to create a build job
  const createBuildJob = (platform: 'android' | 'ios'): GitHubJob => {
    const jobRunsOn = platform === 'ios' ? 'macos-latest' : runsOn;
    const buildJob: GitHubJob = {
      name: `Build ${platform.charAt(0).toUpperCase()}${platform.slice(1)} ${build.variant?.charAt(0).toUpperCase()}${build.variant?.slice(1)}`,
      'runs-on': jobRunsOn,
      steps: [],
    };

    // Add dependency on static analysis job if it exists
    if (build.includeStaticAnalysis) {
      buildJob.needs = ['static_analysis'];
    }

    // Add platform-specific build steps
    if (platform === 'android') {
      buildJob.steps = platformHelpers.createAndroidBuildSteps(
        setupSteps,
        packageManager,
        '',
        build
      );
    } else if (platform === 'ios') {
      buildJob.steps = platformHelpers.createIOSBuildSteps(
        setupSteps,
        packageManager,
        '',
        build
      );
    }

    // Add storage steps if configured
    if (build.storage) {
      const storageSteps =
        platform === 'android'
          ? storageHelpers.createAndroidStorageSteps(build)
          : storageHelpers.createIOSStorageSteps(build);
      buildJob.steps.push(...storageSteps);
    }

    // Add notification steps if configured
    if (build.notification && build.notification !== 'none') {
      const notificationSteps =
        platform === 'android'
          ? notificationHelpers.createAndroidNotificationSteps(build)
          : notificationHelpers.createIOSNotificationSteps(build);
      buildJob.steps.push(...notificationSteps);
    }

    return buildJob;
  };

  // Create build jobs based on platform
  if (build.platform === 'both') {
    jobs['build-android'] = createBuildJob('android');
    jobs['build-ios'] = createBuildJob('ios');
  } else if (build.platform === 'android') {
    jobs['build-android'] = createBuildJob('android');
  } else if (build.platform === 'ios') {
    jobs['build-ios'] = createBuildJob('ios');
  } else {
    // Fallback for other platforms - create a generic build job
    const platformName = build.platform || 'unknown';
    const variantName = build.variant || 'debug';
    const buildJob: GitHubJob = {
      name: `Build ${platformName.charAt(0).toUpperCase()}${platformName.slice(1)} ${variantName.charAt(0).toUpperCase()}${variantName.slice(1)}`,
      'runs-on': runsOn,
      steps: setupSteps,
    };

    if (build.includeStaticAnalysis) {
      buildJob.needs = ['static_analysis'];
    }

    jobs.build = buildJob;
  }

  return {
    name: opts.name ?? 'Build Pipeline',
    on: buildTriggers(triggers),
    env: buildEnv(env, requiredSecrets),
    jobs,
  };
}
