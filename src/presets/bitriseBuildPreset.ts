import {
  BitriseConfig,
  BitriseStep,
  BitriseWorkflow,
  WorkflowOptions,
} from '../types';
import { BuildOptions } from './types';

// Helper function to generate Android build script content
function generateAndroidBuildScript(
  variant: string,
  outputType: string
): string {
  const isDebug = variant === 'debug';

  // Common script parts
  const commonHeader = `#!/usr/bin/env bash
set -euo pipefail

# Check for required directories and files
echo "🔍 Verifying Android project setup..."

if [ ! -d "android" ]; then
  echo "❌ Error: Android directory not found"
  echo "Make sure you're running this workflow from the root"
  echo "of a React Native project"
  exit 1
fi

if [ ! -f "android/gradlew" ]; then
  echo "⚠️ Warning: Gradle wrapper not found at android/gradlew"
  echo "Build may fail if Gradle wrapper is not properly set up"
fi

echo "✅ Android environment looks good"

# Make gradlew executable
chmod +x android/gradlew

echo "🚀 Starting Android build for ${variant}..."`;

  // Different script parts based on output type
  if (outputType === 'both') {
    // For both APK and AAB
    const apkTask = isDebug ? 'assembleDebug' : 'assembleRelease';
    const aabTask = isDebug ? 'bundleDebug' : 'bundleRelease';

    return `${commonHeader}

# Generating both APK and AAB formats
echo "Generating both APK and AAB formats for ${variant} build"

# First generate APK
echo "Using Gradle task: ${apkTask} for ${variant} build with APK output format"

cd android
./gradlew ${apkTask} || {
  echo "❌ Android APK build failed"
  exit 1
}

# Then generate AAB
echo "Using Gradle task: ${aabTask} for ${variant} build with AAB output format"
./gradlew ${aabTask} || {
  echo "❌ Android AAB build failed"
  exit 1
}

cd ..

echo "✅ Android build completed successfully"

# Check for both APK and AAB files
if ls android/app/build/outputs/apk/**/*.apk 1> /dev/null 2>&1; then
  echo "✅ APK files generated successfully"
else
  echo "⚠️ Warning: Expected APK files not found. Storage steps may fail."
fi

if ls android/app/build/outputs/bundle/**/*.aab 1> /dev/null 2>&1; then
  echo "✅ AAB files generated successfully"
else
  echo "⚠️ Warning: Expected AAB files not found. Storage steps may fail."
fi`;
  } else if (outputType === 'apk') {
    // For APK only
    const task = isDebug ? 'assembleDebug' : 'assembleRelease';

    return `${commonHeader}

# Building APK
echo "Using Gradle task: ${task} for ${variant} build with APK output format"

cd android
./gradlew ${task} || {
  echo "❌ Android build failed"
  exit 1
}

cd ..

echo "✅ Android build completed successfully"

# Verify the expected outputs
if ls android/app/build/outputs/apk/**/*.apk 1> /dev/null 2>&1; then
  echo "✅ APK files generated successfully"
else
  echo "⚠️ Warning: Expected APK files not found. Storage steps may fail."
fi`;
  } else {
    // For AAB only
    const task = isDebug ? 'bundleDebug' : 'bundleRelease';

    return `${commonHeader}

# Building AAB
echo "Using Gradle task: ${task} for ${variant} build with AAB output format"

cd android
./gradlew ${task} || {
  echo "❌ Android build failed"
  exit 1
}

cd ..

echo "✅ Android build completed successfully"

# Verify the expected outputs
if ls android/app/build/outputs/bundle/**/*.aab 1> /dev/null 2>&1; then
  echo "✅ AAB files generated successfully"
else
  echo "⚠️ Warning: Expected AAB files not found. Storage steps may fail."
fi`;
  }
}

