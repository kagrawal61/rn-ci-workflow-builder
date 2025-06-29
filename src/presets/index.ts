/**
 * Workflow presets exports
 */
import { registerBuilder } from '../generator';
import { buildHealthCheckPipeline } from './healthCheck';
import { buildBuildPipeline } from './buildPreset';
import { buildBitriseHealthCheckPipeline } from './bitriseHealthCheck';
import { buildBitriseBuildPipeline } from './bitriseBuildPreset';
import { WorkflowOptions } from '../types';

// Register all built-in presets here
export function registerBuiltInPresets(): void {
  // GitHub Actions builders
  registerBuilder('health-check', (opts: WorkflowOptions) => {
    // Default to GitHub Actions if no platform specified
    if (!opts.platform || opts.platform === 'github') {
      return buildHealthCheckPipeline(opts);
    } else if (opts.platform === 'bitrise') {
      return buildBitriseHealthCheckPipeline(opts);
    }
    throw new Error(`Unsupported platform: ${opts.platform}`);
  });
  
  registerBuilder('build', (opts: WorkflowOptions) => {
    // Default to GitHub Actions if no platform specified
    if (!opts.platform || opts.platform === 'github') {
      return buildBuildPipeline(opts);
    } else if (opts.platform === 'bitrise') {
      return buildBitriseBuildPipeline(opts);
    }
    throw new Error(`Unsupported platform: ${opts.platform}`);
  });
}

// Re-export all preset builders for easy access
export * from './healthCheck';
export * from './buildPreset';
export * from './bitriseHealthCheck';
export * from './bitriseBuildPreset';

// Export preset names for enum usage in types
export const presetKinds = ['health-check', 'build'] as const;
export type PresetKind = typeof presetKinds[number];