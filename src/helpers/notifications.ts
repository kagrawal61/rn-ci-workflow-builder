import { BuildOptions } from '../presets/types';
import { GitHubStep } from '../types';

// GitHub CLI is pre-installed on GitHub Actions runners, so no setup step is needed

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
        '/${{ github.run_id }}';
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
      '# Create comment message with emojis\n' +
      `EMOJI="${platform === 'Android' ? '🤖' : '🍎'}"\n` +
      'WORKFLOW_URL="${{ github.server_url }}/${{ github.repository }}/actions/runs/${{ github.run_id }}"\n' +
      'MESSAGE="' +
      `$EMOJI **${platform} ${build.variant} build completed! ✅**\n\n` +
      '📥 **Download**: ' +
      downloadLocation +
      '\n\n' +
      '🔗 **Workflow**: [View Build Run](' +
      '${WORKFLOW_URL})' +
      '"\n\n' +
      '# Check if comment already exists and update it\n' +
      'PR_NUM="${{ github.event.number }}"\n' +
      'SEARCH_TEXT="' +
      platform +
      ' ' +
      build.variant +
      ' build completed"\n' +
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
      GH_TOKEN: '${{ secrets.GITHUB_TOKEN }}',
    },
  };
}

/**
 * Creates a Bitrise-specific Slack notification step
 */
function createBitriseSlackNotificationStep(
  build: BuildOptions,
  platform: string
): GitHubStep {
  const downloadLocation = getDownloadLocation(build, platform);

  return {
    name: 'Send Slack Notification',
    if: 'always()',
    uses: 'slack@4',
    with: {
      webhook_url: '$SLACK_WEBHOOK_URL',
      text:
        platform +
        ' ' +
        build.variant +
        ' build for $BITRISE_GIT_BRANCH completed with status: $BITRISE_BUILD_STATUS',
      channel: '#builds',
      from_username: 'Bitrise Bot',
      from_username_on_error: 'Bitrise Bot',
      icon_emoji: ':robot_face:',
      icon_emoji_on_error: ':warning:',
      color: 'good',
      color_on_error: 'danger',
      pretext: 'Build completed for ' + platform,
      pretext_on_error: 'Build failed for ' + platform,
      title: platform + ' Build Result',
      title_link: '$BITRISE_BUILD_URL',
      message:
        'Platform: ' +
        platform +
        '\nVariant: ' +
        build.variant +
        '\nBranch: $BITRISE_GIT_BRANCH\nCommit: $BITRISE_GIT_COMMIT\nDownload: ' +
        downloadLocation,
      message_on_error:
        'Platform: ' +
        platform +
        '\nVariant: ' +
        build.variant +
        '\nBranch: $BITRISE_GIT_BRANCH\nCommit: $BITRISE_GIT_COMMIT\nPlease check the build logs for details.',
      fields:
        'Repository|$BITRISE_GIT_MESSAGE\nBranch|$BITRISE_GIT_BRANCH\nCommit|$BITRISE_GIT_COMMIT\nBuild Number|$BITRISE_BUILD_NUMBER',
      buttons:
        'View Build|$BITRISE_BUILD_URL\nView Commit|$GIT_CLONE_COMMIT_MESSAGE_SUBJECT',
    },
  };
}

/**
 * Creates a GitHub Actions Slack notification step using the latest Slack GitHub Action APIs
 */
function createSlackNotificationStep(
  build: BuildOptions,
  platform: string
): GitHubStep {
  const downloadLocation = getDownloadLocation(build, platform);

  // Enhanced Slack notification with emojis and streamlined content
  const platformEmoji = platform === 'Android' ? ':android:' : ':apple:';
  const payloadYaml = [
    `text: "${platformEmoji} *${platform} ${build.variant} build* \${{ job.status == 'success' && ':rocket: Success' || job.status == 'failure' && ':boom: Failed' || ':warning: Warning' }}"`,
    'blocks:',
    '  - type: header',
    '    text:',
    '      type: plain_text',
    `      text: ${platformEmoji} ${platform} Build ${build.variant}`,
    '      emoji: true',
    '  - type: section',
    '    text:',
    '      type: mrkdwn',
    `      text: "\${{ job.status == 'success' && ':white_check_mark: *Success*' || job.status == 'failure' && ':x: *Failed*' || ':warning: *Warning*' }} | <\${{ github.server_url }}/\${{ github.repository }}/actions/runs/\${{ github.run_id }}|View Workflow Run>"`,
    '  - type: divider',
    '  - type: section',
    '    fields:',
    '      - type: mrkdwn',
    `        text: "*Download:*\\n${downloadLocation}"`,
    '  - type: context',
    '    elements:',
    '      - type: mrkdwn',
    `        text: "Build #\${{ github.run_number }} | \${{ github.workflow }} workflow | <\${{ github.server_url }}/\${{ github.repository }}|${platform.toLowerCase()}-${build.variant}>"`,
    '    ]',
  ].join('\n');

  return {
    name: 'Send Slack Notification',
    if: 'always()',
    uses: 'slackapi/slack-github-action@v2.1.0',
    with: {
      webhook: '${{ secrets.SLACK_WEBHOOK }}',
      'webhook-type': 'incoming-webhook',
      payload: payloadYaml,
    },
  };
}

/**
 * Notification step helpers
 */
const notificationHelpers = {
  /**
   * Creates Android notification steps based on the notification configuration (GitHub Actions)
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

      // GitHub CLI is pre-installed on GitHub Actions runners, no setup needed

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

      // GitHub CLI is pre-installed on GitHub Actions runners, no setup needed

      // Add PR comment step
      steps.push(createPRCommentStep(build, 'iOS'));
    }

    return steps;
  },

  /**
   * Creates Android notification steps based on the notification configuration (Bitrise)
   */
  createBitriseAndroidNotificationSteps(build: BuildOptions): GitHubStep[] {
    const steps: GitHubStep[] = [];

    // Add Slack notification if configured - doesn't need special PR detection
    if (build.notification === 'slack' || build.notification === 'both') {
      steps.push(createBitriseSlackNotificationStep(build, 'Android'));
    }

    // Note: Bitrise doesn't use PR comments in the same way as GitHub Actions
    // PR comment notifications are handled differently in Bitrise workflows

    return steps;
  },

  /**
   * Creates iOS notification steps based on the notification configuration (Bitrise)
   */
  createBitriseIOSNotificationSteps(build: BuildOptions): GitHubStep[] {
    const steps: GitHubStep[] = [];

    // Add Slack notification if configured - doesn't need special PR detection
    if (build.notification === 'slack' || build.notification === 'both') {
      steps.push(createBitriseSlackNotificationStep(build, 'iOS'));
    }

    // Note: Bitrise doesn't use PR comments in the same way as GitHub Actions
    // PR comment notifications are handled differently in Bitrise workflows

    return steps;
  },
};

export default notificationHelpers;
