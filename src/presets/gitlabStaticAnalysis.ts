import { WorkflowOptions } from '../types';

export function buildGitlabStaticAnalysisPipeline(
  opts: WorkflowOptions
): Record<string, unknown> {
  const {
    triggers,
    nodeVersions = [20],
    packageManager = 'yarn',
    staticAnalysis = {
      typescript: true,
      eslint: true,
      prettier: true,
      unitTests: true,
    },
  } = opts;

  const nodeVersion = nodeVersions[0] ?? 20;
  const installCmd =
    packageManager === 'yarn' ? 'yarn install --immutable' : 'npm ci';

  const script: string[] = [installCmd];

  if (staticAnalysis.typescript !== false) {
    script.push(
      packageManager === 'yarn'
        ? 'yarn tsc --noEmit'
        : 'npm run tsc -- --noEmit'
    );
  }
  if (staticAnalysis.eslint !== false) {
    script.push(
      packageManager === 'yarn' ? 'yarn lint' : 'npm run lint'
    );
  }
  if (staticAnalysis.prettier !== false) {
    script.push(
      packageManager === 'yarn'
        ? 'yarn format:check'
        : 'npm run format:check'
    );
  }
  if (staticAnalysis.unitTests !== false) {
    script.push(
      packageManager === 'yarn' ? 'yarn test --ci' : 'npm test -- --ci'
    );
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

  // Default rules when none configured
  if (rules.length === 0) {
    rules.push(
      { if: '$CI_PIPELINE_SOURCE == "push"' },
      { if: '$CI_PIPELINE_SOURCE == "merge_request_event"' }
    );
  }

  // Slack notification via after_script
  const afterScript: string[] = [];
  if (
    staticAnalysis.notification === 'slack' ||
    staticAnalysis.notification === 'both'
  ) {
    afterScript.push(
      `curl -s -X POST -H 'Content-type: application/json' ` +
        `--data '{"text":"Static analysis completed on branch: $CI_COMMIT_BRANCH"}' ` +
        `"$SLACK_WEBHOOK_URL" || true`
    );
  }

  const job: Record<string, unknown> = {
    image: `node:${nodeVersion}`,
    stage: 'static-analysis',
    cache: {
      key: '$CI_COMMIT_REF_SLUG',
      paths: ['node_modules/'],
    },
    script,
    ...(afterScript.length > 0 ? { after_script: afterScript } : {}),
    rules,
  };

  return {
    stages: ['static-analysis'],
    'static-analysis': job,
  };
}
