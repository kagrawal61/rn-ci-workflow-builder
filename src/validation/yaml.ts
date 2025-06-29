import * as yaml from 'js-yaml';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

const execAsync = promisify(exec);

/**
 * Detects the current operating system
 * @returns Operating system type
 */
function detectOS(): 'macos' | 'linux' | 'windows' | 'unknown' {
  const platform = os.platform();
  switch (platform) {
    case 'darwin':
      return 'macos';
    case 'linux':
      return 'linux';
    case 'win32':
      return 'windows';
    default:
      return 'unknown';
  }
}

/**
 * Checks if Bitrise CLI is installed
 * @returns Promise<boolean> - true if installed, false otherwise
 */
async function isBitriseCliInstalled(): Promise<boolean> {
  try {
    await execAsync('bitrise --version');
    return true;
  } catch {
    return false;
  }
}

/**
 * Attempts to install Bitrise CLI based on the operating system
 * @param autoInstall Whether to install automatically or just show instructions
 * @returns Promise that resolves if installation succeeds
 */
async function installBitriseCli(autoInstall: boolean = false): Promise<void> {
  const osType = detectOS();
  
  console.log('🔧 Bitrise CLI is not installed. Setting up Bitrise CLI...');

  switch (osType) {
    case 'macos':
      if (autoInstall) {
        console.log('📦 Installing Bitrise CLI via Homebrew...');
        try {
          // Check if Homebrew is installed
          await execAsync('which brew');
          await execAsync('brew install bitrise');
          console.log('✅ Bitrise CLI installed successfully via Homebrew!');
        } catch (brewError) {
          console.log('❌ Homebrew not found. Trying direct installation...');
          await installBitriseDirectly();
        }
      } else {
        console.log(`
📋 To install Bitrise CLI on macOS, run one of these commands:

Option 1 - Homebrew (recommended):
  brew install bitrise

Option 2 - Direct install:
  curl -fL https://github.com/bitrise-io/bitrise/releases/download/1.53.0/bitrise-$(uname -s)-$(uname -m) > /usr/local/bin/bitrise
  chmod +x /usr/local/bin/bitrise

Then run the validation command again.
`);
        throw new Error('Please install Bitrise CLI and try again');
      }
      break;

    case 'linux':
      if (autoInstall) {
        console.log('📦 Installing Bitrise CLI directly...');
        await installBitriseDirectly();
      } else {
        console.log(`
📋 To install Bitrise CLI on Linux, run:

  curl -fL https://github.com/bitrise-io/bitrise/releases/download/1.53.0/bitrise-$(uname -s)-$(uname -m) > /usr/local/bin/bitrise
  chmod +x /usr/local/bin/bitrise

Or download from: https://github.com/bitrise-io/bitrise/releases

Then run the validation command again.
`);
        throw new Error('Please install Bitrise CLI and try again');
      }
      break;

    case 'windows':
      console.log(`
📋 To install Bitrise CLI on Windows:

1. Download the Windows binary from: https://github.com/bitrise-io/bitrise/releases
2. Add the binary to your PATH
3. Run the validation command again

Or use Windows Subsystem for Linux (WSL) and follow Linux instructions.
`);
      throw new Error('Please install Bitrise CLI and try again');

    default:
      console.log(`
📋 To install Bitrise CLI on your system:

1. Visit: https://github.com/bitrise-io/bitrise/releases
2. Download the appropriate binary for your system
3. Add it to your PATH
4. Run the validation command again
`);
      throw new Error('Please install Bitrise CLI and try again');
  }
}

/**
 * Installs Bitrise CLI directly from GitHub releases
 */
async function installBitriseDirectly(): Promise<void> {
  try {
    const osType = detectOS();
    const arch = os.arch();
    
    // Map architecture names to Bitrise release naming
    const archMap: Record<string, string> = {
      'x64': 'x86_64',
      'arm64': 'arm64',
      'arm': 'arm64'
    };
    
    const mappedArch = archMap[arch] || arch;
    const osName = osType === 'macos' ? 'Darwin' : 'Linux';
    
    const downloadUrl = `https://github.com/bitrise-io/bitrise/releases/download/1.53.0/bitrise-${osName}-${mappedArch}`;
    const installPath = '/usr/local/bin/bitrise';
    
    console.log(`📥 Downloading Bitrise CLI from: ${downloadUrl}`);
    
    // Download and install
    await execAsync(`curl -fL "${downloadUrl}" -o "${installPath}"`);
    await execAsync(`chmod +x "${installPath}"`);
    
    // Verify installation
    await execAsync('bitrise --version');
    console.log('✅ Bitrise CLI installed successfully!');
    
  } catch (error) {
    console.error('❌ Failed to install Bitrise CLI automatically');
    throw new Error(`Installation failed: ${(error as Error).message}. Please install manually from: https://github.com/bitrise-io/bitrise/releases`);
  }
}

