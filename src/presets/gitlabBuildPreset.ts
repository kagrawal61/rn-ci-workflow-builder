import { WorkflowOptions } from '../types';
import { BuildOptions } from './types';

export function buildGitlabBuildPipeline(
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
  const installCmd =
    packageManager === 'yarn' ? 'yarn install --immutable' : 'npm ci';
  const buildOpts = build as BuildOptions;

  // Scripts array
  const script: string[] = [installCmd];

  // Static analysis steps
  if (buildOpts.includeStaticAnalysis) {
    script.push(
      packageManager === 'yarn'
        ? 'yarn tsc --noEmit'
        : 'npm run tsc -- --noEmit'
    );
    script.push(
      packageManager === 'yarn' ? 'yarn lint' : 'npm run lint'
    );
    script.push(
      packageManager === 'yarn' ? 'yarn test --ci' : 'npm test -- --ci'
    );
  }

  // Build command
  if (framework === 'expo') {
    script.push('npm install -g eas-cli');
    const outputFlag =
      buildOpts.androidOutputType === 'aab' ? 'production' : 'production-apk';
    script.push(
      `eas build --platform android --profile ${outputFlag} --local --non-interactive`
    );
  } else {
    script.push('chmod +x android/gradlew');
    const variant = buildOpts.variant ?? 'release';
    const outputType = buildOpts.androidOutputType ?? 'apk';

    if (outputType === 'both') {
      const apkTask =
        variant === 'debug' ? 'assembleDebug' : 'assembleRelease';
      const aabTask = variant === 'debug' ? 'bundleDebug' : 'bundleRelease';
      script.push(`cd android && ./gradlew ${apkTask} ${aabTask} && cd ..`);
    } else if (outputType === 'aab') {
      const task = variant === 'debug' ? 'bundleDebug' : 'bundleRelease';
      script.push(`cd android && ./gradlew ${task} && cd ..`);
    } else {
      const task =
        variant === 'debug' ? 'assembleDebug' : 'assembleRelease';
      script.push(`cd android && ./gradlew ${task} && cd ..`);
    }
  }

  // Build rules from triggers
  const rules: Array<Record<string, unknown>> = [];

  if (triggers?.push?.branches && triggers.push.branches.length > 0) {
    const branchPattern = triggers.push.branches.join('|');
    rules.push({
      if: `$CI_COMMIT_BRANCH =~ /(${branchPattern})/`,
    });
  }

  if (triggers?.pullRequest) {
    rules.push({ if: '$CI_PIPELINE_SOURCE == "merge_request_event"' });
  }

  if (triggers?.schedule) {
    rules.push({ if: '$CI_PIPELINE_SOURCE == "schedule"' });
  }

  if (triggers?.workflowDispatch) {
    rules.push({ if: '$CI_PIPELINE_SOURCE == "web"' });
  }

  if (rules.length === 0) {
    rules.push(
      { if: '$CI_PIPELINE_SOURCE == "push"' },
      { if: '$CI_PIPELINE_SOURCE == "merge_request_event"' }
    );
  }

  // Artifact paths
  const artifactPaths: string[] = [];
  const outputType = buildOpts.androidOutputType ?? 'apk';
  if (framework === 'expo') {
    artifactPaths.push('expo-builds/');
  } else {
    if (outputType === 'apk' || outputType === 'both') {
      artifactPaths.push('android/app/build/outputs/apk/**/*.apk');
    }
    if (outputType === 'aab' || outputType === 'both') {
      artifactPaths.push('android/app/build/outputs/bundle/**/*.aab');
    }
  }

  // Slack notification
  const afterScript: string[] = [];
  if (
    buildOpts.notification === 'slack' ||
    buildOpts.notification === 'both'
  ) {
    afterScript.push(
      `curl -s -X POST -H 'Content-type: application/json' ` +
        `--data '{"text":"Android build completed on branch: $CI_COMMIT_BRANCH"}' ` +
        `"$SLACK_WEBHOOK_URL" || true`
    );
  }

  const job: Record<string, unknown> = {
    image: `node:${nodeVersion}`,
    stage: 'build',
    cache: {
      key: '$CI_COMMIT_REF_SLUG',
      paths: ['node_modules/'],
    },
    script,
    artifacts: {
      paths: artifactPaths,
      expire_in: '30 days',
    },
    ...(afterScript.length > 0 ? { after_script: afterScript } : {}),
    rules,
  };

  return {
    stages: ['build'],
    build: job,
  };
}
