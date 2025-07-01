import { CacheConfig, PackageManager } from '../../types';
import commonSteps from '../steps';

// Mock the cacheSteps helper
jest.mock('../index', () => ({
  cacheSteps: jest.fn(
    (packageManager: PackageManager, cache: CacheConfig | undefined) => {
      if (cache?.enabled) {
        return [{ name: 'Cache Dependencies', uses: 'actions/cache@v3' }];
      }
      return [];
    }
  ),
}));

describe('Common Steps', () => {
  describe('createSetupSteps', () => {
    it('should create setup steps with npm package manager', () => {
      const packageManager: PackageManager = 'npm';
      const cache: CacheConfig = { enabled: true };

      const steps = commonSteps.createSetupSteps(packageManager, cache);

      expect(steps).toHaveLength(5); // checkout + setup-node + cache-dir + cache + install

      // Check checkout step
      expect(steps[0]).toEqual({
        name: 'Checkout',
        uses: 'actions/checkout@v4',
      });

      // Check setup node step
      expect(steps[1]).toEqual({
        name: 'Setup Node',
        uses: 'actions/setup-node@v4',
        with: {
          'node-version': '20',
          cache: 'npm',
        },
      });

      // Check install step
      const installStep = steps.find(step => step.name === 'Install');
      expect(installStep).toEqual({
        name: 'Install',
        run: 'npm ci',
      });
    });

    it('should create setup steps with yarn package manager', () => {
      const packageManager: PackageManager = 'yarn';
      const cache: CacheConfig = { enabled: true };

      const steps = commonSteps.createSetupSteps(packageManager, cache);

      expect(steps).toHaveLength(5);

      // Check setup node step uses yarn cache
      expect(steps[1]).toEqual({
        name: 'Setup Node',
        uses: 'actions/setup-node@v4',
        with: {
          'node-version': '20',
          cache: 'yarn',
        },
      });

      // Check install step uses yarn
      const installStep = steps.find(step => step.name === 'Install');
      expect(installStep).toEqual({
        name: 'Install',
        run: 'yarn install --immutable',
      });
    });

    it('should create setup steps without cache when cache is disabled', () => {
      const packageManager: PackageManager = 'npm';
      const cache: CacheConfig = { enabled: false };

      const steps = commonSteps.createSetupSteps(packageManager, cache);

      expect(steps).toHaveLength(3); // checkout + setup-node + install (no cache)

      const cacheStep = steps.find(step => step.name === 'Setup cache');
      expect(cacheStep).toBeUndefined();
    });

    it('should create setup steps without cache when cache is undefined', () => {
      const packageManager: PackageManager = 'npm';
      const cache = undefined;

      const steps = commonSteps.createSetupSteps(packageManager, cache);

      expect(steps).toHaveLength(5); // checkout + setup-node + cache-dir + cache + install (cache enabled by default)
    });

    it('should use Node.js version 20', () => {
      const packageManager: PackageManager = 'npm';
      const cache: CacheConfig = { enabled: true };

      const steps = commonSteps.createSetupSteps(packageManager, cache);

      const setupNodeStep = steps.find(step => step.name === 'Setup Node');
      expect(setupNodeStep?.with?.['node-version']).toBe('20');
    });

    it('should include cache step when cache is enabled', () => {
      const packageManager: PackageManager = 'npm';
      const cache: CacheConfig = { enabled: true };

      const steps = commonSteps.createSetupSteps(packageManager, cache);

      const cacheStep = steps.find(step => step.name === 'Setup cache');
      expect(cacheStep).toBeDefined();
    });
  });

  describe('createSourceDetectionStep', () => {
    it('should create source detection step', () => {
      const step = commonSteps.createSourceDetectionStep();

      expect(step).toEqual({
        name: 'Determine Build Source',
        id: 'build-source',
        run: expect.stringContaining('EVENT_NAME="${{ github.event_name }}"'),
      });
    });

    it('should handle pull request detection', () => {
      const step = commonSteps.createSourceDetectionStep();

      expect(step.run).toContain('pull_request');
      expect(step.run).toContain('is_pr=true');
      expect(step.run).toContain('github.head_ref');
    });

    it('should handle direct push detection', () => {
      const step = commonSteps.createSourceDetectionStep();

      expect(step.run).toContain('is_pr=false');
      expect(step.run).toContain('github.ref_name');
    });

    it('should output source information to GITHUB_OUTPUT', () => {
      const step = commonSteps.createSourceDetectionStep();

      expect(step.run).toContain('>> $GITHUB_OUTPUT');
      expect(step.run).toContain('source_branch=');
      expect(step.run).toContain('source_sha=');
    });

    it('should have correct id for referencing in other steps', () => {
      const step = commonSteps.createSourceDetectionStep();

      expect(step.id).toBe('build-source');
    });

    it('should include logging for both PR and push scenarios', () => {
      const step = commonSteps.createSourceDetectionStep();

      expect(step.run).toContain('Running on PR');
      expect(step.run).toContain('Running on branch');
    });
  });
});
