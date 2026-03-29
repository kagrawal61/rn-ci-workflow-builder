import { buildGitlabBuildPipeline } from '../gitlabBuildPreset';
import { WorkflowOptions } from '../../types';

describe('buildGitlabBuildPipeline', () => {
  const defaultOptions: WorkflowOptions = {
    platform: 'gitlab',
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
    it('returns stages and build job', () => {
      const result = buildGitlabBuildPipeline(defaultOptions);

      expect(result.stages).toEqual(['build']);
      expect(result['build']).toBeDefined();
    });

    it('uses the correct node Docker image', () => {
      const result = buildGitlabBuildPipeline({
        ...defaultOptions,
        nodeVersions: [20],
      });
      const job = result['build'] as Record<string, unknown>;

      expect(job.image).toBe('node:20');
    });

    it('includes artifacts section', () => {
      const result = buildGitlabBuildPipeline(defaultOptions);
      const job = result['build'] as Record<string, unknown>;

      expect(job.artifacts).toBeDefined();
    });

    it('sets artifact expire_in to 30 days', () => {
      const result = buildGitlabBuildPipeline(defaultOptions);
      const job = result['build'] as Record<string, unknown>;
      const artifacts = job.artifacts as Record<string, unknown>;

      expect(artifacts.expire_in).toBe('30 days');
    });
  });

  describe('build commands', () => {
    it('includes assembleRelease for release APK build', () => {
      const result = buildGitlabBuildPipeline(defaultOptions);
      const job = result['build'] as Record<string, unknown>;
      const script = job.script as string[];

      expect(script.some(s => s.includes('assembleRelease'))).toBe(true);
    });

    it('includes assembleDebug for debug build', () => {
      const result = buildGitlabBuildPipeline({
        ...defaultOptions,
        build: { ...defaultOptions.build, variant: 'debug' },
      });
      const job = result['build'] as Record<string, unknown>;
      const script = job.script as string[];

      expect(script.some(s => s.includes('assembleDebug'))).toBe(true);
    });

    it('includes bundleRelease for AAB output', () => {
      const result = buildGitlabBuildPipeline({
        ...defaultOptions,
        build: { ...defaultOptions.build, androidOutputType: 'aab' },
      });
      const job = result['build'] as Record<string, unknown>;
      const script = job.script as string[];

      expect(script.some(s => s.includes('bundleRelease'))).toBe(true);
    });

    it('includes both assemble and bundle tasks for both output', () => {
      const result = buildGitlabBuildPipeline({
        ...defaultOptions,
        build: { ...defaultOptions.build, androidOutputType: 'both' },
      });
      const job = result['build'] as Record<string, unknown>;
      const script = job.script as string[];
      const buildCmd =
        script.find(
          s => s.includes('assembleRelease') || s.includes('assembleDebug')
        ) ?? '';

      expect(buildCmd).toContain('assembleRelease');
      expect(buildCmd).toContain('bundleRelease');
    });
  });

  describe('static analysis', () => {
    it('includes TypeScript check when includeStaticAnalysis is true', () => {
      const result = buildGitlabBuildPipeline({
        ...defaultOptions,
        build: { ...defaultOptions.build, includeStaticAnalysis: true },
      });
      const job = result['build'] as Record<string, unknown>;
      const script = job.script as string[];

      expect(script.some(s => s.includes('tsc'))).toBe(true);
    });

    it('excludes TypeScript check when includeStaticAnalysis is false', () => {
      const result = buildGitlabBuildPipeline(defaultOptions);
      const job = result['build'] as Record<string, unknown>;
      const script = job.script as string[];

      expect(script.some(s => s.includes('tsc'))).toBe(false);
    });
  });

  describe('notifications', () => {
    it('adds Slack after_script when notification is slack', () => {
      const result = buildGitlabBuildPipeline({
        ...defaultOptions,
        build: { ...defaultOptions.build, notification: 'slack' },
      });
      const job = result['build'] as Record<string, unknown>;

      expect(job.after_script).toBeDefined();
      const afterScript = job.after_script as string[];
      expect(afterScript.some(s => s.includes('SLACK_WEBHOOK_URL'))).toBe(true);
    });
  });

  it('output matches snapshot for default options', () => {
    const result = buildGitlabBuildPipeline(defaultOptions);

    expect(result).toMatchSnapshot();
  });
});
