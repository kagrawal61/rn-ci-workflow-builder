import { WorkflowOptions } from '../types';

export function buildAzureDevOpsStaticAnalysisPipeline(
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

  if (staticAnalysis.typescript !== false) {
    steps.push({
      script:
        packageManager === 'yarn'
          ? 'yarn tsc --noEmit'
          : 'npm run tsc -- --noEmit',
      displayName: 'TypeScript check',
    });
  }

  if (staticAnalysis.eslint !== false) {
    steps.push({
      script: packageManager === 'yarn' ? 'yarn lint' : 'npm run lint',
      displayName: 'ESLint',
    });
  }

  if (staticAnalysis.prettier !== false) {
    steps.push({
      script:
        packageManager === 'yarn'
          ? 'yarn format:check'
          : 'npm run format:check',
      displayName: 'Prettier check',
    });
  }

  if (staticAnalysis.unitTests !== false) {
    steps.push({
      script: packageManager === 'yarn' ? 'yarn test --ci' : 'npm test -- --ci',
      displayName: 'Unit tests',
    });
  }

  // Slack notification
  if (
    staticAnalysis.notification === 'slack' ||
    staticAnalysis.notification === 'both'
  ) {
    steps.push({
      script: `curl -s -X POST -H 'Content-type: application/json' --data '{"text":"Static analysis completed on branch: $(Build.SourceBranchName)"}' "$(SLACK_WEBHOOK_URL)" || true`,
      displayName: 'Notify Slack',
      condition: 'always()',
    });
  }

  // Trigger sections
  const triggerBranches: string[] = triggers?.push?.branches ?? ['main'];
  const prBranches: string[] = triggers?.pullRequest?.branches ?? ['main'];

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
        stage: 'StaticAnalysis',
        displayName: 'Static Analysis',
        jobs: [
          {
            job: 'Lint',
            displayName: opts.name ?? 'Lint and Type Check',
            steps,
          },
        ],
      },
    ],
  };

  if (triggers?.schedule) {
    result.schedules = triggers.schedule.map(s => ({
      cron: s.cron,
      displayName: 'Scheduled run',
      branches: { include: triggerBranches },
      always: false,
    }));
  }

  return result;
}
