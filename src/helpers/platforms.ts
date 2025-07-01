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
  echo "Make sure you're running this workflow from the root"
  echo "of a React Native project"
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
echo "🚀 Starting Android build for ${build.variant}..."

# Check for .env file and use it if exists
if [ -f ".env" ]; then
  echo "✅ Found .env file, will be used for the build"
else
  echo "⚠️ No .env file found in project root"
fi

# Run the build with error capture
echo "Building Android app using official React Native CLI..."

# Using official React Native CLI with appropriate task based on variant and output type
${
  (() => {
    // Determine the appropriate Gradle task based on variant and output type
    const variant = build.variant;
    const outputType = build.androidOutputType || 'apk'; // Default to APK if not specified
    
    if (outputType === 'both') {
      // For both APK and AAB, run both tasks
      const apkTask = variant === 'debug' ? 'assembleDebug' : 'assembleRelease';
      const aabTask = variant === 'debug' ? 'bundleDebug' : 'bundleRelease';
      
      return `echo "Generating both APK and AAB formats for ${variant} build"

# First generate APK
echo "Using Gradle task: ${apkTask} for ${variant} build with APK output format"
npx react-native build-android --tasks=${apkTask} || {
  echo "❌ Android APK build failed"
  echo "::error::Android APK build failed. Check logs for details."
  exit 1
}

# Then generate AAB
echo "Using Gradle task: ${aabTask} for ${variant} build with AAB output format"
npx react-native build-android --tasks=${aabTask} || {
  echo "❌ Android AAB build failed"
  echo "::error::Android AAB build failed. Check logs for details."
  exit 1
}`;
    } else {
      // For single output type (APK or AAB)
      let task = '';
      if (outputType === 'apk') {
        task = variant === 'debug' ? 'assembleDebug' : 'assembleRelease';
      } else {
        // For AAB (Android App Bundle)
        task = variant === 'debug' ? 'bundleDebug' : 'bundleRelease';
      }
      
      return `echo "Using Gradle task: ${task} for ${variant} build with ${outputType} output format"

# Using React Native CLI with --tasks flag
npx react-native build-android --tasks=${task} || {
  echo "❌ Android build failed"
  echo "::error::Android build failed. Check logs for details."
  exit 1
}`;
    }
  })()
}

echo "✅ Android build completed successfully"

# Verify the expected outputs based on output type
${
  (() => {
    const outputType = build.androidOutputType || 'apk';
    
    if (outputType === 'both') {
      return `# Check for both APK and AAB files
if ls android/app/build/outputs/apk/**/*.apk 1> /dev/null 2>&1; then
  echo "✅ APK files generated successfully"
else
  echo "⚠️ Warning: Expected APK files not found. Storage steps may fail."
fi

if ls android/app/build/outputs/bundle/**/*.aab 1> /dev/null 2>&1; then
  echo "✅ AAB files generated successfully"
else
  echo "⚠️ Warning: Expected AAB files not found. Storage steps may fail."
fi`;
    } else if (outputType === 'apk') {
      return `if ls android/app/build/outputs/apk/**/*.apk 1> /dev/null 2>&1; then
  echo "✅ APK files generated successfully"
else
  echo "⚠️ Warning: Expected APK files not found. Storage steps may fail."
fi`;
    } else {
      return `if ls android/app/build/outputs/bundle/**/*.aab 1> /dev/null 2>&1; then
  echo "✅ AAB files generated successfully"
else
  echo "⚠️ Warning: Expected AAB files not found. Storage steps may fail."
fi`;
    }
  })()
}
`
      },
      // Artifact storage is handled by the storage helper based on the storage configuration
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
  echo "Make sure you're running this workflow from the root"
  echo "of a React Native project"
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
  echo "::error::CocoaPods installation failed."
  echo "Check for valid Podfile and Pod specs."
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
echo "🚀 Starting iOS build for ${build.variant}..."

# Check for .env file and use it if exists
if [ -f ".env" ]; then
  echo "✅ Found .env file, will be used for the build"
else
  echo "⚠️ No .env file found in project root"
fi

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
      // Artifact storage is handled by the storage helper based on the storage configuration
    ];
  }
};

export default platformHelpers;