/**
 * Workflow presets exports
 */
import { registerBuilder } from '../generator';
import { WorkflowOptions } from '../types';
import { buildBitriseBuildPipeline } from './bitriseBuildPreset';
import { buildBitriseStaticAnalysisPipeline } from './bitriseStaticAnalysis';
import { buildBuildPipeline } from './buildPreset';
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

// Export built-in presets
export * from './bitriseBuildPreset';
export * from './bitriseStaticAnalysis';
export * from './buildPreset';
export * from './staticAnalysis';
export * from './types';

// Export preset names for enum usage in types
export const presetKinds = ['static-analysis', 'build'] as const;

export type PresetKind = (typeof presetKinds)[number];
