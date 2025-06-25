import { GitHubStep } from '../types';
import { BuildOptions } from '../presets/types';

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
      steps.push({
        name: 'Send Slack Notification',
        if: 'always()',
        uses: 'rtCamp/action-slack-notify@master',
        env: {
          SLACK_WEBHOOK: '${{ secrets.SLACK_WEBHOOK }}',
          SLACK_CHANNEL: '#builds',
          SLACK_USERNAME: 'Build Bot',
          SLACK_ICON: 'https://github.com/rtCamp.png?size=48',
          SLACK_COLOR: '${{ job.status }}',
          SLACK_TITLE: 'Android Build Result',
          SLACK_MESSAGE: 'Android ' + build.flavor + ' ' + build.variant + ' build for ${{ github.head_ref || github.ref_name }} completed with status: ${{ job.status }}',
        },
      });
    }
    
    // Add PR comment notification if configured
    if (build.notification === 'pr-comment' || build.notification === 'both') {
      steps.push({
        name: 'Add PR Comment',
        if: 'steps.build-source.outputs.is_pr == \'true\'',
        uses: 'thollander/actions-comment-pull-request@v2',
        with: {
          message: 'Android ' + build.flavor + ' ' + build.variant + ' build completed!\n\nDownload: ' 
            + (build.storage === 'github' ? 'Available in GitHub Artifacts' 
              : build.storage === 'firebase' ? 'Firebase App Distribution'
              : build.storage === 'drive' ? 'Google Drive'
              : build.storage === 's3' ? '${{ secrets.S3_BASE_URL }}/android/' + build.flavor + '/' + build.variant + '/${{ github.head_ref || github.ref_name }}'
              : 'Available in artifacts'),
          comment_includes: 'Android ' + build.flavor + ' ' + build.variant + ' build',
          mode: 'replace',
        },
      });
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
      steps.push({
        name: 'Send Slack Notification',
        if: 'always()',
        uses: 'rtCamp/action-slack-notify@master',
        env: {
          SLACK_WEBHOOK: '${{ secrets.SLACK_WEBHOOK }}',
          SLACK_CHANNEL: '#builds',
          SLACK_USERNAME: 'Build Bot',
          SLACK_ICON: 'https://github.com/rtCamp.png?size=48',
          SLACK_COLOR: '${{ job.status }}',
          SLACK_TITLE: 'iOS Build Result',
          SLACK_MESSAGE: 'iOS ' + build.flavor + ' ' + build.variant + ' build for ${{ github.head_ref || github.ref_name }} completed with status: ${{ job.status }}',
        },
      });
    }
    
    // Add PR comment notification if configured
    if (build.notification === 'pr-comment' || build.notification === 'both') {
      steps.push({
        name: 'Add PR Comment',
        if: 'steps.build-source.outputs.is_pr == \'true\'',
        uses: 'thollander/actions-comment-pull-request@v2',
        with: {
          message: 'iOS ' + build.flavor + ' ' + build.variant + ' build completed!\n\nDownload: ' 
            + (build.storage === 'github' ? 'Available in GitHub Artifacts' 
              : build.storage === 'firebase' ? 'Firebase App Distribution'
              : build.storage === 'drive' ? 'Google Drive'
              : build.storage === 's3' ? '${{ secrets.S3_BASE_URL }}/ios/' + build.flavor + '/' + build.variant + '/${{ github.head_ref || github.ref_name }}'
              : 'Available in artifacts'),
          comment_includes: 'iOS ' + build.flavor + ' ' + build.variant + ' build',
          mode: 'replace',
        },
      });
    }
    
    return steps;
  }
};

export default notificationHelpers;