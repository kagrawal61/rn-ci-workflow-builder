// Register built-in presets
import { registerBuiltInPresets } from './presets';
registerBuiltInPresets();

// Export main components and utilities
export * from './generator';
export * from './helpers';
export * from './helpers/secretsManager';
export * from './presets';
export * from './types';
export * from './validation/docs';

// Export validation functions that don't conflict with helpers
export {
  validateBuildSchema,
  validateBuildSecrets,
  validateConfig,
  validateWorkflowSchema,
} from './validation';
