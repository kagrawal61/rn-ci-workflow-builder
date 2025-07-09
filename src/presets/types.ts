/**
 * Framework options
 */
export type Framework = 'react-native-cli' | 'expo';

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
export interface StaticAnalysisOptions {
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
  platform?: Platform;

  /**
   * Framework to use (React Native CLI or Expo)
   */
  framework?: Framework;

  /**
   * Build variant (debug or release)
   */
  variant?: Variant;

  /**
   * Android output type
   */
  androidOutputType?: AndroidOutputType;

  /**
   * Storage solution for build artifacts
   */
  storage?: StorageSolution;

  /**
   * Notification type for build results
   */
  notification?: NotificationType;

  /**
   * Include static analysis steps
   */
  includeStaticAnalysis?: boolean;

  /**
   * Static analysis options for configuring which checks to run
   * Only used when includeStaticAnalysis is true
   */
  staticAnalysisOptions?: StaticAnalysisOptions;
}
