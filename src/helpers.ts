import {
  CacheConfig,
  ConcurrencyConfig,
  GitHubStep,
  PackageManager,
  TriggerOptions,
  WorkflowConfig,
} from './types';

/**
 * Build GitHub Actions workflow triggers from configuration
 * @param triggers Trigger options
 * @returns Workflow trigger configuration object
 */
export function buildTriggers(
  triggers?: TriggerOptions
): Record<string, unknown> {
  if (!triggers) {
    return {
      push: { branches: ['main'] },
      pull_request: { branches: ['main'] },
    };
  }

  const on: Record<string, unknown> = {};

  if (triggers.push) {
    on.push = {
      branches: triggers.push.branches ?? ['main'],
      ...(triggers.push.ignorePaths
        ? { 'paths-ignore': triggers.push.ignorePaths }
        : {}),
    };
  }

  if (triggers.pullRequest) {
    on.pull_request = { branches: triggers.pullRequest.branches ?? ['main'] };
  }

  // Support pull_request_target for workflows that need privileged access
  if (triggers.pullRequestTarget) {
    on.pull_request_target = {
      branches: triggers.pullRequestTarget.branches ?? ['main'],
    };
  }

  if (triggers.workflowDispatch) on.workflow_dispatch = {};

  if (triggers.schedule?.length) {
    on.schedule = triggers.schedule.map(s => ({ cron: s.cron }));
  }

  return on;
}

/**
 * Build GitHub Actions workflow environment variables from configuration
 * @param env Environment variables
 * @param secrets Secret names to reference
 * @returns Environment variables object
 */
export function buildEnv(
  env?: Record<string, string>,
  secrets?: string[]
): Record<string, string> {
  const result: Record<string, string> = { ...(env ?? {}) };
  secrets?.forEach(s => {
    result[s] = `__SECRET_${s}__`;
  });
  return result;
}

/**
 * Replace secret placeholders with GitHub syntax
 * @param yamlStr YAML string with secret placeholders
 * @returns YAML string with GitHub secret references
 */
export function injectSecrets(yamlStr: string): string {
  // Handle both quoted and unquoted secret placeholders
  // Match quoted placeholders: "__SECRET_NAME__"
  yamlStr = yamlStr.replace(
    /"__SECRET_([A-Z0-9_]+)__"/g,
    (_, name) => '${{ secrets.' + name + ' }}'
  );

  // Match unquoted placeholders: __SECRET_NAME__
  yamlStr = yamlStr.replace(
    /(?<!\w)__SECRET_([A-Z0-9_]+)__(?!\w)/g,
    (_, name) => '${{ secrets.' + name + ' }}'
  );

  return yamlStr;
}

/**
 * Build concurrency configuration for GitHub Actions workflow
 * @param config Concurrency configuration
 * @returns Concurrency configuration object
 */
export function buildConcurrency(
  config?: ConcurrencyConfig
): Record<string, unknown> | undefined {
  if (!config || !config.group) return undefined;

  return {
    group: config.group,
    'cancel-in-progress': config.cancelInProgress ?? false,
  };
}

/**
 * Escape string for safe use in GitHub Actions expressions
 * @param str String to escape
 * @returns Escaped string
 */
export function escapeString(str: string): string {
  return str.replace(/'/g, "''").replace(/\r/g, '').replace(/\n/g, '\\n');
}

/**
 * Build npm/yarn cache steps for GitHub Actions workflow
 * @param pm Package manager
 * @param cache Cache configuration
 * @returns Array of GitHub Actions steps
 */
export function cacheSteps(
  pm: PackageManager,
  cache?: CacheConfig
): GitHubStep[] {
  const cfg = {
    enabled: cache?.enabled !== false,
    paths: cache?.paths,
    key: cache?.key,
  };
  if (!cfg.enabled) return [];

  const getDir: GitHubStep =
    pm === 'yarn'
      ? {
          name: 'Get yarn cache dir',
          id: 'yarn-cache',
          run: 'echo "dir=$(yarn cache dir)" >> $GITHUB_OUTPUT',
        }
      : {
          name: 'Get npm cache dir',
          id: 'npm-cache',
          run: 'echo "dir=$(npm config get cache)" >> $GITHUB_OUTPUT',
        };

  const dirVar =
    pm === 'yarn'
      ? '${{ steps.yarn-cache.outputs.dir }}'
      : '${{ steps.npm-cache.outputs.dir }}';
  const lock = pm === 'yarn' ? 'yarn.lock' : 'package-lock.json';
  const keyExpr =
    '${{ runner.os }}-' + pm + '-${{ hashFiles(' + `'**/${lock}'` + ') }}';

  const cacheStep: GitHubStep = {
    name: 'Setup cache',
    uses: 'actions/cache@v3',
    with: {
      path: cfg.paths?.join('\n') ?? dirVar,
      key: cfg.key ?? keyExpr,
      ...(cfg.key ? {} : { 'restore-keys': '${{ runner.os }}-' + pm + '-' }),
    },
  };

  return [getDir, cacheStep];
}

/**
 * Validate workflow configuration
 * @param config Workflow config to validate
 * @returns Valid workflow config
 * @throws Error if config is invalid
 */
export function validateWorkflowConfig(config: WorkflowConfig): WorkflowConfig {
  // Check required fields
  if (!config) {
    throw new Error('Workflow configuration is required');
  }

  if (!config.kind) {
    throw new Error('Workflow kind is required');
  }

  // Ensure options is an object
  if (config.options && typeof config.options !== 'object') {
    throw new Error('Workflow options must be an object');
  }

  // Check triggers
  if (config.options?.triggers) {
    const { triggers } = config.options;

    // Validate branches format if provided
    if (triggers.push?.branches && !Array.isArray(triggers.push.branches)) {
      throw new Error('Push branches must be an array');
    }

    if (
      triggers.pullRequest?.branches &&
      !Array.isArray(triggers.pullRequest.branches)
    ) {
      throw new Error('Pull request branches must be an array');
    }

    if (
      triggers.pullRequestTarget?.branches &&
      !Array.isArray(triggers.pullRequestTarget.branches)
    ) {
      throw new Error('Pull request target branches must be an array');
    }

    // Validate schedule format if provided
    if (triggers.schedule && !Array.isArray(triggers.schedule)) {
      throw new Error('Schedule must be an array');
    }

    // Check all schedule entries have cron expressions
    if (triggers.schedule?.some(s => !s.cron)) {
      throw new Error('All schedule entries must have a cron expression');
    }
  }

  return config;
}
