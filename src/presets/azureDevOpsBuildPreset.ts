import { WorkflowOptions } from '../types';
import { BuildOptions } from './types';

export function buildAzureDevOpsBuildPipeline(
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

  // Build steps
  const steps: Array<Record<string, unknown>> = [
    {
      task: 'NodeTool@0',
      inputs: { versionSpec: `${nodeVersion}.x` },
      displayName: 'Install Node.js',
    },
    {
      script: installCmd,
      displayName: 'Install dependencies',
    },
  ];

  // Static analysis
  if (buildOpts.includeStaticAnalysis) {
    steps.push({
      script:
        packageManager === 'yarn'
          ? 'yarn tsc --noEmit'
          : 'npm run tsc -- --noEmit',
      displayName: 'TypeScript check',
    });
    steps.push({
      script:
        packageManager === 'yarn' ? 'yarn lint' : 'npm run lint',
      displayName: 'ESLint',
    });
    steps.push({
      script:
        packageManager === 'yarn' ? 'yarn test --ci' : 'npm test -- --ci',
      displayName: 'Unit tests',
    });
  }

  // Build step
  if (framework === 'expo') {
    steps.push({
      script: 'npm install -g eas-cli',
      displayName: 'Install EAS CLI',
    });
    const outputFlag =
      buildOpts.androidOutputType === 'aab' ? 'production' : 'production-apk';
    steps.push({
      script: `eas build --platform android --profile ${outputFlag} --local --non-interactive`,
      displayName: 'Build Android',
    });
  } else {
    steps.push({
      script: 'chmod +x android/gradlew',
      displayName: 'Make gradlew executable',
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
      gradleTask =
        variant === 'debug' ? 'assembleDebug' : 'assembleRelease';
    }

    steps.push({
      script: `cd android && ./gradlew ${gradleTask} && cd ..`,
      displayName: 'Build Android',
    });
  }

  // Publish artifacts
  const artifactPath =
    framework === 'expo'
      ? 'expo-builds'
      : 'android/app/build/outputs';

  steps.push({
    task: 'PublishBuildArtifacts@1',
    inputs: {
      pathToPublish: artifactPath,
      artifactName: 'android-build',
    },
    displayName: 'Publish build artifacts',
  });

  // Slack notification
  if (
    buildOpts.notification === 'slack' ||
    buildOpts.notification === 'both'
  ) {
    steps.push({
      script: `curl -s -X POST -H 'Content-type: application/json' --data '{"text":"Android build completed on branch: $(Build.SourceBranchName)"}' "$(SLACK_WEBHOOK_URL)" || true`,
      displayName: 'Notify Slack',
      condition: 'always()',
    });
  }

  // Trigger sections
  const triggerBranches: string[] =
    triggers?.push?.branches ?? ['main'];
  const prBranches: string[] =
    triggers?.pullRequest?.branches ?? ['main'];

  const result: Record<string, unknown> = {
    trigger: {
      branches: {
        include: triggerBranches,
      },
    },
    pr: {
      branches: {
        include: prBranches,
      },
    },
    pool: {
      vmImage: 'ubuntu-latest',
    },
    stages: [
      {
        stage: 'Build',
        displayName: 'Build Android',
        jobs: [
          {
            job: 'AndroidBuild',
            displayName: opts.name ?? 'Build React Native Android',
            steps,
          },
        ],
      },
    ],
  };

  if (triggers?.schedule) {
    result.schedules = triggers.schedule.map(s => ({
      cron: s.cron,
      displayName: 'Scheduled build',
      branches: { include: triggerBranches },
      always: false,
    }));
  }

  return result;
}
