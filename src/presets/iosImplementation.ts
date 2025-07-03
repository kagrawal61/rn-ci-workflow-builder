/**
 * iOS workflow implementation for React Native builds
 * 
 * This file contains the iOS-specific workflow implementation that will be integrated
 * into the main build pipeline when iOS support is fully implemented.
 * 
 * IMPORTANT: This implementation is currently in development and not yet active in the main workflow.
 * When iOS support is ready, these functions should be imported and used in buildPreset.ts.
 */

import { WorkflowOptions, GitHubJob, GitHubStep } from '../types';
import { BuildOptions } from './types';
import platformHelpers from '../helpers/platforms';
import storageHelpers from '../helpers/storage';
import notificationHelpers from '../helpers/notifications';

/**
 * Creates an iOS build job configuration that will be added to the workflow
 * 
 * @param opts Workflow configuration options
 * @param setupSteps Common setup steps to include at the start of the job
 * @param buildParams Build parameters string
 * @returns A complete job configuration for iOS builds
 */
export function createIOSBuildJob(
  opts: WorkflowOptions & { build?: BuildOptions },
  setupSteps: GitHubStep[], 
  buildParams: string
): { 'build-ios': GitHubJob } {
  const { build = { platform: 'ios', variant: 'release', storage: 'github', notification: 'none' } } = opts;
  
  // Create base iOS build steps
  let iosBuildSteps = platformHelpers.createIOSBuildSteps(
    setupSteps,
    opts.packageManager || 'yarn',
    buildParams,
    build
  );

  // Add storage-specific steps
  const storageSteps = storageHelpers.createIOSStorageSteps(build);
  iosBuildSteps = [...iosBuildSteps, ...storageSteps];

  // Add notification steps
  const notificationSteps =
    notificationHelpers.createIOSNotificationSteps(build);
  iosBuildSteps = [...iosBuildSteps, ...notificationSteps];

  // Return the iOS build job
  return {
    'build-ios': {
      name: 'Build iOS',
      'runs-on': 'macos-latest', // iOS builds require macOS
      steps: iosBuildSteps,
    }
  };
}

/**
 * Sets up job dependencies for iOS build if health/static analysis checks are enabled
 * 
 * @param jobs The current jobs collection
 * @param includeStaticAnalysis Whether static analysis is included in the workflow
 */
export function setupIOSJobDependencies(
  jobs: Record<string, GitHubJob>,
  includeStaticAnalysis: boolean
): void {
  if (includeStaticAnalysis && jobs['build-ios']) {
    jobs['build-ios'].needs = ['quality-check'];
  }
}