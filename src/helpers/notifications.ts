import { GitHubStep } from '../types';
import { BuildOptions } from '../presets/types';

/**
 * Creates a GitHub CLI installation step that works across different CI/CD providers
 * Based on official installation guide: https://github.com/cli/cli#installation
 */
function createGitHubCLIInstallationStep(): GitHubStep {
  return {
    name: 'Setup GitHub CLI',
    run: '# Check if gh CLI is installed\n' +
      'if ! command -v gh &> /dev/null; then\n' +
      '  echo "GitHub CLI not found, installing via Homebrew..."\n' +
      '\n' +
      '  # Check if Homebrew is installed\n' +
      '  if ! command -v brew &> /dev/null; then\n' +
      '    echo "Homebrew not found. Installing Homebrew first..."\n' +
      '    # Install Homebrew (works on both Linux and macOS)\n' +
      '    BASE_URL="https://raw.githubusercontent.com"\n' +
      '    INSTALL_URL="$BASE_URL/Homebrew/install/HEAD/install.sh"\n' +
      '    /bin/bash -c "$(curl -fsSL $INSTALL_URL)"\n' +
      '\n' +
      '    # Add Homebrew to PATH for the current session\n' +
      '    if [[ "$OSTYPE" == "linux-gnu"* ]]; then\n' +
      '      echo "Adding Homebrew to PATH for Linux..."\n' +
      '      BREW_PATH="/home/linuxbrew/.linuxbrew/bin/brew"\n' +
      '      eval "$($BREW_PATH shellenv)"\n' +
      '    elif [[ "$OSTYPE" == "darwin"* ]]; then\n' +
      '      echo "Adding Homebrew to PATH for macOS..."\n' +
      '      BREW_PATH="/opt/homebrew/bin/brew"\n' +
      '      eval "$($BREW_PATH shellenv)"\n' +
      '    fi\n' +
      '  else\n' +
      '    echo "Homebrew is already installed"\n' +
      '  fi\n' +
      '\n' +
      '  # Install GitHub CLI via Homebrew\n' +
      '  echo "Installing GitHub CLI via Homebrew..."\n' +
      '  brew install gh\n' +
      'else\n' +
      '  echo "GitHub CLI is already installed"\n' +
      'fi\n' +
      '\n' +
      '# Verify installation\n' +
      'gh --version\n' +
      'echo "GitHub CLI setup completed successfully"',
    env: {
      GITHUB_TOKEN: '${{ secrets.GITHUB_TOKEN }}',
    },
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
      const s3Path = platformPath + '/' + build.variant + '/${{ github.head_ref || github.ref_name }}';
      return '${{ secrets.S3_BASE_URL }}/' + s3Path;
    }
    default:
      return 'Available in artifacts';
  }
}

/**
 * Creates a PR comment step using GitHub CLI
 */
function createPRCommentStep(build: BuildOptions, platform: string): GitHubStep {
  const downloadLocation = getDownloadLocation(build, platform);
  
  return {
    name: 'Add PR Comment via GitHub CLI',
    if: 'steps.build-source.outputs.is_pr == \'true\'',
    run: '# Create comment message\n' +
      'MESSAGE="' + platform + ' ' + build.variant + ' build completed!\n\n' +
      'Download: ' + downloadLocation + '"\n\n' +
      '# Check if comment already exists and update it\n' +
      'PR_NUM="${{ github.event.number }}"\n' +
      'SEARCH_TEXT="' + platform + ' ' + build.variant + ' build"\n' +
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
function createSlackNotificationStep(build: BuildOptions, platform: string): GitHubStep {
  return {
    name: 'Send Slack Notification',
    if: 'always()',
    uses: 'rtCamp/action-slack-notify@master',
    env: {
      SLACK_WEBHOOK: '${{ secrets.SLACK_WEBHOOK }}',
      SLACK_CHANNEL: '#builds',
      SLACK_USERNAME: 'Build Bot',
      SLACK_ICON: 'https://github.com/rtCamp.png?size=48',
      SLACK_COLOR: '${{ job.status }}',
      SLACK_TITLE: platform + ' Build Result',
      SLACK_MESSAGE: platform + ' ' + build.variant + ' build for ${{ github.head_ref || github.ref_name }} completed with status: ${{ job.status }}',
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
    
    // Add Slack notification if configured
    if (build.notification === 'slack' || build.notification === 'both') {
      steps.push(createSlackNotificationStep(build, 'Android'));
    }
    
    // Add PR comment notification if configured
    if (build.notification === 'pr-comment' || build.notification === 'both') {
      // Add GitHub CLI installation step (platform-agnostic)
      const cliInstallStep = createGitHubCLIInstallationStep();
      cliInstallStep.if = 'steps.build-source.outputs.is_pr == \'true\'';
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
    
    // Add Slack notification if configured
    if (build.notification === 'slack' || build.notification === 'both') {
      steps.push(createSlackNotificationStep(build, 'iOS'));
    }
    
    // Add PR comment notification if configured
    if (build.notification === 'pr-comment' || build.notification === 'both') {
      // Add GitHub CLI installation step (platform-agnostic)
      const cliInstallStep = createGitHubCLIInstallationStep();
      cliInstallStep.if = 'steps.build-source.outputs.is_pr == \'true\'';
      steps.push(cliInstallStep);

      // Add PR comment step
      steps.push(createPRCommentStep(build, 'iOS'));
    }
    
    return steps;
  }
};

export default notificationHelpers;