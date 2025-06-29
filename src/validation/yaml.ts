import * as yaml from 'js-yaml';

/**
 * Validates that the generated YAML is correctly structured and has no undefined values
 * @param yamlStr The YAML string to validate
 * @returns The same YAML string if valid
 * @throws Error if the YAML is invalid
 */
export function validateGeneratedYaml(yamlStr: string): string {
  try {
    // Try to parse the YAML to make sure it's valid
    const parsedYaml = yaml.load(yamlStr);
    
    // Perform additional validation on the parsed object
    validateNoUndefinedValues(parsedYaml);
    validateWorkflowStructure(parsedYaml);
    
    // If validation passes, return the original string
    return yamlStr;
  } catch (error) {
    throw new Error(`Invalid YAML generated: ${(error as Error).message}`);
  }
}

/**
 * Validates that the YAML object structure follows GitHub Actions schema
 * @param parsedYaml Parsed YAML object
 */
function validateWorkflowStructure(parsedYaml: any): void {
  // Check for required top-level fields
  if (!parsedYaml) {
    throw new Error('Generated workflow is empty');
  }
  
  if (typeof parsedYaml !== 'object') {
    throw new Error('Generated workflow is not a valid object');
  }
  
  // Detect if this is a Bitrise configuration or GitHub Actions workflow
  if (parsedYaml.format_version !== undefined) {
    // This is a Bitrise configuration
    validateBitriseStructure(parsedYaml);
  } else {
    // This is a GitHub Actions workflow
    validateGitHubActionsStructure(parsedYaml);
  }
}

/**
 * Validates GitHub Actions workflow structure
 * @param parsedYaml Parsed GitHub Actions workflow
 */
function validateGitHubActionsStructure(parsedYaml: any): void {
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
  Object.entries(parsedYaml.jobs).forEach(([jobId, job]: [string, any]) => {
    if (!job['runs-on']) {
      throw new Error(`GitHub Actions job "${jobId}" must specify a runs-on property`);
    }
    
    if (!job.steps || !Array.isArray(job.steps) || job.steps.length === 0) {
      throw new Error(`GitHub Actions job "${jobId}" must have at least one step`);
    }
  });
}

/**
 * Validates Bitrise configuration structure
 * @param parsedYaml Parsed Bitrise configuration
 */
function validateBitriseStructure(parsedYaml: any): void {
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
  Object.entries(parsedYaml.workflows).forEach(([workflowId, workflow]: [string, any]) => {
    if (!workflow.steps || !Array.isArray(workflow.steps)) {
      throw new Error(`Bitrise workflow "${workflowId}" must have steps array`);
    }
  });
}

/**
 * Validates that there are no undefined values in the YAML
 * @param obj Object to check for undefined values
 * @param path Current path for error reporting
 */
function validateNoUndefinedValues(obj: any, path: string = ''): void {
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