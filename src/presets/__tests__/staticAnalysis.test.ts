import { buildStaticAnalysisPipeline } from '../staticAnalysis';
import { WorkflowOptions } from '../../types';

describe('buildStaticAnalysisPipeline', () => {
  const defaultOptions: WorkflowOptions = {
    platform: 'github',
    packageManager: 'yarn',
    nodeVersions: [20],
  };

  // ─── Output structure ──────────────────────────────────────────────────────

  describe('output structure', () => {
    it('returns a workflow with name, on, and jobs', () => {
      const result = buildStaticAnalysisPipeline(defaultOptions);

      expect(result.name).toBeDefined();
      expect(result.on).toBeDefined();
      expect(result.jobs).toBeDefined();
    });

    it('defaults workflow name to "Static Analysis"', () => {
      const result = buildStaticAnalysisPipeline(defaultOptions);

      expect(result.name).toBe('Static Analysis');
    });

    it('uses a provided custom name', () => {
      const result = buildStaticAnalysisPipeline({
        ...defaultOptions,
        name: 'My Custom Analysis',
      });

      expect(result.name).toBe('My Custom Analysis');
    });

    it('includes a static_analysis job', () => {
      const result = buildStaticAnalysisPipeline(defaultOptions);

      expect(result.jobs.static_analysis).toBeDefined();
    });

    it('uses ubuntu-latest runner by default', () => {
      const result = buildStaticAnalysisPipeline(defaultOptions);

      expect(result.jobs.static_analysis['runs-on']).toBe('ubuntu-latest');
    });

    it('uses a custom runner when runsOn is provided', () => {
      const result = buildStaticAnalysisPipeline({
        ...defaultOptions,
        runsOn: 'ubuntu-22.04',
      });

      expect(result.jobs.static_analysis['runs-on']).toBe('ubuntu-22.04');
    });

    it('steps is an array', () => {
      const result = buildStaticAnalysisPipeline(defaultOptions);

      expect(Array.isArray(result.jobs.static_analysis.steps)).toBe(true);
    });
  });

  // ─── Setup steps ──────────────────────────────────────────────────────────

  describe('setup steps', () => {
    it('includes Checkout step', () => {
      const result = buildStaticAnalysisPipeline(defaultOptions);
      const steps = result.jobs.static_analysis.steps;

      expect(steps.some((s: any) => s.name === 'Checkout')).toBe(true);
    });

    it('includes Setup Node step', () => {
      const result = buildStaticAnalysisPipeline(defaultOptions);
      const steps = result.jobs.static_analysis.steps;

      expect(steps.some((s: any) => s.name === 'Setup Node')).toBe(true);
    });

    it('uses the single nodeVersion directly for setup-node when only one version provided', () => {
      const result = buildStaticAnalysisPipeline({
        ...defaultOptions,
        nodeVersions: [18],
      });
      const steps = result.jobs.static_analysis.steps;
      const nodeStep = steps.find((s: any) => s.name === 'Setup Node') as any;

      expect(nodeStep?.with?.['node-version']).toBe(18);
    });

    it('uses matrix expression for setup-node when multiple versions provided', () => {
      const result = buildStaticAnalysisPipeline({
        ...defaultOptions,
        nodeVersions: [18, 20],
      });
      const steps = result.jobs.static_analysis.steps;
      const nodeStep = steps.find((s: any) => s.name === 'Setup Node') as any;

      expect(nodeStep?.with?.['node-version']).toBe(
        '${{ matrix.node-version }}'
      );
    });

    it('adds strategy.matrix when multiple versions provided', () => {
      const result = buildStaticAnalysisPipeline({
        ...defaultOptions,
        nodeVersions: [18, 20],
      });
      const job = result.jobs.static_analysis as any;

      expect(job.strategy?.matrix?.['node-version']).toEqual([18, 20]);
    });

    it('does not add strategy when only one version provided', () => {
      const result = buildStaticAnalysisPipeline({
        ...defaultOptions,
        nodeVersions: [20],
      });
      const job = result.jobs.static_analysis as any;

      expect(job.strategy).toBeUndefined();
    });
  });

  // ─── Package manager ──────────────────────────────────────────────────────

  describe('yarn package manager', () => {
    it('uses yarn install --immutable', () => {
      const result = buildStaticAnalysisPipeline({
        ...defaultOptions,
        packageManager: 'yarn',
      });
      const steps = result.jobs.static_analysis.steps;
      const installStep = steps.find((s: any) => s.name === 'Install') as any;

      expect(installStep?.run).toBe('yarn install --immutable');
    });

    it('uses yarn commands for analysis steps', () => {
      const result = buildStaticAnalysisPipeline({
        ...defaultOptions,
        packageManager: 'yarn',
      });
      const steps = result.jobs.static_analysis.steps;
      const tsStep = steps.find((s: any) => s.name === 'TypeScript') as any;

      expect(tsStep?.run).toContain('yarn');
    });
  });

  describe('npm package manager', () => {
    it('uses npm ci', () => {
      const result = buildStaticAnalysisPipeline({
        ...defaultOptions,
        packageManager: 'npm',
      });
      const steps = result.jobs.static_analysis.steps;
      const installStep = steps.find((s: any) => s.name === 'Install') as any;

      expect(installStep?.run).toBe('npm ci');
    });

    it('uses npm commands for analysis steps', () => {
      const result = buildStaticAnalysisPipeline({
        ...defaultOptions,
        packageManager: 'npm',
      });
      const steps = result.jobs.static_analysis.steps;
      const tsStep = steps.find((s: any) => s.name === 'TypeScript') as any;

      expect(tsStep?.run).toContain('npm');
    });
  });

  // ─── Analysis checks ──────────────────────────────────────────────────────

  describe('analysis checks', () => {
    it('includes all four checks by default', () => {
      const result = buildStaticAnalysisPipeline(defaultOptions);
      const stepNames = result.jobs.static_analysis.steps.map(
        (s: any) => s.name
      );

      expect(stepNames).toContain('TypeScript');
      expect(stepNames).toContain('ESLint');
      expect(stepNames).toContain('Prettier');
      expect(stepNames).toContain('Unit tests');
    });

    it('excludes TypeScript when disabled', () => {
      const result = buildStaticAnalysisPipeline({
        ...defaultOptions,
        staticAnalysis: { typescript: false },
      });
      const stepNames = result.jobs.static_analysis.steps.map(
        (s: any) => s.name
      );

      expect(stepNames).not.toContain('TypeScript');
    });

    it('excludes ESLint when disabled', () => {
      const result = buildStaticAnalysisPipeline({
        ...defaultOptions,
        staticAnalysis: { eslint: false },
      });
      const stepNames = result.jobs.static_analysis.steps.map(
        (s: any) => s.name
      );

      expect(stepNames).not.toContain('ESLint');
    });

    it('excludes Prettier when disabled', () => {
      const result = buildStaticAnalysisPipeline({
        ...defaultOptions,
        staticAnalysis: { prettier: false },
      });
      const stepNames = result.jobs.static_analysis.steps.map(
        (s: any) => s.name
      );

      expect(stepNames).not.toContain('Prettier');
    });

    it('excludes unit tests when disabled', () => {
      const result = buildStaticAnalysisPipeline({
        ...defaultOptions,
        staticAnalysis: { unitTests: false },
      });
      const stepNames = result.jobs.static_analysis.steps.map(
        (s: any) => s.name
      );

      expect(stepNames).not.toContain('Unit tests');
    });

    it('can disable all checks', () => {
      const result = buildStaticAnalysisPipeline({
        ...defaultOptions,
        staticAnalysis: {
          typescript: false,
          eslint: false,
          prettier: false,
          unitTests: false,
        },
      });
      const stepNames = result.jobs.static_analysis.steps.map(
        (s: any) => s.name
      );

      expect(stepNames).not.toContain('TypeScript');
      expect(stepNames).not.toContain('ESLint');
      expect(stepNames).not.toContain('Prettier');
      expect(stepNames).not.toContain('Unit tests');
    });
  });

  // ─── Notifications ────────────────────────────────────────────────────────

  describe('notifications', () => {
    it('does not add notification steps when notification is not set', () => {
      const result = buildStaticAnalysisPipeline(defaultOptions);
      const steps = result.jobs.static_analysis.steps;

      // Verify no slack-related steps
      expect(
        steps.every(
          (s: any) =>
            !String(s.name ?? '')
              .toLowerCase()
              .includes('slack')
        )
      ).toBe(true);
    });

    it('does not add notification steps when notification is none', () => {
      const result = buildStaticAnalysisPipeline({
        ...defaultOptions,
        staticAnalysis: { notification: 'none' },
      });
      const steps = result.jobs.static_analysis.steps;

      expect(
        steps.every(
          (s: any) =>
            !String(s.name ?? '')
              .toLowerCase()
              .includes('slack')
        )
      ).toBe(true);
    });
  });

  // ─── Snapshot ─────────────────────────────────────────────────────────────

  it('output matches snapshot for default options', () => {
    const result = buildStaticAnalysisPipeline(defaultOptions);

    expect(result).toMatchSnapshot();
  });

  it('output matches snapshot for npm with custom name', () => {
    const result = buildStaticAnalysisPipeline({
      platform: 'github',
      packageManager: 'npm',
      nodeVersions: [18],
      name: 'CI Analysis',
    });

    expect(result).toMatchSnapshot();
  });
});