// Helper function to generate Expo build script content
function generateExpoBuildScript(platform: string, outputType: string): string {
  const isAndroid = platform === 'android' || platform === 'both';

  return `#!/usr/bin/env bash
set -euo pipefail

# Check for required environment
echo "🔍 Verifying Expo environment..."

# Check for app.json or app.config.js
if [ ! -f "app.json" ] && [ ! -f "app.config.js" ] && [ ! -f "app.config.ts" ]; then
  echo "⚠️ Warning: No app.json, app.config.js, or app.config.ts found"
  echo "Make sure this is an Expo project"
fi

# Install EAS CLI
echo "📦 Installing EAS CLI..."
npm install -g eas-cli
echo "✅ EAS CLI installed:"
eas --version

# Set up output directory
echo "📁 Creating output directories..."
mkdir -p ./expo-builds

# Running EAS build
echo "🚀 Starting Expo build for ${platform}..."

# Build based on platform
${(() => {
  if (isAndroid) {
    if (outputType === 'apk' || outputType === 'both') {
      return `
# Build Android APK
echo "Building Android APK using EAS..."
eas build --platform android --profile production-apk --local --non-interactive --output=./expo-builds/app-production.apk || {
  echo "❌ Android APK build failed"
  exit 1
}
echo "✅ Android APK build completed"`;
    } else if (outputType === 'aab') {
      return `
# Build Android App Bundle
echo "Building Android AAB using EAS..."
eas build --platform android --profile production --local --non-interactive --output=./expo-builds/app-production.aab || {
  echo "❌ Android AAB build failed"
  exit 1
}
echo "✅ Android AAB build completed"`;
    } else {
      return `
# Build both Android APK and AAB
echo "Building Android APK using EAS..."
eas build --platform android --profile production-apk --local --non-interactive --output=./expo-builds/app-production.apk || {
  echo "❌ Android APK build failed"
  exit 1
}

echo "Building Android AAB using EAS..."
eas build --platform android --profile production --local --non-interactive --output=./expo-builds/app-production.aab || {
  echo "❌ Android AAB build failed"
  exit 1
}
echo "✅ Android builds completed"`;
    }
  } else {
    return `
# Build iOS IPA
echo "Building iOS IPA using EAS..."
eas build --platform ios --profile production --local --non-interactive --output=./expo-builds/app-production.ipa || {
  echo "❌ iOS build failed"
  exit 1
}
echo "✅ iOS build completed"`;
  }
})()}

# Verify build outputs exist
${
  isAndroid
    ? `
# Verify Android build outputs
${
  outputType === 'apk' || outputType === 'both'
    ? `
if [ -f "./expo-builds/app-production.apk" ]; then
  echo "✅ APK file generated successfully"
else
  echo "❌ Expected APK file not found. Build may have failed."
  exit 1
fi`
    : ''
}

${
  outputType === 'aab' || outputType === 'both'
    ? `
if [ -f "./expo-builds/app-production.aab" ]; then
  echo "✅ AAB file generated successfully"
else
  echo "❌ Expected AAB file not found. Build may have failed."
  exit 1
fi`
    : ''
}
`
    : `
# Verify iOS build output
if [ -f "./expo-builds/app-production.ipa" ]; then
  echo "✅ IPA file generated successfully"
else
  echo "❌ Expected IPA file not found. Build may have failed."
  exit 1
fi`
}

echo "✅ All Expo builds completed successfully"`;
}

// Helper function to generate iOS build script content
function generateIOSBuildScript(variant: string): string {
  const isDebug = variant === 'debug';
  const configuration = isDebug ? 'Debug' : 'Release';

  return `#!/usr/bin/env bash
set -euo pipefail

# Check for required directories and files
echo "🔍 Verifying iOS project setup..."

if [ ! -d "ios" ]; then
  echo "❌ Error: iOS directory not found"
  echo "Make sure you're running this workflow from the root"
  echo "of a React Native project"
  exit 1
fi

if [ ! -f "ios/Podfile" ]; then
  echo "⚠️ Warning: Podfile not found"
  echo "iOS build might fail without a valid Podfile"
fi

echo "✅ iOS environment looks good"

# Determine the configuration based on variant
CONFIGURATION="${configuration}"

echo "🚀 Starting iOS build with configuration: $CONFIGURATION..."

# Extract project name from xcworkspace directory
WORKSPACE_PATH=$(find ios -name "*.xcworkspace" -type d | head -n 1)
if [ -z "$WORKSPACE_PATH" ]; then
  echo "❌ No .xcworkspace found in ios directory"
  exit 1
fi

PROJECT_NAME=$(basename "$WORKSPACE_PATH" .xcworkspace)
echo "Detected project: $PROJECT_NAME"

# Build the iOS project using xcodebuild
echo "Building iOS project using native xcodebuild commands..."`;
}

