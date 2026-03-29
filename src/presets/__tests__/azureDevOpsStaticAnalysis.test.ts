import { buildAzureDevOpsStaticAnalysisPipeline } from '../azureDevOpsStaticAnalysis';
import { WorkflowOptions } from '../../types';

describe('buildAzureDevOpsStaticAnalysisPipeline', () => {
  const defaultOptions: WorkflowOptions = {
    platform: 'azure-devops',
    packageManager: 'yarn',
  };

  describe('output structure', () => {
    it('includes trigger section', () => {
      const result = buildAzureDevOpsStaticAnalysisPipeline(defaultOptions);

      expect(result.trigger).toBeDefined();
    });

    it('includes pr section', () => {
      const result = buildAzureDevOpsStaticAnalysisPipeline(defaultOptions);

      expect(result.pr).toBeDefined();
    });

    it('uses ubuntu-latest pool', () => {
      const result = buildAzureDevOpsStaticAnalysisPipeline(defaultOptions);
      const pool = result.pool as Record<string, string>;

      expect(pool.vmImage).toBe('ubuntu-latest');
    });

    it('includes stages array with StaticAnalysis stage', () => {
      const result = buildAzureDevOpsStaticAnalysisPipeline(defaultOptions);
      const stages = result.stages as Array<Record<string, unknown>>;

      expect(stages[0].stage).toBe('StaticAnalysis');
    });
  });

  describe('steps', () => {
    it('includes NodeTool task for Node.js setup', () => {
      const result = buildAzureDevOpsStaticAnalysisPipeline(defaultOptions);
      const stages = result.stages as Array<Record<string, unknown>>;
      const jobs = stages[0].jobs as Array<Record<string, unknown>>;
      const steps = jobs[0].steps as Array<Record<string, unknown>>;
      const nodeStep = steps.find(s => s.task === 'NodeTool@0');

      expect(nodeStep).toBeDefined();
    });

    it('uses correct Node.js version in NodeTool', () => {
      const result = buildAzureDevOpsStaticAnalysisPipeline({
        ...defaultOptions,
        nodeVersions: [20],
      });
      const stages = result.stages as Array<Record<string, unknown>>;
      const jobs = stages[0].jobs as Array<Record<string, unknown>>;
      const steps = jobs[0].steps as Array<Record<string, unknown>>;
      const nodeStep = steps.find(s => s.task === 'NodeTool@0') as Record<
        string,
        unknown
      >;
      const inputs = nodeStep.inputs as Record<string, string>;

      expect(inputs.versionSpec).toBe('20.x');
    });

    it('includes install dependencies step', () => {
      const result = buildAzureDevOpsStaticAnalysisPipeline(defaultOptions);
      const stages = result.stages as Array<Record<string, unknown>>;
      const jobs = stages[0].jobs as Array<Record<string, unknown>>;
      const steps = jobs[0].steps as Array<Record<string, unknown>>;
      const installStep = steps.find(
        s => s.displayName === 'Install dependencies'
      );

      expect(installStep).toBeDefined();
      expect((installStep as Record<string, string>).script).toContain('yarn');
    });

    it('includes TypeScript check step by default', () => {
      const result = buildAzureDevOpsStaticAnalysisPipeline(defaultOptions);
      const stages = result.stages as Array<Record<string, unknown>>;
      const jobs = stages[0].jobs as Array<Record<string, unknown>>;
      const steps = jobs[0].steps as Array<Record<string, unknown>>;
      const tsStep = steps.find(s => s.displayName === 'TypeScript check');

      expect(tsStep).toBeDefined();
    });

    it('excludes TypeScript check when disabled', () => {
      const result = buildAzureDevOpsStaticAnalysisPipeline({
        ...defaultOptions,
        staticAnalysis: { typescript: false },
      });
      const stages = result.stages as Array<Record<string, unknown>>;
      const jobs = stages[0].jobs as Array<Record<string, unknown>>;
      const steps = jobs[0].steps as Array<Record<string, unknown>>;
      const tsStep = steps.find(s => s.displayName === 'TypeScript check');

      expect(tsStep).toBeUndefined();
    });

    it('includes ESLint step by default', () => {
      const result = buildAzureDevOpsStaticAnalysisPipeline(defaultOptions);
      const stages = result.stages as Array<Record<string, unknown>>;
      const jobs = stages[0].jobs as Array<Record<string, unknown>>;
      const steps = jobs[0].steps as Array<Record<string, unknown>>;
      const eslintStep = steps.find(s => s.displayName === 'ESLint');

      expect(eslintStep).toBeDefined();
    });

    it('includes unit tests step by default', () => {
      const result = buildAzureDevOpsStaticAnalysisPipeline(defaultOptions);
      const stages = result.stages as Array<Record<string, unknown>>;
      const jobs = stages[0].jobs as Array<Record<string, unknown>>;
      const steps = jobs[0].steps as Array<Record<string, unknown>>;
      const testStep = steps.find(s => s.displayName === 'Unit tests');

      expect(testStep).toBeDefined();
    });
  });

  describe('triggers', () => {
    it('defaults to main branch trigger', () => {
      const result = buildAzureDevOpsStaticAnalysisPipeline(defaultOptions);
      const trigger = result.trigger as Record<string, unknown>;
      const branches = trigger.branches as Record<string, string[]>;

      expect(branches.include).toContain('main');
    });

    it('uses custom push branches when provided', () => {
      const result = buildAzureDevOpsStaticAnalysisPipeline({
        ...defaultOptions,
        triggers: { push: { branches: ['develop', 'main'] } },
      });
      const trigger = result.trigger as Record<string, unknown>;
      const branches = trigger.branches as Record<string, string[]>;

      expect(branches.include).toContain('develop');
    });

    it('includes schedules when schedule trigger is configured', () => {
      const result = buildAzureDevOpsStaticAnalysisPipeline({
        ...defaultOptions,
        triggers: { schedule: [{ cron: '0 0 * * *' }] },
      });

      expect(result.schedules).toBeDefined();
    });
  });

  describe('notifications', () => {
    it('adds Slack notification step when notification is slack', () => {
      const result = buildAzureDevOpsStaticAnalysisPipeline({
        ...defaultOptions,
        staticAnalysis: { notification: 'slack' },
      });
      const stages = result.stages as Array<Record<string, unknown>>;
      const jobs = stages[0].jobs as Array<Record<string, unknown>>;
      const steps = jobs[0].steps as Array<Record<string, unknown>>;
      const slackStep = steps.find(s => s.displayName === 'Notify Slack');

      expect(slackStep).toBeDefined();
      expect((slackStep as Record<string, string>).script).toContain(
        'SLACK_WEBHOOK_URL'
      );
    });

    it('does not add Slack step when notification is none', () => {
      const result = buildAzureDevOpsStaticAnalysisPipeline(defaultOptions);
      const stages = result.stages as Array<Record<string, unknown>>;
      const jobs = stages[0].jobs as Array<Record<string, unknown>>;
      const steps = jobs[0].steps as Array<Record<string, unknown>>;
      const slackStep = steps.find(s => s.displayName === 'Notify Slack');

      expect(slackStep).toBeUndefined();
    });
  });

  it('output matches snapshot for default options', () => {
    const result = buildAzureDevOpsStaticAnalysisPipeline(defaultOptions);

    expect(result).toMatchSnapshot();
  });

  it('output matches snapshot for npm package manager', () => {
    const result = buildAzureDevOpsStaticAnalysisPipeline({
      ...defaultOptions,
      packageManager: 'npm',
    });

    expect(result).toMatchSnapshot();
  });
});
