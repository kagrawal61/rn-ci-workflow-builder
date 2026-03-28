import { buildGitlabStaticAnalysisPipeline } from '../gitlabStaticAnalysis';
import { WorkflowOptions } from '../../types';

describe('buildGitlabStaticAnalysisPipeline', () => {
  const defaultOptions: WorkflowOptions = {
    platform: 'gitlab',
    packageManager: 'yarn',
  };

  describe('output structure', () => {
    it('returns stages and static-analysis job', () => {
      const result = buildGitlabStaticAnalysisPipeline(defaultOptions);

      expect(result.stages).toEqual(['static-analysis']);
      expect(result['static-analysis']).toBeDefined();
    });

    it('uses the correct node Docker image', () => {
      const result = buildGitlabStaticAnalysisPipeline({
        ...defaultOptions,
        nodeVersions: [20],
      });
      const job = result['static-analysis'] as Record<string, unknown>;

      expect(job.image).toBe('node:20');
    });

    it('uses a custom node version', () => {
      const result = buildGitlabStaticAnalysisPipeline({
        ...defaultOptions,
        nodeVersions: [18],
      });
      const job = result['static-analysis'] as Record<string, unknown>;

      expect(job.image).toBe('node:18');
    });

    it('includes cache configuration', () => {
      const result = buildGitlabStaticAnalysisPipeline(defaultOptions);
      const job = result['static-analysis'] as Record<string, unknown>;

      expect(job.cache).toBeDefined();
    });

    it('includes rules', () => {
      const result = buildGitlabStaticAnalysisPipeline(defaultOptions);
      const job = result['static-analysis'] as Record<string, unknown>;

      expect(Array.isArray(job.rules)).toBe(true);
      expect((job.rules as unknown[]).length).toBeGreaterThan(0);
    });
  });

  describe('scripts', () => {
    it('uses yarn install --immutable for yarn', () => {
      const result = buildGitlabStaticAnalysisPipeline(defaultOptions);
      const job = result['static-analysis'] as Record<string, unknown>;
      const script = job.script as string[];

      expect(script[0]).toBe('yarn install --immutable');
    });

    it('uses npm ci for npm', () => {
      const result = buildGitlabStaticAnalysisPipeline({
        ...defaultOptions,
        packageManager: 'npm',
      });
      const job = result['static-analysis'] as Record<string, unknown>;
      const script = job.script as string[];

      expect(script[0]).toBe('npm ci');
    });

    it('includes TypeScript check by default', () => {
      const result = buildGitlabStaticAnalysisPipeline(defaultOptions);
      const job = result['static-analysis'] as Record<string, unknown>;
      const script = job.script as string[];

      expect(script.some(s => s.includes('tsc'))).toBe(true);
    });

    it('excludes TypeScript check when disabled', () => {
      const result = buildGitlabStaticAnalysisPipeline({
        ...defaultOptions,
        staticAnalysis: { typescript: false },
      });
      const job = result['static-analysis'] as Record<string, unknown>;
      const script = job.script as string[];

      expect(script.some(s => s.includes('tsc'))).toBe(false);
    });

    it('includes ESLint by default', () => {
      const result = buildGitlabStaticAnalysisPipeline(defaultOptions);
      const job = result['static-analysis'] as Record<string, unknown>;
      const script = job.script as string[];

      expect(script.some(s => s.includes('lint'))).toBe(true);
    });

    it('includes Prettier by default', () => {
      const result = buildGitlabStaticAnalysisPipeline(defaultOptions);
      const job = result['static-analysis'] as Record<string, unknown>;
      const script = job.script as string[];

      expect(script.some(s => s.includes('format:check'))).toBe(true);
    });

    it('includes unit tests by default', () => {
      const result = buildGitlabStaticAnalysisPipeline(defaultOptions);
      const job = result['static-analysis'] as Record<string, unknown>;
      const script = job.script as string[];

      expect(script.some(s => s.includes('test'))).toBe(true);
    });
  });

  describe('triggers', () => {
    it('defaults to push and MR rules when no triggers configured', () => {
      const result = buildGitlabStaticAnalysisPipeline(defaultOptions);
      const job = result['static-analysis'] as Record<string, unknown>;
      const rules = job.rules as Array<Record<string, string>>;

      expect(rules.some(r => r.if?.includes('push'))).toBe(true);
      expect(rules.some(r => r.if?.includes('merge_request'))).toBe(true);
    });

    it('uses custom push branches when provided', () => {
      const result = buildGitlabStaticAnalysisPipeline({
        ...defaultOptions,
        triggers: { push: { branches: ['develop'] } },
      });
      const job = result['static-analysis'] as Record<string, unknown>;
      const rules = job.rules as Array<Record<string, string>>;

      expect(rules.some(r => r.if?.includes('develop'))).toBe(true);
    });
  });

  describe('notifications', () => {
    it('adds after_script for Slack notification', () => {
      const result = buildGitlabStaticAnalysisPipeline({
        ...defaultOptions,
        staticAnalysis: { notification: 'slack' },
      });
      const job = result['static-analysis'] as Record<string, unknown>;

      expect(job.after_script).toBeDefined();
      const afterScript = job.after_script as string[];
      expect(afterScript.some(s => s.includes('SLACK_WEBHOOK_URL'))).toBe(true);
    });

    it('does not add after_script when notification is none', () => {
      const result = buildGitlabStaticAnalysisPipeline({
        ...defaultOptions,
        staticAnalysis: { notification: 'none' },
      });
      const job = result['static-analysis'] as Record<string, unknown>;

      expect(job.after_script).toBeUndefined();
    });
  });

  it('output matches snapshot for default options', () => {
    const result = buildGitlabStaticAnalysisPipeline(defaultOptions);

    expect(result).toMatchSnapshot();
  });

  it('output matches snapshot for npm package manager', () => {
    const result = buildGitlabStaticAnalysisPipeline({
      ...defaultOptions,
      packageManager: 'npm',
    });

    expect(result).toMatchSnapshot();
  });
});
