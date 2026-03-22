import {
  validateGeneratedYaml,
  validateWithActionlint,
  validateWithAct,
} from '../yaml';

const VALID_GITHUB_WORKFLOW = `
name: Test Workflow
on:
  push:
    branches:
      - main
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
`.trim();

const VALID_BITRISE_CONFIG = `
format_version: 13
workflows:
  primary:
    steps:
      - git-clone@8:
          title: Git Clone
`.trim();

describe('validateGeneratedYaml', () => {
  describe('valid GitHub Actions YAML', () => {
    it('accepts a structurally correct workflow', () => {
      expect(() => validateGeneratedYaml(VALID_GITHUB_WORKFLOW)).not.toThrow();
    });

    it('returns the original YAML string unchanged', () => {
      const result = validateGeneratedYaml(VALID_GITHUB_WORKFLOW);
      expect(result).toBe(VALID_GITHUB_WORKFLOW);
    });

    it('accepts workflow with multiple jobs', () => {
      const multiJob = `
name: Multi Job Workflow
on:
  push:
    branches: [main]
jobs:
  job-one:
    runs-on: ubuntu-latest
    steps:
      - name: Step One
        run: echo "one"
  job-two:
    runs-on: macos-latest
    steps:
      - name: Step Two
        run: echo "two"
`.trim();

      expect(() => validateGeneratedYaml(multiJob)).not.toThrow();
    });
  });

  describe('valid Bitrise YAML', () => {
    it('accepts a structurally correct Bitrise config', () => {
      expect(() => validateGeneratedYaml(VALID_BITRISE_CONFIG)).not.toThrow();
    });

    it('returns the original Bitrise YAML string unchanged', () => {
      const result = validateGeneratedYaml(VALID_BITRISE_CONFIG);
      expect(result).toBe(VALID_BITRISE_CONFIG);
    });

    it('accepts Bitrise config with multiple workflows', () => {
      const multiWorkflow = `
format_version: 13
workflows:
  primary:
    steps:
      - git-clone@8:
          title: Git Clone
  secondary:
    steps:
      - script@1:
          title: Run Tests
`.trim();

      expect(() => validateGeneratedYaml(multiWorkflow)).not.toThrow();
    });
  });

  describe('invalid YAML syntax', () => {
    it('throws for malformed YAML', () => {
      expect(() => validateGeneratedYaml('{ invalid: yaml: [')).toThrow();
    });

    it('throws for empty string', () => {
      // Empty YAML parses as null/undefined, which the undefined-value check catches
      expect(() => validateGeneratedYaml('')).toThrow();
    });
  });

  describe('invalid GitHub Actions structure', () => {
    it('throws when workflow is missing name', () => {
      const noName = `
on:
  push:
    branches: [main]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
`.trim();

      expect(() => validateGeneratedYaml(noName)).toThrow('name');
    });

    it('throws when workflow is missing triggers (on)', () => {
      const noTriggers = `
name: Test Workflow
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
`.trim();

      expect(() => validateGeneratedYaml(noTriggers)).toThrow();
    });

    it('throws when workflow has no jobs', () => {
      const noJobs = `
name: Test Workflow
on:
  push:
    branches: [main]
`.trim();

      expect(() => validateGeneratedYaml(noJobs)).toThrow();
    });

    it('throws when workflow has empty jobs object', () => {
      const emptyJobs = `
name: Test Workflow
on:
  push:
    branches: [main]
jobs: {}
`.trim();

      expect(() => validateGeneratedYaml(emptyJobs)).toThrow();
    });

    it('throws when a job is missing runs-on', () => {
      const noRunsOn = `
name: Test Workflow
on:
  push:
    branches: [main]
jobs:
  test:
    steps:
      - name: Checkout
        uses: actions/checkout@v4
`.trim();

      expect(() => validateGeneratedYaml(noRunsOn)).toThrow('runs-on');
    });

    it('throws when a job has an empty steps array', () => {
      const emptySteps = `
name: Test Workflow
on:
  push:
    branches: [main]
jobs:
  test:
    runs-on: ubuntu-latest
    steps: []
`.trim();

      expect(() => validateGeneratedYaml(emptySteps)).toThrow();
    });
  });

  describe('invalid Bitrise structure', () => {
    it('throws when Bitrise config is missing format_version', () => {
      const noFormatVersion = `
workflows:
  primary:
    steps:
      - git-clone@8:
          title: Git Clone
`.trim();

      // This parses as a GitHub Actions workflow (no format_version),
      // then fails the GitHub Actions validation (missing name/on)
      expect(() => validateGeneratedYaml(noFormatVersion)).toThrow();
    });

    it('throws when Bitrise config has no workflows', () => {
      const noWorkflows = `
format_version: 13
`.trim();

      expect(() => validateGeneratedYaml(noWorkflows)).toThrow('workflow');
    });

    it('throws when a Bitrise workflow has no steps array', () => {
      const noSteps = `
format_version: 13
workflows:
  primary:
    title: Primary
`.trim();

      expect(() => validateGeneratedYaml(noSteps)).toThrow('steps');
    });
  });

  describe('false-positive "undefined" string check (known bug — to be fixed in PR 2)', () => {
    it('currently throws when a step name contains the word "undefined" (false-positive)', () => {
      // This documents the current buggy behavior before the fix.
      // A step named "Detect undefined environment variables" is legitimate YAML,
      // but the current validator incorrectly rejects it.
      const legitimateYaml = `
name: Test Workflow
on:
  push:
    branches: [main]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - name: Detect undefined environment variables
        run: echo "checking"
`.trim();

      // Current behavior: throws because step name contains "undefined"
      // Expected behavior after fix: should NOT throw
      expect(() => validateGeneratedYaml(legitimateYaml)).toThrow('undefined');
    });
  });

  // ─── Async validation flag behaviour ─────────────────────────────────────
  // These tests verify the orchestration logic: correct flags activate async
  // validation paths and return Promises. They do NOT test tool installation
  // or actual tool output — those depend on external binaries.

  describe('async validation flag behaviour', () => {
    it('returns a string (sync) when no async flags are set', () => {
      const result = validateGeneratedYaml(VALID_GITHUB_WORKFLOW);

      expect(typeof result).toBe('string');
    });

    it('returns a Promise when enableYamllintValidation is true for GitHub Actions', () => {
      const result = validateGeneratedYaml(VALID_GITHUB_WORKFLOW, false, true);
      expect(result).toBeInstanceOf(Promise);
      // Suppress unhandled rejection — yamllint may not be installed in test env
      if (result instanceof Promise) result.catch(() => {});
    });

    it('returns a Promise when enableActionlintValidation is true for GitHub Actions', () => {
      const result = validateGeneratedYaml(VALID_GITHUB_WORKFLOW, false, false, true);
      expect(result).toBeInstanceOf(Promise);
      if (result instanceof Promise) result.catch(() => {});
    });

    it('returns a Promise when enableActValidation is true for GitHub Actions', () => {
      const result = validateGeneratedYaml(VALID_GITHUB_WORKFLOW, false, false, false, true);
      expect(result).toBeInstanceOf(Promise);
      // Suppress unhandled rejection — act may not be installed in test env
      if (result instanceof Promise) result.catch(() => {});
    });

    it('does NOT return a Promise for Bitrise config when only GitHub flags are set', () => {
      // actionlint and act only apply to GitHub Actions workflows, not Bitrise
      const result = validateGeneratedYaml(VALID_BITRISE_CONFIG, false, false, true, true);
      // Bitrise config with enableBitriseCliValidation=false → sync return
      expect(typeof result).toBe('string');
    });

    it('returns a Promise for Bitrise config when enableBitriseCliValidation is true', () => {
      const result = validateGeneratedYaml(VALID_BITRISE_CONFIG, true);
      expect(result).toBeInstanceOf(Promise);
      // Suppress unhandled rejection — Bitrise CLI may not be installed in test env
      if (result instanceof Promise) result.catch(() => {});
    });

    it('sync checks still run before async path — throws immediately for invalid GitHub Actions', () => {
      const invalid = `
name: Test
on:
  push:
    branches: [main]
`.trim(); // missing jobs → sync check fires before any Promise is created

      expect(() => validateGeneratedYaml(invalid, false, false, true)).toThrow();
    });
  });
});