/**
 * Validates that the generated YAML is correctly structured and has no undefined values
 * @param yamlStr The YAML string to validate
 * @param enableBitriseCliValidation Whether to run Bitrise CLI validation (only works in CLI context, not browser)
 * @returns The same YAML string if valid (or Promise<string> if async validation is enabled)
 * @throws Error if the YAML is invalid
 */
export function validateGeneratedYaml(yamlStr: string, enableBitriseCliValidation: boolean = false): string | Promise<string> {
  try {
    // Try to parse the YAML to make sure it's valid
    const parsedYaml = yaml.load(yamlStr);
    
    // Perform additional validation on the parsed object
    validateNoUndefinedValues(parsedYaml);
    validateWorkflowStructure(parsedYaml);
    
    // If Bitrise CLI validation is enabled and this is a Bitrise config, validate with Bitrise CLI
    if (enableBitriseCliValidation && parsedYaml && typeof parsedYaml === 'object' && 'format_version' in parsedYaml) {
      // Return async validation for Bitrise configs when CLI validation is enabled
      return validateBitriseYamlAndReturn(yamlStr);
    }
    
    // If validation passes, return the original string (sync)
    return yamlStr;
  } catch (error) {
    throw new Error(`Invalid YAML generated: ${(error as Error).message}`);
  }
}

/**
 * Helper function to validate Bitrise YAML content and return the original string
 * @param yamlStr The YAML string to validate and return
 * @returns Promise<string> The original YAML string if validation passes
 */
async function validateBitriseYamlAndReturn(yamlStr: string): Promise<string> {
  await validateBitriseYamlContent(yamlStr);
  return yamlStr;
}

/**
 * Validates a Bitrise YAML file using the Bitrise CLI validate command
 * @param yamlFilePath Path to the Bitrise YAML file to validate
 * @param autoInstall Whether to automatically install Bitrise CLI if missing (defaults to true)
 * @returns Promise that resolves if validation passes
 * @throws Error if validation fails or Bitrise CLI is not available
 */
export async function validateWithBitriseCli(yamlFilePath: string, autoInstall: boolean = true): Promise<void> {
  try {
    // Check if Bitrise CLI is installed
    const isInstalled = await isBitriseCliInstalled();
    
    if (!isInstalled) {
      await installBitriseCli(autoInstall);
      
      // Verify installation was successful
      const isNowInstalled = await isBitriseCliInstalled();
      if (!isNowInstalled) {
        throw new Error('Bitrise CLI installation verification failed');
      }
    }

    // Run bitrise validate command
    const { stdout } = await execAsync(`bitrise validate --config ${yamlFilePath}`);
    
    // Bitrise validate command returns exit code 0 for valid configs
    // If we reach here, validation passed
    console.log('✅ Bitrise validation passed');
    if (stdout.trim()) {
      console.log('Bitrise validation output:', stdout.trim());
    }
  } catch (error: unknown) {
    // Parse Bitrise validation error for better error messages
    let errorMessage = 'Bitrise validation failed';
    
    if (error && typeof error === 'object' && 'stderr' in error) {
      // Extract meaningful error from stderr
      const stderr = String((error as { stderr: unknown }).stderr);
      if (stderr.includes('invalid workflow')) {
        errorMessage = `Bitrise validation failed: Invalid workflow configuration\n${stderr}`;
      } else if (stderr.includes('required')) {
        errorMessage = `Bitrise validation failed: Missing required fields\n${stderr}`;
      } else {
        errorMessage = `Bitrise validation failed: ${stderr}`;
      }
    } else if (error && typeof error === 'object' && 'message' in error) {
      const message = String((error as { message: unknown }).message);
      if (!message.includes('Please install')) {
        errorMessage = `Bitrise validation failed: ${message}`;
      } else {
        // Re-throw installation-related errors as-is
        throw error;
      }
    }
    
    throw new Error(errorMessage);
  }
}

/**
 * Convenience function to validate Bitrise YAML content using CLI
 * @param yamlContent The Bitrise YAML content as string
 * @param tempFileName Optional temp file name (defaults to 'temp-bitrise.yml')
 * @param autoInstall Whether to automatically install Bitrise CLI if missing (defaults to true)
 * @returns Promise that resolves if validation passes
 */
export async function validateBitriseYamlContent(yamlContent: string, tempFileName: string = 'temp-bitrise.yml', autoInstall: boolean = true): Promise<void> {
  // Create a temporary file with the YAML content
  const tempFilePath = path.join(os.tmpdir(), tempFileName);
  
  try {
    fs.writeFileSync(tempFilePath, yamlContent, 'utf8');
    await validateWithBitriseCli(tempFilePath, autoInstall);
  } finally {
    // Clean up temporary file
    try {
      fs.unlinkSync(tempFilePath);
    } catch (cleanupError) {
      // Ignore cleanup errors
    }
  }
}

