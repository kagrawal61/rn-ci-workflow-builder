import { WorkflowOptions } from '../types';
import { BuildOptions } from './types';

export function buildCodemagicBuildPipeline(
  opts: WorkflowOptions
): Record<string, unknown> {
  const {
    triggers,
    nodeVersions = [20],
    packageManager = 'yarn',
    framework = 'react-native-cli',
    build = {
      platform: 'android',
      variant: 'release',
      androidOutputType: 'apk',
      storage: 'github',
      notification: 'none',
      includeStaticAnalysis: false,
    },
  } = opts;

  const nodeVersion = nodeVersions[0] ?? 20;
  const buildOpts = build as BuildOptions;
  const installCmd =
    packageManager === 'yarn' ? 'yarn install --immutable' : 'npm ci';

  // Build scripts
  const scripts: Array<Record<string, string>> = [
    { name: 'Install dependencies', script: installCmd },
  ];

  // Static analysis scripts
  if (buildOpts.includeStaticAnalysis) {
    scripts.push({
      name: 'TypeScript check',
      script:
        packageManager === 'yarn'
          ? 'yarn tsc --noEmit'
          : 'npm run tsc -- --noEmit',
    });
    scripts.push({
      name: 'ESLint',
      script: packageManager === 'yarn' ? 'yarn lint' : 'npm run lint',
    });
    scripts.push({
      name: 'Unit tests',
      script: packageManager === 'yarn' ? 'yarn test --ci' : 'npm test -- --ci',
    });
  }

  // Build scripts
  if (framework === 'expo') {
    scripts.push({ name: 'Install EAS CLI', script: 'npm install -g eas-cli' });
    const outputFlag =
      buildOpts.androidOutputType === 'aab' ? 'production' : 'production-apk';
    scripts.push({
      name: 'Build Android',
      script: `eas build --platform android --profile ${outputFlag} --local --non-interactive`,
    });
  } else {
    scripts.push({
      name: 'Make gradlew executable',
      script: 'chmod +x android/gradlew',
    });

    const variant = buildOpts.variant ?? 'release';
    const outputType = buildOpts.androidOutputType ?? 'apk';

    if (outputType === 'both') {
      const apkTask = variant === 'debug' ? 'assembleDebug' : 'assembleRelease';
      const aabTask = variant === 'debug' ? 'bundleDebug' : 'bundleRelease';
      scripts.push({
        name: 'Build Android',
        script: `cd android && ./gradlew ${apkTask} ${aabTask} && cd ..`,
      });
    } else if (outputType === 'aab') {
      const task = variant === 'debug' ? 'bundleDebug' : 'bundleRelease';
      scripts.push({
        name: 'Build Android',
        script: `cd android && ./gradlew ${task} && cd ..`,
      });
    } else {
      const task = variant === 'debug' ? 'assembleDebug' : 'assembleRelease';
      scripts.push({
        name: 'Build Android',
        script: `cd android && ./gradlew ${task} && cd ..`,
      });
    }
  }

  // Artifact paths
  const artifactPaths: string[] = [];
  const outputType = buildOpts.androidOutputType ?? 'apk';
  if (framework === 'expo') {
    artifactPaths.push('expo-builds/**');
  } else {
    if (outputType === 'apk' || outputType === 'both') {
      artifactPaths.push('android/app/build/outputs/apk/**/*.apk');
    }
    if (outputType === 'aab' || outputType === 'both') {
      artifactPaths.push('android/app/build/outputs/bundle/**/*.aab');
    }
  }

  // Triggering
  const triggeringEvents: string[] = [];
  const branchPatterns: Array<Record<string, unknown>> = [];

  if (triggers?.push) {
    triggeringEvents.push('push');
    if (triggers.push.branches && triggers.push.branches.length > 0) {
      triggers.push.branches.forEach(branch => {
        branchPatterns.push({ pattern: branch, include: true });
      });
    }
  }

  if (triggers?.pullRequest) {
    triggeringEvents.push('pull_request');
  }

  if (triggeringEvents.length === 0) {
    triggeringEvents.push('push');
    branchPatterns.push({ pattern: 'main', include: true });
  }

  const triggering: Record<string, unknown> = {
    events: triggeringEvents,
    ...(branchPatterns.length > 0 ? { branch_patterns: branchPatterns } : {}),
  };

  // Publishing
  const publishing: Record<string, unknown> = {};
  if (buildOpts.notification === 'slack' || buildOpts.notification === 'both') {
    publishing.slack = {
      channel: '#builds',
      notify_on_build_start: true,
      notify: { success: true, failure: true },
    };
  }

  const workflow: Record<string, unknown> = {
    name: opts.name ?? 'Build Android',
    instance_type: 'linux_x2',
    environment: {
      node: nodeVersion,
    },
    triggering,
    cache: {
      cache_paths: ['$CM_BUILD_DIR/node_modules'],
    },
    scripts,
    artifacts: artifactPaths,
    ...(Object.keys(publishing).length > 0 ? { publishing } : {}),
  };

  return {
    workflows: {
      'build-android': workflow,
    },
  };
}
