/**
 * Platform options for build
 */
export type Platform = 'ios' | 'android' | 'both';

/**
 * Flavor options for build
 */
export type Flavor = 'prod' | 'develop' | 'stage';

/**
 * Variant options for build
 */
export type Variant = 'debug' | 'release';

/**
 * Storage solution options
 */
export type StorageSolution = 'github' | 'drive' | 'firebase' | 's3';

/**
 * Notification options
 */
export type NotificationType = 'slack' | 'pr-comment' | 'both' | 'none';

/**
 * Build preset specific options
 */
export interface BuildOptions {
  /**
   * Platform to build for
   */
  platform: Platform;
  
  /**
   * Application flavor
   */
  flavor: Flavor;
  
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
}