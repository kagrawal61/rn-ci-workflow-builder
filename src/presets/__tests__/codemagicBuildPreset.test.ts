import { buildCodemagicBuildPipeline } from '../codemagicBuildPreset';
import { WorkflowOptions } from '../../types';

describe('buildCodemagicBuildPipeline', () => {
  const defaultOptions: WorkflowOptions = {
    platform: 'codemagic',
    packageManager: 'yarn',
    build: {
      platform: 'android',
      variant: 'release',
      androidOutputType: 'apk',
      storage: 'github',
      notification: 'none',
      includeStaticAnalysis: false,
    },
  };

  describe('output structure', () => {
    it('returns a workflows object with build-android key', () => {
      const result = buildCodemagicBuildPipeline(defaultOptions);
      const workflows = result.workflows as Record<string, unknown>;

      expect(workflows['build-android']).toBeDefined();
    });

    it('uses linux_x2 instance type', () => {
      const result = buildCodemagicBuildPipeline(defaultOptions);
      const workflows = result.workflows as Record<string, unknown>;
      const workflow = workflows['build-android'] as Record<string, unknown>;

      expect(workflow.instance_type).toBe('linux_x2');
    });

    it('includes artifacts array', () => {
      const result = buildCodemagicBuildPipeline(defaultOptions);
      const workflows = result.workflows as Record<string, unknown>;
      const workflow = workflows['build-android'] as Record<string, unknown>;

      expect(Array.isArray(workflow.artifacts)).toBe(true);
      expect((workflow.artifacts as string[]).length).toBeGreaterThan(0);
    });
  });

  describe('build scripts', () => {
    it('includes assembleRelease for release APK build', () => {
      const result = buildCodemagicBuildPipeline(defaultOptions);
      const workflows = result.workflows as Record<string, unknown>;
      const workflow = workflows['build-android'] as Record<string, unknown>;
      const scripts = workflow.scripts as Array<Record<string, string>>;
      const buildScript = scripts.find(s => s.name === 'Build Android');

      expect(buildScript?.script).toContain('assembleRelease');
    });

    it('includes bundleRelease for AAB build', () => {
      const result = buildCodemagicBuildPipeline({
        ...defaultOptions,
        build: { ...defaultOptions.build, androidOutputType: 'aab' },
      });
      const workflows = result.workflows as Record<string, unknown>;
      const workflow = workflows['build-android'] as Record<string, unknown>;
      const scripts = workflow.scripts as Array<Record<string, string>>;
      const buildScript = scripts.find(s => s.name === 'Build Android');

      expect(buildScript?.script).toContain('bundleRelease');
    });
  });

  describe('static analysis', () => {
    it('includes TypeScript check when includeStaticAnalysis is true', () => {
      const result = buildCodemagicBuildPipeline({
        ...defaultOptions,
        build: { ...defaultOptions.build, includeStaticAnalysis: true },
      });
      const workflows = result.workflows as Record<string, unknown>;
      const workflow = workflows['build-android'] as Record<string, unknown>;
      const scripts = workflow.scripts as Array<Record<string, string>>;

      expect(scripts.some(s => s.name === 'TypeScript check')).toBe(true);
    });

    it('excludes TypeScript check when includeStaticAnalysis is false', () => {
      const result = buildCodemagicBuildPipeline(defaultOptions);
      const workflows = result.workflows as Record<string, unknown>;
      const workflow = workflows['build-android'] as Record<string, unknown>;
      const scripts = workflow.scripts as Array<Record<string, string>>;

      expect(scripts.some(s => s.name === 'TypeScript check')).toBe(false);
    });
  });

  describe('notifications', () => {
    it('adds Slack publishing when notification is slack', () => {
      const result = buildCodemagicBuildPipeline({
        ...defaultOptions,
        build: { ...defaultOptions.build, notification: 'slack' },
      });
      const workflows = result.workflows as Record<string, unknown>;
      const workflow = workflows['build-android'] as Record<string, unknown>;
      const publishing = workflow.publishing as Record<string, unknown>;

      expect(publishing?.slack).toBeDefined();
    });
  });

  it('output matches snapshot for default options', () => {
    const result = buildCodemagicBuildPipeline(defaultOptions);

    expect(result).toMatchSnapshot();
  });
});
