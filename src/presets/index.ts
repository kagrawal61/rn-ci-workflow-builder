/**
 * Workflow presets exports
 */
import { registerBuilder } from '../generator';
import { WorkflowOptions } from '../types';
import { buildBitriseBuildPipeline } from './bitriseBuildPreset';
import { buildBitriseHealthCheckPipeline } from './bitriseHealthCheck';
import { buildBitriseStaticAnalysisPipeline } from './bitriseStaticAnalysis';
import { buildBuildPipeline } from './buildPreset';
import { buildHealthCheckPipeline } from './healthCheck';
import { buildStaticAnalysisPipeline } from './staticAnalysis';

// Register all built-in presets here
export function registerBuiltInPresets(): void {
  // GitHub Actions builders
  registerBuilder('static-analysis', (opts: WorkflowOptions) => {
    // Default to GitHub Actions if no platform specified
    if (!opts.platform || opts.platform === 'github') {
      return buildStaticAnalysisPipeline(opts);
    } else if (opts.platform === 'bitrise') {
      return buildBitriseStaticAnalysisPipeline(opts);
    }
    throw new Error(`Unsupported platform: ${opts.platform}`);
  });

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
export * from './bitriseBuildPreset';
export * from './bitriseHealthCheck';
export * from './bitriseStaticAnalysis';
export * from './buildPreset';
export * from './healthCheck';
export * from './staticAnalysis';

// Export preset names for enum usage in types
export const presetKinds = [
  'static-analysis',
  'health-check',
  'build',
] as const;
export type PresetKind = (typeof presetKinds)[number];
