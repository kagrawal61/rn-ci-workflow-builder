import { buildAzureDevOpsBuildPipeline } from '../azureDevOpsBuildPreset';
import { WorkflowOptions } from '../../types';

describe('buildAzureDevOpsBuildPipeline', () => {
  const defaultOptions: WorkflowOptions = {
    platform: 'azure-devops',
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
    it('uses ubuntu-latest pool', () => {
      const result = buildAzureDevOpsBuildPipeline(defaultOptions);
      const pool = result.pool as Record<string, string>;

      expect(pool.vmImage).toBe('ubuntu-latest');
    });

    it('includes Build stage', () => {
      const result = buildAzureDevOpsBuildPipeline(defaultOptions);
      const stages = result.stages as Array<Record<string, unknown>>;

      expect(stages[0].stage).toBe('Build');
    });

    it('includes PublishBuildArtifacts task', () => {
      const result = buildAzureDevOpsBuildPipeline(defaultOptions);
      const stages = result.stages as Array<Record<string, unknown>>;
      const jobs = stages[0].jobs as Array<Record<string, unknown>>;
      const steps = jobs[0].steps as Array<Record<string, unknown>>;
      const publishStep = steps.find(
        s => s.task === 'PublishBuildArtifacts@1'
      );

      expect(publishStep).toBeDefined();
    });
  });

  describe('build steps', () => {
    it('includes assembleRelease for release APK', () => {
      const result = buildAzureDevOpsBuildPipeline(defaultOptions);
      const stages = result.stages as Array<Record<string, unknown>>;
      const jobs = stages[0].jobs as Array<Record<string, unknown>>;
      const steps = jobs[0].steps as Array<Record<string, unknown>>;
      const buildStep = steps.find(s => s.displayName === 'Build Android') as
        | Record<string, string>
        | undefined;

      expect(buildStep?.script).toContain('assembleRelease');
    });

    it('includes bundleRelease for AAB build', () => {
      const result = buildAzureDevOpsBuildPipeline({
        ...defaultOptions,
        build: { ...defaultOptions.build, androidOutputType: 'aab' },
      });
      const stages = result.stages as Array<Record<string, unknown>>;
      const jobs = stages[0].jobs as Array<Record<string, unknown>>;
      const steps = jobs[0].steps as Array<Record<string, unknown>>;
      const buildStep = steps.find(s => s.displayName === 'Build Android') as
        | Record<string, string>
        | undefined;

      expect(buildStep?.script).toContain('bundleRelease');
    });
  });

  describe('static analysis', () => {
    it('includes TypeScript step when includeStaticAnalysis is true', () => {
      const result = buildAzureDevOpsBuildPipeline({
        ...defaultOptions,
        build: { ...defaultOptions.build, includeStaticAnalysis: true },
      });
      const stages = result.stages as Array<Record<string, unknown>>;
      const jobs = stages[0].jobs as Array<Record<string, unknown>>;
      const steps = jobs[0].steps as Array<Record<string, unknown>>;
      const tsStep = steps.find(s => s.displayName === 'TypeScript check');

      expect(tsStep).toBeDefined();
    });
  });

  describe('notifications', () => {
    it('adds Slack step when notification is slack', () => {
      const result = buildAzureDevOpsBuildPipeline({
        ...defaultOptions,
        build: { ...defaultOptions.build, notification: 'slack' },
      });
      const stages = result.stages as Array<Record<string, unknown>>;
      const jobs = stages[0].jobs as Array<Record<string, unknown>>;
      const steps = jobs[0].steps as Array<Record<string, unknown>>;
      const slackStep = steps.find(s => s.displayName === 'Notify Slack');

      expect(slackStep).toBeDefined();
    });
  });

  it('output matches snapshot for default options', () => {
    const result = buildAzureDevOpsBuildPipeline(defaultOptions);

    expect(result).toMatchSnapshot();
  });
});
