import { GitHubStep, PackageManager, CacheConfig } from '../types';
import { cacheSteps } from '../helpers';

/**
 * Common GitHub Actions workflow step helpers
 */
const commonSteps = {
  /**
   * Creates common setup steps used across platforms
   */
  createSetupSteps(
    packageManager: PackageManager,
    cache: CacheConfig | undefined
  ): GitHubStep[] {
    // Note: Static analysis steps are now moved to a separate job in the workflow
    // to avoid duplication and follow best practices

    return [
      { name: 'Checkout', uses: 'actions/checkout@v4' },
      {
        name: 'Setup Node',
        uses: 'actions/setup-node@v4',
        with: {
          'node-version': '20',
          cache: packageManager === 'yarn' ? 'yarn' : 'npm',
        },
      },
      ...cacheSteps(packageManager, cache),
      packageManager === 'yarn'
        ? { name: 'Install', run: 'yarn install --immutable' }
        : { name: 'Install', run: 'npm ci' },
    ];
  },

  /**
   * Creates PR source detection step
   * This step identifies whether the workflow is running on a PR or direct push
   * and extracts the relevant branch and commit information
   */
  createSourceDetectionStep(): GitHubStep {
    return {
      name: 'Determine Build Source',
      id: 'build-source',
      run: `
# Determine if this is a PR or a direct push
EVENT_NAME="\${{ github.event_name }}"
if [[ "$EVENT_NAME" == "pull_request" ]] || [[ "$EVENT_NAME" == "pull_request_target" ]]; then
  # This is a PR - use PR-specific variables
  echo "is_pr=true" >> $GITHUB_OUTPUT
  echo "source_branch=\${{ github.head_ref }}" >> $GITHUB_OUTPUT
  echo "source_sha=\${{ github.sha }}" >> $GITHUB_OUTPUT
  PR_NUM="\${{ github.event.pull_request.number }}"
  BRANCH="\${{ github.head_ref }}"
  echo "📌 Running on PR #$PR_NUM from branch $BRANCH"
else
  # This is a direct push - use branch ref
  echo "is_pr=false" >> $GITHUB_OUTPUT
  echo "source_branch=\${{ github.ref_name }}" >> $GITHUB_OUTPUT
  echo "source_sha=\${{ github.sha }}" >> $GITHUB_OUTPUT
  echo "📌 Running on branch \${{ github.ref_name }}"
fi
`,
    };
  },
};

export default commonSteps;
