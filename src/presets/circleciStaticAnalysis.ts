import { WorkflowOptions } from '../types';

export function buildCircleCIStaticAnalysisPipeline(
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

  // Build job steps
  const steps: Array<string | Record<string, unknown>> = ['checkout'];

  // Install dependencies using the node orb
  steps.push({
    'node/install-packages': {
      'pkg-manager': packageManager,
    },
  });

  if (staticAnalysis.typescript !== false) {
    steps.push({
      run: {
        name: 'TypeScript',
        command:
          packageManager === 'yarn'
            ? 'yarn tsc --noEmit'
            : 'npm run tsc -- --noEmit',
      },
    });
  }

  if (staticAnalysis.eslint !== false) {
    steps.push({
      run: {
        name: 'ESLint',
        command:
          packageManager === 'yarn' ? 'yarn lint' : 'npm run lint',
      },
    });
  }

  if (staticAnalysis.prettier !== false) {
    steps.push({
      run: {
        name: 'Prettier',
        command:
          packageManager === 'yarn'
            ? 'yarn format:check'
            : 'npm run format:check',
      },
    });
  }

  if (staticAnalysis.unitTests !== false) {
    steps.push({
      run: {
        name: 'Unit Tests',
        command:
          packageManager === 'yarn' ? 'yarn test --ci' : 'npm test -- --ci',
      },
    });
  }

  // Slack notification step
  if (
    staticAnalysis.notification === 'slack' ||
    staticAnalysis.notification === 'both'
  ) {
    steps.push({
      'slack/notify': {
        event: 'always',
        template: 'basic_success_1',
      },
    });
  }

  // Build branch filters
  const branchFilter: Record<string, unknown> = {};
  if (triggers?.push?.branches && triggers.push.branches.length > 0) {
    branchFilter.only = triggers.push.branches;
  }

  const jobFilters =
    Object.keys(branchFilter).length > 0
      ? { filters: { branches: branchFilter } }
      : {};

  const orbs: Record<string, string> = {
    node: 'circleci/node@5',
  };

  if (
    staticAnalysis.notification === 'slack' ||
    staticAnalysis.notification === 'both'
  ) {
    orbs.slack = 'circleci/slack@4';
  }

  return {
    version: 2.1,
    orbs,
    jobs: {
      'static-analysis': {
        docker: [{ image: `cimg/node:${nodeVersion}.0` }],
        steps,
      },
    },
    workflows: {
      'static-analysis': {
        jobs: [{ 'static-analysis': jobFilters }],
      },
    },
  };
}
