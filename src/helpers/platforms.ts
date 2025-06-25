import { GitHubStep, PackageManager } from '../types';
import { BuildOptions } from '../presets/types';

/**
 * Platform-specific workflow step helpers
 */
const platformHelpers = {
  /**
   * Creates Android-specific build steps with improved error handling
   */
  createAndroidBuildSteps(
    setupSteps: GitHubStep[], 
    determineBuildSourceStep: GitHubStep,
    _packageManager: PackageManager, // Not used after switch to npx, kept for API compatibility
    _buildParams: string, // Not used after switch to official CLI, kept for API compatibility 
    build: BuildOptions
  ): GitHubStep[] {
    return [
      ...setupSteps,
      determineBuildSourceStep,
      // Verify Android environment
      {
        name: 'Verify Android Environment',
        id: 'android-env-check',
        run: `
# Check for required directories and files
echo "🔍 Verifying Android project setup..."

if [ ! -d "android" ]; then
  echo "❌ Error: Android directory not found"
  echo "Make sure you're running this workflow from the root of a React Native project"
  exit 1
fi

if [ ! -f "android/gradlew" ]; then
  echo "⚠️ Warning: Gradle wrapper not found at android/gradlew"
  echo "Build may fail if Gradle wrapper is not properly set up"
fi

echo "✅ Android environment looks good"
`
      },
      // Setup Java with proper LTS version
      {
        name: 'Setup Java',
        uses: 'actions/setup-java@v3',
        with: {
          'distribution': 'temurin', // Eclipse Temurin is the recommended distribution
          'java-version': '17',      // Latest LTS version compatible with Android
          'cache': 'gradle',
        },
      },
      // Make Gradlew executable (often forgotten in repositories)
      {
        name: 'Make Gradlew Executable',
        run: 'chmod +x android/gradlew',
      },
      // Main build step
      {
        name: 'Run Android Build',
        id: 'android-build',
        run: `
echo "🚀 Starting Android build for ${build.flavor} ${build.variant}..."

# Run the build with error capture
echo "Building Android app using official React Native CLI..."

# Convert variant to lowercase for mode parameter
MODE=$(echo "${build.variant}" | tr '[:upper:]' '[:lower:]')
# This is a workaround - we need to use string value directly in MODE

# Using official React Native CLI for building Android app
npx react-native build-android --mode=$MODE || {
  echo "❌ Android build failed"
  echo "::error::Android build failed. Check logs for details."
  exit 1
}

echo "✅ Android build completed successfully"

# Verify the expected outputs exist
if ls android/app/build/outputs/apk/**/*.apk 1> /dev/null 2>&1; then
  echo "✅ APK files generated successfully"
else
  echo "⚠️ Warning: Expected APK files not found. Storage steps may fail."
fi
`
      },
      // Always attempt to store artifacts, even if build partially succeeded
      {
        name: 'Store Android Build Artifacts',
        id: 'store-artifacts',
        if: 'always() && steps.android-build.outcome != \'skipped\'',
        'continue-on-error': true,
        uses: 'actions/upload-artifact@v3',
        with: {
          name: 'android-' + build.flavor + '-' + build.variant + '-${{ github.head_ref || github.ref_name }}',
          path: 'android/app/build/outputs/apk/**/*.apk',
          'retention-days': '14',
        },
      },
    ];
  },
  
  /**
   * Creates iOS-specific build steps with improved error handling
   */
  createIOSBuildSteps(
    setupSteps: GitHubStep[], 
    determineBuildSourceStep: GitHubStep,
    _packageManager: PackageManager, // Not used after switch to npx, kept for API compatibility
    _buildParams: string, // Not used after switch to official CLI, kept for API compatibility
    build: BuildOptions // Adding build options parameter to access variant
  ): GitHubStep[] {
    return [
      ...setupSteps,
      determineBuildSourceStep,
      // Verify iOS environment
      {
        name: 'Verify iOS Environment',
        id: 'ios-env-check',
        run: `
# Check for required directories and files
echo "🔍 Verifying iOS project setup..."

if [ ! -d "ios" ]; then
  echo "❌ Error: iOS directory not found"
  echo "Make sure you're running this workflow from the root of a React Native project"
  exit 1
fi

if [ ! -f "ios/Podfile" ]; then
  echo "❌ Error: Podfile not found"
  echo "iOS build will likely fail without a valid Podfile"
  exit 1
fi

echo "✅ iOS environment looks good"
`
      },
      // Setup Ruby with proper version for CocoaPods
      {
        name: 'Setup Ruby/CocoaPods',
        uses: 'ruby/setup-ruby@v1',
        with: {
          'ruby-version': '3.0',        // Stable Ruby version for CocoaPods
          'bundler-cache': 'true',      // Enable bundler cache
          'working-directory': 'ios',   // Look for Gemfile in iOS directory
        },
      },
      // Install CocoaPods with error handling
      {
        name: 'Install CocoaPods',
        id: 'pod-install',
        run: `
echo "📦 Installing CocoaPods dependencies..."
cd ios
pod install || {
  echo "❌ CocoaPods installation failed"
  echo "::error::CocoaPods installation failed. Check for valid Podfile and Pod specs."
  exit 1
}
echo "✅ CocoaPods installation successful"
`
      },
      // Main build step with improved error handling
      {
        name: 'Run iOS Build',
        id: 'ios-build',
        run: `
echo "🚀 Starting iOS build..."

# Run the build with error capture
echo "Building iOS app using official React Native CLI..."

# Convert variant to lowercase for configuration parameter
MODE=$(echo "${build.variant}" | tr '[:upper:]' '[:lower:]')
# This is a workaround - we need to use string value directly in MODE

# Using official React Native CLI for building iOS app
npx react-native build-ios --mode=$MODE || {
  echo "❌ iOS build failed"
  echo "::error::iOS build failed. Check logs for details."
  exit 1
}

echo "✅ iOS build completed successfully"

# Verify the expected outputs exist
if ls ios/build/Build/Products/**/*.ipa 1> /dev/null 2>&1; then
  echo "✅ IPA files generated successfully"
else
  echo "⚠️ Warning: Expected IPA files not found. Storage steps may fail."
fi
`
      },
      // Always attempt to store artifacts, even if build partially succeeded
      {
        name: 'Store iOS Build Artifacts',
        id: 'store-artifacts',
        if: 'always() && steps.ios-build.outcome != \'skipped\'',
        'continue-on-error': true,
        uses: 'actions/upload-artifact@v3',
        with: {
          name: 'ios-app-' + '${{ github.head_ref || github.ref_name }}',
          path: 'ios/build/Build/Products/**/*.ipa',
          'retention-days': '14',
        },
      },
    ];
  }
};

export default platformHelpers;