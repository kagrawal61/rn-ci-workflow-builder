/**
 * Integration tests: full config → YAML → parse back → assert structure
 *
 * No mocks used. Tests the complete generation pipeline end-to-end.
 * Imports from src/index.ts so all built-in presets are auto-registered.
 */
import * as yaml from 'js-yaml';
import { generateWorkflow } from '../index';
import { PipelineKind } from '../types';

describe('Integration: Full Workflow Generation Pipeline', () => {
  // ─── GitHub Actions: Static Analysis ─────────────────────────────────────

  describe('GitHub Actions — Static Analysis', () => {
    it('generates valid parseable YAML with yarn', () => {
      const { yaml: yamlStr } = generateWorkflow({
        kind: 'static-analysis',
        options: {
          platform: 'github',
          packageManager: 'yarn',
          nodeVersions: [20],
        },
      });

      expect(typeof yamlStr).toBe('string');
      const parsed = yaml.load(yamlStr) as Record<string, any>;

      expect(parsed.name).toBeDefined();
      expect(parsed.on).toBeDefined();
      expect(parsed.jobs).toBeDefined();
      expect(parsed.jobs.static_analysis).toBeDefined();
      expect(parsed.jobs.static_analysis['runs-on']).toBe('ubuntu-latest');
      expect(Array.isArray(parsed.jobs.static_analysis.steps)).toBe(true);
      expect(parsed.jobs.static_analysis.steps.length).toBeGreaterThan(0);
    });

    it('generates valid parseable YAML with npm', () => {
      const { yaml: yamlStr } = generateWorkflow({
        kind: 'static-analysis',
        options: {
          platform: 'github',
          packageManager: 'npm',
          nodeVersions: [18],
        },
      });

      const parsed = yaml.load(yamlStr) as Record<string, any>;
      const steps = parsed.jobs.static_analysis.steps;

      expect(steps.some((s: any) => s.run === 'npm ci')).toBe(true);
    });

    it('includes TypeScript step by default', () => {
      const { yaml: yamlStr } = generateWorkflow({
        kind: 'static-analysis',
        options: { platform: 'github' },
      });

      const parsed = yaml.load(yamlStr) as Record<string, any>;
      const steps = parsed.jobs.static_analysis.steps;

      expect(steps.some((s: any) => s.name === 'TypeScript')).toBe(true);
    });

    it('currently ignores staticAnalysis options due to validator dropping them (bug H — to be fixed in PR 2)', () => {
      // Bug H: validateWorkflowOptionsSchema drops the `staticAnalysis` field.
      // As a result, the preset falls back to defaults (all checks enabled)
      // even when the caller explicitly disables TypeScript.
      // After PR 2 fix, this test should be updated to assert TypeScript is excluded.
      const { yaml: yamlStr } = generateWorkflow({
        kind: 'static-analysis',
        options: {
          platform: 'github',
          staticAnalysis: {
            typescript: false,
            eslint: true,
            prettier: true,
            unitTests: true,
          },
        },
      });

      const parsed = yaml.load(yamlStr) as Record<string, any>;
      const steps = parsed.jobs.static_analysis.steps;

      // Current broken behavior: TypeScript step is still included despite being disabled
      expect(steps.some((s: any) => s.name === 'TypeScript')).toBe(true);
    });

    it('includes all default analysis steps', () => {
      const { yaml: yamlStr } = generateWorkflow({
        kind: 'static-analysis',
        options: { platform: 'github', packageManager: 'yarn' },
      });

      const parsed = yaml.load(yamlStr) as Record<string, any>;
      const stepNames = parsed.jobs.static_analysis.steps.map(
        (s: any) => s.name
      );

      expect(stepNames).toContain('TypeScript');
      expect(stepNames).toContain('ESLint');
      expect(stepNames).toContain('Prettier');
      expect(stepNames).toContain('Unit tests');
    });

    it('output structure matches snapshot', () => {
      const { yaml: yamlStr } = generateWorkflow({
        kind: 'static-analysis',
        options: {
          platform: 'github',
          packageManager: 'yarn',
          nodeVersions: [20],
        },
      });

      expect(yaml.load(yamlStr)).toMatchSnapshot();
    });
  });

  // ─── GitHub Actions: Build — Android ─────────────────────────────────────

  describe('GitHub Actions — Build (Android)', () => {
    const androidConfig = {
      kind: 'build' as PipelineKind,
      options: {
        platform: 'github' as const,
        packageManager: 'yarn' as const,
        build: {
          platform: 'android' as const,
          variant: 'debug' as const,
          storage: 'github' as const,
          notification: 'none' as const,
        },
      },
    };

    it('generates valid parseable YAML', () => {
      const { yaml: yamlStr } = generateWorkflow(androidConfig);

      expect(typeof yamlStr).toBe('string');
      const parsed = yaml.load(yamlStr) as Record<string, any>;

      expect(parsed.name).toBeDefined();
      expect(parsed.on).toBeDefined();
      expect(parsed.jobs).toBeDefined();
      expect(parsed.jobs['build-android']).toBeDefined();
      expect(parsed.jobs['build-android']['runs-on']).toBe('ubuntu-latest');
      expect(Array.isArray(parsed.jobs['build-android'].steps)).toBe(true);
    });

    it('does not include iOS job for android-only build', () => {
      const { yaml: yamlStr } = generateWorkflow(androidConfig);
      const parsed = yaml.load(yamlStr) as Record<string, any>;

      expect(parsed.jobs['build-ios']).toBeUndefined();
    });

    it('generates a secretsSummary', () => {
      const { secretsSummary } = generateWorkflow(androidConfig);

      expect(secretsSummary).toBeDefined();
    });

    it('output structure matches snapshot', () => {
      const { yaml: yamlStr } = generateWorkflow(androidConfig);

      expect(yaml.load(yamlStr)).toMatchSnapshot();
    });
  });

  // ─── GitHub Actions: Build — Both Platforms ───────────────────────────────

  describe('GitHub Actions — Build (Both platforms)', () => {
    it('generates both build-android and build-ios jobs', () => {
      const { yaml: yamlStr } = generateWorkflow({
        kind: 'build' as PipelineKind,
        options: {
          platform: 'github',
          build: {
            platform: 'both',
            variant: 'debug',
            storage: 'github',
            notification: 'none',
          },
        },
      });

      const parsed = yaml.load(yamlStr) as Record<string, any>;

      expect(parsed.jobs['build-android']).toBeDefined();
      expect(parsed.jobs['build-ios']).toBeDefined();
      expect(parsed.jobs['build-android']['runs-on']).toBe('ubuntu-latest');
      expect(parsed.jobs['build-ios']['runs-on']).toBe('macos-latest');
    });

    it('output structure matches snapshot', () => {
      const { yaml: yamlStr } = generateWorkflow({
        kind: 'build' as PipelineKind,
        options: {
          platform: 'github',
          build: {
            platform: 'both',
            variant: 'debug',
            storage: 'github',
            notification: 'none',
          },
        },
      });

      expect(yaml.load(yamlStr)).toMatchSnapshot();
    });
  });

  // ─── GitHub Actions: Build — Release variant ─────────────────────────────

  describe('GitHub Actions — Build (Release)', () => {
    it('generates a build workflow for release variant', () => {
      const { yaml: yamlStr } = generateWorkflow({
        kind: 'build' as PipelineKind,
        options: {
          platform: 'github',
          build: {
            platform: 'android',
            variant: 'release',
            storage: 'github',
            notification: 'none',
          },
        },
      });

      const parsed = yaml.load(yamlStr) as Record<string, any>;
      expect(parsed.jobs['build-android']).toBeDefined();
    });
  });

  // ─── Bitrise: Static Analysis ─────────────────────────────────────────────

  describe('Bitrise — Static Analysis', () => {
    it('generates valid parseable Bitrise YAML', () => {
      const { yaml: yamlStr } = generateWorkflow({
        kind: 'static-analysis',
        options: { platform: 'bitrise', packageManager: 'yarn' },
      });

      expect(typeof yamlStr).toBe('string');
      const parsed = yaml.load(yamlStr) as Record<string, any>;

      expect(parsed.format_version).toBe(13);
      expect(parsed.workflows).toBeDefined();
      expect(parsed.workflows['rn-static-analysis']).toBeDefined();
      expect(Array.isArray(parsed.workflows['rn-static-analysis'].steps)).toBe(
        true
      );
      expect(
        parsed.workflows['rn-static-analysis'].steps.length
      ).toBeGreaterThan(0);
    });

    it('output structure matches snapshot', () => {
      const { yaml: yamlStr } = generateWorkflow({
        kind: 'static-analysis',
        options: { platform: 'bitrise', packageManager: 'yarn' },
      });

      expect(yaml.load(yamlStr)).toMatchSnapshot();
    });
  });

  // ─── Bitrise: Build ───────────────────────────────────────────────────────

  describe('Bitrise — Build', () => {
    const bitriseAndroidConfig = {
      kind: 'build' as PipelineKind,
      options: {
        platform: 'bitrise' as const,
        build: {
          platform: 'android' as const,
          variant: 'debug' as const,
          storage: 'bitrise' as const,
          notification: 'none' as const,
        },
      },
    };

    it('generates valid parseable Bitrise build YAML', () => {
      const { yaml: yamlStr } = generateWorkflow(bitriseAndroidConfig);

      expect(typeof yamlStr).toBe('string');
      const parsed = yaml.load(yamlStr) as Record<string, any>;

      expect(parsed.format_version).toBeDefined();
      expect(typeof parsed.format_version).toBe('number');
      expect(parsed.workflows).toBeDefined();
    });

    it('output structure matches snapshot', () => {
      const { yaml: yamlStr } = generateWorkflow(bitriseAndroidConfig);

      expect(yaml.load(yamlStr)).toMatchSnapshot();
    });
  });

  // ─── GitHub Actions: Expo Framework ──────────────────────────────────────

  describe('GitHub Actions — Expo Build', () => {
    it('generates a workflow for expo android build', () => {
      const { yaml: yamlStr } = generateWorkflow({
        kind: 'build' as PipelineKind,
        options: {
          platform: 'github',
          framework: 'expo',
          build: {
            platform: 'android',
            variant: 'debug',
            storage: 'github',
            notification: 'none',
          },
        },
      });

      const parsed = yaml.load(yamlStr) as Record<string, any>;
      expect(parsed.jobs['build-android']).toBeDefined();
    });

    it('currently falls back to react-native project_type for expo (bug H — framework dropped by validator)', () => {
      // Bug H: validateWorkflowOptionsSchema does not pass `framework` through.
      // After PR 2 fix, parsed.project_type should be 'expo'.
      const { yaml: yamlStr } = generateWorkflow({
        kind: 'static-analysis',
        options: {
          platform: 'bitrise',
          framework: 'expo',
          packageManager: 'yarn',
        },
      });

      const parsed = yaml.load(yamlStr) as Record<string, any>;
      // Current broken behavior: framework is dropped → falls back to react-native
      expect(parsed.project_type).toBe('react-native');
    });
  });

  // ─── nodeVersions: matrix emitted for multiple versions (bug 1.2 fixed) ──

  describe('nodeVersions handling', () => {
    it('emits matrix strategy and uses matrix expression when multiple nodeVersions provided', () => {
      const { yaml: yamlStr } = generateWorkflow({
        kind: 'static-analysis',
        options: {
          platform: 'github',
          nodeVersions: [18, 20, 22],
        },
      });

      const parsed = yaml.load(yamlStr) as Record<string, any>;
      const job = parsed.jobs.static_analysis;
      const setupNode = job.steps.find((s: any) => s.name === 'Setup Node');

      expect(job.strategy?.matrix?.['node-version']).toEqual([18, 20, 22]);
      expect(setupNode?.with?.['node-version']).toBe(
        '${{ matrix.node-version }}'
      );
    });

    it('uses a direct version value (no matrix) when a single nodeVersion is provided', () => {
      const { yaml: yamlStr } = generateWorkflow({
        kind: 'static-analysis',
        options: { platform: 'github', nodeVersions: [20] },
      });

      const parsed = yaml.load(yamlStr) as Record<string, any>;
      const job = parsed.jobs.static_analysis;
      const setupNode = job.steps.find((s: any) => s.name === 'Setup Node');

      expect(job.strategy).toBeUndefined();
      expect(setupNode?.with?.['node-version']).toBe(20);
    });
  });

  // ─── Custom triggers ──────────────────────────────────────────────────────

  describe('Custom triggers', () => {
    it('uses custom push branches', () => {
      const { yaml: yamlStr } = generateWorkflow({
        kind: 'static-analysis',
        options: {
          platform: 'github',
          triggers: {
            push: { branches: ['develop', 'main'] },
          },
        },
      });

      const parsed = yaml.load(yamlStr) as Record<string, any>;
      expect(parsed.on.push?.branches).toEqual(
        expect.arrayContaining(['develop', 'main'])
      );
    });

    it('includes workflowDispatch trigger when set', () => {
      const { yaml: yamlStr } = generateWorkflow({
        kind: 'static-analysis',
        options: {
          platform: 'github',
          triggers: { workflowDispatch: true },
        },
      });

      const parsed = yaml.load(yamlStr) as Record<string, any>;
      expect(parsed.on.workflow_dispatch).toBeDefined();
    });
  });

  // ─── Package managers ─────────────────────────────────────────────────────

  describe('npm package manager in build preset', () => {
    it('generates a valid build workflow using npm', () => {
      const { yaml: yamlStr } = generateWorkflow({
        kind: 'build' as PipelineKind,
        options: {
          platform: 'github',
          packageManager: 'npm',
          build: {
            platform: 'android',
            variant: 'debug',
            storage: 'github',
            notification: 'none',
          },
        },
      });

      const parsed = yaml.load(yamlStr) as Record<string, any>;
      expect(parsed.jobs['build-android']).toBeDefined();
    });
  });

  // ─── Android output type ──────────────────────────────────────────────────

  describe('Android output type (bug C — androidOutputType dropped by validator)', () => {
    it('currently falls back to apk regardless of AAB selection (known bug C)', () => {
      // Bug C: validateBuildSchema drops androidOutputType.
      // After PR 2 fix, the AAB gradle task should appear in the generated steps.
      const { yaml: yamlStr } = generateWorkflow({
        kind: 'build' as PipelineKind,
        options: {
          platform: 'github',
          build: {
            platform: 'android',
            variant: 'release',
            storage: 'github',
            notification: 'none',
            androidOutputType: 'aab',
          },
        },
      });

      const parsed = yaml.load(yamlStr) as Record<string, any>;
      // Workflow generates fine even if output type falls back
      expect(parsed.jobs['build-android']).toBeDefined();
    });
  });

  // ─── Secrets summary: static-analysis (bug 1.5) ──────────────────────────

  describe('Secrets summary — Static Analysis (bug 1.5)', () => {
    it('returns a non-undefined secretsSummary containing SLACK_WEBHOOK when notification is slack', () => {
      const { secretsSummary } = generateWorkflow({
        kind: 'static-analysis',
        options: {
          platform: 'github',
          staticAnalysis: { notification: 'slack' },
        },
      });

      expect(secretsSummary).toBeDefined();
      expect(secretsSummary).toContain('SLACK_WEBHOOK');
    });

    it('returns a non-undefined secretsSummary containing SLACK_WEBHOOK when notification is both', () => {
      const { secretsSummary } = generateWorkflow({
        kind: 'static-analysis',
        options: {
          platform: 'github',
          staticAnalysis: { notification: 'both' },
        },
      });

      expect(secretsSummary).toBeDefined();
      expect(secretsSummary).toContain('SLACK_WEBHOOK');
    });

    it('returns undefined secretsSummary when notification is none', () => {
      const { secretsSummary } = generateWorkflow({
        kind: 'static-analysis',
        options: {
          platform: 'github',
          staticAnalysis: { notification: 'none' },
        },
      });

      expect(secretsSummary).toBeUndefined();
    });

    it('returns undefined secretsSummary when no staticAnalysis options are provided', () => {
      const { secretsSummary } = generateWorkflow({
        kind: 'static-analysis',
        options: { platform: 'github' },
      });

      expect(secretsSummary).toBeUndefined();
    });

    it('returns undefined secretsSummary when notification is pr-comment', () => {
      const { secretsSummary } = generateWorkflow({
        kind: 'static-analysis',
        options: {
          platform: 'github',
          staticAnalysis: { notification: 'pr-comment' },
        },
      });

      expect(secretsSummary).toBeUndefined();
    });
  });

  // ─── Error cases ──────────────────────────────────────────────────────────

  describe('Error handling', () => {
    it('throws for an unknown preset kind', () => {
      expect(() =>
        generateWorkflow({ kind: 'nonexistent-preset' as PipelineKind })
      ).toThrow();
    });

    it('throws when build options are missing for build preset', () => {
      expect(() =>
        generateWorkflow({
          kind: 'build' as PipelineKind,
          options: { platform: 'github' },
        })
      ).toThrow();
    });

    it('throws for invalid platform in build options', () => {
      expect(() =>
        generateWorkflow({
          kind: 'build' as PipelineKind,
          options: {
            platform: 'github',
            build: {
              platform: 'invalid' as any,
              variant: 'debug',
              storage: 'github',
              notification: 'none',
            },
          },
        })
      ).toThrow();
    });

    it('throws for invalid storage value', () => {
      expect(() =>
        generateWorkflow({
          kind: 'build' as PipelineKind,
          options: {
            platform: 'github',
            build: {
              platform: 'android',
              variant: 'debug',
              storage: 'invalid-storage' as any,
              notification: 'none',
            },
          },
        })
      ).toThrow();
    });
  });

  // ─── CircleCI ────────────────────────────────────────────────────────────

  describe('CircleCI — Static Analysis', () => {
    it('generates valid parseable YAML with yarn', () => {
      const { yaml: yamlStr } = generateWorkflow({
        kind: 'static-analysis',
        options: { platform: 'circleci', packageManager: 'yarn', nodeVersions: [20] },
      });
      const parsed = yaml.load(yamlStr) as Record<string, any>;
      expect(parsed.version).toBeCloseTo(2.1);
      expect(parsed.jobs['static-analysis']).toBeDefined();
    });

    it('includes TypeScript run step', () => {
      const { yaml: yamlStr } = generateWorkflow({
        kind: 'static-analysis',
        options: { platform: 'circleci', packageManager: 'yarn', nodeVersions: [18] },
      });
      const parsed = yaml.load(yamlStr) as Record<string, any>;
      const steps: Array<string | Record<string, unknown>> = parsed.jobs['static-analysis'].steps;
      const hasTs = steps.some(s =>
        typeof s === 'object' && s !== null && 'run' in s &&
        typeof (s as any).run === 'object' && ((s as any).run.command ?? '').includes('tsc')
      );
      expect(hasTs).toBe(true);
    });

    it('output structure matches snapshot', () => {
      const { yaml: yamlStr } = generateWorkflow({
        kind: 'static-analysis',
        options: { platform: 'circleci', packageManager: 'yarn', nodeVersions: [20] },
      });
      expect(yamlStr).toMatchSnapshot();
    });
  });

  describe('CircleCI — Build (Android)', () => {
    it('generates valid parseable YAML', () => {
      const { yaml: yamlStr } = generateWorkflow({
        kind: 'build',
        options: {
          platform: 'circleci',
          build: { platform: 'android', variant: 'release', storage: 'github', notification: 'none' },
        },
      });
      const parsed = yaml.load(yamlStr) as Record<string, any>;
      expect(parsed.version).toBeCloseTo(2.1);
      expect(parsed.jobs.build).toBeDefined();
    });

    it('output structure matches snapshot', () => {
      const { yaml: yamlStr } = generateWorkflow({
        kind: 'build',
        options: {
          platform: 'circleci',
          build: { platform: 'android', variant: 'release', storage: 'github', notification: 'none' },
        },
      });
      expect(yamlStr).toMatchSnapshot();
    });
  });

  // ─── GitLab CI ───────────────────────────────────────────────────────────

  describe('GitLab CI — Static Analysis', () => {
    it('generates valid parseable YAML with yarn', () => {
      const { yaml: yamlStr } = generateWorkflow({
        kind: 'static-analysis',
        options: { platform: 'gitlab', packageManager: 'yarn', nodeVersions: [20] },
      });
      const parsed = yaml.load(yamlStr) as Record<string, any>;
      expect(parsed.stages).toContain('static-analysis');
      expect(parsed['static-analysis'].image).toBe('node:20');
    });

    it('includes TypeScript check in script', () => {
      const { yaml: yamlStr } = generateWorkflow({
        kind: 'static-analysis',
        options: { platform: 'gitlab', packageManager: 'yarn', nodeVersions: [18] },
      });
      const parsed = yaml.load(yamlStr) as Record<string, any>;
      const script: string[] = parsed['static-analysis'].script;
      expect(script.some(s => s.includes('tsc'))).toBe(true);
    });

    it('output structure matches snapshot', () => {
      const { yaml: yamlStr } = generateWorkflow({
        kind: 'static-analysis',
        options: { platform: 'gitlab', packageManager: 'yarn', nodeVersions: [20] },
      });
      expect(yamlStr).toMatchSnapshot();
    });
  });

  describe('GitLab CI — Build (Android)', () => {
    it('generates valid parseable YAML', () => {
      const { yaml: yamlStr } = generateWorkflow({
        kind: 'build',
        options: {
          platform: 'gitlab',
          build: { platform: 'android', variant: 'release', storage: 'github', notification: 'none' },
        },
      });
      const parsed = yaml.load(yamlStr) as Record<string, any>;
      expect(parsed.stages).toContain('build');
      expect(parsed.build.artifacts).toBeDefined();
    });

    it('output structure matches snapshot', () => {
      const { yaml: yamlStr } = generateWorkflow({
        kind: 'build',
        options: {
          platform: 'gitlab',
          build: { platform: 'android', variant: 'release', storage: 'github', notification: 'none' },
        },
      });
      expect(yamlStr).toMatchSnapshot();
    });
  });
});
