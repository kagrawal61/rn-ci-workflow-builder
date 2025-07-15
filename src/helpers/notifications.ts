import { BuildOptions } from '../presets/types';
import { GitHubStep } from '../types';

// Types for better type safety
interface NotificationStepConfig {
  stepId: string;
  stepName: string;
  context?: string;
}

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
        platformPath + '/' + build.variant + '/${{ github.run_id }}';
      return '${{ secrets.S3_BASE_URL }}/' + s3Path;
    }
    default:
      return 'Available in artifacts';
  }
}

/**
 * Creates a common PR status detection step
 */
function createPRStatusDetectionStep(
  config: NotificationStepConfig
): GitHubStep {
  const contextMessage = config.context || 'build';

  return {
    name: config.stepName,
    id: config.stepId,
    run: `
# Determine if this is a PR or a direct push
EVENT_NAME="\${{ github.event_name }}"
if [[ "$EVENT_NAME" == "pull_request" ]] || [[ "$EVENT_NAME" == "pull_request_target" ]]; then
  # This is a PR - set output flag
  echo "is_pr=true" >> $GITHUB_OUTPUT
  echo "📌 Running ${contextMessage} on PR #\${{ github.event.pull_request.number }} from branch \${{ github.head_ref }}"
else
  # This is a direct push - set output flag
  echo "is_pr=false" >> $GITHUB_OUTPUT
  echo "📌 Running ${contextMessage} on branch \${{ github.ref_name }}"
fi
`,
  };
}

/**
 * Creates a conditional CLI installation step
 */
function createConditionalCLIInstallationStep(stepId: string): GitHubStep {
  const cliInstallStep = createGitHubCLIInstallationStep();
  cliInstallStep.if = `steps.${stepId}.outputs.is_pr == 'true'`;
  return cliInstallStep;
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
      'echo "Creating new comment..."\n' +
      'gh pr comment $PR_NUM --body "$MESSAGE"\n',
    env: {
      GH_TOKEN: '${{ secrets.GITHUB_TOKEN }}',
    },
  };
}

/**
 * Creates a static analysis PR comment step
 */
function createStaticAnalysisPRCommentStep(stepId: string): GitHubStep {
  return {
    name: 'Add Static Analysis PR Comment',
    if: `steps.${stepId}.outputs.is_pr == 'true'`,
    run:
      '# Create comment message\n' +
      'MESSAGE="## 📊 Static Analysis Results\n\n' +
      "${{ job.status == 'success' && '✅ All static analysis checks passed!' || '❌ Some static analysis checks failed!' }}\n\n" +
      '### Build Information\n' +
      '- **Repository**: ${{ github.repository }}\n' +
      '- **Branch**: ${{ github.head_ref }}\n' +
      '- **Commit**: ${{ github.sha }}\n' +
      '- **Workflow**: ${{ github.workflow }}\n\n' +
      '> Static analysis completed via React Native CI Workflow Builder"\n\n' +
      '# Check if comment already exists and update it\n' +
      'PR_NUM="${{ github.event.number }}"\n' +
      'SEARCH_TEXT="Static Analysis Results"\n' +
      'echo "Creating new comment..."\n' +
      'gh pr comment $PR_NUM --body "$MESSAGE"\n',
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
  const payloadString = `{
              "text": "${platformEmoji} *${platform} ${build.variant} build* \${{ job.status == 'success' && ':rocket: Success' || job.status == 'failure' && ':boom: Failed' || ':warning: Warning' }}",
              "blocks": [
                {
                  "type": "header",
                  "text": {
                    "type": "plain_text",
                    "text": "${platformEmoji} ${platform} Build ${build.variant}",
                    "emoji": true
                  }
                },
                {
                  "type": "section",
                  "text": {
                    "type": "mrkdwn",
                    "text": "\${{ job.status == 'success' && ':white_check_mark: *Success*' || job.status == 'failure' && ':x: *Failed*' || ':warning: *Warning*' }} | <\${{ github.server_url }}/\${{ github.repository }}/actions/runs/\${{ github.run_id }}|View Workflow Run>"
                  }
                },
                {
                  "type": "divider"
                },
                {
                  "type": "section",
                  "fields": [
                    {
                      "type": "mrkdwn",
                      "text": "*Download:*\\n${downloadLocation}"
                    }
                  ]
                },
                {
                  "type": "context",
                  "elements": [
                    {
                      "type": "mrkdwn",
                      "text": "Build #\${{ github.run_number }} | \${{ github.workflow }} workflow | <\${{ github.server_url }}/\${{ github.repository }}|${platform.toLowerCase()}-${build.variant}>"
                    }
                  ]
                }
              ]
            }`;

  return {
    name: 'Send Slack Notification',
    if: 'always()',
    uses: 'slackapi/slack-github-action@v2.1.0',
    with: {
      webhook: '${{ secrets.SLACK_WEBHOOK }}',
      'webhook-type': 'incoming-webhook',
      payload: payloadString,
    },
  };
}

/**
 * Creates a static analysis Slack notification step
 */
function createStaticAnalysisSlackNotificationStep(): GitHubStep {
  const withConfig: Record<string, string> = {
    webhook: '${{ secrets.SLACK_WEBHOOK_URL }}',
    payload: JSON.stringify({
      text: '*Static Analysis Results*: ${{ job.status }}',
      blocks: [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: '📊 Static Analysis Results',
            emoji: true,
          },
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: "${{ job.status == 'success' && ':white_check_mark: All checks passed!' || ':x: Some checks failed!' }}\\n*Repository:* ${{ github.repository }}\\n*Branch:* ${{ github.head_ref || github.ref_name }}\\n*Commit:* ${{ github.sha }}",
          },
        },
        {
          type: 'actions',
          elements: [
            {
              type: 'button',
              text: {
                type: 'plain_text',
                text: 'View Workflow',
                emoji: true,
              },
              url: '${{ github.server_url }}/${{ github.repository }}/actions/runs/${{ github.run_id }}',
              action_id: 'view_workflow',
            },
            {
              type: 'button',
              text: {
                type: 'plain_text',
                text: 'View Commit',
                emoji: true,
              },
              url: '${{ github.event.pull_request.html_url || github.event.head_commit.url }}',
              action_id: 'view_commit',
            },
          ],
        },
      ],
    }),
  };

  // Add webhook-type property using bracket notation to avoid TypeScript issues
  withConfig['webhook-type'] = 'incoming-webhook';

  return {
    name: 'Send Slack Notification',
    if: 'always()',
    uses: 'slackapi/slack-github-action@v2.1.0',
    with: withConfig,
  };
}

