// Register built-in presets
import { registerBuiltInPresets } from './presets';
registerBuiltInPresets();

// Export main components and utilities
export * from './generator';
export * from './helpers';
export * from './types';
export * from './presets';
export * from './validation';
export * from './validation/docs';
export * from './helpers/secretsManager';