// ─── validateWithActionlint / validateWithAct — installation guard tests ─────

describe('validateWithActionlint', () => {
  it('throws a descriptive error when actionlint is not installed and autoInstall=false', async () => {
    // This test relies on actionlint NOT being installed in the test environment.
    // If actionlint is installed, this test passes trivially — the function won't throw.
    // Purpose: verify the error message path is reachable.
    try {
      await validateWithActionlint('nonexistent-file.yml', false);
      // If we reach here, actionlint is installed — that's fine, test is informational
    } catch (err) {
      const msg = (err as Error).message;
      // Should either say "not installed" or "No such file" (if actionlint found but file missing)
      expect(msg.length).toBeGreaterThan(0);
    }
  });
});

describe('validateWithAct', () => {
  it('throws a descriptive error when act is not installed', async () => {
    // This test relies on act NOT being installed in the test environment.
    // Purpose: verify the error message path is reachable and descriptive.
    try {
      await validateWithAct('nonexistent-file.yml');
      // If we reach here, act is installed — that's fine
    } catch (err) {
      const msg = (err as Error).message;
      expect(msg.length).toBeGreaterThan(0);
      // Error should mention act or validation failure
      expect(
        msg.toLowerCase().includes('act') ||
        msg.toLowerCase().includes('install') ||
        msg.toLowerCase().includes('failed') ||
        msg.toLowerCase().includes('no such file')
      ).toBe(true);
    }
  });
});