// Helper function to generate notification steps for Bitrise
function generateBitriseNotificationSteps(
  build: BuildOptions,
  platform: string
): BitriseStep[] {
  const steps: BitriseStep[] = [];

  // Default Bitrise deployment step will already handle basic notifications
  // We'll add extra steps for Slack or other notification methods based on config

  if (build.notification === 'slack' || build.notification === 'both') {
    // Add Slack notification step
    steps.push({
      'slack@3': {
        title: `Send ${platform} Build Notification to Slack`,
        inputs: [
          { webhook_url: '$SLACK_WEBHOOK_URL' },
          { channel: '#builds' },
          {
            text: `${platform} ${build.variant} build completed on branch: $BITRISE_GIT_BRANCH`,
          },
          {
            buttons: `View Build Details|${platform === 'Android' ? '$BITRISE_PUBLIC_INSTALL_PAGE_URL' : '$BITRISE_PUBLIC_INSTALL_PAGE_URL_IOS'}`,
          },
          {
            pretext: `${platform} ${build.variant} Build Result`,
          },
          {
            fields: `Repository|$BITRISE_APP_TITLE
Branch|$BITRISE_GIT_BRANCH
Commit|$BITRISE_GIT_COMMIT
Build Time|$BITRISE_BUILD_DURATION`,
          },
        ],
        is_always_run: true,
      },
    });
  }

  // Add PR comment notification if configured
  if (build.notification === 'pr-comment' || build.notification === 'both') {
    steps.push({
      'comment-on-github-pull-request@0': {
        title: `Add ${platform} Build Comment to PR`,
        inputs: [
          {
            body: `## ${platform} ${build.variant} Build Results

✅ Build completed successfully!

### Download Details
📱 ${platform} ${build.variant} build is ready for testing.
🔗 Download URL: ${platform === 'Android' ? '$BITRISE_PUBLIC_INSTALL_PAGE_URL' : '$BITRISE_PUBLIC_INSTALL_PAGE_URL_IOS'}

### Build Information
- Repository: $BITRISE_APP_TITLE
- Branch: $BITRISE_GIT_BRANCH
- Commit: $BITRISE_GIT_COMMIT
- Build Time: $BITRISE_BUILD_DURATION

> Build generated via React Native CI Workflow Builder`,
          },
          { personal_access_token: '$GITHUB_TOKEN' },
        ],
        is_always_run: false,
        run_if: '.IsCI',
      },
    });
  }

  return steps;
}

