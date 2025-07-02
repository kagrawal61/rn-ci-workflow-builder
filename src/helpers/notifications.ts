import { BuildOptions } from '../presets/types';
import { GitHubStep } from '../types';

/**
 * Creates a GitHub CLI authorization step
 * GitHub CLI is pre-installed on GitHub Actions runners, so we only need to authorize it.
 */
function createGitHubCLIInstallationStep(): GitHubStep {
  return {
    name: 'Setup GitHub CLI',
    run:
      '# GitHub CLI is pre-installed on GitHub Actions runners\n' +
      'echo "Using pre-installed GitHub CLI"\n' +
      'gh --version\n' +
      'echo "GitHub CLI setup completed successfully"',
  };
}

/**
 * Determines the download location based on storage configuration
 */
function getDownloadLocation(build: BuildOptions, platform: string): string {
  const platformPath = platform.toLowerCase();

  switch (build.storage) {
    case 'github':
      return 'Available in GitHub Artifacts';
    case 'firebase':
      return 'Firebase App Distribution';
    case 'drive':
      return 'Google Drive';
    case 's3': {
      const s3Path =
        platformPath +
        '/' +
        build.variant +
        '/${{ github.head_ref || github.ref_name }}';
      return '${{ secrets.S3_BASE_URL }}/' + s3Path;
    }
    default:
      return 'Available in artifacts';
  }
}

/**
 * Creates a PR comment step using GitHub CLI
 */
function createPRCommentStep(
  build: BuildOptions,
  platform: string
): GitHubStep {
  const downloadLocation = getDownloadLocation(build, platform);

  return {
    name: 'Add PR Comment via GitHub CLI',
    if: "steps.build-source.outputs.is_pr == 'true'",
    run:
      '# Create comment message\n' +
      'MESSAGE="' +
      platform +
      ' ' +
      build.variant +
      ' build completed!\n\n' +
      'Download: ' +
      downloadLocation +
      '"\n\n' +
      '# Check if comment already exists and update it\n' +
      'PR_NUM="${{ github.event.number }}"\n' +
      'SEARCH_TEXT="' +
      platform +
      ' ' +
      build.variant +
      ' build"\n' +
      'JQ_SELECT=".comments[] | select(.body | contains(\\"$SEARCH_TEXT\\"))"\n' +
      'JQ_FILTER="$JQ_SELECT | .id"\n' +
      'EXISTING_COMMENT_ID=$(gh pr view $PR_NUM --json comments --jq "$JQ_FILTER" | head -1)\n\n' +
      'if [ ! -z "$EXISTING_COMMENT_ID" ]; then\n' +
      '  echo "Updating existing comment..."\n' +
      '  REPO="${{ github.repository }}"\n' +
      '  API_URL="/repos/$REPO/issues/comments/$EXISTING_COMMENT_ID"\n' +
      '  gh api -X PATCH "$API_URL" -f body="$MESSAGE"\n' +
      'else\n' +
      '  echo "Creating new comment..."\n' +
      '  gh pr comment $PR_NUM --body "$MESSAGE"\n' +
      'fi',
    env: {
      GITHUB_TOKEN: '${{ secrets.GITHUB_TOKEN }}',
    },
  };
}

/**
 * Creates a Slack notification step
 */
function createSlackNotificationStep(
  build: BuildOptions,
  platform: string
): GitHubStep {
  return {
    name: 'Send Slack Notification',
    if: 'always()',
    uses: 'slackapi/slack-github-action@v1.24.0',
    with: {
      payload: JSON.stringify({
        text: platform + " " + build.variant + " build for ${{ github.head_ref || github.ref_name }} completed with status: ${{ job.status }}",
        channel: '#builds',
        username: 'Build Bot',
        icon_emoji: ':robot_face:',
        attachments: [
          {
            color: "${{ job.status == 'success' && 'good' || job.status == 'failure' && 'danger' || 'warning' }}",
            title: platform + ' Build Result',
            fields: [
              {
                title: "Repository",
                value: "${{ github.repository }}",
                short: true
              },
              {
                title: "Branch/PR",
                value: "${{ github.head_ref || github.ref_name }}",
                short: true
              },
              {
                title: "Commit",
                value: "${{ github.sha }}",
                short: true
              },
              {
                title: "Build Variant",
                value: build.variant,
                short: true
              }
            ]
          }
        ]
      })
    },
    env: {
      SLACK_WEBHOOK_URL: '${{ secrets.SLACK_WEBHOOK }}',
      SLACK_WEBHOOK_TYPE: 'INCOMING_WEBHOOK'
    },
  };
}

