import { buildCircleCIBuildPipeline } from '../circleciBuilPreset';
import { WorkflowOptions } from '../../types';

describe('buildCircleCIBuildPipeline', () => {
  const defaultOptions: WorkflowOptions = {
    platform: 'circleci',
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
    it('returns version 2.1', () => {
      const result = buildCircleCIBuildPipeline(defaultOptions);

      expect(result.version).toBe(2.1);
    });

    it('defines a build job', () => {
      const result = buildCircleCIBuildPipeline(defaultOptions);
      const jobs = result.jobs as Record<string, unknown>;

      expect(jobs['build']).toBeDefined();
    });

    it('uses the Android Docker image', () => {
      const result = buildCircleCIBuildPipeline(defaultOptions);
      const jobs = result.jobs as Record<string, unknown>;
      const job = jobs['build'] as Record<string, unknown>;
      const docker = job.docker as Array<Record<string, string>>;

      expect(docker[0].image).toBe('cimg/android:2024.01');
    });

    it('includes a store_artifacts step', () => {
      const result = buildCircleCIBuildPipeline(defaultOptions);
      const jobs = result.jobs as Record<string, unknown>;
      const job = jobs['build'] as Record<string, unknown>;
      const steps = job.steps as Array<string | Record<string, unknown>>;
      const artifactStep = steps.find(
        s => typeof s === 'object' && 'store_artifacts' in s
      );

      expect(artifactStep).toBeDefined();
    });
  });

  describe('build commands', () => {
    it('includes assembleRelease for release APK build', () => {
      const result = buildCircleCIBuildPipeline(defaultOptions);
      const jobs = result.jobs as Record<string, unknown>;
      const job = jobs['build'] as Record<string, unknown>;
      const steps = job.steps as Array<string | Record<string, unknown>>;
      const buildStep = steps.find(
        s =>
          typeof s === 'object' &&
          'run' in s &&
          (s.run as Record<string, string>).name === 'Build Android'
      ) as Record<string, unknown> | undefined;
      const cmd = (buildStep?.run as Record<string, string>)?.command;

      expect(cmd).toContain('assembleRelease');
    });

    it('includes bundleRelease for AAB build', () => {
      const result = buildCircleCIBuildPipeline({
        ...defaultOptions,
        build: { ...defaultOptions.build, androidOutputType: 'aab' },
      });
      const jobs = result.jobs as Record<string, unknown>;
      const job = jobs['build'] as Record<string, unknown>;
      const steps = job.steps as Array<string | Record<string, unknown>>;
      const buildStep = steps.find(
        s =>
          typeof s === 'object' &&
          'run' in s &&
          (s.run as Record<string, string>).name === 'Build Android'
      ) as Record<string, unknown> | undefined;
      const cmd = (buildStep?.run as Record<string, string>)?.command;

      expect(cmd).toContain('bundleRelease');
    });
  });

  describe('notifications', () => {
    it('adds slack orb when notification is slack', () => {
      const result = buildCircleCIBuildPipeline({
        ...defaultOptions,
        build: { ...defaultOptions.build, notification: 'slack' },
      });
      const orbs = result.orbs as Record<string, string>;

      expect(orbs.slack).toBeDefined();
    });
  });

  it('output matches snapshot for default options', () => {
    const result = buildCircleCIBuildPipeline(defaultOptions);

    expect(result).toMatchSnapshot();
  });
});
