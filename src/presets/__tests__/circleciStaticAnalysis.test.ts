import { buildCircleCIStaticAnalysisPipeline } from '../circleciStaticAnalysis';
import { WorkflowOptions } from '../../types';

describe('buildCircleCIStaticAnalysisPipeline', () => {
  const defaultOptions: WorkflowOptions = {
    platform: 'circleci',
    packageManager: 'yarn',
  };

  describe('output structure', () => {
    it('returns version 2.1', () => {
      const result = buildCircleCIStaticAnalysisPipeline(defaultOptions);

      expect(result.version).toBe(2.1);
    });

    it('includes the circleci/node orb', () => {
      const result = buildCircleCIStaticAnalysisPipeline(defaultOptions);
      const orbs = result.orbs as Record<string, string>;

      expect(orbs.node).toBe('circleci/node@5');
    });

    it('defines a static-analysis job', () => {
      const result = buildCircleCIStaticAnalysisPipeline(defaultOptions);
      const jobs = result.jobs as Record<string, unknown>;

      expect(jobs['static-analysis']).toBeDefined();
    });

    it('uses the correct Docker image', () => {
      const result = buildCircleCIStaticAnalysisPipeline({
        ...defaultOptions,
        nodeVersions: [20],
      });
      const jobs = result.jobs as Record<string, unknown>;
      const job = jobs['static-analysis'] as Record<string, unknown>;
      const docker = job.docker as Array<Record<string, string>>;

      expect(docker[0].image).toBe('cimg/node:20.0');
    });

    it('defines a static-analysis workflow', () => {
      const result = buildCircleCIStaticAnalysisPipeline(defaultOptions);
      const workflows = result.workflows as Record<string, unknown>;

      expect(workflows['static-analysis']).toBeDefined();
    });
  });

  describe('steps', () => {
    it('starts with checkout', () => {
      const result = buildCircleCIStaticAnalysisPipeline(defaultOptions);
      const jobs = result.jobs as Record<string, unknown>;
      const job = jobs['static-analysis'] as Record<string, unknown>;
      const steps = job.steps as Array<string | Record<string, unknown>>;

      expect(steps[0]).toBe('checkout');
    });

    it('uses node/install-packages step', () => {
      const result = buildCircleCIStaticAnalysisPipeline(defaultOptions);
      const jobs = result.jobs as Record<string, unknown>;
      const job = jobs['static-analysis'] as Record<string, unknown>;
      const steps = job.steps as Array<string | Record<string, unknown>>;
      const installStep = steps.find(
        s => typeof s === 'object' && 'node/install-packages' in s
      ) as Record<string, unknown> | undefined;

      expect(installStep).toBeDefined();
      const installConfig = installStep!['node/install-packages'] as Record<string, string>;
      expect(installConfig['pkg-manager']).toBe('yarn');
    });

    it('uses npm as pkg-manager for npm projects', () => {
      const result = buildCircleCIStaticAnalysisPipeline({
        ...defaultOptions,
        packageManager: 'npm',
      });
      const jobs = result.jobs as Record<string, unknown>;
      const job = jobs['static-analysis'] as Record<string, unknown>;
      const steps = job.steps as Array<string | Record<string, unknown>>;
      const installStep = steps.find(
        s => typeof s === 'object' && 'node/install-packages' in s
      ) as Record<string, unknown> | undefined;
      const installConfig = installStep!['node/install-packages'] as Record<string, string>;

      expect(installConfig['pkg-manager']).toBe('npm');
    });

    it('includes TypeScript run step by default', () => {
      const result = buildCircleCIStaticAnalysisPipeline(defaultOptions);
      const jobs = result.jobs as Record<string, unknown>;
      const job = jobs['static-analysis'] as Record<string, unknown>;
      const steps = job.steps as Array<string | Record<string, unknown>>;
      const tsStep = steps.find(
        s =>
          typeof s === 'object' &&
          'run' in s &&
          (s.run as Record<string, string>).name === 'TypeScript'
      );

      expect(tsStep).toBeDefined();
    });

    it('excludes TypeScript step when disabled', () => {
      const result = buildCircleCIStaticAnalysisPipeline({
        ...defaultOptions,
        staticAnalysis: { typescript: false },
      });
      const jobs = result.jobs as Record<string, unknown>;
      const job = jobs['static-analysis'] as Record<string, unknown>;
      const steps = job.steps as Array<string | Record<string, unknown>>;
      const tsStep = steps.find(
        s =>
          typeof s === 'object' &&
          'run' in s &&
          (s.run as Record<string, string>).name === 'TypeScript'
      );

      expect(tsStep).toBeUndefined();
    });
  });

  describe('notifications', () => {
    it('adds circleci/slack orb when notification is slack', () => {
      const result = buildCircleCIStaticAnalysisPipeline({
        ...defaultOptions,
        staticAnalysis: { notification: 'slack' },
      });
      const orbs = result.orbs as Record<string, string>;

      expect(orbs.slack).toBeDefined();
    });

    it('does not add slack orb when notification is none', () => {
      const result = buildCircleCIStaticAnalysisPipeline({
        ...defaultOptions,
        staticAnalysis: { notification: 'none' },
      });
      const orbs = result.orbs as Record<string, string>;

      expect(orbs.slack).toBeUndefined();
    });
  });

  describe('triggers', () => {
    it('applies branch filters when push branches are configured', () => {
      const result = buildCircleCIStaticAnalysisPipeline({
        ...defaultOptions,
        triggers: { push: { branches: ['main', 'develop'] } },
      });
      const workflows = result.workflows as Record<string, unknown>;
      const workflow = workflows['static-analysis'] as Record<string, unknown>;
      const jobs = workflow.jobs as Array<Record<string, unknown>>;
      const jobEntry = jobs[0]['static-analysis'] as Record<string, unknown>;
      const filters = jobEntry.filters as Record<string, unknown>;
      const branches = filters?.branches as Record<string, unknown>;

      expect(branches?.only).toEqual(['main', 'develop']);
    });
  });

  it('output matches snapshot for default options', () => {
    const result = buildCircleCIStaticAnalysisPipeline(defaultOptions);

    expect(result).toMatchSnapshot();
  });

  it('output matches snapshot for npm package manager', () => {
    const result = buildCircleCIStaticAnalysisPipeline({
      ...defaultOptions,
      packageManager: 'npm',
    });

    expect(result).toMatchSnapshot();
  });
});
