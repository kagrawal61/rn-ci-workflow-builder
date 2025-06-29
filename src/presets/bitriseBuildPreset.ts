import { WorkflowOptions, BitriseConfig, BitriseStep, BitriseWorkflow } from '../types';
import { BuildOptions } from './types';

export function buildBitriseBuildPipeline(opts: WorkflowOptions & { build?: BuildOptions }): BitriseConfig {
  const {
    triggers,
    env,
    packageManager = 'yarn',
    build = {
      platform: 'android',
      variant: 'release',
      storage: 'bitrise',
      notification: 'none',
      includeHealthCheck: true,
    },
  } = opts;

  // Build app-level environment variables
  const appEnvs: Array<Record<string, string>> = [];
  if (env) {
    Object.entries(env).forEach(([key, value]) => {
      appEnvs.push({ [key]: value });
    });
  }

  // Common setup steps
  const setupSteps: BitriseStep[] = [
    {
      'git-clone@8': {}
    },
    {
      'script@1': {
        title: 'Install Dependencies',
        inputs: [
          { content: packageManager === 'yarn' 
            ? 'yarn install --immutable' 
            : 'npm ci' }
        ]
      }
    }
  ];

  // Health check steps (optional)
  const healthCheckSteps: BitriseStep[] = build.includeHealthCheck ? [
    {
      'script@1': {
        title: 'TypeScript Check',
        inputs: [
          { content: packageManager === 'yarn' 
            ? 'yarn tsc --noEmit' 
            : 'npm run tsc -- --noEmit' }
        ]
      }
    },
    {
      'script@1': {
        title: 'ESLint',
        inputs: [
          { content: packageManager === 'yarn' 
            ? 'yarn lint' 
            : 'npm run lint' }
        ]
      }
    },
    {
      'script@1': {
        title: 'Unit Tests',
        inputs: [
          { content: packageManager === 'yarn' 
            ? 'yarn test --ci' 
            : 'npm test -- --ci' }
        ]
      }
    }
  ] : [];

  // Platform-specific build steps
  const workflows: Record<string, BitriseWorkflow> = {};

  if (build.platform === 'android' || build.platform === 'both') {
    const androidSteps = [
      ...setupSteps,
      ...healthCheckSteps,
      {
        'script@1': {
          title: 'Bundle React Native',
          inputs: [
            { content: 'npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res' }
          ]
        }
      },
      {
        'gradle-runner@2': {
          title: 'Build Android',
          inputs: {
            gradle_task: (build as BuildOptions).androidOutputType === 'aab' 
              ? 'bundleRelease' 
              : (build as BuildOptions).androidOutputType === 'both'
              ? 'assembleRelease bundleRelease'
              : 'assembleRelease',
            gradlew_path: './android/gradlew'
          }
        }
      }
    ];

    // Add code signing if needed
    if (build.variant === 'release') {
      androidSteps.push({
        'sign-apk@1': {
          title: 'Sign APK',
          inputs: {
            android_app: '$BITRISE_APK_PATH'
          }
        }
      });
    }

    // Add deployment step
    androidSteps.push({
      'deploy-to-bitrise-io@2': {
        title: 'Deploy to Bitrise.io',
        inputs: {
          notify_user_groups: 'everyone'
        }
      }
    });

    workflows.android = {
      title: 'Build Android',
      description: 'Build React Native Android app',
      steps: androidSteps
    };
  }

  if (build.platform === 'ios' || build.platform === 'both') {
    const iosSteps = [
      ...setupSteps,
      ...healthCheckSteps,
      {
        'cocoapods-install@2': {
          title: 'Install CocoaPods',
          inputs: {
            source_root_path: './ios'
          }
        }
      },
      {
        'script@1': {
          title: 'Bundle React Native',
          inputs: [
            { content: 'npx react-native bundle --platform ios --dev false --entry-file index.js --bundle-output ios/main.jsbundle --assets-dest ios' }
          ]
        }
      },
      {
        'xcode-archive@4': {
          title: 'Build iOS',
          inputs: {
            project_path: './ios/*.xcworkspace',
            scheme: '$BITRISE_SCHEME',
            export_method: build.variant === 'release' ? 'app-store' : 'development'
          }
        }
      },
      {
        'deploy-to-bitrise-io@2': {
          title: 'Deploy to Bitrise.io',
          inputs: {
            notify_user_groups: 'everyone'
          }
        }
      }
    ];

    workflows.ios = {
      title: 'Build iOS',
      description: 'Build React Native iOS app',
      steps: iosSteps
    };
  }

  // If building for both platforms, create a combined workflow
  if (build.platform === 'both') {
    workflows.build = {
      title: 'Build Both Platforms',
      description: 'Build React Native app for both Android and iOS',
      steps: [],
      before_run: ['android', 'ios']
    };
  }

  // Build trigger map
  const triggerMap = [];
  const primaryWorkflow = build.platform === 'both' ? 'build' : build.platform;
  
  if (triggers?.push?.branches) {
    triggers.push.branches.forEach(branch => {
      triggerMap.push({
        push_branch: branch,
        workflow: primaryWorkflow
      });
    });
  } else {
    triggerMap.push({
      push_branch: 'main',
      workflow: primaryWorkflow
    });
  }

  if (triggers?.pullRequest?.branches) {
    triggers.pullRequest.branches.forEach(branch => {
      triggerMap.push({
        pull_request_target_branch: branch,
        workflow: primaryWorkflow
      });
    });
  } else {
    triggerMap.push({
      pull_request_target_branch: 'main',
      workflow: primaryWorkflow
    });
  }

  return {
    format_version: 11,
    default_step_lib_source: 'https://github.com/bitrise-io/bitrise-steplib.git',
    project_type: 'react-native',
    app: {
      envs: appEnvs.length > 0 ? appEnvs : undefined
    },
    workflows,
    trigger_map: triggerMap
  };
} 