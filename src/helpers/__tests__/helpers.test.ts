import { CacheConfig, PackageManager } from '../../types';
import { cacheSteps } from '../../helpers';

describe('Helper Functions', () => {
  describe('cacheSteps', () => {
    it('should return empty array when cache is disabled', () => {
      const cache: CacheConfig = { enabled: false };
      const result = cacheSteps('npm', cache);
      expect(result).toEqual([]);
    });

    it('should handle npm cache with default configuration', () => {
      const cache: CacheConfig = { enabled: true };
      const result = cacheSteps('npm', cache);
      
      expect(result).toHaveLength(2);
      
      // Check get cache directory step
      const dirStep = result[0];
      expect(dirStep.name).toBe('Get npm cache dir');
      expect(dirStep.id).toBe('npm-cache');
      expect(dirStep.run).toContain('npm config get cache');
      
      // Check cache setup step
      const cacheStep = result[1];
      expect(cacheStep.name).toBe('Setup cache');
      expect(cacheStep.uses).toBe('actions/cache@v3');
      expect(cacheStep.with?.path).toBe('${{ steps.npm-cache.outputs.dir }}');
    });

    it('should handle yarn cache with default configuration', () => {
      const cache: CacheConfig = { enabled: true };
      const result = cacheSteps('yarn', cache);
      
      expect(result).toHaveLength(2);
      
      // Check get cache directory step
      const dirStep = result[0];
      expect(dirStep.name).toBe('Get yarn cache dir');
      expect(dirStep.id).toBe('yarn-cache');
      expect(dirStep.run).toContain('yarn cache dir');
      
      // Check cache setup step
      const cacheStep = result[1];
      expect(cacheStep.name).toBe('Setup cache');
      expect(cacheStep.uses).toBe('actions/cache@v3');
      expect(cacheStep.with?.path).toBe('${{ steps.yarn-cache.outputs.dir }}');
    });

    it('should handle custom cache paths when provided', () => {
      const cache: CacheConfig = {
        enabled: true,
        paths: ['node_modules', 'vendor'],
      };
      const result = cacheSteps('npm', cache);
      
      // Check cache setup step path
      const cacheStep = result[1];
      expect(cacheStep.with?.path).toBe('node_modules\nvendor');
    });

    it('should handle empty cache paths array by falling back to default directory', () => {
      const cache: CacheConfig = {
        enabled: true,
        paths: [],
      };
      const result = cacheSteps('npm', cache);
      
      // Check cache setup step path - should use default npm cache dir
      const cacheStep = result[1];
      expect(cacheStep.with?.path).toBe('${{ steps.npm-cache.outputs.dir }}');
    });

    it('should handle custom cache key when provided', () => {
      const cache: CacheConfig = {
        enabled: true,
        key: 'v1-npm-deps',
      };
      const result = cacheSteps('npm', cache);
      
      // Check cache setup step key
      const cacheStep = result[1];
      expect(cacheStep.with?.key).toBe('v1-npm-deps');
      expect(cacheStep.with?.['restore-keys']).toBeUndefined();
    });

    it('should include restore-keys when using default key', () => {
      const cache: CacheConfig = {
        enabled: true,
      };
      const result = cacheSteps('yarn', cache);
      
      // Check cache setup step has restore-keys
      const cacheStep = result[1];
      expect(cacheStep.with?.['restore-keys']).toBe('${{ runner.os }}-yarn-');
    });
  });
});