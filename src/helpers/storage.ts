import { GitHubStep } from '../types';
import { BuildOptions } from '../presets/types';

/**
 * Storage solution step helpers
 * 
 * This module provides helper functions to generate workflow steps for different
 * artifact storage solutions (GitHub Artifacts, Firebase App Distribution, 
 * Google Drive, Amazon S3) for both Android and iOS builds.
 * 
 * Each storage helper:
 * - Takes build configuration options
 * - Returns appropriate GitHub Actions steps for storing artifacts
 * - Handles finding and uploading the correct file types
 * - Sets up authentication when needed (Firebase, Google Drive, S3)
 */
const storageHelpers = {
  /**
   * Creates storage solution steps for Android build artifacts
   * 
   * Generates the appropriate GitHub Actions steps to store Android build artifacts
   * (APK and/or AAB files) in the configured storage solution.
   * 
   * @param build BuildOptions containing storage configuration and build variant
   * @returns Array of GitHub workflow steps for the selected storage solution
   */
  createAndroidStorageSteps(build: BuildOptions): GitHubStep[] {
    if (build.storage === 'github') {
      // Handle different Android output types
      if (build.androidOutputType === 'both') {
        // If both output types are selected, create two artifact upload steps
        return [
          {
            name: 'Upload Android APK Artifact',
            id: 'artifact-upload-android-apk',
            if: 'success()',
            'continue-on-error': true,
            uses: 'actions/upload-artifact@v4',
            with: {
              name:
                'android-' +
                build.variant +
                '-apk-${{ github.head_ref || github.ref_name }}',
              path: 'android/app/build/outputs/apk/**/*.apk',
              'retention-days': 30,
            },
          },
          {
            name: 'Upload Android AAB Artifact',
            id: 'artifact-upload-android-aab',
            if: 'success()',
            'continue-on-error': true,
            uses: 'actions/upload-artifact@v4',
            with: {
              name:
                'android-' +
                build.variant +
                '-aab-${{ github.head_ref || github.ref_name }}',
              path: 'android/app/build/outputs/bundle/**/*.aab',
              'retention-days': 30,
            },
          },
        ];
      } else {
        // For single output type
        return [
          {
            name: 'Upload Android Artifact',
            id: 'artifact-upload-android',
            if: 'success()',
            'continue-on-error': true,
            uses: 'actions/upload-artifact@v4',
            with: {
              name:
                'android-' +
                build.variant +
                '-' +
                (build.androidOutputType || 'apk') +
                '-${{ github.head_ref || github.ref_name }}',
              path:
                build.androidOutputType === 'aab'
                  ? 'android/app/build/outputs/bundle/**/*.aab'
                  : 'android/app/build/outputs/apk/**/*.apk',
              'retention-days': 30,
            },
          },
        ];
      }
    } else if (build.storage === 'firebase') {
      return [
        {
          name: 'Find Android APK',
          id: 'find-apk',
          run: 'APK_PATH=$(find android/app/build/outputs/apk -name "*.apk" -type f | head -1) && echo "apk_path=$APK_PATH" >> $GITHUB_OUTPUT',
        },
        {
          name: 'Upload to Firebase App Distribution',
          id: 'firebase-distribution',
          if: 'success()',
          uses: 'wzieba/Firebase-Distribution-Github-Action@v1.4.0',
          with: {
            appId: '${{ secrets.FIREBASE_APP_ID_ANDROID }}',
            serviceCredentialsFileContent:
              '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}',
            file: '${{ steps.find-apk.outputs.apk_path }}',
            releaseNotes:
              'Branch: ${{ github.head_ref || github.ref_name }}\nCommit: ${{ github.sha }}\nBuild: ' +
              build.variant +
              ' build',
            groups: "${{ secrets.FIREBASE_TEST_GROUPS || 'testers' }}",
            debug: false,
          },
        },
      ];
    } else if (build.storage === 'drive') {
      return [
        {
          name: 'Create rclone config for Google Drive',
          run: '\n# Create rclone config directory\nmkdir -p ~/.config/rclone\n\n# Check if we have a service account file\nif [ -n "${{ secrets.GDRIVE_SERVICE_ACCOUNT_JSON }}" ]; then\n  # Create temporary file for service account\n  echo "${{ secrets.GDRIVE_SERVICE_ACCOUNT_JSON }}" > ~/.config/rclone/service_account.json\n  \n  # Use service account authentication (preferred for CI)\n  cat > ~/.config/rclone/rclone.conf << EOF\n[gdrive]\ntype = drive\nscope = drive\nservice_account_file = ~/.config/rclone/service_account.json\nEOF\nelse\n  # Fall back to client_id/client_secret/token if service account not available\n  cat > ~/.config/rclone/rclone.conf << EOF\n[gdrive]\ntype = drive\ntoken = ${{ secrets.GDRIVE_REFRESH_TOKEN }}\nclient_id = ${{ secrets.GDRIVE_CLIENT_ID || "" }}\nclient_secret = ${{ secrets.GDRIVE_CLIENT_SECRET || "" }}\nEOF\nfi',
        },
        {
          name: 'Setup rclone',
          uses: 'AnimMouse/setup-rclone@v1',
        },
        {
          name: 'Upload to Google Drive',
          id: 'drive-upload',
          if: 'success()',
          run:
            '\n# Find the APK file\nAPK_FILE=$(find android/app/build/outputs/apk -name "*.apk" -type f | head -1)\n\n# Create remote filename\nREMOTE_NAME="android-' +
            build.variant +
            '-${{ github.head_ref || github.ref_name }}-${{ github.sha }}.apk"\n\n# Determine folder path to use (if provided)\nFOLDER_PATH="${GDRIVE_FOLDER_ID:-react-native-builds}"\nFOLDER_PARAM="${FOLDER_PATH}"\n\n# Upload to Google Drive\nrclone copy "$APK_FILE" "gdrive:${FOLDER_PARAM}/$REMOTE_NAME" --progress\n\necho "File uploaded to Google Drive folder ${FOLDER_PARAM}: $REMOTE_NAME"',
        },
      ];
    } else if (build.storage === 's3') {
      return [
        {
          name: 'Create rclone config for S3',
          run: '\n# Create rclone config directory\nmkdir -p ~/.config/rclone\n\n# Create rclone config file for S3\ncat > ~/.config/rclone/rclone.conf << EOF\n[s3]\ntype = s3\nprovider = AWS\nenv_auth = false\naccess_key_id = ${{ secrets.AWS_ACCESS_KEY_ID }}\nsecret_access_key = ${{ secrets.AWS_SECRET_ACCESS_KEY }}\nEOF',
        },
        {
          name: 'Setup rclone',
          uses: 'AnimMouse/setup-rclone@v1',
        },
        {
          name: 'Upload to S3',
          id: 's3-upload',
          if: 'success()',
          run:
            '\n# Find the APK file\nAPK_FILE=$(find android/app/build/outputs/apk -name "*.apk" -type f | head -1)\n\n# Create remote path\nREMOTE_PATH="android/' +
            build.variant +
            '/${{ github.head_ref || github.ref_name }}/${{ github.sha }}.apk"\n\n# Get bucket name from environment or use default\nBUCKET_NAME="${AWS_S3_BUCKET:-rn-artifacts}"\n\n# Upload to S3\nrclone copy "$APK_FILE" "s3:${BUCKET_NAME}/$REMOTE_PATH" --progress\n\necho "File uploaded to S3 bucket ${BUCKET_NAME}: $REMOTE_PATH"',
        },
      ];
    }

    return [];
  },

  /**
   * Creates storage solution steps for iOS build artifacts
   * 
   * Generates the appropriate GitHub Actions steps to store iOS build artifacts
   * (IPA files) in the configured storage solution.
   * 
   * @param build BuildOptions containing storage configuration and build variant
   * @returns Array of GitHub workflow steps for the selected storage solution
   */
  createIOSStorageSteps(build: BuildOptions): GitHubStep[] {
    if (build.storage === 'github') {
      return [
        {
          name: 'Upload iOS Artifact',
          id: 'artifact-upload-ios',
          if: 'success()',
          'continue-on-error': true,
          uses: 'actions/upload-artifact@v4',
          with: {
            name:
              'ios-' +
              build.variant +
              '-${{ github.head_ref || github.ref_name }}',
            path: 'ios/build/Build/Products/**/*.ipa',
            'retention-days': 30,
          },
        },
      ];
    } else if (build.storage === 'firebase') {
      return [
        {
          name: 'Find iOS IPA',
          id: 'find-ipa',
          run: 'IPA_PATH=$(find ios/build/Build/Products -name "*.ipa" -type f | head -1) && echo "ipa_path=$IPA_PATH" >> $GITHUB_OUTPUT',
        },
        {
          name: 'Upload to Firebase App Distribution',
          id: 'firebase-distribution',
          if: 'success()',
          uses: 'wzieba/Firebase-Distribution-Github-Action@v1.4.0',
          with: {
            appId: '${{ secrets.FIREBASE_APP_ID_IOS }}',
            serviceCredentialsFileContent:
              '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}',
            file: '${{ steps.find-ipa.outputs.ipa_path }}',
            releaseNotes:
              'Branch: ${{ github.head_ref || github.ref_name }}\nCommit: ${{ github.sha }}\nBuild: ' +
              build.variant +
              ' build',
            groups: "${{ secrets.FIREBASE_TEST_GROUPS || 'testers' }}",
            debug: false,
          },
        },
      ];
    } else if (build.storage === 'drive') {
      return [
        {
          name: 'Create rclone config for Google Drive',
          run: '\n# Create rclone config directory\nmkdir -p ~/.config/rclone\n\n# Check if we have a service account file\nif [ -n "${{ secrets.GDRIVE_SERVICE_ACCOUNT_JSON }}" ]; then\n  # Create temporary file for service account\n  echo "${{ secrets.GDRIVE_SERVICE_ACCOUNT_JSON }}" > ~/.config/rclone/service_account.json\n  \n  # Use service account authentication (preferred for CI)\n  cat > ~/.config/rclone/rclone.conf << EOF\n[gdrive]\ntype = drive\nscope = drive\nservice_account_file = ~/.config/rclone/service_account.json\nEOF\nelse\n  # Fall back to client_id/client_secret/token if service account not available\n  cat > ~/.config/rclone/rclone.conf << EOF\n[gdrive]\ntype = drive\ntoken = ${{ secrets.GDRIVE_REFRESH_TOKEN }}\nclient_id = ${{ secrets.GDRIVE_CLIENT_ID || "" }}\nclient_secret = ${{ secrets.GDRIVE_CLIENT_SECRET || "" }}\nEOF\nfi',
        },
        {
          name: 'Setup rclone',
          uses: 'AnimMouse/setup-rclone@v1',
        },
        {
          name: 'Upload to Google Drive',
          id: 'drive-upload',
          if: 'success()',
          run:
            '\n# Find the IPA file\nIPA_FILE=$(find ios/build/Build/Products -name "*.ipa" -type f | head -1)\n\n# Create remote filename\nREMOTE_NAME="ios-' +
            build.variant +
            '-${{ github.head_ref || github.ref_name }}-${{ github.sha }}.ipa"\n\n# Determine folder path to use (if provided)\nFOLDER_PATH="${GDRIVE_FOLDER_ID:-react-native-builds}"\nFOLDER_PARAM="${FOLDER_PATH}"\n\n# Upload to Google Drive\nrclone copy "$IPA_FILE" "gdrive:${FOLDER_PARAM}/$REMOTE_NAME" --progress\n\necho "File uploaded to Google Drive folder ${FOLDER_PARAM}: $REMOTE_NAME"',
        },
      ];
    } else if (build.storage === 's3') {
      return [
        {
          name: 'Create rclone config for S3',
          run: '\n# Create rclone config directory\nmkdir -p ~/.config/rclone\n\n# Create rclone config file for S3\ncat > ~/.config/rclone/rclone.conf << EOF\n[s3]\ntype = s3\nprovider = AWS\nenv_auth = false\naccess_key_id = ${{ secrets.AWS_ACCESS_KEY_ID }}\nsecret_access_key = ${{ secrets.AWS_SECRET_ACCESS_KEY }}\nEOF',
        },
        {
          name: 'Setup rclone',
          uses: 'AnimMouse/setup-rclone@v1',
        },
        {
          name: 'Upload to S3',
          id: 's3-upload',
          if: 'success()',
          run:
            '\n# Find the IPA file\nIPA_FILE=$(find ios/build/Build/Products -name "*.ipa" -type f | head -1)\n\n# Create remote path\nREMOTE_PATH="ios/' +
            build.variant +
            '/${{ github.head_ref || github.ref_name }}/${{ github.sha }}.ipa"\n\n# Get bucket name from environment or use default\nBUCKET_NAME="${AWS_S3_BUCKET:-rn-artifacts}"\n\n# Upload to S3\nrclone copy "$IPA_FILE" "s3:${BUCKET_NAME}/$REMOTE_PATH" --progress\n\necho "File uploaded to S3 bucket ${BUCKET_NAME}: $REMOTE_PATH"',
        },
      ];
    }

    return [];
  },
};

export default storageHelpers;