/**
 * Validates that the YAML object structure follows GitHub Actions schema
 * @param parsedYaml Parsed YAML object
 */
function validateWorkflowStructure(parsedYaml: unknown): void {
  // Check for required top-level fields
  if (!parsedYaml) {
    throw new Error('Generated workflow is empty');
  }
  
  if (typeof parsedYaml !== 'object') {
    throw new Error('Generated workflow is not a valid object');
  }
  
  // Detect if this is a Bitrise configuration or GitHub Actions workflow
  if (typeof parsedYaml === 'object' && parsedYaml && 'format_version' in parsedYaml) {
    // This is a Bitrise configuration
    validateBitriseStructure(parsedYaml as Record<string, unknown>);
  } else if (typeof parsedYaml === 'object' && parsedYaml) {
    // This is a GitHub Actions workflow
    validateGitHubActionsStructure(parsedYaml as Record<string, unknown>);
  }
}

/**
 * Validates GitHub Actions workflow structure
 * @param parsedYaml Parsed GitHub Actions workflow  
 */
function validateGitHubActionsStructure(parsedYaml: Record<string, unknown>): void {
  if (!parsedYaml.name) {
    throw new Error('GitHub Actions workflow must have a name');
  }
  
  if (!parsedYaml.on) {
    throw new Error('GitHub Actions workflow must have triggers defined in the "on" field');
  }
  
  if (!parsedYaml.jobs || typeof parsedYaml.jobs !== 'object' || Object.keys(parsedYaml.jobs).length === 0) {
    throw new Error('GitHub Actions workflow must have at least one job');
  }
  
  // Validate each job
  Object.entries(parsedYaml.jobs as Record<string, unknown>).forEach(([jobId, job]) => {
    if (!job || typeof job !== 'object' || !('runs-on' in job)) {
      throw new Error(`GitHub Actions job "${jobId}" must specify a runs-on property`);
    }
    
    if (!('steps' in job) || !Array.isArray((job as { steps: unknown }).steps) || (job as { steps: unknown[] }).steps.length === 0) {
      throw new Error(`GitHub Actions job "${jobId}" must have at least one step`);
    }
  });
}

/**
 * Validates Bitrise configuration structure
 * @param parsedYaml Parsed Bitrise configuration
 */
function validateBitriseStructure(parsedYaml: Record<string, unknown>): void {
  if (!parsedYaml.format_version) {
    throw new Error('Bitrise configuration must have a format_version');
  }
  
  if (typeof parsedYaml.format_version !== 'number') {
    throw new Error('Bitrise format_version must be a number');
  }
  
  if (!parsedYaml.workflows || typeof parsedYaml.workflows !== 'object' || Object.keys(parsedYaml.workflows).length === 0) {
    throw new Error('Bitrise configuration must have at least one workflow');
  }
  
  // Validate each workflow
  Object.entries(parsedYaml.workflows as Record<string, unknown>).forEach(([workflowId, workflow]) => {
    if (!workflow || typeof workflow !== 'object' || !('steps' in workflow) || !Array.isArray((workflow as { steps: unknown }).steps)) {
      throw new Error(`Bitrise workflow "${workflowId}" must have steps array`);
    }
  });
}

/**
 * Validates that there are no undefined values in the YAML
 * @param obj Object to check for undefined values
 * @param path Current path for error reporting
 */
function validateNoUndefinedValues(obj: unknown, path: string = ''): void {
  if (obj === undefined) {
    throw new Error(`Found undefined value at ${path || 'root'}`);
  }
  
  if (obj === null) {
    return;
  }
  
  if (typeof obj === 'object') {
    // Check for undefined values in objects and arrays
    const isArray = Array.isArray(obj);
    
    Object.entries(obj).forEach(([key, value]) => {
      const currentPath = path ? (isArray ? `${path}[${key}]` : `${path}.${key}`) : key;
      validateNoUndefinedValues(value, currentPath);
    });
    
    // For objects, also check if any property explicitly contains the string 'undefined'
    // This can happen when string concatenation includes undefined values
    if (!isArray) {
      Object.entries(obj).forEach(([key, value]) => {
        if (typeof value === 'string' && value.includes('undefined')) {
          const currentPath = path ? `${path}.${key}` : key;
          throw new Error(`Possible undefined variable used in string at ${currentPath}`);
        }
      });
    }
  } else if (typeof obj === 'string' && obj.includes('undefined')) {
    // Also check string values that might contain the word 'undefined' from concatenation
    throw new Error(`Possible undefined variable used in string at ${path || 'root'}`);
  }
}