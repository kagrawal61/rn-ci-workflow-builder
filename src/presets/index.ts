/**
 * Workflow presets exports
 */
import { registerBuilder } from '../generator';
import { buildHealthCheckPipeline } from './healthCheck';

// Register all built-in presets here
export function registerBuiltInPresets(): void {
  registerBuilder('health-check', buildHealthCheckPipeline);
}

// Re-export all preset builders for easy access
export * from './healthCheck';

// Export preset names for enum usage in types
export const presetKinds = ['health-check'] as const;
export type PresetKind = typeof presetKinds[number];