export function buildBitriseBuildPipeline(
  opts: WorkflowOptions & { build?: BuildOptions }
): BitriseConfig {
  const {
    triggers,
    env,
    packageManager = 'yarn',
    nodeVersions = [20],
    framework = 'react-native-cli', // Default to React Native CLI if not specified
    build = {
      platform: 'android',
      variant: 'release',
      androidOutputType: 'apk',
      storage: 'bitrise',
      notification: 'pr-comment',
      includeStaticAnalysis: true,
    },
  } = opts;

  // Default environment variables
  const defaultEnvs: Array<Record<string, string>> = [
    { CI: 'true' },
    { NODE_OPTIONS: '--max_old_space_size=4096' },
    { YARN_ENABLE_IMMUTABLE_INSTALLS: '1' },
  ];

  // Add Expo-specific environment variables if using Expo
  if (framework === 'expo') {
    defaultEnvs.push({ NODE_OPTIONS: '--openssl-legacy-provider' });
  }

  // Build app-level environment variables
  const appEnvs: Array<Record<string, string>> = [...defaultEnvs];
  if (env) {
    Object.entries(env).forEach(([key, value]) => {
      appEnvs.push({ [key]: value });
    });
  }

  // Modern cache configuration steps
  const lockFileName =
    packageManager === 'yarn' ? 'yarn.lock' : 'package-lock.json';
  const cacheTitle = packageManager === 'yarn' ? 'yarn cache' : 'npm cache';

  const restoreCacheStep: BitriseStep = {
    'restore-cache@2': {
      title: `Restore ${cacheTitle}`,
      inputs: [
        {
          key: `{{ .OS }}-{{ .Arch }}-${packageManager}-cache-{{ checksum "${lockFileName}" }}`,
        },
      ],
    },
  };

  const saveCacheStep: BitriseStep = {
    'save-cache@1': {
      title: `Save ${cacheTitle}`,
      inputs: [
        {
          key: `{{ .OS }}-{{ .Arch }}-${packageManager}-cache-{{ checksum "${lockFileName}" }}`,
        },
        {
          paths: 'node_modules',
        },
      ],
    },
  };

  // Common setup steps
  const setupSteps: BitriseStep[] = [
    {
      'git-clone@8': {
        title: 'Git Clone',
      },
    },
    {
      'nvm@1': {
        title: `Setup Node.js ${nodeVersions[0]}`,
        inputs: [
          {
            node_version: `${nodeVersions[0]}`,
          },
        ],
      },
    },
    restoreCacheStep,
  ];

  // Dependency installation step
  const installStep: BitriseStep =
    packageManager === 'yarn'
      ? {
          'yarn@0': {
            inputs: [
              {
                args: '--immutable',
              },
            ],
          },
        }
      : {
          'script@1': {
            title: 'Install Dependencies',
            inputs: [
              {
                content: `#!/usr/bin/env bash
set -euo pipefail

npm ci`,
              },
            ],
          },
        };

  // Platform-specific configuration
  const androidMeta = {
    'bitrise.io': {
      stack: 'linux-docker-android-22.04',
      machine_type_id: 'elite',
    },
  };

  const iosMeta = {
    'bitrise.io': {
      stack: 'osx-xcode-15.3.x-ventura',
      machine_type_id: 'g2-m1.8core',
    },
  };

  // Static analysis steps (optional)
  const staticAnalysisSteps: BitriseStep[] = build.includeStaticAnalysis
    ? [
        {
          'script@1': {
            title: 'TypeScript Check',
            inputs: [
              {
                content: `#!/usr/bin/env bash
set -euo pipefail

${packageManager === 'yarn' ? 'yarn tsc --noEmit' : 'npm run tsc -- --noEmit'}`,
              },
            ],
          },
        },
        {
          'script@1': {
            title: 'ESLint',
            inputs: [
              {
                content: `#!/usr/bin/env bash
set -euo pipefail

${packageManager === 'yarn' ? 'yarn lint' : 'npm run lint'}`,
              },
            ],
          },
        },
        {
          'script@1': {
            title: 'Unit Tests',
            inputs: [
              {
                content: `#!/usr/bin/env bash
set -euo pipefail

${packageManager === 'yarn' ? 'yarn test --ci' : 'npm test -- --ci'}`,
              },
            ],
          },
        },
      ]
    : [];

  // Platform-specific build steps
  const workflows: Record<string, BitriseWorkflow> = {};

  if (build.platform === 'android' || build.platform === 'both') {
    // Determine if using Expo framework
    const isExpo = framework === 'expo';

    const androidSteps = [
      ...setupSteps,
      installStep,
      ...staticAnalysisSteps,
      {
        'script@1': {
          title: isExpo ? 'Build Expo Android App' : 'Build Android App',
          inputs: [
            {
              content: isExpo
                ? generateExpoBuildScript(
                    'android',
                    (build as BuildOptions).androidOutputType || 'apk'
                  )
                : generateAndroidBuildScript(
                    build.variant || 'release',
                    (build as BuildOptions).androidOutputType || 'apk'
                  ),
            },
          ],
        },
      },
    ];

    // Add code signing if needed
    if (build.variant === 'release') {
      androidSteps.push({
        'sign-apk@1': {
          title: 'Sign APK',
          inputs: [{ android_app: '$BITRISE_APK_PATH' }],
        },
      });
    }

    // Add deployment step for artifacts
    androidSteps.push({
      'deploy-to-bitrise-io@2': {
        title: 'Deploy to Bitrise.io',
        inputs: [
          { notify_user_groups: 'everyone' },
          // Enable public install page for builds when notifications are needed
          { is_enable_public_page: 'true' },
        ],
      },
    });

    // Add custom notification steps based on configuration
    const androidNotificationSteps = generateBitriseNotificationSteps(
      build,
      'Android'
    );
    androidSteps.push(...androidNotificationSteps);

    // Add cache push step as final step
    androidSteps.push(saveCacheStep);

    const workflowKey = 'rn-android-build';
    const workflowTitle = isExpo ? 'Build Expo Android' : 'Build Android';
    const workflowDescription = isExpo
      ? 'Build Expo Android app using EAS'
      : 'Build React Native Android app';

    workflows[workflowKey] = {
      title: workflowTitle,
      description: workflowDescription,
      steps: androidSteps,
      meta: androidMeta,
    };
  }

  if (build.platform === 'ios' || build.platform === 'both') {
    // Determine if using Expo framework
    const isExpo = framework === 'expo';

    // Base steps for iOS build
    const iosSteps = [...setupSteps, installStep, ...staticAnalysisSteps];

    // Add platform-specific build steps
    if (isExpo) {
      // For Expo, we use the EAS CLI
      iosSteps.push({
        'script@1': {
          title: 'Build Expo iOS App',
          inputs: [
            {
              content: generateExpoBuildScript('ios', ''),
            },
          ],
        },
      });
    } else {
      // For React Native CLI, we use the standard iOS build process
      iosSteps.push({
        'cocoapods-install@2': {
          title: 'Install CocoaPods',
          inputs: [{ source_root_path: './ios' }],
        },
      });

      iosSteps.push({
        'script@1': {
          title: 'Build iOS App',
          inputs: [
            {
              content: generateIOSBuildScript(build.variant || 'release'),
            },
          ],
        },
      });

      // Only add xcode-archive step for non-Expo projects
      iosSteps.push({
        'xcode-archive@4': {
          title: 'Build iOS',
          inputs: [
            { project_path: './ios/*.xcworkspace' },
            { scheme: '$BITRISE_SCHEME' },
            {
              export_method:
                build.variant === 'release' ? 'app-store' : 'development',
            },
          ],
        },
      });
    }

    // Common steps for all iOS builds
    iosSteps.push({
      'deploy-to-bitrise-io@2': {
        title: 'Deploy to Bitrise.io',
        inputs: [
          { notify_user_groups: 'everyone' },
          // Enable public install page for builds when notifications are needed
          { is_enable_public_page: 'true' },
        ],
      },
    });

    // Add custom notification steps
    const notificationSteps = generateBitriseNotificationSteps(build, 'iOS');
    iosSteps.push(...notificationSteps);

    // Add cache step
    iosSteps.push(saveCacheStep);

    const workflowKey = 'rn-ios-build';
    const workflowTitle = isExpo ? 'Build Expo iOS' : 'Build iOS';
    const workflowDescription = isExpo
      ? 'Build Expo iOS app using EAS'
      : 'Build React Native iOS app';

    workflows[workflowKey] = {
      title: workflowTitle,
      description: workflowDescription,
      steps: iosSteps,
      meta: iosMeta,
    };
  }

  // If building for both platforms, create a combined workflow
  if (build.platform === 'both') {
    const workflowKey = 'rn-build-all-platforms';
    const workflowTitle =
      framework === 'expo'
        ? 'Build Expo for All Platforms'
        : 'Build Both Platforms';
    const workflowDescription =
      framework === 'expo'
        ? 'Build Expo app for both Android and iOS using EAS'
        : 'Build React Native app for both Android and iOS';

    workflows[workflowKey] = {
      title: workflowTitle,
      description: workflowDescription,
      steps: [],
      before_run: ['rn-android-build', 'rn-ios-build'],
      meta: {
        'bitrise.io': {
          stack: 'osx-xcode-15.3.x-ventura', // Use macOS for combined workflow since iOS build requires it
          machine_type_id: 'g2-m1.8core',
        },
      },
    };
  }

  // Build trigger map
  const triggerMap = [];
  const primaryWorkflow =
    build.platform === 'both'
      ? 'rn-build-all-platforms'
      : build.platform === 'android'
        ? 'rn-android-build'
        : 'rn-ios-build';

  if (triggers?.push?.branches) {
    triggers.push.branches.forEach(branch => {
      triggerMap.push({
        push_branch: branch,
        workflow: primaryWorkflow,
      });
    });
  } else {
    triggerMap.push({
      push_branch: 'main',
      workflow: primaryWorkflow,
    });
  }

  if (triggers?.pullRequest?.branches) {
    triggers.pullRequest.branches.forEach(branch => {
      triggerMap.push({
        pull_request_target_branch: branch,
        workflow: primaryWorkflow,
      });
    });
  } else {
    triggerMap.push({
      pull_request_target_branch: 'main',
      workflow: primaryWorkflow,
    });
  }

  // Set project type based on framework
  const projectType = framework === 'expo' ? 'expo' : 'react-native';

  return {
    format_version: 13,
    default_step_lib_source:
      'https://github.com/bitrise-io/bitrise-steplib.git',
    project_type: projectType,
    meta:
      build.platform === 'both'
        ? {
            'bitrise.io': {
              stack: 'osx-xcode-15.3.x-ventura',
              machine_type_id: 'g2-m1.8core',
            },
          }
        : build.platform === 'ios'
          ? {
              'bitrise.io': {
                stack: 'osx-xcode-15.3.x-ventura',
                machine_type_id: 'g2-m1.8core',
              },
            }
          : {
              'bitrise.io': {
                stack: 'linux-docker-android-22.04',
                machine_type_id: 'elite',
              },
            },
    app: {
      envs: appEnvs.length > 0 ? appEnvs : undefined,
    },
    workflows,
    trigger_map: triggerMap,
  };
}
