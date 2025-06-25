/**
 * Workflow presets exports
 */
import { registerBuilder } from '../generator';
import { buildHealthCheckPipeline } from './healthCheck';
import { buildBuildPipeline } from './buildPreset';

// Register all built-in presets here
export function registerBuiltInPresets(): void {
  registerBuilder('health-check', buildHealthCheckPipeline);
  registerBuilder('build', buildBuildPipeline);
}

// Re-export all preset builders for easy access
export * from './healthCheck';
export * from './buildPreset';

// Export preset names for enum usage in types
export const presetKinds = ['health-check', 'build'] as const;
export type PresetKind = typeof presetKinds[number];