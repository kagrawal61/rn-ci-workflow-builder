import { WorkflowOptions } from '../types';
import { BuildOptions } from './types';

export function buildCircleCIBuildPipeline(
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

  // Build job steps
  const steps: Array<string | Record<string, unknown>> = ['checkout'];

  // Install dependencies
  steps.push({
    'node/install-packages': {
      'pkg-manager': packageManager,
    },
  });

  // Static analysis steps
  if (buildOpts.includeStaticAnalysis) {
    steps.push({
      run: {
        name: 'TypeScript',
        command:
          packageManager === 'yarn'
            ? 'yarn tsc --noEmit'
            : 'npm run tsc -- --noEmit',
      },
    });
    steps.push({
      run: {
        name: 'ESLint',
        command:
          packageManager === 'yarn' ? 'yarn lint' : 'npm run lint',
      },
    });
    steps.push({
      run: {
        name: 'Unit Tests',
        command:
          packageManager === 'yarn' ? 'yarn test --ci' : 'npm test -- --ci',
      },
    });
  }

  // Build step
  if (framework === 'expo') {
    steps.push({
      run: {
        name: 'Install EAS CLI',
        command: 'npm install -g eas-cli',
      },
    });
    const outputFlag =
      buildOpts.androidOutputType === 'aab' ? 'production' : 'production-apk';
    steps.push({
      run: {
        name: 'Build Android',
        command: `eas build --platform android --profile ${outputFlag} --local --non-interactive`,
      },
    });
  } else {
    steps.push({
      run: {
        name: 'Make gradlew executable',
        command: 'chmod +x android/gradlew',
      },
    });

    const variant = buildOpts.variant ?? 'release';
    const outputType = buildOpts.androidOutputType ?? 'apk';
    let gradleTask: string;

    if (outputType === 'both') {
      const apkTask =
        variant === 'debug' ? 'assembleDebug' : 'assembleRelease';
      const aabTask = variant === 'debug' ? 'bundleDebug' : 'bundleRelease';
      gradleTask = `${apkTask} ${aabTask}`;
    } else if (outputType === 'aab') {
      gradleTask = variant === 'debug' ? 'bundleDebug' : 'bundleRelease';
    } else {
      gradleTask = variant === 'debug' ? 'assembleDebug' : 'assembleRelease';
    }

    steps.push({
      run: {
        name: 'Build Android',
        command: `cd android && ./gradlew ${gradleTask} && cd ..`,
        'no_output_timeout': '30m',
      },
    });
  }

  // Store artifacts
  const artifactPaths: string[] = [];
  const outputType = buildOpts.androidOutputType ?? 'apk';
  if (framework === 'expo') {
    artifactPaths.push('expo-builds/');
  } else {
    if (outputType === 'apk' || outputType === 'both') {
      artifactPaths.push('android/app/build/outputs/apk');
    }
    if (outputType === 'aab' || outputType === 'both') {
      artifactPaths.push('android/app/build/outputs/bundle');
    }
  }

  steps.push({
    store_artifacts: {
      path: artifactPaths.length === 1 ? artifactPaths[0] : artifactPaths,
    },
  });

  // Slack notification
  const orbs: Record<string, string> = { node: 'circleci/node@5' };
  if (
    buildOpts.notification === 'slack' ||
    buildOpts.notification === 'both'
  ) {
    orbs.slack = 'circleci/slack@4';
    steps.push({
      'slack/notify': {
        event: 'always',
        template: 'basic_success_1',
      },
    });
  }

  // Branch filters
  const branchFilter: Record<string, unknown> = {};
  if (triggers?.push?.branches && triggers.push.branches.length > 0) {
    branchFilter.only = triggers.push.branches;
  }
  const jobFilters =
    Object.keys(branchFilter).length > 0
      ? { filters: { branches: branchFilter } }
      : {};

  return {
    version: 2.1,
    orbs,
    jobs: {
      build: {
        docker: [{ image: `cimg/android:2024.01` }],
        environment: {
          NODE_VERSION: String(nodeVersion),
        },
        steps,
      },
    },
    workflows: {
      build: {
        jobs: [{ build: jobFilters }],
      },
    },
  };
}
