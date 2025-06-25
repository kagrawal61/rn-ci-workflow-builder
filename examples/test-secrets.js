#!/usr/bin/env node
const { generateSecretsSummary, getContextualSecrets } = require('../dist/helpers/secretsManager');

// Sample build options to test secret management
const buildOptions = {
  platform: 'android',
  flavor: 'develop',
  variant: 'debug',
  storage: 'firebase',  // firebase requires secrets
  notification: 'slack', // slack requires secrets
  includeHealthCheck: true
};

console.log('Testing contextual secret detection...\n');

// Get contextual secrets
const secrets = getContextualSecrets(buildOptions);
console.log('Detected required secrets:');
console.log(JSON.stringify(secrets, null, 2));

// Generate secrets summary
console.log('\nSecret summary:');
console.log(generateSecretsSummary(buildOptions));

console.log('\nTesting different configurations...');

// Test another configuration
const s3Config = {
  ...buildOptions,
  storage: 's3',
  notification: 'pr-comment'
};

console.log('\nS3 storage with PR comments:');
console.log(generateSecretsSummary(s3Config));

// Test another platform
const iosConfig = {
  ...buildOptions,
  platform: 'ios'
};

console.log('\nFirebase with iOS:');
console.log(generateSecretsSummary(iosConfig));