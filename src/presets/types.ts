/**
 * Platform options for build
 */
export type Platform = 'ios' | 'android' | 'both';

/**
 * Variant options for build
 */
export type Variant = 'debug' | 'release';

/**
 * Storage solution options
 */
export type StorageSolution =
  | 'github'
  | 'drive'
  | 'firebase'
  | 's3'
  | 'bitrise';

/**
 * Notification options
 */
export type NotificationType = 'slack' | 'pr-comment' | 'both' | 'none';

/**
 * Android build output type
 */
export type AndroidOutputType = 'apk' | 'aab' | 'both';

/**
 * Static analysis preset specific options
 */
export interface HealthCheckOptions {
  /**
   * Run TypeScript type checking
   */
  typescript?: boolean;

  /**
   * Run ESLint
   */
  eslint?: boolean;

  /**
   * Run Prettier formatting check
   */
  prettier?: boolean;

  /**
   * Run unit tests
   */
  unitTests?: boolean;

  /**
   * Notification type for static analysis results
   */
  notification?: NotificationType;
}

/**
 * Build preset specific options
 */
export interface BuildOptions {
  /**
   * Platform to build for
   */
  platform: Platform;

  /**
   * Build variant
   */
  variant: Variant;

  /**
   * Storage solution for artifacts
   */
  storage: StorageSolution;

  /**
   * Notification type
   */
  notification: NotificationType;

  /**
   * Include health check steps
   */
  includeHealthCheck?: boolean;

  /**
   * Health check options for configuring which checks to run
   * Only used when includeHealthCheck is true
   */
  healthCheckOptions?: HealthCheckOptions;

  /**
   * Android build output type (apk or aab)
   * Only applicable when platform is 'android' or 'both'
   */
  androidOutputType?: AndroidOutputType;
}
