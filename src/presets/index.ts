/**
 * Workflow presets exports
 */
import { registerBuilder } from '../generator';
import { WorkflowOptions } from '../types';
import { buildBitriseBuildPipeline } from './bitriseBuildPreset';
import { buildBitriseStaticAnalysisPipeline } from './bitriseStaticAnalysis';
import { buildBuildPipeline } from './buildPreset';
import { buildCircleCIBuildPipeline } from './circleciBuilPreset';
import { buildCircleCIStaticAnalysisPipeline } from './circleciStaticAnalysis';
import { buildGitlabBuildPipeline } from './gitlabBuildPreset';
import { buildGitlabStaticAnalysisPipeline } from './gitlabStaticAnalysis';
import { buildStaticAnalysisPipeline } from './staticAnalysis';

// Register all built-in presets here
export function registerBuiltInPresets(): void {
  registerBuilder('static-analysis', (opts: WorkflowOptions) => {
    if (!opts.platform || opts.platform === 'github') {
      return buildStaticAnalysisPipeline(opts);
    } else if (opts.platform === 'bitrise') {
      return buildBitriseStaticAnalysisPipeline(opts);
    } else if (opts.platform === 'gitlab') {
      return buildGitlabStaticAnalysisPipeline(opts);
    } else if (opts.platform === 'circleci') {
      return buildCircleCIStaticAnalysisPipeline(opts);
    }
    throw new Error(`Unsupported platform: ${opts.platform}`);
  });

  registerBuilder('build', (opts: WorkflowOptions) => {
    if (!opts.platform || opts.platform === 'github') {
      return buildBuildPipeline(opts);
    } else if (opts.platform === 'bitrise') {
      return buildBitriseBuildPipeline(opts);
    } else if (opts.platform === 'gitlab') {
      return buildGitlabBuildPipeline(opts);
    } else if (opts.platform === 'circleci') {
      return buildCircleCIBuildPipeline(opts);
    }
    throw new Error(`Unsupported platform: ${opts.platform}`);
  });
}

// Export built-in presets
export * from './bitriseBuildPreset';
export * from './bitriseStaticAnalysis';
export * from './buildPreset';
export * from './circleciBuilPreset';
export * from './circleciStaticAnalysis';
export * from './gitlabBuildPreset';
export * from './gitlabStaticAnalysis';
export * from './staticAnalysis';
export * from './types';

// Export preset names for enum usage in types
export const presetKinds = ['static-analysis', 'build'] as const;

export type PresetKind = (typeof presetKinds)[number];
