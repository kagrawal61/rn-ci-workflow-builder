import { buildCodemagicStaticAnalysisPipeline } from '../codemagicStaticAnalysis';
import { WorkflowOptions } from '../../types';

describe('buildCodemagicStaticAnalysisPipeline', () => {
  const defaultOptions: WorkflowOptions = {
    platform: 'codemagic',
    packageManager: 'yarn',
  };

  describe('output structure', () => {
    it('returns a workflows object with static-analysis key', () => {
      const result = buildCodemagicStaticAnalysisPipeline(defaultOptions);
      const workflows = result.workflows as Record<string, unknown>;

      expect(workflows['static-analysis']).toBeDefined();
    });

    it('uses linux_x2 instance type', () => {
      const result = buildCodemagicStaticAnalysisPipeline(defaultOptions);
      const workflows = result.workflows as Record<string, unknown>;
      const workflow = workflows['static-analysis'] as Record<string, unknown>;

      expect(workflow.instance_type).toBe('linux_x2');
    });

    it('sets the correct node version in environment', () => {
      const result = buildCodemagicStaticAnalysisPipeline({
        ...defaultOptions,
        nodeVersions: [20],
      });
      const workflows = result.workflows as Record<string, unknown>;
      const workflow = workflows['static-analysis'] as Record<string, unknown>;
      const env = workflow.environment as Record<string, unknown>;

      expect(env.node).toBe(20);
    });

    it('includes cache configuration', () => {
      const result = buildCodemagicStaticAnalysisPipeline(defaultOptions);
      const workflows = result.workflows as Record<string, unknown>;
      const workflow = workflows['static-analysis'] as Record<string, unknown>;

      expect(workflow.cache).toBeDefined();
    });

    it('includes triggering configuration', () => {
      const result = buildCodemagicStaticAnalysisPipeline(defaultOptions);
      const workflows = result.workflows as Record<string, unknown>;
      const workflow = workflows['static-analysis'] as Record<string, unknown>;

      expect(workflow.triggering).toBeDefined();
    });
  });

  describe('scripts', () => {
    it('first script installs dependencies with yarn', () => {
      const result = buildCodemagicStaticAnalysisPipeline(defaultOptions);
      const workflows = result.workflows as Record<string, unknown>;
      const workflow = workflows['static-analysis'] as Record<string, unknown>;
      const scripts = workflow.scripts as Array<Record<string, string>>;

      expect(scripts[0].script).toBe('yarn install --immutable');
    });

    it('first script uses npm ci for npm', () => {
      const result = buildCodemagicStaticAnalysisPipeline({
        ...defaultOptions,
        packageManager: 'npm',
      });
      const workflows = result.workflows as Record<string, unknown>;
      const workflow = workflows['static-analysis'] as Record<string, unknown>;
      const scripts = workflow.scripts as Array<Record<string, string>>;

      expect(scripts[0].script).toBe('npm ci');
    });

    it('includes TypeScript check by default', () => {
      const result = buildCodemagicStaticAnalysisPipeline(defaultOptions);
      const workflows = result.workflows as Record<string, unknown>;
      const workflow = workflows['static-analysis'] as Record<string, unknown>;
      const scripts = workflow.scripts as Array<Record<string, string>>;

      expect(scripts.some(s => s.name === 'TypeScript check')).toBe(true);
    });

    it('excludes TypeScript check when disabled', () => {
      const result = buildCodemagicStaticAnalysisPipeline({
        ...defaultOptions,
        staticAnalysis: { typescript: false },
      });
      const workflows = result.workflows as Record<string, unknown>;
      const workflow = workflows['static-analysis'] as Record<string, unknown>;
      const scripts = workflow.scripts as Array<Record<string, string>>;

      expect(scripts.some(s => s.name === 'TypeScript check')).toBe(false);
    });

    it('includes ESLint by default', () => {
      const result = buildCodemagicStaticAnalysisPipeline(defaultOptions);
      const workflows = result.workflows as Record<string, unknown>;
      const workflow = workflows['static-analysis'] as Record<string, unknown>;
      const scripts = workflow.scripts as Array<Record<string, string>>;

      expect(scripts.some(s => s.name === 'ESLint')).toBe(true);
    });

    it('includes unit tests by default', () => {
      const result = buildCodemagicStaticAnalysisPipeline(defaultOptions);
      const workflows = result.workflows as Record<string, unknown>;
      const workflow = workflows['static-analysis'] as Record<string, unknown>;
      const scripts = workflow.scripts as Array<Record<string, string>>;

      expect(scripts.some(s => s.name === 'Unit tests')).toBe(true);
    });
  });

  describe('notifications', () => {
    it('adds Slack publishing when notification is slack', () => {
      const result = buildCodemagicStaticAnalysisPipeline({
        ...defaultOptions,
        staticAnalysis: { notification: 'slack' },
      });
      const workflows = result.workflows as Record<string, unknown>;
      const workflow = workflows['static-analysis'] as Record<string, unknown>;
      const publishing = workflow.publishing as Record<string, unknown>;

      expect(publishing?.slack).toBeDefined();
    });

    it('does not add publishing when notification is none', () => {
      const result = buildCodemagicStaticAnalysisPipeline({
        ...defaultOptions,
        staticAnalysis: { notification: 'none' },
      });
      const workflows = result.workflows as Record<string, unknown>;
      const workflow = workflows['static-analysis'] as Record<string, unknown>;

      expect(workflow.publishing).toBeUndefined();
    });
  });

  it('output matches snapshot for default options', () => {
    const result = buildCodemagicStaticAnalysisPipeline(defaultOptions);

    expect(result).toMatchSnapshot();
  });

  it('output matches snapshot for npm package manager', () => {
    const result = buildCodemagicStaticAnalysisPipeline({
      ...defaultOptions,
      packageManager: 'npm',
    });

    expect(result).toMatchSnapshot();
  });
});