/**
 * Notification step helpers
 */
const notificationHelpers = {
  /**
   * Creates Android notification steps based on the notification configuration
   */
  createAndroidNotificationSteps(build: BuildOptions): GitHubStep[] {
    const steps: GitHubStep[] = [];
    
    // Add Slack notification if configured - doesn't need special PR detection
    if (build.notification === 'slack' || build.notification === 'both') {
      steps.push(createSlackNotificationStep(build, 'Android'));
    }

    // Add PR comment notification if configured
    if (build.notification === 'pr-comment' || build.notification === 'both') {
      // Add source detection step first if needed for PR comments
      steps.push({
        name: 'Determine PR Status',
        id: 'build-source',
        run: `
# Determine if this is a PR or a direct push (simplified for PR comments only)
EVENT_NAME="\${{ github.event_name }}"
if [[ "$EVENT_NAME" == "pull_request" ]] || [[ "$EVENT_NAME" == "pull_request_target" ]]; then
  # This is a PR - set output flag
  echo "is_pr=true" >> $GITHUB_OUTPUT
  echo "📌 Running on PR #\${{ github.event.pull_request.number }} from branch \${{ github.head_ref }}"
else
  # This is a direct push - set output flag
  echo "is_pr=false" >> $GITHUB_OUTPUT
  echo "📌 Running on branch \${{ github.ref_name }}"
fi
`,
      });

      // Add GitHub CLI installation step (platform-agnostic)
      const cliInstallStep = createGitHubCLIInstallationStep();
      cliInstallStep.if = "steps.build-source.outputs.is_pr == 'true'";
      steps.push(cliInstallStep);

      // Add PR comment step
      steps.push(createPRCommentStep(build, 'Android'));
    }

    return steps;
  },

  /**
   * Creates iOS notification steps based on the notification configuration
   */
  createIOSNotificationSteps(build: BuildOptions): GitHubStep[] {
    const steps: GitHubStep[] = [];

    // Add Slack notification if configured - doesn't need special PR detection
    if (build.notification === 'slack' || build.notification === 'both') {
      steps.push(createSlackNotificationStep(build, 'iOS'));
    }

    // Add PR comment notification if configured
    if (build.notification === 'pr-comment' || build.notification === 'both') {
      // Add source detection step first if needed for PR comments
      steps.push({
        name: 'Determine PR Status',
        id: 'build-source',
        run: `
# Determine if this is a PR or a direct push (simplified for PR comments only)
EVENT_NAME="\${{ github.event_name }}"
if [[ "$EVENT_NAME" == "pull_request" ]] || [[ "$EVENT_NAME" == "pull_request_target" ]]; then
  # This is a PR - set output flag
  echo "is_pr=true" >> $GITHUB_OUTPUT
  echo "📌 Running on PR #\${{ github.event.pull_request.number }} from branch \${{ github.head_ref }}"
else
  # This is a direct push - set output flag
  echo "is_pr=false" >> $GITHUB_OUTPUT
  echo "📌 Running on branch \${{ github.ref_name }}"
fi
`,
      });
      
      // Add GitHub CLI installation step (platform-agnostic)
      const cliInstallStep = createGitHubCLIInstallationStep();
      cliInstallStep.if = "steps.build-source.outputs.is_pr == 'true'";
      steps.push(cliInstallStep);

      // Add PR comment step
      steps.push(createPRCommentStep(build, 'iOS'));
    }

    return steps;
  },
};

export default notificationHelpers;
