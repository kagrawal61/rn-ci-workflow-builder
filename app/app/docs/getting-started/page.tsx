import { Check, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default function GettingStartedPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="scroll-m-20 text-4xl font-bold tracking-tight">
          Getting Started
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Set up your first CI/CD workflow for your React Native app in minutes
        </p>
      </div>

      <div>
        <p className="leading-7">
          This step-by-step guide walks you through creating your first workflow
          using the web interface. Unlike the
          <Link
            href="/docs/core-concepts"
            className="text-primary hover:underline"
          >
            Core Concepts
          </Link>{' '}
          section that explains the underlying principles, or the{' '}
          <Link
            href="/docs/configuration"
            className="text-primary hover:underline"
          >
            Configuration Reference
          </Link>
          that details all available options, this guide focuses on practical,
          hands-on steps for new users.
        </p>
      </div>

      <div className="rounded-lg border-2 border-blue-200 bg-blue-50 p-6 dark:border-blue-800 dark:bg-blue-900/20">
        <h2 className="mb-4 text-lg font-semibold text-blue-800 dark:text-blue-200">
          ⏰ What You'll Save by Following This Guide
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">75-85%</div>
            <div className="text-sm text-blue-700 dark:text-blue-300">Setup Time Reduction</div>
            <div className="text-xs text-muted-foreground mt-1">1-2 hours vs 2-4 days</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">$1.2K-4.8K</div>
            <div className="text-sm text-blue-700 dark:text-blue-300">Cost Savings</div>
            <div className="text-xs text-muted-foreground mt-1">Per project (12-48 hours saved)</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">No YAML</div>
            <div className="text-sm text-blue-700 dark:text-blue-300">Learning Required</div>
            <div className="text-xs text-muted-foreground mt-1">Visual form interface</div>
          </div>
        </div>
        <div className="mt-4 text-center">
          <p className="text-xs text-blue-600 dark:text-blue-400">
            <em>Results vary based on team experience with CI/CD</em>
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <span className="text-sm font-medium">1</span>
            </div>
            <h2 className="text-xl font-semibold">Access the Web App</h2>
          </div>
          <div className="ml-10 space-y-4">
            <p className="text-muted-foreground">
              The React Native CI Workflow Builder is available as a web
              application that you can access directly in your browser:
            </p>
            <div className="flex flex-col items-center gap-6 rounded-lg border border-primary/20 bg-gradient-to-r from-primary/10 to-primary/5 p-6 md:flex-row">
              <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-card shadow-lg md:w-1/2">
                <div className="absolute inset-0 z-10 bg-gradient-to-br from-primary/10 to-transparent opacity-70"></div>
                <div className="absolute inset-0 z-20 flex items-center justify-center">
                  <div className="text-center">
                    <h3 className="mb-3 text-xl font-bold">
                      React Native CI Workflow Builder
                    </h3>
                    <Link
                      href="/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-primary-foreground shadow-md transition-colors hover:bg-primary/90"
                    >
                      Open Web App <ExternalLink className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
              <div className="w-full space-y-3 md:w-1/2">
                <h3 className="text-lg font-semibold">
                  Create CI/CD Workflows Visually
                </h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                    <span className="text-sm">
                      Intuitive form-based interface
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                    <span className="text-sm">Real-time YAML preview</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                    <span className="text-sm">Automatic secret detection</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                    <span className="text-sm">Workflow validation</span>
                  </li>
                </ul>
                <p className="mt-3 text-xs text-muted-foreground">
                  <span className="font-medium">Tip:</span> Bookmark the web app
                  for quick access whenever you need to create workflows.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <span className="text-sm font-medium">2</span>
            </div>
            <h2 className="text-xl font-semibold">Choose a workflow type</h2>
          </div>
          <div className="ml-10 space-y-4">
            <p className="text-muted-foreground">
              Decide which type of workflow you need for your project:
            </p>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border p-4 transition-colors hover:border-primary">
                <h3 className="font-semibold">Static Analysis Workflow</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Runs TypeScript checks, linting, formatting, and unit tests to
                  ensure code quality
                </p>
                <p className="mt-2 text-xs font-medium">
                  Recommended for: Daily development, PR validation
                </p>
              </div>

              <div className="rounded-lg border p-4 transition-colors hover:border-primary">
                <h3 className="font-semibold">Build Workflow</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Builds your app for Android and/or iOS and can distribute
                  artifacts to various storage options
                </p>
                <p className="mt-2 text-xs font-medium">
                  Recommended for: Testing builds, releases, distribution
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <span className="text-sm font-medium">3</span>
            </div>
            <h2 className="text-xl font-semibold">Configure Your Workflow</h2>
          </div>
          <div className="ml-10 space-y-4">
            <p className="text-muted-foreground">
              Use the web app's intuitive form interface to configure your
              workflow:
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border p-4">
                <h4 className="mb-2 text-sm font-semibold">
                  Basic Information
                </h4>
                <ul className="ml-4 list-disc space-y-1 text-sm">
                  <li>Select workflow type (Static Analysis or Build)</li>
                  <li>Enter custom workflow name</li>
                  <li>Choose Node.js version</li>
                  <li>Select package manager (npm or yarn)</li>
                </ul>
              </div>
              <div className="rounded-lg border p-4">
                <h4 className="mb-2 text-sm font-semibold">
                  Trigger Configuration
                </h4>
                <ul className="ml-4 list-disc space-y-1 text-sm">
                  <li>Select trigger events (push, pull request)</li>
                  <li>Specify target branches</li>
                  <li>Add path filters if needed</li>
                  <li>Enable manual workflow dispatch</li>
                </ul>
              </div>
            </div>
            <div className="rounded-lg border bg-muted/40 p-4">
              <h4 className="text-sm font-semibold">Real-time YAML Preview</h4>
              <p className="mt-1 text-sm">
                As you make changes in the form, the web app automatically
                updates the YAML preview on the right side of the screen,
                showing you exactly what will be generated.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <span className="text-sm font-medium">4</span>
            </div>
            <h2 className="text-xl font-semibold">Workflow-Specific Options</h2>
          </div>
          <div className="ml-10 space-y-4">
            <p className="text-muted-foreground">
              Based on your selected workflow type, configure additional
              options:
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border p-4">
                <h4 className="mb-2 text-sm font-semibold">
                  Static Analysis Options
                </h4>
                <ul className="ml-4 list-disc space-y-1 text-sm">
                  <li>Enable/disable TypeScript checks</li>
                  <li>Configure ESLint options</li>
                  <li>Set up Jest test settings</li>
                  <li>Add Prettier formatting checks</li>
                </ul>
              </div>
              <div className="rounded-lg border p-4">
                <h4 className="mb-2 text-sm font-semibold">Build Options</h4>
                <ul className="ml-4 list-disc space-y-1 text-sm">
                  <li>Select platform (Android, iOS, both)</li>
                  <li>Choose build variant (debug, release)</li>
                  <li>Configure artifact storage location</li>
                  <li>Set up build notifications</li>
                </ul>
              </div>
            </div>
            <div className="rounded-lg border bg-muted/40 p-4">
              <p className="text-sm">
                <span className="font-medium">Automatic Secret Detection:</span>{' '}
                The web app automatically detects and lists any required secrets
                based on your configuration choices, making it easy to set up
                your repository properly.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <span className="text-sm font-medium">5</span>
            </div>
            <h2 className="text-xl font-semibold">Generate and Download</h2>
          </div>
          <div className="ml-10 space-y-4">
            <p className="text-muted-foreground">
              Once you've configured your workflow, you can preview and download
              the generated YAML:
            </p>
            <div className="rounded-lg border p-4">
              <h4 className="mb-2 text-sm font-semibold">
                Preview and Download
              </h4>
              <ol className="ml-4 list-decimal space-y-2 text-sm">
                <li>Review the generated YAML in the preview panel</li>
                <li>Check the list of required secrets (if any)</li>
                <li>
                  Click the{' '}
                  <span className="rounded bg-muted px-2 py-0.5 font-mono text-xs">
                    Download YAML
                  </span>{' '}
                  button to save the workflow file
                </li>
                <li>
                  Save the file to your project's{' '}
                  <span className="font-mono text-xs">.github/workflows/</span>{' '}
                  directory
                </li>
              </ol>
            </div>
            <div className="rounded-lg border bg-muted/40 p-4">
              <p className="text-sm">
                <span className="font-medium">GitHub Integration:</span> After
                downloading, commit the workflow file to your GitHub repository.
                Once pushed, your workflow will run automatically based on the
                triggers you configured. You can view workflow runs in the
                "Actions" tab of your GitHub repository.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Continue Your Learning</h2>
        <ul className="space-y-2">
          <li className="flex items-start gap-2">
            <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
            <span>
              Understand the{' '}
              <Link
                href="/docs/core-concepts"
                className="text-primary hover:underline"
              >
                core concepts
              </Link>{' '}
              behind the workflow builder
            </span>
          </li>
          <li className="flex items-start gap-2">
            <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
            <span>
              Review available{' '}
              <Link
                href="/docs/workflow-presets"
                className="text-primary hover:underline"
              >
                workflow presets
              </Link>{' '}
              and their specific use cases
            </span>
          </li>
          <li className="flex items-start gap-2">
            <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
            <span>
              Learn about advanced{' '}
              <Link
                href="/docs/configuration"
                className="text-primary hover:underline"
              >
                configuration options
              </Link>{' '}
              for fine-tuning workflows
            </span>
          </li>
          <li className="flex items-start gap-2">
            <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
            <span>
              Explore{' '}
              <Link
                href="/docs/storage-options"
                className="text-primary hover:underline"
              >
                storage options
              </Link>{' '}
              for distributing your build artifacts
            </span>
          </li>
        </ul>
      </div>

      <div className="rounded-lg bg-muted p-5">
        <h3 className="mb-2 font-semibold">Having trouble?</h3>
        <p className="text-sm">
          If you encounter any issues setting up your workflow, refer to the
          configuration documentation or contact support.
        </p>
      </div>
    </div>
  );
}