/**
 * Helper function to check if notification type includes a specific type
 */
function shouldIncludeNotification(
  notificationType: string | undefined,
  targetType: 'slack' | 'pr-comment'
): boolean {
  if (!notificationType) return false;
  return notificationType === targetType || notificationType === 'both';
}

/**
 * Creates PR comment notification steps (common pattern)
 */
function createPRCommentNotificationSteps(
  stepId: string,
  prCommentStep: GitHubStep
): GitHubStep[] {
  const steps: GitHubStep[] = [];

  // Add PR status detection step
  steps.push(
    createPRStatusDetectionStep({
      stepId,
      stepName: 'Determine PR Status',
      context: 'build',
    })
  );

  // Add the provided PR comment step
  steps.push(prCommentStep);

  return steps;
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

    // Add Slack notification if configured
    if (shouldIncludeNotification(build.notification, 'slack')) {
      steps.push(createSlackNotificationStep(build, 'Android'));
    }

    // Add PR comment notification if configured
    if (shouldIncludeNotification(build.notification, 'pr-comment')) {
      steps.push(
        ...createPRCommentNotificationSteps(
          'build-source',
          createPRCommentStep(build, 'Android')
        )
      );
    }

    return steps;
  },

  /**
   * Creates iOS notification steps based on the notification configuration
   */
  createIOSNotificationSteps(build: BuildOptions): GitHubStep[] {
    const steps: GitHubStep[] = [];

    // Add Slack notification if configured
    if (shouldIncludeNotification(build.notification, 'slack')) {
      steps.push(createSlackNotificationStep(build, 'iOS'));
    }

    // Add PR comment notification if configured
    if (shouldIncludeNotification(build.notification, 'pr-comment')) {
      steps.push(
        ...createPRCommentNotificationSteps(
          'build-source',
          createPRCommentStep(build, 'iOS')
        )
      );
    }

    return steps;
  },

  /**
   * Creates Android notification steps based on the notification configuration (Bitrise)
   */
  createBitriseAndroidNotificationSteps(build: BuildOptions): GitHubStep[] {
    const steps: GitHubStep[] = [];

    // Add Slack notification if configured
    if (shouldIncludeNotification(build.notification, 'slack')) {
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

    // Add Slack notification if configured
    if (shouldIncludeNotification(build.notification, 'slack')) {
      steps.push(createBitriseSlackNotificationStep(build, 'iOS'));
    }

    // Note: Bitrise doesn't use PR comments in the same way as GitHub Actions
    // PR comment notifications are handled differently in Bitrise workflows

    return steps;
  },

  /**
   * Creates static analysis notification steps based on the notification configuration
   */
  createStaticAnalysisNotificationSteps(
    notificationType: string | undefined
  ): GitHubStep[] {
    const steps: GitHubStep[] = [];

    // Add Slack notification if configured
    if (shouldIncludeNotification(notificationType, 'slack')) {
      steps.push(createStaticAnalysisSlackNotificationStep());
    }

    // Add PR comment notification if configured
    if (shouldIncludeNotification(notificationType, 'pr-comment')) {
      const stepId = 'static-analysis-source';

      // Add PR status detection step
      steps.push(
        createPRStatusDetectionStep({
          stepId,
          stepName: 'Determine PR Status',
          context: 'static analysis',
        })
      );
      // Add static analysis PR comment step
      steps.push(createStaticAnalysisPRCommentStep(stepId));
    }

    return steps;
  },
};

export default notificationHelpers;
