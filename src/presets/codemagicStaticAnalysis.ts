import { WorkflowOptions } from '../types';

export function buildCodemagicStaticAnalysisPipeline(
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

  // Build scripts array
  const scripts: Array<Record<string, string>> = [
    { name: 'Install dependencies', script: installCmd },
  ];

  if (staticAnalysis.typescript !== false) {
    scripts.push({
      name: 'TypeScript check',
      script:
        packageManager === 'yarn'
          ? 'yarn tsc --noEmit'
          : 'npm run tsc -- --noEmit',
    });
  }

  if (staticAnalysis.eslint !== false) {
    scripts.push({
      name: 'ESLint',
      script: packageManager === 'yarn' ? 'yarn lint' : 'npm run lint',
    });
  }

  if (staticAnalysis.prettier !== false) {
    scripts.push({
      name: 'Prettier',
      script:
        packageManager === 'yarn'
          ? 'yarn format:check'
          : 'npm run format:check',
    });
  }

  if (staticAnalysis.unitTests !== false) {
    scripts.push({
      name: 'Unit tests',
      script: packageManager === 'yarn' ? 'yarn test --ci' : 'npm test -- --ci',
    });
  }

  // Triggering config
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

  if (triggers?.schedule) {
    triggeringEvents.push('tag');
  }

  // Default triggers
  if (triggeringEvents.length === 0) {
    triggeringEvents.push('push', 'pull_request');
    branchPatterns.push({ pattern: 'main', include: true });
  }

  const triggering: Record<string, unknown> = {
    events: triggeringEvents,
    ...(branchPatterns.length > 0 ? { branch_patterns: branchPatterns } : {}),
  };

  // Publishing / notifications
  const publishing: Record<string, unknown> = {};
  if (
    staticAnalysis.notification === 'slack' ||
    staticAnalysis.notification === 'both'
  ) {
    publishing.slack = {
      channel: '#builds',
      notify_on_build_start: false,
      notify: { success: true, failure: true },
    };
  }

  const workflow: Record<string, unknown> = {
    name: opts.name ?? 'Static Analysis',
    instance_type: 'linux_x2',
    environment: {
      node: nodeVersion,
    },
    triggering,
    cache: {
      cache_paths: ['$CM_BUILD_DIR/node_modules'],
    },
    scripts,
    ...(Object.keys(publishing).length > 0 ? { publishing } : {}),
  };

  return {
    workflows: {
      'static-analysis': workflow,
    },
  };
}
