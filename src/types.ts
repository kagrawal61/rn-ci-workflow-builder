/* -------------------------------------------------------------------------- */
/*  Shared TypeScript types for workflow generator                            */
/* -------------------------------------------------------------------------- */

/**
 * Available workflow preset kinds
 */
export type PipelineKind = 'static-analysis' | string;

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
 * GitHub workflow permissions configuration
 */
export interface GitHubPermissions {
  /** Permission for accessing repository contents */
  contents?: 'read' | 'write';
  /** Permission for interacting with pull requests */
  'pull-requests'?: 'read' | 'write';
  /** Permission for interacting with issues */
  issues?: 'read' | 'write';
}

/**
 * Complete GitHub Actions workflow
 */
export interface GitHubWorkflow {
  /** Workflow name */
  name: string;
  /** Workflow triggers */
  on: Record<string, unknown>;
  /** Workflow permissions */
  permissions?: GitHubPermissions;
  /** Workflow environment variables */
  env?: Record<string, string>;
  /** Workflow concurrency settings */
  concurrency?: ConcurrencyConfig | string;
  /** Workflow jobs */
  jobs: Record<string, GitHubJob>;
}

// Import preset options
import { BuildOptions, StaticAnalysisOptions } from './presets/types';

/**
 * Bitrise workflow step
 */
export interface BitriseStep {
  /** Step identifier with version (e.g., 'script@1', 'git-clone@4') */
  [stepId: string]:
    | {
        /** Step title/name */
        title?: string;
        /** Step ID for reference */
        id?: string;
        /** Step inputs - must be array format for Bitrise CLI compatibility */
        inputs?: Array<Record<string, string | boolean | number>>;
        /** Condition for step execution */
        run_if?: string;
        /** Whether to continue on error */
        is_always_run?: boolean;
      }
    | undefined;
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
  /** Meta configuration specific to this workflow */
  meta?: {
    'bitrise.io'?: {
      stack?: string;
      machine_type_id?: string;
    };
  };
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
  /** Meta configuration for stack and machine type */
  meta?: {
    'bitrise.io'?: {
      stack?: string;
      machine_type_id?: string;
    };
  };
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
 * Workflow configuration options
 */
export interface WorkflowOptions {
  /**
   * Name of the workflow
   */
  name?: string;

  /**
   * CI/CD platform to target
   */
  platform?: CIPlatform;

  /**
   * Triggers for the workflow
   */
  triggers?: TriggerOptions;

  /**
   * Environment variables to set
   */
  env?: Record<string, string>;

  /**
   * Secrets to make available
   */
  secrets?: string[];

  /**
   * Node.js versions to test against
   */
  nodeVersions?: number[];

  /**
   * Package manager to use
   */
  packageManager?: PackageManager;

  /**
   * Runner to use for the workflow
   */
  runsOn?: string;

  /**
   * Cache configuration
   */
  cache?: CacheConfig;

  /**
   * Build-specific configuration
   */
  build?: BuildOptions;

  /** Static analysis specific options */
  staticAnalysis?: StaticAnalysisOptions;
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
