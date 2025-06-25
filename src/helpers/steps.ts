import { GitHubStep, PackageManager, CacheConfig } from '../types';
import { cacheSteps } from '../helpers';
import { BuildOptions } from '../presets/types';

/**
 * Common GitHub Actions workflow step helpers
 */
const commonSteps = {
  /**
   * Creates common setup steps used across platforms
   */
  createSetupSteps(packageManager: PackageManager, cache: CacheConfig | undefined, build: BuildOptions): GitHubStep[] {
    // Note: Health check steps are now moved to a separate job in the workflow
    // to avoid duplication and follow best practices

    return [
      { name: 'Checkout', uses: 'actions/checkout@v4' },
      {
        name: 'Setup Node',
        uses: 'actions/setup-node@v4',
        with: {
          'node-version': '${{ matrix.node || 20 }}',
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
if [[ "\${{ github.event_name }}" == "pull_request" || "\${{ github.event_name }}" == "pull_request_target" ]]; then
  # This is a PR - use PR-specific variables
  echo "is_pr=true" >> $GITHUB_OUTPUT
  echo "source_branch=\${{ github.head_ref }}" >> $GITHUB_OUTPUT
  echo "source_sha=\${{ github.sha }}" >> $GITHUB_OUTPUT
  echo "📌 Running on PR #\${{ github.event.pull_request.number }} from branch \${{ github.head_ref }}"
else
  # This is a direct push - use branch ref
  echo "is_pr=false" >> $GITHUB_OUTPUT
  echo "source_branch=\${{ github.ref_name }}" >> $GITHUB_OUTPUT
  echo "source_sha=\${{ github.sha }}" >> $GITHUB_OUTPUT
  echo "📌 Running on branch \${{ github.ref_name }}"
fi
`
    };
  }
};

export default commonSteps;