/* -------------------------------------------------------------------------- */
/*  Shared TypeScript types for workflow generator                            */
/* -------------------------------------------------------------------------- */

/**
 * Available workflow preset kinds
 */
export type PipelineKind = 'health-check' | string;

/**
 * Available CI platforms
 */
export type CIPlatform = 'github' | 'bitrise';

/**
 * GitHub Actions workflow trigger configuration
 */
export interface TriggerOptions {
  /** Push event trigger configuration */
  push?: {
    /** Branches that trigger the workflow */
    branches?: string[];
    /** Paths to ignore for triggering the workflow */
    ignorePaths?: string[];
  };
  /** Pull request event trigger configuration */
  pullRequest?: {
    /** Branches that trigger the workflow */
    branches?: string[];
  };
  /** Pull request target event trigger configuration (for secure workflows with external PR access) */
  pullRequestTarget?: {
    /** Branches that trigger the workflow */
    branches?: string[];
  };
  /** Enable manual workflow dispatch */
  workflowDispatch?: boolean;
  /** Scheduled workflow triggers */
  schedule?: { cron: string }[];
}

/**
 * GitHub Actions cache configuration
 */
export interface CacheConfig {
  /** Whether caching is enabled */
  enabled?: boolean;
  /** Paths to cache */
  paths?: string[];
  /** Cache key template */
  key?: string;
}

/**
 * Concurrency configuration for GitHub Actions
 */
export interface ConcurrencyConfig {
  /** Concurrency group identifier */
  group: string;
  /** Whether to cancel in-progress runs of the same concurrency group */
  cancelInProgress?: boolean;
}


/**
 * Supported package managers
 */
export type PackageManager = 'yarn' | 'npm';

/**
 * GitHub Actions workflow step
 */
export interface GitHubStep {
  /** Step name */
  name?: string;
  /** Step ID for referencing outputs */
  id?: string;
  /** Uses a published action */
  uses?: string;
  /** Command to run */
  run?: string;
  /** Environment variables for this step */
  env?: Record<string, string>;
  /** Step inputs when using an action */
  with?: Record<string, string | boolean | number>;
  /** Condition for step execution */
  if?: string;
  /** Whether to continue on error */
  'continue-on-error'?: boolean;
}

/**
 * GitHub Actions action reference
 */
export interface GitHubAction {
  /** Action name/path */
  name: string;
  /** Action version */
  version: string;
}

/**
 * GitHub Actions job definition
 */
export interface GitHubJob {
  /** Job name */
  name?: string;
  /** Runner to use */
  'runs-on': string;
  /** Job environment */
  environment?: string;
  /** Job strategy (matrix) */
  strategy?: {
    /** Matrix values for job variations */
    matrix?: Record<string, unknown[]>;
    /** Whether to fail fast or continue on error */
    'fail-fast'?: boolean;
    /** Maximum number of parallel jobs */
    'max-parallel'?: number;
  };
  /** Job environment variables */
  env?: Record<string, string>;
  /** Job steps */
  steps: GitHubStep[];
  /** Condition for job execution */
  if?: string;
  /** Jobs this job depends on */
  needs?: string | string[];
  /** Job outputs that can be used by other jobs */
  outputs?: Record<string, string>;
}

/**
 * Complete GitHub Actions workflow
 */
export interface GitHubWorkflow {
  /** Workflow name */
  name: string;
  /** Workflow triggers */
  on: Record<string, unknown>;
  /** Workflow environment variables */
  env?: Record<string, string>;
  /** Workflow concurrency settings */
  concurrency?: ConcurrencyConfig | string;
  /** Workflow jobs */
  jobs: Record<string, GitHubJob>;
}

// Import build options
import { BuildOptions } from './presets/types';

/**
 * Bitrise workflow step
 */
export interface BitriseStep {
  /** Step identifier with version (e.g., 'script@1', 'git-clone@4') */
  [stepId: string]: {
    /** Step title/name */
    title?: string;
    /** Step inputs - can be object format or array format depending on the step */
    inputs?: Record<string, string | boolean | number> | Array<Record<string, string | boolean | number>>;
    /** Condition for step execution */
    run_if?: string;
    /** Whether to continue on error */
    is_always_run?: boolean;
  } | undefined;
}

/**
 * Bitrise workflow definition
 */
export interface BitriseWorkflow {
  /** Workflow title */
  title?: string;
  /** Workflow description */
  description?: string;
  /** Workflow steps */
  steps: BitriseStep[];
  /** Workflow environment variables */
  envs?: Array<Record<string, string>>;
  /** Before run workflows */
  before_run?: string[];
  /** After run workflows */
  after_run?: string[];
}

/**
 * Complete Bitrise configuration
 */
export interface BitriseConfig {
  /** Format version */
  format_version: number;
  /** Default step library source */
  default_step_lib_source?: string;
  /** Project type */
  project_type?: string;
  /** App-level configuration */
  app?: {
    /** App-level environment variables */
    envs?: Array<Record<string, string>>;
  };
  /** Workflows */
  workflows: Record<string, BitriseWorkflow>;
  /** Trigger map */
  trigger_map?: Array<{
    /** Push branch pattern */
    push_branch?: string;
    /** Pull request source branch pattern */
    pull_request_source_branch?: string;
    /** Pull request target branch pattern */
    pull_request_target_branch?: string;
    /** Workflow to run */
    workflow: string;
  }>;
}

/**
 * Workflow generator options
 */
export interface WorkflowOptions {
  /** Workflow name */
  name?: string;
  /** CI Platform to generate for */
  platform?: CIPlatform;
  /** Workflow triggers configuration */
  triggers?: TriggerOptions;
  /** Workflow environment variables */
  env?: Record<string, string>;
  /** Secret names to include in workflow */
  secrets?: string[];
  /** Cache configuration */
  cache?: CacheConfig;
  /** Runner OS/platform */
  runsOn?: string;
  /** Node.js versions to test with */
  nodeVersions?: (string | number)[];
  /** Package manager to use */
  packageManager?: PackageManager;
  /** Concurrency settings */
  concurrency?: ConcurrencyConfig;
  /** Build-specific options (for build preset) */
  build?: BuildOptions;
}

/**
 * Workflow generator configuration
 */
export interface WorkflowConfig {
  /** Workflow preset/kind to generate */
  kind: PipelineKind;
  /** Workflow options */
  options?: WorkflowOptions;
}