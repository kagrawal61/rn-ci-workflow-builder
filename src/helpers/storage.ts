import { GitHubStep } from '../types';
import { BuildOptions } from '../presets/types';

/**
 * Storage solution step helpers
 */
const storageHelpers = {
  /**
   * Creates storage solution steps for Android
   */
  createAndroidStorageSteps(build: BuildOptions): GitHubStep[] {
    if (build.storage === 'github') {
      return [{
        name: 'Upload Android Artifact',
        id: 'artifact-upload-android',
        if: 'success()',
        uses: 'actions/upload-artifact@v3',
        with: {
          name: 'android-' + build.flavor + '-' + build.variant + '-${{ github.head_ref || github.ref_name }}',
          path: 'android/app/build/outputs/apk/**/*.apk',
          'retention-days': 30
        }
      }];
    } else if (build.storage === 'firebase') {
      return [{
        name: 'Upload to Firebase App Distribution',
        id: 'firebase-distribution',
        if: 'success()',
        uses: 'wzieba/Firebase-Distribution-Github-Action@v1',
        with: {
          appId: '${{ secrets.FIREBASE_APP_ID_ANDROID }}',
          serviceCredentialsFileContent: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}',
          file: 'android/app/build/outputs/apk/**/*.apk',
          releaseNotes: 'Branch: ${{ github.head_ref || github.ref_name }}\nCommit: ${{ github.sha }}',
          groups: 'testers',
        },
      }];
    } else if (build.storage === 'drive') {
      return [{
        name: 'Upload to Google Drive',
        id: 'drive-upload',
        if: 'success()',
        uses: 'adityak74/google-drive-upload-git-action@master',
        with: {
          credentials: '${{ secrets.GOOGLE_DRIVE_CREDENTIALS }}',
          filename: 'android/app/build/outputs/apk/**/*.apk',
          folderId: '${{ secrets.GOOGLE_DRIVE_FOLDER_ID }}',
          name: 'android-' + build.flavor + '-' + build.variant + '-${{ github.head_ref || github.ref_name }}-${{ github.sha }}.apk',
        },
      }];
    } else if (build.storage === 's3') {
      return [{
        name: 'Upload to S3',
        id: 's3-upload',
        if: 'success()',
        uses: 'jakejarvis/s3-sync-action@master',
        with: {
          args: '--acl public-read',
        },
        env: {
          SOURCE_DIR: 'android/app/build/outputs/apk',
          AWS_S3_BUCKET: '${{ secrets.AWS_S3_BUCKET }}',
          AWS_ACCESS_KEY_ID: '${{ secrets.AWS_ACCESS_KEY_ID }}',
          AWS_SECRET_ACCESS_KEY: '${{ secrets.AWS_SECRET_ACCESS_KEY }}',
          AWS_REGION: '${{ secrets.AWS_REGION }}',
          DEST_DIR: 'android/' + build.flavor + '/' + build.variant + '/${{ github.head_ref || github.ref_name }}',
        },
      }];
    }
    
    return [];
  },

  /**
   * Creates storage solution steps for iOS
   */
  createIOSStorageSteps(build: BuildOptions): GitHubStep[] {
    if (build.storage === 'github') {
      return [{
        name: 'Upload iOS Artifact',
        id: 'artifact-upload-ios',
        if: 'success()',
        uses: 'actions/upload-artifact@v3',
        with: {
          name: 'ios-' + build.flavor + '-' + build.variant + '-${{ github.head_ref || github.ref_name }}',
          path: 'ios/build/Build/Products/**/*.ipa',
          'retention-days': 30
        }
      }];
    } else if (build.storage === 'firebase') {
      return [{
        name: 'Upload to Firebase App Distribution',
        id: 'firebase-distribution',
        if: 'success()',
        uses: 'wzieba/Firebase-Distribution-Github-Action@v1',
        with: {
          appId: '${{ secrets.FIREBASE_APP_ID_IOS }}',
          serviceCredentialsFileContent: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}',
          file: 'ios/build/Build/Products/**/*.ipa',
          releaseNotes: 'Branch: ${{ github.head_ref || github.ref_name }}\nCommit: ${{ github.sha }}',
          groups: 'testers',
        },
      }];
    } else if (build.storage === 'drive') {
      return [{
        name: 'Upload to Google Drive',
        id: 'drive-upload',
        if: 'success()',
        uses: 'adityak74/google-drive-upload-git-action@master',
        with: {
          credentials: '${{ secrets.GOOGLE_DRIVE_CREDENTIALS }}',
          filename: 'ios/build/Build/Products/**/*.ipa',
          folderId: '${{ secrets.GOOGLE_DRIVE_FOLDER_ID }}',
          name: 'ios-' + build.flavor + '-' + build.variant + '-${{ github.head_ref || github.ref_name }}-${{ github.sha }}.ipa',
        },
      }];
    } else if (build.storage === 's3') {
      return [{
        name: 'Upload to S3',
        id: 's3-upload',
        if: 'success()',
        uses: 'jakejarvis/s3-sync-action@master',
        with: {
          args: '--acl public-read',
        },
        env: {
          SOURCE_DIR: 'ios/build/Build/Products',
          AWS_S3_BUCKET: '${{ secrets.AWS_S3_BUCKET }}',
          AWS_ACCESS_KEY_ID: '${{ secrets.AWS_ACCESS_KEY_ID }}',
          AWS_SECRET_ACCESS_KEY: '${{ secrets.AWS_SECRET_ACCESS_KEY }}',
          AWS_REGION: '${{ secrets.AWS_REGION }}',
          DEST_DIR: 'ios/' + build.flavor + '/' + build.variant + '/${{ github.head_ref || github.ref_name }}',
        },
      }];
    }
    
    return [];
  }
};

export default storageHelpers;