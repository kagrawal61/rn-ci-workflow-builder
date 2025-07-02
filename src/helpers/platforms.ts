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
    _packageManager: PackageManager, // Not used after switch to npx, kept for API compatibility
    _buildParams: string, // Not used after switch to official CLI, kept for API compatibility
    build: BuildOptions
  ): GitHubStep[] {
    return [
      ...setupSteps,
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
`,
      },
      // Setup Java with proper LTS version
      {
        name: 'Setup Java',
        uses: 'actions/setup-java@v3',
        with: {
          distribution: 'temurin', // Eclipse Temurin is the recommended distribution
          'java-version': '17', // Latest LTS version compatible with Android
          cache: 'gradle',
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

# Using direct Gradle commands for more reliable builds
${(() => {
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
cd android
./gradlew ${apkTask} || {
  echo "❌ Android APK build failed"
  echo "::error::Android APK build failed. Check logs for details."
  exit 1
}
cd ..


# Then generate AAB
echo "Using Gradle task: ${aabTask} for ${variant} build with AAB output format"
cd android
./gradlew ${aabTask} || {
  echo "❌ Android AAB build failed"
  echo "::error::Android AAB build failed. Check logs for details."
  exit 1
}
cd ..
`;
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

# Using direct Gradle command
cd android
./gradlew ${task} || {
  echo "❌ Android build failed"
  echo "::error::Android build failed. Check logs for details."
  exit 1
}
cd ..
`;
  }
})()}

echo "✅ Android build completed successfully"

# Verify the expected outputs based on output type
${(() => {
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
})()}
`,
      },
      // Artifact storage is handled by the storage helper based on the storage configuration
    ];
  },

  /**
   * Creates iOS-specific build steps with improved error handling
   */
  createIOSBuildSteps(
    setupSteps: GitHubStep[],
    _packageManager: PackageManager, // Not used after switch to npx, kept for API compatibility
    _buildParams: string, // Not used after switch to official CLI, kept for API compatibility
    build: BuildOptions // Adding build options parameter to access variant
  ): GitHubStep[] {
    return [
      ...setupSteps,
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
`,
      },
      // Setup Ruby with proper version for CocoaPods
      {
        name: 'Setup Ruby/CocoaPods',
        uses: 'ruby/setup-ruby@v1',
        with: {
          'ruby-version': '3.0', // Stable Ruby version for CocoaPods
          'bundler-cache': 'true', // Enable bundler cache
          'working-directory': 'ios', // Look for Gemfile in iOS directory
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
`,
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
echo "Building iOS app using direct Xcode commands..."

# Determine the configuration based on variant
CONFIG=$(echo "${build.variant}" | tr '[:upper:]' '[:lower:]')
if [ "$CONFIG" == "debug" ]; then
  CONFIGURATION="Debug"
else
  CONFIGURATION="Release"
fi

echo "Using Xcode build with configuration: $CONFIGURATION"

# Extract project name from xcworkspace directory
WORKSPACE_PATH=$(find ios -name "*.xcworkspace" -type d | head -n 1)
if [ -z "$WORKSPACE_PATH" ]; then
  echo "❌ No .xcworkspace found in ios directory"
  exit 1
fi

PROJECT_NAME=$(basename "$WORKSPACE_PATH" .xcworkspace)
echo "Detected project: $PROJECT_NAME"

# Using direct Xcode command for more reliable builds
xcodebuild \
  -workspace "ios/$PROJECT_NAME.xcworkspace" \
  -scheme "$PROJECT_NAME" \
  -configuration "$CONFIGURATION" \
  -derivedDataPath ios/build \
  -destination 'generic/platform=iOS' \
  -archivePath "ios/build/$PROJECT_NAME.xcarchive" \
  archive || {
    echo "❌ iOS build failed"
    echo "::error::Xcode build failed. Check logs for details."
    exit 1
  }

# Export IPA for distribution
xcodebuild \
  -exportArchive \
  -archivePath "ios/build/$PROJECT_NAME.xcarchive" \
  -exportPath "ios/build/output" \
  -exportOptionsPlist "ios/ExportOptions.plist" || {
    echo "❌ iOS export failed"
    echo "::warning::Xcode export failed. This might be due to missing ExportOptions.plist file."
    
    # Create a basic ExportOptions.plist if it doesn't exist
    if [ ! -f "ios/ExportOptions.plist" ]; then
      echo "Creating default ExportOptions.plist file..."
      cat > ios/ExportOptions.plist << EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>method</key>
    <string>$([ "$CONFIG" == "debug" ] && echo "development" || echo "app-store")</string>
    <key>teamID</key>
    <string>TEAM_ID</string>
</dict>
</plist>
EOF
      
      # Try export again
      xcodebuild \
        -exportArchive \
        -archivePath "ios/build/$PROJECT_NAME.xcarchive" \
        -exportPath "ios/build/output" \
        -exportOptionsPlist "ios/ExportOptions.plist" || {
          echo "❌ iOS export failed again"
          echo "::error::Xcode export failed even with default ExportOptions.plist. Check logs for details."
          exit 1
        }
    else
      echo "ExportOptions.plist exists but export failed. Check the file format and content."
      exit 1
    fi
  }

echo "✅ iOS build completed successfully"

# Verify the expected outputs exist
if ls ios/build/output/*.ipa 1> /dev/null 2>&1; then
  echo "✅ IPA files generated successfully"
else
  echo "⚠️ Warning: Expected IPA files not found. Storage steps may fail."
fi
`,
      },
      // Artifact storage is handled by the storage helper based on the storage configuration
    ];
  },
};

export default platformHelpers;
