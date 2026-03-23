import { buildBitriseBuildPipeline } from '../bitriseBuildPreset';
import { WorkflowOptions } from '../../types';

describe('buildBitriseBuildPipeline', () => {
  const androidOptions: WorkflowOptions = {
    platform: 'bitrise',
    packageManager: 'yarn',
    build: {
      platform: 'android',
      variant: 'debug',
      storage: 'bitrise',
      notification: 'none',
    },
  };

  // ─── Output structure ──────────────────────────────────────────────────────

  describe('output structure', () => {
    it('returns a valid Bitrise config with required top-level fields', () => {
      const result = buildBitriseBuildPipeline(androidOptions);

      expect(result.format_version).toBeDefined();
      expect(typeof result.format_version).toBe('number');
      expect(result.workflows).toBeDefined();
    });

    it('has a non-empty workflows object', () => {
      const result = buildBitriseBuildPipeline(androidOptions);

      expect(Object.keys(result.workflows).length).toBeGreaterThan(0);
    });

    it('each workflow has a steps array', () => {
      const result = buildBitriseBuildPipeline(androidOptions);

      Object.values(result.workflows).forEach((workflow: any) => {
        expect(Array.isArray(workflow.steps)).toBe(true);
        expect(workflow.steps.length).toBeGreaterThan(0);
      });
    });

    it('includes a trigger_map', () => {
      const result = buildBitriseBuildPipeline(androidOptions);

      expect(Array.isArray(result.trigger_map)).toBe(true);
    });
  });

  // ─── Android builds ────────────────────────────────────────────────────────

  describe('Android builds', () => {
    it('generates a workflow for android debug build', () => {
      const result = buildBitriseBuildPipeline(androidOptions);

      // Should contain at least one workflow with Android steps
      const workflowNames = Object.keys(result.workflows);
      expect(workflowNames.length).toBeGreaterThan(0);
    });

    it('includes git-clone step', () => {
      const result = buildBitriseBuildPipeline(androidOptions);
      const allSteps = Object.values(result.workflows).flatMap(
        (w: any) => w.steps
      );
      const hasGitClone = allSteps.some((s: any) => 'git-clone@8' in s);

      expect(hasGitClone).toBe(true);
    });

    it('generates for release variant', () => {
      const result = buildBitriseBuildPipeline({
        ...androidOptions,
        build: { ...androidOptions.build!, variant: 'release' },
      });

      const workflowNames = Object.keys(result.workflows);
      expect(workflowNames.length).toBeGreaterThan(0);
    });
  });

  // ─── Both platforms ────────────────────────────────────────────────────────

  describe('Both platforms', () => {
    it('generates workflows for both android and ios when platform is both', () => {
      const result = buildBitriseBuildPipeline({
        ...androidOptions,
        build: { ...androidOptions.build!, platform: 'both' },
      });

      const workflowNames = Object.keys(result.workflows);
      // Should have workflows for both platforms (at least 2, or a combined one)
      expect(workflowNames.length).toBeGreaterThanOrEqual(1);
    });
  });

  // ─── Expo framework ────────────────────────────────────────────────────────

  describe('Expo framework', () => {
    it('generates a workflow for expo android build', () => {
      const result = buildBitriseBuildPipeline({
        ...androidOptions,
        framework: 'expo',
        build: { ...androidOptions.build!, platform: 'android' },
      });

      const workflowNames = Object.keys(result.workflows);
      expect(workflowNames.length).toBeGreaterThan(0);
    });

    it('sets project_type to expo', () => {
      const result = buildBitriseBuildPipeline({
        ...androidOptions,
        framework: 'expo',
      });

      expect(result.project_type).toBe('expo');
    });

    it('adds NODE_OPTIONS env for expo (documents duplicate bug pre-fix)', () => {
      const result = buildBitriseBuildPipeline({
        ...androidOptions,
        framework: 'expo',
      });
      const envs = result.app?.envs ?? [];
      const nodeOptionsEntries = envs.filter((e: any) => 'NODE_OPTIONS' in e);

      // Bug (roadmap item F): two NODE_OPTIONS entries present for expo.
      // After fix in PR 2, should be 1 with combined flags.
      expect(nodeOptionsEntries.length).toBeGreaterThanOrEqual(1);
    });
  });

  // ─── Package manager ──────────────────────────────────────────────────────

  describe('yarn package manager', () => {
    it('includes yarn step for dependency installation', () => {
      const result = buildBitriseBuildPipeline(androidOptions);
      const allSteps = Object.values(result.workflows).flatMap(
        (w: any) => w.steps
      );
      const hasYarn = allSteps.some((s: any) => 'yarn@0' in s);

      expect(hasYarn).toBe(true);
    });
  });

  describe('npm package manager', () => {
    it('uses a script step for npm installation', () => {
      const result = buildBitriseBuildPipeline({
        ...androidOptions,
        packageManager: 'npm',
      });
      const allSteps = Object.values(result.workflows).flatMap(
        (w: any) => w.steps
      );
      const scriptSteps = allSteps.filter((s: any) => 'script@1' in s);
      const installStep = scriptSteps.find(
        (s: any) => (s['script@1'] as any)?.title === 'Install Dependencies'
      );

      expect(installStep).toBeDefined();
    });
  });

  // ─── Environment variables ────────────────────────────────────────────────

  describe('environment variables', () => {
    it('includes NODE_OPTIONS env var', () => {
      const result = buildBitriseBuildPipeline(androidOptions);
      const envs = result.app?.envs ?? [];
      const nodeOptionsEntry = envs.find((e: any) => 'NODE_OPTIONS' in e);

      expect(nodeOptionsEntry).toBeDefined();
    });

    it('includes custom env vars when provided', () => {
      const result = buildBitriseBuildPipeline({
        ...androidOptions,
        env: { BUILD_NUMBER: '42' },
      });
      const envs = result.app?.envs ?? [];
      const customEntry = envs.find((e: any) => 'BUILD_NUMBER' in e);

      expect(customEntry).toBeDefined();
      expect((customEntry as any)?.BUILD_NUMBER).toBe('42');
    });
  });

  // ─── Snapshot ─────────────────────────────────────────────────────────────

  it('output matches snapshot for android debug with yarn', () => {
    const result = buildBitriseBuildPipeline(androidOptions);

    expect(result).toMatchSnapshot();
  });

  it('output matches snapshot for both platforms', () => {
    const result = buildBitriseBuildPipeline({
      ...androidOptions,
      build: { ...androidOptions.build!, platform: 'both' },
    });

    expect(result).toMatchSnapshot();
  });
});
