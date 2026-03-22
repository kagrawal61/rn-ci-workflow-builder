import { buildBitriseStaticAnalysisPipeline } from '../bitriseStaticAnalysis';
import { WorkflowOptions } from '../../types';

describe('buildBitriseStaticAnalysisPipeline', () => {
  const defaultOptions: WorkflowOptions = {
    platform: 'bitrise',
    packageManager: 'yarn',
  };

  // ─── Output structure ──────────────────────────────────────────────────────

  describe('output structure', () => {
    it('returns a valid Bitrise config with required top-level fields', () => {
      const result = buildBitriseStaticAnalysisPipeline(defaultOptions);

      expect(result.format_version).toBe(13);
      expect(result.default_step_lib_source).toBeDefined();
      expect(result.workflows).toBeDefined();
      expect(result.app).toBeDefined();
    });

    it('includes the rn-static-analysis workflow', () => {
      const result = buildBitriseStaticAnalysisPipeline(defaultOptions);

      expect(result.workflows['rn-static-analysis']).toBeDefined();
    });

    it('has a non-empty steps array', () => {
      const result = buildBitriseStaticAnalysisPipeline(defaultOptions);
      const steps = result.workflows['rn-static-analysis'].steps;

      expect(Array.isArray(steps)).toBe(true);
      expect(steps.length).toBeGreaterThan(0);
    });

    it('includes a trigger_map', () => {
      const result = buildBitriseStaticAnalysisPipeline(defaultOptions);

      expect(Array.isArray(result.trigger_map)).toBe(true);
      expect(result.trigger_map!.length).toBeGreaterThan(0);
    });

    it('sets project_type to react-native for RN CLI', () => {
      const result = buildBitriseStaticAnalysisPipeline(defaultOptions);

      expect(result.project_type).toBe('react-native');
    });

    it('sets project_type to expo for Expo framework', () => {
      const result = buildBitriseStaticAnalysisPipeline({
        ...defaultOptions,
        framework: 'expo',
      });

      expect(result.project_type).toBe('expo');
    });
  });

  // ─── Workflow metadata ────────────────────────────────────────────────────

  describe('workflow metadata', () => {
    it('sets default title to "React Native Static Analysis" for RN CLI', () => {
      const result = buildBitriseStaticAnalysisPipeline(defaultOptions);
      const workflow = result.workflows['rn-static-analysis'];

      expect(workflow.title).toBe('React Native Static Analysis');
    });

    it('sets title to "Expo Static Analysis" for Expo framework', () => {
      const result = buildBitriseStaticAnalysisPipeline({
        ...defaultOptions,
        framework: 'expo',
      });
      const workflow = result.workflows['rn-static-analysis'];

      expect(workflow.title).toBe('Expo Static Analysis');
    });

    it('uses a custom name when opts.name is provided', () => {
      const result = buildBitriseStaticAnalysisPipeline({
        ...defaultOptions,
        name: 'My Custom Analysis',
      });
      const workflow = result.workflows['rn-static-analysis'];

      expect(workflow.title).toBe('My Custom Analysis');
    });
  });

  // ─── Setup steps ──────────────────────────────────────────────────────────

  describe('setup steps', () => {
    it('includes git-clone step', () => {
      const result = buildBitriseStaticAnalysisPipeline(defaultOptions);
      const steps = result.workflows['rn-static-analysis'].steps;
      const hasGitClone = steps.some((s: any) => 'git-clone@8' in s);

      expect(hasGitClone).toBe(true);
    });

    it('includes nvm step for Node.js setup', () => {
      const result = buildBitriseStaticAnalysisPipeline(defaultOptions);
      const steps = result.workflows['rn-static-analysis'].steps;
      const hasNvm = steps.some((s: any) => 'nvm@1' in s);

      expect(hasNvm).toBe(true);
    });

    it('includes restore-cache step', () => {
      const result = buildBitriseStaticAnalysisPipeline(defaultOptions);
      const steps = result.workflows['rn-static-analysis'].steps;
      const hasRestoreCache = steps.some((s: any) => 'restore-cache@2' in s);

      expect(hasRestoreCache).toBe(true);
    });

    it('includes save-cache step', () => {
      const result = buildBitriseStaticAnalysisPipeline(defaultOptions);
      const steps = result.workflows['rn-static-analysis'].steps;
      const hasSaveCache = steps.some((s: any) => 'save-cache@1' in s);

      expect(hasSaveCache).toBe(true);
    });
  });

  // ─── Package manager ──────────────────────────────────────────────────────

  describe('yarn package manager', () => {
    it('uses yarn@0 step for installation', () => {
      const result = buildBitriseStaticAnalysisPipeline(defaultOptions);
      const steps = result.workflows['rn-static-analysis'].steps;
      const hasYarn = steps.some((s: any) => 'yarn@0' in s);

      expect(hasYarn).toBe(true);
    });
  });

  describe('npm package manager', () => {
    it('uses a script step for npm install', () => {
      const result = buildBitriseStaticAnalysisPipeline({
        ...defaultOptions,
        packageManager: 'npm',
      });
      const steps = result.workflows['rn-static-analysis'].steps;
      const scriptSteps = steps.filter((s: any) => 'script@1' in s);
      const installStep = scriptSteps.find(
        (s: any) => (s['script@1'] as any)?.title === 'Install Dependencies'
      );

      expect(installStep).toBeDefined();
    });

    it('uses npm ci in the install script', () => {
      const result = buildBitriseStaticAnalysisPipeline({
        ...defaultOptions,
        packageManager: 'npm',
      });
      const steps = result.workflows['rn-static-analysis'].steps;
      const scriptSteps = steps.filter((s: any) => 'script@1' in s);
      const installStep = scriptSteps.find(
        (s: any) => (s['script@1'] as any)?.title === 'Install Dependencies'
      );
      const content = (installStep as any)?.['script@1']?.inputs?.[0]?.content;

      expect(content).toContain('npm ci');
    });
  });

  // ─── Analysis checks ──────────────────────────────────────────────────────

  describe('analysis checks', () => {
    it('includes TypeScript Check step by default', () => {
      const result = buildBitriseStaticAnalysisPipeline(defaultOptions);
      const steps = result.workflows['rn-static-analysis'].steps;
      const scriptSteps = steps.filter((s: any) => 'script@1' in s);
      const tsStep = scriptSteps.find(
        (s: any) => (s['script@1'] as any)?.title === 'TypeScript Check'
      );

      expect(tsStep).toBeDefined();
    });

    it('excludes TypeScript Check when disabled', () => {
      const result = buildBitriseStaticAnalysisPipeline({
        ...defaultOptions,
        staticAnalysis: { typescript: false },
      });
      const steps = result.workflows['rn-static-analysis'].steps;
      const scriptSteps = steps.filter((s: any) => 'script@1' in s);
      const tsStep = scriptSteps.find(
        (s: any) => (s['script@1'] as any)?.title === 'TypeScript Check'
      );

      expect(tsStep).toBeUndefined();
    });

    it('includes ESLint Check step by default', () => {
      const result = buildBitriseStaticAnalysisPipeline(defaultOptions);
      const steps = result.workflows['rn-static-analysis'].steps;
      const scriptSteps = steps.filter((s: any) => 'script@1' in s);
      const eslintStep = scriptSteps.find(
        (s: any) => (s['script@1'] as any)?.title === 'ESLint Check'
      );

      expect(eslintStep).toBeDefined();
    });

    it('excludes ESLint Check when disabled', () => {
      const result = buildBitriseStaticAnalysisPipeline({
        ...defaultOptions,
        staticAnalysis: { eslint: false },
      });
      const steps = result.workflows['rn-static-analysis'].steps;
      const scriptSteps = steps.filter((s: any) => 'script@1' in s);
      const eslintStep = scriptSteps.find(
        (s: any) => (s['script@1'] as any)?.title === 'ESLint Check'
      );

      expect(eslintStep).toBeUndefined();
    });

    it('includes Prettier Check step by default', () => {
      const result = buildBitriseStaticAnalysisPipeline(defaultOptions);
      const steps = result.workflows['rn-static-analysis'].steps;
      const scriptSteps = steps.filter((s: any) => 'script@1' in s);
      const prettierStep = scriptSteps.find(
        (s: any) => (s['script@1'] as any)?.title === 'Prettier Check'
      );

      expect(prettierStep).toBeDefined();
    });

    it('includes Unit Tests step by default', () => {
      const result = buildBitriseStaticAnalysisPipeline(defaultOptions);
      const steps = result.workflows['rn-static-analysis'].steps;
      const scriptSteps = steps.filter((s: any) => 'script@1' in s);
      const unitTestStep = scriptSteps.find(
        (s: any) => (s['script@1'] as any)?.title === 'Unit Tests'
      );

      expect(unitTestStep).toBeDefined();
    });

    it('excludes Unit Tests when disabled', () => {
      const result = buildBitriseStaticAnalysisPipeline({
        ...defaultOptions,
        staticAnalysis: { unitTests: false },
      });
      const steps = result.workflows['rn-static-analysis'].steps;
      const scriptSteps = steps.filter((s: any) => 'script@1' in s);
      const unitTestStep = scriptSteps.find(
        (s: any) => (s['script@1'] as any)?.title === 'Unit Tests'
      );

      expect(unitTestStep).toBeUndefined();
    });
  });

  // ─── Expo framework ────────────────────────────────────────────────────────

  describe('Expo framework', () => {
    it('includes EAS CLI install step for expo', () => {
      const result = buildBitriseStaticAnalysisPipeline({
        ...defaultOptions,
        framework: 'expo',
      });
      const steps = result.workflows['rn-static-analysis'].steps;
      const scriptSteps = steps.filter((s: any) => 'script@1' in s);
      const easStep = scriptSteps.find(
        (s: any) => (s['script@1'] as any)?.title === 'Install EAS CLI'
      );

      expect(easStep).toBeDefined();
    });

    it('does not include EAS CLI step for RN CLI', () => {
      const result = buildBitriseStaticAnalysisPipeline(defaultOptions);
      const steps = result.workflows['rn-static-analysis'].steps;
      const scriptSteps = steps.filter((s: any) => 'script@1' in s);
      const easStep = scriptSteps.find(
        (s: any) => (s['script@1'] as any)?.title === 'Install EAS CLI'
      );

      expect(easStep).toBeUndefined();
    });

    it('adds NODE_OPTIONS env var for Expo (documents duplicate bug pre-fix)', () => {
      const result = buildBitriseStaticAnalysisPipeline({
        ...defaultOptions,
        framework: 'expo',
      });
      const envs = result.app?.envs ?? [];
      const nodeOptionsEntries = envs.filter((e: any) => 'NODE_OPTIONS' in e);

      // Bug (roadmap item F): currently produces 2 NODE_OPTIONS entries.
      // After fix in PR 2, this should be 1 entry with combined flags.
      expect(nodeOptionsEntries.length).toBe(2);
    });
  });

  // ─── Environment variables ────────────────────────────────────────────────

  describe('environment variables', () => {
    it('includes default CI env var', () => {
      const result = buildBitriseStaticAnalysisPipeline(defaultOptions);
      const envs = result.app?.envs ?? [];
      const ciEntry = envs.find((e: any) => 'CI' in e);

      expect(ciEntry).toBeDefined();
      expect((ciEntry as any)?.CI).toBe('true');
    });

    it('includes custom env vars when provided', () => {
      const result = buildBitriseStaticAnalysisPipeline({
        ...defaultOptions,
        env: { MY_VAR: 'my_value' },
      });
      const envs = result.app?.envs ?? [];
      const customEntry = envs.find((e: any) => 'MY_VAR' in e);

      expect(customEntry).toBeDefined();
      expect((customEntry as any)?.MY_VAR).toBe('my_value');
    });
  });

  // ─── Triggers ─────────────────────────────────────────────────────────────

  describe('trigger_map', () => {
    it('defaults to main branch push trigger', () => {
      const result = buildBitriseStaticAnalysisPipeline(defaultOptions);
      const hasPushToMain = result.trigger_map!.some(
        (t: any) => t.push_branch === 'main'
      );

      expect(hasPushToMain).toBe(true);
    });

    it('uses custom push branches when provided', () => {
      const result = buildBitriseStaticAnalysisPipeline({
        ...defaultOptions,
        triggers: { push: { branches: ['develop', 'main'] } },
      });
      const branches = result.trigger_map!
        .filter((t: any) => 'push_branch' in t)
        .map((t: any) => t.push_branch);

      expect(branches).toContain('develop');
      expect(branches).toContain('main');
    });
  });

  // ─── Snapshot ─────────────────────────────────────────────────────────────

  it('output matches snapshot for default options', () => {
    const result = buildBitriseStaticAnalysisPipeline(defaultOptions);

    expect(result).toMatchSnapshot();
  });

  it('output matches snapshot for npm package manager', () => {
    const result = buildBitriseStaticAnalysisPipeline({
      ...defaultOptions,
      packageManager: 'npm',
    });

    expect(result).toMatchSnapshot();
  });
});
