/**
 * Workflow presets exports
 */
import { registerBuilder } from '../generator';
import { buildStaticAnalysisPipeline } from './staticAnalysis';
import { buildBuildPipeline } from './buildPreset';
import { buildBitriseStaticAnalysisPipeline } from './bitriseStaticAnalysis';
import { buildBitriseBuildPipeline } from './bitriseBuildPreset';
import { WorkflowOptions } from '../types';

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
export * from './staticAnalysis';
export * from './buildPreset';
export * from './bitriseStaticAnalysis';
export * from './bitriseBuildPreset';

// Export preset names for enum usage in types
export const presetKinds = ['static-analysis', 'build'] as const;
export type PresetKind = typeof presetKinds[number];